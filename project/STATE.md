# Estado del proyecto

Última actualización: 2026-10-14. Evento: continuación de G1; definición
propuesta de G2 y preview de G3.

## G1 — MVP jugable de navegador

- Tipo: feature P0, `risk_tier: T2`.
- Alcance: MVP local single-player; Phase 4 añadió seis registros narrativos y
  desbloqueos declarativos sin alterar fórmulas de producción.
- Estado de implementación: F1–F6 construidas. `qa-tester` registró sign-off
  funcional automatizado. Los fixtures E2E sensibles al reloj se estabilizaron;
  validación final conjunta 2026-10-14: build, 34 unit tests, balance y 10/10
  E2E Chromium verdes.
- Estado del goal: **Done para el alcance local single-player**, cerrado
  2026-10-14.
  axe/teclado/reflow/contraste tienen evidencia sin findings automatizados.
  No se realizó VoiceOver/NVDA; el usuario decidió en D12 que no sea requisito
  de cierre de G1. Esa decisión no afirma que el lector se haya probado ni que
  exista certificación WCAG integral.
- Security T2: revisión acotada de guardado/importación/lease realizada en el
  workspace. No equivale a revisión completa del historial, CI o producción.
- Git: repo en `main`, commit inicial `0129063` creado con autorización
  humana; no se autorizó deploy. No usar el commit como evidencia de QA.
- Evidencia: `goals/G1.md`, `project/DEFINITION-OF-DONE.md`,
  `a11y/audit-2026-10-14.md`, `design/visual-qa/2026-10-14.md`,
  `docs/phase-4-audit.md`, `docs/phase-4-balance-report.md`,
  `docs/phase-4-performance-report.md` y `docs/release-checklist.md`.

## Próximo — G2

- Propuesta en `goals/G2.md`: validar comprensión, onboarding y ritmo con
  playtest formativo y ajustar solo a partir de hallazgos.
- Estado: `proposed`; no iniciar reclutamiento ni cambios de balance hasta que
  el Product Owner fije la pregunta y las bandas de aceptación y G1 cierre.
- Guardrails: no cuentas, backend, telemetry, PII ni publicación pública.

## Adelanto — G3

- `goals/G3-preview.md` propone estudiar una PWA/beta web controlada, reversible
  y sin analytics como default.
- No es goal aprobado ni autorización de hosting/deploy. Requiere resultado de
  G2, decisión humana de distribución/presupuesto/privacidad y readiness gates.

## Riesgos y próximos pasos

1. Conservar evidencia del cierre de G1 y límites de la excepción D12; cualquier
   cambio de alcance debe reabrir los gates afectados.
2. Obtener decisión del Product Owner sobre G2-0: pregunta, target bands,
   reclutamiento y tratamiento de notas antes de iniciar el playtest.
3. No empezar PWA, hosting, SEO ni publicidad hasta autorización de G3.

## Forecast

El producto corre localmente y G1 está cerrado para su alcance single-player.
G2 sigue propuesto; G3 es solo un preview condicionado. El cierre de G1 no
autoriza deploy público.
