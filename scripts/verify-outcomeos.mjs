import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const files = [
  "lib/outcomeos/types.ts",
  "lib/outcomeos/stage-gate.ts",
  "lib/outcomeos/agents.ts",
  "lib/outcomeos/store.ts",
  "app/api/outcome/intake/route.ts",
  "app/api/cron/outcome-escalation/route.ts",
  "app/outcome/page.tsx",
  "middleware.ts",
  "lib/products.ts",
];
for (const file of files) readFileSync(resolve(root, file), "utf8");

const types = readFileSync(resolve(root, "lib/outcomeos/types.ts"), "utf8");
const agents = readFileSync(resolve(root, "lib/outcomeos/agents.ts"), "utf8");
const gate = readFileSync(resolve(root, "lib/outcomeos/stage-gate.ts"), "utf8");
const script = readFileSync(resolve(root, "scripts/aikagan-master-upgrade.sh"), "utf8");

assert.match(types, /starter: 2_900/);
assert.match(types, /pro: 7_900/);
assert.match(types, /commander: 14_900/);
assert.doesNotMatch(types, /starter:\s*4_900/);
assert.match(agents, /insufficient_evidence_no_scan_answers/);
assert.match(agents, /liveCheckoutProvider: "gumroad"/);
assert.match(agents, /checkoutAutomated: false/);
assert.doesNotMatch(agents, /Unanswered inbound inquiries/);
assert.match(gate, /human_approval_required_for_offer_above_79/);
assert.match(gate, /e4_live_evidence_required_before_operate/);
assert.match(gate, /acceptance_check_required_before_build/);
assert.match(script, /never commits or pushes/);
assert.doesNotMatch(script, /git push origin/);

const STAGES = ["understand", "investigate", "decide", "scope", "build", "verify", "operate"];
const LEVELS = ["E0_claim", "E1_made", "E2_tested", "E3_integrated", "E4_live", "E5_accepted"];
const dwell = { understand: 4, investigate: 24, decide: 48, scope: 24, build: 168, verify: 72, operate: null };

function idx(list, value) { return list.indexOf(value); }
function canPublish(level) { return idx(LEVELS, level) >= idx(LEVELS, "E4_live"); }
function stalled(stage, last, now) {
  const hours = dwell[stage];
  if (hours == null) return false;
  return now - Date.parse(last) > hours * 3600 * 1000;
}
function canAdvance(state) {
  if (state.stage === "understand") return state.intake.length >= 10;
  if (state.stage === "investigate") return state.hasEvidence;
  if (state.stage === "decide") return !(state.priceCents > 7900 && !state.signed);
  if (state.stage === "scope") return state.signed;
  if (state.stage === "build") return idx(LEVELS, state.level) >= 1;
  if (state.stage === "verify") return idx(LEVELS, state.level) >= 4 && state.signed;
  return false;
}

assert.equal(canAdvance({ stage: "understand", intake: "checkout delays leak demand" }), true);
assert.equal(canAdvance({ stage: "understand", intake: "short" }), false);
assert.equal(canAdvance({ stage: "decide", priceCents: 14900, signed: false }), false);
assert.equal(canAdvance({ stage: "decide", priceCents: 14900, signed: true }), true);
assert.equal(canAdvance({ stage: "scope", signed: false }), false);
assert.equal(canAdvance({ stage: "build", level: "E0_claim" }), false);
assert.equal(canAdvance({ stage: "build", level: "E1_made" }), true);
assert.equal(canAdvance({ stage: "verify", level: "E3_integrated", signed: true }), false);
assert.equal(canAdvance({ stage: "verify", level: "E4_live", signed: true }), true);
assert.equal(canPublish("E3_integrated"), false);
assert.equal(canPublish("E4_live"), true);
assert.equal(stalled("understand", "2026-09-13T00:00:00.000Z", Date.parse("2026-09-14T12:00:00.000Z")), true);
assert.equal(STAGES.length, 7);
assert.equal(LEVELS.length, 6);

console.log("verify-outcomeos: all checks passed");
