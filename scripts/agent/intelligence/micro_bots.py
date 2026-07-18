import json, time, hashlib, os, sys
from dataclasses import dataclass, field
from typing import Any, Optional
from enum import Enum

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from intelligence.models import query_with_fallback, ModelConfig, ModelProvider, FALLBACK_CHAIN


class BotStatus(Enum):
    IDLE = "idle"
    RUNNING = "running"
    SUCCESS = "success"
    FAILED = "failed"


@dataclass
class BotResult:
    bot_name: str
    status: BotStatus
    output: Any = None
    error: Optional[str] = None
    duration_ms: int = 0
    model_used: Optional[str] = None


class MicroBot:
    name: str = "base"
    description: str = ""
    model_chain: list[ModelConfig] = field(default_factory=lambda: list(FALLBACK_CHAIN))

    def __init__(self):
        self.status = BotStatus.IDLE

    def run(self, context: dict) -> BotResult:
        raise NotImplementedError

    def _query(self, system: str, prompt: str) -> str:
        resp = query_with_fallback(system=system, prompt=prompt, chain=self.model_chain)
        return resp.content

    def _json(self, system: str, prompt: str) -> dict:
        raw = self._query(system, prompt)
        try:
            return json.loads(raw)
        except json.JSONDecodeError:
            start = raw.find("{")
            end = raw.rfind("}") + 1
            if start >= 0 and end > start:
                return json.loads(raw[start:end])
            raise


class ContentScraperBot(MicroBot):
    name = "content_scraper"
    description = "Scrapes and scores Reddit + HN signals"

    @staticmethod
    def _fetch_reddit(subreddits: list[str], limit: int = 5) -> list[dict]:
        import httpx
        results = []
        for sub in subreddits:
            try:
                r = httpx.get(f"https://www.reddit.com/r/{sub}/hot.json?limit={limit}", headers={"User-Agent": "AIKAGAN-ProfitOS/1.0"}, timeout=10)
                if r.status_code != 200:
                    continue
                data = r.json()
                for post in data.get("data", {}).get("children", []):
                    p = post["data"]
                    results.append({
                        "source": "reddit",
                        "subreddit": sub,
                        "title": p.get("title", ""),
                        "score": p.get("score", 0),
                        "comments": p.get("num_comments", 0),
                        "url": f"https://reddit.com{p.get('permalink', '')}",
                        "engagement": p.get("score", 0) + p.get("num_comments", 0) * 2,
                    })
            except Exception:
                continue
        return sorted(results, key=lambda x: x["engagement"], reverse=True)[:15]

    @staticmethod
    def _fetch_hn(limit: int = 10) -> list[dict]:
        import httpx
        try:
            r = httpx.get("https://hacker-news.firebaseio.com/v0/topstories.json", timeout=10)
            ids = r.json()[:limit]
            results = []
            for sid in ids:
                try:
                    s = httpx.get(f"https://hacker-news.firebaseio.com/v0/item/{sid}.json", timeout=10).json()
                    if s and s.get("score", 0) > 5:
                        results.append({
                            "source": "hackernews",
                            "title": s.get("title", ""),
                            "score": s.get("score", 0),
                            "url": s.get("url", f"https://news.ycombinator.com/item?id={sid}"),
                            "engagement": s.get("score", 0),
                        })
                except Exception:
                    continue
            return sorted(results, key=lambda x: x["engagement"], reverse=True)
        except Exception:
            return []

    def run(self, context: dict) -> BotResult:
        start = time.time()
        subreddits = context.get("subreddits", ["saas", "entrepreneur", "startups", "smallbusiness", "digital_marketing"])
        reddit_posts = self._fetch_reddit(subreddits)
        hn_posts = self._fetch_hn()
        return BotResult(
            bot_name=self.name,
            status=BotStatus.SUCCESS,
            output={"reddit": reddit_posts, "hackernews": hn_posts},
            duration_ms=int((time.time() - start) * 1000),
        )


class ContentGeneratorBot(MicroBot):
    name = "content_generator"
    description = "Generates platform-native posts from signals using multi-model AI"

    def run(self, context: dict) -> BotResult:
        start = time.time()
        signals = context.get("signals", [])
        platform = context.get("platform", "twitter")
        product = context.get("product", "masterclass-starter")
        tier = context.get("tier", "starter")

        system = "You are an expert marketing copywriter for AutonomaX ProfitOS. Generate platform-native content that converts."
        prompt = json.dumps({
            "task": "generate_post",
            "platform": platform,
            "product_slug": product,
            "tier": tier,
            "signals": signals[:3],
            "requirements": {
                "max_length": 280 if platform == "twitter" else 500,
                "include_cta": True,
                "tone": "authoritative but accessible",
                "format": "json",
            },
            "output_schema": {
                "post_body": "string",
                "cta_text": "string",
                "cta_url_params": "object with utm_source, utm_medium, utm_campaign",
                "hashtags": ["string"],
                "engagement_hook": "string",
            },
        })
        output = self._json(system, prompt)
        return BotResult(
            bot_name=self.name,
            status=BotStatus.SUCCESS,
            output=output,
            duration_ms=int((time.time() - start) * 1000),
        )


class PlatformFormatterBot(MicroBot):
    name = "platform_formatter"
    description = "Formats raw content for specific social platforms"

    PLATFORM_SPECS = {
        "twitter": {"max": 280, "style": "concise, hook-first"},
        "linkedin": {"max": 3000, "style": "professional, story-driven"},
        "reddit": {"max": 10000, "style": "value-first, conversational"},
        "instagram": {"max": 2200, "style": "visual, emotional"},
        "facebook": {"max": 63206, "style": "conversational, shareable"},
        "threads": {"max": 500, "style": "casual, trend-aware"},
        "bluesky": {"max": 300, "style": "conversational, link-included"},
    }

    def run(self, context: dict) -> BotResult:
        start = time.time()
        raw_content = context.get("content", "")
        platform = context.get("target_platform", "twitter")
        spec = self.PLATFORM_SPECS.get(platform, {"max": 500, "style": "general"})

        system = f"You format marketing content for {platform}. Max {spec['max']} chars. Style: {spec['style']}."
        prompt = json.dumps({
            "task": "format_for_platform",
            "platform": platform,
            "raw_content": raw_content[:2000],
            "include_cta": context.get("include_cta", True),
            "cta_text": context.get("cta_text", ""),
            "output_schema": {
                "formatted_body": "string",
                "char_count": "integer",
                "fits_within_limit": "boolean",
                "suggested_hashtags": ["string"],
            },
        })
        output = self._json(system, prompt)
        return BotResult(
            bot_name=self.name,
            status=BotStatus.SUCCESS,
            output=output,
            duration_ms=int((time.time() - start) * 1000),
        )


class AnalyticsBot(MicroBot):
    name = "analytics_bot"
    description = "Scores and ranks content opportunities by predicted conversion"

    def run(self, context: dict) -> BotResult:
        start = time.time()
        signals = context.get("signals", [])
        historical_ctr = context.get("historical_ctr", 0.02)

        system = "You are a revenue analytics bot. Score content opportunities by predicted conversion potential."
        prompt = json.dumps({
            "task": "score_opportunities",
            "opportunities": signals[:10],
            "historical_ctr": historical_ctr,
            "output_schema": {
                "ranked": [{
                    "title": "string",
                    "predicted_ctr": "float (0-1)",
                    "predicted_conversions": "integer",
                    "priority": "high|medium|low",
                    "reasoning": "string",
                }],
                "summary": {
                    "top_opportunity": "string",
                    "total_predicted_value": "float",
                },
            },
        })
        output = self._json(system, prompt)
        return BotResult(
            bot_name=self.name,
            status=BotStatus.SUCCESS,
            output=output,
            duration_ms=int((time.time() - start) * 1000),
        )


class MemoryBot(MicroBot):
    name = "memory_bot"
    description = "Persists agent state to KV for cross-run memory"

    def run(self, context: dict) -> BotResult:
        start = time.time()
        action = context.get("action", "store")
        key = context.get("key", "agent:memory:default")
        value = context.get("value")

        try:
            import httpx
            kv_url = os.getenv("KV_REST_API_URL", "")
            kv_token = os.getenv("KV_REST_API_TOKEN", "")
            if not kv_url or not kv_token:
                return BotResult(bot_name=self.name, status=BotStatus.SUCCESS, output={"note": "KV not configured, using local memory"}, duration_ms=0)

            if action == "store" and value:
                r = httpx.put(f"{kv_url}/set/{key}", json={"value": json.dumps(value)}, headers={"Authorization": f"Bearer {kv_token}"}, timeout=5)
                ok = r.status_code == 200
            elif action == "retrieve":
                r = httpx.get(f"{kv_url}/get/{key}", headers={"Authorization": f"Bearer {kv_token}"}, timeout=5)
                value = json.loads(r.json().get("result", "null")) if r.status_code == 200 else None
                ok = r.status_code == 200
            else:
                ok = False

            return BotResult(
                bot_name=self.name,
                status=BotStatus.SUCCESS if ok else BotStatus.FAILED,
                output={"key": key, "action": action, "ok": ok},
                duration_ms=int((time.time() - start) * 1000),
            )
        except Exception as e:
            return BotResult(bot_name=self.name, status=BotStatus.FAILED, error=str(e), duration_ms=int((time.time() - start) * 1000))
