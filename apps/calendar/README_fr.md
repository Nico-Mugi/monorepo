# Calendar

Composant calendrier complet construit avec TanStack Start et shadcn/ui. Le
bloc lui-même vit dans `@repo/ui` et est publié comme élément installable du
registre shadcn via `@repo/registry` ; cette app en est la démo en direct.
Vues jour, semaine, mois, année et agenda sur un modèle de données
événements/utilisateurs partagé, avec glisser-déposer, redimensionnement,
filtrage et préférences par utilisateur.

[Site en ligne](https://calendar.playground.nicolas-thouvenin.dev)

## Fonctionnalités

- **Cinq vues** : Jour, Semaine, Mois, Année, Agenda, interchangeables depuis les onglets de l'en-tête.
- **Navigation par date** : précédent/suivant pour chaque vue (jour/semaine/mois/année), un raccourci « aujourd'hui »,
  et un badge du nombre d'événements pour la période visible.
- **Vue mois** : jusqu'à 3 événements affichés par jour, avec un dialogue de débordement « +N autres » listant
  le reste ; les événements multi-jours s'affichent sous forme d'un badge unique s'étalant sur toute la largeur
  des cellules concernées (segments premier/milieu/dernier) ; la date du jour est mise en évidence ; survoler un
  jour vide affiche un bouton en ligne « + Ajouter un événement ».
- **Vue semaine/jour** : grille horaire (00:00–23:00, granularité de clic/dépôt à la demi-heure), une bannière
  dédiée aux événements multi-jours qui s'étendent sur la période visible, et (vue jour uniquement) une barre
  latérale avec un mini sélecteur de date et un indicateur « en cours » en direct pour l'événement qui
  chevauche l'instant présent.
- **Vue année** : les 12 mois d'un coup d'œil ; les jours avec des événements affichent un point coloré (ou un
  badge « +N » au-delà de 2 événements) ; cliquer sur un jour ouvre le même dialogue de liste d'événements que
  la vue mois.
- **Vue agenda** : une liste plate et consultable (propulsée par cmdk) des événements du mois visible, groupés
  soit par date, soit par couleur (bascule dans les Réglages).
- **Détails d'événement** : cliquer sur un événement affiche son utilisateur responsable, sa date/heure de
  début et de fin, et sa description, avec des actions Modifier et Supprimer en ligne.
- **Créer/modifier des événements** : via le bouton d'en-tête, un créneau horaire en vue jour/semaine, ou une
  cellule de jour vide en vue mois (chacun préremplit la date/l'heure en conséquence) ; titre et description
  sont requis (validés par Zod).
- **Glisser-déposer** : déplacer un événement entre des jours (vue mois) ou entre des créneaux horaires (vue
  jour/semaine), y compris en le déposant directement sur un créneau déjà occupé par un autre événement.
- **Redimensionnement** : faire glisser le bord inférieur d'un bloc d'événement en vue jour/semaine pour changer son heure de fin.
- **Filtres** : par couleur et par utilisateur, chacun multi-sélection (additif : choisir une deuxième couleur
  ou un deuxième utilisateur l'ajoute à l'ensemble, ne le remplace pas) et combinés par intersection (restreindre
  par utilisateur n'affiche que les événements de cet utilisateur *au sein* du filtre couleur actif, pas à sa
  place) ; « Tous » dans le filtre utilisateur le réinitialise, tout comme « Effacer le filtre » pour les couleurs.
- **Réglages** (persistés dans `localStorage`) : style de badge (coloré vs point), format horaire 12h/24h,
  l'heure à laquelle la grille jour/semaine défile à l'ouverture (« début de journée »), et le regroupement de
  l'agenda (date vs couleur).
- **i18n** : entièrement bilingue (locale de base FR, EN), y compris les compteurs d'événements avec pluriel et
  le formatage de date localisé.

## Stack technique

- **Framework** : TanStack Start (React 19, SSR sur Cloudflare Workers)
- **Routing** : TanStack Router basé sur des fichiers
- **Composant** : le calendrier lui-même est `Calendar` depuis `@repo/ui`
  (`packages/ui/src/blocks/calendar/`), un bloc réutilisable, pas du code local à l'app. Cette app est une
  coquille légère : routing, câblage i18n, et données de démo (`src/data/`) autour de ce composant.
- **Style** : Tailwind CSS v4 + tokens de design `@repo/ui` (primitives Base UI, `@repo/ui`
  `style: "base-luma"`)
- **Formulaires** : TanStack Form + Zod (`packages/ui/src/blocks/calendar/schemas.ts`)
- **Glisser-déposer** : DnD HTML5 natif (`draggable`, `dragstart`/`dragover`/`drop`)
- **Redimensionnement** : `re-resizable`
- **Dates** : date-fns
- **i18n** : Paraglide JS (locale de base `fr`, seconde locale `en`)
- **Tests** : Playwright E2E
- **Déploiement** : Cloudflare Workers via Wrangler
- **Registre** : publié sous le nom `full-calendar` dans le `@repo/registry` partagé (voir
  [packages/registry](../../packages/registry)), pas auto-publié depuis cette app :
  installez-le dans un autre projet avec
  `npx shadcn@latest add https://registry.playground.nicolas-thouvenin.dev/r/full-calendar.json`

## Démarrage

Cette app fait partie du [monorepo](../../) ; lancez les commandes depuis la racine du dépôt ou depuis ce dossier.

### Initialisation (première exécution uniquement)

La sortie de Paraglide est ignorée par git et doit être générée avant le premier démarrage du serveur de dev :

```bash
pnpm exec paraglide-js compile --project ../../packages/i18n/project.inlang --outdir ./src/lib/paraglide
```

### Développement

```bash
pnpm dev --filter calendar   # http://localhost:3005
```

### Build & prévisualisation

```bash
pnpm build --filter calendar
pnpm preview      # sert le build de production sur le port 3005
```

### Déploiement

```bash
pnpm deploy --filter calendar
```

## Tests

60 tests Playwright de bout en bout répartis sur 11 fichiers de specs (`src/tests/e2e/calendar/`), couvrant
chaque fonctionnalité ci-dessus : les cinq vues, la navigation, la création/modification/suppression
d'événements et leur validation, les détails d'événement, les filtres couleur/utilisateur, les réglages, et le
glisser-déposer/redimensionnement. Déterministe par conception : les tests s'exécutent contre un jeu de données
fixe écrit à la main (`src/data/e2e-fixtures.ts`, activé via `?e2e=1`) plutôt que les données aléatoires vues
par les vrais visiteurs, de sorte que titres, couleurs, utilisateurs et dates sont connus à l'avance quel que
soit le jour où la suite est exécutée.

| Spec | Ce qui est couvert |
| --- | --- |
| `view-navigation.spec.ts` | Changement d'onglet, précédent/suivant du navigateur de date, bouton aujourd'hui, badge du nombre d'événements |
| `month-view.spec.ts` | Badges d'événements, plafond de 3 événements + dialogue « +N autres », segments multi-jours, mise en évidence du jour actuel, ajout depuis une cellule vide |
| `week-view.spec.ts` / `day-view.spec.ts` | Grille horaire, bannière multi-jours, « en cours », mini sélecteur de date, ajout depuis un créneau horaire |
| `year-view.spec.ts` | Indicateurs point/« +N », dialogue de liste d'événements, regroupement par date de début uniquement |
| `agenda-view.spec.ts` | Regroupement date/couleur, recherche cmdk, état vide |
| `event-crud.spec.ts` / `event-details.spec.ts` | Ajout/modification/suppression, erreurs de validation Zod, champs du dialogue de détails |
| `filters.spec.ts` | Filtre couleur (multi-sélection), filtre utilisateur (multi-sélection), « Tous »/effacer, intersection couleur+utilisateur |
| `settings.spec.ts` | Variante de badge, format horaire, position de défilement en début de journée, persistance `localStorage` |
| `dnd.spec.ts` | Glisser-déposer jour à jour en vue mois, heure à heure en vue jour, dépôt sur un créneau occupé, redimensionnement |

Les tests Playwright nécessitent le **build de production** : ne pas tester contre `pnpm dev`.

```bash
pnpm build --filter calendar && pnpm preview   # dans un terminal
pnpm test --filter calendar                    # dans un autre
```

### Problème connu : redimensionnement sur Firefox

Redimensionner le bord inférieur d'un événement (vue jour/semaine) le rétrécit au lieu de l'agrandir, mais
uniquement sur Firefox, et reproduit jusqu'à présent seulement sous automatisation Playwright ; pas encore
confirmé avec une vraie session Firefox et une souris physique. `re-resizable` calcule la nouvelle taille à
partir de `event.clientY` absolu (pas `movementX`/`Y`), donc ce n'est pas le piège habituel « Firefox WebDriver
rapporte movementY à 0 » ; la cause racine n'a pas été entièrement isolée au-delà de ce constat. Le test
correspondant (`dnd.spec.ts`) est ignoré sur Firefox avec cette note plutôt que d'affirmer un résultat supposé.
Mérite une vérification manuelle avant d'exclure une véritable incompatibilité `re-resizable` + Firefox.

## Structure du projet

L'interface du calendrier vit dans `@repo/ui`, pas dans cette app ; ce dépôt ne fait que la câbler :

```
apps/calendar/src/
├── components/               # Wrappers locaux à l'app autour de @repo/ui (Nav, Logo, NotFound, ...)
├── data/
│   ├── mocks.ts, requests.ts   # Données de démo aléatoires (vrais visiteurs)
│   └── e2e-fixtures.ts          # Données déterministes (?e2e=1, tests uniquement)
├── routes/                   # Routes TanStack Router basées sur des fichiers
├── lib/paraglide/             # Runtime i18n généré (ignoré par git)
└── tests/e2e/                 # Suites de tests Playwright

packages/ui/src/blocks/calendar/   # Le bloc calendrier réel (publié comme le Calendar de @repo/ui)
├── calendar.tsx                     # Point d'entrée : providers + en-tête + corps
├── contexts/                        # CalendarProvider (état, filtres, réglages) + DndProvider
├── header/                           # Onglets de vue, navigateur de date, filtre, sélecteur utilisateur, bouton aujourd'hui
├── views/                             # month/, week-and-day-view/, year-view/, agenda-view/
├── dialogs/                            # Ajout/modification d'événement, détails d'événement, suppression, liste d'événements
├── dnd/                                  # DraggableEvent, DroppableArea, ResizableEvent
└── settings/                              # Menu déroulant des réglages
```
