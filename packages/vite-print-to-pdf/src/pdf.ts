import type { UserConfig } from "./types";
import { chromium } from "playwright";

export async function exportPDF(option: Required<Omit<UserConfig, "filter">>) {
  if (
    !option.pages ||
    option.pages.length === 0 ||
    option.pages.every((p) => !p.url) ||
    option.pages.every((p) => !p.outPath)
  ) {
    return;
  }

  try {
    const browser = await chromium.launch();

    const page = await browser.newPage();

    for (const p of option.pages) {
      await page.goto(p.url, { waitUntil: "networkidle" });
      await page.pdf({ ...p.pdf, path: p.outPath });
    }
    await browser.close();
  } catch (error) {
    console.error("Error exporting PDFs:", error);
  }
}
