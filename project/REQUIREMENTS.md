# Requisitos de Phase 3

Fuente normativa: solicitud humana Phase 3; idea completada; economía Phase 2. La UI no crea reglas económicas nuevas.

## Funcionales P0
1. Mostrar recursos, producción, upgrades, hitos y siguiente requisito desde `src/game`.
2. Avanzar economía por tiempo explícito desde un loop desacoplado de FPS; compras invocan operaciones del engine.
3. Renderizar partículas con Canvas 2D, `requestAnimationFrame`, delta visual, resize/DPR, cleanup y reduced motion.
4. Comprar upgrades con cantidad soportada, coste/beneficio previo y estado disabled/reason; evitar doble gasto por clicks rápidos.
5. Guardar/cargar snapshot versionado y timestamp; invalid data no debe sobrescribir silenciosamente un save válido; errores explícitos.
6. Exportar/importar partida validada y restablecer solo tras confirmación.
7. En retorno, calcular elapsed-time con el módulo offline, aplicar cap/automatización y mostrar resumen; no entregar el mismo intervalo dos veces, incluso con múltiples tabs.
8. Mostrar preview de prestigio; confirmar con advertencia de pérdidas/conservación; aplicar reset del engine y permitir progreso nuevo con la mejora permanente.
9. Estados inicial, loading/reanudación, guardado/error, locked/affordable/max, offline summary y confirmación/reset.
10. Controles keyboard/touch, foco visible, labels accesibles y layout mobile/desktop.

## No funcionales
- Renderer visual no modifica estado económico ni producción.
- No duplicar fórmulas de coste, producción, unlock, prestige u offline en UI.
- Guardar Decimal serializado como string; no convertir saldos grandes a JS Number para cálculo.
- No tracking, auth, servidor o datos personales en MVP.
- Si falla lectura/importación, error visible; conservar copia del save original.
- Multi-tab: lease/claim o mecanismo equivalente sobre almacenamiento web que asegure un solo cálculo offline por timestamp.

## Criterios medibles
- G1 `goals/G1.md` define Given/When/Then y evidencia observable.
- `npm test` conserva todas las pruebas de dominio existentes y añade tests de integración UI.
- Playwright valida journey P0, un viewport móvil, reanudación offline determinista, import inválido y compra rápida.
- Build de producción correcto; prueba real en navegador registrada sin presumir ejecución.
