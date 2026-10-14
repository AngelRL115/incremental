import {
  ACHIEVEMENTS,
  GAME_CONFIG,
  UPGRADE_IDS,
  type AchievementDefinition,
  type UpgradeDefinition,
  type UpgradeId,
} from "./config.js";
import type { GameState } from "./state.js";
import { cloneGameState } from "./state.js";

export interface UnlockResult {
  readonly unlocked: boolean;
  readonly reason?: string;
}

export function getMilestoneIds(state: GameState): string[] {
  return GAME_CONFIG.milestones
    .filter((milestone) => state.runChargeEarned.greaterThanOrEqualTo(milestone.chargeEarned))
    .map((milestone) => milestone.id);
}

export function getUpgradeUnlock(state: GameState, upgradeId: UpgradeId): UnlockResult {
  const unmet = GAME_CONFIG.upgrades[upgradeId].prerequisites.find((requirement) => {
    switch (requirement.kind) {
      case "run-charge-earned":
        return state.runChargeEarned.lessThan(requirement.amount);
      case "run-echo-earned":
        return state.runEchoEarned.lessThan(requirement.amount);
      case "upgrade-level":
        return state.upgrades[requirement.upgradeId] < requirement.minimumLevel;
    }
  });
  return unmet
    ? { unlocked: false, reason: unmet.explanation }
    : { unlocked: true };
}

export function validateUpgradeCatalog(
  definitions: readonly UpgradeDefinition[],
): void {
  const byId = new Map<UpgradeId, UpgradeDefinition>();
  for (const definition of definitions) {
    if (byId.has(definition.id)) {
      throw new Error(`Duplicate upgrade definition: ${definition.id}`);
    }
    byId.set(definition.id, definition);
  }

  for (const definition of definitions) {
    const seenRequirements = new Set<string>();
    for (const requirement of definition.prerequisites) {
      const key = requirement.kind === "upgrade-level"
        ? `${requirement.kind}:${requirement.upgradeId}`
        : `${requirement.kind}:${requirement.amount.toString()}`;
      if (seenRequirements.has(key)) {
        throw new Error(`Duplicate prerequisite in upgrade ${definition.id}`);
      }
      seenRequirements.add(key);
      if (requirement.kind === "upgrade-level") {
        if (!byId.has(requirement.upgradeId)) {
          throw new Error(
            `Upgrade ${definition.id} depends on missing upgrade ${requirement.upgradeId}`,
          );
        }
        if (
          !Number.isSafeInteger(requirement.minimumLevel) ||
          requirement.minimumLevel < 1
        ) {
          throw new Error(`Upgrade ${definition.id} has an invalid prerequisite level`);
        }
      } else if (!requirement.amount.isFinite() || requirement.amount.isNegative()) {
        throw new Error(`Upgrade ${definition.id} has an invalid resource prerequisite`);
      }
      if (
        typeof requirement.explanation !== "string" ||
        requirement.explanation.trim().length === 0
      ) {
        throw new Error(`Upgrade ${definition.id} has an empty prerequisite explanation`);
      }
    }
  }

  const visiting = new Set<UpgradeId>();
  const visited = new Set<UpgradeId>();
  const visit = (id: UpgradeId) => {
    if (visiting.has(id)) throw new Error(`Circular upgrade prerequisite at ${id}`);
    if (visited.has(id)) return;
    visiting.add(id);
    const definition = byId.get(id);
    for (const requirement of definition?.prerequisites ?? []) {
      if (requirement.kind === "upgrade-level") visit(requirement.upgradeId);
    }
    visiting.delete(id);
    visited.add(id);
  };
  for (const id of byId.keys()) visit(id);
}

validateUpgradeCatalog(UPGRADE_IDS.map((id) => GAME_CONFIG.upgrades[id]));

export function validateAchievementCatalog(
  definitions: readonly AchievementDefinition[],
): void {
  const ids = new Set<string>();
  for (const definition of definitions) {
    if (
      typeof definition.id !== "string" ||
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(definition.id)
    ) {
      throw new Error(`Achievement ID is not a stable content ID: ${definition.id}`);
    }
    if (ids.has(definition.id)) {
      throw new Error(`Duplicate achievement definition: ${definition.id}`);
    }
    ids.add(definition.id);
    if (
      typeof definition.title !== "string" ||
      !definition.title.trim() ||
      typeof definition.entry !== "string" ||
      !definition.entry.trim()
    ) {
      throw new Error(`Achievement ${definition.id} is missing player-facing copy`);
    }
    if (typeof definition.condition !== "function") {
      throw new Error(`Achievement ${definition.id} is missing its state condition`);
    }
  }
}

validateAchievementCatalog(ACHIEVEMENTS);

export function refreshAchievements(state: GameState): GameState {
  const completed = new Set(state.achievements);
  const newlyCompleted = ACHIEVEMENTS
    .filter((achievement) => !completed.has(achievement.id) && achievement.condition(state))
    .map((achievement) => achievement.id);
  if (newlyCompleted.length === 0) return state;

  const next = cloneGameState(state);
  next.achievements.push(...newlyCompleted);
  return next;
}
