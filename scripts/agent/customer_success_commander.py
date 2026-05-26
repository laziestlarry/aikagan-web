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


def load_environment() -> None:
    for candidate in (
        ROOT_DIR / ".env.fulfillment",
        SCRIPT_DIR / ".env.fulfillment",
        ROOT_DIR / ".env",
        SCRIPT_DIR / ".env",
    ):
        if candidate.exists():
            load_dotenv(candidate, override=False)


class FAQUpdate(pydantic.BaseModel):
    question: str
    answer: str


class ReplyMacro(pydantic.BaseModel):
    situation: str
    subject_line: str
    response: str


class SupportPost(pydantic.BaseModel):
    channel: str
    purpose: str
    copy: str


class EscalationRule(pydantic.BaseModel):
    trigger: str
    action: str


class CustomerSuccessPayload(pydantic.BaseModel):
    support_thesis: str
    response_principles: list[str]
    faq_updates: list[FAQUpdate]
    reply_macros: list[ReplyMacro]
    support_posts: list[SupportPost]
    escalation_rules: list[EscalationRule]


def read_launch_context() -> str:
    payload_path = CONTENT_DIR / "latest_launch_director_payload.json"
    if not payload_path.exists():
        return "No current launch payload found. Use general AIKAGAN launch context."
    return payload_path.read_text(encoding="utf-8")


async def main() -> None:
    load_environment()
    CONTENT_DIR.mkdir(parents=True, exist_ok=True)

    webhook_url = os.getenv("MAKE_CUSTOMER_SERVICE_WEBHOOK_URL", "")
    offer_name = os.getenv("AIKAGAN_OFFER_NAME", "AutonomaX Masterclass Starter")
    offer_url = os.getenv(
        "AIKAGAN_OFFER_URL",
        "https://aikagan.com/products/masterclass-starter/",
    )
    support_email = os.getenv("AIKAGAN_SUPPORT_EMAIL", "support@aikagan.com")
    launch_context = read_launch_context()

    config = LocalAgentConfig(
        response_schema=CustomerSuccessPayload,
        system_instruction=(
            "You are AIKAGAN's customer success commander. "
            "Reduce pre-sales friction, answer objections clearly, and protect refunds by setting accurate expectations. "
            "Tone: calm, credible, operator-level, concise."
        ),
    )

    prompt = f"""
Current campaign context:
{launch_context}

Customer success context:
- Offer: {offer_name}
- Offer URL: {offer_url}
- Support email: {support_email}

Generate:
1. FAQ updates for legitimacy, delivery, refund policy, effort required, and white-label rights.
2. Reply macros for pre-sales email, social comment, refund request, missing download, and 'is this software?' questions.
3. Support posts for selective public channels to reassure buyers and direct them to the right next step.
4. Escalation rules for when a human should step in.

Stay compliant:
- The product is a digital toolkit.
- It is not hosted software or guaranteed income.
- Delivery is digital and support is handled via email.
"""

    print("Initializing AIKAGAN customer success commander...")
    async with Agent(config) as agent:
        response = await agent.chat(prompt)
        structured = await response.structured_output()
        payload = (
            structured.model_dump(mode="json")
            if isinstance(structured, pydantic.BaseModel)
            else structured
        )

    payload["offer_name"] = offer_name
    payload["offer_url"] = offer_url
    payload["support_email"] = support_email

    output_path = CONTENT_DIR / "latest_customer_success_payload.json"
    output_path.write_text(json.dumps(payload, indent=2), encoding="utf-8")
    print(f"Saved customer success payload to {output_path}")

    if webhook_url:
        publish_response = requests.post(webhook_url, json=payload, timeout=30)
        publish_response.raise_for_status()
        print("Published customer success payload to Make.com.")
    else:
        print("MAKE_CUSTOMER_SERVICE_WEBHOOK_URL not set. Payload saved locally only.")


if __name__ == "__main__":
    asyncio.run(main())
