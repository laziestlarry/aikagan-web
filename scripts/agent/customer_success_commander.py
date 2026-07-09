"""
AIKAGAN — Customer Success Commander

Profit OS modules invoked:
  • Objection Killer  — classifies inbound and produces FAQ + reply macros
  • Offer That Prints — every reply ends with a tier-matched, UTM-tagged CTA
  • Automation Money  — Make.com webhook in/out with retries

Two execution modes (combine freely):

  1) Daily playbook refresh
     python customer_success_commander.py --playbook
     → Generates FAQ updates, reply macros, support posts, escalation rules
       and posts a CustomerSuccessPayload to MAKE_CUSTOMER_SERVICE_WEBHOOK_URL
       (or saves locally if the webhook isn't set).

  2) Per-message inbound replies
     python customer_success_commander.py --inbox-dir
     python customer_success_commander.py --poll
     echo '{"from_email":"...", "subject":"...", "body":"..."}' \
          | python customer_success_commander.py --stdin
     → Classifies each message, writes the operator-tone reply with a CTA,
       and posts it to MAKE_CUSTOMER_SERVICE_WEBHOOK_URL for Gmail send.
"""
from __future__ import annotations

import argparse
import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Iterable

import httpx
import pydantic
from dotenv import load_dotenv
from tenacity import retry, stop_after_attempt, wait_exponential_jitter

# ---------------------------------------------------------------------------
# Paths + env loading
# ---------------------------------------------------------------------------
SCRIPT_DIR = Path(__file__).resolve().parent
ROOT_DIR = SCRIPT_DIR.parents[1]
CONTENT_DIR = SCRIPT_DIR / "content_backlog"
INBOX_DIR = SCRIPT_DIR / "inbox"
LOG_DIR = SCRIPT_DIR / "support_log"
sys.path.insert(0, str(SCRIPT_DIR))

from conversion_router import AIKAGAN_BASE_URL, build_cta  # noqa: E402


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
# Gemini wiring (real SDK)
# ---------------------------------------------------------------------------
try:
    import google.generativeai as genai
except ImportError as exc:  # pragma: no cover
    raise SystemExit(
        "Missing dependency. Run: pip install -r scripts/agent/requirements.txt"
    ) from exc

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

MAKE_CS_WEBHOOK = os.getenv("MAKE_CUSTOMER_SERVICE_WEBHOOK_URL", "")
MAKE_CS_POLL_URL = os.getenv("MAKE_CUSTOMER_SERVICE_POLL_URL", "")
REPLY_FROM = os.getenv("REPLY_FROM_EMAIL", os.getenv("AIKAGAN_SUPPORT_EMAIL",
                                                    "support@aikagan.com"))

# ---------------------------------------------------------------------------
# Playbook schema (kept compatible with the prior LaunchDirector flow)
# ---------------------------------------------------------------------------
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


# ---------------------------------------------------------------------------
# Objection taxonomy → tier the reply should soft-pitch
# ---------------------------------------------------------------------------
OBJECTION_TIER_MAP: dict[str, str] = {
    "price":         "free",
    "legitimacy":    "starter",
    "effort":        "starter",
    "support":       "pro",
    "white_label":   "commander",
    "refund":        "starter",
    "compatibility": "pro",
    "upgrade":       "commander",
    "general":       "free",
}

PLAYBOOK_SYSTEM = """\
You are AIKAGAN's Customer Success Commander.

Mission: reduce pre-sales friction, answer objections clearly, and protect
refunds by setting accurate expectations.

Voice: calm, credible, operator-level, concise. Never guru. Never hype.
Banned words: unlock, secret, hack, "you NEED", "literally", "game-changer".

Compliance lines (use verbatim when relevant):
  - "Results depend on your implementation. 30-day refund, no questions."
  - "This is a digital toolkit — PDFs, templates, scripts — not done-for-you software."

Output is a JSON object that conforms to CustomerSuccessPayload.
"""

REPLY_SYSTEM = """\
You are AIKAGAN's Customer Success Commander replying to ONE inbound buyer
question for a digital-toolkit business (Starter $29, Pro $79, Commander $149).

Style:
  - Warm, direct, low-ego. Operator-to-operator.
  - 110–180 words. Two short paragraphs max. No emojis unless the buyer used one.
  - Acknowledge the concern in their own words before answering.
  - Give ONE concrete next step + the CTA link provided.
  - Never promise income, never call it "passive", never use guru language.
  - If asked something you don't know, say so and offer to escalate to a human.

Banned words: unlock, secret, hack, guru, "you NEED", "literally", "game-changer".

Compliance lines (use verbatim when relevant):
  - "Results depend on your implementation. 30-day refund, no questions."
  - "This is a digital toolkit — PDFs, templates, scripts — not done-for-you software."

Sign off on a new line with:  — AIKAGAN Customer Success

Output JSON: {"objection_category": "...", "ai_generated_reply": "..."}
"""


# ---------------------------------------------------------------------------
# Shared helpers
# ---------------------------------------------------------------------------
def _parse_json(raw: str) -> dict[str, Any]:
    s = raw.strip()
    if s.startswith("```"):
        s = s.split("```", 2)[1] if s.count("```") >= 2 else s.lstrip("`")
        if s.startswith("json"):
            s = s[4:]
        s = s.strip().rstrip("`").strip()
    return json.loads(s)


def _normalize_playbook_payload(data: dict[str, Any]) -> dict[str, Any]:
    # Gemini occasionally returns object-shaped sections instead of list-shaped schema fields.
    normalized = dict(data)

    normalized.setdefault(
        "support_thesis",
        "Deliver concise, credible support that removes friction and guides the next best step.",
    )
    principles = normalized.get("response_principles")
    if not isinstance(principles, list):
        normalized["response_principles"] = [
            "Acknowledge the buyer concern clearly.",
            "Answer with specific, realistic expectations.",
            "Offer one concrete next step with a relevant CTA.",
        ]

    faq_updates = normalized.get("faq_updates", [])
    if isinstance(faq_updates, dict):
        mapped: list[dict[str, str]] = []
        for key, value in faq_updates.items():
            if isinstance(value, dict):
                mapped.append(
                    {
                        "question": str(value.get("question") or key).strip(),
                        "answer": str(value.get("answer") or value.get("response") or "").strip(),
                    }
                )
        normalized["faq_updates"] = [row for row in mapped if row["question"] and row["answer"]]

    reply_macros = normalized.get("reply_macros", [])
    if isinstance(reply_macros, dict):
        mapped = []
        for key, value in reply_macros.items():
            if isinstance(value, dict):
                mapped.append(
                    {
                        "situation": str(value.get("situation") or key).strip(),
                        "subject_line": str(value.get("subject_line") or value.get("subject") or key).strip(),
                        "response": str(value.get("response") or value.get("body") or "").strip(),
                    }
                )
        normalized["reply_macros"] = [row for row in mapped if row["situation"] and row["response"]]

    support_posts = normalized.get("support_posts", [])
    if isinstance(support_posts, dict):
        mapped = []
        for key, value in support_posts.items():
            if isinstance(value, dict):
                mapped.append(
                    {
                        "channel": str(value.get("channel") or key).strip(),
                        "purpose": str(value.get("purpose") or value.get("title") or "support").strip(),
                        "copy": str(value.get("copy") or value.get("template") or "").strip(),
                    }
                )
        normalized["support_posts"] = [row for row in mapped if row["channel"] and row["copy"]]

    escalation_rules = normalized.get("escalation_rules", [])
    if isinstance(escalation_rules, dict):
        mapped = []
        rules = escalation_rules.get("rules")
        if isinstance(rules, list):
            for rule in rules:
                if isinstance(rule, str) and rule.strip():
                    mapped.append({"trigger": rule.strip(), "action": "Escalate to human support."})
        if not mapped:
            for key, value in escalation_rules.items():
                if isinstance(value, str) and value.strip():
                    mapped.append({"trigger": key, "action": value.strip()})
        normalized["escalation_rules"] = mapped

    return normalized


def _gemini(system: str, temperature: float = 0.5, max_tokens: int = 2048):
    if not GEMINI_API_KEY:
        raise SystemExit("Missing GEMINI_API_KEY — populate .env.fulfillment first.")
    model_name = GEMINI_MODEL.strip() or "gemini-1.5-flash"
    if not model_name.startswith("models/"):
        model_name = f"models/{model_name}"
    return genai.GenerativeModel(
        model_name=model_name,
        system_instruction=system,
        generation_config={
            "response_mime_type": "application/json",
            "temperature": temperature,
            "max_output_tokens": max_tokens,
        },
    )


@retry(stop=stop_after_attempt(4), wait=wait_exponential_jitter(initial=2, max=30))
def _push_make(payload: dict[str, Any]) -> int:
    if not MAKE_CS_WEBHOOK:
        print("[cs] MAKE_CUSTOMER_SERVICE_WEBHOOK_URL not set — saving locally only.")
        return 0
    with httpx.Client(timeout=30.0) as client:
        r = client.post(MAKE_CS_WEBHOOK, json=payload)
        r.raise_for_status()
        return r.status_code


def _log(payload: dict[str, Any], prefix: str = "reply") -> Path:
    LOG_DIR.mkdir(parents=True, exist_ok=True)
    ts = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    tag = payload.get("message_id") or payload.get("campaign") or "anon"
    path = LOG_DIR / f"{ts}_{prefix}_{tag}.json"
    path.write_text(json.dumps(payload, indent=2), encoding="utf-8")
    return path


# ---------------------------------------------------------------------------
# Playbook generation (daily refresh)
# ---------------------------------------------------------------------------
def read_launch_context() -> str:
    payload_path = CONTENT_DIR / "latest_launch_director_payload.json"
    if not payload_path.exists():
        # Fall back to most recent wave file
        candidates = sorted(CONTENT_DIR.glob("wave*.json"), reverse=True)
        if candidates:
            return candidates[0].read_text(encoding="utf-8")
        return "No current launch payload found. Use general AIKAGAN context."
    return payload_path.read_text(encoding="utf-8")


def generate_playbook() -> dict[str, Any]:
    CONTENT_DIR.mkdir(parents=True, exist_ok=True)
    offer_name = os.getenv("AIKAGAN_OFFER_NAME", "AutonomaX Masterclass Starter")
    offer_url = os.getenv("AIKAGAN_OFFER_URL",
                          f"{AIKAGAN_BASE_URL}/products/masterclass-starter/")
    support_email = REPLY_FROM
    launch_context = read_launch_context()

    model = _gemini(PLAYBOOK_SYSTEM, temperature=0.4, max_tokens=4096)
    prompt = f"""\
CURRENT CAMPAIGN CONTEXT:
{launch_context[:8000]}

OFFER CONTEXT:
  - Anchor offer: {offer_name}
  - Anchor offer URL: {offer_url}
  - Support email: {support_email}

DELIVERABLES (return JSON matching CustomerSuccessPayload):
  1. faq_updates: legitimacy, delivery, refund, effort, white-label rights.
  2. reply_macros: pre-sales email, social comment, refund request,
     missing download, "is this software?" question.
  3. support_posts: short public-reply templates for Reddit threads,
     LinkedIn DMs, IG comments, X replies.
  4. escalation_rules: when a human must take over (chargeback threats,
     legal questions, accessibility requests, custom enterprise asks).

Stay compliance-clean: digital toolkit, not hosted software, not guaranteed income.
"""
    last_error: Exception | None = None
    data: dict[str, Any] | None = None
    for attempt in range(1, 4):
        try:
            raw = model.generate_content(prompt).text
            candidate = _parse_json(raw)
            candidate = _normalize_playbook_payload(candidate)
            CustomerSuccessPayload(**candidate)  # raises if drifted
            data = candidate
            break
        except Exception as exc:  # noqa: BLE001
            last_error = exc
            prompt = (
                "Return valid JSON only. Do not include markdown fences, comments, "
                "or trailing commas.\n\n" + prompt
            )
            continue

    if data is None:
        raise RuntimeError(f"Failed to generate valid playbook payload: {last_error}")

    data["offer_name"] = offer_name
    data["offer_url"] = offer_url
    data["support_email"] = support_email
    data["generated_at_utc"] = datetime.now(timezone.utc).isoformat()
    return data


def run_playbook(dry_run: bool) -> None:
    print("[cs] Generating customer success playbook…")
    payload = generate_playbook()
    out = CONTENT_DIR / "latest_customer_success_payload.json"
    out.write_text(json.dumps(payload, indent=2), encoding="utf-8")
    print(f"[cs] Wrote {out}")
    if dry_run:
        print("[cs] --dry-run set; skipping Make.com push.")
        return
    status = _push_make({"type": "playbook", **payload})
    print(f"[cs] Make.com responded {status}")


# ---------------------------------------------------------------------------
# Per-message inbound replies
# ---------------------------------------------------------------------------
def _classify_and_reply(message: dict[str, Any]) -> dict[str, Any]:
    model = _gemini(REPLY_SYSTEM, temperature=0.55, max_tokens=1024)
    categories = ", ".join(OBJECTION_TIER_MAP.keys())
    prompt = f"""\
INCOMING MESSAGE
from:    {message.get("from_email", "(unknown)")}
subject: {message.get("subject", "(no subject)")}
body:
{(message.get("body") or "")[:4000]}

TASK
1. Classify into exactly ONE of: {categories}.
2. Write the reply per the system instruction.

Return JSON: {{"objection_category": "...", "ai_generated_reply": "..."}}
"""
    raw = model.generate_content(prompt).text
    parsed = _parse_json(raw)
    if parsed.get("objection_category") not in OBJECTION_TIER_MAP:
        parsed["objection_category"] = "general"
    return parsed


def _enrich(reply: dict[str, Any]) -> dict[str, Any]:
    tier = OBJECTION_TIER_MAP.get(reply["objection_category"], "free")
    cta = build_cta(
        "email",
        wave=int(os.getenv("LAUNCH_DAY_OVERRIDE", "1")),
        override_tier=tier,  # type: ignore[arg-type]
    )
    reply["recommended_offer_tier"] = tier
    reply["recommended_cta_url"] = cta.url
    reply["recommended_cta_label"] = cta.label
    return reply


def process_message(message: dict[str, Any], dry_run: bool) -> dict[str, Any]:
    classification = _enrich(_classify_and_reply(message))
    subject = message.get("subject", "AIKAGAN — your question")
    if not subject.lower().startswith("re:"):
        subject = f"Re: {subject}"

    outbound = {
        "type": "reply",
        "message_id": message.get("message_id"),
        "reply_email_address": message.get("from_email"),
        "reply_from": REPLY_FROM,
        "subject": subject,
        "ai_generated_reply": classification["ai_generated_reply"],
        "objection_category": classification["objection_category"],
        "recommended_offer_tier": classification["recommended_offer_tier"],
        "recommended_cta_url": classification["recommended_cta_url"],
        "recommended_cta_label": classification["recommended_cta_label"],
        "generated_at_utc": datetime.now(timezone.utc).isoformat(),
        "site_url": AIKAGAN_BASE_URL,
    }
    log_path = _log({**outbound, "inbound": message})
    print(f"[cs] {message.get('from_email','?')} → {classification['objection_category']}"
          f" → tier={classification['recommended_offer_tier']} (logged {log_path.name})")

    if dry_run:
        return outbound
    status = _push_make(outbound)
    print(f"[cs] Make.com responded {status}")
    return outbound


# ---------------------------------------------------------------------------
# Inbox sources
# ---------------------------------------------------------------------------
def _from_stdin() -> Iterable[dict[str, Any]]:
    raw = sys.stdin.read().strip()
    if not raw:
        return
    data = json.loads(raw)
    if isinstance(data, dict):
        yield data
    elif isinstance(data, list):
        yield from data


def _from_inbox_dir() -> Iterable[dict[str, Any]]:
    if not INBOX_DIR.exists():
        return
    for path in sorted(INBOX_DIR.glob("*.json")):
        try:
            yield json.loads(path.read_text())
            path.rename(path.with_suffix(".json.processed"))
        except Exception as exc:  # noqa: BLE001
            print(f"[cs] failed to read {path}: {exc}")


def _from_make_poll() -> Iterable[dict[str, Any]]:
    if not MAKE_CS_POLL_URL:
        return
    try:
        with httpx.Client(timeout=15.0) as client:
            r = client.get(MAKE_CS_POLL_URL)
            r.raise_for_status()
            data = r.json()
        if isinstance(data, dict):
            yield data
        elif isinstance(data, list):
            yield from data
    except Exception as exc:  # noqa: BLE001
        print(f"[cs] poll failed: {exc}")


def collect_messages(args: argparse.Namespace) -> list[dict[str, Any]]:
    bucket: list[dict[str, Any]] = []
    if args.stdin:
        bucket.extend(_from_stdin())
    if args.inbox_dir:
        bucket.extend(_from_inbox_dir())
    if args.poll:
        bucket.extend(_from_make_poll())
    return bucket


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
def main() -> None:
    parser = argparse.ArgumentParser(description="AIKAGAN Customer Success Commander")
    parser.add_argument("--playbook", action="store_true",
                        help="Regenerate FAQ + reply macros + escalation rules.")
    parser.add_argument("--stdin", action="store_true",
                        help="Process a JSON message (or array) from stdin.")
    parser.add_argument("--inbox-dir", action="store_true",
                        help="Process scripts/agent/inbox/*.json files.")
    parser.add_argument("--poll", action="store_true",
                        help="Poll MAKE_CUSTOMER_SERVICE_POLL_URL for inbound.")
    parser.add_argument("--dry-run", action="store_true",
                        help="Generate + log; do not push to Make.com.")
    args = parser.parse_args()

    if args.playbook:
        run_playbook(dry_run=args.dry_run)

    if not any([args.stdin, args.inbox_dir, args.poll]) and not args.playbook:
        # Default: refresh playbook + drain inbox + poll
        run_playbook(dry_run=args.dry_run)
        args.inbox_dir = True
        args.poll = True

    messages = collect_messages(args)
    if not messages:
        if args.stdin or args.inbox_dir or args.poll:
            print("[cs] No inbound messages to process.")
        return

    print(f"[cs] Processing {len(messages)} inbound message(s)…")
    for msg in messages:
        try:
            process_message(msg, dry_run=args.dry_run)
        except Exception as exc:  # noqa: BLE001
            print(f"[cs] ERROR on message {msg.get('message_id','?')}: {exc}")


if __name__ == "__main__":
    main()
