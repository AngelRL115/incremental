# Phase 0 — Project audit

## Estado de la inspección
**No se ha inspeccionado ningún repositorio**, porque el proyecto se iniciará desde cero y todavía no hay carpeta, código ni ZIP adjunto. No debe interpretarse este documento como una auditoría técnica completada.

## Datos confirmados
- Proyecto nuevo.
- Desarrollo previsto en Visual Studio Code.
- Objetivo: juego incremental espacial para navegador.
- Se requiere primero un MVP jugable y después expansión gradual.
- No se ha elegido todavía un gestor de paquetes mediante inspección de archivos.

## Decisiones provisionales propuestas
- TypeScript estricto.
- Vite para desarrollo y build estático.
- React para interfaz, salvo que al comenzar aparezca una razón concreta para otra opción.
- Canvas 2D para partículas visuales.
- Vitest para pruebas unitarias.
- Playwright para pruebas de navegador cuando la base jugable esté estable.
- Persistencia local sin backend para el MVP.

Estas son recomendaciones de arquitectura para un proyecto nuevo, no hallazgos de código existente.

## Pendiente antes de implementar
1. Confirmar versión instalada de Node.js y npm.
2. Crear repositorio y `.gitignore`.
3. Registrar scripts, dependencias y convenciones en el README.
4. Instalar y verificar toolchain.
5. Generar build inicial de Vite y comprobarlo.
