import { test, expect, type Page } from "@playwright/test";

// The full invoice flow needs Cloudflare Browser Rendering (via
// react-tailwind-to-pdf/cloudflare) to generate the PDF, which only works
// once actually deployed (see apps/facturation/src/lib/server-fns/
// generate-invoice-pdf.tsx) — local dev/preview reliably fails with a
// Workers-runtime-shim limitation (`fs.mkdtemp` unimplemented). This is the
// only place the full create-invoice-to-PDF-download path can be verified.
const FACTURATION = "https://facturation.playground.nicolas-thouvenin.dev";

async function pickFirstAvailableDate(page: Page) {
  await page.getByRole("button", { name: /MM\/DD\/YYYY/i }).first().click();
  await page
    .locator('[role="gridcell"]:not([data-outside="true"]) button')
    .first()
    .click();
  await page.keyboard.press("Escape");
}

test("creates an invoice, validates it live against B2Brouter, and downloads a real PDF", async ({
  page,
}) => {
  await page.goto(`${FACTURATION}/`);

  await page.getByLabel("Client").click();
  await page.getByRole("option", { name: "Acme Industries SARL" }).click();
  await page.getByLabel("Numéro de facture").fill("FA-PROD-SMOKE");
  await pickFirstAvailableDate(page); // issue date
  await pickFirstAvailableDate(page); // due date
  await page.getByLabel("Description").first().fill("Prestation de conseil");
  await page.getByLabel("Prix unitaire").fill("100");

  const downloadPromise = page.waitForEvent("download", { timeout: 30_000 });
  await page.getByRole("button", { name: /Valider et générer le PDF/i }).click();

  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("FA-PROD-SMOKE.pdf");

  const path = await download.path();
  expect(path).not.toBeNull();

  await expect(page.getByText("Facture validée par B2Brouter")).toBeVisible();
  await expect(page.getByRole("alert")).toHaveCount(0);
});
