"""
Conversion Router — single source of truth for offer URLs, UTM tagging, and
platform → tier matching.

Profit OS modules invoked: Offer That Prints Money, Website That Sells While
You Sleep, Zero-Ad Sales Plan, Objection Killer.

Every commander imports `build_cta()` so attribution and pricing tier match
the platform's audience temperature. Keep this file the only place where
LemonSqueezy IDs and base URLs live.
"""
from __future__ import annotations

import os
import urllib.parse
from dataclasses import dataclass
from typing import Literal

AIKAGAN_BASE_URL = os.getenv("AIKAGAN_BASE_URL", "https://aikagan.com").rstrip("/")
LEMONSQUEEZY_STORE_URL = os.getenv(
    "LEMONSQUEEZY_STORE_URL", "https://autonomax.lemonsqueezy.com"
).rstrip("/")
CHECKOUT_SUCCESS_URL = f"{AIKAGAN_BASE_URL}/checkout-success"

# Verified live IDs from aikagan.com (do not edit unless LemonSqueezy IDs rotate).
LEMONSQUEEZY_PRODUCTS: dict[str, dict] = {
    "starter": {
        "price": 29,
        "label": "Starter",
        "checkout_id": "2dd8d2ad-0fc5-495f-bd42-594484e981d3",
        "slug": "masterclass-starter",
        "page": f"{AIKAGAN_BASE_URL}/products/masterclass-starter/",
    },
    "pro": {
        "price": 79,
        "label": "Pro",
        "checkout_id": "5ae79599-3cc7-4a82-9bce-b977b6a0a160",
        "slug": "masterclass-pro",
        "page": f"{AIKAGAN_BASE_URL}/products/masterclass-pro/",
    },
    "commander": {
        "price": 149,
        "label": "Commander",
        "checkout_id": "eb358df9-f77c-4009-af74-a0ec005bb744",
        "slug": "masterclass-commander",
        "page": f"{AIKAGAN_BASE_URL}/products/masterclass-commander/",
    },
}

# Free-gift lead-magnet endpoints (capture the email first, sell later).
FREE_GIFTS: dict[str, str] = {
    "weekly_map": f"{AIKAGAN_BASE_URL}/free/weekly-operating-map/",
    "builder_checklist": f"{AIKAGAN_BASE_URL}/free/builder-starter-checklist/",
    "golden_sample": f"{AIKAGAN_BASE_URL}/free/golden-delivery-sample/",
}

Tier = Literal["free", "starter", "pro", "commander"]
Platform = Literal[
    "x", "linkedin", "facebook", "instagram", "reddit", "substack",
    "discord", "hackernews", "digg", "nextdoor", "pinterest", "quora",
    "medium", "tumblr", "youtube", "tiktok", "indiehackers", "email",
]

# Audience-temperature map. Cold audiences get the free gift; warmer
# (newsletter, IH, YouTube) get the Pro tier — the popular conversion peak.
PLATFORM_OFFER_MATRIX: dict[Platform, tuple[Tier, str]] = {
    # Cold / discovery — push the free gift, capture the email, nurture.
    "reddit":      ("free",      "golden_sample"),
    "hackernews":  ("free",      "builder_checklist"),
    "quora":       ("free",      "builder_checklist"),
    "nextdoor":    ("free",      "weekly_map"),
    "pinterest":   ("free",      "weekly_map"),
    "tumblr":      ("free",      "weekly_map"),
    "digg":        ("free",      "golden_sample"),
    # Mid-warm — Starter $29, lowest friction commitment.
    "facebook":    ("starter",   "masterclass-starter"),
    "instagram":   ("starter",   "masterclass-starter"),
    "tiktok":      ("starter",   "masterclass-starter"),
    "discord":     ("starter",   "masterclass-starter"),
    # Warm operators — Pro $79 is the AOV bump tier.
    "x":           ("pro",       "masterclass-pro"),
    "linkedin":    ("pro",       "masterclass-pro"),
    "substack":    ("pro",       "masterclass-pro"),
    "medium":      ("pro",       "masterclass-pro"),
    "indiehackers":("pro",       "masterclass-pro"),
    "youtube":     ("pro",       "masterclass-pro"),
    # Buyer email list — go straight to Commander upsell.
    "email":       ("commander", "masterclass-commander"),
}


@dataclass
class CTA:
    """Resolved call-to-action returned to commanders for embedding in copy."""
    url: str
    label: str
    tier: Tier
    price: int | None
    soft_cta: str  # platform-friendly one-liner
    hard_cta: str  # explicit CTA used in email/DM responses


def _utm(source: str, medium: str, campaign: str, content: str | None = None) -> str:
    params = {
        "utm_source": source,
        "utm_medium": medium,
        "utm_campaign": campaign,
    }
    if content:
        params["utm_content"] = content
    return urllib.parse.urlencode(params)


def build_cta(
    platform: Platform,
    wave: int = 1,
    campaign: str = "chimera-genesis",
    override_tier: Tier | None = None,
) -> CTA:
    """Return the right offer URL + UTM-tagged link for a given platform/wave."""
    tier, slug_or_key = PLATFORM_OFFER_MATRIX.get(platform, ("free", "golden_sample"))
    if override_tier:
        tier = override_tier

    if tier == "free":
        base = FREE_GIFTS.get(slug_or_key, FREE_GIFTS["golden_sample"])
        utm = _utm(platform, "organic", campaign, f"wave{wave}-freegift")
        url = f"{base}?{utm}"
        label = "Free 1-page guide"
        return CTA(
            url=url,
            label=label,
            tier="free",
            price=None,
            soft_cta=f"Reply 'send' or grab it free → {url}",
            hard_cta=f"Free download (no card): {url}",
        )

    product = LEMONSQUEEZY_PRODUCTS[tier]
    success_url = urllib.parse.quote(CHECKOUT_SUCCESS_URL, safe="")
    utm = _utm(platform, "organic", campaign, f"wave{wave}-{product['slug']}")
    url = (
        f"{LEMONSQUEEZY_STORE_URL}/checkout/buy/{product['checkout_id']}"
        f"?checkout%5Bcustom%5D%5Bproduct_slug%5D={product['slug']}"
        f"&checkout%5Bsuccess_url%5D={success_url}"
        f"&{utm}"
    )
    label = f"{product['label']} — ${product['price']}"
    return CTA(
        url=url,
        label=label,
        tier=tier,
        price=product["price"],
        soft_cta=f"If you want the full system: {label} → {url}",
        hard_cta=f"Grab {label} (30-day refund): {url}",
    )


def all_ctas_for_wave(wave: int, campaign: str = "chimera-genesis") -> dict[str, CTA]:
    """Build CTAs for every supported platform — cached per run."""
    return {p: build_cta(p, wave=wave, campaign=campaign) for p in PLATFORM_OFFER_MATRIX}


WAVE_SCHEDULE: dict[int, list[Platform]] = {
    # Wave 1 — Day 1–2: long-form, indexable, builds backlinks & SEO.
    1: ["x", "linkedin", "substack", "medium", "indiehackers"],
    # Wave 2 — Day 3–4: community-led, conversation-shaped.
    2: ["reddit", "hackernews", "discord", "quora", "facebook"],
    # Wave 3 — Day 5–7: visual + niche, drives bottom-funnel email captures.
    3: ["instagram", "tiktok", "pinterest", "youtube", "tumblr", "nextdoor", "digg"],
}


def platforms_for_wave(wave: int) -> list[Platform]:
    return WAVE_SCHEDULE.get(wave, list(PLATFORM_OFFER_MATRIX.keys()))


if __name__ == "__main__":
    # Smoke test — prints all CTAs grouped by wave.
    for wave in sorted(WAVE_SCHEDULE):
        print(f"\n=== Wave {wave} ===")
        for p in platforms_for_wave(wave):
            cta = build_cta(p, wave=wave)
            print(f"{p:<14} → {cta.tier:<10} {cta.label:<22} {cta.url[:90]}…")
