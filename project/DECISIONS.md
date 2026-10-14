# Decisiones y autoridad

| ID | Decisión | Estado/origen | Autoridad para cambiar |
|---|---|---|---|
| D1 | Economía Phase 2 es contrato de dominio; UI consume engine, no duplica fórmulas. | Aprobada por contexto humano | Humano para cambiar balance; tests obligatorios. |
| D2 | Producto original; investigación ISEPS se conserva y no se atribuyen fórmulas/arte. | Aprobada Phase 1/2 | No cambiar a clon. |
| D3 | Canvas 2D, simulación económica independiente de RAF. | Requisito Phase 3 | TL/FE pueden optimizar sin acoplar dominios. |
| D4 | MVP single-player local sin backend, cuenta, PII, tracking ni monetización. | Reversible, fuente: idea y MVP proposal | Humano si cambia. |
| D5 | Vite + React + TypeScript, Playwright para E2E. | Implementado y validado localmente | TL propone cambio solo con evidencia. |
| D6 | localStorage + envelope UI versionado y timestamp; serializer económico versionado por separado. | Implementado: envelope v1, payload engine v2 con migración desde v1 | Cambiar a IndexedDB con evidencia. |
| D7 | Identidad “Observatorio editorial”. | Elegida por usuario 2026-10-14 | Cambios sustanciales a humano. |
| D8 | Nombre “Space Idle”, idioma español, tokens visuales son provisionales. | A1/A2/A7 reversibles | Humano para marca final/idioma. |
| D9 | Se autorizó y creó el commit inicial `0129063`; no se autorizó deploy. | Hecho el 2026-10-14; árbol limpio en última verificación | Cualquier commit/release adicional requiere su propia autorización; deploy no autorizado. |
| D10 | G2 se limita a validar comprensión, fricción y ritmo con playtests formativos; no activa telemetría/PII. | Propuesto; objetivo cuantitativo y protocolo requieren PO | `product-owner` aprueba pregunta, bandas y reclutamiento. |
| D11 | G3 solo se explora como PWA/beta controlada tras G2; no se crea hosting ni service worker aún. | Preview en `goals/G3-preview.md`; no aprobado | Aprobación humana explícita de distribución, hosting, privacidad y readiness. |
| D12 | Para cerrar G1 no se exige un recorrido manual con VoiceOver/NVDA. Se conserva la semántica y accesibilidad implementadas; esta excepción no significa que se haya probado con lector de pantalla ni que el producto tenga una certificación WCAG completa. | Aprobada explícitamente por el usuario el 2026-10-14; limitada al gate G1 | Reabrir solo por decisión humana o si el alcance de G1 cambia. |
