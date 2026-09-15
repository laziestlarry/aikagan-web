"""
RA6 Scoring Gates — 0-5 scoring per stage. Below 4 = FAIL, correct before pass.
Gates G1-G8 mapped to pipeline stages L0-L8.
"""
from typing import Dict, Any
from dataclasses import dataclass

@dataclass
class GateResult:
    gate_id: str
    score: float
    verdict: str
    criteria_met: bool
    notes: str

class ScoringGateEngine:
    GATES = {
        "G1_DATA_QUALITY": {"criteria": ["record_completeness >= 0.95", "no_duplicates"], "failure_action": "return_to_intake"},
        "G2_QUALIFICATION": {"criteria": ["lead_score >= threshold", "fit_confirmed"], "failure_action": "nurture_or_disqualify"},
        "G3_ADVANCEMENT": {"criteria": ["stage_criteria_met", "next_action_defined"], "failure_action": "hold_or_regress"},
        "G4_CLOSE": {"criteria": ["contract_signed", "payment_terms_agreed"], "failure_action": "return_to_negotiation"},
        "G5_ACTIVATION": {"criteria": ["customer_activated", "value_delivered"], "failure_action": "escalate_to_human"},
        "G6_RETENTION": {"criteria": ["health_score >= threshold", "renewal_likely"], "failure_action": "churn_prevention_play"},
        "G7_EXPANSION": {"criteria": ["expansion_criteria_met", "upsell_ready"], "failure_action": "nurture"},
        "G8_ADVOCACY": {"criteria": ["referral_generated", "satisfaction >= threshold"], "failure_action": "feedback_loop"}
    }

    def evaluate(self, gate_id: str, output_data: Dict[str, Any]) -> GateResult:
        gate = self.GATES.get(gate_id)
        if not gate:
            return GateResult(gate_id, 0.0, "FAIL", False, f"Unknown gate: {gate_id}")
        scores = [self._evaluate_criterion(c, output_data) for c in gate["criteria"]]
        avg = sum(scores) / len(scores) if scores else 0.0
        verdict = "PASS" if avg >= 4.0 else ("CONDITIONAL" if avg >= 3.0 else "FAIL")
        return GateResult(gate_id, round(avg, 2), verdict, all(s >= 3.5 for s in scores),
                          f"Criteria scores: {[round(s,1) for s in scores]}")

    def _evaluate_criterion(self, criterion: str, data: Dict) -> float:
        if ">=" in criterion:
            field, threshold_str = criterion.split(">=")
            field = field.strip()
            try:
                threshold = float(threshold_str.strip())
                actual = float(data.get(field, 0))
                if actual >= threshold: return 5.0
                elif actual >= threshold * 0.9: return 4.0
                elif actual >= threshold * 0.7: return 3.0
                else: return max(1.0, actual / threshold * 3)
            except (ValueError, TypeError):
                return 2.0
        return 5.0 if data.get(criterion, False) else 1.0
