import { GAME_CONFIG } from "./config.js";
import { getProductionRates } from "./economy.js";
import { Decimal, addPreservingIncrement, assertFinite, gameNumber } from "./decimal.js";
import { getNextAutomationEvent, runAffordableAutomations } from "./automation.js";
import { cloneGameState, type GameState } from "./state.js";
import { refreshAchievements } from "./unlocks.js";

export class SimulationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SimulationError";
  }
}

function validateDuration(seconds: number): Decimal {
  if (!Number.isFinite(seconds) || seconds < 0) {
    throw new SimulationError("Elapsed time must be a finite, non-negative number");
  }
  if (seconds > GAME_CONFIG.simulation.maxAdvanceSeconds) {
    throw new SimulationError("Elapsed time exceeds the maximum single simulation interval");
  }
  return gameNumber(seconds, "elapsed seconds");
}

function nextMilestoneSeconds(state: GameState, chargePerSecond: Decimal): Decimal | undefined {
  if (chargePerSecond.isZero()) return undefined;
  const nextMilestone = GAME_CONFIG.milestones.find((milestone) =>
    state.runChargeEarned.lessThan(milestone.chargeEarned),
  );
  if (!nextMilestone) return undefined;
  const seconds = nextMilestone.chargeEarned
    .minus(state.runChargeEarned)
    .div(chargePerSecond);
  return seconds.greaterThan(0)
    ? seconds.toDecimalPlaces(9, Decimal.ROUND_CEIL)
    : undefined;
}

function accrue(state: GameState, seconds: Decimal): GameState {
  if (seconds.isZero()) return state;
  const rates = getProductionRates(state);
  const chargeGain = assertFinite(rates.charge.mul(seconds), "Charge production");
  const echoGain = assertFinite(rates.echo.mul(seconds), "Echo production");
  const next = cloneGameState(state);
  next.resources.charge = addPreservingIncrement(
    next.resources.charge,
    chargeGain,
    "Charge balance",
  );
  next.resources.echo = addPreservingIncrement(next.resources.echo, echoGain, "Echo balance");
  next.runChargeEarned = addPreservingIncrement(
    next.runChargeEarned,
    chargeGain,
    "Run Charge earned",
  );
  next.lifetimeChargeEarned = addPreservingIncrement(
    next.lifetimeChargeEarned,
    chargeGain,
    "Lifetime Charge earned",
  );
  next.runEchoEarned = addPreservingIncrement(
    next.runEchoEarned,
    echoGain,
    "Run Echo earned",
  );
  next.lifetimeEchoEarned = addPreservingIncrement(
    next.lifetimeEchoEarned,
    echoGain,
    "Lifetime Echo earned",
  );
  next.runElapsedSeconds = addPreservingIncrement(
    next.runElapsedSeconds,
    seconds,
    "Run elapsed time",
  );
  next.totalElapsedSeconds = addPreservingIncrement(
    next.totalElapsedSeconds,
    seconds,
    "Total elapsed time",
  );
  return next;
}

export function advanceGame(state: GameState, elapsedSeconds: number): GameState {
  let remaining = validateDuration(elapsedSeconds);
  let current = state;
  let events = 0;

  const initiallyAffordable = runAffordableAutomations(current);
  if (initiallyAffordable.purchases > 0) {
    current = initiallyAffordable.state;
    events += initiallyAffordable.purchases;
  }

  while (!remaining.isZero()) {
    const automationResult = runAffordableAutomations(current);
    if (automationResult.purchases > 0) {
      current = automationResult.state;
      events += automationResult.purchases;
      if (events > GAME_CONFIG.simulation.maxSimulationEvents) {
        throw new SimulationError("Simulation exceeded its event safety limit");
      }
      continue;
    }

    const rates = getProductionRates(current);
    const milestoneSeconds = nextMilestoneSeconds(current, rates.charge);
    const nextAutomation = getNextAutomationEvent(current, rates.charge);
    const automationSeconds =
      nextAutomation && nextAutomation.secondsUntilAffordable.greaterThan(0)
        ? nextAutomation.secondsUntilAffordable.toDecimalPlaces(9, Decimal.ROUND_CEIL)
        : undefined;
    const eventTimes = [milestoneSeconds, automationSeconds].filter(
      (value): value is Decimal => value !== undefined && value.greaterThan(0),
    );
    const nextEventTime = eventTimes.reduce<Decimal | undefined>(
      (earliest, time) => (!earliest || time.lessThan(earliest) ? time : earliest),
      undefined,
    );

    if (!nextEventTime || nextEventTime.greaterThan(remaining)) {
      current = accrue(current, remaining);
      remaining = new Decimal(0);
      continue;
    }

    if (nextEventTime.greaterThan(GAME_CONFIG.simulation.maxAdvanceSeconds)) {
      current = accrue(current, remaining);
      remaining = new Decimal(0);
      continue;
    }
    current = accrue(current, nextEventTime);
    remaining = remaining.minus(nextEventTime);
    events += 1;
    if (events > GAME_CONFIG.simulation.maxSimulationEvents) {
      throw new SimulationError("Simulation exceeded its event safety limit");
    }
  }
  const affordableAtEnd = runAffordableAutomations(current);
  if (affordableAtEnd.purchases > 0) {
    events += affordableAtEnd.purchases;
    if (events > GAME_CONFIG.simulation.maxSimulationEvents) {
      throw new SimulationError("Simulation exceeded its event safety limit");
    }
    current = affordableAtEnd.state;
  }
  return refreshAchievements(current);
}
