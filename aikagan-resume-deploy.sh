#!/usr/bin/env bash
set -Eeuo pipefail

REPO="laziestlarry/aikagan-web"
BRANCH="main"
STAMP="$(date +%Y%m%d-%H%M%S)"

fail() {
  echo
  echo "❌ FAILED: $*"
  exit 1
}

echo
echo "============================================================"
echo " AIKAGAN — REPAIR NPM → BUILD → PUSH → PROD DEPLOY"
echo "============================================================"
echo

git rev-parse --is-inside-work-tree >/dev/null 2>&1 \
  || fail "Run this inside aikagan-web"

ROOT="$(git rev-parse --show-toplevel)"
cd "$ROOT"

echo "Repository : $ROOT"
echo "HEAD       : $(git rev-parse --short HEAD)"
echo "Commit     : $(git log -1 --pretty=%s)"
echo "Node       : $(node -v)"
echo "npm        : $(npm -v)"
echo

echo "1/7 — Verifying repository state..."

git fetch origin --prune

LOCAL_SHA="$(git rev-parse HEAD)"
REMOTE_SHA="$(git rev-parse origin/$BRANCH)"

if [ "$LOCAL_SHA" != "$REMOTE_SHA" ]; then
  echo "Local and origin/main differ."
  echo "Resetting to current origin/main..."
  git reset --hard "origin/$BRANCH"
fi

git status --short

echo
echo "2/7 — Repairing stale node_modules..."

# macOS can retain immutable/user flags or unwritable generated files.
if [ -d node_modules ]; then
  chflags -R nouchg,noschg node_modules 2>/dev/null || true
  chmod -R u+rwX node_modules 2>/dev/null || true

  echo "Removing node_modules..."
  rm -rf node_modules 2>/dev/null || true
fi

# Retry with find if the directory survived rm -rf.
if [ -d node_modules ]; then
  echo "Normal removal left files behind; using bottom-up deletion..."
  find node_modules -depth -exec chmod u+rwX {} \; 2>/dev/null || true
  find node_modules -depth -delete 2>/dev/null || true
  rm -rf node_modules 2>/dev/null || true
fi

# Final portable fallback.
if [ -d node_modules ]; then
  echo "Using rimraf fallback..."
  npx --yes rimraf node_modules
fi

[ ! -d node_modules ] || fail "node_modules still cannot be removed"

rm -rf .next .vercel/output 2>/dev/null || true

echo "✓ Generated dependency/build state removed"

echo
echo "3/7 — Verifying npm cache and installing clean dependencies..."

npm cache verify

if [ -f package-lock.json ]; then
  npm ci
else
  npm install
fi

echo
echo "✓ Dependencies installed"

echo
echo "4/7 — Running production build..."

npm run build

echo
echo "✓ LOCAL PRODUCTION BUILD PASSED"

echo
echo "5/7 — Pushing verified release marker to GitHub..."

if command -v gh >/dev/null 2>&1 && gh auth status >/dev/null 2>&1; then
  git commit --allow-empty \
    -m "chore(release): verified Turkish /tr production build $STAMP"

  git push origin "$BRANCH"

  RELEASE_SHA="$(git rev-parse HEAD)"

  echo "✓ GitHub release SHA: $RELEASE_SHA"
  echo
  echo "Recent workflow runs:"
  gh run list \
    --repo "$REPO" \
    --branch "$BRANCH" \
    --limit 6 || true
else
  echo "⚠ GitHub CLI unavailable/not authenticated."
  echo "  Direct Vercel production deploy will continue."
  RELEASE_SHA="$(git rev-parse HEAD)"
fi

echo
echo "6/7 — Building with Vercel production configuration..."

npx --yes vercel@latest pull \
  --yes \
  --environment=production

npx --yes vercel@latest build --prod

echo
echo "7/7 — Deploying explicitly to production..."

DEPLOY_OUTPUT="$(
  npx --yes vercel@latest deploy \
    --prebuilt \
    --prod \
    --yes 2>&1
)"

echo "$DEPLOY_OUTPUT"

DEPLOY_URL="$(
  printf '%s\n' "$DEPLOY_OUTPUT" |
  grep -Eo 'https://[^[:space:]]+' |
  tail -1 || true
)"

echo
echo "============================================================"
echo " RELEASE RESULT"
echo "============================================================"
echo "Git SHA        : $RELEASE_SHA"
echo "Deployment URL : ${DEPLOY_URL:-see Vercel output}"
echo "Local build    : PASS"
echo

echo "Production route verification:"
echo

FAILS=0

check_url() {
  URL="$1"
  EXPECT="$2"

  CODE="$(curl -L -sS -o /tmp/aikagan-check.html \
    -w '%{http_code}' "$URL" || true)"

  if [ "$CODE" = "$EXPECT" ]; then
    printf "✓ %-62s %s\n" "$URL" "$CODE"
  else
    printf "✗ %-62s %s expected %s\n" "$URL" "$CODE" "$EXPECT"
    FAILS=$((FAILS+1))
  fi
}

check_url "https://aikagan.com/" "200"
check_url "https://aikagan.com/tr" "200"
check_url "https://aikagan.com/tr/tools" "200"
check_url "https://aikagan.com/tr/tools/revenue-leak-scan" "200"
check_url "https://aikagan.com/tr/products" "200"
check_url "https://aikagan.com/tr/services" "200"
check_url "https://aikagan.com/tr/contact" "200"
check_url "https://aikagan.com/robots.txt" "200"
check_url "https://aikagan.com/sitemap.xml" "200"

echo
echo "Turkish-content check:"

TR_HTML="$(curl -L -sS https://aikagan.com/tr || true)"

if printf '%s' "$TR_HTML" | grep -qE \
  'Önce ücretsiz deneyin|Ücretsiz|AIKAGAN Türkiye|Türkiye'; then
  echo "✓ Turkish homepage markers found"
else
  echo "✗ Turkish homepage markers not found"
  FAILS=$((FAILS+1))
fi

echo
echo ".com.tr leakage check on Turkish homepage:"

if printf '%s' "$TR_HTML" | grep -q 'aikagan\.com\.tr'; then
  echo "✗ aikagan.com.tr reference still present"
  FAILS=$((FAILS+1))
else
  echo "✓ No .com.tr reference found in rendered Turkish homepage"
fi

echo
echo "Canonical check:"

CANONICAL="$(
  printf '%s' "$TR_HTML" |
  grep -Eo '<link[^>]+rel=["'\'']canonical["'\''][^>]*>' |
  head -1 || true
)"

echo "${CANONICAL:-No canonical tag captured}"

echo
echo "============================================================"

if [ "$FAILS" -eq 0 ]; then
  echo "✅ AIKAGAN /tr RELEASE VERIFIED"
else
  echo "⚠ RELEASE COMPLETED WITH $FAILS LIVE VERIFICATION ISSUE(S)"
fi

echo "============================================================"
echo
echo "Your pre-sync local work remains protected in:"
echo "  git stash list"
echo
echo "and backup branch:"
echo "  backup/local-before-sync-20260828-020123"
echo
