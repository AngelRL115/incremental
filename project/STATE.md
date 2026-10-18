# Estado del proyecto

Última actualización: 2026-10-17. Evento: QA dio sign-off funcional a G2-1.8; validación PO G2-1.9 pendiente.

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

## G2 — Validación, calibración y especialización original

- Estado: G2-0 y G2-1 completados; reabierto para el slice autorizado por D20.
  Implementación en curso: elección permanente de una ruta Charge o Echo,
  tres rangos, coste 1/2/3 RP compartidos con Conduit y efectos ×1.15
  Charge/rango o ×1.25 Echo/rango. La otra ruta queda bloqueada tras la primera
  compra; la progresión sobrevive a prestigios. Son valores propios de Space
  Idle, no atribuidos a ISEPS.
- Fases: motor/guardado v3 → UI/guía/fixture → QA → PO valida la guía
  actualizada → solo con autorización explícita, 5–8 sesiones formativas.
- El Product Owner confirmó explícitamente estos parámetros; la guía
  interactiva aún debe revisarse con el nuevo slice. No preparar invitaciones,
  contactar participantes ni ejecutar sesiones.
- La autorización D20 permite solo esta expansión; no autoriza retunear la
  economía base, añadir tracking/PII/backend ni publicar.
- Decisiones preservadas: objetivo de 15–30 min activos al primer prestigio
  (D14), bandas (D15), muestra (D16), consentimiento (D17) y timebox de 50 min
  (D18); idle se reporta aparte. Harness previo: escenarios activos de pulsos
  cada 1–120 s llegaban en 27–240 s; idle en 600 s. Son escenarios
  deterministas anteriores, no tiempos de jugadores.
- Equipo mínimo: `product-owner` accountable de valor/balance; `business-analyst`
  dueño de AC; `tech-lead` consulta de arquitectura; `backend-engineer` motor
  y migración; `frontend-engineer` UI/guía; `qa-automation` E2E;
  `qa-tester` gate funcional; `accessibility-specialist` consulta WCAG;
  `ux-researcher` conserva el protocolo cuando se abra el gate de sesiones.
- Excluidos: `mobile-engineer` (cliente web, sin app nativa),
  `database-developer` y `dba` (sin DB), `security-engineer` (sin auth/PII/API
  pública ni nueva superficie de servidor), `sre` y `devops-engineer` (sin
  prod/hosting), `release-manager` (sin release), `data-analyst`,
  `data-engineer` y `growth-analyst` (sin datos/telemetría),
  `legal-compliance` (sin tratamiento nuevo de datos), marketing y soporte
  (sin lanzamiento/soporte), y `git-specialist` hasta el handoff final; no hay
  un commit autorizado.
- Gates: AC-SP-01…AC-SP-07, pruebas de dominio/migración, build, balance,
  Playwright/axe y diff check; luego validación humana de guía por PO. Ningún
  check sustituye consentimiento ni autorización posterior de convocatoria
  (D13, D17, D19).
- Implementación local presente: motor de especialización, multiplicadores de
  producción, persistencia payload v3 con migración v1/v2, panel accesible,
  guía Driver.js actualizada y fixture sandbox. No se alteró el envelope local
  v1 ni se retuneó la economía base.
- Verificación observada 2026-10-17: `npm run build` pasa; `npm test` pasa
  41/41; `npm run balance` pasa y genera reporte determinista; `npm run
  test:e2e` pasa 14/14 en Chromium, incluyendo guía completa, axe, teclado,
  viewport 320 px, especialización, persistencia y prestigio; `git diff --check`
  pasa. El balance requirió ejecución aprobada fuera del sandbox porque `tsx`
  no pudo abrir su socket temporal (`EPERM`) dentro del sandbox.
- G2-1.6–G2-1.8: implementación y verificación local completas; `qa-tester`
  dio sign-off funcional para AC-SP-01…AC-SP-07 tras revisar migraciones,
  compras, efectos, prestigio, estados UI, teclado y viewport. No se hizo una
  prueba manual con lector de pantalla. Handoff QA: `HO-20261017-003.yaml`.
- G2-1.9 requiere que el PO recorra la guía y resuelva dudas de costes, efectos
  y permanencia. Handoff propuesto: `project/handoffs/HO-20261017-004.yaml`;
  el receptor debe acusar antes de revisar. No preparar ni enviar invitaciones
  ni contactar participantes mientras siga pendiente.

## Adelanto — G3

- `goals/G3-preview.md` propone estudiar una PWA/beta web controlada, reversible
  y sin analytics como default.
- No es goal aprobado ni autorización de hosting/deploy. Requiere resultado de
  G2, decisión humana de distribución/presupuesto/privacidad y readiness gates.

## Riesgos y próximos pasos

1. Conservar evidencia del cierre de G1 y límites de la excepción D12; cualquier
   cambio de alcance debe reabrir los gates afectados.
2. Completar motor, persistencia v3, panel y guía actualizada; hacer QA y luego
   solicitar al PO que pruebe la guía y señale dudas.
3. No preparar ni enviar invitaciones ni contactar/convocar participantes hasta
   resolver las dudas y obtener autorización explícita.
4. No empezar PWA, hosting, SEO ni publicidad hasta autorización de G3.

## Forecast

El producto corre localmente y G1 está cerrado para su alcance single-player.
G2 se encuentra reabierto: D20 y AC aprobados; implementación, checks técnicos
y sign-off funcional de QA completados; validación de claridad por el PO
pendiente. Contacto, convocatoria y sesiones siguen bloqueados. G3 es solo un
preview condicionado. El cierre de G1 no
autoriza deploy público.
