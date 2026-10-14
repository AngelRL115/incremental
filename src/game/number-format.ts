import { Decimal, gameNumber } from "./decimal.js";

export type NumberFormat = "compact" | "scientific" | "full";

export function formatGameNumber(
  value: Decimal,
  format: NumberFormat = "compact",
): string {
  if (!value.isFinite()) throw new RangeError("Cannot format a non-finite game number");
  if (format === "scientific") return value.toExponential(3);
  if (format === "full") return value.toFixed(value.decimalPlaces() === 0 ? 0 : 2);
  if (value.abs().lessThan(1_000_000)) {
    return value.toDecimalPlaces(2).toFixed(2);
  }
  return value.toExponential(2);
}

export function parseGameNumber(value: string): Decimal {
  return gameNumber(value, "formatted game number");
}
