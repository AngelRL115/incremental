# G3 preview — PWA y beta web controlada

**Estado:** avance de alcance únicamente; no aprobado para ejecución.
**Prerequisito:** G2 completado con evidencia y decisión humana de continuar.
**Tier provisional:** T2 para instalación/offline local; T3 si se abre al
público, se introduce cuenta/datos personales/pagos o se amplía la operación.

## Hipótesis

Si G2 confirma que el loop base es comprensible, entretenido y sostenible, una
entrega instalable puede reducir fricción de retorno y ampliar playtesting. La
propuesta inicial es una PWA estática, sin backend ni cuenta, con una beta
pequeña y reversible antes de cualquier lanzamiento abierto.

## Decisiones que deben preceder al goal ejecutable

1. **Distribución:** PWA de beta privada, web responsive sin instalación o
   lanzamiento público. Recomendación inicial: PWA de beta controlada.
2. **Plataformas/hosting:** decidir dominio, proveedor, presupuesto, owner
   operativo y procedimiento de rollback.
3. **Persistencia local:** definir límites de datos, exportación/restauración y
   advertencia de que borrar datos del navegador puede borrar la partida.
4. **Offline real:** acordar exactamente qué significa jugar sin red. No
   aumentar el cap offline o cambiar el cálculo económico por el hecho de
   añadir un service worker.
5. **Privacidad/producto:** mantener sin analítica por defecto. Tracking,
   cookies no esenciales, cuentas, soporte por correo o captura de datos
   requieren scope, consentimiento y revisión legal/técnica nueva.
6. **Marca y contenido:** confirmar título/marca final, idioma y texto legal;
   no asumir que “Space Idle” ya es marca registrada o definitiva.

## Workstreams candidatos

- Instalación web manifest, iconos originales, service worker con cache
  allowlist, versionado y actualización segura.
- Estrategia de hosting estático, HTTPS, headers, CSP y rollback verificados.
- Guía visible de save local, export/import y recovery.
- Web-launch readiness: seguridad, privacidad/legal, accesibilidad manual,
  SEO/metadatos, rendimiento móvil, 404/rutas y operación.
- Smoke tests sobre URL desplegada, dispositivos reales y navegadores acordados.
- Beta: criterios de entrada/salida, ventana, responsable de feedback y
  procedimiento para detener/publicar rollback.

No se seleccionará IndexedDB, push notifications, analytics, login ni framework
adicionales sin evidencia y aprobación. El juego debe seguir funcionando como
web normal si el navegador no permite instalación o service workers.

## Gates propuestos

1. **G3-A scope approval:** sponsor/product owner define quién prueba y qué datos
   se exponen.
2. **G3-B readiness:** G2 demuestra uso y targets aceptables; cierre de gates
   manuales de G1; contratos de soporte/hosting definidos.
3. **G3-C security/legal/accessibility:** revisión proporcional nueva; revisar
   headers, CSP, dependencias, privacidad/consentimiento, WCAG con tecnología
   asistiva y recovery de saves.
4. **G3-D staging:** despliegue no indexado y reversible, smoke, refresh,
   update/cache, offline, export/import y rollback probados.
5. **G3-E release decision:** decisión GO/NO-GO humana; no se publica
   automáticamente al completar los gates técnicos.

## Riesgos que requieren prueba

- Borrado/corrupción de save por cache/update del service worker.
- Diferencias de cuotas y eviction en storage móvil.
- Progreso offline sorprendente o relojes manipulados.
- CSP/headers incompatibles con assets o runtime.
- Accesibilidad del prompt de instalación y actualización.
- Prometer privacidad, permanencia del guardado u offline más allá de lo
  técnicamente demostrado.

## Handoff sugerido

Al aprobar este preview, convertirlo en `goals/G3.md` con AC medibles,
responsables, presupuesto, hosting, modelo de datos, jurisdicción y rollback.
Hasta entonces, no añadir deployment config, telemetría ni infraestructura.
