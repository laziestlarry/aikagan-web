# private/downloads/
# ─────────────────────────────────────────────────────────────────────────────
#
# This directory holds product ZIP files served exclusively through the
# token-gated /api/download/[token] route. Files here are NEVER served
# as static assets by Next.js or any CDN.
#
# SETUP (manual operator step):
#   mv public/downloads/*.zip private/downloads/
#
# Expected files:
#   AutonomaX_Golden_Delivery_Starter_Pack.zip
#   AutonomaX_Golden_Delivery_Pro_Pack.zip
#   AutonomaX_Golden_Delivery_Commander_Pack.zip
#   AutonomaX_Masterclass_Starter_Pack_v2.zip
#   AutonomaX_Masterclass_Pro_Pack_v2.zip
#   AutonomaX_Masterclass_Commander_Pack_v2.zip
#
# The zipFilename values in lib/products.ts must match exactly.
# ─────────────────────────────────────────────────────────────────────────────
