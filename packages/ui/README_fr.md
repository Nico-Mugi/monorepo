# @repo/ui

Bibliothèque de composants React partagée par toutes les apps de ce monorepo :
exportée depuis la source (`.tsx`), sans étape de build séparée. Les
consommateurs importent directement depuis `src/` via le bundler de chaque app.

## Installation

Déjà câblée via les workspaces pnpm : ajoutez-la au `package.json` d'une app :

```json
{ "dependencies": { "@repo/ui": "workspace:*" } }
```

## Exports

| Chemin | Ce vers quoi il pointe |
| --- | --- |
| `@repo/ui` | Export en barrel : composants, types et utilitaires réexportés depuis `src/index.ts` |
| `@repo/ui/components/*` | Modules de composants individuels, ex. `@repo/ui/components/button` |
| `@repo/ui/utils/*` | Modules d'utilitaires individuels, ex. `@repo/ui/utils/cn` |
| `@repo/ui/styles/*` | Tokens de design et CSS global, ex. `@repo/ui/styles/theme.css` |

## Contenu

- **Composants** (`src/components/`) : `Button`, `Field`/`TextField`/`ColorField`,
  `Input`, `Label`, `Separator`, `Collapsible`, `CopyButton`, `Nav`, `LocaleSwitcher`,
  `AppLogo`/`LogoMark`, `GitHubLink`, `DefaultCatchBoundary`, `NotFound`, et d'autres
- **Utilitaires** (`src/utils/`) : `cn` (fusion de classes), `seo` (helper de métadonnées `head()` de route)
- **Styles** (`src/styles/theme.css`), le design system partagé : couleurs, radius, polices,
  tokens Tailwind v4 `@theme`. Voir `.claude/skills/design-system.md` à la racine du dépôt
  avant d'ajouter de nouveaux tokens ou de styliser quoi que ce soit en dehors de ce package.

## Conventions

- Les dépendances peer (`react`, `react-dom`, `@tanstack/react-router`, `@tanstack/react-form`)
  ne sont pas embarquées ; chaque consommateur doit déjà les avoir installées.
- Les composants privilégient la composition plutôt que la configuration ; voir `Field`/`FieldLabel`/
  `FieldDescription` pour le pattern utilisé par les composants de formulaire.
- Nouveaux composants : ajoutez le fichier sous `src/components/`, exportez-le depuis
  `src/index.ts`, et (s'il doit apparaître dans la vitrine publique) enregistrez-le dans
  `packages/registry` : voir le README de ce package pour l'étape de synchronisation.

## Commandes

```bash
pnpm type-check --filter @repo/ui
```
