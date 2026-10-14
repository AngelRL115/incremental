# Definition of Done — G1

- [x] F1–F6 implementadas con AC y evidencia observable en `goals/G1.md`; sign-offs registrados según su alcance.
- [x] Validación final conjunta 2026-10-14: `npm run build`, `npm test` (34), `npm run balance` y `npm run test:e2e` (10 Chromium) pasan.
- [x] Journey P0 automatizado funciona en navegador con engine real y storage local real.
- [x] Offline timestamp/cap, automatización y concurrencia multi-tab tienen pruebas deterministas/E2E.
- [x] Import inválido conserva el save original y ofrece recuperación accionable.
- [x] Preview/cancel/confirm/reset/prestige y progresión permanente están cubiertos por pruebas.
- [x] Canvas desacoplado de economía, resize/DPR, cleanup, reduced motion/effects, estados de error/loading y viewports tienen evidencia automatizada o auditada.
- [x] axe-core, teclado, foco, contraste calculado, nombres/labels y reflow WCAG 2.2 AA revisados en los viewports documentados; sin findings automatizados.
- [x] No se reportaron errores de consola en Playwright; revisión de seguridad acotada concluyó sin hallazgos explotables; no hay PII ni tracking en el alcance.
- [x] Identidad aplicada y visual QA sin Generic Blocker; marca SVG original decorativa y accesible.
- [x] README y documentación reflejan comandos, migración y límites actuales.
- [x] `qa-tester` registró sign-off funcional para los AC automatizados; alcance y límites en `docs/g1-qa-signoff.md`.
- [x] `accessibility-specialist` revisó evidencia automatizada/documental; por decisión explícita del usuario (D12), el recorrido VoiceOver/NVDA no es requisito de cierre de G1. No se afirma que ese recorrido haya ocurrido.
- [x] Security review T2 de import/save/lease está documentada localmente; no se presenta como auditoría de historia/CI ni revisión de producción.
- [x] `git-specialist` inspeccionó el snapshot; commit inicial `0129063` creado con autorización humana. No hay autorización de deploy.
- [x] Decisión humana de no exigir VoiceOver/NVDA para G1 registrada en D12; sin deploy público en este goal.

Estándar de evidencia: paths/resultados de build, suites, browser y findings por AC; no declarar prueba no ejecutada. G1 queda **Done para el alcance local single-player** a 2026-10-14. Esto no es autorización de release/deploy ni una afirmación de prueba con lector de pantalla.
