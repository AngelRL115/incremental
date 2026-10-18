import { GAME_CONFIG, type SpecializationPath } from "./config.js";
import { Decimal, assertFinite } from "./decimal.js";
import { cloneGameState, type GameState } from "./state.js";
import { refreshAchievements } from "./unlocks.js";

export interface SpecializationQuote {
  readonly allowed: boolean;
  readonly reason?: string;
  readonly rank: number;
  readonly cost?: Decimal;
}

export class SpecializationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SpecializationError";
  }
}

export function specializationCost(level: number): Decimal {
  if (
    !Number.isSafeInteger(level) ||
    level < 0 ||
    level >= GAME_CONFIG.specialization.maxLevel
  ) {
    throw new RangeError("Specialization level is outside its purchasable range");
  }
  return new Decimal(
    GAME_CONFIG.specialization.baseCost +
      level * GAME_CONFIG.specialization.costIncrement,
  );
}

export function getSpecializationQuote(
  state: GameState,
  path: SpecializationPath,
): SpecializationQuote {
  const rank = state.specialization.level + 1;
  if (state.prestigeCount < 1) {
    return {
      allowed: false,
      reason: "Disponible después del primer prestigio.",
      rank,
    };
  }
  if (state.specialization.level >= GAME_CONFIG.specialization.maxLevel) {
    return {
      allowed: false,
      reason: "Esta trayectoria ya alcanzó el nivel máximo.",
      rank,
    };
  }
  if (state.specialization.path !== null && state.specialization.path !== path) {
    return {
      allowed: false,
      reason: "La elección es permanente; la ruta alternativa quedó descartada.",
      rank,
    };
  }

  const cost = specializationCost(state.specialization.level);
  if (state.availablePrestigePoints.lessThan(cost)) {
    return {
      allowed: false,
      reason: `Necesitas ${cost.toString()} RP; tienes ${state.availablePrestigePoints.toString()}.`,
      rank,
      cost,
    };
  }
  return { allowed: true, rank, cost };
}

export function buySpecialization(
  state: GameState,
  path: SpecializationPath,
): GameState {
  const quote = getSpecializationQuote(state, path);
  if (!quote.allowed || quote.cost === undefined) {
    throw new SpecializationError(quote.reason ?? "Specialization purchase is unavailable");
  }

  const next = cloneGameState(state);
  next.availablePrestigePoints = assertFinite(
    next.availablePrestigePoints.minus(quote.cost),
    "Available prestige points",
  );
  next.specialization = {
    path,
    level: quote.rank,
  };
  return refreshAchievements(next);
}
