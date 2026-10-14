import Decimal from "decimal.js";

Decimal.set({
  precision: 40,
  rounding: Decimal.ROUND_HALF_UP,
  toExpNeg: -7,
  toExpPos: 21,
  maxE: 1_000_000_000_000,
  minE: -1_000_000_000_000,
});

export { Decimal };
export type GameNumber = Decimal;

export class GameNumberError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GameNumberError";
  }
}

export function gameNumber(value: Decimal.Value, label = "value"): Decimal {
  let result: Decimal;
  try {
    result = new Decimal(value);
  } catch (error) {
    throw new GameNumberError(`${label} is not a valid decimal value: ${String(error)}`);
  }

  if (!result.isFinite()) {
    throw new GameNumberError(`${label} must be finite and within the supported exponent range`);
  }
  return result;
}

export function assertFinite(value: Decimal, label: string): Decimal {
  if (!value.isFinite()) {
    throw new GameNumberError(`${label} overflowed the supported numeric range`);
  }
  return value;
}

export function addPreservingIncrement(
  current: Decimal,
  increment: Decimal,
  label: string,
): Decimal {
  if (increment.isNegative()) {
    throw new GameNumberError(`${label} increment must not be negative`);
  }
  const result = assertFinite(current.plus(increment), label);
  if (increment.greaterThan(0) && result.equals(current)) {
    throw new GameNumberError(
      `${label} increment is smaller than the configured 40-significant-digit precision`,
    );
  }
  return result;
}

export function serializeNumber(value: Decimal): string {
  return assertFinite(value, "Serialized number").toString();
}

export function parseSerializedNumber(value: unknown, label: string): Decimal {
  if (typeof value !== "string") {
    throw new GameNumberError(`${label} must be stored as a decimal string`);
  }
  return gameNumber(value, label);
}
