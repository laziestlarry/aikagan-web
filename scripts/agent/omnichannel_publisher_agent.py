from __future__ import annotations

import asyncio
import json
import os
from pathlib import Path

import pydantic
import requests
from dotenv import load_dotenv
from google.antigravity import Agent, LocalAgentConfig


ROOT_DIR = Path(__file__).resolve().parents[2]
SCRIPT_DIR = Path(__file__).resolve().parent
CONTENT_DIR = SCRIPT_DIR / "content_backlog"
DEFAULT_CHANNELS = ["x", "linkedin", "reddit", "discord", "substack", "hacker_news"]


def load_environment() -> None:
    for candidate in (
        ROOT_DIR / ".env.fulfillment",
        SCRIPT_DIR / ".env.fulfillment",
        ROOT_DIR / ".env",
        SCRIPT_DIR / ".env",
    ):
        if candidate.exists():
            load_dotenv(candidate, override=False)


def get_selected_channels() -> list[str]:
    raw = os.getenv("AIKAGAN_LAUNCH_CHANNELS", ",".join(DEFAULT_CHANNELS))
    channels = [item.strip() for item in raw.split(",") if item.strip()]
    return channels or DEFAULT_CHANNELS


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


def fetch_reddit_signal(subreddits: tuple[str, ...] = ("Entrepreneur", "smallbusiness", "SaaS")) -> str:
    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
    }
    for subreddit in subreddits:
        try:
            response = requests.get(
                f"https://www.reddit.com/r/{subreddit}/top.json?t=week&limit=3",
                headers=headers,
                timeout=15,
            )
            response.raise_for_status()
            payload = response.json()
            posts = payload.get("data", {}).get("children", [])
            if posts:
                top_post = posts[0].get("data", {})
                title = top_post.get("title", "").strip()
                body = top_post.get("selftext", "").strip()
                return f"Subreddit: r/{subreddit}\nTitle: {title}\nBody: {body}"
        except (requests.RequestException, ValueError):
            continue

    return (
        "Subreddit: fallback\n"
        "Title: I need my first paying customer without burning cash on ads\n"
        "Body: Builders want practical scripts, a clear offer, and a launch sequence they can run today."
    )


async def main() -> None:
    load_environment()
    CONTENT_DIR.mkdir(parents=True, exist_ok=True)

    offer_name = os.getenv("AIKAGAN_OFFER_NAME", "AutonomaX Masterclass Starter")
    offer_url = os.getenv(
        "AIKAGAN_OFFER_URL",
        "https://aikagan.com/products/masterclass-starter/",
    )
    lead_magnet_url = os.getenv(
        "AIKAGAN_LEAD_MAGNET_URL",
        "https://aikagan.com/free/golden-delivery-sample/",
    )
    discount_code = os.getenv("AIKAGAN_DISCOUNT_CODE", "KAGANATE")
    selected_channels = get_selected_channels()
    webhook_url = os.getenv("MAKE_OMNICHANNEL_WEBHOOK_URL", "")
    audience_signal = fetch_reddit_signal()

    config = LocalAgentConfig(
        response_schema=LaunchDirectorPayload,
        system_instruction=(
            "You are AIKAGAN's launch director. "
            "Maximize high-intent buyer traffic for a digital toolkit launch without spam. "
            "Choose selective channels where operators, freelancers, consultants, and solopreneurs already buy. "
            "Write like a practical operator, not a hype marketer. "
            "Focus on launch announcement posts, follow-up comments, and customer-service-ready posts that reduce objections."
        ),
    )

    prompt = f"""
Current buyer signal:
{audience_signal}

Business context:
- Offer: {offer_name}
- Offer URL: {offer_url}
- Free entry asset: {lead_magnet_url}
- Discount code: {discount_code}
- Available launch channels to choose from: {", ".join(selected_channels)}

Output requirements:
1. Choose only the highest-intent channels from the available list. Do not force every platform.
2. Create three execution waves: launch, proof, and objection handling.
3. For each selected channel, write:
   - one launch announcement post
   - one short follow-up comment or reply for the same channel
   - one clear CTA
4. Create customer-service-ready posts for selective channels where buyers ask questions publicly.
5. Add objection replies covering price, legitimacy, effort required, and what happens after purchase.
6. Stay compliant: this is a digital toolkit, not done-for-you software, and not guaranteed income.
"""

    print("Initializing AIKAGAN launch director...")
    async with Agent(config) as agent:
        response = await agent.chat(prompt)
        structured = await response.structured_output()
        payload = (
            structured.model_dump(mode="json")
            if isinstance(structured, pydantic.BaseModel)
            else structured
        )

    payload["source_signal"] = audience_signal
    payload["requested_channels"] = selected_channels

    output_path = CONTENT_DIR / "latest_launch_director_payload.json"
    output_path.write_text(json.dumps(payload, indent=2), encoding="utf-8")
    print(f"Saved launch payload to {output_path}")

    if webhook_url:
        publish_response = requests.post(webhook_url, json=payload, timeout=30)
        publish_response.raise_for_status()
        print("Published launch payload to Make.com.")
    else:
        print("MAKE_OMNICHANNEL_WEBHOOK_URL not set. Payload saved locally only.")


if __name__ == "__main__":
    asyncio.run(main())
