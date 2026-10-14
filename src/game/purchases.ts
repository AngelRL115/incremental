import { GAME_CONFIG, upgradeDefinition, type UpgradeId } from "./config.js";
import { addPreservingIncrement, assertFinite, Decimal } from "./decimal.js";
import { getPurchaseQuote } from "./economy.js";
import { cloneGameState, type GameState } from "./state.js";
import { refreshAchievements } from "./unlocks.js";

export class PurchaseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PurchaseError";
  }
}

export function buyUpgrade(
  state: GameState,
  upgradeId: UpgradeId,
  quantity = 1,
): GameState {
  const quote = getPurchaseQuote(state, upgradeId, quantity);
  if (!quote.allowed || !quote.cost || !quote.currency) {
    throw new PurchaseError(quote.reason ?? "Purchase is not allowed");
  }

  const next = cloneGameState(state);
  next.resources[quote.currency] = assertFinite(
    next.resources[quote.currency].minus(quote.cost),
    `${quote.currency} balance after purchase`,
  );
  if (next.resources[quote.currency].isNegative()) {
    throw new PurchaseError("Purchase would make a resource balance negative");
  }
  next.upgrades[upgradeId] += quantity;

  if (upgradeId === "seed-autobuyer") {
    next.automationEnabled["seed-array-auto"] = true;
  }
  return refreshAchievements(next);
}

export function buyMaxAffordable(state: GameState, upgradeId: UpgradeId): GameState {
  const definition = upgradeDefinition(upgradeId);
  const available = definition.maxLevel - state.upgrades[upgradeId];
  if (available <= 0) throw new PurchaseError("Upgrade is already at its maximum level");

  let low = 0;
  let high = available;
  while (low < high) {
    const quantity = Math.ceil((low + high) / 2);
    const quote = getPurchaseQuote(state, upgradeId, quantity);
    if (quote.allowed) low = quantity;
    else high = quantity - 1;
  }
  if (low === 0) {
    const quote = getPurchaseQuote(state, upgradeId, 1);
    throw new PurchaseError(quote.reason ?? "No level is currently affordable");
  }
  return buyUpgrade(state, upgradeId, low);
}

export function setAutomationEnabled(
  state: GameState,
  enabled: boolean,
): GameState {
  if (typeof enabled !== "boolean") throw new TypeError("enabled must be boolean");
  if (enabled && state.upgrades["seed-autobuyer"] < 1) {
    throw new PurchaseError("Seed Array Autopilot has not been purchased");
  }
  const next = cloneGameState(state);
  next.automationEnabled["seed-array-auto"] = enabled;
  return refreshAchievements(next);
}

export function addResource(
  state: GameState,
  resource: "charge" | "echo",
  amount: Decimal,
): GameState {
  if (!amount.isFinite() || amount.isNegative()) {
    throw new RangeError("Resource gain must be finite and non-negative");
  }
  const next = cloneGameState(state);
  next.resources[resource] = addPreservingIncrement(
    next.resources[resource],
    amount,
    `${resource} balance`,
  );
  if (resource === "charge") {
    next.runChargeEarned = addPreservingIncrement(
      next.runChargeEarned,
      amount,
      "Run Charge earned",
    );
    next.lifetimeChargeEarned = addPreservingIncrement(
      next.lifetimeChargeEarned,
      amount,
      "Lifetime Charge earned",
    );
  } else {
    next.runEchoEarned = addPreservingIncrement(
      next.runEchoEarned,
      amount,
      "Run Echo earned",
    );
    next.lifetimeEchoEarned = addPreservingIncrement(
      next.lifetimeEchoEarned,
      amount,
      "Lifetime Echo earned",
    );
  }
  return refreshAchievements(next);
}

export function emitPulse(state: GameState, count = 1): GameState {
  if (!Number.isSafeInteger(count) || count < 1 || count > 1_000_000) {
    throw new RangeError("Pulse count must be a safe integer between 1 and 1,000,000");
  }
  const gain = GAME_CONFIG.pulseCharge.mul(count);
  const next = addResource(state, "charge", gain);
  return next;
}
