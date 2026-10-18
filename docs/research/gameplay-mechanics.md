# Investigación de mecánicas de juego

**Fecha de corte:** 2026-10-13.  
**Evidencia disponible:** descripciones promocionales oficiales [S1], [S2] e imágenes estáticas oficiales [S3]. No hubo partida directa. Ver [registro de fuentes](./official-sources.md).

## Inventario de sistemas

| Sistema | Hallazgo y estado | Fuente | Confianza | Límite de la evidencia |
|---|---|---|---:|---|
| Moneda principal | **VERIFIED:** Google Play dice que se genera dinero usando partículas exóticas. | [S2] | 9/10 | No indica recurso inicial, tasa, acción manual ni fórmula. |
| Producción incremental | **VERIFIED:** la web anuncia partículas incrementales y optimización de su producción; Google Play habla de crecimiento en tiempo real. | [S1], [S2] | 9/10 | No revela si toda producción es pasiva ni cómo se calcula. |
| Partículas | **VERIFIED:** la web anuncia más de diez partículas únicas y creación/desbloqueo progresivo de nuevas partículas. | [S1] | 9/10 | No ofrece nombres, orden, estadísticas ni requisitos. |
| Movimiento y visuales | **VERIFIED:** el material oficial describe partículas móviles, patrones, colores y atributos en tiempo real. La imagen promocional muestra cúmulos luminosos multicolor sobre fondo oscuro. | [S1], [S2], [S3] | 8/10 | La imagen no demuestra física, entradas del jugador, cámara ni rendimiento. |
| Mejoras | **VERIFIED:** Google Play anuncia miles de mejoras y menús de mejoras que se revelan progresivamente. | [S2] | 9/10 | No se conoce el inventario ni coste, efecto, límite o persistencia de una sola mejora. |
| Árboles de habilidades | **VERIFIED:** la web promociona árboles, especialización y distintas rutas. Un visual promocional asociado muestra nodos hexagonales conectados. | [S1], [S3] | 8/10 | No confirma requisitos de nodos, elecciones excluyentes ni reinicio del árbol. |
| Prestigio | **VERIFIED:** Google Play anuncia diversos/múltiples sistemas de prestigio. | [S2] | 9/10 | La cantidad, nombres, moneda y reglas de cada capa son desconocidos. |
| Historia y nivel | **VERIFIED:** Google Play anuncia registros de historia y subir de nivel. | [S2] | 8/10 | No se conoce si el nivel es de jugador, cuenta o sistema; ni las condiciones/recompensas. |
| Eventos | **VERIFIED:** el sitio promociona eventos mensuales con actividades de crucero y fábrica y recompensas. | [S1] | 8/10 | No se pudo verificar disponibilidad actual, calendario, reglas, duración o economía del evento. |
| Skins | **VERIFIED:** el sitio anuncia skins para personalizar partículas. | [S1] | 8/10 | No se conoce el desbloqueo, selección, coste o impacto económico. |
| Automatización | **UNKNOWN:** “idle” y la producción incremental sugieren automatización, pero no hay descripción suficiente de compras automáticas ni su disponibilidad. | [S1], [S2] | 2/10 para inferencia | No atribuir automatización de compras a ISEPS. |
| Progreso offline | **UNKNOWN:** las fuentes revisadas no especifican la recompensa offline ni su cálculo. | [S1], [S2] | 0/10 | “Idle” no prueba progreso al cerrar la aplicación. |
| Guardado y recuperación | **UNKNOWN:** no se documentan guardados, migraciones, copias ni recuperación. | [S1], [S2] | 0/10 | No asumir persistencia local o en nube. |

## Bucle general sustentado y límites

La descripción permite afirmar los siguientes vínculos de alto nivel, sin reconstruir una secuencia completa:

1. **VERIFIED:** las partículas exóticas se relacionan con generación de dinero [S2].
2. **VERIFIED:** se anuncian mejoras de producción y creación de nuevas partículas conforme las cifras crecen [S1].
3. **VERIFIED:** hay menús que se revelan progresivamente, árboles de habilidades y sistemas de prestigio [S1], [S2].
4. **INFERRED:** invertir dinero en mejoras puede aumentar producción o facilitar expansión, pero el anuncio no especifica el efecto de cada mejora.
5. **UNKNOWN:** primera acción, siembra manual, generador inicial, orden temporal, cuellos de botella y qué se reinicia al prestigiar.

No se debe convertir esta secuencia conceptual en un tutorial o árbol exacto de ISEPS.

## Tabla de investigación por mecánica

| Área | VERIFIED | INFERRED (no presentar como hecho) | UNKNOWN |
|---|---|---|---|
| Recursos y producción | Dinero generado con partículas; producción de partículas optimizable. [S1], [S2] | Hay una economía incremental con reinversión. | Nombre exacto en UI, cantidad inicial, producción activa/pasiva, dependencias, conversiones, multiplicadores y cuellos de botella. |
| Tipos y roles de partícula | Se anuncian más de diez tipos y creación de otros. [S1] | Los tipos podrían constituir etapas o unidades distintas. | Lista, orden, rol de cada una, producción directa/indirecta, interacciones, física y personalización por tipo. |
| Mejoras y árboles | Se anuncian miles de mejoras, menús progresivos y skill trees con especialización. [S1], [S2] | Los árboles podrían incluir nodos conectados y decisiones de build; el material visual apoya solo la apariencia de conectividad. | Identificadores, efectos, costes, límites, ramas excluyentes, automatización de compra y permanencia ante reset. |
| Progresión | Se anuncian nuevos menús, nuevas partículas y crecimiento a grandes escalas. [S1], [S2] | Los órdenes de magnitud podrían marcar hitos. | Hitos, umbrales, tiempos, progresión inicial/media/final y condiciones de desbloqueo. |
| Prestigio | Se anuncian varias mecánicas de prestigio. [S2] | Los resets podrían ser una forma de superar una desaceleración, por convención del género. | Todo detalle de requisitos, estado reiniciado, recompensas, capas y estrategia. |
| Eventos y contenido | Se anuncian eventos mensuales, crucero/fábrica, historia, niveles y skins. [S1], [S2] | Pueden extender la retención y añadir objetivos temporales. | Estado actual del calendario, recurrencia efectiva, recompensas, progresión y contenido desbloqueado. |
| Offline y persistencia | Ninguna regla concreta verificada. | Un juego idle podría ofrecer progreso ausente, pero es una hipótesis de género. | Ganancias, cap, simulación, automatización durante ausencia, guardado, sincronización y recuperación. |

## Observación futura necesaria

Para pasar de publicidad de producto a mecánicas reproducibles, se necesita una sesión de juego fechada. Capturar pantalla inicial y primeros minutos; compras consecutivas; desbloqueos; vistas de partículas y árbol; cada prestigio y su confirmación; cierre/reapertura tras un intervalo medido. Anotar versión del juego, dispositivo, tiempos y cifras visibles. Solicitar este material solo si se decide avanzar con una especificación más fiel.

## Implicaciones para el juego original

- **ORIGINAL PROPOSAL:** tratar partículas como entidades visuales y también como productores con roles explícitos; no usar nombres, arte ni fórmulas de ISEPS.
- **ORIGINAL PROPOSAL:** comenzar con una economía pequeña, explicar cada compra y hacer que las mejoras tengan efectos visibles y testeables.
- **ORIGINAL PROPOSAL:** usar un árbol corto o mejoras de elección más adelante, porque la existencia promocional de árboles no revela una configuración que debamos reproducir.
- Mantener eventos, narrativa extensa, múltiples prestigios y automatización avanzada fuera de la primera versión.

## Análisis del XAPK aportado

La inspección estática del paquete confirmó que usa Unity IL2CPP, pero no
recuperó la lógica del juego ni observó una partida. El alcance, las evidencias
REA y las incógnitas restantes están en el
[informe del XAPK](./xapk-analysis-2026-10-17.md).
