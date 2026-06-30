"""
AIKAGAN — Handoff Verifier

Walks every hop in the conversion chain and prints PASS / WARN / FAIL.
Exit code: 0 if all PASS, 1 if any FAIL, 2 if any WARN-only.

Use:
  python scripts/agent/verify_handoff.py            # full check
  python scripts/agent/verify_handoff.py --quick    # skip network checks
"""
from __future__ import annotations

import argparse
import json
import os
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Callable

import httpx
from dotenv import load_dotenv

SCRIPT_DIR = Path(__file__).resolve().parent
ROOT_DIR = SCRIPT_DIR.parents[1]
sys.path.insert(0, str(SCRIPT_DIR))


def load_environment() -> None:
    for candidate in (
        ROOT_DIR / ".env.fulfillment",
        SCRIPT_DIR / ".env.fulfillment",
        ROOT_DIR / ".env",
        SCRIPT_DIR / ".env",
    ):
        if candidate.exists():
            load_dotenv(candidate, override=False)


load_environment()

# ---------------------------------------------------------------------------
# Result plumbing
# ---------------------------------------------------------------------------
@dataclass
class Check:
    name: str
    status: str  # PASS | WARN | FAIL
    detail: str = ""


RESULTS: list[Check] = []
COLOR = {
    "PASS": "\033[92m",
    "WARN": "\033[93m",
    "FAIL": "\033[91m",
    "END":  "\033[0m",
}


def record(name: str, status: str, detail: str = "") -> Check:
    c = Check(name=name, status=status, detail=detail)
    RESULTS.append(c)
    color = COLOR.get(status, "")
    print(f"  {color}[{status}]{COLOR['END']} {name}" + (f" — {detail}" if detail else ""))
    return c


def section(title: str) -> None:
    print(f"\n=== {title} ===")


# ---------------------------------------------------------------------------
# Hop 1 — env vars
# ---------------------------------------------------------------------------
REQUIRED_VARS = [
    "GEMINI_API_KEY",
    "MAKE_OMNICHANNEL_WEBHOOK_URL",
    "MAKE_CUSTOMER_SERVICE_WEBHOOK_URL",
    "AIKAGAN_BASE_URL",
]
OPTIONAL_VARS = [
    "GEMINI_MODEL",
    "LEMONSQUEEZY_STORE_URL",
    "CAMPAIGN_NAME",
    "SUBREDDIT_TARGETS",
    "AIKAGAN_OFFER_NAME",
    "AIKAGAN_OFFER_URL",
    "AIKAGAN_LEAD_MAGNET_URL",
    "REPLY_FROM_EMAIL",
    "MAKE_API_KEY",
    "MAKE_TEAM_ID",
]


def check_env() -> None:
    section("Hop 1 — Environment")
    for var in REQUIRED_VARS:
        val = os.getenv(var, "")
        if not val or "YOUR_" in val:
            record(f"env {var}", "FAIL", "missing or placeholder")
        else:
            record(f"env {var}", "PASS", f"len={len(val)}")
    for var in OPTIONAL_VARS:
        val = os.getenv(var, "")
        if not val:
            record(f"env {var}", "WARN", "unset (optional)")
        elif "YOUR_" in val or "your_" in val:
            record(f"env {var}", "WARN", "placeholder (optional)")
        else:
            record(f"env {var}", "PASS", f"len={len(val)}")


# ---------------------------------------------------------------------------
# Hop 2 — Gemini
# ---------------------------------------------------------------------------
def check_gemini(quick: bool) -> None:
    section("Hop 2 — Gemini SDK")
    try:
        import google.generativeai as genai  # noqa: F401
        record("import google.generativeai", "PASS")
    except ImportError as exc:
        record("import google.generativeai", "FAIL", str(exc))
        return
    if quick:
        record("gemini ping", "WARN", "--quick set; skipped")
        return
    api_key = os.getenv("GEMINI_API_KEY", "")
    if not api_key or "YOUR_" in api_key:
        record("gemini ping", "FAIL", "GEMINI_API_KEY not set")
        return
    try:
        import google.generativeai as genai
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel(
            os.getenv("GEMINI_MODEL", "gemini-1.5-flash-latest"),
            generation_config={"max_output_tokens": 16},
        )
        resp = model.generate_content("Reply with the word OK only.")
        text = (resp.text or "").strip()
        if "OK" in text.upper():
            record("gemini ping", "PASS", f"replied '{text[:32]}'")
        else:
            record("gemini ping", "WARN", f"unexpected reply '{text[:48]}'")
    except Exception as exc:  # noqa: BLE001
        record("gemini ping", "FAIL", str(exc)[:120])


# ---------------------------------------------------------------------------
# Hop 3 — Reddit reachable
# ---------------------------------------------------------------------------
def check_reddit(quick: bool) -> None:
    section("Hop 3 — Profit Radar (Reddit)")
    if quick:
        record("reddit reachable", "WARN", "--quick set; skipped")
        return
    targets = (os.getenv("SUBREDDIT_TARGETS") or "Entrepreneur").split(",")
    sub = targets[0].strip() or "Entrepreneur"
    try:
        with httpx.Client(
            timeout=10.0,
            headers={"User-Agent": "AIKAGAN-Verifier/1.0 (+https://aikagan.com)"},
        ) as c:
            r = c.get(f"https://www.reddit.com/r/{sub}/top.json?t=week&limit=1")
        if r.status_code == 200:
            record(f"r/{sub} reachable", "PASS")
        else:
            record(f"r/{sub} reachable", "WARN",
                   f"HTTP {r.status_code} — fallback pain point will be used")
    except Exception as exc:  # noqa: BLE001
        record("reddit reachable", "WARN", str(exc)[:120])


# ---------------------------------------------------------------------------
# Hop 4 — conversion_router & LemonSqueezy IDs
# ---------------------------------------------------------------------------
def check_conversion_router(quick: bool) -> None:
    section("Hop 4 — Conversion router & checkout URLs")
    try:
        from conversion_router import (  # noqa: F401
            LEMONSQUEEZY_PRODUCTS, build_cta, platforms_for_wave,
        )
        record("import conversion_router", "PASS")
    except Exception as exc:  # noqa: BLE001
        record("import conversion_router", "FAIL", str(exc)[:120])
        return

    # Built URLs must contain the verified checkout IDs.
    from conversion_router import LEMONSQUEEZY_PRODUCTS, build_cta
    for tier in ("starter", "pro", "commander"):
        cta = build_cta("x", wave=1, override_tier=tier)  # type: ignore[arg-type]
        expected_id = LEMONSQUEEZY_PRODUCTS[tier]["checkout_id"]
        if expected_id in cta.url:
            record(f"CTA build {tier}", "PASS", expected_id)
        else:
            record(f"CTA build {tier}", "FAIL",
                   f"expected {expected_id} not in URL")
    if quick:
        record("checkout HEAD checks", "WARN", "--quick set; skipped")
        return
    for tier, product in LEMONSQUEEZY_PRODUCTS.items():
        try:
            with httpx.Client(timeout=10.0, follow_redirects=True) as c:
                r = c.head(product["page"])
            ok = r.status_code in (200, 301, 302, 308)
            record(f"aikagan.com {product['slug']}", "PASS" if ok else "FAIL",
                   f"HTTP {r.status_code}")
        except Exception as exc:  # noqa: BLE001
            record(f"aikagan.com {product['slug']}", "FAIL", str(exc)[:120])


# ---------------------------------------------------------------------------
# Hop 5 — pydantic schema check (offline)
# ---------------------------------------------------------------------------
def check_schemas() -> None:
    section("Hop 5 — Pydantic schemas")
    try:
        from omnichannel_publisher_agent import LaunchDirectorPayload  # noqa: F401
        from customer_success_commander import CustomerSuccessPayload  # noqa: F401
        record("import schemas", "PASS")
    except Exception as exc:  # noqa: BLE001
        record("import schemas", "FAIL", str(exc)[:120])


# ---------------------------------------------------------------------------
# Hop 6 — Make.com webhooks accept POSTs
# ---------------------------------------------------------------------------
def check_webhooks(quick: bool) -> None:
    section("Hop 6 — Make.com webhooks")
    if quick:
        record("webhook POSTs", "WARN", "--quick set; skipped")
        return
    targets = {
        "MAKE_OMNICHANNEL_WEBHOOK_URL": {
            "type": "synthetic", "campaign": "verifier",
            "wave": 1, "launch_day": 0,
            "launch_posts": [],
            "execution_waves": [],
            "customer_service_posts": [],
            "objection_replies": [],
        },
        "MAKE_CUSTOMER_SERVICE_WEBHOOK_URL": {
            "type": "synthetic", "message_id": "verify-ping",
        },
    }
    for var, payload in targets.items():
        url = os.getenv(var, "")
        if not url or "YOUR_" in url:
            record(f"{var}", "FAIL", "URL not set")
            continue
        try:
            with httpx.Client(timeout=10.0) as c:
                r = c.post(url, json=payload)
            ok = r.status_code in (200, 202)
            record(f"POST → {var}", "PASS" if ok else "WARN",
                   f"HTTP {r.status_code}")
        except Exception as exc:  # noqa: BLE001
            record(f"POST → {var}", "FAIL", str(exc)[:120])


# ---------------------------------------------------------------------------
# Hop 7 — Live site spot-check
# ---------------------------------------------------------------------------
def check_live_site(quick: bool) -> None:
    section("Hop 7 — Live site")
    if quick:
        record("aikagan.com HEAD", "WARN", "--quick set; skipped")
        return
    base = os.getenv("AIKAGAN_BASE_URL", "https://aikagan.com").rstrip("/")
    urls = [
        f"{base}/",
        f"{base}/products/",
        f"{base}/free/golden-delivery-sample/",
        f"{base}/free/builder-starter-checklist/",
        f"{base}/free/weekly-operating-map/",
    ]
    with httpx.Client(timeout=10.0, follow_redirects=True) as c:
        for u in urls:
            try:
                r = c.head(u)
                ok = r.status_code in (200, 301, 302, 308)
                record(u, "PASS" if ok else "FAIL", f"HTTP {r.status_code}")
            except Exception as exc:  # noqa: BLE001
                record(u, "FAIL", str(exc)[:120])


# ---------------------------------------------------------------------------
# Hop 8 — GitHub Actions workflow YAML
# ---------------------------------------------------------------------------
def check_workflow() -> None:
    section("Hop 8 — GitHub Actions workflow")
    wf = ROOT_DIR / ".github/workflows/marketing-commander.yml"
    if not wf.exists():
        record("workflow file", "FAIL", "not found")
        return
    try:
        import yaml
        data = yaml.safe_load(wf.read_text(encoding="utf-8"))
        jobs = list((data.get("jobs") or {}).keys())
        record("workflow YAML", "PASS", f"jobs: {', '.join(jobs)}")
    except Exception as exc:  # noqa: BLE001
        record("workflow YAML", "FAIL", str(exc)[:120])


# ---------------------------------------------------------------------------
# Hop 9 — Make.com blueprint JSON valid
# ---------------------------------------------------------------------------
def check_blueprints() -> None:
    section("Hop 9 — Make.com blueprints")
    bp_dir = SCRIPT_DIR / "make_blueprints"
    if not bp_dir.exists():
        record("blueprint dir", "FAIL", "scripts/agent/make_blueprints missing")
        return
    files = sorted(bp_dir.glob("*.blueprint.json"))
    if not files:
        record("blueprint files", "FAIL", "no *.blueprint.json found")
        return
    for f in files:
        try:
            data = json.loads(f.read_text(encoding="utf-8"))
            if not data.get("flow"):
                record(f.name, "WARN", "no flow defined")
            else:
                record(f.name, "PASS", f"{len(data['flow'])} top-level modules")
        except Exception as exc:  # noqa: BLE001
            record(f.name, "FAIL", str(exc)[:120])


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
def main() -> None:
    parser = argparse.ArgumentParser(description="AIKAGAN handoff verifier")
    parser.add_argument("--quick", action="store_true",
                        help="Skip network checks (Gemini, Reddit, Make.com, site).")
    args = parser.parse_args()

    print("AIKAGAN — Handoff Verifier")
    check_env()
    check_gemini(args.quick)
    check_reddit(args.quick)
    check_conversion_router(args.quick)
    check_schemas()
    check_webhooks(args.quick)
    check_live_site(args.quick)
    check_workflow()
    check_blueprints()

    fails = sum(1 for c in RESULTS if c.status == "FAIL")
    warns = sum(1 for c in RESULTS if c.status == "WARN")
    passes = sum(1 for c in RESULTS if c.status == "PASS")
    print(f"\nSummary: {passes} PASS · {warns} WARN · {fails} FAIL")
    if fails:
        sys.exit(1)
    if warns:
        sys.exit(2)
    sys.exit(0)


if __name__ == "__main__":
    main()
