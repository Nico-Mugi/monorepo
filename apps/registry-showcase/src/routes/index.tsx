import type { ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { ChevronRightIcon } from "lucide-react";
import {
  Button,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  ColorField,
  CopyButton,
  Field,
  FieldDescription,
  FieldLabel,
  Input,
  Label,
  Separator,
  TextField,
} from "@repo/ui";
import registryData from "@repo/registry/registry.json";
import { Nav } from "~/components/nav";
import { m } from "~/lib/paraglide/messages";

export const Route = createFileRoute("/")({
  component: Home,
});

interface RegistryItem {
  name: string;
  type: string;
  title?: string;
  description?: string;
}

const registry = registryData as {
  name: string;
  homepage: string;
  items: RegistryItem[];
};

const buttonVariants = [
  "default",
  "secondary",
  "outline",
  "ghost",
  "destructive",
  "link",
] as const;

const buttonSizes = ["sm", "default", "lg"] as const;

function TextFieldDemo() {
  const form = useForm({ defaultValues: { name: "" } });
  return (
    <div className="max-w-sm">
      <form.Field
        name="name"
        validators={{
          onChange: ({ value }) =>
            value.length > 0 && value.length < 3
              ? "Must be at least 3 characters"
              : undefined,
        }}
      >
        {(field) => (
          <TextField field={field} label="Name" placeholder="Jane Doe" />
        )}
      </form.Field>
    </div>
  );
}

function ColorFieldDemo() {
  const form = useForm({ defaultValues: { accentColor: "#8faf83" } });
  return (
    <div className="max-w-sm">
      <form.Field name="accentColor">
        {(field) => <ColorField field={field} label="Accent color" />}
      </form.Field>
    </div>
  );
}

const demos: Record<string, () => ReactNode> = {
  button: () => (
    <div className="flex flex-col gap-4">
      {buttonSizes.map((size) => (
        <div key={size} className="flex flex-wrap items-center gap-3">
          {buttonVariants.map((variant) => (
            <Button key={variant} variant={variant} size={size}>
              {variant}
            </Button>
          ))}
        </div>
      ))}
    </div>
  ),
  input: () => (
    <div className="flex max-w-sm flex-col gap-3">
      <Input placeholder="Type something..." />
      <Input placeholder="Disabled" disabled />
    </div>
  ),
  label: () => (
    <div className="flex max-w-sm flex-col gap-2">
      <Label htmlFor="demo-label-input">Email</Label>
      <Input id="demo-label-input" type="email" placeholder="you@example.com" />
    </div>
  ),
  separator: () => (
    <div className="max-w-sm">
      <div className="text-sm">Section one</div>
      <Separator className="my-3" />
      <div className="text-sm">Section two</div>
      <div className="mt-3 flex h-8 items-center gap-3 text-sm">
        <span>Left</span>
        <Separator orientation="vertical" />
        <span>Right</span>
      </div>
    </div>
  ),
  field: () => (
    <div className="max-w-sm">
      <Field>
        <FieldLabel htmlFor="demo-field-input">Username</FieldLabel>
        <Input id="demo-field-input" placeholder="jane_doe" />
        <FieldDescription>Visible to other users.</FieldDescription>
      </Field>
    </div>
  ),
  "text-field": () => <TextFieldDemo />,
  "color-field": () => <ColorFieldDemo />,
  "copy-button": () => (
    <CopyButton
      text="pnpm dlx shadcn@latest add"
      label={m.registry_copy_cta()}
      copiedLabel={m.registry_copied_confirmation()}
    />
  ),
  collapsible: () => (
    <div className="max-w-sm">
      <Collapsible>
        <CollapsibleTrigger className="group/collapsible flex items-center gap-1.5 text-sm font-medium">
          <ChevronRightIcon
            size={16}
            className="transition-transform group-data-panel-open/collapsible:rotate-90"
          />
          Toggle content
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2 text-sm text-muted-foreground">
          This content is hidden until the trigger above is clicked.
        </CollapsibleContent>
      </Collapsible>
    </div>
  ),
};

function Home() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <Nav />
      <main className="mx-auto max-w-3xl px-6 pt-24 pb-16">
        <header className="mb-12">
          <h1 className="text-4xl font-bold">{registry.name}</h1>
          <p className="mt-2 text-muted-foreground">
            {m.registry_hero_description()}
          </p>
        </header>

        {registry.items.length === 0 ? (
          <p className="text-muted-foreground">{m.registry_empty_state()}</p>
        ) : (
          <div className="flex flex-col gap-10">
            {registry.items.map((item) => {
              const installCommand = `pnpm dlx shadcn@latest add ${registry.homepage}/r/${item.name}.json`;
              return (
                <section
                  key={item.name}
                  className="rounded-2xl border border-border p-6"
                >
                  <h2 className="text-xl font-semibold">
                    {item.title ?? item.name}
                  </h2>
                  {item.description ? (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  ) : null}
                  <div className="mt-6">
                    {demos[item.name] ? (
                      demos[item.name]()
                    ) : (
                      <p className="text-sm text-muted-foreground/70">
                        {m.registry_no_preview({ name: item.name })}
                      </p>
                    )}
                  </div>
                  <div className="mt-6 flex items-center justify-end">
                    <CopyButton
                      text={installCommand}
                      label={m.registry_copy_cta()}
                      copiedLabel={m.registry_copied_confirmation()}
                      size="xs"
                    />
                  </div>
                  <pre className="mt-2 overflow-x-auto rounded-lg bg-muted px-4 py-3 text-sm text-foreground/90">
                    <code>{installCommand}</code>
                  </pre>
                </section>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
