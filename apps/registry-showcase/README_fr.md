# Registry Showcase

Vitrine interactive et en direct des composants publiés dans `@repo/registry`,
un registre compatible shadcn généré à partir de `@repo/ui`. Chaque entrée
affiche une démo fonctionnelle accompagnée de sa commande d'installation
`shadcn add`.

[Site en ligne](https://registry.playground.nicolas-thouvenin.dev)

## Stack technique

- **Framework** : TanStack Start (React 19, SSR sur Cloudflare Workers)
- **Routing** : TanStack Router basé sur des fichiers
- **Style** : Tailwind CSS v4 + `@repo/ui`
- **Données du registre** : `@repo/registry` (`registry.json`, synchronisé depuis `@repo/ui`)
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
pnpm dev --filter registry-showcase   # http://localhost:3003
```

### Build & prévisualisation

Le build synchronise aussi `@repo/registry` depuis `@repo/ui` avant de compiler :

```bash
pnpm build --filter registry-showcase
pnpm preview      # sert le build de production sur le port 3003
```

### Déploiement

```bash
pnpm deploy --filter registry-showcase
```

### Tests

Les tests Playwright nécessitent le **build de production** : ne pas tester contre `pnpm dev`.

```bash
pnpm build --filter registry-showcase && pnpm preview   # dans un terminal
pnpm test --filter registry-showcase                    # dans un autre
```

## Structure du projet

```
src/
├── components/       # Nav, limites d'erreur/page introuvable
├── routes/           # Routes TanStack Router basées sur des fichiers : un registre de démos par composant
├── lib/paraglide/     # Runtime i18n généré (ignoré par git)
└── tests/e2e/         # Suites de tests Playwright
```
