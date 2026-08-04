import type { ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@repo/ui";
import registryData from "@repo/registry/registry.json";

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
};

function Home() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 text-white">
      <header className="mb-12">
        <h1 className="text-4xl font-bold">{registry.name}</h1>
        <p className="mt-2 text-white/60">
          A live showcase of every component published in this registry.
        </p>
      </header>

      {registry.items.length === 0 ? (
        <p className="text-white/60">
          No components have been published to the registry yet.
        </p>
      ) : (
        <div className="flex flex-col gap-10">
          {registry.items.map((item) => (
            <section
              key={item.name}
              className="rounded-2xl border border-white/10 p-6"
            >
              <h2 className="text-xl font-semibold">
                {item.title ?? item.name}
              </h2>
              {item.description ? (
                <p className="mt-1 text-sm text-white/60">
                  {item.description}
                </p>
              ) : null}
              <div className="mt-6">
                {demos[item.name] ? (
                  demos[item.name]()
                ) : (
                  <p className="text-sm text-white/40">
                    No live preview registered for “{item.name}” yet.
                  </p>
                )}
              </div>
              <pre className="mt-6 overflow-x-auto rounded-lg bg-white/5 px-4 py-3 text-sm text-white/80">
                <code>
                  pnpm dlx shadcn@latest add {registry.homepage}/r/{item.name}
                  .json
                </code>
              </pre>
            </section>
          ))}
        </div>
      )}
    </main>
  );
}
