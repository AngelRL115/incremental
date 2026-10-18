import { expect, test, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";
import AxeBuilder from "@axe-core/playwright";

const SAVE_KEY = "space-idle.save";
const prestigeSandboxSave = readFileSync(
  new URL("../fixtures/g2-prestige-sandbox.json", import.meta.url),
  "utf8",
);
const specializationSandboxSave = readFileSync(
  new URL("../fixtures/g2-specialization-sandbox.json", import.meta.url),
  "utf8",
);
const browserErrors = new WeakMap<Page, string[]>();

function collectBrowserErrors(page: Page): void {
  const errors: string[] = [];
  browserErrors.set(page, errors);
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
}

test.beforeEach(async ({ page }) => {
  collectBrowserErrors(page);
  page.context().on("page", collectBrowserErrors);
});

test.afterEach(async ({ page }) => {
  for (const openPage of page.context().pages()) {
    expect(browserErrors.get(openPage) ?? []).toEqual([]);
  }
});

function serializedState(overrides: Record<string, unknown> = {}): string {
  const state = {
    version: 1,
    resources: { charge: "25", echo: "0" },
    upgrades: {
      "seed-array": 1,
      "resonance-lens": 0,
      "echo-loom": 0,
      "harmonic-drive": 0,
      "seed-autobuyer": 0,
    },
    automationEnabled: { "seed-array-auto": false },
    runChargeEarned: "0",
    lifetimeChargeEarned: "0",
    runEchoEarned: "0",
    lifetimeEchoEarned: "0",
    runElapsedSeconds: "0",
    totalElapsedSeconds: "0",
    availablePrestigePoints: "0",
    lifetimePrestigePoints: "0",
    permanentLevels: { conduit: 0 },
    prestigeCount: 0,
    ...overrides,
  };
  return JSON.stringify(state);
}

function saveEnvelope(game: string, savedAt = Date.now()): string {
  return JSON.stringify({ schemaVersion: 1, savedAt, game });
}

async function preloadSave(
  page: import("@playwright/test").Page,
  game: string,
  savedAt = Date.now(),
): Promise<void> {
  await page.addInitScript(
    ({ key, value }) => {
      if (window.localStorage.getItem(key) === null) window.localStorage.setItem(key, value);
    },
    { key: SAVE_KEY, value: saveEnvelope(game, savedAt) },
  );
}

test("earns resources, purchases a real upgrade, and reloads the saved level", async ({ page }) => {
  await page.clock.pauseAt(new Date(1_800_000_000_000));
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "La materia encuentra su ritmo." })).toBeVisible();
  await expect(page.locator(".resource-value")).toContainText("25.00");
  await page.clock.fastForward(1_000);
  await expect(page.locator(".resource-value")).toContainText("29.00");

  const skipLink = page.getByRole("link", { name: "Saltar a la simulación" });
  await page.keyboard.press("Tab");
  await expect(skipLink).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#game-content")).toBeFocused();

  const seedArray = page.locator(".upgrade-row").filter({
    has: page.getByRole("heading", { name: "Seed Array", exact: true }),
  });
  await seedArray.getByRole("button", { name: "Comprar 1" }).click();
  await expect(seedArray.getByText("NIVEL 2 / 100000")).toBeVisible();
  await expect(page.getByText("8.00 Charge/s")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Crónica de frecuencia" })).toBeVisible();
  await expect(page.locator(".chronicle-entry").filter({
    has: page.getByRole("heading", { name: "La primera señal" }),
  })).toContainText("REGISTRADO");

  await page.getByRole("button", { name: /Emitir pulso/ }).click();
  await page.reload();
  await expect(page.locator(".upgrade-row").filter({
    has: page.getByRole("heading", { name: "Seed Array", exact: true }),
  }).getByText("NIVEL 2 / 100000")).toBeVisible();
});

test("guides the player through the complete game loop without activating controls", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Guía del juego" }).click();

  const titles = [
    "Cómo funciona Space Idle",
    "1. El campo de partículas",
    "2. Charge: saldo y velocidad",
    "3. Echo",
    "4. Resonancia y reinicios",
    "5. Pulso manual",
    "6. Umbrales de esta partida",
    "7. Cómo leer y comprar mejoras",
    "8. Seed Array",
    "9. Resonance Lens",
    "10. Echo Loom",
    "11. Harmonic Drive",
    "12. Seed Array Autopilot",
    "13. Crónica de frecuencia",
    "14. Prestigio: empezar otra frecuencia",
    "15. Especialización permanente",
    "16. Guardado y progreso offline",
    "17. Exportar una copia",
    "18. Importar una partida",
    "19. Borrar la partida",
    "20. Reducir efectos",
    "El ciclo del juego",
  ];
  const popover = page.locator(".driver-popover");
  await expect.poll(() => popover.evaluate((element) => getComputedStyle(element).opacity)).toBe("1");
  const guideA11y = await new AxeBuilder({ page }).analyze();
  expect(guideA11y.violations).toEqual([]);
  for (const [index, title] of titles.entries()) {
    await expect(popover.locator(".driver-popover-title")).toHaveText(title);
    if (title === "15. Especialización permanente") {
      await expect(popover.locator(".driver-popover-description"))
        .toContainText("fija la ruta para siempre");
      await expect(popover.locator(".driver-popover-description")).toContainText("×1.15");
      await expect(popover.locator(".driver-popover-description")).toContainText("Conduit");
    }
    await page.getByRole("button", {
      name: index === titles.length - 1 ? "Terminar" : "Siguiente",
    }).click();
  }
  await expect(popover).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "La materia encuentra su ritmo." })).toBeVisible();
});

test("keeps the game guide inside a narrow mobile viewport", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Guía del juego" }).click();
  await expect(page.locator(".driver-popover-title")).toHaveText("Cómo funciona Space Idle");

  await page.getByRole("button", { name: "Siguiente" }).click();
  await expect(page.locator(".driver-popover-title")).toHaveText("1. El campo de partículas");
  const bounds = await page.locator(".driver-popover").evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return { left: rect.left, right: rect.right, width: rect.width };
  });
  expect(bounds.left).toBeGreaterThanOrEqual(0);
  expect(bounds.right).toBeLessThanOrEqual(320);
  expect(bounds.width).toBeGreaterThan(250);
  await page.keyboard.press("Escape");
  await expect(page.locator(".driver-popover")).toHaveCount(0);
});

test("rapid repeated purchase events never spend the same balance twice", async ({ page }) => {
  await page.clock.pauseAt(new Date(1_800_000_000_000));
  await page.goto("/");
  const seedArray = page.locator(".upgrade-row").filter({
    has: page.getByRole("heading", { name: "Seed Array", exact: true }),
  });
  const button = seedArray.getByRole("button", { name: "Comprar 1" });
  await button.evaluate((element) => {
    const click = () => element.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    click();
    click();
  });

  await expect(seedArray.getByText("NIVEL 2 / 100000")).toBeVisible();
  await expect(page.getByRole("alert")).toContainText("Not enough charge");
  const charge = await page.locator(".resource-value").innerText();
  expect(Number.parseFloat(charge.replace(/[^\d.]/g, ""))).toBeGreaterThanOrEqual(0);
});

test("credits capped offline production once and persists the updated timestamp", async ({ page }) => {
  await preloadSave(page, serializedState(), Date.now() - 60_000);
  await page.goto("/");

  const summary = page.getByRole("dialog", { name: "El sistema siguió evolucionando." });
  await expect(summary).toBeVisible();
  await expect(summary).toBeFocused();
  await expect(summary).toContainText(/Charge obtenido: 2\d{2}\.\d{2}/);
  const summaryAudit = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(summaryAudit.violations).toEqual([]);
  await page.keyboard.press("Tab");
  await expect(summary.getByRole("button", { name: "Continuar" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(summary.getByRole("button", { name: "Continuar" })).toBeFocused();
  await summary.getByRole("button", { name: "Continuar" }).click();

  const balance = await page.evaluate((key) => {
    const envelope = JSON.parse(window.localStorage.getItem(key) ?? "{}") as {
      savedAt: number;
      game: string;
    };
    const game = JSON.parse(envelope.game) as {
      resources: { charge: string };
      version: number;
    };
    return {
      savedAt: envelope.savedAt,
      charge: Number(game.resources.charge),
      version: game.version,
    };
  }, SAVE_KEY);
  expect(balance.savedAt).toBeGreaterThan(Date.now() - 10_000);
  expect(balance.charge).toBeGreaterThanOrEqual(265);
  expect(balance.version).toBe(3);

  await page.reload();
  await expect(page.getByRole("dialog", { name: "El sistema siguió evolucionando." })).toHaveCount(0);
});

test("unlocks Echo Loom at the production milestone and purchases the second resource tier", async ({ page }) => {
  const savedAt = 1_800_000_000_000;
  await page.clock.pauseAt(new Date(savedAt));
  await preloadSave(page, serializedState({
    resources: { charge: "500", echo: "0" },
    runChargeEarned: "240",
    lifetimeChargeEarned: "240",
    runElapsedSeconds: "60",
    totalElapsedSeconds: "60",
  }), savedAt);
  await page.goto("/");

  const echoLoom = page.locator(".upgrade-row").filter({
    has: page.getByRole("heading", { name: "Echo Loom", exact: true }),
  });
  await expect(echoLoom).toContainText("Bloqueado · Genera 250 Charge en esta partida.");
  const buyButton = echoLoom.getByRole("button", { name: "Comprar 1" });
  await expect(buyButton).toBeDisabled();
  await page.clock.fastForward(2_500);
  await expect(buyButton).toBeEnabled();
  await buyButton.click();
  await expect(echoLoom.getByText("NIVEL 1 / 50")).toBeVisible();
  await expect(page.getByText("0.80 / s")).toBeVisible();
});

test("allows the player to pause and reactivate the purchased Seed Array Autopilot", async ({ page }) => {
  const savedAt = Date.now();
  await preloadSave(page, serializedState({
    resources: { charge: "25", echo: "100" },
    upgrades: {
      "seed-array": 1,
      "resonance-lens": 0,
      "echo-loom": 1,
      "harmonic-drive": 0,
      "seed-autobuyer": 0,
    },
    runChargeEarned: "1000",
    lifetimeChargeEarned: "1000",
    runEchoEarned: "20",
    lifetimeEchoEarned: "20",
  }), savedAt);
  await page.goto("/");

  const autopilot = page.locator(".upgrade-row").filter({
    has: page.getByRole("heading", { name: "Seed Array Autopilot", exact: true }),
  });
  await autopilot.getByRole("button", { name: "Comprar 1" }).click();
  const toggle = autopilot.getByRole("button", { name: "Pausar autopiloto" });
  await expect(toggle).toHaveAttribute("aria-pressed", "true");
  await toggle.click();
  await expect(autopilot.getByRole("button", { name: "Activar autopiloto" }))
    .toHaveAttribute("aria-pressed", "false");
});

test("previews prestige, confirms its reset, and keeps permanent progression", async ({ page }) => {
  page.on("dialog", (dialog) => dialog.accept());
  await page.goto("/");
  await page.locator('input[type="file"]').setInputFiles({
    name: "g2-prestige-sandbox.json",
    mimeType: "application/json",
    buffer: Buffer.from(prestigeSandboxSave),
  });
  await expect(page.getByRole("alert")).toContainText("Partida importada correctamente");
  await expect(page.getByRole("alert")).toContainText(
    "El progreso offline del archivo no se acredita al importar",
  );

  await page.getByRole("button", { name: /Revisar prestigio/ }).click();
  const dialog = page.getByRole("dialog", { name: "¿Transformar esta run en Resonancia?" });
  await expect(dialog).toBeFocused();
  await expect(dialog).toContainText("Recibirás 1.00 puntos de Resonancia");
  const dialogAudit = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(dialogAudit.violations).toEqual([]);
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(page.getByRole("button", { name: /Revisar prestigio/ })).toBeFocused();
  await page.getByRole("button", { name: /Revisar prestigio/ }).click();
  const reopenedDialog = page.getByRole("dialog", { name: "¿Transformar esta run en Resonancia?" });
  await reopenedDialog.getByRole("button", { name: "Confirmar prestigio" }).click();

  await expect(page.getByText("1 reinicio", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Comprar Conduit" })).toBeVisible();
  await expect(page.getByRole("button", { name: /Revisar prestigio/ })).toHaveCount(0);
  await page.getByRole("button", { name: "Comprar Conduit" }).click();
  await expect(page.locator(".rate-line strong")).toHaveText("5.00 Charge/s");
  await expect(page.getByRole("button", { name: "Comprar Conduit" })).toHaveCount(0);
});

test("chooses one permanent specialization route and saves each purchased rank", async ({ page }) => {
  page.on("dialog", (dialog) => dialog.accept());
  await page.goto("/");
  await page.locator('input[type="file"]').setInputFiles({
    name: "g2-specialization-sandbox.json",
    mimeType: "application/json",
    buffer: Buffer.from(specializationSandboxSave),
  });
  await expect(page.getByRole("alert")).toContainText("Partida importada correctamente");

  const panel = page.getByRole("region", { name: "Especialización" });
  await expect(panel).toContainText("Resonancia disponible: 3.00 RP");
  await expect(panel).toContainText("Próximo rango 1: 1.00 RP");
  await page.setViewportSize({ width: 320, height: 844 });
  const dimensions = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth,
  }));
  expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport);
  const specializationAudit = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(specializationAudit.violations).toEqual([]);
  const firstRank = panel.getByRole("button", { name: /Elegir Vector de Charge/ });
  const target = await firstRank.boundingBox();
  expect(target?.height).toBeGreaterThanOrEqual(44);
  await firstRank.focus();
  await page.keyboard.press("Enter");
  await expect(panel).toContainText("Resonancia disponible: 2.00 RP");
  await expect(panel).toContainText("Elegida · rango 1 de 3");
  await expect(panel.getByRole("button", { name: /Elegir Resonancia Echo/ })).toBeDisabled();

  await panel.getByRole("button", { name: /Mejorar Vector de Charge/ }).click();
  await expect(panel).toContainText("Resonancia disponible: 0.00 RP");
  await expect(panel).toContainText("Elegida · rango 2 de 3");
  await expect(panel.getByRole("button", { name: /Mejorar Vector de Charge/ })).toBeDisabled();
  await page.reload();

  const restored = page.getByRole("region", { name: "Especialización" });
  await expect(restored).toContainText("Resonancia disponible: 0.00 RP");
  await expect(restored).toContainText("Elegida · rango 2 de 3");
  await expect(restored.getByRole("button", { name: /Elegir Resonancia Echo/ })).toBeDisabled();
});

test("offers explicit recovery for an invalid save and fits a mobile viewport", async ({ page }) => {
  await page.addInitScript(
    ({ key, value }) => window.localStorage.setItem(key, value),
    { key: SAVE_KEY, value: "{" },
  );
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "No se pudo validar el guardado." })).toBeVisible();

  page.on("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Crear partida nueva" }).click();
  await expect(page.getByRole("heading", { name: "La materia encuentra su ritmo." })).toBeVisible();

  const dimensions = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth,
  }));
  expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport);
});

test("passes automated WCAG AA checks in the default game state", async ({ page }) => {
  await page.goto("/");
  for (const width of [320, 360, 390, 768, 1024, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    const dimensions = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      content: document.documentElement.scrollWidth,
      minTarget: Math.min(...Array.from(document.querySelectorAll("button")).map((button) => {
        const bounds = button.getBoundingClientRect();
        return Math.min(bounds.width, bounds.height);
      })),
    }));
    expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport);
    expect(dimensions.minTarget).toBeGreaterThanOrEqual(24);

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  }
});

test("reduced motion stops decorative frames while economic time keeps advancing", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => {
    const originalRequestAnimationFrame = window.requestAnimationFrame.bind(window);
    let requests = 0;
    Object.defineProperty(window, "__requestedAnimationFrames", {
      get: () => requests,
    });
    window.requestAnimationFrame = (callback) => {
      requests += 1;
      return originalRequestAnimationFrame(callback);
    };
  });

  await page.goto("/");
  const initialCharge = await page.locator(".resource-value").innerText();
  await page.waitForTimeout(750);
  const result = await page.evaluate(() => ({
    requests: (window as Window & { __requestedAnimationFrames?: number }).__requestedAnimationFrames ?? 0,
    reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  }));
  const laterCharge = await page.locator(".resource-value").innerText();

  expect(result.reducedMotion).toBe(true);
  expect(result.requests).toBe(0);
  expect(laterCharge).not.toBe(initialCharge);
});

test("prevents a second tab from simulating until the active tab releases its lease", async ({ page }) => {
  await page.goto("/");
  const secondTab = await page.context().newPage();
  await secondTab.goto("/");
  await expect(secondTab.getByRole("heading", { name: "El observatorio ya está abierto." })).toBeVisible();

  await page.close();
  await secondTab.getByRole("button", { name: "Comprobar de nuevo" }).click();
  await expect(secondTab.getByRole("heading", { name: "La materia encuentra su ritmo." })).toBeVisible();
});

test("exports a save and imports only a validated replacement", async ({ page }) => {
  await page.goto("/");

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Exportar partida" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("space-idle-save.json");

  page.on("dialog", (dialog) => dialog.accept());
  const importedState = serializedState({
    resources: { charge: "500", echo: "0" },
    upgrades: {
      "seed-array": 2,
      "resonance-lens": 0,
      "echo-loom": 0,
      "harmonic-drive": 0,
      "seed-autobuyer": 0,
    },
    runChargeEarned: "200",
    lifetimeChargeEarned: "200",
    runElapsedSeconds: "50",
    totalElapsedSeconds: "50",
  });
  const input = page.locator('input[type="file"]');
  await input.setInputFiles({
    name: "valid-save.json",
    mimeType: "application/json",
    buffer: Buffer.from(saveEnvelope(importedState)),
  });
  await expect(page.locator(".upgrade-row").filter({
    has: page.getByRole("heading", { name: "Seed Array", exact: true }),
  }).getByText("NIVEL 2 / 100000")).toBeVisible();
  await expect(page.getByRole("alert")).toContainText("Partida importada correctamente");

  await input.setInputFiles({
    name: "invalid-save.json",
    mimeType: "application/json",
    buffer: Buffer.from("{"),
  });
  await expect(page.getByRole("alert")).toContainText("no contiene JSON válido");
});
