# Análisis estático del XAPK — 2026-10-17

## Alcance

Se inspeccionó el XAPK proporcionado en la raíz del proyecto y el APK base que
contiene. La aplicación no se ejecutó; los resultados describen el paquete,
sus declaraciones y sus componentes, no el comportamiento de una partida.

- Artefacto: `ISEPS+Idle+Particle+Simulator_0.8.4.8.6996_APKPure.xapk`
- SHA-256 del XAPK: `5fe88f24525800269c2dbc7ec0e1c6e14bfa1093c50bc4853412b3079e110bbd`
- SHA-256 del APK base extraído: `73b5a45cd3f75fb03aa08beb7041dccb368dfb9d767a2ff73c59bc146f9b9cb4`
- Versiones declaradas: `com.AppSociety.ISEPS`, `0.8.4.8.6996`, version code `6131`
- Evidencia REA: archivo `ev_32897b0ad0c665c9f2eebde36bde4d5d7dea475a973c97088338a491b7e7d051`;
  APK `ev_f739639257ae7545805f4ac942a55e6ca60b05711c40d44436d3c55455c49ebc`;
  búsqueda de clases `ev_37a8d2f5cc4ee386d73e0c0b036f7969aee254bb7e63a7352d4d1e25fa43b11c`.

## Observaciones

- **OBSERVADO — estructura del XAPK:** el manifiesto declara el APK base y un
  split `config.arm64_v8a`. También declara Android min SDK 24 y target SDK 36.
  REA identificó el contenedor raíz como ZIP; su inventario cubre las entradas
  centrales del archivo, no bytes ajenos a esas entradas.
- **OBSERVADO — manifiesto Android:** la inspección del APK terminó con cobertura
  completa para su operación. Reporta 9.526 clases y 284 recursos. No verificó
  la firma del APK.
- **OBSERVADO — búsqueda limitada de clases de aplicación:** la consulta
  `com.AppSociety` encontró `com.AppSociety.ISEPS.R`. Esto solo informa sobre
  nombres de clases Android en el APK base; no es una búsqueda de clases C# ni
  demuestra que la aplicación carezca de lógica de juego.
- **OBSERVADO — empaquetado de Unity:** el APK base contiene
  `assets/bin/Data/data.unity3d`, `global-metadata.dat` y
  `ScriptingAssemblies.json`, que enumera `Assembly-CSharp.dll`. El split ARM64
  contiene `libil2cpp.so` y `libunity.so`.
- **INFERIDO — límite de la inspección JADX:** la lógica administrada del juego
  pasa por Unity IL2CPP y su implementación principal está en código nativo.
  JADX analizó las declaraciones y clases de la capa Android, pero no recuperó
  el gameplay de C# a partir de IL2CPP.

## Qué no se puede concluir

El inventario de archivos y el manifiesto no verifican nombres de sistemas,
fórmulas, costes, ritmo de progresión, reglas de prestigio, pantallas, arte,
offline ni guardado. Tampoco se ejecutó la aplicación ni se analizaron las
escenas o assets Unity. Las afirmaciones promocionales previamente documentadas
siguen siendo evidencia de lo que el producto anuncia, no de reglas internas.

Para analizar más a fondo el gameplay empaquetado haría falta una herramienta
específica de recuperación de metadatos/código IL2CPP y, si se van a estudiar
escenas, un lector de assets Unity. No se descargaron esas herramientas: la
autorización recibida cubrió REA y JADX, no esos componentes adicionales.

## Aplicación al proyecto propio

**ORIGINAL PROPOSAL:** usar el XAPK únicamente para orientar preguntas de alto
nivel del género. No copiar código, textos, ilustraciones, nombres, fórmulas,
árboles exactos ni composición de pantallas. El estado actual del proyecto ya
tiene partículas procedurales, producción incremental, mejoras, registros,
guardado y una capa de prestigio propia. Una futura expansión puede explorar
especialización breve o más variedad de productores con contenido y balance
originales, detrás de sus propios tests y decisiones de diseño. La propuesta
condicionada para un árbol de especialización post-G2 está en
[`project/POST-G2-PROGRESSION-PROPOSAL.md`](../../project/POST-G2-PROGRESSION-PROPOSAL.md).

## Herramientas y límites

La inspección se realizó con REA CLI 6.5.0 y el proveedor JADX headless MCP
0.7.1, compatible con Java 17 o superior. El JAR JADX se descargó en el área
temporal de esta sesión y su SHA-256 se contrastó con el digest publicado en la
release `v0.7.1` del repositorio
[1013503897/jadx-headless-mcp](https://github.com/1013503897/jadx-headless-mcp/releases/tag/v0.7.1).
No se añadieron dependencias ni configuración al proyecto.
