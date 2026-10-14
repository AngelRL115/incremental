# Estado del proyecto

Última actualización: 2026-10-14. Evento: implementación del MVP browser y validación local de Phase 3.

## G1 — MVP jugable de navegador
- Tipo: feature P0; `risk_tier: T2` por UI de usuario.
- Goal/plan ejecutable: `goals/G1.md` v2. Alcance y decisión de identidad preservados; no reabrir scope.
- Producto: `product-owner` (accountable); coordinación/plan: `project-manager`; fases F1–F5: `frontend-engineer`; F6: `qa-automation` con sign-off de `qa-tester`; cierre F7: `git-specialist` (solo preparación).
- Estado: F1–F4 implementadas; F5 con axe/teclado/responsive/visual verificados; F6 automatizada y verde. G1 permanece abierto hasta revisión con lector de pantalla, sign-off de `qa-tester` y cierre F7.
- Gates T2: evidencia acotada de seguridad, WCAG/visual y browser está en `project/security-review-2026-10-14.md`, `a11y/audit-2026-10-14.md` y `design/visual-qa/2026-10-14.md`. Sin gate de prod/release.
- DoD canónica: `project/DEFINITION-OF-DONE.md`.

## Señales, roles incluidos y exclusiones
- Señales positivas: interfaz web de usuario, Canvas 2D, visual identity “Observatorio editorial” aprobada, estado persistente/import/export local, offline/prestige, accesibilidad y browser QA.
- Incluidos en el DAG: `frontend-engineer`, `product-designer`, `ui-designer`, `tech-lead`, `security-engineer` (review limitada), `accessibility-specialist` (gate), `qa-automation`, `qa-tester` (gate), `git-specialist` (fase final previa a Done). `product-owner` mantiene autoridad de prioridad/scope; `project-manager` coordina.
- Excluidos con razón:
  - `backend-engineer`, `database-developer`, `dba`: no backend, API ni base de datos.
  - `sre`, `devops-engineer`, `release-manager`, `support-engineer`: sin producción, despliegue, SLO ni lanzamiento público.
  - `mobile-engineer`: UI web responsive; no app nativa/híbrida.
  - `fullstack-integrator`: no hay contrato FE↔BE.
  - `data-analyst`, `data-engineer`, `growth-analyst`, `ai-ml-engineer`: sin analítica, ETL, experimento o ML; tracking fuera de scope.
  - `legal-compliance`, `marketing-strategist`, `content-marketer`: sin captura de PII/ventas/marketing ni lanzamiento público.
  - `ux-researcher`: no hay hipótesis de usuario que bloquee el P0; no se reabre la dirección ya aprobada.
  - `scrum-master`: la coordinación de un goal único es responsabilidad PM, sin necesidad de facilitación separada.
- Gate Security no se excluye: rol consultivo y veto acotado a import/save y claim offline multi-tab, sin auth/PII.

## Evidencia baseline y límites observados
- Baseline bootstrap: `npm test` (23 tests). Validación Phase 3: `npm run build` pasó; `npm test` pasó (29 tests); `npm run balance` pasó y alcanzó los hitos configurados; `npm run test:e2e` pasó (9 escenarios); `npm audit` informó 0 vulnerabilidades.
- Playwright/Chromium quedó instalado para validar en este equipo; instrucciones reproducibles están en `README.md`.
- axe-core no encontró violaciones en `/` ni en los diálogos probados; lector de pantalla real no se ejecutó y permanece como pendiente de sign-off.
- `project/ARCHITECTURE.md` preserva el baseline previo; Phase 3 agregó Vite/React/Playwright como defaults reversibles acordados, sin modificar la arquitectura del motor.
- Workspace observado sin `.git`; no inicializar Git ni hacer commit/deploy.

## Riesgos / bloqueos
- `R-G1-01` resuelto en este equipo: Chromium instalado y suite E2E ejecutada; otros equipos deben seguir `README.md`.
- `R-G1-02` mitigado y probado: lease local, conflicto visible y reintento tras liberar pestaña. `localStorage` sigue siendo almacenamiento local de mismo origen, no una frontera de seguridad.
- `R-G1-03` Git ausente impide preparar diff real para F7; dueño de seguimiento `project-manager`; no bloquea F1, pero F7 queda bloqueada hasta disponibilidad de repo Git. El commit/deploy permanece prohibido sin autorización, sin bloquear la preparación del diff.
- `R-G1-04` histórico: el due solicitado para HO-002 ya había vencido al emitirse; la fecha se conserva sin cambios.
- Pendientes de cierre: recorrido de VoiceOver/NVDA y sign-off humano de `qa-tester`; no se simularon.

## Handoffs
- `HO-20261014-001`: `product-owner` → `project-manager`, `delivery`, `accepted` a las 2026-10-14T06:35:27Z; artefactos recibidos y planificación iniciada.
- `HO-20261014-002`: `project-manager` → `frontend-engineer`, `request`, `accepted`; ejecución extendida por dependencias aprobadas de G1.
- Próximo: obtener sign-offs pendientes y desbloquear F7 cuando el workspace pertenezca a un repo Git; no iniciar Phase 4 ni publicar.

## Forecast
El MVP P0 es ejecutable localmente. G1 no se declara Done mientras falten el sign-off manual de QA/a11y y la preparación de F7; el workspace no es un repo Git.
