# Propuesta de MVP

## Objetivo
Construir una primera versión original, jugable y testeable que valide el bucle incremental antes de añadir contenido avanzado.

## Incluido
- Un recurso principal.
- Producción manual inicial.
- Dos o tres generadores comprables.
- Costes crecientes.
- Producción pasiva por segundo.
- Mejoras de producción.
- Un primer desbloqueo.
- Canvas 2D con partículas procedurales.
- Guardado local versionado.
- Progreso offline con cap configurable.
- Una capa de prestigio con moneda meta y mejoras permanentes.
- Tests unitarios del motor.
- Build estático.

## Fuera del MVP
- Backend, cuentas y sincronización cloud.
- Eventos diarios/mensuales.
- Monetización.
- Docenas de árboles de habilidades.
- Historia extensa.
- WebGL sin evidencia de necesidad.
- Copia exacta de nombres, recursos, arte, texto o fórmulas de ISEPS.

## Criterios de aceptación
1. Un jugador nuevo puede empezar y ganar recursos sin instrucciones externas.
2. Puede comprar una mejora y observar que cambian saldo y producción.
3. Los bloqueos impiden compras prematuras.
4. El progreso económico no depende de FPS.
5. El guardado y la carga conservan el estado válido.
6. El progreso offline no se duplica.
7. El prestigio informa qué se pierde y qué se conserva.
8. Los tests críticos pasan y `npm run build` termina correctamente.
9. La interfaz funciona en escritorio y móvil.
10. La aplicación no requiere servidor backend para jugar.

## Decisiones que deben confirmarse
- Nombre original del juego.
- Dirección artística (oscura/neón, científica/minimalista u otra).
- Si la interacción manual será esencial o solo un impulso inicial.
- Qué tanto priorizar profundidad de sistemas frente a una interfaz compacta.
