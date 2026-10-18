import { describe, expect, it } from "vitest";
import {
  Decimal,
  GameNumberError,
  GameSaveError,
  addPreservingIncrement,
  createNewGameState,
  deserializeGameState,
  formatGameNumber,
  gameNumber,
  runBalanceScenario,
  serializeGameState,
} from "../src/game/index.js";

describe("large number and save safety", () => {
  it("supports large finite values while rejecting overflow and lost positive increments", () => {
    const large = gameNumber("1e1000");
    expect(large.mul("1e100").toString()).toBe("1e+1100");
    expect(large.div("1e25").toString()).toBe("1e+975");
    expect(large.sqrt().toString()).toBe("1e+500");
    expect(large.comparedTo("9e999")).toBe(1);
    expect(() => gameNumber("1e1000000000001")).toThrow(GameNumberError);
    expect(() => addPreservingIncrement(large, new Decimal(1), "test counter")).toThrow(
      /40-significant-digit precision/,
    );
  });

  it("formats values without converting them to JavaScript Number", () => {
    expect(formatGameNumber(gameNumber("1e1000"), "scientific")).toBe("1.000e+1000");
    expect(formatGameNumber(gameNumber(123.456))).toBe("123.46");
  });

  it("round-trips versioned game state using decimal strings", () => {
    const advanced = {
      ...createNewGameState(),
      resources: { charge: gameNumber("1e80"), echo: gameNumber("2.5e40") },
      prestigeCount: 1,
      specialization: { path: "echo" as const, level: 2 },
      achievements: ["first-resonance", "specialization-chosen"],
    };
    const restored = deserializeGameState(serializeGameState(advanced));
    expect(restored.resources.charge.equals("1e80")).toBe(true);
    expect(restored.resources.echo.equals("2.5e40")).toBe(true);
    expect(restored.upgrades["seed-array"]).toBe(1);
    expect(restored.specialization).toEqual({ path: "echo", level: 2 });
    expect(restored.achievements).toEqual(advanced.achievements);
  });

  it("migrates v1 saves without losing progress and derives earned records", () => {
    const progressed = {
      ...createNewGameState(),
      resources: { charge: new Decimal(275), echo: new Decimal(0) },
      runChargeEarned: new Decimal(250),
      lifetimeChargeEarned: new Decimal(250),
    };
    const legacy = JSON.parse(serializeGameState(progressed)) as Record<string, unknown>;
    legacy.version = 1;
    delete legacy.achievements;

    const restored = deserializeGameState(JSON.stringify(legacy));
    expect(restored.resources.charge.toNumber()).toBe(275);
    expect(restored.runChargeEarned.toNumber()).toBe(250);
    expect(restored.achievements).toContain("echo-observed");
    expect(JSON.parse(serializeGameState(restored)).version).toBe(3);
  });

  it("migrates v2 saves with no specialization while preserving achievements", () => {
    const current = JSON.parse(serializeGameState({
      ...createNewGameState(),
      achievements: ["echo-observed"],
    })) as Record<string, unknown>;
    current.version = 2;
    delete current.specialization;

    const restored = deserializeGameState(JSON.stringify(current));
    expect(restored.specialization).toEqual({ path: null, level: 0 });
    expect(restored.achievements).toContain("echo-observed");
    expect(JSON.parse(serializeGameState(restored)).version).toBe(3);
  });

  it("rejects unknown and duplicate achievement IDs in v2 saves", () => {
    const unknown = JSON.parse(serializeGameState(createNewGameState())) as {
      achievements: string[];
    };
    unknown.achievements = ["not-a-content-id"];
    expect(() => deserializeGameState(JSON.stringify(unknown))).toThrow(/Unknown achievement ID/);

    const duplicate = JSON.parse(serializeGameState(createNewGameState())) as {
      achievements: string[];
    };
    duplicate.achievements = ["echo-observed", "echo-observed"];
    expect(() => deserializeGameState(JSON.stringify(duplicate))).toThrow(/duplicate IDs/);
    expect(() => serializeGameState({
      ...createNewGameState(),
      achievements: ["not-a-content-id"],
    })).toThrow(/Invalid achievement records/);
  });

  it("rejects malformed, incompatible, and non-finite saves", () => {
    expect(() => deserializeGameState("{")).toThrow(GameSaveError);
    expect(() => deserializeGameState(JSON.stringify({ version: 999 }))).toThrow(
      /Unsupported save version/,
    );
    const parsed = JSON.parse(serializeGameState(createNewGameState())) as {
      resources: { charge: string };
    };
    parsed.resources.charge = "NaN";
    expect(() => deserializeGameState(JSON.stringify(parsed))).toThrow(GameNumberError);
  });

  it("rejects inconsistent specialization data", () => {
    const invalid = JSON.parse(serializeGameState(createNewGameState())) as {
      specialization: { path: string | null; level: number };
    };
    invalid.specialization = { path: null, level: 1 };
    expect(() => deserializeGameState(JSON.stringify(invalid))).toThrow(
      /Invalid specialization level/,
    );
  });
});

describe("simulation harness reproducibility", () => {
  it("produces the same progression report for identical deterministic inputs", () => {
    const options = {
      name: "fixture",
      actionIntervalSeconds: 60,
      manualPulse: true,
      purchaseUpgrades: true,
      prestigeThreshold: new Decimal(2_500),
      maxSeconds: 3_600,
    } as const;
    const first = runBalanceScenario(options);
    const second = runBalanceScenario(options);
    expect(first.simulatedSeconds).toBe(second.simulatedSeconds);
    expect(first.runChargeAtGoal.equals(second.runChargeAtGoal)).toBe(true);
    expect(first.prestigeReward.equals(second.prestigeReward)).toBe(true);
    expect(first.reachedPrestige).toBe(true);
  });

  it("reaches the first purchased automation without resetting a prestige-ready run", () => {
    const report = runBalanceScenario({
      name: "autopilot target",
      actionIntervalSeconds: 1,
      manualPulse: true,
      purchaseUpgrades: true,
      stopAtAutobuyer: true,
      prestigeThreshold: new Decimal(2_500),
      maxSeconds: 600,
    });
    expect(report.goalReached).toBe(true);
    expect(report.reachedPrestige).toBe(false);
    expect(report.autobuyerLevel).toBe(1);
    expect(report.autobuyerPurchasedSeconds).toBeDefined();
    expect(report.finalState.prestigeCount).toBe(0);
  });
});
