import { describe, expect, it } from "vitest";
import {
  Decimal,
  SpecializationError,
  buyPermanentConduit,
  buySpecialization,
  createNewGameState,
  getProductionRates,
  getSpecializationQuote,
  getMarginalProduction,
  specializationCost,
} from "../src/game/index.js";

function postPrestigeState(points = 6) {
  return {
    ...createNewGameState(),
    prestigeCount: 1,
    availablePrestigePoints: new Decimal(points),
    lifetimePrestigePoints: new Decimal(points),
  };
}

describe("permanent specialization", () => {
  it("locks both routes until the first prestige without changing state", () => {
    const state = createNewGameState();
    expect(getSpecializationQuote(state, "charge")).toMatchObject({
      allowed: false,
      reason: "Disponible después del primer prestigio.",
    });
    expect(() => buySpecialization(state, "charge")).toThrow(SpecializationError);
    expect(state.specialization).toEqual({ path: null, level: 0 });
    expect(state.availablePrestigePoints.isZero()).toBe(true);
  });

  it("charges 1, 2, then 3 shared RP and permanently excludes the other route", () => {
    expect([0, 1, 2].map((level) => specializationCost(level).toNumber())).toEqual([
      1, 2, 3,
    ]);
    let state = postPrestigeState();
    state = buySpecialization(state, "charge");
    expect(state.specialization).toEqual({ path: "charge", level: 1 });
    expect(state.availablePrestigePoints.toNumber()).toBe(5);
    expect(state.achievements).toContain("specialization-chosen");

    const alternate = getSpecializationQuote(state, "echo");
    expect(alternate.allowed).toBe(false);
    expect(alternate.reason).toMatch(/permanente/);
    expect(() => buySpecialization(state, "echo")).toThrow(SpecializationError);

    state = buySpecialization(state, "charge");
    expect(state.specialization.level).toBe(2);
    expect(state.availablePrestigePoints.toNumber()).toBe(3);
    state = buySpecialization(state, "charge");
    expect(state.specialization.level).toBe(3);
    expect(state.availablePrestigePoints.toNumber()).toBe(0);
    expect(getSpecializationQuote(state, "charge").allowed).toBe(false);
  });

  it("multiplies only the selected resource and composes with existing production", () => {
    const chargeState = {
      ...postPrestigeState(),
      permanentLevels: { conduit: 1 },
      upgrades: { ...createNewGameState().upgrades, "resonance-lens": 1 },
      specialization: { path: "charge" as const, level: 2 },
    };
    expect(getProductionRates(chargeState).charge.toNumber()).toBeCloseTo(
      4 * 1.25 * 1.3 * 1.15 ** 2,
    );
    expect(getProductionRates(chargeState).echo.isZero()).toBe(true);

    const echoState = {
      ...postPrestigeState(),
      upgrades: { ...createNewGameState().upgrades, "echo-loom": 3 },
      specialization: { path: "echo" as const, level: 2 },
    };
    expect(getProductionRates(echoState).charge.toNumber()).toBe(4);
    expect(getProductionRates(echoState).echo.toNumber()).toBeCloseTo(
      0.8 * 3 * 1.25 ** 2,
    );
    expect(getMarginalProduction(echoState, "echo-loom", 1).perSecond.toNumber())
      .toBeCloseTo(0.8 * 1.25 ** 2);
  });

  it("shares its currency with Conduit and rejects unaffordable buys atomically", () => {
    const onePoint = postPrestigeState(1);
    const specialized = buySpecialization(onePoint, "echo");
    expect(specialized.availablePrestigePoints.isZero()).toBe(true);
    expect(() => buyPermanentConduit(specialized)).toThrow(/Not enough Prestige Points/);
    expect(specialized.specialization).toEqual({ path: "echo", level: 1 });

    const short = postPrestigeState(0);
    const quote = getSpecializationQuote(short, "charge");
    expect(quote.allowed).toBe(false);
    expect(quote.reason).toMatch(/Necesitas 1 RP/);
    expect(() => buySpecialization(short, "charge")).toThrow(SpecializationError);
    expect(short.specialization).toEqual({ path: null, level: 0 });
    expect(short.availablePrestigePoints.isZero()).toBe(true);
  });
});
