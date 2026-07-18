#!/usr/bin/env python3
"""
AutonomaX — Lead Ingestion Integrator Script
===========================================
Manage outreach targets from JSON, track their status, and push converted leads
directly to the `/api/leads` endpoint with appropriate UTM parameters.

Usage:
  python lead_ingestion_integrator.py --list
  python lead_ingestion_integrator.py --contact <target_id>
  python lead_ingestion_integrator.py --convert <target_id> --email <buyer_email> [--name <buyer_name>]
"""

import argparse
import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path

import httpx

SCRIPT_DIR = Path(__file__).resolve().parent
ROOT_DIR = SCRIPT_DIR.parents[1]
BACKLOG_FILE = SCRIPT_DIR / "outreach_backlog" / "outreach_targets.json"

# Load environment
from dotenv import load_dotenv
for candidate in (ROOT_DIR / ".env.fulfillment", ROOT_DIR / ".env", SCRIPT_DIR / ".env"):
    if candidate.exists():
        load_dotenv(candidate)

# Setup API URL
AIKAGAN_BASE_URL = os.getenv("AIKAGAN_BASE_URL", "http://localhost:3000").rstrip("/")
if "3000" in AIKAGAN_BASE_URL or "aikagan.com" in AIKAGAN_BASE_URL:
    API_LEADS_URL = f"{AIKAGAN_BASE_URL}/api/lead"
else:
    API_LEADS_URL = f"{AIKAGAN_BASE_URL}/api/leads"


def load_targets() -> list[dict]:
    if not BACKLOG_FILE.exists():
        BACKLOG_FILE.parent.mkdir(parents=True, exist_ok=True)
        BACKLOG_FILE.write_text("[]", encoding="utf-8")
    try:
        return json.loads(BACKLOG_FILE.read_text(encoding="utf-8"))
    except Exception as exc:
        print(f"[ERROR] Failed to read {BACKLOG_FILE.name}: {exc}")
        sys.exit(1)


def save_targets(targets: list[dict]) -> None:
    try:
        BACKLOG_FILE.write_text(json.dumps(targets, indent=2), encoding="utf-8")
    except Exception as exc:
        print(f"[ERROR] Failed to save {BACKLOG_FILE.name}: {exc}")
        sys.exit(1)


def list_targets(targets: list[dict]) -> None:
    print(f"\n--- Active Outreach Targets ({len(targets)} found) ---")
    print(f"{'ID':<10} | {'Persona':<10} | {'Platform':<12} | {'Handle':<20} | {'Status':<10} | {'UTM Source':<18}")
    print("-" * 86)
    for t in targets:
        print(
            f"{t.get('id', ''):<10} | "
            f"{t.get('persona', ''):<10} | "
            f"{t.get('platform', ''):<12} | "
            f"{t.get('handle', ''):<20} | "
            f"{t.get('status', 'pending'):<10} | "
            f"{t.get('utm_source', ''):<18}"
        )
    print()


def mark_contacted(targets: list[dict], target_id: str) -> None:
    for t in targets:
        if t.get("id") == target_id:
            t["status"] = "contacted"
            t["last_action_date"] = datetime.now(timezone.utc).isoformat()
            save_targets(targets)
            print(f"[SUCCESS] Target {target_id} ({t.get('handle')}) marked as contacted.")
            return
    print(f"[ERROR] Target with ID {target_id} not found.")


def convert_lead(targets: list[dict], target_id: str, email: str, name: str | None) -> None:
    target = None
    for t in targets:
        if t.get("id") == target_id:
            target = t
            break

    if not target:
        print(f"[ERROR] Target with ID {target_id} not found.")
        return

    # Post to leads API
    payload = {
        "name": name or target.get("handle") or "",
        "email": email,
        "source": f"outreach_{target.get('platform')}",
        "utm_source": target.get("utm_source", "outreach"),
        "utm_medium": "dm_outreach",
        "utm_campaign": "chimera-genesis",
    }

    print(f"[INFO] Connecting to {API_LEADS_URL}...")
    try:
        resp = httpx.post(API_LEADS_URL, json=payload, timeout=10.0)
        if resp.status_code in (200, 201):
            print(f"[SUCCESS] Lead captured successfully in database! Response: {resp.text}")
            target["status"] = "converted"
            target["last_action_date"] = datetime.now(timezone.utc).isoformat()
            save_targets(targets)
            print(f"[SUCCESS] Target {target_id} status updated to 'converted'.")
        else:
            print(f"[ERROR] API returned status {resp.status_code}: {resp.text}")
    except Exception as exc:
        print(f"[ERROR] Failed to post to lead ingestion API: {exc}")


def main() -> None:
    parser = argparse.ArgumentParser(description="AutonomaX Lead Ingestion tool")
    parser.add_argument("--list", action="store_true", help="List all outreach targets")
    parser.add_argument("--contact", metavar="TARGET_ID", help="Mark target ID as contacted")
    parser.add_argument("--convert", metavar="TARGET_ID", help="Convert target ID to lead")
    parser.add_argument("--email", help="Email of converted lead (required for --convert)")
    parser.add_argument("--name", help="Name of converted lead (optional for --convert)")
    parser.add_argument("--dry-run", action="store_true", help="Perform self-check validation run")

    args = parser.parse_args()
    targets = load_targets()

    if args.dry_run:
        print("[DRY-RUN] Checking backlog...")
        list_targets(targets)
        print("[DRY-RUN] API endpoint URL set to:", API_LEADS_URL)
        print("[DRY-RUN] Verification complete.")
        return

    if args.list:
        list_targets(targets)
        return

    if args.contact:
        mark_contacted(targets, args.contact)
        return

    if args.convert:
        if not args.email:
            print("[ERROR] Email is required when converting a lead (--email <email>).")
            sys.exit(1)
        convert_lead(targets, args.convert, args.email, args.name)
        return

    parser.print_help()


if __name__ == "__main__":
    main()
