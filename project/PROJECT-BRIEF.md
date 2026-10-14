# Project brief — Space Idle (título provisional)

Fuente: `idea_descripcion.md` y prompts humanos Phase 1–3. No hay un Master Prompt independiente en el repositorio.

## Problema y usuarios
- Problema: validar un juego incremental original de partículas con economía real y progreso contemplativo en navegador.
- Usuarios/jobs: jugador individual; iniciar partida, comprender producción, invertir, desbloquear, volver tras ausencia y decidir prestigiar.
- Valor: simulación reproducible y UI visual sin atribuir ni copiar mecánicas desconocidas de ISEPS.

## Alcance
- P0: interfaz responsive funcional sobre el motor TypeScript existente; recursos, Canvas 2D, upgrades, desbloqueos, save/load, offline, prestigio y continuación.
- P1: playtest/balance y refinamiento de tutorial, recuperación e interacción.
- Non-goals: backend/cuentas/cloud, pagos/ads, analítica, multi-prestige, eventos temporales, copia de ISEPS.

## Stack
- Origen: TypeScript/decimal.js/Vitest del repo; Vite+React+TS y Playwright son defaults reversibles recomendados, pendientes de implementar/verificar.
- FE: Vite + React + TypeScript; BE/DB: ninguno; infra: build estático local; test: Vitest + Playwright.
- Topología: single-app.

## Datos y seguridad
- Partida versionada y timestamp offline guardados localmente; export/import JSON validado.
- PII/sensibles: no; authn/authz: no.
- Compliance: N/A en MVP local sin tracking/ventas. Antes de lanzamiento público, abrir checklist web/legal con jurisdicción y contacto humano.

## NFRs de G1 (T2 UI)
- Accesibilidad: teclado, contraste AA, foco, reduced motion, layout touch/mobile.
- Rendimiento: economía desacoplada del render; Canvas DPR-aware con cleanup y opción de efectos reducidos.
- Observabilidad: feedback visible de guardado/carga; sin tracking.
- Disponibilidad: local y estática; no SLO de producción.

## Dirección visual
- Requerido: `project/VISUAL-IDENTITY.md`.
- Personalidad: Observatorio editorial, dirección elegida por el usuario; originalidad y legibilidad priman sobre similitud con referencias.
- Pantalla listón: campo de partículas como foco, estado económico y objetivo siguiente en jerarquía secundaria y panel de compras utilizable.
- Guardrails: sin emojis; SVG original para escenas/marca; iconos vectoriales solo para controles.

## Journey P0
1. Partida nueva → producción y pulso → comprar mejora → ver tasa mayor → desbloquear Echo → guardar/recargar → recibir resumen offline una vez → previsualizar/confirmar prestigio → adquirir Conduit → continuar.

## Continuación
`project/BACKLOG.md`, `goals/G1.md`, `project/ROLE-PACKS.md`, `project/STATE.md`; planning corresponde a `project-manager`.
