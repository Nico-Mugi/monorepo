# Pattern: driving a real browser to verify a user-facing flow

What this proves that a unit test doesn't: that clicking the actual button,
in an actual browser, against the actual running app, produces the actual
expected artifact. Useful whenever "does the button work" can't be answered
by calling the underlying function directly — e.g. it depends on real DOM
events, a real download, or (as in the case this was built for) a real
remote service on the other end of a server function.

## The shape

1. Launch headless Chromium, attach error listeners **before** navigating.
2. Navigate, screenshot — proves the page actually loaded, gives you a
   before-state to diff against.
3. Register `waitForEvent(...)` **before** the action that triggers it —
   register-then-act, never act-then-await, or you can race past the event.
4. Act (click / fill / etc.).
5. Await the event, save/inspect whatever it produced.
6. Screenshot again — proves the after-state, catches "click did nothing."
7. Dump collected console/page/network errors — a page can look fine and
   still have silently failed a fetch.

## Script

```js
import { chromium } from "playwright";
import { writeFileSync, readFileSync } from "node:fs";

const browser = await chromium.launch();
const page = await browser.newPage();

// 1. Error listeners, attached before anything happens.
const consoleErrors = [];
const pageErrors = [];
const failedRequests = [];
page.on("console", (msg) => {
  if (msg.type() === "error") consoleErrors.push(msg.text());
});
page.on("pageerror", (err) => pageErrors.push(String(err)));
page.on("requestfailed", (req) =>
  failedRequests.push(`${req.method()} ${req.url()} :: ${req.failure()?.errorText}`),
);

// 2. Navigate, prove it loaded.
await page.goto("http://localhost:3000/your-page", { waitUntil: "networkidle" });
await page.screenshot({ path: "./before-click.png" });

// 3. Register the wait BEFORE the click that triggers it.
const targetLink = page.getByText("Button label", { exact: false }).first();
await targetLink.waitFor({ state: "visible", timeout: 15000 });
const downloadPromise = page.waitForEvent("download", { timeout: 60000 });

// 4. Act.
await targetLink.click();

// 5. Await + inspect the result.
let outcome = "unknown";
try {
  const download = await downloadPromise;
  const path = "./downloaded-file";
  await download.saveAs(path);
  const bytes = readFileSync(path);
  outcome = "downloaded";
  console.log("suggestedFilename:", download.suggestedFilename());
  console.log("byteLength:", bytes.length);
  console.log("header:", bytes.subarray(0, 5).toString("latin1"));
} catch (err) {
  outcome = "failed: " + String(err);
}

// 6. After-state.
await page.screenshot({ path: "./after-click.png" });

// 7. Errors, always check these even on "success."
console.log("Outcome:", outcome);
console.log("Console errors:", consoleErrors);
console.log("Page errors:", pageErrors);
console.log("Failed requests:", failedRequests);

await browser.close();
```

## Gotchas actually hit using this

- **Bare imports need a real `node_modules`.** Running this as a loose
  script outside any project won't resolve `import { chromium } from
  "playwright"`. Either run it from inside a project that already has
  `playwright` installed, or add it as a real dependency somewhere.

- **Client-side listeners only see the client-side browser.** If the button
  you're testing calls a server function that itself drives *another*,
  separate browser (a remote rendering service, a second Playwright
  instance, etc.), your `page.on("console"/...)` listeners are attached to
  the page you're driving — they see nothing about what happened inside that
  other, server-side browser. A clean run with zero console errors here does
  **not** prove the server-side render was correct; it only proves the
  client-side request/response cycle didn't error. Check the actual produced
  artifact (file size, content, a screenshot of it) independently — don't
  trust "no errors" alone. This exact gap produced a false "success" once:
  a PDF download completed with zero console errors while silently missing
  an image, because the image failed to load inside a *different* browser
  than the one being watched.

- **Reading a downloaded PDF for real.** Playwright can't rasterize a PDF by
  navigating to it — headless Chromium treats `file:///foo.pdf` as another
  download, not a render, and `page.goto()` throws ("Download is
  starting"). If you have `poppler-utils` (`pdftoppm`), rasterize with that.
  Otherwise, fall back to structural checks: `%PDF-` header, byte size
  compared against a known-good reference file (a wildly smaller file is a
  strong signal something didn't load), `grep`-ing the raw bytes for
  `/Subtype /Image` or `/Width`/`/Height` to confirm expected embedded
  assets are actually present.

- **`waitForEvent("download")` needs registering before the click**, not
  after — `await link.click(); await page.waitForEvent("download")` can miss
  the event if it fires before the second line runs.
