const fs = require("fs/promises");
const path = require("path");

async function main() {
  const args = process.argv.slice(2);
  const portArgIdx = args.indexOf("--port");
  const port = portArgIdx !== -1 ? args[portArgIdx + 1] : "3000";
  
  const secretArgIdx = args.indexOf("--secret");
  const secret = secretArgIdx !== -1 ? args[secretArgIdx + 1] : process.env.ADMIN_SECRET || "";

  const baseUrl = `http://localhost:${port}`;
  const endpoint = `${baseUrl}/api/ops/capacity-test`;

  console.log(`[CAPACITY TEST] Connecting to local server at ${baseUrl}...`);
  console.log(`[CAPACITY TEST] Triggering capacity scoring run via POST to /api/ops/capacity-test...`);

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-secret": secret,
      },
      body: JSON.stringify({ adminSecret: secret }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`[ERROR] Capacity test failed with status ${res.status}:`, errorText);
      process.exit(1);
    }

    const data = await res.json();
    console.log(`\n==================================================`);
    console.log(`[SUCCESS] Capacity scoring run completed!`);
    console.log(`--------------------------------------------------`);
    console.log(`Capacity Score:      ${data.score}/100`);
    console.log(`Total Operations:    ${data.totalOps}`);
    console.log(`Throughput:          ${data.throughputOpsPerSec} ops/sec`);
    console.log(`Average Latency:     ${data.averageLatencyMs} ms`);
    console.log(`Error Rate:          ${data.errorRatePct}%`);
    console.log(`Storage Type:        ${data.storageType}`);
    console.log(`==================================================\n`);

    // Format Markdown Report
    const reportMd = `# AutonomaX Capacity & Performance Verification Report

**Run Timestamp:** ${new Date(data.timestamp).toLocaleString()}
**Target Endpoint:** \`${endpoint}\`
**Operational State:** ${data.score >= 90 ? "🟢 READY (HIGH CAPACITY)" : data.score >= 70 ? "🟡 DEGRADED" : "🔴 UNSTABLE"}

---

## Performance Summary

| Metric | Measured Value | Threshold / Target | Status |
|--------|----------------|--------------------|--------|
| **Capacity Score** | **${data.score}/100** | >= 90/100 | ${data.score >= 90 ? "PASS" : "FAIL"} |
| **Throughput** | **${data.throughputOpsPerSec} ops/sec** | >= 100 ops/sec | ${data.throughputOpsPerSec >= 100 ? "OPTIMAL" : "SUB-OPTIMAL"} |
| **Avg Latency** | **${data.averageLatencyMs} ms** | < 150 ms | ${data.averageLatencyMs <= 150 ? "PASS" : "WARN"} |
| **Error Rate** | **${data.errorRatePct}%** | 0.00% | ${data.errorRatePct === 0 ? "PASS" : "FAIL"} |
| **Storage Backend** | **${data.storageType}** | Durable KV (Upstash/Vercel) | ${data.storageType.toLowerCase().includes("memory") ? "LOCAL MOCK ONLY" : "PROD ACTIVE"} |

---

## Latency Breakdown (Internal)

- **Single Key Write:** ${data.metrics.kvWriteLatencyMs} ms
- **Single Key Read:** ${data.metrics.kvReadLatencyMs} ms
- **Batch Pipeline Write (50 txs):** ${data.metrics.kvBatchWriteLatencyMs} ms
- **Batch Pipeline Cleanup (50 txs):** ${data.metrics.kvBatchDeleteLatencyMs} ms

## Integration Coverage Dials

- **Paddle Checkout:** ${data.integrations.paddle ? "✅ READY" : "❌ UNCONFIGURED"}
- **Shopier Fallback:** ${data.integrations.shopier ? "✅ READY" : "❌ UNCONFIGURED"}
- **Gumroad Fallback:** ${data.integrations.gumroad ? "✅ READY" : "❌ UNCONFIGURED"}
- **Meta CAPI Events:** ${data.integrations.metaCapi ? "✅ READY" : "❌ UNCONFIGURED"}

---

## Detailed Execution Logs

\`\`\`
${data.logs.join("\n")}
\`\`\`

---
*Signed by AutonomaX Automated Revenue Operations Handoff Engine*
`;

    const reportPath = path.join(__dirname, "..", "reports", "capacity-test-run.md");
    await fs.mkdir(path.dirname(reportPath), { recursive: true });
    await fs.writeFile(reportPath, reportMd, "utf-8");
    console.log(`[CAPACITY TEST] Saved structured report to: ${reportPath}`);

    // Also write a JSON log for machine reading/auditing
    const jsonPath = path.join(__dirname, "..", "reports", "capacity-test-run.json");
    await fs.writeFile(jsonPath, JSON.stringify(data, null, 2), "utf-8");
    console.log(`[CAPACITY TEST] Saved JSON log to: ${jsonPath}`);

  } catch (err) {
    console.error("[ERROR] Connection error or execution error during capacity test:", err.message);
    process.exit(1);
  }
}

main();
