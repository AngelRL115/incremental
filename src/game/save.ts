import { Decimal, parseSerializedNumber, serializeNumber } from "./decimal.js";
import type { AutomationId, UpgradeId } from "./config.js";
import { ACHIEVEMENT_IDS, GAME_CONFIG, UPGRADE_IDS } from "./config.js";
import { assertGameState, type GameState } from "./state.js";
import { refreshAchievements } from "./unlocks.js";

const SAVE_VERSION = 3;
const PREVIOUS_SAVE_VERSIONS = [1, 2] as const;

export class GameSaveError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GameSaveError";
  }
}

interface SerializedGameState {
  version: number;
  resources: { charge: string; echo: string };
  upgrades: Record<UpgradeId, number>;
  achievements: string[];
  automationEnabled: Record<AutomationId, boolean>;
  runChargeEarned: string;
  lifetimeChargeEarned: string;
  runEchoEarned: string;
  lifetimeEchoEarned: string;
  runElapsedSeconds: string;
  totalElapsedSeconds: string;
  availablePrestigePoints: string;
  lifetimePrestigePoints: string;
  permanentLevels: { conduit: number };
  specialization: { path: "charge" | "echo" | null; level: number };
  prestigeCount: number;
}

export function serializeGameState(state: GameState): string {
  try {
    assertGameState(state);
  } catch (error) {
    throw new GameSaveError(`Refusing to serialize invalid state: ${String(error)}`);
  }
  const serialized: SerializedGameState = {
    version: SAVE_VERSION,
    resources: {
      charge: serializeNumber(state.resources.charge),
      echo: serializeNumber(state.resources.echo),
    },
    upgrades: { ...state.upgrades },
    achievements: [...state.achievements],
    automationEnabled: { ...state.automationEnabled },
    runChargeEarned: serializeNumber(state.runChargeEarned),
    lifetimeChargeEarned: serializeNumber(state.lifetimeChargeEarned),
    runEchoEarned: serializeNumber(state.runEchoEarned),
    lifetimeEchoEarned: serializeNumber(state.lifetimeEchoEarned),
    runElapsedSeconds: serializeNumber(state.runElapsedSeconds),
    totalElapsedSeconds: serializeNumber(state.totalElapsedSeconds),
    availablePrestigePoints: serializeNumber(state.availablePrestigePoints),
    lifetimePrestigePoints: serializeNumber(state.lifetimePrestigePoints),
    permanentLevels: { ...state.permanentLevels },
    specialization: { ...state.specialization },
    prestigeCount: state.prestigeCount,
  };
  return JSON.stringify(serialized);
}

function object(value: unknown, label: string): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new GameSaveError(`${label} must be an object`);
  }
  return value as Record<string, unknown>;
}

function levelRecord(source: Record<string, unknown>, label: string): Record<UpgradeId, number> {
  const result = {} as Record<UpgradeId, number>;
  for (const id of UPGRADE_IDS) {
    const level = source[id];
    if (!Number.isSafeInteger(level) || (level as number) < 0) {
      throw new GameSaveError(`${label}.${id} must be a non-negative integer`);
    }
    if ((level as number) > GAME_CONFIG.upgrades[id].maxLevel) {
      throw new GameSaveError(`${label}.${id} exceeds its configured maximum`);
    }
    result[id] = level as number;
  }
  return result;
}

export function deserializeGameState(serialized: string): GameState {
  let parsed: unknown;
  try {
    parsed = JSON.parse(serialized);
  } catch (error) {
    throw new GameSaveError(`Save is not valid JSON: ${String(error)}`);
  }
  const root = object(parsed, "Save");
  if (
    root.version !== SAVE_VERSION &&
    !PREVIOUS_SAVE_VERSIONS.includes(root.version as 1 | 2)
  ) {
    throw new GameSaveError(`Unsupported save version: ${String(root.version)}`);
  }
  const resources = object(root.resources, "resources");
  const upgrades = object(root.upgrades, "upgrades");
  const automation = object(root.automationEnabled, "automationEnabled");
  const permanent = object(root.permanentLevels, "permanentLevels");
  const achievements: string[] = root.version === 1
    ? []
    : parseAchievementIds(root.achievements);
  const specialization = root.version === SAVE_VERSION
    ? parseSpecialization(root.specialization)
    : { path: null, level: 0 } as const;

  const automationEnabled: Record<AutomationId, boolean> = {
    "seed-array-auto": automation["seed-array-auto"] as boolean,
  };
  if (typeof automationEnabled["seed-array-auto"] !== "boolean") {
    throw new GameSaveError("automationEnabled.seed-array-auto must be boolean");
  }
  if (
    !Number.isSafeInteger(permanent.conduit) ||
    (permanent.conduit as number) < 0 ||
    (permanent.conduit as number) > GAME_CONFIG.prestige.permanentUpgradeMaxLevel
  ) {
    throw new GameSaveError("permanentLevels.conduit is invalid");
  }
  if (!Number.isSafeInteger(root.prestigeCount) || (root.prestigeCount as number) < 0) {
    throw new GameSaveError("prestigeCount is invalid");
  }

  const state: GameState = {
    resources: {
      charge: parseSerializedNumber(resources.charge, "resources.charge"),
      echo: parseSerializedNumber(resources.echo, "resources.echo"),
    },
    upgrades: levelRecord(upgrades, "upgrades"),
    achievements,
    automationEnabled,
    runChargeEarned: parseSerializedNumber(root.runChargeEarned, "runChargeEarned"),
    lifetimeChargeEarned: parseSerializedNumber(
      root.lifetimeChargeEarned,
      "lifetimeChargeEarned",
    ),
    runEchoEarned: parseSerializedNumber(root.runEchoEarned, "runEchoEarned"),
    lifetimeEchoEarned: parseSerializedNumber(
      root.lifetimeEchoEarned,
      "lifetimeEchoEarned",
    ),
    runElapsedSeconds: parseSerializedNumber(root.runElapsedSeconds, "runElapsedSeconds"),
    totalElapsedSeconds: parseSerializedNumber(
      root.totalElapsedSeconds,
      "totalElapsedSeconds",
    ),
    availablePrestigePoints: parseSerializedNumber(
      root.availablePrestigePoints,
      "availablePrestigePoints",
    ),
    lifetimePrestigePoints: parseSerializedNumber(
      root.lifetimePrestigePoints,
      "lifetimePrestigePoints",
    ),
    permanentLevels: { conduit: permanent.conduit as number },
    specialization,
    prestigeCount: root.prestigeCount as number,
  };
  try {
    assertGameState(state);
  } catch (error) {
    throw new GameSaveError(`Save contains invalid game state: ${String(error)}`);
  }
  return refreshAchievements(state);
}

function parseSpecialization(
  value: unknown,
): { path: "charge" | "echo" | null; level: number } {
  const source = object(value, "specialization");
  const path = source.path;
  const level = source.level;
  if (
    (path !== null && path !== "charge" && path !== "echo") ||
    !Number.isSafeInteger(level) ||
    (level as number) < 0 ||
    (level as number) > GAME_CONFIG.specialization.maxLevel
  ) {
    throw new GameSaveError("specialization is invalid");
  }
  return { path, level: level as number };
}

function parseAchievementIds(value: unknown): string[] {
  if (!Array.isArray(value) || value.some((id) => typeof id !== "string")) {
    throw new GameSaveError("achievements must be an array of content IDs");
  }
  const ids = value as string[];
  if (new Set(ids).size !== ids.length) {
    throw new GameSaveError("achievements cannot contain duplicate IDs");
  }
  for (const id of ids) {
    if (!ACHIEVEMENT_IDS.includes(id)) {
      throw new GameSaveError(`Unknown achievement ID: ${id}`);
    }
  }
  return [...ids];
}

export function isDecimal(value: unknown): value is Decimal {
  return value instanceof Decimal;
}
