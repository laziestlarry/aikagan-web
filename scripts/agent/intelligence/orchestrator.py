import json, time, os, sys
from dataclasses import dataclass, field
from typing import Optional
from concurrent.futures import ThreadPoolExecutor, as_completed

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from intelligence.models import ModelConfig, ModelProvider, FALLBACK_CHAIN
from intelligence.micro_bots import (
    MicroBot, BotResult, BotStatus,
    ContentScraperBot, ContentGeneratorBot, PlatformFormatterBot,
    AnalyticsBot, MemoryBot,
)


@dataclass
class OrchestrationPlan:
    name: str
    bots: list[str]
    context: dict
    parallel: bool = True
    model_chain: list[ModelConfig] = field(default_factory=lambda: list(FALLBACK_CHAIN))


BOT_REGISTRY: dict[str, type[MicroBot]] = {
    "content_scraper": ContentScraperBot,
    "content_generator": ContentGeneratorBot,
    "platform_formatter": PlatformFormatterBot,
    "analytics": AnalyticsBot,
    "memory": MemoryBot,
}


@dataclass
class OrchestrationResult:
    plan_name: str
    results: dict[str, BotResult]
    total_duration_ms: int
    all_succeeded: bool
    summary: dict


def run_plan(plan: OrchestrationPlan) -> OrchestrationResult:
    start = time.time()
    results: dict[str, BotResult] = {}

    bots_to_run = [name for name in plan.bots if name in BOT_REGISTRY]

    if plan.parallel and len(bots_to_run) > 1:
        with ThreadPoolExecutor(max_workers=len(bots_to_run)) as executor:
            futures = {}
            for name in bots_to_run:
                bot = BOT_REGISTRY[name]()
                if hasattr(bot, "model_chain"):
                    bot.model_chain = plan.model_chain
                futures[executor.submit(bot.run, plan.context)] = name
            for future in as_completed(futures):
                name = futures[future]
                try:
                    results[name] = future.result()
                except Exception as e:
                    results[name] = BotResult(bot_name=name, status=BotStatus.FAILED, error=str(e))
    else:
        for name in bots_to_run:
            try:
                bot = BOT_REGISTRY[name]()
                if hasattr(bot, "model_chain"):
                    bot.model_chain = plan.model_chain
                results[name] = bot.run(plan.context)
            except Exception as e:
                results[name] = BotResult(bot_name=name, status=BotStatus.FAILED, error=str(e))

    total_ms = int((time.time() - start) * 1000)
    all_ok = all(r.status == BotStatus.SUCCESS for r in results.values())

    summary = {
        "bots_ran": len(bots_to_run),
        "succeeded": sum(1 for r in results.values() if r.status == BotStatus.SUCCESS),
        "failed": sum(1 for r in results.values() if r.status == BotStatus.FAILED),
        "total_duration_ms": total_ms,
        "bot_durations": {name: r.duration_ms for name, r in results.items()},
    }

    return OrchestrationResult(
        plan_name=plan.name,
        results=results,
        total_duration_ms=total_ms,
        all_succeeded=all_ok,
        summary=summary,
    )


def marketing_wave_plan(wave_number: int = 1, subreddits: Optional[list[str]] = None, product: str = "masterclass-starter") -> OrchestrationPlan:
    return OrchestrationPlan(
        name=f"marketing_wave_{wave_number}",
        bots=["content_scraper", "analytics", "content_generator", "platform_formatter", "memory"],
        context={
            "wave": wave_number,
            "subreddits": subreddits or ["saas", "entrepreneur", "startups", "smallbusiness", "digital_marketing", "sideproject", "webdev"],
            "product": product,
            "platforms": ["twitter", "linkedin", "reddit"],
        },
        parallel=True,
    )


def customer_success_plan(inbound_message: Optional[str] = None) -> OrchestrationPlan:
    return OrchestrationPlan(
        name="customer_success",
        bots=["analytics", "content_generator", "memory"],
        context={
            "inbound_message": inbound_message or "",
            "platform": "email",
            "task": "support_reply",
        },
        parallel=False,
    )


def print_result(result: OrchestrationResult):
    print(f"\n{'='*60}")
    print(f"  Plan: {result.plan_name}")
    print(f"  Status: {'✅ ALL PASS' if result.all_succeeded else '❌ PARTIAL FAIL'}")
    print(f"  Duration: {result.total_duration_ms}ms")
    print(f"  Bots: {result.summary['succeeded']}/{result.summary['bots_ran']} succeeded")
    print(f"{'='*60}")
    for name, r in result.results.items():
        status_icon = "✅" if r.status == BotStatus.SUCCESS else "❌"
        print(f"\n  {status_icon} {name} ({r.duration_ms}ms)")
        if r.error:
            print(f"     Error: {r.error}")
        if r.output:
            out = r.output if isinstance(r.output, str) else json.dumps(r.output, indent=2)[:300]
            print(f"     Output: {out}")


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="AutonomaX Intelligence Orchestrator")
    parser.add_argument("--wave", type=int, default=1, help="Marketing wave number")
    parser.add_argument("--plan", choices=["marketing", "customer_success"], default="marketing", help="Orchestration plan")
    parser.add_argument("--dry-run", action="store_true", help="Print plan without executing")
    args = parser.parse_args()

    plan = marketing_wave_plan(args.wave) if args.plan == "marketing" else customer_success_plan()

    if args.dry_run:
        print(json.dumps({"plan": plan.name, "bots": plan.bots, "context_keys": list(plan.context.keys()), "parallel": plan.parallel}, indent=2))
        sys.exit(0)

    result = run_plan(plan)
    print_result(result)
    sys.exit(0 if result.all_succeeded else 1)
