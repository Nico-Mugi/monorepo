import { test, expect, type Page } from "@playwright/test";

// Standard CSS pixel mapping: 1mm = 96/25.4px
const MM_TO_PX = 96 / 25.4;
const A4_WIDTH_PX = 210 * MM_TO_PX; // ~793.7
const A4_HEIGHT_PX = 297 * MM_TO_PX; // ~1122.5
const TOLERANCE = 5; // CSS pixels

async function assertA4Container(page: Page) {
  const container = page.locator('[class*="w-[210mm]"]').first();
  await expect(container).toBeVisible();

  const box = await container.boundingBox();
  expect(box).not.toBeNull();

  expect(box!.width).toBeGreaterThanOrEqual(A4_WIDTH_PX - TOLERANCE);
  expect(box!.width).toBeLessThanOrEqual(A4_WIDTH_PX + TOLERANCE);

  expect(box!.height).toBeGreaterThanOrEqual(A4_HEIGHT_PX - TOLERANCE);
  expect(box!.height).toBeLessThanOrEqual(A4_HEIGHT_PX + TOLERANCE);

  type OverflowEntry = {
    tag: string;
    cls: string;
    rightOverflow: number;
    bottomOverflow: number;
  };

  const overflowing = await container.evaluate((el): OverflowEntry[] => {
    const rect = el.getBoundingClientRect();
    const entries: OverflowEntry[] = [];

    for (const child of el.querySelectorAll("*")) {
      const childRect = child.getBoundingClientRect();
      // Skip zero-size and fixed-position elements
      if (childRect.width === 0 || childRect.height === 0) continue;
      if (window.getComputedStyle(child).position === "fixed") continue;

      const rightOverflow = childRect.right - rect.right;
      const bottomOverflow = childRect.bottom - rect.bottom;

      if (rightOverflow > 1 || bottomOverflow > 1) {
        entries.push({
          tag: child.tagName,
          cls: (child.getAttribute("class") ?? "").substring(0, 80),
          rightOverflow: Math.round(rightOverflow * 10) / 10,
          bottomOverflow: Math.round(bottomOverflow * 10) / 10,
        });
      }
    }

    return entries;
  });

  expect(
    overflowing,
    `Children overflowing the A4 container:\n${JSON.stringify(overflowing, null, 2)}`
  ).toHaveLength(0);
}

test.describe("CV/Resume A4 dimensions", () => {
  test("French CV at /fr/cv renders at A4 size", async ({ page }) => {
    await page.goto("/fr/cv");
    await assertA4Container(page);
  });

  test("English Resume at /en/resume renders at A4 size", async ({ page }) => {
    await page.goto("/en/resume");
    await assertA4Container(page);
  });
});
