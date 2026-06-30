"""
AIKAGAN — Make.com Provisioner

Auto-uploads the two scenario blueprints in make_blueprints/ to Make.com,
captures the resulting Custom Webhook URLs, writes them back into
.env.fulfillment, and activates both scenarios. Idempotent: re-runs upsert
instead of duplicating.

Prerequisites in .env.fulfillment:
  MAKE_API_KEY       — generate at https://www.make.com/en/help/app/api
  MAKE_TEAM_ID       — numeric ID (find via `python provision_make.py --list-teams`)
  MAKE_ZONE          — defaults to "us1.make.com"; set "eu1.make.com" / "eu2.make.com" if relevant

Usage:
  python provision_make.py --list-teams
  python provision_make.py                       # provision both scenarios
  python provision_make.py --only omnichannel    # provision a single blueprint
  python provision_make.py --activate            # provision + flip ON
"""
from __future__ import annotations

import argparse
import json
import os
import re
import sys
from pathlib import Path
from typing import Any

import httpx
from dotenv import load_dotenv

SCRIPT_DIR = Path(__file__).resolve().parent
ROOT_DIR = SCRIPT_DIR.parents[1]
BLUEPRINT_DIR = SCRIPT_DIR / "make_blueprints"


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

MAKE_API_KEY = os.getenv("MAKE_API_KEY", "")
MAKE_TEAM_ID = os.getenv("MAKE_TEAM_ID", "")
MAKE_ZONE = os.getenv("MAKE_ZONE", "us1.make.com")
API_BASE = f"https://{MAKE_ZONE}/api/v2"

BLUEPRINTS = {
    "omnichannel": {
        "file": "omnichannel-router.blueprint.json",
        "env_var": "MAKE_OMNICHANNEL_WEBHOOK_URL",
        "scenario_name_marker": "AIKAGAN — Omnichannel Router",
        "hook_name": "AIKAGAN omnichannel hook",
        "hook_id_env": "MAKE_OMNI_HOOK_ID",
        "placeholder_hook": "AIKAGAN_OMNI_HOOK",
    },
    "customer-success": {
        "file": "customer-success-router.blueprint.json",
        "env_var": "MAKE_CUSTOMER_SERVICE_WEBHOOK_URL",
        "scenario_name_marker": "AIKAGAN — Customer Success Router",
        "hook_name": "AIKAGAN customer-success hook",
        "hook_id_env": "MAKE_CS_HOOK_ID",
        "placeholder_hook": "AIKAGAN_CS_HOOK",
    },
}

# Make.com's "Custom webhook" trigger uses this type-name internally.
HOOK_TYPE_NAME = "gateway-webhook"


def _headers() -> dict[str, str]:
    if not MAKE_API_KEY:
        raise SystemExit("Missing MAKE_API_KEY in .env.fulfillment.")
    return {
        "Authorization": f"Token {MAKE_API_KEY}",
        "Content-Type": "application/json",
    }


class MakeAPIError(SystemExit):
    pass


def _missing_scope(body: str) -> str | None:
    """Extract 'Required scope: …' from a Make.com error body if present."""
    try:
        data = json.loads(body)
        detail = data.get("detail") or ""
        if "Required scope" in detail:
            return detail.split("Required scope:", 1)[1].strip()
    except Exception:
        return None
    return None


def _explain_http_error(exc: httpx.HTTPStatusError) -> "MakeAPIError":
    status = exc.response.status_code
    url = str(exc.request.url)
    body = exc.response.text[:400]
    hints: list[str] = []
    missing = _missing_scope(body)
    if missing:
        hints += [
            f"Make.com says the token is missing scope: {missing}",
            "  • Regenerate the token at Make.com → Profile → API.",
            "  • Recommended scope set for AIKAGAN provisioner:",
            "      scenarios:read, scenarios:write, scenarios:run,",
            "      hooks:read, hooks:write,",
            "      connections:read, teams:read",
        ]
    elif status == 401:
        hints += [
            "401 → the API token isn't accepted by this zone.",
            f"  • Confirm MAKE_ZONE matches the zone where you created the token (current: {MAKE_ZONE}).",
            "  • Common zones: us1.make.com, us2.make.com, eu1.make.com, eu2.make.com.",
            "  • Make.com API tokens are zone-scoped — a token from us1 will 401 on eu2.",
        ]
    if status in (400, 404) and "teamId" in url:
        hints += [
            f"{status} → teamId looks invalid (current: {MAKE_TEAM_ID!r}).",
            "  • Team IDs are numeric. Run --list-teams to find yours.",
            "  • If you pasted an org slug (e.g. 'IWS'), use --list-orgs first.",
        ]
    if status == 403 and not missing:
        hints += [
            "403 → the token authenticates but lacks scope for this call.",
            "  • Regenerate at Make.com → Profile → API with the full scope list above.",
        ]
    msg = (
        f"\n[make] HTTP {status} on {url}\n"
        f"[make] Response body: {body}\n"
        + ("\n".join(hints) if hints else "")
    )
    return MakeAPIError(msg)


class ScopeMissing(Exception):
    """Raised internally so we can fall back instead of aborting."""
    def __init__(self, scope: str):
        super().__init__(scope)
        self.scope = scope


def _safe_get(client: httpx.Client, path: str, **kw) -> httpx.Response | None:
    """GET that returns None (instead of exiting) when the only problem is a
    missing read-scope. Lets the provisioner degrade gracefully."""
    try:
        r = client.get(path, **kw)
        r.raise_for_status()
        return r
    except MakeAPIError as exc:
        # If it's a scope error, surface it as ScopeMissing so caller decides.
        msg = str(exc)
        if "Required scope:" in msg:
            scope = msg.split("Required scope:", 1)[1].split("\n", 1)[0].strip()
            raise ScopeMissing(scope) from None
        raise


def _client() -> httpx.Client:
    """httpx.Client with our auth + a friendly error hook."""
    def _raise(response: httpx.Response) -> None:
        if response.is_error:
            # Consume the body now so _explain_http_error can read it later.
            try:
                response.read()
            except Exception:
                pass
            try:
                response.raise_for_status()
            except httpx.HTTPStatusError as exc:
                raise _explain_http_error(exc) from None

    return httpx.Client(
        base_url=API_BASE,
        headers=_headers(),
        timeout=30.0,
        event_hooks={"response": [_raise]},
    )


def _validate_team_id() -> None:
    if not MAKE_TEAM_ID:
        return
    if not MAKE_TEAM_ID.isdigit():
        raise SystemExit(
            f"\n[make] MAKE_TEAM_ID={MAKE_TEAM_ID!r} is not numeric.\n"
            "[make] Make.com team IDs are integers (e.g. 123456).\n"
            "[make] Run:  python scripts/agent/provision_make.py --list-teams\n"
            "[make] If that also fails, you may have pasted an organization slug;\n"
            "[make] try:  python scripts/agent/provision_make.py --list-orgs\n"
        )


# ---------------------------------------------------------------------------
# Team lookup
# ---------------------------------------------------------------------------
def list_teams() -> list[dict[str, Any]]:
    with _client() as c:
        r = c.get("/teams")
        r.raise_for_status()
        return r.json().get("teams", [])


def list_orgs() -> list[dict[str, Any]]:
    with _client() as c:
        r = c.get("/organizations")
        r.raise_for_status()
        return r.json().get("organizations", [])


def print_teams() -> None:
    print(f"[make] Using API base: {API_BASE}")
    teams = list_teams()
    if not teams:
        print("[make] No teams visible to this API key. Check the key's scope and zone.")
        return
    print(f"{'TEAM ID':<10} | ORG ID | NAME")
    print("-" * 60)
    for t in teams:
        print(f"{t.get('id'):<10} | {t.get('organizationId', '—'):<6} | {t.get('name')}")


def print_orgs() -> None:
    print(f"[make] Using API base: {API_BASE}")
    orgs = list_orgs()
    if not orgs:
        print("[make] No organizations visible to this API key.")
        return
    print(f"{'ORG ID':<10} | NAME")
    print("-" * 60)
    for o in orgs:
        print(f"{o.get('id'):<10} | {o.get('name')}")


# ---------------------------------------------------------------------------
# Scenario upsert
# ---------------------------------------------------------------------------
def _find_existing_scenario(name_marker: str) -> int | None:
    """Look up an existing scenario by name. Returns None if the token has no
    scenarios:read scope — the caller will then always create a new scenario,
    which is safe but non-idempotent."""
    with _client() as c:
        try:
            r = _safe_get(c, "/scenarios", params={"teamId": MAKE_TEAM_ID})
        except ScopeMissing as exc:
            print(f"[make] skipping idempotency lookup (missing scope: {exc.scope}); "
                  "will always create a new scenario.")
            return None
        if r is None:
            return None
        for s in r.json().get("scenarios", []):
            if name_marker in (s.get("name") or ""):
                return s.get("id")
    return None


def _create_scenario(blueprint: dict[str, Any]) -> int:
    with _client() as c:
        r = c.post(
            "/scenarios",
            params={"confirmed": "true"},
            json={
                "teamId": int(MAKE_TEAM_ID),
                "blueprint": json.dumps(blueprint),
                "scheduling": json.dumps({"type": "immediately"}),
            },
        )
        r.raise_for_status()
        return r.json()["scenario"]["id"]


# ---------------------------------------------------------------------------
# Webhook hook lifecycle — create before scenario (avoids IM007 / read scope)
# ---------------------------------------------------------------------------
def _create_hook(name: str) -> tuple[int, str]:
    """
    Create a Custom webhook hook. Make.com's gateway-webhook type requires:
      - method:    expose HTTP method as a variable? (false → cleaner payload)
      - headers:   expose headers as variables?      (false → cleaner payload)
      - stringify: keep body as string?              (false → parse JSON)
    Returns (hook_id, url).
    """
    with _client() as c:
        r = c.post(
            "/hooks",
            json={
                "name": name,
                "teamId": int(MAKE_TEAM_ID),
                "typeName": HOOK_TYPE_NAME,
                "method": False,
                "headers": False,
                "stringify": False,
            },
        )
        r.raise_for_status()
        hook = r.json().get("hook", r.json())
        return int(hook["id"]), str(hook["url"])


def _read_hook(hook_id: int) -> tuple[int, str] | None:
    """Look up an existing hook by ID (needs hooks:read)."""
    with _client() as c:
        try:
            r = _safe_get(c, f"/hooks/{hook_id}")
        except ScopeMissing:
            return None
        if r is None:
            return None
        hook = r.json().get("hook", r.json())
        return int(hook["id"]), str(hook["url"])


def get_or_create_hook(cfg: dict[str, Any]) -> tuple[int, str]:
    """
    Resolution order:
      1) MAKE_*_HOOK_ID env var is set → look up that hook by ID
      2) Otherwise → create a fresh hook via POST /hooks
    Returns (hook_id, hook_url). Raises with a clear message on failure.
    """
    env_id = os.getenv(cfg["hook_id_env"], "").strip()
    if env_id:
        if not env_id.isdigit():
            raise SystemExit(
                f"[make] {cfg['hook_id_env']}={env_id!r} is not numeric. "
                "Paste the numeric hook ID from Make.com → Webhooks list."
            )
        existing = _read_hook(int(env_id))
        if existing:
            print(f"[make] reusing existing hook {env_id}")
            return existing
        # Couldn't read it back; trust the user and assume the URL must come
        # from Make.com UI — fail loudly so they paste the URL directly.
        raise SystemExit(
            f"[make] {cfg['hook_id_env']} is set but hook {env_id} could not "
            "be read (token likely missing hooks:read). Open Make.com → "
            "Webhooks, copy the URL, paste it into .env.fulfillment as "
            f"{cfg['env_var']}=…, then unset {cfg['hook_id_env']} or add "
            "hooks:read scope to the token."
        )
    # Create fresh.
    try:
        hook_id, hook_url = _create_hook(cfg["hook_name"])
    except MakeAPIError as exc:
        msg = str(exc)
        if "Required scope" in msg and "hooks:write" in msg:
            raise SystemExit(
                "[make] Cannot create hook — token is missing hooks:write.\n"
                "        Fastest fix: add hooks:write to the token at\n"
                "        Make.com → Profile → API, then re-run.\n"
                "        OR create the hook manually:\n"
                "          1. Make.com → Webhooks → + Add → Custom webhook\n"
                f"         2. Name it '{cfg['hook_name']}'\n"
                "          3. Copy the numeric ID into .env.fulfillment\n"
                f"            {cfg['hook_id_env']}=<numeric ID>\n"
                "          4. Re-run this provisioner.\n"
            ) from None
        raise
    print(f"[make] created hook {hook_id} → {hook_url}")
    return hook_id, hook_url


def _inject_hook_id(blueprint: dict[str, Any], placeholder: str, hook_id: int) -> int:
    """Replace placeholder 'hook' parameter with the real numeric ID. Returns
    the number of modules patched (should be 1 for a single-trigger flow)."""
    count = 0
    for module in blueprint.get("flow", []):
        if module.get("module") == "gateway:CustomWebHook":
            params = module.setdefault("parameters", {})
            if params.get("hook") in (placeholder, None, ""):
                params["hook"] = hook_id
                count += 1
    return count


def _update_scenario(scenario_id: int, blueprint: dict[str, Any]) -> None:
    with _client() as c:
        r = c.patch(
            f"/scenarios/{scenario_id}",
            json={"blueprint": json.dumps(blueprint)},
        )
        r.raise_for_status()


def _activate_scenario(scenario_id: int) -> None:
    with _client() as c:
        r = c.post(f"/scenarios/{scenario_id}/start")
        r.raise_for_status()


def _fetch_hook_url(scenario_id: int) -> str | None:
    """Find the Custom Webhook URL produced by the trigger module. Returns
    None if either scenarios:read or hooks:read scope is missing (the caller
    then tells the user to copy the URL manually from the Make.com UI)."""
    with _client() as c:
        try:
            r = _safe_get(c, f"/scenarios/{scenario_id}/blueprint")
        except ScopeMissing as exc:
            print(f"[make] cannot auto-fetch webhook URL (missing scope: {exc.scope}).")
            return None
        if r is None:
            return None
        blueprint = r.json().get("response", {}).get("blueprint", {})
        for module in blueprint.get("flow", []):
            if module.get("module") == "gateway:CustomWebHook":
                hook = module.get("parameters", {}).get("hook")
                if not hook:
                    continue
                try:
                    rh = _safe_get(c, f"/hooks/{hook}")
                except ScopeMissing as exc:
                    print(f"[make] cannot auto-fetch hook URL (missing scope: {exc.scope}).")
                    return None
                if rh is None:
                    return None
                return rh.json().get("hook", {}).get("url")
    return None


# ---------------------------------------------------------------------------
# .env.fulfillment rewriter
# ---------------------------------------------------------------------------
def update_env_file(updates: dict[str, str]) -> None:
    env_path = ROOT_DIR / ".env.fulfillment"
    if not env_path.exists():
        env_path = SCRIPT_DIR / ".env.fulfillment"
    if not env_path.exists():
        print("[env] no .env.fulfillment found — skipping env writeback.")
        return
    text = env_path.read_text(encoding="utf-8")
    for key, value in updates.items():
        pattern = re.compile(rf'^{re.escape(key)}="[^"]*"', flags=re.MULTILINE)
        replacement = f'{key}="{value}"'
        if pattern.search(text):
            text = pattern.sub(replacement, text)
        else:
            text = text.rstrip() + f"\n{replacement}\n"
        print(f"[env] {key} ← {value[:60]}…")
    env_path.write_text(text, encoding="utf-8")


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
def provision_one(key: str, activate: bool) -> tuple[str, str | None]:
    cfg = BLUEPRINTS[key]
    blueprint_path = BLUEPRINT_DIR / cfg["file"]
    blueprint = json.loads(blueprint_path.read_text(encoding="utf-8"))

    # Step 1 — get or create the webhook hook (gives us the URL up-front).
    hook_id, hook_url = get_or_create_hook(cfg)

    # Step 2 — patch the blueprint to reference the real hook ID.
    patched = _inject_hook_id(blueprint, cfg["placeholder_hook"], hook_id)
    if patched == 0:
        print(f"[make] {key}: WARNING — no CustomWebHook module found to patch.")

    # Step 3 — idempotency: try to reuse an existing scenario if we have read
    # scope; otherwise just create a new one.
    existing = _find_existing_scenario(cfg["scenario_name_marker"])
    if existing:
        print(f"[make] {key}: updating existing scenario {existing}")
        try:
            _update_scenario(existing, blueprint)
            scenario_id = existing
        except MakeAPIError as exc:
            print(f"[make] {key}: update failed ({exc}); creating new instead.")
            scenario_id = _create_scenario(blueprint)
            print(f"[make] {key}: created scenario {scenario_id}")
    else:
        print(f"[make] {key}: creating new scenario")
        scenario_id = _create_scenario(blueprint)
        print(f"[make] {key}: created scenario {scenario_id}")

    print(f"[make] {key}: webhook → {hook_url}")

    if activate:
        try:
            _activate_scenario(scenario_id)
            print(f"[make] {key}: scenario activated ✅")
        except httpx.HTTPStatusError as exc:
            print(f"[make] {key}: activation failed ({exc.response.status_code}). "
                  "Likely needs OAuth connections on the platform modules first.")
        except MakeAPIError as exc:
            print(f"[make] {key}: activation failed — {exc}")

    return cfg["env_var"], hook_url


def main() -> None:
    parser = argparse.ArgumentParser(description="AIKAGAN Make.com provisioner")
    parser.add_argument("--list-teams", action="store_true",
                        help="List Make.com teams visible to MAKE_API_KEY and exit.")
    parser.add_argument("--list-orgs", action="store_true",
                        help="List Make.com organizations visible to MAKE_API_KEY and exit.")
    parser.add_argument("--only", choices=list(BLUEPRINTS.keys()),
                        help="Provision only one blueprint.")
    parser.add_argument("--activate", action="store_true",
                        help="Flip scenarios to ON after upload.")
    args = parser.parse_args()

    if args.list_teams:
        print_teams()
        return
    if args.list_orgs:
        print_orgs()
        return

    if not MAKE_TEAM_ID:
        print("[make] MAKE_TEAM_ID is not set. Run with --list-teams to find yours.")
        sys.exit(1)
    _validate_team_id()
    print(f"[make] Using API base: {API_BASE} | teamId={MAKE_TEAM_ID}")

    keys = [args.only] if args.only else list(BLUEPRINTS.keys())
    updates: dict[str, str] = {}
    for key in keys:
        env_var, hook_url = provision_one(key, activate=args.activate)
        if hook_url:
            updates[env_var] = hook_url

    if updates:
        update_env_file(updates)
        print("[make] Done. Re-export your shell or restart your scheduled job "
              "so the new env vars take effect.")
    else:
        print("[make] No webhook URLs captured — nothing written.")


if __name__ == "__main__":
    main()
