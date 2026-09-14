#!/usr/bin/env bash
# AIKAGAN master upgrade — verifier for the existing Next.js production stack.
# Does not create a parallel FastAPI/frontend tree, does not write secrets,
# and does not git commit or push.
set -euo pipefail

REPO="${REPO:-/Users/pq/pq_works/aikagan-web}"
CHECK_ONLY=0
DRY_RUN=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --repo) REPO="$2"; shift 2 ;;
    --check) CHECK_ONLY=1; shift ;;
    --dry-run) DRY_RUN=1; shift ;;
    --push|--commit)
      echo "Refused: this script never commits or pushes. Use git yourself after review." >&2
      exit 2 ;;
    -h|--help)
      echo "Usage: $0 [--repo PATH] [--check] [--dry-run]"
      exit 0 ;;
    *) echo "Unknown arg: $1" >&2; exit 1 ;;
  esac
done

log() { printf '[AIKAGAN] %s\n' "$*"; }
ok() { printf '  ok  %s\n' "$*"; }
err() { printf '  ERR %s\n' "$*" >&2; }

if [[ ! -d "$REPO" ]]; then
  err "Repo missing: $REPO"
  exit 1
fi
if [[ ! -f "$REPO/package.json" ]] || [[ ! -d "$REPO/app" ]]; then
  err "This is not the AIKAGAN Next.js app. Refusing to scaffold a second stack."
  exit 1
fi

ok "repo $REPO"
ok "stack nextjs $(node -p "require('$REPO/package.json').dependencies.next" 2>/dev/null || echo unknown)"

if [[ $CHECK_ONLY -eq 1 ]]; then
  log "check-only: environment valid"
  exit 0
fi

failures=0
check_path() {
  if [[ -e "$REPO/$1" ]]; then ok "$1"; else err "MISSING $1"; failures=$((failures+1)); fi
}

check_path "lib/outcomeos/stage-gate.ts"
check_path "lib/outcomeos/agents.ts"
check_path "lib/outcomeos/store.ts"
check_path "app/api/outcome/intake/route.ts"
check_path "app/api/outcome/mission/[id]/route.ts"
check_path "app/api/cron/outcome-escalation/route.ts"
check_path "app/outcome/page.tsx"
check_path "app/outcome/intake/page.tsx"
check_path "scripts/verify-outcomeos.mjs"

if [[ -d "$REPO/backend" ]] || [[ -d "$REPO/frontend" ]]; then
  err "Unsafe parallel backend/ or frontend/ tree detected. Do not merge the v2.0 Python script output."
  failures=$((failures+1))
fi

if grep -q 'STOREFRONT_MAINTENANCE = true' "$REPO/app/api/income/checkout/route.ts" 2>/dev/null; then
  log "local checkout flag is maintenance; production health currently reports commissioning/gumroad"
fi

if [[ $DRY_RUN -eq 1 ]]; then
  log "dry-run: no commands executed"
  exit "$failures"
fi

if command -v node >/dev/null 2>&1; then
  (cd "$REPO" && node scripts/verify-outcomeos.mjs)
  ok "outcomeos invariants"
fi

if [[ $failures -ne 0 ]]; then
  err "$failures check(s) failed"
  exit 1
fi

log "ALL CHECKS PASSED — upgrades live in the Next.js tree, not a sidecar FastAPI app."
cat <<'NEXT'
Do not run the Downloads Python FastAPI script against this repo.
Do not change live Gumroad prices ($29/$79/$149) from this verifier.
Do not git push from this script.
NEXT
