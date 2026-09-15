"""
RA6 Hand-Off Bus — Standardized agent-to-agent work transfer.
Enforces: no hand-off without artifact, score >= 4, valid gate status.
"""
import json, uuid, os
from datetime import datetime, timezone
from typing import Optional, Dict, Any, List
from dataclasses import dataclass, field, asdict
from enum import Enum

class GateStatus(str, Enum):
    PASS = "PASS"
    CONDITIONAL = "CONDITIONAL"
    FAIL = "FAIL"

class BusLevel(str, Enum):
    L0_INTAKE = "L0_INTAKE"; L1_STRATEGY = "L1_STRATEGY"
    L2_DESIGN = "L2_DESIGN"; L3_BUILD = "L3_BUILD"
    L4_TEST = "L4_TEST"; L5_DEPLOY = "L5_DEPLOY"
    L6_REVENUE = "L6_REVENUE"; L7_GOVERNANCE = "L7_GOVERNANCE"
    L8_SCALE = "L8_SCALE"

@dataclass
class Handoff:
    handoff_id: str = field(default_factory=lambda: f"HO-{datetime.now(timezone.utc).strftime('%Y%m%d')}-{uuid.uuid4().hex[:6].upper()}")
    parent_id: Optional[str] = None
    from_agent: str = ""
    to_agent: str = ""
    phase: str = BusLevel.L0_INTAKE.value
    status: str = "PENDING"
    priority: str = "P1"
    objective: str = ""
    context: str = ""
    artifact: Dict[str, Any] = field(default_factory=dict)
    quality_score: float = 0.0
    gate_status: str = GateStatus.FAIL.value
    notes: str = ""
    created_at: str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    updated_at: Optional[str] = None

    def validate(self) -> bool:
        if not self.artifact:
            raise ValueError("HAND-OFF REJECTED: No artifact attached.")
        if self.quality_score < 4.0:
            raise ValueError(f"HAND-OFF REJECTED: Quality score {self.quality_score} < 4.0")
        if self.gate_status not in [g.value for g in GateStatus]:
            raise ValueError(f"HAND-OFF REJECTED: Invalid gate status: {self.gate_status}")
        return True

    def to_json(self) -> str:
        return json.dumps(asdict(self), indent=2, default=str)

class HandoffBus:
    def __init__(self, storage_path: str = "evidence/handoff_bus.jsonl"):
        self.storage_path = storage_path
        os.makedirs(os.path.dirname(storage_path), exist_ok=True)
        if not os.path.exists(storage_path):
            open(storage_path, 'w').close()

    def submit(self, handoff: Handoff) -> Handoff:
        handoff.validate()
        handoff.status = "PASS" if handoff.quality_score >= 4.5 else "CONDITIONAL_PASS"
        handoff.updated_at = datetime.now(timezone.utc).isoformat()
        with open(self.storage_path, 'a') as f:
            f.write(handoff.to_json() + "\n")
        return handoff

    def get_handoffs(self, agent: str = None, phase: str = None) -> List[Handoff]:
        results = []
        try:
            with open(self.storage_path, 'r') as f:
                for line in f:
                    if not line.strip(): continue
                    data = json.loads(line)
                    if agent and data.get("to_agent") != agent and data.get("from_agent") != agent: continue
                    if phase and data.get("phase") != phase: continue
                    results.append(Handoff(**{k: v for k, v in data.items() if k in Handoff.__dataclass_fields__}))
        except FileNotFoundError:
            pass
        return results

    def get_audit_trail(self, handoff_id: str) -> List[Dict]:
        trail = []
        for h in self.get_handoffs():
            if h.handoff_id == handoff_id or h.parent_id == handoff_id:
                trail.append(asdict(h))
        return trail
