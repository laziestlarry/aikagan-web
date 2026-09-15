"""
RA6 Revenue Attribution — Track which plays, agents, and pipelines generate revenue.
"""
from typing import Dict, List
from dataclasses import dataclass, field
from datetime import datetime, timezone
import json, os

@dataclass
class RevenueRecord:
    record_id: str
    play_id: str
    agent_id: str
    pipeline_stage: str
    amount: float
    currency: str = "USD"
    source: str = "direct"
    confidence: float = 1.0
    timestamp: str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    metadata: Dict = field(default_factory=dict)

class RevenueTracker:
    def __init__(self, storage_path: str = "evidence/revenue_records.jsonl"):
        self.storage_path = storage_path
        os.makedirs(os.path.dirname(storage_path), exist_ok=True)
        if not os.path.exists(storage_path):
            open(storage_path, 'w').close()

    def record(self, record: RevenueRecord):
        with open(self.storage_path, 'a') as f:
            f.write(json.dumps(record.__dict__, default=str) + "\n")

    def get_revenue_by_play(self, play_id: str = None) -> Dict[str, float]:
        totals = {}
        with open(self.storage_path, 'r') as f:
            for line in f:
                if not line.strip(): continue
                r = json.loads(line)
                if play_id and r.get("play_id") != play_id: continue
                key = r.get("play_id", "unknown")
                totals[key] = totals.get(key, 0) + float(r.get("amount", 0))
        return totals

    def get_revenue_by_agent(self) -> Dict[str, float]:
        totals = {}
        with open(self.storage_path, 'r') as f:
            for line in f:
                if not line.strip(): continue
                r = json.loads(line)
                key = r.get("agent_id", "unknown")
                totals[key] = totals.get(key, 0) + float(r.get("amount", 0))
        return totals

    def get_pipeline_revenue(self, since: str = None) -> Dict[str, float]:
        totals = {}
        with open(self.storage_path, 'r') as f:
            for line in f:
                if not line.strip(): continue
                r = json.loads(line)
                if since and r.get("timestamp", "") < since: continue
                stage = r.get("pipeline_stage", "unknown")
                totals[stage] = totals.get(stage, 0) + float(r.get("amount", 0))
        return totals
