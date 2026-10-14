# Investigación del modelo económico

**Fecha de corte:** 2026-10-13.  
**Resultado:** no hay muestras numéricas verificadas del juego. Ningún modelo de esta página se atribuye a ISEPS.

## Hechos económicos limitados

- **VERIFIED:** la ficha de Google Play afirma que el jugador genera dinero usando partículas exóticas [S2].
- **VERIFIED:** el sitio oficial promociona optimizar el output de partículas incrementales y crear nuevas partículas al alcanzar cifras muy grandes [S1].
- **VERIFIED:** se anuncian miles de mejoras [S2].
- **UNKNOWN:** cantidades, unidades, tasas, costes, ratios, multiplicadores, límites, conversiones, redondeos, escalas y umbrales.

No se dispone de una tabla de valores, compras observadas ni series de producción. Por lo tanto, no es posible estimar parámetros, calcular errores residuales ni afirmar que un modelo ajusta el original.

## Inventario económico de ISEPS

| Campo | Estado | Evidencia requerida |
|---|---|---|
| Recurso inicial y saldo al inicio | UNKNOWN | Captura de nueva partida antes de interacción. |
| Generación activa | UNKNOWN | Probar cada acción manual y medir cambio/saldo en intervalo controlado. |
| Producción base y unidades/segundo | UNKNOWN | Leer interfaz y comparar saldo con timestamps. |
| Relación partícula → recurso | Parcial: la ficha relaciona partículas exóticas con generar dinero [S2]. | Observar productores, categorías y otros recursos en juego. |
| Coste y crecimiento por nivel | UNKNOWN | Al menos 5–10 precios consecutivos de un mismo ítem, sin cambios de bonificaciones. |
| Efecto y crecimiento de producción | UNKNOWN | Medir producción antes/después de compras consecutivas y aislar multiplicadores. |
| Máximo de compra | UNKNOWN | Inspeccionar controles y probar opción de compra máxima. |
| Prerrequisitos y multiplicadores | UNKNOWN | Capturar tooltip/estado antes y después de desbloqueos y mejoras. |
| Monedas de evento o prestigio | La ficha anuncia prestigio múltiple [S2], pero no especifica monedas. | Capturar cada pantalla de recompensa y saldo. |
| Persistencia a través de reset | UNKNOWN | Comparar el estado completo inmediatamente antes/después de confirmar cada reset. |

## Modelos candidatos (hipótesis, no hallazgos)

Con muestras observadas se podrían comparar, por ítem y por tramo:

- Coste lineal: `C(n) = a + b*n`.
- Coste exponencial: `C(n) = C0 * r^n`, con `r > 1`.
- Coste polinómico: `C(n) = a * (n + b)^p`.
- Producción lineal: `P(n) = P0 + q*n`.
- Producción multiplicativa: `P(n) = P0 * m^n`.
- Producción por tramos o con bonus: modelo separado para cada cambio observado.
- Conversión: `output = input * ratio`, solo si se observa una transacción o productor de conversión.

Incluso un ajuste numérico cercano no prueba la fórmula interna: redondeos, cifras ocultas, bonus globales, compras múltiples y cambios de versión pueden producir muestras engañosas.

## Protocolo para datos y errores

1. Registrar versión, fecha, dispositivo, nombre visible, nivel, coste, producción mostrada, saldo, bonus, compra y requisito.
2. Capturar 5–10 niveles consecutivos del mismo elemento; conservar la cifra mostrada exactamente y marcar unidades/redondeo.
3. Mantener constante el estado de bonus o registrar cada uno para normalizar solo si se entiende su efecto.
4. Ajustar los modelos candidatos con los mismos puntos; reservar algunos niveles como comprobación cuando haya suficientes.
5. Publicar MAE: `sum(abs(predicho - observado))/N`; usar MAPE solo cuando los valores observados sean no nulos y lejos de cero. Reportar residuales por nivel y redondeo visible.
6. Rechazar una “fórmula confirmada” basada en uno o dos intervalos; describirla como hipótesis hasta observar más puntos y condiciones independientes.

### Datos mínimos por candidato

| Hipótesis | Muestras mínimas útiles | Aún haría falta |
|---|---|---|
| Crecimiento de coste | 5–10 niveles consecutivos | Repetir con otra mejora y con bonus controlados para saber si la regla es común. |
| Crecimiento de producción | 5–10 niveles y medidas pre/post compra | Desactivar/aislar multiplicadores o medirlos por separado. |
| Umbral de desbloqueo | Estado justo antes y después del cambio | Probar que es el requisito causal y no un requisito oculto/temporal. |
| Conversión | Entrada, salida y estado antes/después | Repetir en varias cantidades para distinguir ratio constante de rendimientos escalonados. |
| Premio de prestigio | Varias previsiones y resultados a distintos estados | Controlar las variables que cambian entre cada intento. |
| Offline | Saldo/producción al guardar y al volver tras tiempos medidos | Ensayos para cap, reinicio del reloj y compras automáticas. |

## Prestigio, offline y precisión numérica

- **Prestigio ISEPS:** múltiples mecánicas anunciadas [S2]; moneda, cantidades y fórmula **UNKNOWN**. “Data Cubes” no queda validado por el material oficial recuperado en esta consulta; véase [fuentes oficiales](./official-sources.md).
- **Offline ISEPS:** fórmula, tope y automatización **UNKNOWN**; no hay intervalos medidos.
- **Precisión de ISEPS:** notación, topes, precisión interna y abreviaturas **UNKNOWN**. La mención a números “unimaginables” [S1] es lenguaje promocional, no especificación numérica.

## Experimentos para el juego original (ORIGINAL PROPOSAL)

Antes de balancear, construir un simulador determinista sin UI que explore costes, tasas y tiempo hasta hitos. Comparar curvas sencillas con una métrica definida y probar estrategias de gasto. Como decisión propia, representar los saldos con una abstracción preparada para valores grandes; especificar y probar el rango antes de elegir `number`, notación científica o aritmética arbitraria. No reutilizar supuestos ni parámetros de ISEPS sin evidencia.
