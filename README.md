# Space Idle — juego incremental de partículas

Juego incremental original de partículas. La investigación de ISEPS es una referencia separada; sus fórmulas, interfaz y assets no se copian. El proyecto contiene un motor económico TypeScript independiente de React y un MVP jugable en navegador.

## Estado
- **Proyecto:** motor económico, UI Canvas, progresión, guardado local, progreso offline, prestigio y especialización permanente integrados.
- **IDE previsto:** Visual Studio Code.
- **Investigación:** fuentes públicas oficiales consultadas el 13 de octubre de 2026; no se tuvo acceso a una partida directa.
- **Regla de evidencia:** separar características anunciadas, inferencias de diseño y cuestiones desconocidas.

## Documentos
- `docs/project-audit.md`
- `docs/architecture.md`
- `docs/implementation-roadmap.md`
- `docs/research/official-sources.md`
- `docs/research/gameplay-mechanics.md`
- `docs/research/economy-model.md`
- `docs/research/progression-map.md`
- `docs/research/prestige-analysis.md`
- `docs/research/visual-analysis.md`
- `docs/research/unknowns-and-assumptions.md`
- `docs/mvp-proposal.md`
- `docs/economy-specification.md`
- `docs/balance-assumptions.md`
- `docs/simulation-test-plan.md`
- `docs/balance-report.md` (reporte generado por simulación local)
- `docs/phase-4-audit.md`
- `docs/phase-4-balance-report.md`
- `docs/phase-4-performance-report.md`
- `docs/release-checklist.md`
- `docs/known-limitations.md`
- `docs/architecture.md`
- `project/VISUAL-IDENTITY.md`
- `a11y/audit-2026-10-14.md`
- `design/visual-qa/2026-10-14.md`
- `src/game/` (motor TypeScript)
- `src/app/` (integración React, persistencia y sesión)
- `src/renderer/` (Canvas 2D independiente de la economía)

## Ejecutar el juego

Requiere Node.js 20+ y npm. Desde la raíz del proyecto:

```sh
npm ci
npm run dev
```

Vite muestra la URL local (por defecto `http://localhost:5173`).

## Verificación

```sh
npm test
npm run build
npm run balance
npx playwright install chromium   # una vez por equipo
npm run test:e2e
```

`npm run balance` imprime los resultados deterministas de los perfiles definidos en `src/game/simulation-harness.ts`. `npm run test:e2e` abre Chromium y verifica compras, desbloqueo de Echo, guardado/recarga, progreso offline, prestigio, especialización, importación/exportación, recuperación, concurrencia entre pestañas, la guía interactiva (incluido axe del popover) y viewport móvil.

Para validar o compilar para despliegue:

```sh
npm test
npm run build
npm run preview
```

El build estático queda en `dist/`. Para producción, publica su contenido en un
alojamiento estático HTTPS y configura el fallback de rutas a `index.html` si el
proveedor lo requiere. No se ha elegido ni probado un proveedor de hosting.

## Fuentes públicas consultadas
- Sitio oficial: https://octocubegames.com/iseps/
- Ficha Google Play: https://play.google.com/store/apps/details?id=com.AppSociety.ISEPS

## Estado de las fases
- Fase 1: investigación pública documentada; economía y funcionamiento directo de ISEPS siguen sin verificar.
- Fase 2: especificación y motor TypeScript implementados; type-check, tests, balance report y auditoría de dependencias verificados.
- Fase 3: MVP browser implementado; G1 cerrado para el alcance local single-player. Validación final del 2026-10-14: build, 34 pruebas unitarias, balance y 10 E2E Chromium. VoiceOver/NVDA no se recorrió y, por decisión D12, no fue requisito de cierre; consultar el informe de accesibilidad para los límites.
- Fase 4: prerrequisitos declarativos, crónica persistente con seis registros originales y migración histórica del payload v1 a v2; evidencia en los reportes de Phase 4.
- G2: G2-0 y G2-1 completos; reabierto por D20 para especialización original Charge/Echo, tres rangos y RP compartidos con Conduit. No contactar participantes ni ejecutar sesiones hasta validar guía y obtener autorización explícita. Ver `docs/g2-research-plan.md`.
- G2 previo a participantes: la guía interactiva “Guía del juego” explica
  recursos, producción, mejoras, hitos, automatización, guardado, prestigio y
  especialización. Su recorrido completo, axe y ajuste móvil están cubiertos
  por E2E; el Product Owner debe probar la versión actualizada y confirmar
  claridad antes de preparar invitaciones.
- Release: cierre de G1 no significa producción lista ni autoriza publicación; siguen aplicando los gates de `docs/release-checklist.md`.

La especialización está aprobada con valores propios: Charge ×1.15/rango o Echo ×1.25/rango y costes de 1/2/3 RP; estos efectos no se atribuyen a ISEPS. El retuning de la economía base sigue pendiente de evidencia de jugadores y aprobación.
