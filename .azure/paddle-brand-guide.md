# Paddle Brand Setup Guide

## Brand Profile

| Setting | Value |
|---------|-------|
| Company Name | AIKAGAN |
| Support Email | support@aikagan.com |
| Brand Color | `#D4AF37` (Gold) |
| Logo URL | https://aikagan.com/brand/logo.png |
| Icon URL | https://aikagan.com/brand/logo-icon.png |

## Steps in Paddle Dashboard

### 1. Login
https://vendors.paddle.com

### 2. Company Profile
Settings → Company → Edit
- Company name: **AIKAGAN**
- Support email: **support@aikagan.com**
- Save

### 3. Branding
Settings → Checkout → Branding
- Logo: https://aikagan.com/brand/logo.png
- Brand color: `#D4AF37`
- Save

### 4. Default Payment Link (CRITICAL)
Settings → Checkout → Default Payment Link
- Set to: **https://aikagan.com/checkout-success**
- Save

### 5. Verify
After saving, run:
```bash
curl -s "https://aikagan.com/api/admin/paddle-setup?secret=d401c1bbf749c228dc999fd45a84fc66f53e3629269497334772baae6f3a9f51"
```

Expected: `"checkout_test": "✅ PASSED — checkout settings are configured"`

## Design Context

The brand system uses:
- **Dark background** (`#08080A` / `#0B0F19`) — premium, modern
- **Gold accent** (`#D4AF37`) — trust, value, premium feel
- **White text** (`#F8FAFC`) — readability
- **Gold CTA buttons** (`#D4AF37` bg, black text) — consistent with website

This matches the existing Gumroad store, LemonSqueezy checkout, and website design.
