import { GAME_CONFIG, upgradeDefinition, type UpgradeId } from "./config.js";
import { Decimal } from "./decimal.js";
import { getMaxAffordableUpgradeQuantity, upgradeCostAtLevel } from "./economy.js";
import { buyUpgrade } from "./purchases.js";
import type { GameState } from "./state.js";

export interface AutomationEvent {
  readonly purchaseUpgrade: UpgradeId;
  readonly secondsUntilAffordable: Decimal;
}

export function runAffordableAutomations(state: GameState): {
  readonly state: GameState;
  readonly purchases: number;
} {
  const automation = GAME_CONFIG.automation.seedArray;
  if (!state.automationEnabled[automation.id]) return { state, purchases: 0 };

  const quantity = getMaxAffordableUpgradeQuantity(state, automation.purchaseUpgrade);
  if (quantity === 0) return { state, purchases: 0 };
  return {
    state: buyUpgrade(state, automation.purchaseUpgrade, quantity),
    purchases: 1,
  };
}

export function getNextAutomationEvent(
  state: GameState,
  chargePerSecond: Decimal,
): AutomationEvent | undefined {
  const automation = GAME_CONFIG.automation.seedArray;
  if (
    !state.automationEnabled[automation.id] ||
    chargePerSecond.isZero() ||
    state.upgrades[automation.purchaseUpgrade] >=
      upgradeDefinition(automation.purchaseUpgrade).maxLevel
  ) {
    return undefined;
  }
  const upgradeId = automation.purchaseUpgrade;
  const currentBalance = state.resources.charge;
  const nextCost = upgradeCostAtLevel(upgradeId, state.upgrades[upgradeId]);
  if (currentBalance.greaterThanOrEqualTo(nextCost)) {
    return { purchaseUpgrade: upgradeId, secondsUntilAffordable: new Decimal(0) };
  }
  return {
    purchaseUpgrade: upgradeId,
    secondsUntilAffordable: nextCost.minus(currentBalance).div(chargePerSecond),
  };
}

export function getAutomationUnlockLevel(state: GameState): number {
  return state.upgrades[upgradeDefinition("seed-autobuyer").id];
}
