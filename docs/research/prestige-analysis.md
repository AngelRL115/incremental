# Análisis de prestigio

**Fecha de corte:** 2026-10-13.  
**Evidencia:** la ficha de Google Play anuncia sistemas de prestigio diversos y múltiples [S2]. No se probó ninguna capa directamente.

## Lo que está respaldado

| Hallazgo | Estado | Fuente | Confianza |
|---|---|---|---:|
| El producto anuncia más de una mecánica/sistema de prestigio. | VERIFIED como afirmación promocional | [S2] | 9/10 |
| El prestigio permite desbloquear “más contenido”, según el texto de la ficha. | VERIFIED como promesa promocional | [S2] | 8/10 |
| Cantidad y nombres de las capas, moneda, umbrales, recompensa y estado reiniciado. | UNKNOWN | Ninguna fuente consultada lo detalla | 0/10 |

## Corrección respecto a la documentación anterior

Un borrador previo decía que el sitio oficial describía finalizar una simulación y gastar **Data Cubes** en mejoras permanentes. La consulta actual del sitio [S1] y la ficha [S2] no permite confirmar esa descripción. La referencia Reddit histórica indicada en el borrador no devolvió su cuerpo. Se elimina, por tanto, como hecho verificado. No atribuir “Data Cubes” ni una capa concreta a ISEPS hasta obtener evidencia primaria.

## Ficha de investigación por capa (sin completar por conjetura)

| Campo | Resultado |
|---|---|
| Nombre/identificador mostrado | UNKNOWN |
| Desbloqueo y requisito | UNKNOWN |
| Recursos y mejoras que se reinician | UNKNOWN |
| Recursos, desbloqueos y mejoras que se conservan | UNKNOWN |
| Moneda de recompensa | UNKNOWN |
| Fórmula de recompensa | UNKNOWN |
| Mejoras permanentes y efectos | UNKNOWN |
| Nuevo sistema habilitado | Solo se anuncia contenido adicional en general; relación causal por capa UNKNOWN |
| Tiempo o frecuencia estratégica | UNKNOWN |
| Interacción entre capas | UNKNOWN |

## Evidencia que hace falta

Para cada botón/capa: captura del requisito y recompensa estimada; inventario completo antes de confirmar; pantalla de confirmación; resultado después del reset; volver a medir costes/producción; repetir con un estado previo distinto. Registrar versión, duración de run y cualquier compra que afecte recompensa. Una sola ejecución no permite inferir una curva.

## Hipótesis a evaluar (no son fórmulas de ISEPS)

Con varios estados medidos podría evaluarse, por ejemplo:

- `R = floor((X / K)^a)` para una variable de run `X`, constantes `K, a`.
- `R = floor(log_b(1 + X / K))` para rendimientos decrecientes.
- Premio por tramos o combinación de recursos, si la interfaz lo sugiere.

Para distinguir estas formas se necesita observar recompensas calculadas/recibidas con valores de `X` distribuidos en rangos, manteniendo otros factores estables. No hay muestras para ajuste o comparación residual. La forma de la fórmula original sigue siendo **UNKNOWN**.

## Diseño para nuestro juego (ORIGINAL PROPOSAL)

Proponer una única capa propia tras medir el ritmo de la primera run. Antes de confirmar, mostrar recompensa prevista, pérdidas y conservación; aplicar el reset atómicamente; verificar estado resultante con tests. Elegir una fórmula sencilla, documentada y balanceable a partir de metas de ritmo internas, sin tomar el nombre, la moneda o la curva de ISEPS. No añadir capas extra hasta demostrar una necesidad de diseño.
