# Signature

Générateur de signature email. Remplissez un formulaire (nom, titre,
coordonnées, photo, logo, couleur d'accent), obtenez un aperçu en direct, et
copiez la signature HTML générée directement dans votre client mail. Les
brouillons et signatures enregistrées persistent localement.

[Site en ligne](https://signature.playground.nicolas-thouvenin.dev)

## Stack technique

- **Framework** : TanStack Start (React 19, SSR sur Cloudflare Workers)
- **Routing** : TanStack Router basé sur des fichiers
- **Formulaires** : TanStack Form + schéma Zod (`src/lib/schema.ts`)
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
pnpm dev --filter signature   # http://localhost:3004
```

### Build & prévisualisation

```bash
pnpm build --filter signature
pnpm preview      # sert le build de production sur le port 3004
```

### Déploiement

```bash
pnpm deploy --filter signature
```

### Tests

Les tests Playwright nécessitent le **build de production** : ne pas tester contre `pnpm dev`.

```bash
pnpm build --filter signature && pnpm preview   # dans un terminal
pnpm test --filter signature                    # dans un autre
```

## Structure du projet

```
src/
├── components/
│   ├── signature-form.tsx   # Champs du formulaire (nom, titre, contact, photo/logo, couleur)
│   └── ...                  # Nav, limites d'erreur/page introuvable
├── routes/                  # Routes TanStack Router basées sur des fichiers
├── lib/
│   ├── schema.ts             # Schéma Zod + valeurs par défaut du formulaire
│   ├── render-signature.tsx  # Générateur du HTML de la signature
│   ├── use-signature-storage.ts  # Persistance locale des brouillons et de l'historique
│   └── paraglide/             # Runtime i18n généré (ignoré par git)
└── tests/e2e/                # Suites de tests Playwright
```
