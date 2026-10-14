# Roadmap del producto

## G1 — MVP jugable de navegador

Estado: **Done para el alcance local single-player**; sign-off automatizado de
QA recibido y validación completa verde el 2026-10-14.

- Producto local single-player con motor Phase 2, Canvas 2D desacoplado,
  compras/desbloqueos, guardado/offline, prestigio, continuidad y crónica.
- Build, 34 Vitest, balance y 10/10 E2E Chromium pasaron en la validación final.
- Por decisión D12, VoiceOver/NVDA no es requisito para cerrar G1; no se afirma
  que se haya probado ni que exista certificación WCAG integral.
- No hay autorización de deploy público.

Ver `goals/G1.md`, `project/DEFINITION-OF-DONE.md` y
`docs/g1-qa-signoff.md`.

## G2 — Validar y calibrar el loop jugable (propuesto)

Usar playtests formativos sin tracking para medir comprensión, onboarding,
fricción y ritmo; cambiar contenido/UI o economía solo cuando exista evidencia.

Gate de entrada: G1 cerrado o waiver explícito del Product Owner; la pregunta
de investigación, bandas de éxito, consentimiento y procedimiento deben estar
aprobados antes de reclutar.

Ver `goals/G2.md`. No iniciar aún.

## G3 — PWA y beta web controlada (preview)

Investigar una PWA estática y beta reversible únicamente si G2 muestra que el
loop merece distribución más amplia. Hosting, privacidad/legal, headers,
accesibilidad manual, offline real y rollback requieren una nueva decisión
humana y gates de readiness.

Ver `goals/G3-preview.md`. No es un goal ejecutable ni autorización para
crear service worker, telemetry, hosting o publicar.
