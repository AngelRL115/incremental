import { describe, expect, it } from "vitest";
import {
  Decimal,
  advanceGame,
  buyUpgrade,
  calculateOfflineProgress,
  createNewGameState,
  elapsedSecondsFromTimestamps,
  getProductionRates,
  setAutomationEnabled,
  SimulationError,
} from "../src/game/index.js";

describe("deterministic production simulation", () => {
  it("advances with rates independent of rendering cadence", () => {
    const state = createNewGameState();
    const oneShot = advanceGame(state, 300);
    const split = advanceGame(advanceGame(state, 100), 200);
    expect(oneShot.resources.charge.minus(split.resources.charge).abs().lessThan("1e-30")).toBe(
      true,
    );
    expect(oneShot.runChargeEarned.minus(split.runChargeEarned).abs().lessThan("1e-30")).toBe(
      true,
    );
    expect(oneShot.runChargeEarned.toNumber()).toBeCloseTo(1_300);
    expect(oneShot.runElapsedSeconds.toNumber()).toBe(300);
  });

  it("splits exactly at production milestones during long intervals", () => {
    const state = createNewGameState();
    const advanced = advanceGame(state, 300);
    expect(advanced.runChargeEarned.toNumber()).toBeCloseTo(1_300);
    expect(getProductionRates(advanced).charge.toNumber()).toBeCloseTo(6);
  });

  it("runs automation at affordability events without one loop per second", () => {
    const prepared = {
      ...createNewGameState(),
      resources: { charge: new Decimal(1_000), echo: new Decimal(50) },
      runChargeEarned: new Decimal(1_000),
      lifetimeChargeEarned: new Decimal(1_000),
      runEchoEarned: new Decimal(20),
      lifetimeEchoEarned: new Decimal(20),
      upgrades: {
        ...createNewGameState().upgrades,
        "echo-loom": 1,
      },
    };
    const purchased = buyUpgrade(prepared, "seed-autobuyer");
    const online = advanceGame(purchased, 300);
    const offline = calculateOfflineProgress(purchased, 300);
    let frequent = purchased;
    for (let index = 0; index < 300; index += 1) {
      frequent = advanceGame(frequent, 1);
    }
    expect(online.upgrades["seed-array"]).toBeGreaterThan(
      purchased.upgrades["seed-array"],
    );
    expect(online.upgrades["seed-array"]).toBe(frequent.upgrades["seed-array"]);
    expect(offline.state.upgrades["seed-array"]).toBe(online.upgrades["seed-array"]);
    expect(online.resources.charge.minus(frequent.resources.charge).abs().lessThan("1e-25")).toBe(
      true,
    );
    expect(
      offline.state.resources.charge.minus(online.resources.charge).abs().lessThan("1e-25"),
    ).toBe(true);
    expect(online.runElapsedSeconds.toNumber()).toBe(300);
  });

  it("rejects invalid elapsed time without mutating the source state", () => {
    const initial = createNewGameState();
    expect(() => advanceGame(initial, -1)).toThrow(SimulationError);
    expect(() => advanceGame(initial, Number.NaN)).toThrow(SimulationError);
    expect(() => advanceGame(initial, Infinity)).toThrow(SimulationError);
    expect(() => advanceGame(initial, 31_536_001)).toThrow(/maximum single simulation interval/);
    expect(initial.resources.charge.toNumber()).toBe(25);
  });

  it("does not allow enabling automation before buying its unlock", () => {
    expect(() => setAutomationEnabled(createNewGameState(), true)).toThrow(
      /has not been purchased/,
    );
  });
});

describe("offline advancement", () => {
  it("uses the same engine for online and offline progress and caps at seven days", () => {
    const initial = createNewGameState();
    const full = calculateOfflineProgress(initial, 60);
    expect(full.state.resources.charge.equals(advanceGame(initial, 60).resources.charge)).toBe(
      true,
    );
    const capped = calculateOfflineProgress(initial, 900_000);
    expect(capped.capped).toBe(true);
    expect(capped.appliedSeconds).toBe(604_800);
    expect(capped.state.runElapsedSeconds.toNumber()).toBe(604_800);
  });

  it("validates clock order and implausible timestamp gaps", () => {
    expect(elapsedSecondsFromTimestamps(1_000, 61_000)).toBe(60);
    expect(() => elapsedSecondsFromTimestamps(2_000, 1_000)).toThrow(/predates/);
    expect(() => elapsedSecondsFromTimestamps(0, 32_000_000_000)).toThrow(/plausible/);
    expect(() => calculateOfflineProgress(createNewGameState(), -2)).toThrow(
      /finite and non-negative/,
    );
  });
});
