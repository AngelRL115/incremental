import type { DriveStep } from "driver.js";

export const GAME_GUIDE_STEPS: DriveStep[] = [
  {
    popover: {
      title: "Cómo funciona Space Idle",
      description:
        "Esta guía recorre los recursos, la producción, los umbrales, las mejoras, la automatización, la crónica, el prestigio y la especialización. No compra ni cambia nada. Avanza con Siguiente o las flechas del teclado; cierra cuando quieras con Escape.",
      showButtons: ["next", "close"],
    },
  },
  {
    element: '[data-tour="particle-scene"]',
    popover: {
      title: "1. El campo de partículas",
      description:
        "Es la visualización del observatorio: sus colores y movimientos representan el sistema, pero no generan recursos por sí mismos. La economía avanza con el reloj de simulación, no con los fotogramas de animación.",
      side: "bottom",
      align: "center",
    },
  },
  {
    element: '[data-tour="charge-resource"]',
    popover: {
      title: "2. Charge: saldo y velocidad",
      description:
        "El número grande es el Charge que tienes disponible para comprar mejoras. «Producción Charge/s» indica cuánto produces cada segundo. El Seed Array produce la base; los multiplicadores y ciertos hitos la aumentan. El saldo disponible y lo generado en esta partida son medidas distintas.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: '[data-tour="echo-resource"]',
    popover: {
      title: "3. Echo",
      description:
        "Echo es el segundo recurso: lo produce Echo Loom y se usa para pagar mejoras avanzadas. El saldo disponible aparece aquí y su tasa se muestra debajo. Algunas mejoras también requieren haber generado Echo durante esta run.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: '[data-tour="resonance-resource"]',
    popover: {
      title: "4. Resonancia y reinicios",
      description:
        "Aquí ves los RP disponibles para gastar en Conduit, no el total histórico ganado. El prestigio añade RP; comprar Conduit los consume. «Reinicios» cuenta cuántas veces empezaste una nueva frecuencia.",
      side: "bottom",
      align: "end",
    },
  },
  {
    element: '[data-tour="manual-pulse"]',
    popover: {
      title: "5. Pulso manual",
      description:
        "Cada pulso añade exactamente 2 Charge al saldo. Es una ayuda manual; no adelanta el reloj ni aumenta Charge/s. La producción automática continúa aunque no pulses.",
      side: "bottom",
      align: "end",
    },
  },
  {
    element: '[data-tour="milestones"]',
    popover: {
      title: "6. Umbrales de esta partida",
      description:
        "La barra compara Charge generado en esta run con el siguiente objetivo de prestigio. Los hitos laterales se activan al generar 250, 1,000 y 10,000 Charge: 250 desbloquea Echo Loom; 1,000 y 10,000 aumentan la producción ×1.5 cada uno. El primer prestigio requiere 2,500 Charge generado. El progreso de hitos de run vuelve a empezar tras prestigiar.",
      side: "top",
      align: "center",
    },
  },
  {
    element: '[data-tour="upgrades-heading"]',
    popover: {
      title: "7. Cómo leer y comprar mejoras",
      description:
        "Cada fila muestra nivel actual, efecto, coste del siguiente nivel y requisitos. Comprar 1 adquiere un nivel; Máx. compra tantos niveles como alcance tu saldo. El coste crece según la mejora. El beneficio previsto aparece como producción adicional; los botones desactivados indican que falta saldo, un requisito o que llegaste al máximo. No se puede gastar más de lo disponible.",
      side: "top",
      align: "center",
    },
  },
  {
    element: '[data-tour="upgrade-seed-array"]',
    popover: {
      title: "8. Seed Array",
      description:
        "Es el generador principal de Charge: cada nivel añade 4 Charge/s antes de multiplicadores. Empiezas con uno; comprar niveles eleva la tasa. Su coste crece ×1.18 por nivel comprado.",
      side: "top",
      align: "center",
    },
  },
  {
    element: '[data-tour="upgrade-resonance-lens"]',
    popover: {
      title: "9. Resonance Lens",
      description:
        "Multiplica toda la producción de Charge ×1.30 por nivel (hasta 6 niveles). Se desbloquea al generar 25 Charge en esta run. La cifra «Próximo nivel» estima el aumento de tasa que recibirías al comprarlo.",
      side: "top",
      align: "center",
    },
  },
  {
    element: '[data-tour="upgrade-echo-loom"]',
    popover: {
      title: "10. Echo Loom",
      description:
        "Se desbloquea al generar 250 Charge en esta run. Cada nivel produce 0.8 Echo/s; Echo aparece en el panel superior y sirve para pagar mejoras avanzadas. Generar Echo y tener saldo Echo disponible son medidas distintas.",
      side: "top",
      align: "center",
    },
  },
  {
    element: '[data-tour="upgrade-harmonic-drive"]',
    popover: {
      title: "11. Harmonic Drive",
      description:
        "Cuesta Echo y multiplica la producción de Charge ×1.25 por nivel (máximo 4). Requiere tener al menos un Echo Loom y haber generado 5 Echo durante esta run.",
      side: "top",
      align: "center",
    },
  },
  {
    element: '[data-tour="upgrade-seed-autobuyer"]',
    popover: {
      title: "12. Seed Array Autopilot",
      description:
        "Esta mejora cuesta Echo. Se desbloquea al tener Echo Loom, generar 1,000 Charge y 20 Echo en la run. Al comprarla, activa la compra automática de Seed Array cuando puedas pagarlo. Usa el control de esta fila para pausarla o volver a activarla; no automatiza otras mejoras.",
      side: "top",
      align: "center",
    },
  },
  {
    element: '[data-tour="chronicle-heading"]',
    popover: {
      title: "13. Crónica de frecuencia",
      description:
        "Registra logros cuando se cumplen condiciones reales del estado: compras, recursos generados o prestigio. «Pendiente» no significa que debas pulsar algo aquí; indica qué acontecimiento aún no ocurre. Los registros y sus hitos se conservan según las reglas de la partida.",
      side: "top",
      align: "center",
    },
  },
  {
    element: '[data-tour="prestige"]',
    popover: {
      title: "14. Prestigio: empezar otra frecuencia",
      description:
        "Al generar 2,500 Charge en esta run puedes revisar la recompensa. La fórmula entrega 1 RP por cada 2,500 Charge generados (se cuentan unidades enteras). Confirmar reinicia Charge, Echo y mejoras normales de esta run; conserva RP no gastados, Conduit, especialización, crónica, ingresos de por vida y tiempo total. Conduit aparece después del primer prestigio: cada nivel cuesta 1 RP más que el anterior, multiplica Charge ×1.25 y puede comprarse hasta nivel 25. Revisa la vista previa y confirma solo si aceptas el reinicio.",
      side: "top",
      align: "center",
    },
  },
  {
    element: '[data-tour="specialization"]',
    popover: {
      title: "15. Especialización permanente",
      description:
        "Tras el primer prestigio puedes elegir una sola ruta de tres rangos: Vector de Charge multiplica Charge/s ×1.15 por rango o Resonancia Echo multiplica Echo/s ×1.25. Cuestan 1, 2 y 3 RP; compiten por el mismo saldo que Conduit. La primera compra fija la ruta para siempre: la otra queda descartada. Los rangos se conservan al prestigiar. El panel muestra si está bloqueada, disponible, no asequible o ya elegida.",
      side: "top",
      align: "center",
    },
  },
  {
    element: '[data-tour="save-status"]',
    popover: {
      title: "16. Guardado y progreso offline",
      description:
        "La etiqueta indica si la partida está guardada localmente o si hubo un problema. El autosave ocurre aproximadamente cada 5 segundos y también al realizar acciones. Al volver, el juego calcula producción offline una sola vez y la limita a un máximo de 7 días; muestra cuánto tiempo y recursos acreditó.",
      side: "top",
      align: "start",
    },
  },
  {
    element: '[data-tour="export-save"]',
    popover: {
      title: "17. Exportar una copia",
      description:
        "Descarga un archivo JSON de tu partida para respaldarla o moverla. Mantén ese archivo privado si contiene progreso que no quieras compartir. Exportar no borra ni pausa la partida actual.",
      side: "bottom",
      align: "end",
    },
  },
  {
    element: '[data-tour="import-save"]',
    popover: {
      title: "18. Importar una partida",
      description:
        "Importar reemplaza la partida actual solo después de validar el archivo y pedir confirmación; el tiempo offline del archivo no se acredita al importar. Exporta primero si quieres conservar una copia.",
      side: "top",
      align: "end",
    },
  },
  {
    element: '[data-tour="delete-save"]',
    popover: {
      title: "19. Borrar la partida",
      description:
        "Este botón elimina el progreso local y comienza una partida nueva después de pedir confirmación. Es destructivo: exporta una copia antes si quieres conservar tu progreso.",
      side: "top",
      align: "end",
    },
  },
  {
    element: '[data-tour="reduced-effects"]',
    popover: {
      title: "20. Reducir efectos",
      description:
        "Este control reduce el movimiento visual para una experiencia más tranquila o dispositivos modestos. También se respeta la preferencia de movimiento reducido del sistema. No cambia la producción ni la economía.",
      side: "bottom",
      align: "end",
    },
  },
  {
    popover: {
      title: "El ciclo del juego",
      description:
        "En resumen: observa el saldo y la tasa, invierte Charge en Seed Array y multiplicadores, alcanza hitos para abrir Echo y nuevas mejoras, y considera prestigiar cuando la vista previa te convenga. Puedes volver a abrir esta guía desde «Guía del juego» cuando quieras.",
    },
  },
];
