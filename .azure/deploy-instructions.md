# Deploy Instructions

The Vercel free tier deploy limit (100/day) has been reached for today.

## Option 1: Deploy from Vercel Dashboard (2 clicks)

1. Go to: https://vercel.com/lazylarries-8392s-projects/aikagan-web/deployments
2. Click the "..." menu on the latest deployment
3. Click "Redeploy" → "Redeploy to Production"

This bypasses the CLI limit.

## Option 2: Wait for limit reset

The limit resets ~24h after the first deployment today (approx 2026-07-09 08:00 UTC).

After deploy, verify with:
```bash
curl -s "https://aikagan.com/api/health" | python3 -c "import sys,json;print(json.load(sys.stdin)['version'][:10])"
```
Expected: `aaeefee` or later

## What's in the queue

| Fix | Commit | What it fixes |
|-----|--------|---------------|
| income/checkout catalog prices | c7217fb | Commander→Manual bug |
| Email domain update | d24a15f | @aikagan.com → @autonomax.ai |
| Launch clearance doc | 5820407 | Final record |
| Deploy trigger | aaeefee | Empty trigger commit |
