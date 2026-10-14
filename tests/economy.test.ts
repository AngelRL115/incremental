import { describe, expect, it } from "vitest";
import {
  GAME_CONFIG,
  ACHIEVEMENTS,
  buyMaxAffordable,
  buyUpgrade,
  createNewGameState,
  emitPulse,
  getMaxAffordableUpgradeQuantity,
  getProductionMultiplier,
  getProductionRates,
  getPurchaseQuote,
  getUpgradeUnlockStatus,
  upgradeCostAtLevel,
  upgradeCostForQuantity,
  Decimal,
  validateAchievementCatalog,
  validateUpgradeCatalog,
} from "../src/game/index.js";

describe("upgrade costs and purchases", () => {
  it("uses a configurable geometric cost curve and closed-form bulk sum", () => {
    const first = upgradeCostAtLevel("seed-array", 0);
    const second = upgradeCostAtLevel("seed-array", 1);
    expect(first.toNumber()).toBe(10);
    expect(second.toNumber()).toBeCloseTo(11.8);

    const bulk = upgradeCostForQuantity("seed-array", 0, 3);
    const individuallySummed = first
      .plus(second)
      .plus(upgradeCostAtLevel("seed-array", 2));
    expect(bulk.minus(individuallySummed).abs().lessThan("1e-35")).toBe(true);
  });

  it("finds the exact affordable bulk quantity at boundary balances", () => {
    const costTwo = upgradeCostForQuantity("seed-array", 1, 2);
    expect(getMaxAffordableUpgradeQuantity(
      {
        ...createNewGameState(),
        resources: { charge: costTwo, echo: new Decimal(0) },
        runChargeEarned: new Decimal(250),
        lifetimeChargeEarned: new Decimal(250),
      },
      "seed-array",
    )).toBe(2);

    const state = createNewGameState();
    const balanceAtCost = upgradeCostForQuantity("seed-array", 1, 2);
    const justBelow = balanceAtCost.minus("1e-20");
    expect(
      getMaxAffordableUpgradeQuantity(
        { ...state, resources: { ...state.resources, charge: justBelow } },
        "seed-array",
      ),
    ).toBe(1);
  });

  it("deducts a purchase once and leaves the caller state unchanged", () => {
    const state = { ...createNewGameState(), runChargeEarned: new Decimal(25), lifetimeChargeEarned: new Decimal(25) };
    const before = state.resources.charge;
    const next = buyUpgrade(state, "seed-array");

    expect(state.upgrades["seed-array"]).toBe(1);
    expect(state.resources.charge.equals(before)).toBe(true);
    expect(next.upgrades["seed-array"]).toBe(2);
    expect(next.resources.charge.equals(before.minus(11.8))).toBe(true);
  });

  it("does not mutate state when a purchase is locked or unaffordable", () => {
    const initial = createNewGameState();
    expect(getPurchaseQuote(initial, "echo-loom").allowed).toBe(false);
    expect(() => buyUpgrade(initial, "echo-loom")).toThrow(/Genera 250 Charge/);

    const unlocked = {
      ...initial,
      runChargeEarned: new Decimal(250),
      lifetimeChargeEarned: new Decimal(250),
    };
    expect(() => buyUpgrade(unlocked, "echo-loom")).toThrow(/Not enough charge/);
    expect(unlocked.resources.charge.toNumber()).toBe(25);
  });

  it("enforces maximum level and bulk purchase limits", () => {
    const initial = createNewGameState();
    expect(() => upgradeCostForQuantity("seed-autobuyer", 0, 2)).toThrow(
      /maximum level/,
    );
    expect(() => buyUpgrade(initial, "seed-array", 0)).toThrow(/quantity/);

    const enough = {
      ...initial,
      resources: { ...initial.resources, charge: new Decimal(100) },
    };
    const bought = buyMaxAffordable(enough, "seed-array");
    expect(bought.upgrades["seed-array"]).toBeGreaterThan(1);
    expect(bought.resources.charge.isNegative()).toBe(false);
    expect(
      upgradeCostForQuantity(
        "seed-array",
        enough.upgrades["seed-array"],
        bought.upgrades["seed-array"] - enough.upgrades["seed-array"] + 1,
      ).greaterThan(100),
    ).toBe(true);
  });

  it("unlocks Echo production at the declared milestone and applies multipliers", () => {
    const before = createNewGameState();
    expect(getUpgradeUnlockStatus(before, "echo-loom").unlocked).toBe(false);
    const after = {
      ...before,
      runChargeEarned: new Decimal(250),
      lifetimeChargeEarned: new Decimal(250),
    };
    expect(getUpgradeUnlockStatus(after, "echo-loom").unlocked).toBe(true);

    const boosted = {
      ...after,
      upgrades: { ...after.upgrades, "resonance-lens": 2 },
      permanentLevels: { conduit: 1 },
    };
    expect(getProductionMultiplier(boosted).toNumber()).toBeCloseTo(1.25 * 1.3 ** 2);
    expect(getProductionRates(boosted).charge.toNumber()).toBeCloseTo(
      GAME_CONFIG.seedChargePerLevelPerSecond.toNumber() * 1.25 * 1.3 ** 2,
    );
  });

  it("counts manual pulses as earned resource without advancing time", () => {
    const initial = createNewGameState();
    const after = emitPulse(initial, 3);
    expect(after.resources.charge.toNumber()).toBe(31);
    expect(after.runChargeEarned.toNumber()).toBe(6);
    expect(after.runElapsedSeconds.toNumber()).toBe(0);
    expect(initial.resources.charge.toNumber()).toBe(25);
  });

  it("records original achievements from actual state and keeps them unique", () => {
    const after = emitPulse(createNewGameState(), 125);
    expect(after.achievements).toContain("echo-observed");
    expect(ACHIEVEMENTS.some(({ id }) => id === "echo-observed")).toBe(true);
    expect(emitPulse(after).achievements).toEqual(after.achievements);
    expect(after.runElapsedSeconds.isZero()).toBe(true);
  });

  it("validates upgrade prerequisite references and rejects dependency cycles", () => {
    const seed = GAME_CONFIG.upgrades["seed-array"];
    const lens = GAME_CONFIG.upgrades["resonance-lens"];
    expect(() => validateUpgradeCatalog([seed, lens])).not.toThrow();
    expect(() => validateUpgradeCatalog([
      { ...seed, prerequisites: [{ kind: "upgrade-level", upgradeId: "resonance-lens", minimumLevel: 1, explanation: "test" }] },
      { ...lens, prerequisites: [{ kind: "upgrade-level", upgradeId: "seed-array", minimumLevel: 1, explanation: "test" }] },
    ])).toThrow(/Circular upgrade prerequisite/);
    expect(() => validateUpgradeCatalog([
      { ...seed, prerequisites: [{ kind: "upgrade-level", upgradeId: "echo-loom", minimumLevel: 1, explanation: "test" }] },
    ])).toThrow(/depends on missing upgrade/);
  });

  it("validates stable, uniquely identified narrative records", () => {
    expect(() => validateAchievementCatalog(ACHIEVEMENTS)).not.toThrow();
    const first = ACHIEVEMENTS[0]!;
    expect(() => validateAchievementCatalog([first, { ...first }])).toThrow(
      /Duplicate achievement definition/,
    );
  });
});
