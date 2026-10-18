# Especialización original incorporada a G2

**Estado:** aprobada para implementación dentro de G2 por D20
**Riesgo:** T2 (reglas de economía, guardado y UI)
**Accountable de prioridad y balance:** Product Owner
**Goal:** G2, reabierto con alcance acotado

## Motivo y límite de evidencia

El usuario pidió acercar el juego a ISEPS. La descripción pública de ISEPS
anuncia árboles de habilidades y especialización ([S1] en
[`official-sources.md`](../docs/research/official-sources.md)). El análisis
estático del XAPK confirmó Unity IL2CPP, pero no recuperó su gameplay ni sus
reglas; véase el [informe del XAPK](../docs/research/xapk-analysis-2026-10-17.md).
Por ello, el árbol de abajo es una decisión original para Space Idle, no una
reconstrucción de ISEPS.

## Historia

Como jugador que vuelve a una partida avanzada, quiero escoger una
especialización permanente con costes y efectos explicados para orientar mi
estrategia de producción.

## Slice aprobado

La elección se habilita tras el primer prestigio. El jugador selecciona una
única ruta de tres rangos; los rangos cuestan 1/2/3 RP del saldo que también
compra Conduit. Vector de Charge da ×1.15 Charge por rango; Resonancia Echo da
×1.25 Echo por rango. La primera compra fija la ruta permanentemente; no hay
respec. La compra y los efectos sobreviven a futuros prestigios. La regla
completa y sus AC ejecutables están en [`goals/G2.md`](../goals/G2.md).

Los costes/efectos son valores de diseño de Space Idle aprobados por D20, no
reglas observadas en ISEPS. El XAPK no reveló su implementación Unity IL2CPP.

## Non-goals

- Copiar código, nombres, textos, fórmulas, interfaz o recursos de ISEPS.
- Añadir eventos temporales, monetización, cuentas, backend, tracking o PII.
- Añadir más rutas, más de tres rangos, respec o capas múltiples de prestigio.
- Instalar herramientas de decompilación IL2CPP o extracción de assets.

## Evidencia y confianza

- Hecho observado: el proyecto ya tiene recursos, mejoras, progreso offline,
  registros y una capa propia de prestigio.
- Hecho observado: el XAPK está empaquetado con Unity IL2CPP; no se verificó la
  lógica del árbol anunciado.
- Decisión original aprobada por PO: especialización corta, permanente y con
  coste de oportunidad frente a Conduit; el playtest todavía debe validar su
  comprensión, no su representatividad estadística.
- Confianza: alta en los límites de evidencia y en la regla aprobada; no hay
  evidencia humana aún sobre balance, comprensión o retención.
