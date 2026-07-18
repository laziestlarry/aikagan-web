import os, json, time, hashlib, re
from dataclasses import dataclass, field
from typing import Optional
from enum import Enum

import google.genai as google_genai

try:
    from openai import OpenAI
except ImportError:
    OpenAI = None

try:
    import anthropic
except ImportError:
    anthropic = None


class ModelProvider(Enum):
    GEMINI = "gemini"
    OPENAI = "openai"
    CLAUDE = "claude"


@dataclass
class ModelResponse:
    content: str
    provider: ModelProvider
    model_name: str
    latency_ms: int
    input_tokens: int = 0
    output_tokens: int = 0
    cost_usd: float = 0.0


@dataclass
class ModelConfig:
    provider: ModelProvider
    model_name: str
    temperature: float = 0.7
    max_tokens: int = 8192
    json_mode: bool = True


RATE_CENTS = {
    "gemini-2.5-flash":       {"input": 0.075, "output": 0.30},
    "gemini-2.0-flash":       {"input": 0.10,  "output": 0.40},
    "gpt-4o-mini":            {"input": 0.15,  "output": 0.60},
    "gpt-4o":                 {"input": 2.50,  "output": 10.00},
    "claude-3-5-haiku":       {"input": 0.80,  "output": 4.00},
    "claude-3-5-sonnet":      {"input": 3.00,  "output": 15.00},
}

def _default_chain():
    return [
        ModelConfig(ModelProvider.GEMINI, "gemini-2.5-flash",   json_mode=True),
        ModelConfig(ModelProvider.OPENAI, "gpt-4o-mini",        json_mode=True),
        ModelConfig(ModelProvider.CLAUDE, "claude-3-5-haiku",   json_mode=True),
    ]

FALLBACK_CHAIN = _default_chain()


def _load_provider_config(provider: ModelProvider) -> tuple[Optional[str], Optional[str]]:
    if provider == ModelProvider.GEMINI:
        key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_GENERATIVE_AI_API_KEY")
        return key, None
    elif provider == ModelProvider.OPENAI:
        return os.getenv("OPENAI_API_KEY"), os.getenv("OPENAI_ORG_ID")
    elif provider == ModelProvider.CLAUDE:
        return os.getenv("ANTHROPIC_API_KEY"), None
    return None, None


def _query_gemini(cfg: ModelConfig, system: str, prompt: str) -> Optional[str]:
    api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_GENERATIVE_AI_API_KEY")
    if not api_key:
        return None
    client = google_genai.Client(api_key=api_key)
    contents = []
    if system:
        contents.append({"role": "user", "parts": [{"text": f"[System]\n{system}\n\n[Instruction]\n{prompt}"}]})
    else:
        contents.append({"role": "user", "parts": [{"text": prompt}]})
    kwargs = dict(
        model=cfg.model_name,
        contents=contents,
        config={
            "max_output_tokens": cfg.max_tokens,
            "temperature": cfg.temperature,
            "response_mime_type": "application/json" if cfg.json_mode else "text/plain",
        },
    )
    response = client.models.generate_content(**kwargs)
    return response.text


def _query_openai(cfg: ModelConfig, system: str, prompt: str) -> Optional[str]:
    if OpenAI is None:
        return None
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        return None
    client = OpenAI(api_key=api_key, organization=os.getenv("OPENAI_ORG_ID"))
    messages = []
    if system:
        messages.append({"role": "system", "content": system})
    messages.append({"role": "user", "content": prompt})
    kwargs = dict(model=cfg.model_name, messages=messages, temperature=cfg.temperature, max_tokens=cfg.max_tokens)
    if cfg.json_mode:
        kwargs["response_format"] = {"type": "json_object"}
    response = client.chat.completions.create(**kwargs)
    return response.choices[0].message.content


def _query_claude(cfg: ModelConfig, system: str, prompt: str) -> Optional[str]:
    if anthropic is None:
        return None
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        return None
    client = anthropic.Anthropic(api_key=api_key)
    kwargs = dict(model=cfg.model_name, max_tokens=cfg.max_tokens, temperature=cfg.temperature, messages=[{"role": "user", "content": prompt}])
    if system:
        kwargs["system"] = system
    response = client.messages.create(**kwargs)
    return response.content[0].text


QUERY_MAP = {
    ModelProvider.GEMINI: _query_gemini,
    ModelProvider.OPENAI: _query_openai,
    ModelProvider.CLAUDE: _query_claude,
}


def query_model(cfg: ModelConfig, system: str = "", prompt: str = "") -> ModelResponse:
    start = time.time()
    fn = QUERY_MAP.get(cfg.provider)
    if not fn:
        raise ValueError(f"Unknown provider: {cfg.provider}")
    content = fn(cfg, system, prompt)
    latency = int((time.time() - start) * 1000)
    return ModelResponse(
        content=content or "",
        provider=cfg.provider,
        model_name=cfg.model_name,
        latency_ms=latency,
    )


def query_with_fallback(system: str = "", prompt: str = "", chain: Optional[list[ModelConfig]] = None) -> ModelResponse:
    chain = chain or FALLBACK_CHAIN
    errors = []
    for cfg in chain:
        try:
            api_key, _ = _load_provider_config(cfg.provider)
            if not api_key:
                errors.append(f"{cfg.provider.value}: no API key configured")
                continue
            return query_model(cfg, system, prompt)
        except Exception as e:
            errors.append(f"{cfg.provider.value}: {e}")
            continue
    raise RuntimeError(f"All models failed: {'; '.join(errors)}")


def estimate_cost(response: ModelResponse) -> float:
    rates = RATE_CENTS.get(response.model_name)
    if not rates:
        return 0.0
    return (response.input_tokens * rates["input"] + response.output_tokens * rates["output"]) / 100
