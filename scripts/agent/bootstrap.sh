#!/usr/bin/env bash
#
# AIKAGAN — One-command bootstrap
#
# What it does (in order):
#   1. Creates / activates a venv at .venv
#   2. Installs scripts/agent/requirements.txt
#   3. Runs the handoff verifier in --quick mode
#   4. If MAKE_API_KEY + MAKE_TEAM_ID are set, provisions both Make.com scenarios
#   5. Runs the Marketing Commander in --dry-run to make sure Gemini & schema work
#
# Idempotent — safe to re-run after editing .env.fulfillment.
#
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT_DIR"

echo "==> AIKAGAN bootstrap from $ROOT_DIR"

# Load fulfillment env automatically so CLI runs behave like CI/workflows.
if [ -f ".env.fulfillment" ]; then
  set -a
  # shellcheck disable=SC1091
  source .env.fulfillment
  set +a
fi

# ---------------------------------------------------------------------------
# 1) Python + venv
# ---------------------------------------------------------------------------
if [ ! -d ".venv" ]; then
  echo "==> Creating venv at .venv"
  python3 -m venv .venv
fi

# shellcheck disable=SC1091
source .venv/bin/activate

# ---------------------------------------------------------------------------
# 2) Dependencies
# ---------------------------------------------------------------------------
echo "==> Installing dependencies"
python -m pip install --upgrade pip > /dev/null
pip install -r scripts/agent/requirements.txt pyyaml

# ---------------------------------------------------------------------------
# 3) Pre-flight verifier (quick mode — no network)
# ---------------------------------------------------------------------------
echo "==> Pre-flight (offline checks)"
set +e
python scripts/agent/verify_handoff.py --quick
preflight_status=$?
set -e
if [ "$preflight_status" -eq 1 ]; then
  echo "❌ Pre-flight failed. Fix the FAIL lines above before continuing."
  exit 1
fi

# ---------------------------------------------------------------------------
# 4) Auto-provision Make.com scenarios if credentials are present
# ---------------------------------------------------------------------------
if [ -n "${MAKE_API_KEY:-}" ] && [ -n "${MAKE_TEAM_ID:-}" ]; then
  echo "==> Provisioning Make.com scenarios"
  python scripts/agent/provision_make.py --activate || {
    echo "⚠️  provision_make.py exited non-zero. You can re-run it after fixing the"
    echo "    OAuth connections inside Make.com (X, LinkedIn, Gmail, etc.)."
  }
else
  echo "==> Skipping Make.com auto-provision (MAKE_API_KEY / MAKE_TEAM_ID not set)"
  echo "    Import the blueprints manually instead:"
  echo "      scripts/agent/make_blueprints/omnichannel-router.blueprint.json"
  echo "      scripts/agent/make_blueprints/customer-success-router.blueprint.json"
fi

# If provision_make rotated webhook URLs, refresh exported env before later checks.
if [ -f ".env.fulfillment" ]; then
  set -a
  # shellcheck disable=SC1091
  source .env.fulfillment
  set +a
fi

# ---------------------------------------------------------------------------
# 5) Marketing Commander dry-run (catches Gemini / schema problems early)
# ---------------------------------------------------------------------------
echo "==> Marketing Commander dry-run"
python scripts/agent/omnichannel_publisher_agent.py --dry-run || {
  echo "⚠️  Marketing Commander dry-run failed. Most likely cause: GEMINI_API_KEY"
  echo "    missing or expired. Set it in .env.fulfillment and re-run bootstrap."
  exit 1
}

# ---------------------------------------------------------------------------
# 6) Full verifier with network checks
# ---------------------------------------------------------------------------
echo "==> Full verifier (network checks)"
set +e
python scripts/agent/verify_handoff.py
final_status=$?
set -e

case "$final_status" in
  0) echo "✅ AIKAGAN agency is fully wired. Cron will take it from here." ;;
  2) echo "⚠️  Bootstrap finished with warnings — review WARN lines above." ;;
  *) echo "❌ Bootstrap finished with failures — review FAIL lines above." ; exit "$final_status" ;;
esac
