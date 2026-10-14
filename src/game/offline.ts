import { GAME_CONFIG } from "./config.js";
import { Decimal } from "./decimal.js";
import { advanceGame, SimulationError } from "./simulation.js";
import type { GameState } from "./state.js";

export interface OfflineProgress {
  readonly state: GameState;
  readonly elapsedSeconds: number;
  readonly appliedSeconds: number;
  readonly capped: boolean;
  readonly gained: {
    readonly charge: Decimal;
    readonly echo: Decimal;
  };
}

export function elapsedSecondsFromTimestamps(lastSavedAt: number, now: number): number {
  if (!Number.isFinite(lastSavedAt) || lastSavedAt < 0) {
    throw new SimulationError("Last-save timestamp must be a finite non-negative value");
  }
  if (!Number.isFinite(now) || now < 0) {
    throw new SimulationError("Current timestamp must be a finite non-negative value");
  }
  if (now < lastSavedAt) {
    throw new SimulationError("Current timestamp predates the last save");
  }
  const elapsedMilliseconds = now - lastSavedAt;
  if (elapsedMilliseconds > GAME_CONFIG.simulation.maxTimestampDeltaMilliseconds) {
    throw new SimulationError("Timestamp delta exceeds the plausible offline range");
  }
  return elapsedMilliseconds / 1_000;
}

export function calculateOfflineProgress(
  state: GameState,
  elapsedSeconds: number,
): OfflineProgress {
  if (!Number.isFinite(elapsedSeconds) || elapsedSeconds < 0) {
    throw new SimulationError("Offline elapsed time must be finite and non-negative");
  }
  const appliedSeconds = Math.min(
    elapsedSeconds,
    GAME_CONFIG.simulation.maxOfflineSeconds,
  );
  const next = advanceGame(state, appliedSeconds);
  return {
    state: next,
    elapsedSeconds,
    appliedSeconds,
    capped: elapsedSeconds > appliedSeconds,
    gained: {
      charge: next.resources.charge.minus(state.resources.charge),
      echo: next.resources.echo.minus(state.resources.echo),
    },
  };
}
