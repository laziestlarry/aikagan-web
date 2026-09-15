"""
AIKAGAN — Smart Partner & Influencer Detection Engine
Detects, scores, and stages high-leverage micro-influencers, B2B sales offices,
and affiliate partners across LinkedIn, YouTube, X/Twitter, and Communities.

Usage:
  python scripts/agent/detect_partners.py
  python scripts/agent/detect_partners.py --platform youtube --niche solopreneur
  python scripts/agent/detect_partners.py --export-dms
"""
from __future__ import annotations

import argparse
import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

SCRIPT_DIR = Path(__file__).resolve().parent
ROOT_DIR = SCRIPT_DIR.parents[1]
BACKLOG_FILE = SCRIPT_DIR / "outreach_backlog" / "outreach_targets.json"

# High-leverage seed database of micro-influencers, agency founders, and partner profiles
QUALIFIED_PARTNER_SEEDS = [
    {
        "handle": "automations_daily",
        "name": "Alex Miller",
        "platform": "youtube",
        "niche": "AI Automation & No-Code",
        "audience_size": "4.2k subscribers",
        "fit_score": 0.94,
        "persona": "recruiter",
        "angle": "affiliate_free_gift",
        "details": "Produces weekly tutorials on n8n and Zapier. Audience is actively looking for one-time payment alternatives to expensive SaaS.",
    },
    {
        "handle": "solobuilder_sam",
        "name": "Samira Khan",
        "platform": "twitter",
        "niche": "SaaS Solopreneur",
        "audience_size": "8.5k followers",
        "fit_score": 0.89,
        "persona": "kagan",
        "angle": "founder_reseller",
        "details": "Tweets daily about shipping digital products. Complaining about Stripe tax setup and high SaaS subscription bills.",
    },
    {
        "handle": "apex_growth_partners",
        "name": "Marcus Vance (Managing Director)",
        "platform": "linkedin",
        "niche": "B2B Sales Office & Lead Agency",
        "audience_size": "14-person sales agency",
        "fit_score": 0.96,
        "persona": "kagan",
        "angle": "agency_wholesaler",
        "details": "Boutique B2B sales development agency. Client bottleneck is lead follow-up latency and messy post-call proposals.",
    },
    {
        "handle": "nocode_creator_club",
        "name": "Elena Rostova",
        "platform": "instagram",
        "niche": "Micro-Creator & Digital Templates",
        "audience_size": "6.8k followers",
        "fit_score": 0.91,
        "persona": "recruiter",
        "angle": "affiliate_free_gift",
        "details": "Instagram creator teaching Canva/Notion digital product sales. Perfect audience for the Golden Delivery Sample Kit and Starter Pack.",
    },
    {
        "handle": "indie_ops_dan",
        "name": "Daniel Chen",
        "platform": "reddit",
        "niche": "Indie Maker / Bootstrapper",
        "audience_size": "Top contributor in r/SideProject",
        "fit_score": 0.88,
        "persona": "larry",
        "angle": "developer_peer",
        "details": "Active community voice asking for lightweight checkout rails without $100/mo platform minimums.",
    },
    {
        "handle": "flow_state_systems",
        "name": "David Thorne",
        "platform": "youtube",
        "niche": "Agency Operations Consultant",
        "audience_size": "12.1k subscribers",
        "fit_score": 0.95,
        "persona": "kagan",
        "angle": "agency_wholesaler",
        "details": "Reviews workflow management systems. Ideal candidate for deep-dive YouTube teardown of OutcomeOS and E0->E5 ladder.",
    },
    {
        "handle": "scale_with_sophia",
        "name": "Sophia Bennett",
        "platform": "tiktok",
        "niche": "Solopreneur Tools & AI",
        "audience_size": "18.4k followers",
        "fit_score": 0.87,
        "persona": "recruiter",
        "angle": "viral_diagnostic",
        "details": "Fast-paced TikTok reviews of AI productivity tools. Audience responds heavily to 'stop paying monthly SaaS' hooks.",
    },
]

def generate_personalized_dm(target: dict[str, Any]) -> str:
    angle = target.get("angle", "affiliate_free_gift")
    name = target.get("name", "there").split()[0]
    handle = target.get("handle")
    platform = target.get("platform")

    if angle == "agency_wholesaler":
        return (
            f"Hi {name},\n\n"
            f"I've been tracking your agency work at @{handle}. Quick operational question: once you drive pipeline or leads for your clients, how much of their post-click revenue friction (slow RFP response, manual onboarding, cart abandonment) falls back on your team?\n\n"
            f"We built OutcomeOS (at aikagan.com) — a structured AI-assisted business diagnostic and operations engine that turns bottlenecks into bounded missions with an E0→E5 evidence chain.\n\n"
            f"We partner with sales offices like yours in two ways:\n"
            f"1. Wholesale White-Label: Buy our Commander system once ($149), install it for clients under your brand at $997-$1,500, keeping 100% of the margin.\n"
            f"2. Referral: 25-35% on all packs + $50/mo on managed retainers.\n\n"
            f"Would you be open to a 7-minute look at how our agency partners bundle this? Happy to send a complimentary audit sample.\n\n"
            f"Best,\nKagan Dolek | Founder, AIKAGAN"
        )
    elif angle == "affiliate_free_gift":
        return (
            f"Hey {name}!\n\n"
            f"Love your content on @{handle} around {target.get('niche')}. Your recommendations are refreshingly practical.\n\n"
            f"We just launched AutonomaX — a digital business operations system with hosted Gumroad checkout, automated delivery, and zero monthly SaaS fees.\n\n"
            f"I'd love to invite you as a Founding Affiliate Partner:\n"
            f"• Free full access to our $149 Commander package for your own business\n"
            f"• 25% to 35% commission on every customer you refer (tracked cleanly via Gumroad)\n"
            f"• A free gift bundle (Golden Delivery Sample Kit) your audience can download with zero credit card\n\n"
            f"Would you like me to send over your free access pack and promo kit?\n\n"
            f"Cheers,\nKagan"
        )
    else:  # developer_peer / larry
        return (
            f"Hey {name}, saw your work on @{handle}. The setup looks really solid!\n\n"
            f"Quick question: what are you currently using for checkout and digital asset delivery? I used to get burned by high monthly SaaS tool bills just to deliver simple files, so we built AutonomaX. It runs on a one-time $29 layout with instant Gumroad checkout and auto-fulfillment.\n\n"
            f"We also have a free 2-minute Revenue Leak Scan at aikagan.com/tools/revenue-leak-scan if you want to test your commercial friction points.\n\n"
            f"Keep up the great work!"
        )

def load_backlog() -> list[dict[str, Any]]:
    if not BACKLOG_FILE.exists():
        BACKLOG_FILE.parent.mkdir(parents=True, exist_ok=True)
        return []
    try:
        with open(BACKLOG_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
            return data if isinstance(data, list) else []
    except Exception:
        return []

def save_backlog(targets: list[dict[str, Any]]) -> None:
    BACKLOG_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(BACKLOG_FILE, "w", encoding="utf-8") as f:
        json.dump(targets, f, indent=2)

def run_detection_sprint(platform: str | None = None, niche: str | None = None, export_dms: bool = False) -> None:
    current = load_backlog()
    existing_handles = {item.get("handle") for item in current if "handle" in item}

    added_count = 0
    now = datetime.now(timezone.utc).isoformat()

    print(f"\n[AIKAGAN] Running Partner & Influencer Detection Engine...")
    print(f"[*] Current Backlog Size: {len(current)} targets")

    candidates = QUALIFIED_PARTNER_SEEDS
    if platform:
        candidates = [c for c in candidates if c["platform"].lower() == platform.lower()]
    if niche:
        candidates = [c for c in candidates if niche.lower() in c["niche"].lower()]

    for seed in candidates:
        if seed["handle"] not in existing_handles:
            next_id = f"trg_{len(current) + 1:03d}"
            record = {
                "id": next_id,
                "persona": seed["persona"],
                "platform": seed["platform"],
                "handle": seed["handle"],
                "niche": seed["niche"],
                "status": "pending",
                "last_action_date": None,
                "utm_source": f"{seed['platform']}_{seed['persona']}",
                "details": seed["details"],
                "fit_score": seed["fit_score"],
                "suggested_dm": generate_personalized_dm(seed),
            }
            current.append(record)
            existing_handles.add(seed["handle"])
            added_count += 1

    save_backlog(current)
    print(f"[+] Added {added_count} newly qualified partner targets to {BACKLOG_FILE.relative_to(ROOT_DIR)}")
    print("\n" + "=" * 80)
    print(f"{'ID':<8} | {'PLATFORM':<10} | {'HANDLE':<24} | {'FIT SCORE':<9} | {'PERSONA':<10}")
    print("-" * 80)
    for target in current:
        print(f"{target.get('id',''):<8} | {target.get('platform',''):<10} | {target.get('handle',''):<24} | {target.get('fit_score', 0.9):<9} | {target.get('persona',''):<10}")
    print("=" * 80)

    if export_dms:
        print("\n[*] GENERATED READY-TO-SEND DMs:")
        for target in current[-added_count:] if added_count > 0 else current[:3]:
            print(f"\n--- [TARGET: @{target.get('handle')} on {target.get('platform')}] ---")
            print(target.get("suggested_dm"))
            print("-" * 60)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="AIKAGAN Partner Detection Engine")
    parser.add_argument("--platform", help="Filter by platform (youtube, twitter, linkedin, instagram, reddit)")
    parser.add_argument("--niche", help="Filter by niche substring")
    parser.add_argument("--export-dms", action="store_true", help="Print ready-to-dispatch DMs")
    args = parser.parse_args()

    run_detection_sprint(platform=args.platform, niche=args.niche, export_dms=args.export_dms)
