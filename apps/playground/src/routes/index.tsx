import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
});

interface AppLink {
  name: string;
  description: string;
  url: string;
}

const apps: AppLink[] = [
  {
    name: "Portfolio",
    description: "Personal portfolio and CV — nicolas-thouvenin.dev",
    url: "https://nicolas-thouvenin.dev",
  },
  {
    name: "Registry",
    description:
      "Live showcase of every component published in the @repo/registry shadcn registry",
    url: "https://registry.playground.nicolas-thouvenin.dev",
  },
];

function Home() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 text-white">
      <header className="mb-12">
        <h1 className="text-4xl font-bold">Playground</h1>
        <p className="mt-2 text-white/60">
          A showcase of experiments and side projects by Nicolas Thouvenin.
        </p>
      </header>

      <div className="flex flex-col gap-4">
        {apps.map((app) => (
          <a
            key={app.name}
            href={app.url}
            target="_blank"
            rel="noreferrer"
            className="group rounded-2xl border border-white/10 p-6 transition-colors hover:border-white/30 hover:bg-white/5"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">{app.name}</h2>
              <span className="text-white/40 transition-transform group-hover:translate-x-1 group-hover:text-white/70">
                →
              </span>
            </div>
            <p className="mt-1 text-sm text-white/60">{app.description}</p>
          </a>
        ))}
      </div>
    </main>
  );
}