import { chromium } from "playwright";
import path from "node:path";
import { fileURLToPath } from "node:url";

const [, , url, outName] = process.argv;

if (!url || !outName) {
  console.error("Usage: pnpm --filter playground screenshot <url> <output-filename.png>");
  process.exit(1);
}

const outDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../public/screenshots",
);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
await page.goto(url, { waitUntil: "networkidle" });
await page.screenshot({ path: path.join(outDir, outName) });
await browser.close();

console.log(`Saved ${outName} from ${url}`);
