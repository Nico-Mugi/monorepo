---
description: Add, update, or rename a Paraglide i18n message key across both locale files.
  Invoked whenever new UI text is added, existing strings are modified, or a key is renamed.
tools:
  - Read
  - Edit
  - Write
---

When adding or modifying translatable text in this project, follow this procedure exactly.

## Rules

**Always update both locale files together.** The two source-of-truth files are:
- `messages/fr.json` — base locale (required)
- `messages/en.json` — second locale (required)

Editing only one file will cause inlang to warn and TypeScript types to be inconsistent.

## Naming convention

`section_subsection_description` — all lowercase, underscores, hierarchical depth as needed.

Look at existing keys for the right prefix:
- UI section labels: `nav_`, `hero_`, `sections_`, `contact_`, `footer_`
- CV page content: `cv_`, `cv_skill_`, `cv_sidebar_`
- Data entries: `experience_N_`, `education_N_`, `language_N_`
- Skill groups: `skill_group_`, `pm_skill_`

## Rich text

For inline bold, use the `{#b}...{/b}` syntax in the message value:
```json
"experience_1_sub_1_bullet_1": "{#b}Architected and developed{/b} a full-stack platform"
```
Then render with the `<BoldMessage>` component (`src/components/paraglide/bold-message.tsx`),
not raw `m.key()`.

## Using the key in code

Import from the generated messages module:
```ts
import { m } from "~/lib/paraglide/messages";
// then:
m.contact_label_email()
```

TypeScript won't see a newly added key until `paraglide-js compile` runs.
In dev mode the Vite plugin handles this automatically on save. If the key
is still unrecognised after saving, restart the dev server.

## Checklist

- [ ] Key added to `messages/fr.json`
- [ ] Same key added to `messages/en.json` with the translated value
- [ ] Key name follows `section_subsection_description` convention
- [ ] If rich text: used `{#b}...{/b}` syntax and `<BoldMessage>` in JSX
- [ ] Key consumed via `m.key_name()` — no hardcoded strings in components
