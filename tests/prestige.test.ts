import { describe, expect, it } from "vitest";
import {
  Decimal,
  PrestigeError,
  advanceGame,
  buyPermanentConduit,
  calculatePrestigeReward,
  createNewGameState,
  getPrestigePreview,
  getProductionRates,
  performPrestige,
} from "../src/game/index.js";

function eligibleState() {
  const progressed = advanceGame(createNewGameState(), 500);
  return {
    ...progressed,
    runChargeEarned: new Decimal(2_500),
    lifetimeChargeEarned: new Decimal(2_500),
    resources: { ...progressed.resources, charge: new Decimal(2_500) },
  };
}

describe("first prestige transaction", () => {
  it("previews a linear reward and rejects ineligible resets", () => {
    const initial = createNewGameState();
    expect(getPrestigePreview(initial).eligible).toBe(false);
    expect(() => performPrestige(initial)).toThrow(PrestigeError);
    expect(calculatePrestigeReward(eligibleState()).toNumber()).toBe(1);
    const delayed = {
      ...eligibleState(),
      runChargeEarned: new Decimal(10_000),
      lifetimeChargeEarned: new Decimal(10_000),
    };
    expect(calculatePrestigeReward(delayed).toNumber()).toBe(4);
  });

  it("resets run state while preserving meta-currency and permanent levels", () => {
    const state = { ...eligibleState(), achievements: ["echo-observed"] };
    const reset = performPrestige(state);
    expect(reset.resources.charge.toNumber()).toBe(25);
    expect(reset.resources.echo.toNumber()).toBe(0);
    expect(reset.runChargeEarned.toNumber()).toBe(0);
    expect(reset.upgrades["seed-array"]).toBe(1);
    expect(reset.availablePrestigePoints.toNumber()).toBe(1);
    expect(reset.lifetimePrestigePoints.toNumber()).toBe(1);
    expect(reset.lifetimeChargeEarned.toNumber()).toBe(2_500);
    expect(reset.prestigeCount).toBe(1);
    expect(reset.achievements).toContain("echo-observed");
    expect(reset.achievements).toContain("first-resonance");
    expect(() => performPrestige(reset)).toThrow(PrestigeError);
  });

  it("preserves specialization after another prestige without charging it again", () => {
    const state = {
      ...eligibleState(),
      prestigeCount: 1,
      availablePrestigePoints: new Decimal(2),
      lifetimePrestigePoints: new Decimal(2),
      specialization: { path: "charge" as const, level: 2 },
    };
    const preview = getPrestigePreview(state);
    const reset = performPrestige(state);

    expect(preview.preservedPermanentLevels).toEqual(["conduit", "specialization"]);
    expect(reset.specialization).toEqual({ path: "charge", level: 2 });
    expect(reset.availablePrestigePoints.toNumber()).toBe(3);
    expect(reset.achievements).toContain("specialization-chosen");
  });

  it("spends prestige points on a permanent production multiplier", () => {
    const reset = performPrestige(eligibleState());
    const upgraded = buyPermanentConduit(reset);
    expect(upgraded.availablePrestigePoints.toNumber()).toBe(0);
    expect(upgraded.permanentLevels.conduit).toBe(1);
    expect(upgraded.achievements).toContain("conduit-established");
    expect(getProductionRates(upgraded).charge.toNumber()).toBeCloseTo(5);
    expect(() => buyPermanentConduit(upgraded)).toThrow(/Not enough Prestige Points/);
  });
});
