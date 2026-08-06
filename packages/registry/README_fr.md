# @repo/registry

Registre de composants compatible shadcn, généré à partir de `@repo/ui`.
Permet à n'importe qui d'exécuter `npx shadcn add <url>/r/<component>.json`
pour récupérer le code source d'un composant directement dans son propre
projet, le même principe que le registre shadcn/ui lui-même.

`@repo/ui` est la source de vérité ; ce package ne modifie jamais le code des
composants à la main, il ne fait que le reconditionner pour la distribution
externe. Servi en direct par l'app [registry-showcase](../../apps/registry-showcase).

## Fonctionnement

1. `registry.json` déclare chaque élément publié (nom, type, chemins des fichiers source).
2. `pnpm sync` (`scripts/sync-from-ui.mjs`) lit ces fichiers source directement depuis
   `packages/ui/src/components/`, réécrit les imports internes au monorepo vers les
   alias standard de shadcn attendus par les consommateurs externes (ex. `../utils/cn` →
   `@/lib/utils`), et écrit le résultat dans `registry/`, car `shadcn build` intègre
   le contenu des fichiers tel quel et ne lit pas en dehors de `packages/registry`.
3. `pnpm build` lance la synchronisation, puis `shadcn build` compile `registry/` en
   fichiers JSON statiques servis sous `public/r/`.

`registry/` et `public/` sont tous deux ignorés par git : sortie générée, reconstruite à la demande.

## Commandes

```bash
pnpm sync --filter @repo/registry    # régénère registry/*.tsx à partir de @repo/ui
pnpm build --filter @repo/registry   # sync + compile vers public/r/*.json
pnpm clean --filter @repo/registry   # supprime public/ et registry/ générés
```

## Exports

| Chemin | Ce vers quoi il pointe |
| --- | --- |
| `@repo/registry/registry.json` | Le manifeste du registre (noms, types, listes de fichiers des éléments) |

## Ajouter un nouvel élément

1. Ajoutez d'abord le composant à `@repo/ui` (voir le README de ce package).
2. Ajoutez une entrée dans `registry.json` pointant vers le(s) fichier(s) du composant.
3. Lancez `pnpm sync` et vérifiez le fichier généré sous `registry/`.
4. Ajoutez une route de démo dans `apps/registry-showcase` s'il doit être mis en vitrine en direct.
