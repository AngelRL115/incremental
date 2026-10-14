import { Decimal, gameNumber, type GameNumber } from "./decimal.js";
import type { AutomationId, ResourceId, UpgradeId } from "./config.js";
import { ACHIEVEMENT_IDS, GAME_CONFIG } from "./config.js";

export interface GameState {
  resources: Record<ResourceId, GameNumber>;
  upgrades: Record<UpgradeId, number>;
  achievements: string[];
  automationEnabled: Record<AutomationId, boolean>;
  runChargeEarned: GameNumber;
  lifetimeChargeEarned: GameNumber;
  runEchoEarned: GameNumber;
  lifetimeEchoEarned: GameNumber;
  runElapsedSeconds: GameNumber;
  totalElapsedSeconds: GameNumber;
  availablePrestigePoints: GameNumber;
  lifetimePrestigePoints: GameNumber;
  permanentLevels: {
    conduit: number;
  };
  prestigeCount: number;
}

export function createNewGameState(): GameState {
  return {
    resources: {
      charge: gameNumber(GAME_CONFIG.startingCharge),
      echo: new Decimal(0),
    },
    upgrades: {
      "seed-array": 1,
      "resonance-lens": 0,
      "echo-loom": 0,
      "harmonic-drive": 0,
      "seed-autobuyer": 0,
    },
    achievements: [],
    automationEnabled: {
      "seed-array-auto": false,
    },
    runChargeEarned: new Decimal(0),
    lifetimeChargeEarned: new Decimal(0),
    runEchoEarned: new Decimal(0),
    lifetimeEchoEarned: new Decimal(0),
    runElapsedSeconds: new Decimal(0),
    totalElapsedSeconds: new Decimal(0),
    availablePrestigePoints: new Decimal(0),
    lifetimePrestigePoints: new Decimal(0),
    permanentLevels: { conduit: 0 },
    prestigeCount: 0,
  };
}

export function cloneGameState(state: GameState): GameState {
  return {
    ...state,
    resources: { ...state.resources },
    upgrades: { ...state.upgrades },
    achievements: [...state.achievements],
    automationEnabled: { ...state.automationEnabled },
    permanentLevels: { ...state.permanentLevels },
  };
}

export function assertGameState(state: GameState): void {
  for (const [resource, amount] of Object.entries(state.resources)) {
    if (!(amount instanceof Decimal) || !amount.isFinite() || amount.isNegative()) {
      throw new Error(`Invalid ${resource} balance in game state`);
    }
  }
  for (const [upgradeId, level] of Object.entries(state.upgrades)) {
    if (!Number.isSafeInteger(level) || level < 0) {
      throw new Error(`Invalid level for ${upgradeId}`);
    }
    const maxLevel = GAME_CONFIG.upgrades[upgradeId as UpgradeId].maxLevel;
    if (level > maxLevel) throw new Error(`Level for ${upgradeId} exceeds its maximum`);
  }
  if (state.upgrades["seed-array"] < 1) {
    throw new Error("At least one Seed Array must remain active");
  }
  if (
    !Array.isArray(state.achievements) ||
    state.achievements.some((id) => typeof id !== "string") ||
    new Set(state.achievements).size !== state.achievements.length ||
    state.achievements.some((id) => !ACHIEVEMENT_IDS.includes(id))
  ) {
    throw new Error("Invalid achievement records");
  }
  if (
    state.automationEnabled["seed-array-auto"] &&
    state.upgrades["seed-autobuyer"] < 1
  ) {
    throw new Error("Seed Array automation cannot be enabled before it is purchased");
  }
  for (const [label, value] of Object.entries({
    runChargeEarned: state.runChargeEarned,
    lifetimeChargeEarned: state.lifetimeChargeEarned,
    runEchoEarned: state.runEchoEarned,
    lifetimeEchoEarned: state.lifetimeEchoEarned,
    runElapsedSeconds: state.runElapsedSeconds,
    totalElapsedSeconds: state.totalElapsedSeconds,
    availablePrestigePoints: state.availablePrestigePoints,
    lifetimePrestigePoints: state.lifetimePrestigePoints,
  })) {
    if (!(value instanceof Decimal) || !value.isFinite() || value.isNegative()) {
      throw new Error(`Invalid ${label} in game state`);
    }
  }
  if (
    !Number.isSafeInteger(state.permanentLevels.conduit) ||
    state.permanentLevels.conduit < 0 ||
    state.permanentLevels.conduit > GAME_CONFIG.prestige.permanentUpgradeMaxLevel
  ) {
    throw new Error("Invalid permanent conduit level");
  }
  if (!Number.isSafeInteger(state.prestigeCount) || state.prestigeCount < 0) {
    throw new Error("Invalid prestige count");
  }
  if (
    state.lifetimeChargeEarned.lessThan(state.runChargeEarned) ||
    state.lifetimeEchoEarned.lessThan(state.runEchoEarned) ||
    state.totalElapsedSeconds.lessThan(state.runElapsedSeconds) ||
    state.lifetimePrestigePoints.lessThan(state.availablePrestigePoints)
  ) {
    throw new Error("Lifetime counters cannot be lower than their current-run values");
  }
}

export function resourceBalance(state: GameState, resource: ResourceId): GameNumber {
  return state.resources[resource];
}
