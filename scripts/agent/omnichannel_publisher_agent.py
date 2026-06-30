"""
AIKAGAN — Marketing Commander (Omnichannel Publisher Agent v2)

Profit OS modules invoked:
  • Profit Radar       — multi-subreddit pain-point scrape with engagement ranking
  • Offer That Prints  — every channel output ends with a tier-matched, UTM-tagged CTA
  • 7-Day Hype Machine — wave 1/2/3 staggered launch by day
  • Zero-Ad Sales Plan — organic channels only, no paid spend
  • Objection Killer   — embeds top-tier objection replies into the payload
  • Automation Money   — Make.com webhook routing with retries + local backlog

Run modes:
  python omnichannel_publisher_agent.py                # wave inferred from LAUNCH_DAY_OVERRIDE
  python omnichannel_publisher_agent.py --wave 2       # force a specific wave
  python omnichannel_publisher_agent.py --dry-run      # generate + save locally only
"""
from __future__ import annotations

import argparse
import asyncio
import json
import os
import sys
from dataclasses import asdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import httpx
import pydantic
from dotenv import load_dotenv
from tenacity import retry, stop_after_attempt, wait_exponential_jitter

# ---------------------------------------------------------------------------
# Path bootstrap so `conversion_router` can be imported even when run from CI
# ---------------------------------------------------------------------------
SCRIPT_DIR = Path(__file__).resolve().parent
ROOT_DIR = SCRIPT_DIR.parents[1]
CONTENT_DIR = SCRIPT_DIR / "content_backlog"
sys.path.insert(0, str(SCRIPT_DIR))

from conversion_router import (  # noqa: E402
    AIKAGAN_BASE_URL,
    WAVE_SCHEDULE,
    build_cta,
    platforms_for_wave,
)

# ---------------------------------------------------------------------------
# Env loading — searches a few sensible places so the same script works
# locally, in CI, and inside scripts/agent.
# ---------------------------------------------------------------------------
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
# Gemini wiring (real google-generativeai SDK — the `google.antigravity`
# package referenced in v1 does not exist on PyPI).
# ---------------------------------------------------------------------------
try:
    import google.generativeai as genai
except ImportError as exc:  # pragma: no cover
    raise SystemExit(
        "Missing dependency. Run: pip install -r scripts/agent/requirements.txt"
    ) from exc

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-1.5-pro-latest")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

MAKE_WEBHOOK_URL = os.getenv("MAKE_OMNICHANNEL_WEBHOOK_URL", "")
CAMPAIGN_NAME = os.getenv("CAMPAIGN_NAME", "chimera-genesis")
LAUNCH_DAY_OVERRIDE = int(os.getenv("LAUNCH_DAY_OVERRIDE", "1"))
SUBREDDIT_TARGETS = tuple(
    s.strip() for s in os.getenv(
        "SUBREDDIT_TARGETS",
        "Entrepreneur,SideProject,SaaSMarketing,digital_marketing,IndieHackers,smallbusiness",
    ).split(",")
    if s.strip()
)

DEFAULT_CHANNELS = ["x", "linkedin", "reddit", "discord", "substack", "hackernews"]


def get_selected_channels() -> list[str]:
    raw = os.getenv("AIKAGAN_LAUNCH_CHANNELS", ",".join(DEFAULT_CHANNELS))
    channels = [item.strip() for item in raw.split(",") if item.strip()]
    return channels or DEFAULT_CHANNELS


# ---------------------------------------------------------------------------
# Structured output schema — what Gemini is required to return
# ---------------------------------------------------------------------------
class LaunchWave(pydantic.BaseModel):
    name: str
    timing: str
    goal: str
    channels: list[str]


class LaunchPost(pydantic.BaseModel):
    channel: str
    audience: str
    why_this_channel: str
    announcement_copy: str
    follow_up_comment: str
    call_to_action: str
    offer_tier: str  # "free" | "starter" | "pro" | "commander"
    cta_url: str


class SupportPost(pydantic.BaseModel):
    channel: str
    scenario: str
    copy: str


class ObjectionReply(pydantic.BaseModel):
    objection: str
    short_reply: str


class LaunchDirectorPayload(pydantic.BaseModel):
    buyer_persona: str
    pain_point_summary: str
    launch_thesis: str
    offer_name: str
    offer_url: str
    lead_magnet_url: str
    discount_code: str
    priority_channels: list[str]
    execution_waves: list[LaunchWave]
    launch_posts: list[LaunchPost]
    customer_service_posts: list[SupportPost]
    objection_replies: list[ObjectionReply]


# ---------------------------------------------------------------------------
# Profit Radar — Reddit pain-point scrape with engagement ranking + fallback
# ---------------------------------------------------------------------------
@retry(stop=stop_after_attempt(3), wait=wait_exponential_jitter(initial=1, max=8))
def _fetch_subreddit(subreddit: str) -> list[dict[str, Any]]:
    headers = {"User-Agent": "AIKAGAN-MarketingCommander/2.0 (+https://aikagan.com)"}
    url = f"https://www.reddit.com/r/{subreddit}/top.json?t=week&limit=5"
    with httpx.Client(timeout=12.0, headers=headers) as client:
        r = client.get(url)
        r.raise_for_status()
        return [c.get("data", {}) for c in r.json().get("data", {}).get("children", [])]


def fetch_reddit_signal(subreddits: tuple[str, ...] = SUBREDDIT_TARGETS) -> str:
    """Returns the highest-engagement post across the configured subreddits."""
    ranked: list[tuple[int, str, dict[str, Any]]] = []
    for subreddit in subreddits:
        try:
            for post in _fetch_subreddit(subreddit):
                score = int(post.get("score", 0)) + int(post.get("num_comments", 0)) * 2
                ranked.append((score, subreddit, post))
        except Exception as exc:  # noqa: BLE001
            print(f"[radar] r/{subreddit} failed: {exc}")
            continue

    if not ranked:
        return (
            "Subreddit: fallback\n"
            "Title: I need my first paying customer without burning cash on ads\n"
            "Body: Builders want practical scripts, a clear offer, and a launch "
            "sequence they can run today."
        )

    ranked.sort(reverse=True, key=lambda t: t[0])
    score, subreddit, top = ranked[0]
    title = (top.get("title") or "").strip()
    body = ((top.get("selftext") or "").strip())[:1500]
    permalink = top.get("permalink", "")
    return (
        f"Subreddit: r/{subreddit} (engagement score {score})\n"
        f"Title: {title}\n"
        f"Body: {body}\n"
        f"Source: https://reddit.com{permalink}"
    )


# ---------------------------------------------------------------------------
# Wave selection
# ---------------------------------------------------------------------------
def determine_wave(override: int | None) -> int:
    if override:
        return override
    day = LAUNCH_DAY_OVERRIDE
    if day <= 2:
        return 1
    if day <= 4:
        return 2
    return 3


def channels_for_run(wave: int) -> list[str]:
    """Intersect operator-configured channels with the wave schedule."""
    configured = set(get_selected_channels())
    wave_channels = [p for p in platforms_for_wave(wave) if p in configured]
    # If the operator hasn't constrained the list, use the full wave.
    return wave_channels or platforms_for_wave(wave)


# ---------------------------------------------------------------------------
# Gemini content generation
# ---------------------------------------------------------------------------
SYSTEM_INSTRUCTION = """\
You are AIKAGAN's Launch Director and senior direct-response copywriter.

Mission: convert qualified attention into either (a) an email opt-in for a
free gift or (b) a $29/$79/$149 toolkit purchase. No spammy growth tactics.

Brand voice:
  - Operator, not guru. Specific over hype.
  - Banned words: unlock, secret, hack, guru, "you NEED", "literally", "game-changer".
  - Preferred verbs: ship, test, launch, close, pitch, post, send, draft.
  - Numbers beat adjectives. Concrete steps beat slogans.

Rules:
  1. Pick only the highest-intent channels available; do not force every platform.
  2. Use the EXACT cta_url and offer_tier provided for each channel in the CTA table.
  3. Match each channel's native conventions (length, links allowed?).
  4. Reddit + Hacker News: zero links inside the post body; CTA = "DM me 'send'".
  5. Embed objection answers inline; never sound like a direct sales pitch.
  6. Be compliance-clean: a digital toolkit, not done-for-you software, no income guarantees.

Output MUST be valid JSON matching the requested schema.
"""


def _build_prompt(
    audience_signal: str,
    wave: int,
    channels: list[str],
    cta_table: dict[str, dict[str, Any]],
    offer_name: str,
    offer_url: str,
    lead_magnet_url: str,
    discount_code: str,
) -> str:
    cta_lines = "\n".join(
        f"  - {ch}: tier={cta_table[ch]['tier']}, "
        f"label='{cta_table[ch]['label']}', cta_url='{cta_table[ch]['url']}'"
        for ch in channels
    )
    return f"""\
LIVE BUYER SIGNAL (Reddit, this week):
{audience_signal}

LAUNCH WAVE: {wave}/3
SELECTED CHANNELS: {", ".join(channels)}

OFFER CONTEXT:
  - Anchor offer: {offer_name}
  - Anchor offer URL: {offer_url}
  - Free lead magnet: {lead_magnet_url}
  - Discount code (only if it adds urgency): {discount_code}

CTA TABLE — use these EXACT cta_url + offer_tier values per channel:
{cta_lines}

DELIVERABLES:
  1. Pick the highest-intent subset of the selected channels (do NOT force all of them).
  2. Define 3 execution waves: launch (announce), proof (social proof + replies),
     objection (handle pricing/legitimacy/effort/post-purchase concerns).
  3. For every chosen channel produce:
       - announcement_copy (native length + style)
       - follow_up_comment (short, replies to the OP's own post)
       - call_to_action (one sentence with the CTA url and label)
       - offer_tier + cta_url COPIED from the CTA table (do not invent)
  4. customer_service_posts: ready-to-paste replies for channels where buyers
     ask questions publicly (Reddit threads, IG comments, LinkedIn DMs).
  5. objection_replies: cover price, legitimacy, effort, post-purchase support.

Return ONLY a JSON object matching the LaunchDirectorPayload schema. No prose.
"""


def _safe_parse_json(raw: str) -> dict[str, Any]:
    s = raw.strip()
    if s.startswith("```"):
        s = s.split("```", 2)[1] if s.count("```") >= 2 else s.lstrip("`")
        if s.startswith("json"):
            s = s[4:]
        s = s.strip().rstrip("`").strip()
    return json.loads(s)


@retry(stop=stop_after_attempt(3), wait=wait_exponential_jitter(initial=2, max=15))
def generate_payload(
    audience_signal: str,
    wave: int,
    channels: list[str],
    cta_table: dict[str, dict[str, Any]],
    offer_name: str,
    offer_url: str,
    lead_magnet_url: str,
    discount_code: str,
) -> dict[str, Any]:
    if not GEMINI_API_KEY:
        raise SystemExit("Missing GEMINI_API_KEY — populate .env.fulfillment first.")
    model = genai.GenerativeModel(
        model_name=GEMINI_MODEL,
        system_instruction=SYSTEM_INSTRUCTION,
        generation_config={
            "response_mime_type": "application/json",
            "temperature": 0.85,
            "max_output_tokens": 8192,
        },
    )
    resp = model.generate_content(
        _build_prompt(
            audience_signal=audience_signal,
            wave=wave,
            channels=channels,
            cta_table=cta_table,
            offer_name=offer_name,
            offer_url=offer_url,
            lead_magnet_url=lead_magnet_url,
            discount_code=discount_code,
        )
    )
    data = _safe_parse_json(resp.text)
    # Validate against schema — this raises if the model drifted.
    LaunchDirectorPayload(**data)
    return data


# ---------------------------------------------------------------------------
# Make.com distribution
# ---------------------------------------------------------------------------
@retry(stop=stop_after_attempt(4), wait=wait_exponential_jitter(initial=2, max=30))
def push_to_make(payload: dict[str, Any]) -> int:
    if not MAKE_WEBHOOK_URL:
        print("[publish] MAKE_OMNICHANNEL_WEBHOOK_URL not set — skipping push.")
        return 0
    with httpx.Client(timeout=30.0) as client:
        r = client.post(MAKE_WEBHOOK_URL, json=payload)
        r.raise_for_status()
        return r.status_code


def save_backlog(payload: dict[str, Any], wave: int) -> Path:
    CONTENT_DIR.mkdir(parents=True, exist_ok=True)
    ts = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    path = CONTENT_DIR / f"wave{wave}_{ts}.json"
    path.write_text(json.dumps(payload, indent=2), encoding="utf-8")
    return path


# ---------------------------------------------------------------------------
# Orchestration
# ---------------------------------------------------------------------------
async def main_async(args: argparse.Namespace) -> int:
    wave = determine_wave(args.wave)
    channels = channels_for_run(wave)

    print(f"[commander] Campaign: {CAMPAIGN_NAME} | Wave {wave}/3 "
          f"| Day {LAUNCH_DAY_OVERRIDE}")
    print(f"[commander] Active channels: {', '.join(channels)}")

    print(f"[radar] Scanning subreddits: {', '.join(SUBREDDIT_TARGETS)}")
    audience_signal = fetch_reddit_signal()
    print(f"[radar] Selected signal:\n{audience_signal}\n")

    cta_table = {
        ch: asdict(build_cta(ch, wave=wave, campaign=CAMPAIGN_NAME))
        for ch in channels
    }

    offer_name = os.getenv("AIKAGAN_OFFER_NAME", "AutonomaX Masterclass Starter")
    offer_url = os.getenv("AIKAGAN_OFFER_URL",
                          f"{AIKAGAN_BASE_URL}/products/masterclass-starter/")
    lead_magnet_url = os.getenv("AIKAGAN_LEAD_MAGNET_URL",
                                f"{AIKAGAN_BASE_URL}/free/golden-delivery-sample/")
    discount_code = os.getenv("AIKAGAN_DISCOUNT_CODE", "KAGANATE")

    print("[gen] Generating launch director payload via Gemini…")
    content = generate_payload(
        audience_signal=audience_signal,
        wave=wave,
        channels=channels,
        cta_table=cta_table,
        offer_name=offer_name,
        offer_url=offer_url,
        lead_magnet_url=lead_magnet_url,
        discount_code=discount_code,
    )

    payload = {
        "campaign": CAMPAIGN_NAME,
        "wave": wave,
        "launch_day": LAUNCH_DAY_OVERRIDE,
        "generated_at_utc": datetime.now(timezone.utc).isoformat(),
        "site_url": AIKAGAN_BASE_URL,
        "cta_table": cta_table,
        "source_signal": audience_signal,
        "requested_channels": channels,
        **content,
    }

    backlog_path = save_backlog(payload, wave)
    print(f"[archive] Wrote {backlog_path}")

    if args.dry_run:
        print("[publish] --dry-run set; skipping Make.com push.")
        return 0

    status = push_to_make(payload)
    print(f"[publish] Make.com responded {status}")
    return 0


def main() -> None:
    parser = argparse.ArgumentParser(description="AIKAGAN Marketing Commander")
    parser.add_argument(
        "--wave", type=int, choices=list(WAVE_SCHEDULE.keys()),
        help="Force a specific launch wave (1–3). Overrides LAUNCH_DAY_OVERRIDE.",
    )
    parser.add_argument(
        "--dry-run", action="store_true",
        help="Generate + save locally; do not push to Make.com.",
    )
    args = parser.parse_args()
    asyncio.run(main_async(args))


if __name__ == "__main__":
    main()
