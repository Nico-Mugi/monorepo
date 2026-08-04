// Regenerates packages/registry/registry/*.tsx from @repo/ui source files.
// @repo/ui is the source of truth for components; this script rewrites its
// monorepo-internal imports to the shadcn-standard aliases external
// consumers expect, since `shadcn build` inlines file content verbatim and
// refuses to read paths outside packages/registry (no `..` traversal).
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const registryDir = dirname(dirname(fileURLToPath(import.meta.url)));
const uiComponentsDir = join(registryDir, "..", "ui", "src", "components");
const registryJsonPath = join(registryDir, "registry.json");

const IMPORT_REWRITES = [[/from "\.\.\/utils\/cn"/g, 'from "@/lib/utils"']];

const registry = JSON.parse(readFileSync(registryJsonPath, "utf-8"));

for (const item of registry.items) {
  for (const file of item.files) {
    const fileName = file.path.split("/").pop();
    let content = readFileSync(join(uiComponentsDir, fileName), "utf-8");

    for (const [pattern, replacement] of IMPORT_REWRITES) {
      content = content.replace(pattern, replacement);
    }

    const outPath = join(registryDir, file.path);
    mkdirSync(dirname(outPath), { recursive: true });
    writeFileSync(outPath, content, "utf-8");
  }
}

console.log(`Synced ${registry.items.length} registry item(s) from @repo/ui.`);