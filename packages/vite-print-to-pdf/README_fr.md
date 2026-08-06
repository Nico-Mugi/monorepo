# vite-plugin-print-to-pdf

Un plugin pour le serveur de dev Vite qui surveille les fichiers source de vos
routes et réexporte les pages correspondantes en PDF (via
[Playwright](https://playwright.dev)) à chaque fois qu'une dépendance de cette
route change. Utile pour garder un artefact généré (un CV, un modèle de
facture, une feuille de style d'impression) synchronisé avec la page dont il
est issu pendant que vous l'éditez.

## Fonctionnement

Pour chaque page enregistrée, le plugin parcourt le graphe de modules de Vite
pour trouver chaque fichier dont cette page dépend transitivement (son « arbre
de surveillance »). Quand le serveur de dev détecte un changement de fichier,
il vérifie si le fichier modifié fait partie de l'arbre de surveillance d'une
page, et si c'est le cas, réexporte cette page avec une instance Chromium
headless et écrit le PDF résultant sur le disque.

## Installation

```sh
npm install -D vite-plugin-print-to-pdf playwright
npx playwright install chromium
```

`playwright` est un pair du comportement d'exécution de ce plugin : il est
listé comme dépendance normale afin que les binaires du navigateur soient
récupérés automatiquement, mais vous devez tout de même installer le
navigateur Chromium lui-même une fois via `playwright install`.

## Utilisation

```ts
// vite.config.ts
import { defineConfig } from "vite";
import printToPdf from "vite-plugin-print-to-pdf";

export default defineConfig({
  plugins: [
    printToPdf({
      // Optionnel : ignorer les fichiers qui ne devraient pas déclencher une réexportation.
      filter: (file) => !file.includes("node_modules"),
      pages: [
        {
          url: "/resume",
          outPath: "./public/files/resume.pdf",
          watchFile: "src/routes/resume.tsx",
          pdf: {
            format: "A4",
            printBackground: true,
            margin: { top: "0mm", bottom: "0mm", left: "0mm", right: "0mm" },
          },
        },
      ],
    }),
  ],
});
```

## Options

| Option | Type | Description |
| --- | --- | --- |
| `filter` | `(changedFile: string) => boolean` | Optionnel. Renvoie `false` pour ignorer un fichier modifié même s'il fait partie de l'arbre de surveillance d'une page. Accepte tous les fichiers par défaut. |
| `pages` | `Page[]` | Les pages à surveiller et à exporter. |

Chaque entrée `Page` :

| Champ | Type | Description |
| --- | --- | --- |
| `url` | `string` | L'URL de la page à exporter. Les URLs relatives sont résolues par rapport à l'URL de base du serveur de dev. |
| `outPath` | `string` | Où écrire le PDF exporté. |
| `watchFile` | `string` | Le fichier d'entrée dont l'arbre de dépendances doit être surveillé pour déclencher cette exportation. |
| `pdf` | `Parameters<Page["pdf"]>[0]` (Playwright) | Options transmises à `page.pdf()` de Playwright, sauf `path`. |

Le plugin ne s'exécute qu'en dev (`apply: "serve"`). Il ne fait rien en
production.

## Licence

MIT
