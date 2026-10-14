# G1 QA sign-off — automatización funcional

**Estado:** PASS para los AC funcionales automatizados/locales. El sign-off
independiente de QA y la validación final de esta continuación están completos.
**Baseline revisado:** commit inicial `0129063`.

## Alcance firmado

`qa-tester` revisó los AC funcionales de F1–F4 y F6 contra
`goals/G1.md`, Vitest, Playwright y el build. Su sign-off cubre el flujo local
automatizado: estado inicial, producción, compra, desbloqueo, persistencia,
offline, multi-tab, importación/exportación, prestigio y continuación.

Resultados reportados por la revisión independiente:

| Check | Resultado reportado |
|---|---:|
| `npm test` | 34/34 |
| `npm run build` | Pass |
| `npm run balance` | Pass |
| `npm run test:e2e` | 9/9 Chromium |

La revisión mapeó F1, F2, F3, F4 y F6 como PASS para AC automatizados.
F5 quedó parcial; F7 ya no está bloqueada por ausencia de Git, porque se creó
el commit inicial autorizado `0129063`. El commit no sustituye la evidencia de
QA.

## Validación final local

Tras estabilizar fixtures E2E cuyo resultado dependía del tiempo real, se
ejecutaron juntos los comandos de aceptación el 2026-10-14:

| Check | Resultado |
|---|---:|
| `npm run build` | Pass |
| `npm test` | 34/34 |
| `npm run balance` | Pass |
| `npm run test:e2e` | 10/10 Chromium |

## Fuera del sign-off

- Recorrido real con VoiceOver o NVDA.
- Prueba física de móvil/Safari/WebKit.
- Afirmar que el producto está listo para release público.
- Findings que requieran revisión manual fuera de las automatizaciones
  ejecutadas.

La revisión de accesibilidad corroboró que las pruebas Chromium/axe, reflow,
objetivos y pares de contraste documentados no mostraron bloqueantes en sus
superficies cubiertas. El recorrido con lector de pantalla no se realizó; el
usuario decidió explícitamente que no sea requisito para cerrar G1 (D12 en
`project/DECISIONS.md`). Esto no equivale a un pase con VoiceOver/NVDA ni a una
certificación WCAG integral.

## Decisión de gate

El sign-off funcional automatizado está recibido, con el alcance anterior.
La decisión humana D12 elimina el recorrido VoiceOver/NVDA del gate G1, pero
no retira ni desactiva soporte de accesibilidad del producto. La validación
final completa está verde y G1 queda cerrado para el alcance local single-player.
No se debe presentar axe/Playwright como sustituto de un recorrido con
tecnología asistiva. No hay autorización de deploy público.
