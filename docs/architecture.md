# Arquitectura y límites del juego

## Objetivo
Separar el motor de simulación de la interfaz para que la economía sea determinista, testeable y no dependa de la frecuencia de renderizado. Esta es la arquitectura implementada para el MVP browser y su expansión Phase 4.

## Stack
- TypeScript estricto
- Vite
- React para UI
- Canvas 2D para partículas
- Vitest para lógica
- Playwright en la fase de pruebas end-to-end
- `localStorage` para un estado pequeño y versionado; reevaluar IndexedDB si el volumen o los requisitos de resiliencia cambian

## Módulos actuales
```text
src/
  app/                  # composición React, sesión y persistencia browser
    App.tsx
    local-save.ts       # envelope browser, import/export y lease multi-tab
    use-game-session.ts # ticker económico, autosave y offline
  game/
    config.ts           # mejoras, prerequisitos, hitos y crónica original
    state.ts            # estado inicial e invariantes
    simulation.ts       # avance determinista por eventos
    economy.ts          # costes, producción, cotizaciones y eficiencia
    purchases.ts        # compras/pulsos transaccionales
    unlocks.ts          # hitos, prerequisitos y registros
    automation.ts       # eventos de auto-compra
    prestige.ts         # preview, reset y mejora permanente
    specialization.ts   # cotizaciones y compras de trayectoria permanente
    offline.ts          # límites temporales y progreso ausente
    save.ts             # payload decimal validado y migración
    decimal.ts          # aritmética decimal y límites numéricos
    number-format.ts    # formato sin coerción a Number
    simulation-harness.ts # perfiles reproducibles de balance
  renderer/
    ParticleField.tsx   # Canvas 2D independiente del motor
  styles.css
tests/
docs/
```

## Principios
1. La economía vive en `src/game`, no en componentes de React.
2. El renderizador solo representa estado y efectos visuales; no genera recursos económicos.
3. Las compras y el prestigio son operaciones atómicas: validar requisitos, calcular resultado y aplicar cambios completos.
4. Las definiciones de contenido usan IDs estables, no índices de arrays.
5. Las condiciones de desbloqueo se expresan como datos tipados.
6. El tiempo se inyecta en funciones críticas para probarlo sin esperar.
7. El estado guardado tiene versión explícita y validación al cargar.
8. El progreso offline se calcula matemáticamente, sin simular un bucle por cada segundo ausente.
9. La accesibilidad y `prefers-reduced-motion` se consideran desde el principio.
10. No se añade backend, autenticación ni monetización sin un requisito concreto.

## Números grandes
El motor usa `decimal.js` con 40 dígitos significativos, strings decimales al guardar y validación de overflow y de incrementos que perderían precisión. El estado no promete precisión ilimitada.

## Modelo temporal
La simulación debe aceptar `deltaSeconds` y ser independiente de FPS. El render puede ejecutarse a 30–60 FPS, mientras que el motor avanza con un delta limitado y controlado. Para pausas largas, el sistema offline usa el tiempo transcurrido validado y una fórmula de producción, no un catch-up infinito.

## Persistencia
- Envelope browser v1 y payload económico v3, versionados por separado.
- Escritura mediante un snapshot validado.
- La migración de payloads v1/v2 inicializa especialización vacía y preserva el progreso legado.
- Si el guardado es inválido, no sobrescribirlo silenciosamente.
- Exportar/importar como JSON validado.
- Confirmación explícita para borrar partida.

`src/app/local-save.ts` versiona aparte el envelope browser (sigue en v1);
`src/game/save.ts` versiona el contenido económico (v3), acepta payloads v1/v2
y les asigna especialización vacía. El prestigio conserva la ruta/rango; la
elección consume los mismos RP que Conduit. Los registros de crónica no otorgan
recursos ni multiplicadores. `src/renderer/ParticleField.tsx` solo lee las
señales visuales y no altera el estado económico.
