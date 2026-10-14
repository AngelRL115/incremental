import { GAME_CONFIG, type UpgradeId } from "./config.js";
import {
  getMaxAffordableUpgradeQuantity,
  getProductionRates,
  getPurchaseQuote,
  getUpgradeEfficiency,
} from "./economy.js";
import { Decimal, gameNumber } from "./decimal.js";
import { performPrestige, getPrestigePreview } from "./prestige.js";
import { buyMaxAffordable, buyUpgrade, emitPulse } from "./purchases.js";
import { advanceGame } from "./simulation.js";
import { createNewGameState, type GameState } from "./state.js";

export interface BalanceScenarioOptions {
  readonly name: string;
  readonly actionIntervalSeconds: number;
  readonly manualPulse: boolean;
  readonly purchaseUpgrades: boolean;
  readonly purchaseStrategy?: "aggressive" | "save-reserve";
  readonly stopAtAutobuyer?: boolean;
  readonly prestigeThreshold: Decimal;
  readonly maxSeconds: number;
}

export interface BalanceScenarioReport {
  readonly name: string;
  readonly goalReached: boolean;
  readonly reachedPrestige: boolean;
  readonly simulatedSeconds: number;
  readonly runChargeAtGoal: Decimal;
  readonly runEchoEarned: Decimal;
  readonly autobuyerLevel: number;
  readonly chargeBalance: Decimal;
  readonly echoBalance: Decimal;
  readonly chargePerSecond: Decimal;
  readonly firstPurchaseSeconds?: number;
  readonly echoUnlockedSeconds?: number;
  readonly autobuyerPurchasedSeconds?: number;
  readonly milestoneTimes: Readonly<Record<string, number>>;
  readonly prestigeReward: Decimal;
  readonly seedEfficiency: Decimal;
  readonly lensEfficiency: Decimal;
  readonly finalState: GameState;
  readonly warning?: string;
}

const AGGRESSIVE_ORDER: readonly UpgradeId[] = [
  "resonance-lens",
  "echo-loom",
  "seed-array",
  "seed-autobuyer",
  "harmonic-drive",
];

const CONSERVATIVE_ORDER: readonly UpgradeId[] = [
  "resonance-lens",
  "echo-loom",
  "harmonic-drive",
  "seed-autobuyer",
  "seed-array",
];

function shop(
  state: GameState,
  strategy: "aggressive" | "save-reserve",
): GameState {
  let next = state;
  const order = strategy === "aggressive" ? AGGRESSIVE_ORDER : CONSERVATIVE_ORDER;
  for (const upgradeId of order) {
    const quote = getPurchaseQuote(next, upgradeId, 1);
    if (!quote.allowed || !quote.cost || !quote.currency) continue;
    if (strategy === "save-reserve") {
      const reserveLimit = next.resources[quote.currency].mul("0.2");
      if (quote.cost.greaterThan(reserveLimit)) continue;
      next = buyUpgrade(next, upgradeId, 1);
      continue;
    }

    const quantity = getMaxAffordableUpgradeQuantity(next, upgradeId);
    if (quantity > 0) {
      next =
        upgradeId === "seed-autobuyer"
          ? buyUpgrade(next, upgradeId, 1)
          : buyMaxAffordable(next, upgradeId);
    }
  }
  return next;
}

export function runBalanceScenario(
  options: BalanceScenarioOptions,
): BalanceScenarioReport {
  if (!Number.isFinite(options.actionIntervalSeconds) || options.actionIntervalSeconds <= 0) {
    throw new RangeError("Scenario action interval must be positive and finite");
  }
  if (!Number.isFinite(options.maxSeconds) || options.maxSeconds < 0) {
    throw new RangeError("Scenario time limit must be finite and non-negative");
  }

  let state = createNewGameState();
  let elapsed = 0;
  let firstPurchaseSeconds: number | undefined;
  let echoUnlockedSeconds: number | undefined;
  let autobuyerPurchasedSeconds: number | undefined;
  const milestoneTimes: Record<string, number> = {};
  let priorLevel = state.upgrades["seed-array"];

  while (
    elapsed < options.maxSeconds &&
    (options.stopAtAutobuyer
      ? state.upgrades["seed-autobuyer"] < 1
      : state.runChargeEarned.lessThan(options.prestigeThreshold))
  ) {
    const interval = Math.min(
      options.actionIntervalSeconds,
      options.maxSeconds - elapsed,
    );
    state = advanceGame(state, interval);
    elapsed += interval;
    if (options.manualPulse) state = emitPulse(state);

    if (options.purchaseUpgrades) {
      const hadAutobuyer = state.upgrades["seed-autobuyer"] > 0;
      state = shop(state, options.purchaseStrategy ?? "aggressive");
      if (!hadAutobuyer && state.upgrades["seed-autobuyer"] > 0) {
        autobuyerPurchasedSeconds ??= elapsed;
      }
    }

    if (firstPurchaseSeconds === undefined && state.upgrades["seed-array"] > priorLevel) {
      firstPurchaseSeconds = elapsed;
    }
    priorLevel = state.upgrades["seed-array"];

    if (
      echoUnlockedSeconds === undefined &&
      state.runChargeEarned.greaterThanOrEqualTo(250)
    ) {
      echoUnlockedSeconds = elapsed;
    }
    for (const milestone of GAME_CONFIG.milestones) {
      if (
        milestoneTimes[milestone.id] === undefined &&
        state.runChargeEarned.greaterThanOrEqualTo(milestone.chargeEarned)
      ) {
        milestoneTimes[milestone.id] = elapsed;
      }
    }
  }

  const chargeAtPrestige = state.runChargeEarned;
  const echoEarned = state.runEchoEarned;
  const autobuyerLevel = state.upgrades["seed-autobuyer"];
  const chargeBalanceAtPrestige = state.resources.charge;
  const echoBalanceAtPrestige = state.resources.echo;
  const preview = getPrestigePreview(state);
  const reachedPrestige =
    !options.stopAtAutobuyer &&
    chargeAtPrestige.greaterThanOrEqualTo(options.prestigeThreshold) &&
    preview.eligible &&
    preview.reward.greaterThan(0);
  const goalReached = options.stopAtAutobuyer
    ? autobuyerLevel > 0
    : reachedPrestige;
  const rates = getProductionRates(state);
  const seedEfficiency = getUpgradeEfficiency(state, "seed-array");
  const lensEfficiency =
    state.upgrades["resonance-lens"] < GAME_CONFIG.upgrades["resonance-lens"].maxLevel
      ? getUpgradeEfficiency(state, "resonance-lens")
      : new Decimal(0);

  if (reachedPrestige) state = performPrestige(state);

  return {
    name: options.name,
    goalReached,
    reachedPrestige,
    simulatedSeconds: elapsed,
    runChargeAtGoal: chargeAtPrestige,
    runEchoEarned: echoEarned,
    autobuyerLevel,
    chargeBalance: chargeBalanceAtPrestige,
    echoBalance: echoBalanceAtPrestige,
    chargePerSecond: rates.charge,
    ...(firstPurchaseSeconds === undefined ? {} : { firstPurchaseSeconds }),
    ...(echoUnlockedSeconds === undefined ? {} : { echoUnlockedSeconds }),
    ...(autobuyerPurchasedSeconds === undefined
      ? {}
      : { autobuyerPurchasedSeconds }),
    milestoneTimes,
    prestigeReward: reachedPrestige ? preview.reward : new Decimal(0),
    seedEfficiency,
    lensEfficiency,
    finalState: state,
    ...(!goalReached
      ? { warning: `Scenario goal not reached within ${options.maxSeconds}s` }
      : {}),
  };
}

export function defaultBalanceScenarios(): BalanceScenarioOptions[] {
  return [
    {
      name: "Frequent manual",
      actionIntervalSeconds: 1,
      manualPulse: true,
      purchaseUpgrades: true,
      prestigeThreshold: gameNumber(2_500),
      maxSeconds: 3_600,
    },
    {
      name: "Occasional manual",
      actionIntervalSeconds: 60,
      manualPulse: true,
      purchaseUpgrades: true,
      prestigeThreshold: gameNumber(2_500),
      maxSeconds: 3_600,
    },
    {
      name: "Idle only",
      actionIntervalSeconds: 300,
      manualPulse: false,
      purchaseUpgrades: false,
      prestigeThreshold: gameNumber(2_500),
      maxSeconds: 3_600,
    },
    {
      name: "Autopilot unlock / active",
      actionIntervalSeconds: 1,
      manualPulse: true,
      purchaseUpgrades: true,
      purchaseStrategy: "aggressive",
      stopAtAutobuyer: true,
      prestigeThreshold: gameNumber(2_500),
      maxSeconds: 3_600,
    },
    {
      name: "Delayed / reserve spending",
      actionIntervalSeconds: 10,
      manualPulse: true,
      purchaseUpgrades: true,
      purchaseStrategy: "save-reserve",
      prestigeThreshold: gameNumber(10_000),
      maxSeconds: 7_200,
    },
  ];
}

export function runDefaultBalanceSuite(): BalanceScenarioReport[] {
  return defaultBalanceScenarios().map(runBalanceScenario);
}
