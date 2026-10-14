import {
  deserializeGameState,
  serializeGameState,
  type GameState,
} from "../game/index.js";

export const SAVE_KEY = "space-idle.save";
export const LEASE_KEY = "space-idle.active-session";
export const SAVE_SCHEMA_VERSION = 1;
export const LEASE_DURATION_MS = 15_000;

export interface SaveEnvelope {
  readonly schemaVersion: typeof SAVE_SCHEMA_VERSION;
  readonly savedAt: number;
  readonly game: string;
}

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

interface Lease {
  readonly owner: string;
  readonly expiresAt: number;
}

export class LocalSaveError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LocalSaveError";
  }
}

function asRecord(value: unknown): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new LocalSaveError("La partida no tiene un formato válido.");
  }
  return value as Record<string, unknown>;
}

export function parseSaveEnvelope(raw: string): {
  readonly envelope: SaveEnvelope;
  readonly state: GameState;
} {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new LocalSaveError("El archivo de partida no contiene JSON válido.");
  }
  const value = asRecord(parsed);
  if (value.schemaVersion !== SAVE_SCHEMA_VERSION) {
    throw new LocalSaveError("La versión de esta partida no es compatible.");
  }
  if (typeof value.game !== "string") {
    throw new LocalSaveError("Falta el estado de la partida.");
  }
  if (typeof value.savedAt !== "number" || !Number.isFinite(value.savedAt) || value.savedAt < 0) {
    throw new LocalSaveError("La fecha de guardado no es válida.");
  }
  try {
    return {
      envelope: {
        schemaVersion: SAVE_SCHEMA_VERSION,
        savedAt: value.savedAt,
        game: value.game,
      },
      state: deserializeGameState(value.game),
    };
  } catch (error) {
    throw new LocalSaveError(
      error instanceof Error ? error.message : "El estado guardado no es válido.",
    );
  }
}

export function createSaveEnvelope(state: GameState, savedAt: number): string {
  if (!Number.isFinite(savedAt) || savedAt < 0) {
    throw new LocalSaveError("La fecha de guardado no es válida.");
  }
  return JSON.stringify({
    schemaVersion: SAVE_SCHEMA_VERSION,
    savedAt,
    game: serializeGameState(state),
  } satisfies SaveEnvelope);
}

function parseLease(raw: string | null): Lease | undefined {
  if (!raw) return undefined;
  try {
    const lease = asRecord(JSON.parse(raw));
    if (
      typeof lease.owner === "string" &&
      typeof lease.expiresAt === "number" &&
      Number.isFinite(lease.expiresAt)
    ) {
      return { owner: lease.owner, expiresAt: lease.expiresAt };
    }
  } catch {
    return undefined;
  }
  return undefined;
}

export function acquireSessionLease(
  storage: StorageLike,
  owner: string,
  now: number,
): boolean {
  const existing = parseLease(storage.getItem(LEASE_KEY));
  if (existing && existing.owner !== owner && existing.expiresAt > now) return false;

  storage.setItem(
    LEASE_KEY,
    JSON.stringify({ owner, expiresAt: now + LEASE_DURATION_MS } satisfies Lease),
  );
  return parseLease(storage.getItem(LEASE_KEY))?.owner === owner;
}

export function renewSessionLease(
  storage: StorageLike,
  owner: string,
  now: number,
): boolean {
  const existing = parseLease(storage.getItem(LEASE_KEY));
  if (existing?.owner !== owner) return false;
  storage.setItem(
    LEASE_KEY,
    JSON.stringify({ owner, expiresAt: now + LEASE_DURATION_MS } satisfies Lease),
  );
  return parseLease(storage.getItem(LEASE_KEY))?.owner === owner;
}

export function releaseSessionLease(storage: StorageLike, owner: string): void {
  if (parseLease(storage.getItem(LEASE_KEY))?.owner === owner) {
    storage.removeItem(LEASE_KEY);
  }
}
