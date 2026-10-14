# Identidad visual — Space Idle (working title)

Owner: `ui-designer`; consultados: PO, Product Design, A11y. Dirección “Observatorio editorial” elegida por el usuario el 2026-10-14. Tokens son defaults reversibles; no hay marca existente.

## Esencia
- Audiencia/contexto: jugador individual en sesiones breves y retornos idle, móvil/escritorio.
- Personalidad: científica, serena, precisa, luminosa, legible.
- Promesa emocional: observar cómo un sistema vivo crece y comprender el progreso.
- Nunca parecer: clon de ISEPS, juego de clicker genérico, panel SaaS o consola militar.

## Referencias / anti-referencias
- Referencia 1: capturas oficiales de partículas compartidas (`docs/research/official-sources.md` S3), solo contraste oscuro + densidad luminosa; no copiar layout, colores exactos, nombres ni assets.
- Referencia 2: visualización científica de observatorio, principio de datos legibles y jerarquía por tipo, no marca o pantalla particular.
- Referencia 3: simulación contemplativa, principio de movimiento que ayuda a observar causalidad; expresión y partículas propias.
- Anti 1: clon/captura/arte de ISEPS o deducir de una imagen su mecánica.
- Anti 2: plantilla de clicker/SaaS con tarjetas uniformes, CTA gigante, neón decorativo y paneles sin función.

## Dirección
- Tesis: “Un observatorio de bolsillo: la economía se lee con precisión y el campo de partículas se siente vivo, sin que el espectáculo oculte el siguiente paso.”
- Alternativa descartada: consola técnica densa; menos adecuada para una experiencia contemplativa, especialmente en móvil.
- Pantalla listón: escena Canvas protagonista, barras de recursos/tasas y un objetivo actual; compras secundarias accesibles abajo/al lado, sin sobrecargar el campo.
- Momento memorable: cambio de patrón/color al alcanzar hitos, con rótulo accesible; animación no altera estado.

## Sistema visual inicial
- Tipografía: `Avenir Next`/`Segoe UI`/system sans para UI; system monospace para tasas y números. No depender de fuente externa.
- Paleta propuesta: ink `#071317`, surface `#0D1E23`, raised `#13282D`, text `#F0F6F3`, secondary `#A7B9B8`, Charge `#5CE1D0`, Echo `#F8BE75`, prestige `#BD9AFF`.
- Contraste: texto principal y secundario sobre fondos oscuros >4.5:1; acentos para estado/UI >3:1; confirmar ratios por par de tokens antes de cerrar; color no es único indicador.
- Forma: superficies opacas; radios 8/14px por jerarquía; reglas/bordes discretos solo para agrupación/estado.
- Ritmo: escala 4/8px; aireada alrededor de escena, datos compactos en filas tipográficas.
- Motion: continuidad/feedback breve, respeta reduced-motion; no fade-in ubicuo, cursor beam o movimiento innecesario.
- Composición responsive: desktop escena + recursos/progreso en dos áreas; mobile reordena a header, campo, recursos, objetivo y compras con controles ≥44px recomendados.

## SVG / iconos
- SVG originales: marca orbital/partícula y glifo Echo; geometry limpia, tokens/currentColor, sin texto rasterizado. Elementos decorativos `aria-hidden`.
- Iconos funcionales comunes: usar icono vectorial consistente solo si paquete ligero justifica; no llenar bloques de iconografía ornamental.
- Emojis prohibidos.

## Guardrails
- Evitar patrones prohibidos en `practices/visual-craft.md`: gradiente violeta/azul, glassmorphism, acentos/bordes uniformes, badge en hero, 3 cards con iconos, Space Grotesk + Instrument Serif, Lucide decorativo, fade al scroll y hover que baja contraste.
- Una superficie o tarjeta es válida si separa controles accionables del campo visual y tiene jerarquía/responsive definido.
- Visual QA: no Generic Blocker; prueba 360/390/768/1024/1280; foco, reduced motion y contraste.

## Evidencia/aprobación
- Tokens/spec: este archivo; palette final susceptible a QA de ratio.
- Pantalla listón: primer journey de `goals/G1.md`; screenshot de browser cuando aplicación corra.
- Aprobación humana: dirección sí (selección A); marca/tokens finales no requieren otro bloqueo mientras sean reversibles.
