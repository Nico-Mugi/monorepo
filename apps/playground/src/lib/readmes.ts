// apps/playground is Vite's project root, so its own README doesn't match the
// "../../../*/README.md" glob below the same way sibling apps do (Vite keys
// root-level matches differently from ones reached via "../" traversal) —
// import it directly instead of relying on the wildcard for this one case.
import playgroundReadme from "../../README.md?raw";
import playgroundReadmeFr from "../../README_fr.md?raw";

const appReadmes = import.meta.glob("../../../*/README.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const appReadmesFr = import.meta.glob("../../../*/README_fr.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const packageReadmes = import.meta.glob("../../../../packages/*/README.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const packageReadmesFr = import.meta.glob(
  "../../../../packages/*/README_fr.md",
  { query: "?raw", import: "default", eager: true },
) as Record<string, string>;

function indexByParentDir(
  glob: Record<string, string>,
  fileName: string,
): Record<string, string> {
  const index: Record<string, string> = {};
  const suffix = new RegExp(`([^/]+)/${fileName}$`);
  for (const [path, content] of Object.entries(glob)) {
    const match = suffix.exec(path);
    if (match) index[match[1]] = content;
  }
  return index;
}

const appReadmesByDir: Record<string, string> = {
  ...indexByParentDir(appReadmes, "README.md"),
  playground: playgroundReadme,
};
const appReadmesFrByDir: Record<string, string> = {
  ...indexByParentDir(appReadmesFr, "README_fr.md"),
  playground: playgroundReadmeFr,
};
const packageReadmesByDir = indexByParentDir(packageReadmes, "README.md");
const packageReadmesFrByDir = indexByParentDir(packageReadmesFr, "README_fr.md");

export function getAppReadme(
  dirName: string,
  locale: string,
): string | undefined {
  if (locale === "fr" && appReadmesFrByDir[dirName]) {
    return appReadmesFrByDir[dirName];
  }
  return appReadmesByDir[dirName];
}

export function getPackageReadme(
  dirName: string,
  locale: string,
): string | undefined {
  if (locale === "fr" && packageReadmesFrByDir[dirName]) {
    return packageReadmesFrByDir[dirName];
  }
  return packageReadmesByDir[dirName];
}
