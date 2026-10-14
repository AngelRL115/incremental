# Reporte de balance del motor

**Generado:** 2026-10-13, con `npm run balance`.  
**Naturaleza:** resultados de simulación del modelo original en `src/game/config.ts`, no observaciones de ISEPS ni pruebas con usuarios. Son reproducibles con la misma versión de código, parámetros y estrategia.

## Resultados observados

| Estrategia | Objetivo | Reset | Tiempo simulado | Charge generado en el objetivo | Echo generado | Autopiloto | Premio |
|---|---|---:|---:|---:|---:|---:|---:|
| Manual frecuente/agresivo | Primer prestigio | Sí | 27 s | 2,563.12 | 14.40 | — | 1 |
| Manual ocasional/agresivo, acción cada 60 s | Primer prestigio | Sí | 120 s | 3,515.40 | 0 | — | 1 |
| Solo idle, sin compras, observación cada 300 s | Primer prestigio | Sí | 600 s | 3,100 | 0 | — | 1 |
| Manual frecuente, continúa hasta comprar autopiloto | Autopiloto | No | 39 s | 13,063.76 | 77.60 | Comprado a 39 s | — |
| Reserva conservadora, acción cada 10 s | Prestigio retrasado a 10,000 | Sí | 110 s | 11,755.86 | 120 | No comprado | 4 |

Rates y eficiencias marginales se imprimen además por `npm run balance`; para mejoras que cuestan recursos diferentes, las unidades de eficiencia no son comparables sin un tipo de cambio.

## Progreso offline medido por el harness

| Estado inicial | Intervalo solicitado | Aplicado | Charge ganado | Cap |
|---|---:|---:|---:|---|
| Run nueva | 60 s | 60 s | 240 | No |
| Run nueva | 604,800 s (7 días) | 604,800 s | 5.44e6 | No |

El simulador offline usa el mismo motor por eventos; el incremento de siete días no ejecuta 604,800 iteraciones.

## Lectura y límites

- La estimación teórica pasiva es 500 s hasta generar 2,500 Charge: 250 s para 1,000 Charge a 4/s y 250 s para los 1,500 restantes a 6/s tras el primer hito. El perfil idle observa al final de bloques de 300 s, por eso registra prestigio a 600 s; ese número es un **límite superior muestreado**, no el instante exacto del umbral.
- La estrategia manual frecuente prestigia en 27 s. Esa aceleración puede ser deliberada para interacción frecuente, pero debe comprobarse con playtesting real; el engine harness no simula fricción de UI ni decisión humana.
- La acción ocasional compra Echo Loom en el mismo paso en que ya puede prestigiar, así que la run reiniciada inmediatamente no alcanza a producir Echo. La estrategia conservadora que demora reset obtiene 120 Echo y 4 puntos; representa un trade-off explícito entre volver antes con un bonus pequeño y esperar para financiar dos niveles permanentes (coste 1 + 2 puntos).
- El autopiloto se puede comprar en 39 s en una run activa que elige continuar, aunque para ese momento el jugador ya habría cumplido el requisito de prestigio. El motor no fuerza el reset y el harness prueba esa elección por separado.
- Los tiempos de “ocasional” y “idle” son muestreados a intervalos de 60/300 s; el simulador segmenta los hitos internamente, pero el harness toma decisiones de compra solo en el siguiente momento de interacción.
- Todos los hitos configurados fueron alcanzados por al menos un perfil dentro de sus límites.

## Balance por revisar en la próxima iteración

1. **Pendiente de playtest:** validar si 27 s para el primer prestigio con pulsos y gasto activo resulta demasiado corto. El objetivo de diseño actual es que la primera run pasiva ronde 8 min.
2. **Trade-off de reset:** medir varias runs activas con reinversión del multiplicador Conduit; el reporte compara primera run, no eficiencia de ciclos repetidos.
3. **Reserva agresiva:** la política de reserva del harness no compra autopiloto al priorizar conservar 80% del saldo de Echo; no representa una política óptima, sino una estrategia comparativa determinista.
4. **Offline:** el cap y los resultados son correctos para esta configuración matemática, pero el resumen visible de retorno y comportamiento de guardado pertenecen a una fase posterior.
5. No se detectaron hitos inalcanzables ni errores numéricos con estos perfiles. Esto no demuestra estabilidad ilimitada: se mantiene el límite de exponente y el error explícito por incrementos inferiores a precisión.
