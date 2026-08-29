import { test, expect } from "@playwright/test";

test.describe("Critical path: landing -> demo -> diagnostico -> submit", () => {
  test("a first-time visitor can understand the service and try the demo", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Convierte tu Excel en una aplicación web/);
    await expect(page.getByRole("heading", { name: /Convierte tu Excel en una aplicación web/ })).toBeVisible();

    await page.getByRole("link", { name: "Probar la demo" }).first().click();
    await expect(page).toHaveURL(/\/demo$/);
  });

  test("the demo converts the Excel and shows a navigable resulting app", async ({ page }) => {
    await page.goto("/demo");
    await expect(page.getByRole("heading", { name: /Pulsa convertir/ })).toBeVisible();

    await page.getByRole("button", { name: "Convertir en aplicación" }).click();

    // Converting state shows progress logs, then settles on the resulting app.
    await expect(page.getByText("Leyendo el archivo y construyendo la aplicación.")).toBeVisible();
    await expect(page.getByRole("heading", { name: /misma información, hecha aplicación/ })).toBeVisible({
      timeout: 5000,
    });

    // The resulting app has its own internal navigation.
    await page.getByRole("button", { name: "Productos" }).click();
    await expect(page.getByRole("columnheader", { name: "SKU" })).toBeVisible();
  });

  test("submitting the diagnostico form persists the lead and shows confirmation", async ({ page }) => {
    await page.goto("/diagnostico");

    // Step 1 — contact info
    await page.getByLabel("Nombre *").fill("Ana Torres");
    await page.getByLabel("Empresa *").fill("Ferretería Andes E2E");
    await page.getByLabel("Email *").fill(`ana.e2e.${Date.now()}@andes.cl`);
    await page.getByRole("button", { name: "Continuar" }).click();

    // Step 2 — process
    await page.getByLabel(/Qué haces actualmente con Excel/).fill("Controlamos el inventario en una hoja compartida.");
    await page.getByRole("button", { name: "Continuar" }).click();

    // Step 3 — goal, then submit
    await page.getByRole("button", { name: "Inventario" }).click();
    await page.getByRole("button", { name: "Solicitar diagnóstico" }).click();

    await expect(page).toHaveURL(/\/diagnostico\/gracias$/, { timeout: 10_000 });
    await expect(page.getByRole("heading", { name: /Listo\. Ya tenemos tu proceso\./ })).toBeVisible();
    await expect(page.getByText(/Ana/)).toBeVisible();
  });

  test("blocks submission and shows inline errors when required fields are missing", async ({ page }) => {
    await page.goto("/diagnostico");
    await page.getByRole("button", { name: "Continuar" }).click();

    await expect(page.getByText("Necesitamos tu nombre para responderte.")).toBeVisible();
    await expect(page).toHaveURL(/\/diagnostico$/);
  });
});

test.describe("Responsive", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  for (const path of ["/", "/demo", "/diagnostico", "/dashboard-ejemplo"]) {
    test(`no horizontal overflow on ${path} at mobile width`, async ({ page }) => {
      await page.goto(path);
      const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
      expect(hasOverflow).toBe(false);
    });
  }
});
