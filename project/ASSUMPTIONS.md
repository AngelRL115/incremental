# Supuestos reversibles

Fecha: 2026-10-14. No son decisiones irreversibles ni hechos de ISEPS.

| ID | Supuesto | Motivo | Revisión |
|---|---|---|---|
| A1 | “Space Idle” es nombre provisional, no marca final. | README y docs existentes. | Antes de publicar. |
| A2 | Español es idioma de UI inicial, preservando IDs/nombres propios de economía. | Idioma de conversación/documentación. | Si el propietario pide otro idioma. |
| A3 | Vite + React + TypeScript como UI para el motor TypeScript existente. | Sin framework actual; arquitectura previa recomendó esta opción. | Fácil de reemplazar antes de consolidar UI. |
| A4 | Persistencia MVP en localStorage mediante envelope versionado con `savedAt`; no IndexedDB. | Estado pequeño, reduce complejidad; export/import cubre respaldo manual. | Si el payload o necesidades lo justifican. |
| A5 | Build estático local, sin despliegue público en este goal. | No hay host, dominio, región o fecha de lanzamiento acordados. | Antes de abrir tráfico público. |
| A6 | Sin telemetría, cuentas, cookies de terceros ni PII. | No hacen falta para el loop local. | Si cambia el modelo de producto. |
| A7 | “Observatorio editorial” es dirección visual aprobada para MVP; los tokens concretos son propuesta reversible. | Selección humana 2026-10-14. | Cambios de marca requieren aprobación. |
| A8 | La UI hace autosave en operaciones y eventos de ciclo de vida; el intervalo de respaldo se configura y no define economía. | Robustez de UX sin depender de input humano. | QA en navegadores objetivo. |
| A9 | Comunicación y etiquetas iniciales en español; nombres Charge/Echo/Conduit conservan el vocabulario del motor. | Consistencia con economía aprobada. | Playtest de comprensión. |

Bloqueantes humanos pendientes: ninguno para MVP local. Naming definitivo, publicación y estrategia de idioma quedan fuera del bloqueo actual.
