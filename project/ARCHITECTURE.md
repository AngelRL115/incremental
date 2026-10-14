# Arquitectura as-is y destino MVP

## As-is (observado 2026-10-14)
- App de paquete ESM TypeScript; Node >=20; `decimal.js`; Vitest; comandos `build`, `test`, `balance`.
- No existe Vite, React, `index.html`, frontend ni browser-test harness.
- `src/game/` es engine puro: config, Decimal, state, economy, purchases, unlocks, automation, simulation, prestige, offline, save y format.
- `serializeGameState` valida un snapshot de estado versión 1. No contiene timestamp de guardado ni adaptador browser.
- Suite existente: 4 archivos / 23 tests; build, tests y harness pasan al bootstrap.
- No hay Git repo inicializado.

## Destino propuesto
```text
src/
  app/         # composición React, store/hook y acciones engine
  components/  # HUD, upgrades, milestones, prestige, save notices
  renderer/    # Canvas particle renderer; estado visual propio
  game/        # motor aprobado, sin importar React/DOM
  styles/      # tokens y layout responsive
tests/         # Vitest existente + browser journey Playwright
```

Flujo: UI action -> API de dominio -> GameState inmutable -> render. Un ticker inyecta segundos a `advanceGame`; RAF solo anima canvas. `save.ts` conserva formato económico y una capa browser agrega `savedAt`/version de envelope. El offline comparte engine; una reclamación exclusiva coordina tabs antes de persistir la nueva marca temporal.

## Opciones y default
- Recomendación: Vite + React + TypeScript para la UI, conservando el engine y estructura actual.
- Alternativas consideradas: UI DOM/Canvas sin framework (menos dependencias, más código de interacción); vanilla TS con Vite (menor framework, menos composición/test de componentes).
- Default reversible porque no existe una UI y la arquitectura previa ya propone React/Vite. No es una reescritura del engine.
- localStorage es adecuado al estado pequeño actual; wrapper versionado, validación y backup invalid-data. IndexedDB queda diferido hasta evidencia de necesidad.
- Canvas 2D, no WebGL, conforme solicitud Phase 3.

## Límites/errores
- UI no calcula precio/tasa; read models derivados solo mediante funciones existentes.
- Error de engine/parse no se convierte en éxito/fallback: exponer mensaje y no persistir estado corrupto.
- Timestamp/cap offlinerespeta `src/game/offline.ts`; chequeo de pestaña no reduce a cero el guardado del usuario.
- Renderer limita memoria/partículas y pausa o reduce efectos bajo `prefers-reduced-motion` y modo bajo consumo.

## Riesgos
- localStorage no ofrece lock transaccional entre tabs; implementar claim con `navigator.locks` si disponible y fallback coordinado/versionado, o impedir otra sesión activa con aviso. Validar expiración/recuperación de lease.
- Formato save V1 no incluye `savedAt`: no mutar engine innecesariamente; envelope UI debe migrar/rechazar en forma explícita.
- Playwright/browser binaries podrían no estar disponibles; verificar antes de alegar e2e/browser QA.
