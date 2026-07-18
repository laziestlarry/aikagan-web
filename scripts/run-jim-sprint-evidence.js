// scripts/run-jim-sprint-evidence.js
// Convenience wrapper: re-runs the parallel 2k$2hrs + Jim $2000 sprints
// and prints the markdown evidence + a one-line summary for the $2K-in-2-hours plan.
//
// Usage:
//   node scripts/run-jim-sprint-evidence.js
//   PORT=3001 node scripts/run-jim-sprint-evidence.js
//
// Output:
//   - reports/parallel-sprint-2k2hrs.{md,json}
//   - reports/parallel-sprint-jim.{md,json}
//   - a one-line summary in stdout

const path = require("path");
const { spawn } = require("child_process");

function run() {
  return new Promise((resolve, reject) => {
    const cwd = path.join(__dirname, "..");
    const child = spawn("node", ["scripts/run-parallel-sprints.js"], {
      cwd,
      stdio: "inherit",
      env: { ...process.env },
    });
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`runner exited with code ${code}`));
    });
  });
}

(async () => {
  try {
    await run();
    console.log("\n[OK] Evidence refreshed. Run the dashboard tab to view the Jim shortest path.");
  } catch (e) {
    console.error("[FAIL]", e.message);
    process.exit(1);
  }
})();
