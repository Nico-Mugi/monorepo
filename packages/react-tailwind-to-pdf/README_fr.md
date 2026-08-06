# react-tailwind-to-pdf

Génère un PDF, côté serveur, à partir d'un composant React stylisé avec
Tailwind CSS v4, via un navigateur compatible Playwright. Conçu pour des
exports à la demande (un bouton « Télécharger le PDF » appelant une fonction
serveur), pas pour un workflow de dev-watch : voir `packages/vite-print-to-pdf`
pour ça.

Agnostique du runtime : la primitive sous-jacente accepte n'importe quel objet
ayant la forme d'un `Browser` Playwright (`newPage()` → une page avec
`setContent`/`pdf`/`close`). Apportez votre propre navigateur. Le point
d'entrée à utiliser dépend de l'endroit où le CSS est compilé : voir
ci-dessous.

## Node : `.`

Compile Tailwind à la volée (JIT) pour vous via `@tailwindcss/node`, limité
exactement aux classes utilisées par l'élément. Cela nécessite un vrai
processus Node.js : `@tailwindcss/node` charge un binaire natif
(`@tailwindcss/oxide`), qui ne peut pas s'exécuter dans un runtime en
isolate V8 (Cloudflare Workers, Vercel Edge, etc.). Le simple fait de
*l'importer* là-bas suffit à faire planter, pas seulement de l'appeler.

```ts
import { chromium } from "playwright";
import { renderToPdf } from "react-tailwind-to-pdf";
import { Invoice } from "./Invoice";

const browser = await chromium.launch();
try {
  const pdf = await renderToPdf({
    element: <Invoice total={42} />,
    browser,
    css: `@import "tailwindcss"; @theme { --color-brand: oklch(0.6 0.2 280); }`,
  });
} finally {
  await browser.close();
}
```

## Cloudflare Workers : `./cloudflare`

Nécessite un binding `browser` (voir la
[doc Cloudflare Browser Rendering](https://developers.cloudflare.com/browser-run/)) :

```jsonc
// wrangler.jsonc
{ "browser": { "binding": "MYBROWSER" } }
```

Ce point d'entrée n'importe volontairement jamais `@tailwindcss/node` : le
`css` fourni ici doit déjà être du **CSS final, compilé**, pas du source
Tailwind. Compilez-le à l'avance avec `./compile` (ci-dessous), dans une
étape de build Node normale, et passez le résultat :

```ts
import { renderToPdfOnCloudflare } from "react-tailwind-to-pdf/cloudflare";
import { Invoice } from "./Invoice";
import invoiceCss from "./invoice.generated.css?raw"; // produit par l'étape ./compile

const pdf = await renderToPdfOnCloudflare(env.MYBROWSER, {
  element: <Invoice total={42} />,
  css: invoiceCss,
});
```

## Précompiler le CSS pour un runtime edge : `./compile`

Node uniquement, conçu pour s'exécuter une fois dans un script de build : pas
dans un gestionnaire de requêtes. Compile en JIT de la même façon que `.`,
mais renvoie simplement le texte CSS afin que vous puissiez l'écrire dans un
fichier et livrer *celui-ci* plutôt que de compiler à chaque requête :

```ts
// scripts/compile-invoice-css.mjs : exécuté dans votre build
import { writeFileSync } from "node:fs";
import { compileTailwindCssForElement } from "react-tailwind-to-pdf/compile";
import { Invoice } from "../src/Invoice";

const css = await compileTailwindCssForElement(
  `@import "tailwindcss"; @theme { --color-brand: oklch(0.6 0.2 280); }`,
  <Invoice total={0} />, // props représentatives : seules les classes utilisées comptent
);
writeFileSync("./src/invoice.generated.css", css);
```

Comme cela ne se soucie que des noms de classes qui apparaissent dans le
markup, les props/données que vous passez n'ont pas besoin d'être réelles ;
elles doivent juste exercer chaque classe conditionnelle que votre composant
peut afficher. Câblez le script dans votre build habituel (`prebuild`/avant
`vite build`/etc.) pour qu'il ne puisse pas devenir obsolète.

## Fonctionnement

- L'élément est rendu avec `renderToStaticMarkup` (pas de marqueurs
  d'hydratation ; c'est une sortie d'impression, pas une page hydratée).
- Le résultat est enveloppé dans un document HTML autonome minimal et
  transmis au navigateur via `page.setContent()` (sans requête HTTP), puis
  imprimé avec `page.pdf()`.

## Options

| Option | Type | Description |
| --- | --- | --- |
| `element` | `ReactElement` | Le composant à rendre. |
| `browser` | `PdfBrowser` | Un navigateur connecté. Vous gérez son lancement/sa fermeture. |
| `css` | `string` | Source Tailwind (`.`) ou CSS déjà compilé (`./cloudflare`). |
| `head` | `string?` | Markup `<head>` supplémentaire (polices, meta, `<style>` additionnel). |
| `waitUntil` | `"load" \| "domcontentloaded" \| "networkidle"?` | Vaut `"networkidle"` par défaut. |
| `pdf` | `PdfOptions?` | Transmis à `page.pdf()`. `printBackground` vaut `true` par défaut. |

## Périmètre

Ce package ne cherche volontairement pas à tout couvrir : pas de helper de
chargement de polices, pas de préréglages de thème, pas d'inlining d'images.
Apportez exactement le CSS et le contenu `head` dont votre composant a besoin.
