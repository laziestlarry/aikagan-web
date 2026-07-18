const fs = require("fs/promises");
const path = require("path");

async function runSprint(endpoint, secret, payload, reportPrefix) {
  console.log(`[SPRINT] Launching sprint: ${payload.sprintName}...`);
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-secret": secret,
      },
      body: JSON.stringify({ ...payload, adminSecret: secret }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`[ERROR] Sprint "${payload.sprintName}" failed with status ${res.status}:`, errorText);
      return null;
    }

    const data = await res.json();
    console.log(`[SUCCESS] Sprint "${payload.sprintName}" completed. Score: ${data.score}/100`);
    console.log(`[DEBUG] Response data for "${payload.sprintName}":`, JSON.stringify(data, null, 2));

    // Format Markdown Report
    const safeStorage = (data.storageType == null
      ? "in-memory Fallback"
      : typeof data.storageType === "string"
        ? data.storageType
        : (data.storageType && data.storageType.constructor && data.storageType.constructor.name) || "upstash"
    ).toString();

    const reportMd = `# AutonomaX Parallel Sprint Verification Report
## Sprint: ${payload.sprintName}

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
| **Storage Backend** | **${safeStorage}** | Durable KV (Upstash/Vercel) | ${safeStorage.toLowerCase().includes("memory") ? "LOCAL MOCK ONLY" : "PROD ACTIVE"} |

---

## Sprint Metadata

- **Simulated Duration:** ${payload.durationHours ? `${payload.durationHours} hours` : "N/A"}
- **Revenue Target:** ${payload.revenueTarget ? `$${payload.revenueTarget}` : "N/A"}
- **Buyer/Persona Name:** ${payload.buyerName || "N/A"}

---

## Detailed Execution Logs

\`\`\`
${data.logs.join("\n")}
\`\`\`

---
*Signed by AutonomaX Automated Revenue Operations Handoff Engine*
`;

    const reportPath = path.join(__dirname, "..", "reports", `${reportPrefix}.md`);
    await fs.mkdir(path.dirname(reportPath), { recursive: true });
    await fs.writeFile(reportPath, reportMd, "utf-8");
    console.log(`[SPRINT] Saved Markdown report to: ${reportPath}`);

    const jsonPath = path.join(__dirname, "..", "reports", `${reportPrefix}.json`);
    await fs.writeFile(jsonPath, JSON.stringify(data, null, 2), "utf-8");
    console.log(`[SPRINT] Saved JSON log to: ${jsonPath}`);

    return data;
  } catch (err) {
    console.error(`[ERROR] Connection error during sprint "${payload.sprintName}":`, err.message);
    return null;
  }
}

async function main() {
  const args = process.argv.slice(2);
  const portArgIdx = args.indexOf("--port");
  const port = portArgIdx !== -1 ? args[portArgIdx + 1] : "3000";
  
  const secretArgIdx = args.indexOf("--secret");
  const secret = secretArgIdx !== -1 ? args[secretArgIdx + 1] : process.env.ADMIN_SECRET || "";

  const baseUrl = `http://localhost:${port}`;
  const endpoint = `${baseUrl}/api/ops/capacity-test`;

  console.log(`[CAPACITY TEST] Connecting to local server at ${baseUrl}...`);
  console.log(`[CAPACITY TEST] Triggering parallel sprints via POST to /api/ops/capacity-test...`);

  const sprint1 = {
    sprintName: "2k$2hrs Parallel Performance Sprint",
    durationHours: 2200,
  };

  const sprint2 = {
    sprintName: "Jim $2000 Parallel Revenue Sprint",
    buyerName: "Jim",
    revenueTarget: 2000,
  };

  // Run both sprints in parallel
  const [res1, res2] = await Promise.all([
    runSprint(endpoint, secret, sprint1, "parallel-sprint-2k$2hrs"),
    runSprint(endpoint, secret, sprint2, "parallel-sprint-jim"),
  ]);

  if (res1 && res2) {
    console.log("\n==================================================");
    console.log("[SUCCESS] Both parallel sprints completed successfully!");
    console.log("==================================================\n");
  } else {
    console.error("\n[FAILURE] One or both sprints failed to complete.\n");
    process.exit(1);
  }
}

main();
