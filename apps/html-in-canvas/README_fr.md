# HTML dans un Canvas

Un petit terrain de jeu qui sérialise un fragment HTML modifiable dans un
`foreignObject` SVG, le charge en tant qu'image data-URI, puis peint cette
image sur un `<canvas>` HTML5. Modifiez la source, redessinez, ou exportez le
résultat en PNG.

[Site en ligne](https://html-in-canvas.playground.nicolas-thouvenin.dev)

## Stack technique

- **Framework** : TanStack Start (React 19, SSR sur Cloudflare Workers)
- **Routage** : TanStack Router basé sur les fichiers
- **Style** : Tailwind CSS v4 + `@repo/ui`
- **i18n** : Paraglide JS (locale de base `fr`, `en` en second)
- **Tests** : Playwright E2E
- **Déploiement** : Cloudflare Workers via Wrangler

## Démarrage

Cette app vit dans le [monorepo](../../) ; lancez les commandes depuis la racine du dépôt ou depuis ce dossier.

### Initialisation (premier lancement uniquement)

La sortie de Paraglide est ignorée par git et doit être générée avant le premier démarrage du serveur de dev :

```bash
pnpm exec paraglide-js compile --project ../../packages/i18n/project.inlang --outdir ./src/lib/paraglide
```

### Développement

```bash
pnpm dev --filter html-in-canvas   # http://localhost:3012
```

### Build et prévisualisation

```bash
pnpm build --filter html-in-canvas
pnpm preview      # sert le build de production sur le port 3012
```

### Déploiement

```bash
pnpm deploy --filter html-in-canvas
```

### Tests

Les tests Playwright nécessitent le **build de production** : ne testez pas contre `pnpm dev`.

```bash
pnpm build --filter html-in-canvas && pnpm preview   # dans un terminal
pnpm test --filter html-in-canvas                    # dans un autre
```

## Structure du projet

```
src/
├── components/       # Nav, limites d'erreur/404, la démo canvas
├── routes/           # Routes TanStack Router basées sur les fichiers
├── utils/            # renderHtmlToCanvas : HTML → foreignObject SVG → canvas
├── lib/paraglide/     # Runtime i18n généré (ignoré par git)
└── tests/e2e/         # Suites de tests Playwright
```

## Comment fonctionne l'astuce du canvas

Le HTML de démonstration est enveloppé dans `<svg><foreignObject>…</foreignObject></svg>`,
encodé en URI `data:image/svg+xml`, puis chargé via une `Image`. Les navigateurs
traitent un SVG chargé via `<img>` comme une ressource raster : les balises
`<script>` intégrées ne s'exécutent donc jamais, ce qui rend le rendu de HTML
modifié par l'utilisateur sûr sans passe de nettoyage. Une fois dessiné, le
canvas est une image plate : le texte rendu n'est ni sélectionnable ni exposé
aux technologies d'assistance, seul le `aria-label` du `<canvas>` l'est.
