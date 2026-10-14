import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import {
  ACHIEVEMENTS,
  GAME_CONFIG,
  buyMaxAffordable,
  buyPermanentConduit,
  buyUpgrade,
  emitPulse,
  formatGameNumber,
  getMaxAffordableUpgradeQuantity,
  getMarginalProduction,
  getMilestoneIds,
  getPrestigePreview,
  getProductionRates,
  getPurchaseQuote,
  getUpgradeUnlockStatus,
  permanentUpgradeCost,
  performPrestige,
  upgradeCostAtLevel,
  type GameState,
  type UpgradeId,
} from "../game/index.js";
import { ParticleField } from "../renderer/ParticleField.js";
import { useGameSession } from "./use-game-session.js";

const UPGRADE_ORDER: readonly UpgradeId[] = [
  "seed-array",
  "resonance-lens",
  "echo-loom",
  "harmonic-drive",
  "seed-autobuyer",
];

const UPGRADE_COPY: Record<UpgradeId, { title: string; description: string }> = {
  "seed-array": {
    title: "Seed Array",
    description: "Aumenta la producción base de Charge.",
  },
  "resonance-lens": {
    title: "Resonance Lens",
    description: "Multiplica la producción de Charge.",
  },
  "echo-loom": {
    title: "Echo Loom",
    description: "Genera Echo, el segundo recurso de la simulación.",
  },
  "harmonic-drive": {
    title: "Harmonic Drive",
    description: "Amplifica la producción de Charge.",
  },
  "seed-autobuyer": {
    title: "Seed Array Autopilot",
    description: "Compra automáticamente Seed Arrays cuando son asequibles.",
  },
};

export default function App() {
  const [reducedEffects, setReducedEffects] = useState(false);
  const [milestonePulse, setMilestonePulse] = useState(0);
  const [prestigeDialogOpen, setPrestigeDialogOpen] = useState(false);
  const session = useGameSession();
  const game = session.game;
  const rates = useMemo(() => game ? getProductionRates(game) : null, [game]);
  const conduitCost = game ? permanentUpgradeCost(game.permanentLevels.conduit) : undefined;
  const canBuyConduit = Boolean(
    game && conduitCost && game.availablePrestigePoints.greaterThanOrEqualTo(conduitCost),
  );

  return (
    <main className="observatory-shell">
      <a className="skip-link" href="#game-content">Saltar a la simulación</a>
      <header className="topline">
        <a className="wordmark" href="/" aria-label="Space Idle, inicio">
          <img className="orbit-mark-svg" src="/orbit-mark.svg" alt="" aria-hidden="true" />
          <span>SPACE IDLE</span>
        </a>
        <div className="header-meta">
          <span className="live-indicator"><i /> {session.status === "ready" ? "SIMULACIÓN ACTIVA" : "SIMULACIÓN EN PAUSA"}</span>
          <button
            className="quiet-toggle"
            type="button"
            aria-pressed={reducedEffects}
            onClick={() => setReducedEffects((value) => !value)}
          >
            {reducedEffects ? "Efectos reducidos: sí" : "Reducir efectos"}
          </button>
          {game && (
            <button className="quiet-toggle" type="button" onClick={session.exportSave}>
              Exportar partida
            </button>
          )}
        </div>
      </header>

      {session.notice && (
        <div className="notice notice-error" role="alert">
          <span>{session.notice}</span>
          {session.retry && <button type="button" onClick={session.retry}>Reintentar</button>}
        </div>
      )}

      {session.status === "loading" && <p className="loading-line" role="status">Preparando observatorio…</p>}
      {session.status === "lease-conflict" && (
        <section className="recovery-panel" aria-labelledby="lease-title">
          <p className="eyebrow">PARTIDA EN USO</p>
          <h1 id="lease-title">El observatorio ya está abierto.</h1>
          <p>Para evitar duplicar progreso offline, continúa en la pestaña activa o vuelve a comprobar.</p>
          <button className="action-button" type="button" onClick={session.retry}>Comprobar de nuevo</button>
        </section>
      )}
      {session.status === "recovery-required" && (
        <section className="recovery-panel" aria-labelledby="recovery-title">
          <p className="eyebrow">RECUPERACIÓN DE PARTIDA</p>
          <h1 id="recovery-title">No se pudo validar el guardado.</h1>
          <p>{session.notice} El archivo original se conserva sin modificar.</p>
          <div className="action-row">
            <button className="action-button" type="button" onClick={session.exportInvalidSave}>Descargar archivo dañado</button>
            <button className="quiet-toggle" type="button" onClick={session.confirmResetInvalidSave}>Crear partida nueva</button>
          </div>
        </section>
      )}

      {game && rates && session.status === "ready" && (
        <>
      <section className="observatory" id="game-content" tabIndex={-1}>
        <div className="scene-heading">
          <p className="eyebrow">OBSERVATORIO · CAMPO 01</p>
          <h1>La materia encuentra su ritmo.</h1>
          <p className="scene-description">
            Cada partícula sigue una trayectoria. Cada decisión cambia la escala del sistema.
          </p>
        </div>
        <div className="scene-frame">
          <ParticleField reducedEffects={reducedEffects} milestonePulse={milestonePulse} onError={session.setRendererError} />
          <div className="scene-coordinate" aria-hidden="true">N 04.08 · E 18.25</div>
          <div className="scene-caption">
            <span>SEED ARRAY <b>× {game.upgrades["seed-array"]}</b></span>
            <span>CAMPO ESTABLE <i /></span>
          </div>
        </div>
      </section>

      <section className="readout" aria-label="Estado de la simulación">
        <div className="readout-primary">
          <p className="eyebrow">RECURSO DISPONIBLE</p>
          <p className="resource-value"><span className="resource-orb" />{formatGameNumber(game.resources.charge)}<span className="resource-unit">CHARGE</span></p>
          <p className="rate-line">Producción <strong>{formatGameNumber(rates.charge)} Charge/s</strong></p>
        </div>
        <div className="readout-secondary">
          <div>
            <span className="eyebrow">ECHO</span>
            <strong>{formatGameNumber(game.resources.echo)}</strong>
            <small>{formatGameNumber(rates.echo)} / s</small>
          </div>
          <div>
            <span className="eyebrow">RESONANCIA</span>
            <strong>{formatGameNumber(game.availablePrestigePoints)}</strong>
            <small>{game.prestigeCount} {game.prestigeCount === 1 ? "reinicio" : "reinicios"}</small>
          </div>
        </div>
      </section>

      <section className="play-controls" aria-label="Acciones de la simulación">
        <div>
          <p className="eyebrow">ACCIÓN MANUAL</p>
          <p className="supporting-copy">Un pulso inyecta Charge sin adelantar el reloj.</p>
        </div>
        <button className="action-button" type="button" onClick={() => {
          session.runAction((state) => emitPulse(state));
          setMilestonePulse(performance.now());
        }}>Emitir pulso <span>+2 Charge</span></button>
      </section>

      <section className="progress-section" aria-labelledby="progress-title">
        <div className="section-heading">
          <div><p className="eyebrow">LECTURA DEL SISTEMA</p><h2 id="progress-title">Siguiente umbral</h2></div>
          <span className="progress-count">{getMilestoneIds(game).length} / {GAME_CONFIG.milestones.length} hitos</span>
        </div>
        <MilestoneProgress game={game} />
      </section>

      <section className="upgrades-section" aria-labelledby="upgrades-title">
        <div className="section-heading">
          <div><p className="eyebrow">INSTRUMENTOS DISPONIBLES</p><h2 id="upgrades-title">Mejoras</h2></div>
          {game.automationEnabled["seed-array-auto"] && <span className="automation-state">AUTOPILOT ACTIVO</span>}
        </div>
        <div className="upgrade-list">
          {UPGRADE_ORDER.map((id) => (
            <UpgradeRow key={id} game={game} id={id} onBuy={(quantity) => {
              session.runAction((state) => quantity === "max" ? buyMaxAffordable(state, id) : buyUpgrade(state, id));
            }} />
          ))}
        </div>
      </section>

      <section className="chronicle-section" aria-labelledby="chronicle-title">
        <div className="section-heading">
          <div><p className="eyebrow">ARCHIVO DEL OBSERVATORIO</p><h2 id="chronicle-title">Crónica de frecuencia</h2></div>
          <span className="progress-count">{game.achievements.length} / {ACHIEVEMENTS.length} registros</span>
        </div>
        <ul className="chronicle-list">
          {ACHIEVEMENTS.map((achievement) => {
            const recorded = game.achievements.includes(achievement.id);
            return (
              <li key={achievement.id} className={recorded ? "chronicle-entry" : "chronicle-entry chronicle-entry-locked"}>
                <span>{recorded ? "REGISTRADO" : "PENDIENTE"}</span>
                <h3>{achievement.title}</h3>
                <p>{recorded ? achievement.entry : "Aún no se han reunido las condiciones para este registro."}</p>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="prestige-section" aria-labelledby="prestige-title">
        <div>
          <p className="eyebrow">RESONANCIA · RESET PERMANENTE</p>
          <h2 id="prestige-title">Comenzar una nueva frecuencia</h2>
          <p className="supporting-copy">Al reiniciar se restablecen Charge, Echo y las mejoras de esta run. Conduit y los puntos de Resonancia se conservan.</p>
        </div>
        {getPrestigePreview(game).eligible ? (
          <button className="action-button" type="button" onClick={() => setPrestigeDialogOpen(true)}>
            Revisar prestigio · +{formatGameNumber(getPrestigePreview(game).reward)} RP
          </button>
        ) : (
          <p className="prestige-requirement">Requiere {formatGameNumber(GAME_CONFIG.prestige.eligibilityChargeEarned)} Charge generado · {formatGameNumber(game.runChargeEarned)} / {formatGameNumber(GAME_CONFIG.prestige.eligibilityChargeEarned)}</p>
        )}
        {game.availablePrestigePoints.greaterThan(0) && conduitCost && game.permanentLevels.conduit < GAME_CONFIG.prestige.permanentUpgradeMaxLevel && (
          <div className="conduit-row">
            <div>
              <strong>Conduit permanente · nivel {game.permanentLevels.conduit}</strong>
              <small>Multiplica Charge ×1.25 por nivel. Coste: {formatGameNumber(conduitCost)} RP.</small>
              {!canBuyConduit && <small>Faltan {formatGameNumber(conduitCost.minus(game.availablePrestigePoints))} RP.</small>}
            </div>
            <button className="quiet-toggle" type="button" disabled={!canBuyConduit} onClick={() => session.runAction(buyPermanentConduit)}>Comprar Conduit</button>
          </div>
        )}
      </section>

      <footer className="statusline">
        <span>{session.saveLabel}</span>
        <div className="footer-actions">
          <label className="file-button">Importar partida<input type="file" accept="application/json,.json" onChange={session.importSave} /></label>
          <button type="button" onClick={session.confirmReset}>Borrar partida</button>
        </div>
      </footer>

      {session.offline && (
        <AccessibleDialog titleId="offline-title" onClose={session.dismissOffline}>
            <p className="eyebrow">REANUDACIÓN COMPLETADA</p>
            <h2 id="offline-title">El sistema siguió evolucionando.</h2>
            <p>Tiempo transcurrido: {session.offline.elapsedLabel}{session.offline.capped ? " (se aplicó el límite de 7 días)" : ""}.</p>
            <p>Charge obtenido: <strong>{formatGameNumber(session.offline.charge)}</strong></p>
            <p>Echo obtenido: <strong>{formatGameNumber(session.offline.echo)}</strong></p>
            <button className="action-button" type="button" onClick={session.dismissOffline}>Continuar</button>
        </AccessibleDialog>
      )}

      {prestigeDialogOpen && (
        <AccessibleDialog titleId="prestige-confirm-title" onClose={() => setPrestigeDialogOpen(false)}>
            <p className="eyebrow">CONFIRMACIÓN DE PRESTIGIO</p>
            <h2 id="prestige-confirm-title">¿Transformar esta run en Resonancia?</h2>
            <p>Recibirás <strong>{formatGameNumber(getPrestigePreview(game).reward)} puntos de Resonancia</strong>.</p>
            <p>Se reinician Charge, Echo y mejoras de run. Se conservan Conduit, puntos acumulados, ingresos de por vida y tiempo total.</p>
            <div className="action-row">
              <button className="action-button" type="button" onClick={() => {
                session.runAction(performPrestige);
                setPrestigeDialogOpen(false);
              }}>Confirmar prestigio</button>
              <button className="quiet-toggle" type="button" onClick={() => setPrestigeDialogOpen(false)}>Seguir jugando</button>
            </div>
        </AccessibleDialog>
      )}
        </>
      )}
    </main>
  );
}

function AccessibleDialog({
  titleId,
  onClose,
  children,
}: {
  readonly titleId: string;
  readonly onClose: () => void;
  readonly children: React.ReactNode;
}) {
  const dialogRef = useRef<HTMLElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    const dialog = dialogRef.current;
    const previousFocus = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : undefined;
    dialog?.focus();
    return () => {
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, []);

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      closeRef.current();
      return;
    }
    if (event.key !== "Tab") return;

    const focusable = Array.from(
      event.currentTarget.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((element) => element.offsetParent !== null);
    if (focusable.length === 0) {
      event.preventDefault();
      event.currentTarget.focus();
      return;
    }
    const first = focusable[0]!;
    const last = focusable[focusable.length - 1]!;
    if (event.shiftKey && (document.activeElement === first || document.activeElement === event.currentTarget)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (document.activeElement === last || document.activeElement === event.currentTarget)) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <div className="dialog-backdrop" role="presentation">
      <section
        ref={dialogRef}
        className="confirm-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
      >
        {children}
      </section>
    </div>
  );
}

function MilestoneProgress({ game }: { readonly game: GameState }) {
  const earned = game.runChargeEarned;
  const prestigeThreshold = GAME_CONFIG.prestige.eligibilityChargeEarned;
  const next = earned.lessThan(prestigeThreshold)
    ? prestigeThreshold
    : GAME_CONFIG.milestones.find((milestone) => earned.lessThan(milestone.chargeEarned))?.chargeEarned;
  const ratio = next ? earned.div(next).mul(100).toNumber() : 100;

  return (
    <div className="milestone-track">
      <div className="milestone-summary">
        <strong>{next ? `${formatGameNumber(earned)} / ${formatGameNumber(next)} Charge` : "Todos los hitos de esta etapa alcanzados"}</strong>
        <span>{next && earned.greaterThanOrEqualTo(prestigeThreshold) ? "Prestigio disponible" : "Charge generado en esta run"}</span>
      </div>
      <div
        className="progress-rail"
        role="progressbar"
        aria-label="Progreso hacia el siguiente umbral"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.min(100, Math.max(0, ratio))}
      ><span style={{ width: `${Math.min(100, Math.max(0, ratio))}%` }} /></div>
      <div className="milestone-labels">
        {GAME_CONFIG.milestones.map((milestone) => {
          const passed = earned.greaterThanOrEqualTo(milestone.chargeEarned);
          return <span key={milestone.id} className={passed ? "milestone-passed" : ""}>{formatGameNumber(milestone.chargeEarned)} <i aria-hidden="true">{passed ? "✓" : "·"}</i></span>;
        })}
        <span className={earned.greaterThanOrEqualTo(prestigeThreshold) ? "milestone-passed" : ""}>{formatGameNumber(prestigeThreshold)} Prestige</span>
      </div>
    </div>
  );
}

function UpgradeRow({
  game,
  id,
  onBuy,
}: {
  readonly game: GameState;
  readonly id: UpgradeId;
  readonly onBuy: (quantity: number | "max") => void;
}) {
  const definition = GAME_CONFIG.upgrades[id];
  const level = game.upgrades[id];
  const unlock = getUpgradeUnlockStatus(game, id);
  const quantity = getMaxAffordableUpgradeQuantity(game, id);
  const quote = getPurchaseQuote(game, id, 1);
  const marginal = level < definition.maxLevel && unlock.unlocked
    ? getMarginalProduction(game, id)
    : undefined;
  const unlockReason = localizeUnlockReason(unlock.reason);
  const price = level >= definition.maxLevel
    ? "Nivel máximo"
    : formatGameNumber(upgradeCostAtLevel(id, level));
  const currency = definition.currency === "charge" ? "Charge" : "Echo";
  const disabledReason = level >= definition.maxLevel
    ? "Alcanzaste el nivel máximo."
    : !unlock.unlocked
      ? unlockReason
      : quantity === 0
        ? `Necesitas más ${currency}.`
        : undefined;

  return (
    <article className={`upgrade-row ${!unlock.unlocked ? "upgrade-locked" : ""}`}>
      <div className="upgrade-index" aria-hidden="true">{String(UPGRADE_ORDER.indexOf(id) + 1).padStart(2, "0")}</div>
      <div className="upgrade-copy">
        <div className="upgrade-title-line"><h3>{UPGRADE_COPY[id].title}</h3><span>NIVEL {level}{Number.isFinite(definition.maxLevel) ? ` / ${definition.maxLevel}` : ""}</span></div>
        <p>{UPGRADE_COPY[id].description}</p>
        <small>{unlock.unlocked ? marginal ? `Próximo nivel: +${formatGameNumber(marginal.perSecond)} ${marginal.resource === "charge" ? "Charge" : "Echo"}/s` : "Desbloquea automatización de Seed Array." : `Bloqueado · ${unlockReason}`}</small>
      </div>
      <div className="upgrade-cost"><span className="eyebrow">COSTE</span><strong>{price}</strong><small>{level >= definition.maxLevel ? "" : currency}</small></div>
      <div className="upgrade-actions">
        <button type="button" disabled={!quote.allowed} title={disabledReason} aria-describedby={disabledReason ? `${id}-purchase-reason` : undefined} onClick={() => onBuy(1)}>Comprar 1</button>
        <button type="button" disabled={quantity === 0} title={disabledReason} aria-describedby={disabledReason ? `${id}-purchase-reason` : undefined} onClick={() => onBuy("max")}>Máx. {quantity > 0 ? `(${quantity})` : ""}</button>
        {unlock.unlocked && disabledReason && <small id={`${id}-purchase-reason`} className="purchase-reason">{disabledReason}</small>}
      </div>
    </article>
  );
}

function localizeUnlockReason(reason: string | undefined): string | undefined {
  if (!reason) return undefined;
  if (reason === "Own an Echo Loom") return "Necesitas adquirir un Echo Loom.";
  return reason.replace(/^Generate (.+) in this run$/, "Genera $1 en esta partida.");
}
