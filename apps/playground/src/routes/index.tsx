import { createFileRoute } from "@tanstack/react-router";
import { Blocks, FileDown, Palette, Printer } from "lucide-react";
import { Nav } from "~/components/nav";
import { ProjectCard, type ProjectCardProps } from "~/components/project-card";

export const Route = createFileRoute("/")({
  component: Home,
});

const GITHUB_ROOT = "https://github.com/Nico-Mugi/monorepo/tree/main";

const apps: ProjectCardProps[] = [
  {
    name: "Portfolio",
    description:
      "Personal portfolio and CV, localized, with a print-to-PDF résumé pipeline, built on TanStack Start and deployed to Cloudflare Workers.",
    href: "https://nicolas-thouvenin.dev",
    githubHref: `${GITHUB_ROOT}/apps/portfolio`,
    openSource: true,
    chromeLabel: "nicolas-thouvenin.dev",
    screenshot: {
      src: "/screenshots/portfolio.png",
      alt: "Screenshot of the portfolio homepage",
    },
  },
  {
    name: "Registry Showcase",
    description:
      "Live docs site for every shadcn/ui component published in @repo/registry: browse, preview, and copy the install command for each one.",
    href: "https://registry.playground.nicolas-thouvenin.dev",
    githubHref: `${GITHUB_ROOT}/apps/registry-showcase`,
    openSource: true,
    chromeLabel: "registry.playground.nicolas-thouvenin.dev",
    screenshot: {
      src: "/screenshots/registry-showcase.png",
      alt: "Screenshot of the registry showcase homepage",
    },
  },
  {
    name: "Playground",
    description:
      "This showcase site itself: apps and packages from across the monorepo, built on TanStack Start and deployed to Cloudflare Workers.",
    href: "https://playground.nicolas-thouvenin.dev",
    githubHref: `${GITHUB_ROOT}/apps/playground`,
    openSource: true,
    chromeLabel: "playground.nicolas-thouvenin.dev",
    screenshot: {
      src: "/screenshots/playground.png",
      alt: "Screenshot of the playground homepage",
    },
  },
];

const packages: ProjectCardProps[] = [
  {
    name: "@repo/ui",
    description:
      "Shared React component library and the monorepo's single design system: tokens, primitives, and layout pieces reused by every app.",
    githubHref: `${GITHUB_ROOT}/packages/ui`,
    openSource: true,
    chromeLabel: "packages/ui",
    icon: Palette,
  },
  {
    name: "@repo/registry",
    description:
      "shadcn/ui registry definitions that publish @repo/ui components as installable registry items, served live by Registry Showcase.",
    githubHref: `${GITHUB_ROOT}/packages/registry`,
    openSource: true,
    chromeLabel: "packages/registry",
    icon: Blocks,
  },
  {
    name: "react-tailwind-to-pdf",
    description:
      "Renders a React component styled with Tailwind CSS v4 to a PDF, via a Playwright-compatible browser.",
    githubHref: `${GITHUB_ROOT}/packages/react-tailwind-to-pdf`,
    openSource: true,
    chromeLabel: "packages/react-tailwind-to-pdf",
    icon: FileDown,
  },
  {
    name: "vite-plugin-print-to-pdf",
    description:
      "Vite dev-server plugin that watches route source files and re-exports pages to PDF via Playwright.",
    githubHref: `${GITHUB_ROOT}/packages/vite-print-to-pdf`,
    openSource: true,
    chromeLabel: "packages/vite-print-to-pdf",
    icon: Printer,
  },
];

function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main className="mx-auto max-w-6xl px-6 pt-24 pb-16">
        <header className="mb-14">
          <h1 className="text-4xl font-bold">Playground</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            A showcase of apps and packages built by Nicolas Thouvenin, all
            living side by side in one pnpm monorepo.
          </p>
        </header>

        <section className="mb-14">
          <h2 className="mb-5 text-sm font-semibold tracking-wide text-muted-foreground/70 uppercase">
            Apps
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {apps.map((app) => (
              <ProjectCard key={app.name} {...app} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-5 text-sm font-semibold tracking-wide text-muted-foreground/70 uppercase">
            Packages
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {packages.map((pkg) => (
              <ProjectCard key={pkg.name} {...pkg} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
