import {
  GAME_CONFIG,
  upgradeDefinition,
  type ResourceId,
  type UpgradeId,
} from "./config.js";
import { assertFinite, Decimal, gameNumber } from "./decimal.js";
import type { GameState } from "./state.js";
import { getUpgradeUnlock } from "./unlocks.js";

export interface ProductionRates {
  readonly charge: Decimal;
  readonly echo: Decimal;
}

export interface PurchaseQuote {
  readonly allowed: boolean;
  readonly reason?: string;
  readonly cost?: Decimal;
  readonly currency?: ResourceId;
  readonly quantity?: number;
}

export interface MarginalProduction {
  readonly resource: ResourceId;
  readonly perSecond: Decimal;
}

function integer(value: number, label: string, minimum = 0): number {
  if (!Number.isSafeInteger(value) || value < minimum) {
    throw new RangeError(`${label} must be a safe integer >= ${minimum}`);
  }
  return value;
}

export function upgradeCostAtLevel(upgradeId: UpgradeId, level: number): Decimal {
  integer(level, "level");
  const definition = upgradeDefinition(upgradeId);
  if (level >= definition.maxLevel) {
    throw new RangeError(`${upgradeId} is already at its maximum level`);
  }
  return assertFinite(
    definition.baseCost.mul(definition.costGrowth.pow(level)),
    `${upgradeId} cost`,
  );
}

export function upgradeCostForQuantity(
  upgradeId: UpgradeId,
  level: number,
  quantity: number,
): Decimal {
  integer(level, "level");
  integer(quantity, "quantity");
  const definition = upgradeDefinition(upgradeId);
  if (quantity === 0) return new Decimal(0);
  if (level + quantity > definition.maxLevel) {
    throw new RangeError(`${upgradeId} purchase exceeds its maximum level`);
  }

  const firstCost = upgradeCostAtLevel(upgradeId, level);
  if (definition.costGrowth.equals(1)) {
    return assertFinite(firstCost.mul(quantity), `${upgradeId} bulk cost`);
  }

  const geometricTotal = definition.costGrowth
    .pow(quantity)
    .minus(1)
    .div(definition.costGrowth.minus(1));
  return assertFinite(firstCost.mul(geometricTotal), `${upgradeId} bulk cost`);
}

export function maxAffordableQuantity(
  upgradeId: UpgradeId,
  level: number,
  balance: Decimal,
): number {
  integer(level, "level");
  const definition = upgradeDefinition(upgradeId);
  const availableLevels = definition.maxLevel - level;
  if (availableLevels <= 0 || balance.isNegative() || !balance.isFinite()) return 0;

  let low = 0;
  let high = availableLevels;
  while (low < high) {
    const middle = Math.ceil((low + high) / 2);
    const totalCost = upgradeCostForQuantity(upgradeId, level, middle);
    if (totalCost.lessThanOrEqualTo(balance)) {
      low = middle;
    } else {
      high = middle - 1;
    }
  }
  return low;
}

export function getProductionMultiplier(state: GameState): Decimal {
  let multiplier = GAME_CONFIG.prestige.permanentMultiplierPerLevel.pow(
    state.permanentLevels.conduit,
  );
  for (const upgradeId of ["resonance-lens", "harmonic-drive"] as const) {
    const level = state.upgrades[upgradeId];
    const perLevel = upgradeDefinition(upgradeId).multiplierPerLevel;
    if (level > 0 && perLevel) multiplier = multiplier.mul(perLevel.pow(level));
  }
  for (const milestone of GAME_CONFIG.milestones) {
    if (
      milestone.productionMultiplier &&
      state.runChargeEarned.greaterThanOrEqualTo(milestone.chargeEarned)
    ) {
      multiplier = multiplier.mul(milestone.productionMultiplier);
    }
  }
  return assertFinite(multiplier, "Production multiplier");
}

export function getProductionRates(state: GameState): ProductionRates {
  const chargeRate = gameNumber(
    GAME_CONFIG.seedChargePerLevelPerSecond.mul(state.upgrades["seed-array"]),
    "Seed Array production",
  ).mul(getProductionMultiplier(state));
  const echoRate = GAME_CONFIG.echoPerLoomLevelPerSecond.mul(state.upgrades["echo-loom"]);
  return {
    charge: assertFinite(chargeRate, "Charge production rate"),
    echo: assertFinite(echoRate, "Echo production rate"),
  };
}

export function getUpgradeUnlockStatus(state: GameState, upgradeId: UpgradeId) {
  return getUpgradeUnlock(state, upgradeId);
}

export function getPurchaseQuote(
  state: GameState,
  upgradeId: UpgradeId,
  quantity = 1,
): PurchaseQuote {
  integer(quantity, "quantity", 1);
  const definition = upgradeDefinition(upgradeId);
  const currentLevel = state.upgrades[upgradeId];

  if (currentLevel + quantity > definition.maxLevel) {
    return { allowed: false, reason: "Purchase exceeds the maximum level" };
  }
  const unlock = getUpgradeUnlock(state, upgradeId);
  if (!unlock.unlocked) {
    return { allowed: false, reason: unlock.reason ?? "Upgrade is locked" };
  }
  const cost = upgradeCostForQuantity(upgradeId, currentLevel, quantity);
  if (state.resources[definition.currency].lessThan(cost)) {
    return { allowed: false, reason: `Not enough ${definition.currency}` };
  }
  return { allowed: true, cost, currency: definition.currency, quantity };
}

export function getMaxAffordableUpgradeQuantity(
  state: GameState,
  upgradeId: UpgradeId,
): number {
  const unlock = getUpgradeUnlock(state, upgradeId);
  if (!unlock.unlocked) return 0;
  const definition = upgradeDefinition(upgradeId);
  return maxAffordableQuantity(
    upgradeId,
    state.upgrades[upgradeId],
    state.resources[definition.currency],
  );
}

export function getMarginalChargeProduction(
  state: GameState,
  upgradeId: UpgradeId,
  quantity = 1,
): Decimal {
  integer(quantity, "quantity", 1);
  const rates = getProductionRates(state);
  switch (upgradeId) {
    case "seed-array":
      return GAME_CONFIG.seedChargePerLevelPerSecond.mul(quantity).mul(
        getProductionMultiplier(state),
      );
    case "resonance-lens": {
      const factor = upgradeDefinition(upgradeId).multiplierPerLevel!;
      return rates.charge.mul(factor.pow(quantity).minus(1));
    }
    case "harmonic-drive": {
      const factor = upgradeDefinition(upgradeId).multiplierPerLevel!;
      return rates.charge.mul(factor.pow(quantity).minus(1));
    }
    case "echo-loom":
    case "seed-autobuyer":
      return new Decimal(0);
  }
}

export function getMarginalProduction(
  state: GameState,
  upgradeId: UpgradeId,
  quantity = 1,
): MarginalProduction {
  integer(quantity, "quantity", 1);
  if (upgradeId === "echo-loom") {
    return {
      resource: "echo",
      perSecond: GAME_CONFIG.echoPerLoomLevelPerSecond.mul(quantity),
    };
  }
  return {
    resource: "charge",
    perSecond: getMarginalChargeProduction(state, upgradeId, quantity),
  };
}

export function getUpgradeEfficiency(
  state: GameState,
  upgradeId: UpgradeId,
  quantity = 1,
): Decimal {
  const cost = upgradeCostForQuantity(upgradeId, state.upgrades[upgradeId], quantity);
  const marginalProduction = getMarginalProduction(state, upgradeId, quantity).perSecond;
  if (cost.isZero() || marginalProduction.isZero()) return new Decimal(0);
  return assertFinite(marginalProduction.div(cost), `${upgradeId} efficiency`);
}
