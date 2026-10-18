# G2 — plan de investigación formativa

**Estado:** G2 se reabrió por D20 para implementar una especialización propia.
Pregunta, ritmo, bandas, muestra, consentimiento/retención y duración fueron
aprobados por el Product Owner el 2026-10-14 (D14–D18); los parámetros de la
nueva mecánica fueron aprobados el 2026-10-17. La guía debe actualizarse y el
PO debe probarla de nuevo. No contactar participantes ni ejecutar sesiones sin
autorización explícita posterior.
**Owner propuesto:** `ux-researcher`; decisión y salida: `product-owner`.

## Pregunta y hipótesis

**Pregunta:** ¿entienden y disfrutan jugadores nuevos el loop propio de Space
Idle —observar, invertir, desbloquear y decidir cómo progresar—, el primer
prestigio se siente como una meta deseable en vez de un reset arbitrario y la
elección permanente de especialización se entiende como inversión con coste de
oportunidad?

**Hipótesis a refutar:**

1. Los jugadores pueden explicar que Seed Array produce Charge y que comprarlo
   eleva Charge/s sin que el moderador les enseñe el loop.
2. Pueden descubrir por qué Echo Loom está bloqueado y qué pueden hacer
   mientras tanto.
3. La composición/movimiento del observatorio se siente distintiva y apoya la
   lectura; el efecto no distrae de saldo, compra ni siguiente objetivo.
4. Antes de confirmar prestigio, entienden su recompensa, qué se reinicia y
   qué permanece; después explican el coste, el efecto y la permanencia de las
   rutas de especialización y su competencia por RP con Conduit.
5. La acción, las decisiones de compra, la especialización y los hitos dan
   motivos para continuar, no solo crecimiento numérico.

## Estado real y baseline

G1 está cerrado para el alcance local single-player. El build, 34 pruebas
unitarias, simulación determinista y 10 pruebas Playwright Chromium pasan.
No hay sesiones de jugadores ni telemetry; nada de este informe presenta
simulación como observación humana.

La economía actual permite la primera compra desde el inicio. El harness propio
alcanza primer prestigio en unos 27 s para pulsos manuales frecuentes y 600 s
para el perfil idle. En escenarios adicionales de compra agresiva y pulso
manual cada 5, 10, 30, 60 y 120 segundos, alcanzó prestigio a los 40, 60, 90,
120 y 240 segundos respectivamente. Estos son escenarios de código, no
observaciones de personas. Frente al target PO de 15–30 minutos activos, la
simulación actual es sustancialmente más rápida; no se cambiará balance hasta
recoger evidencia de jugadores y aprobar una propuesta de retuning.

## Método propuesto

- **Tipo:** estudio formativo moderado, tarea de juego libre seguida por
  preguntas neutrales y una comprobación aislada del prestigio.
- **Muestra aprobada (D16):** 5–8 adultos voluntarios; muestra de conveniencia
  no representativa. Buscar variedad entre quienes juegan idle/incrementales
  con frecuencia y quienes no. Etiquetar sesiones P1…P8; no guardar nombres ni
  datos de contacto.
- **Duración aprobada (D18):** hasta 50 minutos en total, incluyendo un máximo
  de 30 minutos de juego activo por participante. El tiempo de pausa/idle no cuenta como
  juego activo. Si no alcanza prestigio naturalmente, probar su comprensión
  con fixtures sandbox claramente identificados, sin atribuir esos fixtures
  como tiempo observado.
- **Ejecución:** build local identificada; partida nueva aislada para juego
  libre; fixture sandbox separado para prestigio/offline, sin tocar saves
  personales. Sin grabación, tracking, cuentas ni analítica.
- **Fechas:** sin programar; dependen de ensayar el protocolo y recibir
  autorización explícita para convocar y calendarizar.
- **Consentimiento y retención aprobados (D17):** antes de cada sesión explicar
  objetivo, tareas, duración y derecho a parar; obtener un sí explícito. Sin
  consentimiento no hay participación. No grabar, usar tracking ni recopilar
  PII; mantener notas con códigos P1–P8, borrar notas crudas al cerrar la
  síntesis y conservar únicamente hallazgos agregados. No reclutar menores.

## Guion breve

1. **Introducción (2 min):** consentimiento; explicar que se evalúa el juego,
   no a la persona. No explicar reglas ni enseñar la UI.
2. **T1 — Juego libre (hasta 30 min activos):** “Juega como te resulte natural. Cuéntame qué
   estás observando y qué decisión estás considerando.” No sugerir compras.
3. **T2 — Comprensión (5 min):** preguntar qué genera Charge, qué cambió tras una
   compra, qué cree que desbloquea Echo Loom y qué haría si aún no puede
   comprar. Registrar respuesta literal abreviada y si necesitó ayuda.
4. **T3 — Lectura visual (3 min):** preguntar qué le parece que está ocurriendo en el
   campo, qué feedback visual notó, qué resulta claro/confuso y si los efectos
   ayudan o distraen. No describir la intención visual.
5. **T4 — Prestigio y especialización en sandbox (hasta 5 min):** en un
   contexto descartable, mostrar la fixture elegible y pedir que explique
   recompensa, pérdidas y conservación; no confirmar el prestigio. En un
   segundo contexto aislado, mostrar la fixture posterior al primer prestigio;
   pedir que compare coste/efecto de ambas rutas, identifique el saldo
   compartido con Conduit y prediga qué opción queda tras elegir. No comprar en
   una partida personal ni atribuir fixtures a progreso natural.
6. **T5 — Cierre (5 min):** escala 1–5 para diversión/ganas de continuar y atractivo
   visual; preguntar qué repetiría, qué se sintió lento/repetitivo, qué partes
   visuales le gustaron o no (si alguna) y si volvería más tarde. “No volvería”
   es un resultado útil, no una respuesta incorrecta.

### Texto breve de consentimiento

“Vamos a evaluar el juego, no tus habilidades. La sesión durará hasta 50
minutos; puedes parar o saltarte una tarea cuando quieras. Tomaré notas breves
con un código, sin grabar audio o video ni recopilar nombres, contacto o
telemetría. Las notas crudas se borrarán al cerrar la síntesis y solo
conservaremos resultados agregados. ¿Aceptas participar voluntariamente?”
Esperar un sí explícito antes de comenzar; si no acepta, terminar sin tomar
notas sobre la persona.

El tiempo activo se marca manualmente mientras la persona juega o atiende
intencionalmente a resultados; el moderador pausa ese reloj durante pausas/
interrupciones o cuando la persona deja el juego desatendido. Redondear al
minuto y reportar como observación moderada, no como instrumentación precisa.
Registrar aparte el tiempo idle, las interrupciones y las ayudas. Los
identificadores o detalles personales que aparezcan espontáneamente no se
transcriben; eliminar/redactar cualquier dato personal antes de conservar notas.
Si no se puede aislar la partida sandbox, no se ejecuta T4.

### Preparación y ensayo de G2-1

- Registrar fecha, revisión/build y viewport del prototipo local; dejar listo el
  entorno antes de iniciar el límite de 50 minutos con una persona.
- Para T1, abrir un perfil de navegador temporal y empezar una partida nueva
  sin importar datos. No usar el perfil ni el guardado personal del moderador.
- Para T4, en un contexto separado importar
  [`tests/fixtures/g2-prestige-sandbox.json`](../tests/fixtures/g2-prestige-sandbox.json)
  desde el control “Importar partida”. Verificar el aviso de importación y
  preview de 1.00 Resonancia; cerrar el diálogo con Escape y **no confirmar**
  durante la sesión.
- Cerrar ese contexto y abrir otro. Importar
  `tests/fixtures/g2-specialization-sandbox.json`, que representa un estado
  sintético posterior al primer prestigio con RP disponibles. Pedir que
  compare rutas y explique qué compra pierde oportunidad de adquirir Conduit;
  no confirmar compras.
- Después de T4, cerrar ambos contextos sandbox y continuar/terminar en el
  perfil limpio de T1. No reutilizar los fixtures como partida del jugador.
- El E2E valida por separado la preview/cancelación/reset del prestigio y la
  compra/retención de especialización en contextos descartables.

### Ensayo manual anterior (guía/fixture previos a D20)

- **Fecha:** 2026-10-14.
- **Responsable:** Product Owner, quien moderará las sesiones propuestas.
- **Resultado informado:** confirmó los cuatro checks del ensayo: perfil/
  ventana aislada, aviso de importación sin progreso offline, preview de 1.00
  Resonancia y cierre con Escape sin confirmar el reset.
- **Alcance:** valida el fixture previo y el procedimiento de preview; no
  valida la especialización, la guía actualizada, una sesión con participantes
  ni la comprensión del guion completo. Hace falta un nuevo ensayo.
- **Evidencia complementaria:** el E2E de Playwright para el recorrido de
  prestigio pasó 1/1; la suite completa pasó 10/10, junto con build y 34/34
  pruebas unitarias.

### Guía interactiva previa a participantes

El Product Owner indicó que los recursos, medidas de progreso y efectos de las
mejoras aún no se entienden suficientemente para invitar a jugadores externos.
Antes de preparar invitaciones o convocar, se añadió una guía optativa dentro
del juego con Driver.js. Recorre el campo de partículas, saldo frente a
producción, Echo y Resonancia, pulso, umbrales, compras/requisitos/beneficios,
automatización, crónica, prestigio, especialización (rutas, rangos, coste
compartido con Conduit, efectos y elección permanente), guardado/offline e
importación/exportación. El tour no cambia la partida y puede cerrarse con
Escape.

La implementación tiene cobertura E2E de recorrido completo y de ajuste a
320 px, y un chequeo axe del popover; respeta el ajuste de efectos reducidos y
`prefers-reduced-motion`. Esto demuestra comportamiento y accesibilidad
automatizados, no que el contenido ya sea claro para el Product Owner ni para
participantes. El próximo paso es que el Product Owner recorra la guía en el
juego local e indique qué términos, cantidades o decisiones siguen sin quedar
claros. Solo tras su conformidad se retoma la autorización de contacto,
convocatoria y fechas; no se preparará ni enviará invitación antes.

### Plantilla mínima de registro

Una fila por persona participante, solo después del consentimiento. No añadir
nombres, contactos, edad exacta, ubicación ni detalles biográficos.

| Código | Build/viewport | Familiaridad idle (frecuente/ocasional/ninguna) | T1 activo/idle y hito | T2 producción/desbloqueo/siguiente paso (sin ayuda/con ayuda/no) | T3 claridad (x/n) | T4 prestigio (sin ayuda/con ayuda/no) y especialización (coste/efecto/permanencia/trade-off, x/n) | T5 diversión/atractivo (1–5) | Incidentes y fricción anonimizados |
|---|---|---|---|---|---|---|---|---|

Guardar notas crudas en el artefacto de sesión con acceso restringido; al
cerrar la síntesis, eliminarlas y conservar únicamente resultados agregados.
No recoger datos de quien no consienta.

## Métricas y bandas aprobadas para uso formativo

Grano: participante × tarea. Denominador: participantes expuestos a esa tarea;
mantener en denominador a quien no completa o necesita ayuda. Reportar conteo
crudo y fricción cualitativa; sin inferencia estadística.

| Métrica | Fórmula | Banda/criterio aprobado |
|---|---|---|
| Comprende producción | Respuestas sin ayuda que asocian Seed Array con Charge/s ÷ expuestos a T2 | ≥75% (mínimos n=5…8: 4/5, 5/6, 6/7, 6/8) |
| Comprende desbloqueo | Participantes que encuentran/explican requisito de Echo Loom ÷ expuestos a T2 | ≥75% (4/5, 5/6, 6/7, 6/8) |
| Identifica siguiente paso | Participantes que proponen una acción útil sin sugerencia ÷ expuestos a T2 | ≥75% (4/5, 5/6, 6/7, 6/8) |
| Comprende prestigio | Participantes que explican premio, pérdida y conservación antes de confirmar ÷ expuestos a T4 | ≥80% (4/5, 5/6, 6/7, 7/8); pérdida sorpresa en alguien bloquea salida hasta investigar |
| Comprende especialización | Conteo que explica coste 1/2/3, efecto y permanencia de la ruta elegida, bloqueo de la alternativa y RP compartidos con Conduit ÷ expuestos al sandbox T4 | Registrar `x/n` y errores de comprensión; sin umbral nuevo aprobado |
| Diversión/retorno | Participantes con puntuación 4–5/5 ÷ expuestos a T5; reportar mediana, rango y comentarios | ≥75% (4/5, 5/6, 6/7, 6/8) y razones observables |
| Claridad visual | Conteo de participantes que localizan saldo, tasa, compra y siguiente objetivo sin ayuda ÷ expuestos a T3 | Reportar `x/n`; cualquier ocultamiento de un control/dato crítico se triagea |
| Atractivo visual | Participantes que puntúan dirección/escena 4–5/5 y explican el motivo ÷ expuestos a T5 | ≥75% (4/5, 5/6, 6/7, 6/8); conservar distribución y comentarios, no solo media |
| Ritmo de hitos | Tiempo activo/idle por separado desde partida nueva a compra, Echo, prestigio y continuación; reportar no llegadas como censuradas a 30 min activos | PO aprobó 15–30 min activos al primer prestigio. Evaluar el conteo que llega dentro de la banda; si menos de la mitad alcanza naturalmente antes del timebox, resultado inconcluso y proponer sesión extendida, no etiquetar como fallo de jugador. |
| Fricción de tarea | Participantes con bloqueo observable ÷ expuestos, clasificado por tarea y gravedad | Todo bloqueo de tarea P0 se triagea antes de salida |

Con n<8, presentar `x/n` en vez de redondear a porcentaje y no generalizar al
mercado. Un patrón contrario a la hipótesis obliga a indagar; no se “promedia”
un riesgo de reset destructivo.

## Análisis, sesgo y regla de decisión

- Hacer una tabla P1…Pn × tareas/métricas y una lista de incidentes con
  timestamp relativo, estado, cita anonimizada, ayuda recibida y severidad.
- Separar observación, interpretación y recomendación; conservar evidencia
  discrepante y abandonos.
- Comparar tiempos solo entre tareas/estado iniciales equivalentes; reportar
  tiempo activo e idle aparte.
- Salida posible: iterar interfaz/feedback, ajustar parámetros config-first,
  recabar más evidencia o detener. No se cambia la fórmula del engine por una
  sola sesión.
- No añadir instrumentación para este estudio. No guardar datos identificables.

## Gates pendientes

1. **G2-0 / PO:** completo; pregunta, ritmo, bandas, muestra,
   consentimiento/retención y tiempo de sesión aprobados (D14–D18).
2. **G2-1 / UX Research + QA:** completado; guion, fixture y reset aislado
   documentados; ensayo manual reportado por PO y flujo E2E validado.
3. **G2-1.6–1.8:** implementar la especialización D20, actualizar guía/fixture
   y cerrar QA sin modificar los parámetros de balance base.
4. **Gate de comprensión / PO:** recorrer la guía actualizada y confirmar que
   recursos, tasas, prestigio, especialización, elección permanente y coste
   frente a Conduit se entienden; iterar si hay dudas. Sin confirmación, no
   preparar ni enviar invitaciones.
5. **Gate PO:** después de validar la guía, revisar el protocolo y autorizar
   explícitamente contacto, convocatoria y calendario; sin esa autorización no
   hay reclutamiento.
6. **G2-2 / UX Research + QA:** ejecutar n aprobado y registrar fecha/build/
   método por sesión, solo después del gate PO.
7. **G2-3 / PO:** revisar síntesis y elegir alcance de remediation.

### Input de ritmo resuelto

El Product Owner eligió **15–30 minutos activos** hasta el primer prestigio el
2026-10-14. El tiempo idle se mide por separado. No se aplicará retuning antes
de observar jugadores.

### Gate restante antes de sesiones

- Product Owner: después del slice D20, probar la guía actualizada desde “Guía
  del juego” y reportar dudas sobre costes, efectos, elección y permanencia.
- Iterar y volver a validar la guía según esa retroalimentación.
- Después, confirmar moderador/fechas y obtener autorización PO explícita de
  contacto y convocatoria.

## Resultado: research-plan / metric-definition

### Hecho

- Pregunta, hipótesis falsables, muestra y consentimiento/retención aprobados;
  guion, tareas, grano, denominadores y análisis documentados.
- Baseline del motor separado de resultados de jugadores.
- Fixture de prestigio sandbox creado y validado por el E2E específico.

### Pendiente

- Validación de comprensión de la guía por el Product Owner.
- Tras esa validación, autorización explícita de contacto, convocatoria y
  calendario antes de G2-2.

### Riesgos

- Sesgo por invitar solo jugadores expertos o explicar reglas antes de observar.
- El tiempo de prestigio del harness no predice tiempo de jugador.
- La muestra pequeña sirve para descubrir problemas, no para estimar mercado.
- Si aparece un identificador espontáneo, omitirlo o redactarlo antes de
  guardar la nota; borrar notas crudas al cerrar la síntesis según D17.

### Evidencia

- Baseline anterior a la guía: `npm test` 34/34; build pasó; E2E 10/10 en
  Chromium. El E2E de T4 carga el fixture desde archivo, comprueba el aviso de
  importación sin progreso offline, previsualiza y cancela, y luego ejercita el
  reset en un contexto descartable. El PO informó que completó manualmente los
  cuatro checks del fixture el 2026-10-14.
- Guía interactiva anterior a D20: `npm test` 34/34, `npm run build` pasó y `npm run test:e2e`
  13/13 en Chromium; E2E incluye recorrido de los 21 pasos y viewport móvil de
  320 px y axe sin violations en el popover. No hay sesiones humanas,
  telemetría ni resultados de participantes; el tutorial aún requiere
  validación de comprensión por el PO.
- Artefacto: `docs/g2-research-plan.md`; baseline de economía:
  `docs/phase-4-balance-report.md`.
- Prácticas de dominio: no existe `practices/INDEX.md` ni pack de UX Researcher
  en el repositorio; aplicado el skill `research-plan` disponible y los
  guardrails T2/privacidad de G2.
- Confianza: alta para el estado del build y simulación reportada; baja para
  cualquier hipótesis de diversión/retención aún no observada.

### Siguiente handoff

- To: `product-owner`
- Type: request
- Probar la guía del juego, reportar dudas de comprensión y, si queda clara,
  autorizar (o no) contacto, convocatoria y fechas.
