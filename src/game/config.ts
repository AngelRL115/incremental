import { Decimal, gameNumber } from "./decimal.js";
import type { GameState } from "./state.js";

export type ResourceId = "charge" | "echo";
export type UpgradeId =
  | "seed-array"
  | "resonance-lens"
  | "echo-loom"
  | "harmonic-drive"
  | "seed-autobuyer";
export type AutomationId = "seed-array-auto";
export const SPECIALIZATION_PATHS = ["charge", "echo"] as const;
export type SpecializationPath = (typeof SPECIALIZATION_PATHS)[number];

export interface UpgradeDefinition {
  readonly id: UpgradeId;
  readonly name: string;
  readonly currency: ResourceId;
  readonly baseCost: Decimal;
  readonly costGrowth: Decimal;
  readonly maxLevel: number;
  readonly effect:
    | "charge-production"
    | "charge-multiplier"
    | "echo-production"
    | "automation";
  readonly multiplierPerLevel?: Decimal;
  readonly prerequisites: readonly UpgradePrerequisite[];
}

export type UpgradePrerequisite =
  | {
      readonly kind: "run-charge-earned";
      readonly amount: Decimal;
      readonly explanation: string;
    }
  | {
      readonly kind: "run-echo-earned";
      readonly amount: Decimal;
      readonly explanation: string;
    }
  | {
      readonly kind: "upgrade-level";
      readonly upgradeId: UpgradeId;
      readonly minimumLevel: number;
      readonly explanation: string;
    };

export interface AchievementDefinition {
  readonly id: string;
  readonly title: string;
  readonly entry: string;
  readonly condition: (state: GameState) => boolean;
}

export interface MilestoneDefinition {
  readonly id: string;
  readonly chargeEarned: Decimal;
  readonly productionMultiplier?: Decimal;
}

export const GAME_CONFIG = {
  startingCharge: gameNumber(25),
  pulseCharge: gameNumber(2),
  seedChargePerLevelPerSecond: gameNumber("4"),
  echoPerLoomLevelPerSecond: gameNumber("0.8"),
  upgrades: {
    "seed-array": {
      id: "seed-array",
      name: "Seed Array",
      currency: "charge",
      baseCost: gameNumber(10),
      costGrowth: gameNumber("1.18"),
      maxLevel: 100_000,
      effect: "charge-production",
      prerequisites: [],
    },
    "resonance-lens": {
      id: "resonance-lens",
      name: "Resonance Lens",
      currency: "charge",
      baseCost: gameNumber(60),
      costGrowth: gameNumber("1.7"),
      maxLevel: 6,
      effect: "charge-multiplier",
      multiplierPerLevel: gameNumber("1.3"),
      prerequisites: [
        {
          kind: "run-charge-earned",
          amount: gameNumber(25),
          explanation: "Genera 25 Charge en esta partida.",
        },
      ],
    },
    "echo-loom": {
      id: "echo-loom",
      name: "Echo Loom",
      currency: "charge",
      baseCost: gameNumber(120),
      costGrowth: gameNumber("1.35"),
      maxLevel: 50,
      effect: "echo-production",
      prerequisites: [
        {
          kind: "run-charge-earned",
          amount: gameNumber(250),
          explanation: "Genera 250 Charge en esta partida.",
        },
      ],
    },
    "harmonic-drive": {
      id: "harmonic-drive",
      name: "Harmonic Drive",
      currency: "echo",
      baseCost: gameNumber(12),
      costGrowth: gameNumber("1.8"),
      maxLevel: 4,
      effect: "charge-multiplier",
      multiplierPerLevel: gameNumber("1.25"),
      prerequisites: [
        {
          kind: "upgrade-level",
          upgradeId: "echo-loom",
          minimumLevel: 1,
          explanation: "Adquiere un Echo Loom.",
        },
        {
          kind: "run-echo-earned",
          amount: gameNumber(5),
          explanation: "Genera 5 Echo en esta partida.",
        },
      ],
    },
    "seed-autobuyer": {
      id: "seed-autobuyer",
      name: "Seed Array Autopilot",
      currency: "echo",
      baseCost: gameNumber(40),
      costGrowth: gameNumber(1),
      maxLevel: 1,
      effect: "automation",
      prerequisites: [
        {
          kind: "upgrade-level",
          upgradeId: "echo-loom",
          minimumLevel: 1,
          explanation: "Adquiere un Echo Loom.",
        },
        {
          kind: "run-charge-earned",
          amount: gameNumber(1_000),
          explanation: "Genera 1,000 Charge en esta partida.",
        },
        {
          kind: "run-echo-earned",
          amount: gameNumber(20),
          explanation: "Genera 20 Echo en esta partida.",
        },
      ],
    },
  } satisfies Record<UpgradeId, UpgradeDefinition>,
  milestones: [
    { id: "echo-research", chargeEarned: gameNumber(250) },
    {
      id: "resonant-threshold",
      chargeEarned: gameNumber(1_000),
      productionMultiplier: gameNumber("1.5"),
    },
    {
      id: "deep-resonance",
      chargeEarned: gameNumber(10_000),
      productionMultiplier: gameNumber("1.5"),
    },
  ] satisfies readonly MilestoneDefinition[],
  prestige: {
    eligibilityChargeEarned: gameNumber(2_500),
    rewardDivisor: gameNumber(2_500),
    permanentMultiplierPerLevel: gameNumber("1.25"),
    permanentUpgradeBaseCost: 1,
    permanentUpgradeMaxLevel: 25,
  },
  specialization: {
    maxLevel: 3,
    baseCost: 1,
    costIncrement: 1,
    chargeMultiplierPerLevel: gameNumber("1.15"),
    echoMultiplierPerLevel: gameNumber("1.25"),
  },
  simulation: {
    maxAdvanceSeconds: 31_536_000,
    maxOfflineSeconds: 604_800,
    maxTimestampDeltaMilliseconds: 31_536_000_000,
    maxSimulationEvents: 50_000,
  },
  automation: {
    seedArray: {
      id: "seed-array-auto" as const,
      purchaseUpgrade: "seed-array" as const,
      priority: 10,
    },
  },
} as const;

export const UPGRADE_IDS = Object.keys(GAME_CONFIG.upgrades) as UpgradeId[];
export const ACHIEVEMENTS = [
  {
    id: "seed-array-awakened",
    title: "La primera señal",
    entry: "El Seed Array responde. Una corriente estable cruza el campo.",
    condition: (state) => state.upgrades["seed-array"] >= 2,
  },
  {
    id: "echo-observed",
    title: "Ecos en el vacío",
    entry: "La señal ha cruzado el umbral: Echo ya puede estudiarse.",
    condition: (state) => state.runChargeEarned.greaterThanOrEqualTo(250),
  },
  {
    id: "harmonic-drive-tuned",
    title: "Frecuencia acoplada",
    entry: "El Harmonic Drive encuentra una frecuencia que antes permanecía oculta.",
    condition: (state) => state.upgrades["harmonic-drive"] >= 1,
  },
  {
    id: "first-resonance",
    title: "Otra vuelta al origen",
    entry: "La primera Resonancia queda registrada; la memoria del observatorio perdura.",
    condition: (state) => state.prestigeCount >= 1,
  },
  {
    id: "conduit-established",
    title: "Conducto permanente",
    entry: "Conduit conserva una parte de la señal entre frecuencias.",
    condition: (state) => state.permanentLevels.conduit >= 1,
  },
  {
    id: "specialization-chosen",
    title: "Una nueva trayectoria",
    entry: "Una ruta permanente transforma la señal del observatorio.",
    condition: (state) => state.specialization.level >= 1,
  },
  {
    id: "deep-resonance-recorded",
    title: "Campo profundo",
    entry: "La señal alcanza 10,000 Charge generado en una sola frecuencia.",
    condition: (state) => state.runChargeEarned.greaterThanOrEqualTo(10_000),
  },
] satisfies readonly AchievementDefinition[];
export const ACHIEVEMENT_IDS: readonly string[] = Object.freeze(
  ACHIEVEMENTS.map(({ id }) => id),
);

export function upgradeDefinition(id: UpgradeId): UpgradeDefinition {
  return GAME_CONFIG.upgrades[id];
}
