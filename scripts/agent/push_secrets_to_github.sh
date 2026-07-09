#!/usr/bin/env bash
#
# AIKAGAN — Push .env.fulfillment values into GitHub Actions secrets + vars.
#
# Requires:
#   - gh CLI installed and authenticated (`gh auth login`)
#   - You must be in a git repo connected to a GitHub remote
#
# What it does:
#   - Anything that looks like a key/token/URL → repo SECRET
#   - Everything else (URLs, channel lists, day counters) → repo VARIABLE
#   - Skips placeholder values ("YOUR_*_HERE")
#
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
ENV_FILE="${ROOT_DIR}/.env.fulfillment"

if ! command -v gh >/dev/null 2>&1; then
  echo "❌ gh CLI not installed. Install it from https://cli.github.com/"
  exit 1
fi

if [ ! -f "$ENV_FILE" ]; then
  echo "❌ Cannot find $ENV_FILE"
  exit 1
fi

REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner)
echo "==> Pushing into repo: $REPO"

# Keys that should land in the SECRET bucket (anything sensitive).
SECRET_KEYS=(
  GEMINI_API_KEY
  MAKE_OMNICHANNEL_WEBHOOK_URL
  MAKE_CUSTOMER_SERVICE_WEBHOOK_URL
  MAKE_CUSTOMER_SERVICE_POLL_URL
  MAKE_API_KEY
  META_CAPI_ACCESS_TOKEN
  AIKAGAN_CAPI_SHARED_SECRET
  GUMROAD_ACCESS_TOKEN
  META_PIXEL_TEST_EVENT_CODE
)

is_secret() {
  local key="$1"
  for k in "${SECRET_KEYS[@]}"; do [ "$key" = "$k" ] && return 0; done
  return 1
}

is_placeholder() {
  case "$1" in
    *YOUR_*HERE*|*your_*_here*) return 0 ;;
    "") return 0 ;;
    *) return 1 ;;
  esac
}

# Parse KEY="value" lines, ignoring comments and blanks.
while IFS='=' read -r raw_key raw_val; do
  key=$(echo "$raw_key" | tr -d '[:space:]')
  # Strip leading/trailing quotes and whitespace from value.
  val=$(echo "$raw_val" | sed -E 's/^[[:space:]]*"?//; s/"?[[:space:]]*$//')
  [ -z "$key" ] && continue
  case "$key" in
    \#*) continue ;;
  esac
  if is_placeholder "$val"; then
    echo "  -- skipping $key (placeholder/empty)"
    continue
  fi
  if is_secret "$key"; then
    echo "  >> SECRET $key"
    gh secret set "$key" --repo "$REPO" --body "$val" >/dev/null
  else
    echo "  >> VAR    $key"
    gh variable set "$key" --repo "$REPO" --body "$val" >/dev/null
  fi
done < <(grep -E '^[A-Z_]+=' "$ENV_FILE")

echo "==> Done. Trigger a workflow run to verify:"
echo "    gh workflow run 'AIKAGAN Commanders' -f target=marketing -f wave=1"
