import { describe, expect, it } from "vitest";
import {
  acquireSessionLease,
  createSaveEnvelope,
  LEASE_DURATION_MS,
  LEASE_KEY,
  LocalSaveError,
  parseSaveEnvelope,
  releaseSessionLease,
  renewSessionLease,
  SAVE_KEY,
  type StorageLike,
} from "../src/app/local-save.js";
import { createNewGameState } from "../src/game/index.js";

class MemoryStorage implements StorageLike {
  private readonly entries = new Map<string, string>();

  getItem(key: string): string | null {
    return this.entries.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.entries.set(key, value);
  }

  removeItem(key: string): void {
    this.entries.delete(key);
  }
}

describe("versioned browser saves", () => {
  it("round-trips a validated save envelope", () => {
    const raw = createSaveEnvelope(createNewGameState(), 1_800_000_000_000);
    const parsed = parseSaveEnvelope(raw);

    expect(parsed.envelope.savedAt).toBe(1_800_000_000_000);
    expect(parsed.state.resources.charge.toString()).toBe("25");
  });

  it.each([
    ["malformed JSON", "{"],
    ["unsupported version", JSON.stringify({ schemaVersion: 999, savedAt: 1, game: "{}" })],
    ["invalid timestamp", JSON.stringify({ schemaVersion: 1, savedAt: Infinity, game: "{}" })],
  ])("rejects %s without discarding its raw value", (_label, raw) => {
    expect(() => parseSaveEnvelope(raw)).toThrow(LocalSaveError);
    expect(raw).not.toBe("");
  });

  it("uses a renewable lease and releases only the current owner's lease", () => {
    const storage = new MemoryStorage();
    const now = 10_000;

    expect(acquireSessionLease(storage, "first", now)).toBe(true);
    expect(acquireSessionLease(storage, "second", now)).toBe(false);
    expect(renewSessionLease(storage, "second", now + 1)).toBe(false);

    releaseSessionLease(storage, "second");
    expect(storage.getItem(LEASE_KEY)).not.toBeNull();
    expect(renewSessionLease(storage, "first", now + 1)).toBe(true);
    expect(acquireSessionLease(storage, "second", now + LEASE_DURATION_MS + 2)).toBe(true);
    releaseSessionLease(storage, "first");
    expect(JSON.parse(storage.getItem(LEASE_KEY) ?? "{}").owner).toBe("second");
    releaseSessionLease(storage, "second");
    expect(storage.getItem(LEASE_KEY)).toBeNull();
  });

  it("keeps save and lease entries separate", () => {
    const storage = new MemoryStorage();
    storage.setItem(SAVE_KEY, "save");
    storage.setItem(LEASE_KEY, "lease");

    expect(storage.getItem(SAVE_KEY)).toBe("save");
    expect(storage.getItem(LEASE_KEY)).toBe("lease");
  });
});
