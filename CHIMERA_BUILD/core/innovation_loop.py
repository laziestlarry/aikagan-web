"""
RA6 Innovation Loop — Experience → Capture → Analyze → Propose → Test → Deploy → Version.
"""
import json, os, uuid
from typing import Dict, List, Optional
from dataclasses import dataclass, field
from datetime import datetime, timezone

@dataclass
class Lesson:
    lesson_id: str = field(default_factory=lambda: f"LES-{uuid.uuid4().hex[:8].upper()}")
    source_agent: str = ""
    category: str = ""  # prompt | workflow | model | architecture | sop | persona
    description: str = ""
    evidence: List[str] = field(default_factory=list)
    proposed_upgrade: Optional[str] = None
    status: str = "CAPTURED"
    impact_score: float = 0.0
    created_at: str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class InnovationLoop:
    def __init__(self, storage_path: str = "evidence/lessons.jsonl"):
        self.storage_path = storage_path
        os.makedirs(os.path.dirname(storage_path), exist_ok=True)
        if not os.path.exists(storage_path):
            open(storage_path, 'w').close()

    def capture_lesson(self, lesson: Lesson) -> Lesson:
        with open(self.storage_path, 'a') as f:
            f.write(json.dumps(lesson.__dict__, default=str) + "\n")
        return lesson

    def analyze_lessons(self) -> List[Dict]:
        lessons = []
        with open(self.storage_path, 'r') as f:
            for line in f:
                if line.strip(): lessons.append(json.loads(line))
        by_category = {}
        for l in lessons:
            by_category.setdefault(l.get("category", "unknown"), []).append(l)
        patterns = []
        for cat, items in by_category.items():
            if len(items) >= 3:
                patterns.append({"category": cat, "frequency": len(items),
                                 "common_theme": self._extract_theme(items), "upgrade_candidate": True})
        return patterns

    def propose_upgrade(self, pattern: Dict) -> Dict:
        return {
            "upgrade_id": f"UPG-{uuid.uuid4().hex[:8].upper()}",
            "category": pattern.get("category"),
            "description": f"Upgrade {pattern['category']} based on {pattern['frequency']} lessons",
            "evidence": pattern.get("common_theme", ""),
            "status": "PROPOSED", "requires_approval": True,
            "impact_estimate": min(0.3, pattern["frequency"] * 0.05)
        }

    def _extract_theme(self, items: List[Dict]) -> str:
        descs = [i.get("description", "")[:50] for i in items]
        return f"Recurring: {'; '.join(descs[:3])}"
