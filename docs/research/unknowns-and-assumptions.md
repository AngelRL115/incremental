# Desconocidos, supuestos y decisiones de investigación

**Fecha de corte:** 2026-10-13.  
Usar las etiquetas **VERIFIED**, **INFERRED**, **UNKNOWN** y **ORIGINAL PROPOSAL** en todo hallazgo que se añada. Un anuncio de producto verifica que el desarrollador lo anuncia, no sus parámetros internos.

## Estado de evidencia

- Fuentes oficiales accesibles: página del producto [S1], ficha de Google Play [S2] e imágenes estáticas de la galería [S3].
- El sitio enlaza canal oficial de YouTube e Instagram, pero no se verificaron videos/publicaciones de ISEPS en esta consulta [S4], [S5].
- La referencia histórica de Reddit ya listada no devolvió el texto de la publicación [S6].
- No se accedió directamente al juego, no se inspeccionó el código y no hay capturas o grabaciones de usuario en los archivos del proyecto.
- Conclusión: Phase 1 puede entregar un mapa fiel a las afirmaciones públicas, pero no una réplica de economía ni una guía de una partida real.

## Matriz de incógnitas prioritarias

| Prioridad | Desconocido | Evidencia necesaria |
|---|---|---|
| Alta | Estado inicial, recurso/saldo y primera acción | Captura de una partida nueva y grabación de sus primeros minutos. |
| Alta | Producción activa/pasiva, productores y relación con partículas | Tasa visible y saldo con timestamps; medir una acción manual/controlada. |
| Alta | Nombres/roles/orden de partículas y requisitos | Captura de cada panel y de los cambios al desbloquear. |
| Alta | Costes, efecto y escalado de mejoras | 5–10 compras consecutivas por ítem con estados/bonus registrados. |
| Alta | Cada prestigio: requisito, premio, fórmula y persistencia | Previsualización, confirmación, estado antes/después y varias muestras. |
| Alta | Progreso offline y guardado | Saldo/timestamp al cerrar; ensayos con intervalos conocidos y revisión al regresar. |
| Media | Prerrequisitos, especialización y reseteo de árboles | Capturas de nodos y pruebas de elección, compra y reset. |
| Media | Automatización de producción o compras | Observar opciones y probar su disponibilidad bajo requisitos conocidos. |
| Media | Historia, niveles, eventos, skins y recompensas | Grabaciones de paneles y observaciones con versión/fecha; comprobar contenido temporal vigente. |
| Media | UI, accesibilidad y layouts | Capturas del cliente en dispositivos/orientaciones y navegación real. |
| Baja para MVP | Límites numéricos internos y rendimiento extremo | Pruebas de largo plazo y datos de instrumentación; no inferibles del texto “números inimaginables”. |

## Separación de datos y decisiones

### VERIFIED (afirmación limitada a lo que dice/muestra la fuente)

- Generar dinero con partículas exóticas; movimiento y crecimiento en tiempo real. [S2]
- Nuevas partículas, optimización de producción, más de diez tipos, skins, árboles, especialización y eventos mensuales de crucero/fábrica. [S1]
- Miles de mejoras, historia, niveles, menús revelados progresivamente y múltiples sistemas de prestigio. [S2]
- Los visuales oficiales estáticos muestran sistemas luminosos de partículas y una red de nodos conectados. [S3]

### INFERRED

- La combinación de moneda, mejoras y producción puede sostener un ciclo incremental de reinversión.
- Los árboles podrían representar dependencias entre mejoras; el arte sugiere nodos conectados, pero no acredita requisitos funcionales.
- Los sistemas de prestigio podrían ser una respuesta a la desaceleración, como sucede en el género. Ninguna fuente confirma esta estrategia de ISEPS.

### UNKNOWN

- Fórmulas, saldos, costes, tasas, cantidades iniciales, multiplicadores, umbrales y tiempos.
- Orden y función de cada partícula; interacciones productivas.
- Contenido, número, progresión y preservación de cada prestigio.
- Compras automáticas, progreso offline, caps, guardado, nube, exportación y recuperación.
- Flujo UI del cliente y disponibilidad actual de eventos.
- Si la antigua mención a “Data Cubes” es correcta. La documentación previa la retiró como hecho al no poder volver a comprobar la fuente; no usarla como requisito.

### ORIGINAL PROPOSAL (solo decisiones del proyecto propio)

- Juego web single-player con datos/configuración originales.
- Primer ciclo corto y explicable: recurso → productor pasivo → mejora → desbloqueo.
- Persistencia local y pruebas del motor desde el MVP.
- Diseñar, medir y documentar nuestras propias fórmulas y progresión.
- Evaluar una capa de prestigio original después de establecer el ritmo del ciclo base.

## Prioridad inicial de features para nuestro juego

| Prioridad | Alcance propuesto | Motivo |
|---|---|---|
| **P0 — esencial** | Recurso inicial, interacción clara de arranque, producción pasiva, compra de al menos una mejora con coste creciente, producción/segundo visible, partículas procedurales propias y motor económico probado. Guardado local básico y UI adaptable. | Valida que el núcleo sea jugable sin depender de mecánicas ISEPS desconocidas. |
| **P1 — importante** | Segundo productor/recurso o tier; requisitos explícitos de desbloqueo; objetivos visibles; progreso offline y persistencia versionada; una capa de prestigio original con previsualización, pérdidas y conservación. | Completa el horizonte incremental y la continuidad de una experiencia idle. Sus reglas se diseñan desde cero. |
| **P2 — avanzado** | Rama corta de especialización, automatización comprable, más partículas/producción, narrativa breve, logros y eventos no temporales para probar variedad. | Aumenta elección y profundidad tras validar balance y arquitectura. |
| **P3 — opcional/futuro** | Eventos temporales, múltiples prestigios, muchas ramas, personalización extensa, herramientas de balance, sistemas sociales o WebGL si mediciones lo justifican. | Coste alto o evidencia insuficiente para el MVP; no bloquear el juego por estas características. |

Las decisiones del proyecto ya presentes en [propuesta de MVP](../mvp-proposal.md), [arquitectura](../architecture.md) y [roadmap](../implementation-roadmap.md) siguen siendo propuestas previas; esta fase no las convierte en hechos de ISEPS ni autoriza implementar Phase 2.

## Riesgos técnicos a resolver antes de construir

1. Definir precisión de saldos, comparación, coste y formato en escalas grandes.
2. Hacer el motor independiente de UI/FPS y probarlo con reloj inyectable.
3. Calcular progreso offline sin loop por segundo, validando timestamps y límites.
4. Versionar el guardado y no sustituir silenciosamente un save válido por datos corruptos.
5. Medir la escena de partículas antes de decidir Canvas 2D frente a cualquier opción más compleja.
6. Asegurar que compra, desbloqueo y reset sean operaciones completas y testeables.

## Evidencia que más mejoraría el análisis

Si se busca validar el comportamiento real de ISEPS, lo más útil es que el usuario comparta:

1. Captura de nueva partida y video de los primeros 10–20 minutos.
2. Capturas de mejoras, árbol, partículas y sus requisitos/efectos.
3. Captura del panel de cada prestigio, incluida su previsualización.
4. Estado antes/después de compras y prestigio con versión visible.
5. Prueba de cierre/reapertura con hora y duración conocidas.

Registrar fecha, versión y contexto de cada pieza. Si no se aporta ese material, continuar con el juego original usando el alcance P0/P1 como decisiones propias y no presentar la implementación como una reproducción mecánica de ISEPS.
