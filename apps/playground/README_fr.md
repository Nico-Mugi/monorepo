# Playground

Page d'accueil centralisant tout ce qui est construit dans ce monorepo : renvoie
vers le portfolio, la vitrine du registre, le générateur de signature, et les
autres apps au fur et à mesure de leur mise en ligne, chacune avec une capture
d'écran en direct et un lien vers son code source.

[Site en ligne](https://playground.nicolas-thouvenin.dev)

## Stack technique

- **Framework** : TanStack Start (React 19, SSR sur Cloudflare Workers)
- **Routing** : TanStack Router basé sur des fichiers
- **Style** : Tailwind CSS v4 + `@repo/ui`
- **i18n** : Paraglide JS (locale de base `fr`, seconde locale `en`)
- **Tests** : Playwright E2E
- **Déploiement** : Cloudflare Workers via Wrangler

## Démarrage

Cette app fait partie du [monorepo](../../) ; lancez les commandes depuis la racine du dépôt ou depuis ce dossier.

### Initialisation (première exécution uniquement)

La sortie de Paraglide est ignorée par git et doit être générée avant le premier démarrage du serveur de dev :

```bash
pnpm exec paraglide-js compile --project ../../packages/i18n/project.inlang --outdir ./src/lib/paraglide
```

### Développement

```bash
pnpm dev --filter playground   # http://localhost:3002
```

### Build & prévisualisation

```bash
pnpm build --filter playground
pnpm preview      # sert le build de production sur le port 3002
```

### Déploiement

```bash
pnpm deploy --filter playground
```

### Tests

Les tests Playwright nécessitent le **build de production** : ne pas tester contre `pnpm dev`.

```bash
pnpm build --filter playground && pnpm preview   # dans un terminal
pnpm test --filter playground                    # dans un autre
```

## Structure du projet

```
src/
├── components/       # Nav, cartes de projet, limites d'erreur/page introuvable
├── routes/           # Routes TanStack Router basées sur des fichiers
├── lib/paraglide/     # Runtime i18n généré (ignoré par git)
└── tests/e2e/         # Suites de tests Playwright
```
