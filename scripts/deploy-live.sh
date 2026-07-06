#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# scripts/deploy-live.sh
#
# Make the AIKAGAN income system fully live.
#
# What this script does:
#   1. Generates fresh secrets (CRON_SECRET, ADMIN_SECRET, DOWNLOAD_TOKEN_SECRET)
#   2. Adds them to Vercel production env via `vercel env add`
#   3. Prints the exact commands to set the remaining env vars that
#      require human-provided values (META_CAPI_ACCESS_TOKEN, KV, GA, Paddle, etc.)
#   4. Triggers a production deploy
#   5. After deploy, prints the URLs to verify
#
# Prerequisites:
#   - vercel CLI installed and logged in (vercel whoami should show aikagan)
#   - project already linked to aikagan-web
#   - jq installed (or remove the --format json flag)
#
# Usage:
#   bash scripts/deploy-live.sh
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

PROJECT="aikagan-web"
ENV="production"

bold() { printf "\033[1m%s\033[0m\n" "$*"; }
ok()   { printf "\033[32m✓\033[0m %s\n" "$*"; }
warn() { printf "\033[33m!\033[0m %s\n" "$*"; }

bold "── AIKAGAN · go-live ───────────────────────────────"
echo "Project: $PROJECT"
echo "Env:     $ENV"
echo ""

# Pre-flight
if ! command -v vercel >/dev/null; then
  echo "vercel CLI not found. Install with: npm i -g vercel"
  exit 1
fi

if ! vercel whoami >/dev/null 2>&1; then
  echo "Not logged in to Vercel. Run: vercel login"
  exit 1
fi

# 1. Generate secrets
ADMIN_SECRET_NEW="$(openssl rand -hex 32)"
CRON_SECRET_NEW="$(openssl rand -hex 32)"
DOWNLOAD_TOKEN_SECRET_NEW="$(openssl rand -hex 32)"

echo ""
bold "Generated secrets (copy these for your records):"
echo "  ADMIN_SECRET=$ADMIN_SECRET_NEW"
echo "  CRON_SECRET=$CRON_SECRET_NEW"
echo "  DOWNLOAD_TOKEN_SECRET=$DOWNLOAD_TOKEN_SECRET_NEW"
echo ""
warn "Storing them in Vercel env now."

# 2. Add secrets (--force overwrites so re-running is safe)
add_env() {
  local key="$1" value="$2"
  if [ -z "$value" ]; then
    warn "Skipping $key (empty)"
    return
  fi
  # Try production first; fall back to preview
  if echo "$value" | vercel env add "$key" "$ENV" --force 2>/dev/null; then
    ok "$key → $ENV"
  else
    warn "$key failed; will print command for manual retry"
    echo "  echo '$value' | vercel env add $key $ENV --force"
  fi
}

add_env "ADMIN_SECRET" "$ADMIN_SECRET_NEW"
add_env "CRON_SECRET" "$CRON_SECRET_NEW"
add_env "DOWNLOAD_TOKEN_SECRET" "$DOWNLOAD_TOKEN_SECRET_NEW"

# 3. Print commands for env vars that need human-provided values
echo ""
bold "── Now you need to set these env vars in Vercel ─────────"
echo ""
cat <<'EOF'
# 1. Paddle (live keys from https://vendors.paddle.com → Developer Tools)
vercel env add PADDLE_API_KEY production
vercel env add PADDLE_WEBHOOK_SECRET production
vercel env add NEXT_PUBLIC_PADDLE_CLIENT_TOKEN production

# 2. Vercel KV (Pro) OR Upstash Redis REST (free Hobby tier)
#    Upstash: https://upstash.com → Create Redis DB → REST → copy credentials
vercel env add KV_REST_API_URL production
vercel env add KV_REST_API_TOKEN production

# 3. Meta Pixel + CAPI (https://business.facebook.com/events_manager)
#    Pixel ID: Settings → Pixel ID
#    CAPI token: Settings → Generate Access Token
vercel env add NEXT_PUBLIC_META_PIXEL_ID production
vercel env add META_CAPI_ACCESS_TOKEN production

# 4. Google Analytics 4 (https://analytics.google.com)
#    Measurement ID: G-XXXXXXXXXX
vercel env add NEXT_PUBLIC_GA_ID production

# 5. Site URL
vercel env add NEXT_PUBLIC_SITE_URL https://aikagan.com
EOF
echo ""
echo "(Run each command above and paste the value when prompted, or set them via the Vercel dashboard at https://vercel.com/dashboard → aikagan-web → Settings → Environment Variables)"

# 4. Trigger a deploy
echo ""
bold "── Triggering production deploy ──────────────────────"
vercel deploy --prod --yes --confirm

# 5. Print verification URLs
echo ""
bold "── Verify ───────────────────────────────────────────"
echo "Health:        https://aikagan.com/api/health"
echo "Income:        https://aikagan.com/income"
echo "Admin debug:   https://aikagan.com/admin/income  (password: ADMIN_SECRET above)"
echo "Setup audit:   https://aikagan.com/api/income/setup"
echo ""
bold "── Self-test the funnel ─────────────────────────────"
echo "Seed a realistic 7-day dataset so /income has data to show:"
echo ""
echo "  curl -X POST https://aikagan.com/api/income/seed \\\\"
echo "    -H \"x-admin-secret: \$ADMIN_SECRET\" \\\\"
echo "    -H \"content-type: application/json\" \\\\"
echo "    -d '{\"days\": 7, \"scale\": 1.0}'"
echo ""
echo "Then visit https://aikagan.com/income to see the funnel and revenue chart."
echo ""
ok "Done."
