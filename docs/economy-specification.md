# Especificación económica — prototipo original

**Fase:** 2 — motor determinista y balance inicial.  
**Estado:** modelo implementado y configurable en `src/game/config.ts`.  
**Atribución:** todos los nombres, valores y fórmulas siguientes son decisiones originales del prototipo. No reproducen ni se atribuyen a ISEPS. Las mecánicas anunciadas de ISEPS y sus incógnitas permanecen en [investigación](./research/gameplay-mechanics.md).

## Bucle de juego modelado

1. El estado nuevo empieza con **25 Charge** y un **Seed Array** de nivel 1, que produce **4 Charge/s**.
2. Un pulso manual añade **2 Charge** y cuenta como ingreso, pero no avanza el reloj.
3. Se compran niveles de Seed Array para aumentar producción; luego se revelan mejoras de multiplicador y el segundo recurso, **Echo**.
4. Echo se genera con Echo Looms; puede gastarse en mejoras de producción y en el autopiloto.
5. La producción atraviesa multiplicadores de hitos durante una run.
6. Al generar 2,500 Charge en la run se puede hacer prestigio, cobrar Puntos de Resonancia y reiniciar el estado de run.

## Recursos y unidades

| Recurso | Inicial | Cómo se obtiene | Uso |
|---|---:|---|---|
| Charge | 25 | Seed Arrays a ritmo pasivo; pulso manual | Comprar productores y mejoras; umbrales de hitos y prestigio |
| Echo | 0 | Echo Loom a ritmo pasivo tras desbloquearlo | Comprar Harmonic Drive y Seed Array Autopilot |
| Puntos de Resonancia | 0 | Recompensa de prestigio | Comprar niveles permanentes de Conduit |

Los contadores `runChargeEarned`, `lifetimeChargeEarned` y sus equivalentes Echo son ingresos acumulados, distintos del saldo actual (que puede gastarse).

## Catálogo original de contenido

El nivel guardado indica cuántas compras se poseen. El coste al nivel `L` es el precio de la siguiente compra.

| ID | Moneda | Coste siguiente | Crecimiento | Efecto por nivel | Límite y desbloqueo |
|---|---|---:|---:|---|---|
| `seed-array` | Charge | 11.8 siguiente compra (B=10 en nivel 0) | ×1.18 | +4 Charge/s | 100,000; disponible desde el inicio; el estado inicial trae nivel 1 |
| `resonance-lens` | Charge | 60 | ×1.7 | Multiplica producción Charge por ×1.3 | 6; tras generar 25 Charge en esta run |
| `echo-loom` | Charge | 120 | ×1.35 | +0.8 Echo/s | 50; tras generar 250 Charge en esta run |
| `harmonic-drive` | Echo | 12 | ×1.8 | Multiplica producción Charge por ×1.25 | 4; poseer Echo Loom y generar 5 Echo en esta run |
| `seed-autobuyer` | Echo | 40 | — | Habilita compra automática máxima de Seed Arrays | 1; poseer Echo Loom, generar 1,000 Charge y 20 Echo en esta run |

Los prerrequisitos están definidos junto al catálogo como condiciones tipadas
(ingreso acumulado en la run o nivel de otra mejora). El validador rechaza
referencias inexistentes, ciclos, niveles inválidos y explicaciones vacías.
`src/game/unlocks.ts` evalúa esos datos; los componentes no duplican las reglas.

La crónica añade seis registros narrativos originales: primera señal, Echo,
Harmonic Drive, primer prestigio, Conduit y campo profundo. Se derivan del
estado real de juego, se registran una sola vez y no entregan moneda ni
multiplicadores. Sus IDs estables viajan en el estado guardado.

Para una mejora repetible con coste base `B`, crecimiento `r` y nivel actual `L`:

```text
cost(L) = B × r^L
bulkCost(L, n) = B × r^L × (r^n - 1) / (r - 1), r ≠ 1
bulkCost(L, n) = B × n,                           r = 1
```

La implementación usa la suma geométrica cerrada, no un loop por nivel. La cotización se mantiene decimal; no se redondea el coste a entero. El balance debe permanecer no negativo tras toda compra.

## Producción

Antes de multiplicadores:

```text
Charge base/s = Seed Array level × 4
Echo base/s   = Echo Loom level × 0.8
```

El multiplicador Charge se calcula como producto de factores:

```text
M_charge =
    1.25 ^ permanentConduitLevel
  × 1.3 ^ resonanceLensLevel
  × 1.25 ^ harmonicDriveLevel
  × product(reached milestone multipliers)

Charge/s = Charge base/s × M_charge
```

Echo/s no recibe esos multiplicadores en esta versión. Ingreso automático y manual incrementan el saldo y los contadores de ingreso en la misma transacción.

## Hitos de run

| ID | Requisito de ingreso de Charge en esta run | Efecto |
|---|---:|---|
| `echo-research` | 250 | Habilita la compra de Echo Loom |
| `resonant-threshold` | 1,000 | Multiplicador Charge ×1.5 |
| `deep-resonance` | 10,000 | Multiplicador Charge ×1.5 adicional |

Los hitos son derivados del ingreso acumulado y no requieren actualizar un flag; el motor segmenta la simulación al cruzar umbrales para aplicar nuevos rates solo al intervalo posterior.

## Automatización

Seed Array Autopilot es una compra única de run que activa el autopiloto. En cada instante en que haya Charge suficiente compra el máximo de niveles de Seed Array que el saldo permita. El motor calcula el siguiente instante de compra como evento de simulación (precio siguiente menos saldo, dividido por tasa Charge), redondeado hacia arriba al nanosegundo simulado para que la compra no quede corta por redondeo numérico.

Orden en un instante de evento:

1. Acreditar producción con los rates vigentes hasta el instante.
2. Derivar hitos alcanzados y sus nuevos rates.
3. Comprar automáticamente Seed Arrays asequibles, deduciendo el coste una vez.
4. Resolver el intervalo restante con el nuevo estado.

La compra automatizada puede cambiar producción. Por eso el motor no aplica una única tasa al intervalo entero ni itera por cada segundo; avanza entre hitos y eventos de compra. Hay un límite de 50,000 eventos por llamada para protegerse de contenido/extremos futuros; excederlo produce error y no expone un estado parcial al consumidor.

## Eficiencia marginal

La métrica expuesta es:

```text
efficiency = marginal output per second / bulk purchase cost
```

El resultado indica unidades/s del recurso producido por unidad de la moneda de coste. Para Echo Loom, por ejemplo, son Echo/s por Charge. **No se deben comparar sin conversión económica explícita** mejoras que producen recursos distintos. El autopiloto no aporta tasa directa y tiene eficiencia productiva 0.

## Prestigio original: Resonancia

- **Elegibilidad:** `runChargeEarned >= 2,500`.
- **Premio:** `floor(runChargeEarned / 2,500)` Puntos de Resonancia.
- **Se reinicia:** saldos Charge/Echo, mejoras de run, automatización y tiempo de la run.
- **Se conserva:** niveles permanentes Conduit, puntos disponibles, puntos acumulados de por vida, ingresos de por vida, tiempo total, contador de prestigios y crónica.
- **Estado nuevo:** 25 Charge, Seed Array nivel 1, los demás recursos/mejoras de run en cero.
- **Mejora permanente:** Conduit aumenta toda producción Charge por ×1.25 por nivel; el nivel siguiente cuesta `1 + nivel actual` Puntos de Resonancia; máximo 25.
- **Confirmación:** el motor ofrece un preview con elegibilidad, premio, recursos reiniciados y metadatos preservados; la UI de Phase 3 confirma antes del reset.
- **Idempotencia del flujo:** tras prestigiar, `runChargeEarned` se reinicia a cero, por lo que volver a invocar con el estado nuevo no puede acuñar el premio otra vez.

En puntos de 2,500 y 10,000 Charge generados, la fórmula entrega respectivamente 1 y 4 puntos. La recompensa lineal hace que retrasar el reset pueda financiar más niveles permanentes, mientras que resetear pronto accede antes al multiplicador permanente; ambos caminos deben probarse en varias runs. Es una fórmula original y de prueba.

## Curvas candidatas evaluadas

- **Lineal:** sencilla, pero con coste de compra constante los productores se vuelven cada vez más eficientes y la progresión se acelera sin freno.
- **Exponencial de coste + lineal de producción por nivel:** elegida para Seed Array; cada nivel suma output fijo, mientras el precio crece gradualmente. Permite compras baratas al inicio y obliga a que la producción del jugador escale para sostener compras.
- **Exponencial de multiplicadores por nivel:** elegida para Lens/Drive, ambos limitados y de coste más agresivo. Mantiene decisiones de gasto frente al productor repetible.
- **Polinómica/logarítmica:** no se necesita en el primer prototipo; considerar solo si los reportes muestran un cuello de botella o recompensas de prestigio mal distribuidas.

Estos son criterios de diseño y no un ajuste estadístico: no existen muestras numéricas verificadas de ISEPS para comparar residuales.

## Precisión, validación y límites

El envelope de `localStorage` conserva schema v1. El payload económico subió
de v1 a v2 para guardar los IDs de crónica; al cargar v1, el motor inicializa
esa lista y deriva las entradas ya logradas a partir del estado conservado.
Los IDs desconocidos o duplicados en payload v2 se rechazan, sin sobrescribir
el archivo original.

- Aritmética con `decimal.js`, 40 dígitos significativos, serialización decimal como string y exponentes soportados entre `1e-1,000,000,000,000` y `1e1,000,000,000,000`.
- Overflow/non-finite se rechaza con error; balances negativos y estados inválidos también.
- `addPreservingIncrement` detecta y rechaza ingresos positivos que desaparecen al sumarse a un valor mucho mayor. Operaciones con más de 40 dígitos significativos siguen redondeándose; el estado guarda la precisión calculada, no precisión ilimitada.
- Los segundos de entrada llegan como `number` de JavaScript, limitados a una llamada máxima de 365 días. El offline cap es 7 días y los timestamps con diferencia superior a 365 días se rechazan.
- Se detecta overflow y pérdida total del incremento, pero las multiplicaciones/divisiones pueden redondear a 40 dígitos significativos. Valores o niveles que excedan rango/limites fallan explícitamente.
- Los parámetros están centralizados en `src/game/config.ts`; cambiar costes/tasas/hitos no requiere reescribir los componentes de simulación.
