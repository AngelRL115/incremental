# Backlog — G1 navegador MVP

Prioridad: `product-owner`; coordinación: `project-manager`. Fuente: idea humana y Phase 3. Seed/test: `createNewGameState()` y fixtures deterministas; no hay cuentas/datos personales.

## P0 — Definition of Ready

| ID | Journey | Owner | DoR | Estado |
|---|---|---|---|---|
| B1 | Abrir y avanzar simulación | frontend-engineer | Sí; G1 AC | Implementado; build/browser verificados |
| B2 | Comprar y desbloquear progreso | frontend-engineer | Sí; economy engine | Implementado; compra/unlock probados |
| B3 | Guardar, recargar e importar/exportar | frontend-engineer | Sí; límites de datos definidos | Implementado; import/export/recovery probados |
| B4 | Retornar offline y completar prestigio | frontend-engineer | Sí; engine API estable | Implementado; offline/prestige/multi-tab probados |
| B5 | Usar UI responsive/accesible y Canvas eficiente | frontend-engineer | Sí; visual identity y a11y gates | Implementado; axe/teclado/reflow documentados; VoiceOver/NVDA no requerido para G1 por D12 |
| B6 | QA del journey completo y smoke de navegador | qa-automation | Sí; fixture/reset reproducible | Done; sign-off QA y 10/10 E2E Chromium |

### B1
```yaml
id: B1
title: Integrar ticker y escena de partículas
journey: Primera partida
priority: P0
owner: frontend-engineer
depends_on: []
ac:
  - "Partida nueva presenta 25 Charge, Seed Array 1 y 4 Charge/s."
  - "La economía avanza por tiempo del engine, independiente del RAF/render cadence."
  - "Canvas se redimensiona por DPR y no cambia recursos."
data_fixtures: createNewGameState()
nfrs: [responsive, reduced-motion, performance]
gates: [qa, a11y]
risk_tier: T2
dor: true
evidence_of_done: build, tests y ejecución browser
```

### B2
```yaml
id: B2
title: Cablear compras y desbloqueos reales
journey: Producir e invertir
priority: P0
owner: frontend-engineer
depends_on: [B1]
ac:
  - "Compra válida actualiza saldo/nivel/tasa mediante engine."
  - "Locked, máximo e inasequible muestran razón; repetición rápida no produce saldo negativo."
  - "Al generar 250 Charge se revela el sistema Echo y el coste proviene del engine."
data_fixtures: estados engine bajo/umbral/asequible
nfrs: [visible-errors, keyboard]
gates: [qa, a11y]
risk_tier: T2
dor: true
evidence_of_done: tests de integración y browser
```

### B3
```yaml
id: B3
title: Guardar y recuperar partida local
journey: Continuidad
priority: P0
owner: frontend-engineer
depends_on: [B1]
ac:
  - "Recarga restaura estado y savedAt."
  - "Invalid save no es silenciosamente reemplazado; se puede exportar/quitar tras confirmación."
  - "Export/import valida envelope y conserva una copia válida previa ante fallo."
data_fixtures: partida válida, JSON corrupto, versión futura
nfrs: [safe-local-data, recoverability]
gates: [qa, security]
risk_tier: T2
dor: true
evidence_of_done: tests storage e2e refresh
```

### B4
```yaml
id: B4
title: Entregar resumen offline y prestige
journey: Volver y continuar
priority: P0
owner: frontend-engineer
depends_on: [B3, B2]
ac:
  - "Offline usa calculateOfflineProgress/elapsedSecondsFromTimestamps y muestra elapsed, aplicado, recursos y cap."
  - "Una sola de dos pestañas puede reclamar y persistir el mismo gap offline."
  - "Prestige preview describe recompensa/pérdida; cancelar no altera estado y confirmar aplica reset una vez."
  - "Conduit permanente permanece y afecta la tasa posterior al reset."
data_fixtures: state con y sin elegibilidad; reloj inyectado
nfrs: [no-duplicate-rewards, explicit-errors]
gates: [qa, security]
risk_tier: T2
dor: true
evidence_of_done: tests reloj multi-tab y journey
```

### B5
```yaml
id: B5
title: Aplicar identidad, responsive y accesibilidad
journey: Usar juego en desktop/mobile
priority: P0
owner: frontend-engineer
depends_on: [B1]
ac:
  - "Sin scroll horizontal a 360, 390, 768, 1024 y 1280 px."
  - "Teclado puede activar acciones; foco visible, labels, estado no codificado solo por color."
  - "prefers-reduced-motion y reduced-effects reducen/paran movimiento decorativo sin alterar economía."
nfrs: [WCAG-2.2-AA, mobile, reduced-motion]
gates: [a11y, qa]
risk_tier: T2
dor: true
evidence_of_done: viewport tests, axe/manual keyboard, screenshots
```

### B6
```yaml
id: B6
title: Automatizar journey P0
journey: Regresión de release local
priority: P0
owner: qa-automation
depends_on: [B1, B2, B3, B4, B5]
ac:
  - "Browser test completa nuevo -> producción -> compra -> unlock -> reload/offline -> prestige -> continuación."
  - "Cubre mobile, corrupt import, compras repetidas y consola sin errores."
  - "Se ejecuta por comando documentado y build de producción."
data_fixtures: perfil aislado por test y clock injectable
nfrs: [deterministic, no-flake]
gates: [qa, a11y]
risk_tier: T2
dor: true
evidence_of_done: resultado Playwright, Vitest, build
```

## Baseline del kit (aplicabilidad)
- Cuentas, auth, 2FA, rate limit, IDOR: N/A; no hay cuentas, API ni admin.
- Pagos/webhooks/monetización: N/A; prohibidos en MVP.
- Web pública: N/A para app local; registrar `web-launch-readiness` antes de publicar.
- Datos personales/cookies/ventas/legal: N/A; no PII ni tracking; reabrir si cambia el alcance.
- Prod, backups centralizados, load 100 VUs, SLO: N/A; sin backend/prod.

## P1/P2
- P1: balance/playtest, mejoras de onboarding/feedback, pruebas de migración.
- P2: más contenido y PWA/publicación tras aprobación.
- Non-goal de este backlog: iniciar Phase 4.
