// Regenerates packages/registry/registry/*.tsx from @repo/ui source files.
// @repo/ui is the source of truth for components; this script rewrites its
// monorepo-internal imports to the shadcn-standard aliases external
// consumers expect, since `shadcn build` inlines file content verbatim and
// refuses to read paths outside packages/registry (no `..` traversal).
//
// Two kinds of items are synced:
// - registry:ui items are flat: `registry/<file>` mirrors
//   `packages/ui/src/components/<file>` by basename alone. Their only
//   cross-file import is `../utils/cn`; sibling imports (e.g. `./field`)
//   are left as relative, since shadcn installs every registryDependency
//   into that same flat `components/ui/` target directory.
// - registry:block items keep their nested folder structure: `registry/<X>`
//   mirrors `packages/ui/src/<X>` verbatim (X starts with "blocks/"). Their
//   imports that escape the block into a top-level `components/<name>` file
//   are rewritten to the `@/components/ui/<name>` alias; imports that stay
//   inside the block are left as relative, since the whole tree is installed
//   together under one `target` folder.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const registryDir = dirname(dirname(fileURLToPath(import.meta.url)));
const uiSrcDir = join(registryDir, "..", "ui", "src");
const uiComponentsDir = join(uiSrcDir, "components");
const registryJsonPath = join(registryDir, "registry.json");

const IMPORT_REWRITES = [
  [/from (["'])(?:\.\.\/)+utils\/cn\1/g, 'from "@/lib/utils"'],
  [/from (["'])(?:\.\.\/)+components\/([a-z0-9-]+)\1/g, 'from "@/components/ui/$2"'],
];

const registry = JSON.parse(readFileSync(registryJsonPath, "utf-8"));

for (const item of registry.items) {
  for (const file of item.files) {
    const isBlockFile = file.path.startsWith("registry/blocks/");
    const sourcePath = isBlockFile
      ? join(uiSrcDir, file.path.slice("registry/".length))
      : join(uiComponentsDir, file.path.split("/").pop());

    let content = readFileSync(sourcePath, "utf-8");

    for (const [pattern, replacement] of IMPORT_REWRITES) {
      content = content.replace(pattern, replacement);
    }

    const outPath = join(registryDir, file.path);
    mkdirSync(dirname(outPath), { recursive: true });
    writeFileSync(outPath, content, "utf-8");
  }
}

console.log(`Synced ${registry.items.length} registry item(s) from @repo/ui.`);