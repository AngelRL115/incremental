# Supuestos de balance

**Versión inicial:** 0.1.0.  
**Naturaleza:** hipótesis cuantitativas originales para playtest; no son observaciones de ISEPS.

## Objetivos de ritmo

| Métrica objetivo | Umbral inicial | Razón |
|---|---:|---|
| Saldo inicial | 25 Charge | Permite comprar niveles tempranos sin una espera artificial; deja reserva para otras mejoras. |
| Producción pasiva inicial | 4 Charge/s | Hace el comienzo medible y permite que el juego avance sin pulsos manuales. |
| Primer hito / tier Echo | 250 Charge generados | En menos de dos minutos a tasa inicial, incluso sin compras. |
| Primer multiplicador | 1,000 Charge generados, ×1.5 | Primer salto de ritmo que puede comprobarse en una sesión breve. |
| Primer prestigio | 2,500 Charge generados en una run | Objetivo de hasta 10 minutos pasivo aproximado; las compras activas deberían acortarlo. |
| Segundo multiplicador | 10,000 Charge generados, ×1.5 adicional | Ofrece razón para retrasar prestigio y observar el trade-off de más tiempo frente a una recompensa mayor. |
| Cap offline | 7 días | Previene incrementos sin límite práctico; debe validarse en UX en fase posterior. |

## Estimación teórica del primer prestigio pasivo

Sin compras ni pulsos:

1. Los primeros 1,000 Charge requieren `1,000 / 4 = 250 s`.
2. El primer hito eleva el rate a `4 × 1.5 = 6 Charge/s`.
3. Los 1,500 Charge restantes requieren `1,500 / 6 = 250 s`.
4. Estimación total: **500 s (8 min 20 s)**, derivada de las tasas configuradas.

Es una estimación analítica bajo producción constante por tramo, no el resultado de una partida real. La ejecución automatizada y las estrategias con compras se reportan aparte en [balance-report.md](./balance-report.md).

## Supuestos de gasto y economía

- Semilla inicial = Seed Array nivel 1; el coste de su siguiente nivel es 11.8 Charge (`10 × 1.18^1`).
- Crecimiento del productor principal = 1.18 por nivel, producción lineal `+4 Charge/s` por nivel.
- Lens y Drive son multiplicadores por nivel (`×1.3` y `×1.25`) con costes que crecen ×1.7 y ×1.8; máximos de 6 y 4 limitan el crecimiento no lineal.
- Echo Loom transforma oportunidad de compra de Charge en output separado: `+0.8 Echo/s` y coste ×1.35. Se elevó desde el primer borrador de parámetros porque el coste de 40 Echo del autopiloto no se alcanzaba en el perfil de progresión de prueba.
- Autopilot cuesta Echo, se desbloquea por progreso en ambos recursos y automatiza solo Seed Array.
- Eficiencia marginal es diagnóstica, no un algoritmo para decidir siempre la compra óptima.
- Pulsos manuales son impulso temprano (`+2 Charge`); no deben ser necesarios para el primer prestigio.
- Los hitos usan Charge generado, no saldo actual; gastar no revoca un desbloqueo/multiplicador.

## Riesgos a comprobar y posibles parámetros a ajustar

| Riesgo | Señal en el reporte o playtest | Dirección de ajuste |
|---|---|---|
| Primera compra no representa decisión | Compra de Seed Array ocurre con saldo inicial | Subir coste inicial o bajar saldo inicial si el tutorial debe requerir espera; no quitar producción pasiva sin revisar el loop. |
| Un productor domina todas las decisiones | Siempre conviene Seed Array y Lens/Echo quedan sin comprar | Ajustar costes, eficiencia por recurso o efectos de las ramas; no comparar Echo y Charge sin un tipo de cambio. |
| Auto-compra vacía recursos y reduce elección | La automatización compra cada unidad y bloquea upgrades deseados | Añadir porcentaje de reserva o selector de prioridad, solo si lo confirma playtest. |
| Prestigio temprano gana siempre a retrasarlo | Ganancia por segundo tras reset supera claramente la espera | Revisar divisor/exponente del premio o el bonus meta. |
| Espera pasiva es demasiado larga | Primer prestigio pasivo >10 min medidos | Ajustar producción inicial o divisor del prestigio. |
| Numeración pierde increments | Se dispara `GameNumberError` en sesiones de escala elevada | Revisar gama de 40 dígitos/rates o adopción de precisión configurable; no ignorar la excepción. |
| Eventos de simulación exceden el límite | Fallo >50,000 eventos por llamada | Perfil de la causa; preservar el error explícito. No aumentar el límite a ciegas. |

Los valores iniciales son una línea base para experimentar. No se afirma que esta economía esté balanceada por estar implementada; el reporte medido debe guiar iteraciones posteriores.
