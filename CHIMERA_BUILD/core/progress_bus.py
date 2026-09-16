"""
RA6 Progress Bus L0-L8 — Event-driven execution tracking.
Every stage transition emits an event. Full audit trail.
"""
import json, os
from datetime import datetime, timezone
from typing import Dict, Any, List, Callable
from enum import Enum

class BusEventType(str, Enum):
    STAGE_ENTERED = "STAGE_ENTERED"
    STAGE_COMPLETED = "STAGE_COMPLETED"
    GATE_PASSED = "GATE_PASSED"
    GATE_FAILED = "GATE_FAILED"
    HANDOFF_SUBMITTED = "HANDOFF_SUBMITTED"
    ESCALATION = "ESCALATION"
    REVENUE_RECORDED = "REVENUE_RECORDED"

class ProgressBus:
    def __init__(self, storage_path: str = "evidence/progress_bus.jsonl"):
        self.storage_path = storage_path
        self._handlers: Dict[str, List[Callable]] = {}
        os.makedirs(os.path.dirname(storage_path), exist_ok=True)
        if not os.path.exists(storage_path):
            open(storage_path, 'w').close()

    def emit(self, event_type: BusEventType, level: str, payload: Dict[str, Any]):
        event = {
            "event_id": f"EVT-{datetime.now(timezone.utc).strftime('%Y%m%d%H%M%S%f')}",
            "event_type": event_type.value, "level": level,
            "payload": payload, "timestamp": datetime.now(timezone.utc).isoformat()
        }
        with open(self.storage_path, 'a') as f:
            f.write(json.dumps(event) + "\n")
        for handler in self._handlers.get(event_type.value, []):
            handler(event)
        return event

    def on(self, event_type: BusEventType, handler: Callable):
        self._handlers.setdefault(event_type.value, []).append(handler)

    def get_events(self, level: str = None, since: str = None) -> List[Dict]:
        events = []
        with open(self.storage_path, 'r') as f:
            for line in f:
                if not line.strip(): continue
                e = json.loads(line)
                if level and e.get("level") != level: continue
                if since and e.get("timestamp", "") < since: continue
                events.append(e)
        return events

    def get_pipeline_status(self) -> Dict[str, Any]:
        status = {f"L{i}": {"events": 0, "last_activity": None} for i in range(9)}
        for e in self.get_events():
            lvl = e.get("level", "L0")
            if lvl in status:
                status[lvl]["events"] += 1
                status[lvl]["last_activity"] = e["timestamp"]
        return status
