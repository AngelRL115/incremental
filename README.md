# Space Idle — juego incremental de partículas

Juego incremental original de partículas. La investigación de ISEPS es una referencia separada; sus fórmulas, interfaz y assets no se copian. El proyecto contiene un motor económico TypeScript independiente de React y un MVP jugable en navegador.

## Estado
- **Proyecto:** motor económico, UI Canvas, progresión, guardado local, progreso offline y primer prestigio integrados.
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

`npm run balance` imprime los resultados deterministas de los perfiles definidos en `src/game/simulation-harness.ts`. `npm run test:e2e` abre Chromium y verifica compras, desbloqueo de Echo, guardado/recarga, progreso offline, prestigio, importación/exportación, recuperación, concurrencia entre pestañas y comprobaciones axe WCAG AA.

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
- Fase 3: MVP browser implementado y validado con tests unitarios, balance reproducible y suite Playwright; revisión de VoiceOver/lector de pantalla y cierre formal de QA siguen pendientes.
- Fase 4: prerrequisitos declarativos, crónica persistente con seis registros originales y migración del payload de guardado v1 a v2; suite y build locales documentados en los reportes de Phase 4. No se declara producción lista mientras queden pendientes los gates manuales del checklist.

Las cifras de la economía propia son valores provisionales de balance y se encuentran en `src/game/config.ts`.
