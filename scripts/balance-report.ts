import { formatGameNumber } from "../src/game/number-format.js";
import { runDefaultBalanceSuite } from "../src/game/simulation-harness.js";
import { calculateOfflineProgress } from "../src/game/offline.js";
import { createNewGameState } from "../src/game/state.js";

const reports = runDefaultBalanceSuite();

console.log("# Balance simulation report");
console.log("");
console.log(
  "| Strategy | Goal met | Prestige reset | Time (s) | Run Charge | Echo earned | Autopilot lvl | Balance | Charge/s | First purchase (s) | Echo unlock (s) | Autopilot (s) | Reward | Seed efficiency | Lens efficiency |",
);
console.log(
  "|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|",
);

for (const report of reports) {
  console.log(
    `| ${report.name} | ${report.goalReached ? "yes" : "no"} | ${report.reachedPrestige ? "yes" : "no"} | ${report.simulatedSeconds.toFixed(0)} | ${formatGameNumber(report.runChargeAtGoal)} | ${formatGameNumber(report.runEchoEarned)} | ${report.autobuyerLevel} | ${formatGameNumber(report.chargeBalance)} Charge / ${formatGameNumber(report.echoBalance)} Echo | ${formatGameNumber(report.chargePerSecond)}/s | ${report.firstPurchaseSeconds?.toFixed(0) ?? "—"} | ${report.echoUnlockedSeconds?.toFixed(0) ?? "—"} | ${report.autobuyerPurchasedSeconds?.toFixed(0) ?? "—"} | ${formatGameNumber(report.prestigeReward)} | ${formatGameNumber(report.seedEfficiency)} Charge/s/Charge | ${formatGameNumber(report.lensEfficiency)} Charge/s/Charge |`,
  );
  if (report.warning) console.log(`\n> Warning: ${report.warning}\n`);
}

console.log("");
console.log("Offline calculations (same deterministic engine; no frame/second catch-up loop):");
for (const seconds of [60, 604_800]) {
  const offline = calculateOfflineProgress(createNewGameState(), seconds);
  console.log(
    `- requested ${seconds}s; applied ${offline.appliedSeconds}s; gained ${formatGameNumber(offline.gained.charge)} Charge; capped=${offline.capped}`,
  );
}

console.log("");
console.log("Milestones reached per scenario (time is sampled at the player-action interval):");
for (const report of reports) {
  const milestones = Object.entries(report.milestoneTimes)
    .map(([id, seconds]) => `${id}=${seconds.toFixed(0)}s`)
    .join(", ");
  console.log(`- ${report.name}: ${milestones || "none"}`);
}

const requiredMilestones = ["echo-research", "resonant-threshold", "deep-resonance"];
const neverReached = requiredMilestones.filter(
  (milestoneId) =>
    !reports.some((report) => report.milestoneTimes[milestoneId] !== undefined),
);
console.log("");
console.log(
  neverReached.length === 0
    ? "Milestone audit: every configured milestone was reached in at least one scenario."
    : `Milestone audit: never reached in this suite: ${neverReached.join(", ")}.`,
);
