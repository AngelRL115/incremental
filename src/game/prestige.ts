import { GAME_CONFIG } from "./config.js";
import { Decimal, assertFinite } from "./decimal.js";
import { cloneGameState, createNewGameState, type GameState } from "./state.js";
import { refreshAchievements } from "./unlocks.js";

export interface PrestigePreview {
  readonly eligible: boolean;
  readonly reward: Decimal;
  readonly reason?: string;
  readonly resetResources: readonly ("charge" | "echo")[];
  readonly preservedResources: readonly ("availablePrestigePoints" | "lifetimePrestigePoints")[];
  readonly preservedPermanentLevels: readonly ["conduit", "specialization"];
}

export class PrestigeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PrestigeError";
  }
}

export function calculatePrestigeReward(state: GameState): Decimal {
  return assertFinite(
    state.runChargeEarned.div(GAME_CONFIG.prestige.rewardDivisor).floor(),
    "Prestige reward",
  );
}

export function getPrestigePreview(state: GameState): PrestigePreview {
  const eligible = state.runChargeEarned.greaterThanOrEqualTo(
    GAME_CONFIG.prestige.eligibilityChargeEarned,
  );
  return {
    eligible,
    reward: eligible ? calculatePrestigeReward(state) : new Decimal(0),
    ...(!eligible
      ? { reason: `Generate ${GAME_CONFIG.prestige.eligibilityChargeEarned} Charge this run` }
      : {}),
    resetResources: ["charge", "echo"],
    preservedResources: ["availablePrestigePoints", "lifetimePrestigePoints"],
    preservedPermanentLevels: ["conduit", "specialization"],
  };
}

export function performPrestige(state: GameState): GameState {
  const preview = getPrestigePreview(state);
  if (!preview.eligible || preview.reward.isZero()) {
    throw new PrestigeError(preview.reason ?? "Prestige would grant no reward");
  }

  const fresh = createNewGameState();
  const next = cloneGameState(fresh);
  next.lifetimeChargeEarned = state.lifetimeChargeEarned;
  next.lifetimeEchoEarned = state.lifetimeEchoEarned;
  next.totalElapsedSeconds = state.totalElapsedSeconds;
  next.availablePrestigePoints = assertFinite(
    state.availablePrestigePoints.plus(preview.reward),
    "Available prestige points",
  );
  next.lifetimePrestigePoints = assertFinite(
    state.lifetimePrestigePoints.plus(preview.reward),
    "Lifetime prestige points",
  );
  next.permanentLevels = { ...state.permanentLevels };
  next.specialization = { ...state.specialization };
  next.prestigeCount = state.prestigeCount + 1;
  next.achievements = [...state.achievements];
  return refreshAchievements(next);
}

export function permanentUpgradeCost(level: number): Decimal {
  if (!Number.isSafeInteger(level) || level < 0) {
    throw new RangeError("Permanent upgrade level must be a non-negative safe integer");
  }
  return new Decimal(GAME_CONFIG.prestige.permanentUpgradeBaseCost + level);
}

export function buyPermanentConduit(state: GameState): GameState {
  const currentLevel = state.permanentLevels.conduit;
  if (currentLevel >= GAME_CONFIG.prestige.permanentUpgradeMaxLevel) {
    throw new PrestigeError("Permanent Conduit is already at its maximum level");
  }
  const cost = permanentUpgradeCost(currentLevel);
  if (state.availablePrestigePoints.lessThan(cost)) {
    throw new PrestigeError("Not enough Prestige Points");
  }

  const next = cloneGameState(state);
  next.availablePrestigePoints = next.availablePrestigePoints.minus(cost);
  next.permanentLevels.conduit += 1;
  return refreshAchievements(next);
}
