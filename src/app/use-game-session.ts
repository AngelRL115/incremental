import { useCallback, useEffect, useRef, useState } from "react";
import {
  advanceGame,
  calculateOfflineProgress,
  createNewGameState,
  elapsedSecondsFromTimestamps,
  type GameState,
} from "../game/index.js";
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
} from "./local-save.js";

type SessionStatus = "loading" | "ready" | "lease-conflict" | "recovery-required";

interface OfflineSummary {
  readonly elapsedLabel: string;
  readonly capped: boolean;
  readonly charge: GameState["resources"]["charge"];
  readonly echo: GameState["resources"]["echo"];
}

const SAVE_INTERVAL_MS = 5_000;
const LEASE_HEARTBEAT_MS = Math.floor(LEASE_DURATION_MS / 3);

function durationLabel(seconds: number): string {
  const total = Math.floor(seconds);
  const days = Math.floor(total / 86_400);
  const hours = Math.floor((total % 86_400) / 3_600);
  const minutes = Math.floor((total % 3_600) / 60);
  if (days > 0) return `${days} d ${hours} h`;
  if (hours > 0) return `${hours} h ${minutes} min`;
  if (minutes > 0) return `${minutes} min`;
  return `${total} s`;
}

function createOwnerId(): string {
  return typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function useGameSession() {
  const [game, setGame] = useState<GameState>();
  const [status, setStatus] = useState<SessionStatus>("loading");
  const [notice, setNotice] = useState<string>();
  const [saveLabel, setSaveLabel] = useState("CARGANDO PARTIDA");
  const [offline, setOffline] = useState<OfflineSummary>();
  const gameRef = useRef<GameState | undefined>(undefined);
  const statusRef = useRef<SessionStatus>("loading");
  const storageRef = useRef<StorageLike | undefined>(undefined);
  const ownerRef = useRef<string | undefined>(undefined);
  const saveEnabledRef = useRef(false);
  const invalidSaveRef = useRef<string | undefined>(undefined);
  const lastTickRef = useRef(0);
  const lastSaveRef = useRef(0);
  const updateStatus = useCallback((next: SessionStatus) => {
    statusRef.current = next;
    setStatus(next);
  }, []);

  const persist = useCallback((state: GameState): boolean => {
    const storage = storageRef.current;
    const owner = ownerRef.current;
    if (!saveEnabledRef.current || !storage || !owner) return false;
    try {
      const now = Date.now();
      if (!renewSessionLease(storage, owner, now)) {
        saveEnabledRef.current = false;
        updateStatus("lease-conflict");
        setNotice("Esta pestaña perdió la sesión exclusiva. Se detuvo la simulación para evitar progreso duplicado.");
        return false;
      }
      storage.setItem(SAVE_KEY, createSaveEnvelope(state, now));
      lastSaveRef.current = now;
      setSaveLabel("PARTIDA GUARDADA");
      setNotice(undefined);
      return true;
    } catch (error) {
      saveEnabledRef.current = false;
      setSaveLabel("GUARDADO NO DISPONIBLE");
      setNotice(error instanceof Error ? error.message : "No se pudo guardar la partida.");
      return false;
    }
  }, [updateStatus]);

  const commit = useCallback((next: GameState, saveImmediately: boolean) => {
    gameRef.current = next;
    setGame(next);
    if (saveImmediately) persist(next);
  }, [persist]);

  const startSession = useCallback(() => {
    updateStatus("loading");
    setNotice(undefined);
    invalidSaveRef.current = undefined;
    const owner = createOwnerId();
    ownerRef.current = owner;

    let storage: StorageLike;
    try {
      storage = window.localStorage;
      storageRef.current = storage;
      if (!acquireSessionLease(storage, owner, Date.now())) {
        updateStatus("lease-conflict");
        setNotice("La partida está activa en otra pestaña. Cierra la otra sesión o inténtalo de nuevo.");
        return;
      }
    } catch (error) {
      storageRef.current = undefined;
      ownerRef.current = undefined;
      saveEnabledRef.current = false;
      const fresh = createNewGameState();
      gameRef.current = fresh;
      setGame(fresh);
      updateStatus("ready");
      setSaveLabel("SIN GUARDADO · ALMACENAMIENTO NO DISPONIBLE");
      setNotice(error instanceof Error ? error.message : "El navegador no permite guardar localmente.");
      lastTickRef.current = Date.now();
      return;
    }

    saveEnabledRef.current = true;
    let raw: string | null;
    try {
      raw = storage.getItem(SAVE_KEY);
    } catch (error) {
      saveEnabledRef.current = false;
      const fresh = createNewGameState();
      gameRef.current = fresh;
      setGame(fresh);
      updateStatus("ready");
      setSaveLabel("SIN GUARDADO · ALMACENAMIENTO NO DISPONIBLE");
      setNotice(error instanceof Error ? error.message : "No se pudo leer el guardado.");
      lastTickRef.current = Date.now();
      return;
    }

    if (raw === null) {
      const fresh = createNewGameState();
      gameRef.current = fresh;
      setGame(fresh);
      updateStatus("ready");
      setSaveLabel("PARTIDA NUEVA · GUARDADO LOCAL");
      lastTickRef.current = Date.now();
      persist(fresh);
      return;
    }

    try {
      const { envelope, state } = parseSaveEnvelope(raw);
      const now = Date.now();
      const elapsedSeconds = elapsedSecondsFromTimestamps(envelope.savedAt, now);
      const offlineResult = calculateOfflineProgress(state, elapsedSeconds);
      gameRef.current = offlineResult.state;
      setGame(offlineResult.state);
      updateStatus("ready");
      lastTickRef.current = now;
      persist(offlineResult.state);
      if (elapsedSeconds > 1) {
        setOffline({
          elapsedLabel: durationLabel(offlineResult.elapsedSeconds),
          capped: offlineResult.capped,
          charge: offlineResult.gained.charge,
          echo: offlineResult.gained.echo,
        });
      }
    } catch (error) {
      invalidSaveRef.current = raw;
      saveEnabledRef.current = false;
      const fresh = createNewGameState();
      gameRef.current = fresh;
      setGame(fresh);
      updateStatus("recovery-required");
      setSaveLabel("RECUPERACIÓN NECESARIA");
      setNotice(error instanceof Error ? error.message : "No se pudo validar la partida.");
      lastTickRef.current = Date.now();
    }
  }, [persist, updateStatus]);

  useEffect(() => {
    startSession();
    const ticker = window.setInterval(() => {
      if (statusRef.current !== "ready") return;
      const current = gameRef.current;
      if (!current) return;
      const now = Date.now();
      const elapsedSeconds = Math.max(0, (now - lastTickRef.current) / 1000);
      lastTickRef.current = now;
      try {
        const next = advanceGame(current, elapsedSeconds);
        gameRef.current = next;
        setGame(next);
        if (now - lastSaveRef.current >= SAVE_INTERVAL_MS) persist(next);
      } catch (error) {
        saveEnabledRef.current = false;
        setNotice(error instanceof Error ? error.message : "La simulación se detuvo por un error.");
      }
    }, 250);
    const heartbeat = window.setInterval(() => {
      const storage = storageRef.current;
      const owner = ownerRef.current;
      if (!storage || !owner || !saveEnabledRef.current) return;
      try {
        if (!renewSessionLease(storage, owner, Date.now())) {
          saveEnabledRef.current = false;
          updateStatus("lease-conflict");
          setNotice("Otra pestaña tomó la sesión. Se detuvo esta simulación para evitar doble progreso.");
        }
      } catch (error) {
        saveEnabledRef.current = false;
        setNotice(error instanceof Error ? error.message : "Se perdió el guardado local.");
      }
    }, LEASE_HEARTBEAT_MS);
    const onStorage = (event: StorageEvent) => {
      if (event.key !== LEASE_KEY || !event.newValue) return;
      try {
        const lease = JSON.parse(event.newValue) as { owner?: unknown };
        if (lease.owner !== ownerRef.current) {
          saveEnabledRef.current = false;
          updateStatus("lease-conflict");
          setNotice("La partida cambió de pestaña. Recarga para volver a sincronizar.");
        }
      } catch {
        saveEnabledRef.current = false;
        updateStatus("lease-conflict");
        setNotice("No se pudo comprobar la sesión activa. Recarga para proteger la partida.");
      }
    };
    const onPageHide = () => {
      if (gameRef.current) persist(gameRef.current);
      const storage = storageRef.current;
      const owner = ownerRef.current;
      if (storage && owner) releaseSessionLease(storage, owner);
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("pagehide", onPageHide);
    return () => {
      window.clearInterval(ticker);
      window.clearInterval(heartbeat);
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("pagehide", onPageHide);
      const storage = storageRef.current;
      const owner = ownerRef.current;
      if (gameRef.current) persist(gameRef.current);
      if (storage && owner) releaseSessionLease(storage, owner);
    };
  }, [persist, startSession, updateStatus]);

  const runAction = useCallback((action: (state: GameState) => GameState) => {
    const current = gameRef.current;
    if (!current || status !== "ready") return;
    try {
      const next = action(current);
      setNotice(undefined);
      commit(next, true);
    } catch (error) {
      setNotice(
        error instanceof Error
          ? error.message
          : "La acción no se pudo completar.",
      );
    }
  }, [commit, status]);

  const retry = useCallback(() => {
    const storage = storageRef.current;
    const owner = ownerRef.current;
    if (storage && owner) {
      try {
        releaseSessionLease(storage, owner);
      } catch (error) {
        setNotice(error instanceof Error ? error.message : "No se pudo liberar la sesión anterior.");
        return;
      }
    }
    ownerRef.current = undefined;
    storageRef.current = undefined;
    startSession();
  }, [startSession]);

  const confirmResetInvalidSave = useCallback(() => {
    if (!window.confirm("El guardado inválido se eliminará. ¿Crear una partida nueva?")) return;
    const storage = storageRef.current;
    if (!storage) return;
    try {
      storage.removeItem(SAVE_KEY);
      invalidSaveRef.current = undefined;
      saveEnabledRef.current = true;
      const fresh = createNewGameState();
      gameRef.current = fresh;
      setGame(fresh);
      updateStatus("ready");
      setNotice(undefined);
      setSaveLabel("PARTIDA NUEVA · GUARDADO LOCAL");
      lastTickRef.current = Date.now();
      persist(fresh);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "No se pudo restablecer la partida.");
    }
  }, [persist, updateStatus]);

  const confirmReset = useCallback(() => {
    if (!window.confirm("Se borrará toda la partida local, incluidos los puntos permanentes. ¿Continuar?")) return;
    const storage = storageRef.current;
    if (!storage || !ownerRef.current) {
      setNotice("No hay almacenamiento local disponible para restablecer la partida.");
      return;
    }
    try {
      storage.removeItem(SAVE_KEY);
      const fresh = createNewGameState();
      gameRef.current = fresh;
      setGame(fresh);
      setNotice(undefined);
      persist(fresh);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "No se pudo restablecer la partida.");
    }
  }, [persist]);

  const exportRaw = useCallback((raw: string, filename: string) => {
    const url = URL.createObjectURL(new Blob([raw], { type: "application/json" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  }, []);

  const exportSave = useCallback(() => {
    if (!gameRef.current) return;
    try {
      exportRaw(createSaveEnvelope(gameRef.current, Date.now()), "space-idle-save.json");
      setNotice(undefined);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "No se pudo exportar la partida.");
    }
  }, [exportRaw]);

  const exportInvalidSave = useCallback(() => {
    if (invalidSaveRef.current) exportRaw(invalidSaveRef.current, "space-idle-save-invalid.json");
  }, [exportRaw]);

  const importSave = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";
    if (!file) return;
    try {
      if (file.size > 1_000_000) throw new LocalSaveError("El archivo supera el límite de 1 MB.");
      const raw = await file.text();
      const imported = parseSaveEnvelope(raw);
      if (!window.confirm("La partida actual será reemplazada por el archivo validado. ¿Importar?")) return;
      if (!storageRef.current || !ownerRef.current) {
        throw new LocalSaveError("El guardado local no está disponible en esta sesión.");
      }
      commit(imported.state, false);
      if (!persist(imported.state)) return;
      setNotice("Partida importada correctamente. El progreso offline del archivo no se acredita al importar.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "No se pudo importar la partida.");
    }
  }, [commit, persist]);

  const setRendererError = useCallback((message: string) => {
    setNotice(message);
  }, []);

  const dismissOffline = useCallback(() => setOffline(undefined), []);

  return {
    game,
    status,
    notice,
    saveLabel,
    offline,
    runAction,
    retry,
    confirmReset,
    confirmResetInvalidSave,
    exportSave,
    exportInvalidSave,
    importSave,
    setRendererError,
    dismissOffline,
  };
}
