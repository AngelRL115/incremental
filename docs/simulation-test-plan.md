# Plan de pruebas del motor de simulación

## Alcance

Pruebas de dominio TypeScript sin UI, DOM, Canvas o servidor. El motor recibe elapsed-time explícito. Las pruebas usan estado nuevo y fixtures deterministas; no esperan tiempo real.

## Invariantes de aceptación

1. Charge/Echo y contadores nunca son negativos, `NaN` o infinitos.
2. Un coste no asequible, mejora bloqueada o nivel sobre el máximo no cambia el estado de entrada ni produce estado parcial.
3. Una compra exitosa deduce exactamente el coste cotizado y sube el nivel exactamente en la cantidad comprada.
4. Compras múltiples cuestan lo mismo que la suma geométrica; la compra máxima no excede presupuesto.
5. Las mejoras y los hitos afectan siempre al mismo rate del motor; la UI no calcula producción.
6. La simulación integra primero la producción del tramo con el rate vigente y resuelve luego el desbloqueo/automatización.
7. Un único avance y varios avances contiguos equivalen cuando no hay acciones intermedias; automatización procesa eventos de affordability, no segundos.
8. Prestigio conserva solo metadatos/meta-progresión especificados y reinicia el estado de run como transacción.
9. Los registros de crónica se derivan del estado económico, no de animaciones, y no se otorgan dos veces.
10. Definiciones de contenido rechazan prerequisitos ausentes, ciclos e IDs duplicados.
11. Guardados versionados contienen números como strings; datos corruptos/incompatibles se rechazan explícitamente.
12. El progreso offline usa la misma simulación y no excede el cap de siete días.

## Matriz de pruebas

| Área | Límites/casos | Archivo |
|---|---|---|
| Curva de coste | Nivel 0, varios niveles, suma bulk, precio al máximo | `tests/economy.test.ts` |
| Compra | Exactamente asequible, por debajo, locked, bulk, límite | `tests/economy.test.ts` |
| Producción/unlocks | Producción inicial, multiplicadores permanentes/de run, tier bloqueado y desbloqueado | `tests/economy.test.ts` |
| Acción manual | Pulsos cambian saldo e ingreso, no simulan tiempo | `tests/economy.test.ts` |
| Contenido extensible | Prerrequisito ausente/circular, logros únicos y estado-derivados | `tests/economy.test.ts` |
| Tiempo | Cero, intervalos partidos, cruce de hito, negativo, NaN, Infinity, límite anual | `tests/simulation.test.ts` |
| Automatización | Compra inmediata, eventos de compra, resultado vs avances de un segundo | `tests/simulation.test.ts` |
| Offline | Consistencia online/offline, cap, reloj futuro/negativo y hueco implausible | `tests/simulation.test.ts` |
| Prestigio | Antes del umbral, umbral/recompensa, conservación de Conduit/especialización, estado fresco, repetición | `tests/prestige.test.ts` |
| Especialización | Desbloqueo, coste 1/2/3, ruta permanente, efecto por recurso, RP compartidos con Conduit, rechazo atómico | `tests/specialization.test.ts` |
| Números | Operaciones > `Number.MAX_SAFE_INTEGER`, exponente límite, incremento perdido, formato | `tests/numbers-save-harness.test.ts` |
| Guardado | Round-trip v3, migración v1/v2, estado de especialización inválido, IDs corruptos/duplicados, versión incompatible, NaN | `tests/numbers-save-harness.test.ts` |
| Harness | Reproducibilidad con la misma estrategia y config | `tests/numbers-save-harness.test.ts` |

## Escenarios del reporte de balance

`npm run balance` ejecuta perfiles deterministas: juego manual frecuente, interacción ocasional, inactividad sin compras, automatización desbloqueada y prestigio retrasado. Registra tiempo hasta primer Seed Array adicional, umbrales, compra del autopiloto, Charge generado, saldo, Charge/s y premio. El tiempo de hitos se muestrea al límite de interacción de cada perfil (1 s, 60 s o 300 s); no se presenta como precisión de frame.

El progreso offline corto y largo se comprueba en unit tests con elapsed time explícito; no requiere reloj real. La suite de balance etiqueta valores calculados por el simulador como resultados empíricos del modelo/configuración propia, no como prueba de ISEPS.

## Ejecución

```sh
npm test
npm run build
npm run balance
```

La fase queda bloqueada si una regresión permite saldo negativo, compra parcial, prestige duplicado, desbloqueo prematuro o estado inválido.
