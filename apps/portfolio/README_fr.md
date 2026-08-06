# Portfolio : Nicolas Thouvenin

Portfolio personnel présentant mes projets, compétences et expérience. Entièrement bilingue (FR/EN), déployé mondialement sur Cloudflare Workers.

[Site en ligne](https://nicolas-thouvenin.dev)

## Stack technique

- **Framework** : TanStack Start (React 19, SSR sur Cloudflare Workers)
- **Routing** : TanStack Router basé sur des fichiers
- **Style** : Tailwind CSS v4 + shadcn (CVA + clsx + tw-merge)
- **i18n** : Paraglide JS (locale de base `fr`, seconde locale `en`)
- **Tests** : Playwright E2E
- **Déploiement** : Cloudflare Workers via Wrangler

## Démarrage

Cette app fait partie du [monorepo](../../) ; lancez les commandes depuis la racine du dépôt ou depuis ce dossier.

### Prérequis

- Node.js 20+
- pnpm (`npm install -g pnpm`)
- Voir la [skill d'installation](../../packages/private/.claude/skills/install.md) pour la configuration complète de la machine

### Initialisation (première exécution uniquement)

La sortie de Paraglide est ignorée par git et doit être générée avant le premier démarrage du serveur de dev :

```bash
pnpm exec paraglide-js compile --project ../../packages/i18n/project.inlang --outdir ./src/lib/paraglide
```

### Développement

```bash
# Depuis la racine du dépôt (lance toutes les apps) :
pnpm dev

# Ou cette app uniquement :
pnpm dev --filter portfolio
```

### Build & prévisualisation

```bash
pnpm build
pnpm preview      # sert le build de production sur le port 3001
```

### Déploiement

```bash
pnpm deploy
```

### Tests

Les tests Playwright nécessitent le **build de production** : ne pas tester contre `pnpm dev`.

```bash
pnpm build && pnpm preview   # dans un terminal
pnpm test                    # dans un autre
pnpm test:ui                 # mode interactif
```

## Structure du projet

```
src/
├── components/
│   ├── portfolio/    # Hero, compétences, expérience, formation, contact
│   ├── cv/           # Composants de CV imprimable
│   └── shadcn/       # Primitives UI (voir aussi packages/ui)
├── routes/           # Routes TanStack Router basées sur des fichiers
├── lib/paraglide/    # Runtime i18n généré (ignoré par git)
└── tests/e2e/        # Suites de tests Playwright
messages/             # Sources de traduction fr.json / en.json
public/files/         # PDFs (CV, résumé)
```

## Contact

- [nicolas-thouvenin.dev](https://nicolas-thouvenin.dev)
- nico.thouvenin13@gmail.com
- [@Nico-Mugi](https://github.com/Nico-Mugi)
