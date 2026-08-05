import { createFileRoute } from "@tanstack/react-router";
import { Blocks, FileDown, Palette, Printer } from "lucide-react";
import { Nav } from "~/components/nav";
import { ProjectCard, type ProjectCardProps } from "~/components/project-card";
import { m } from "~/lib/paraglide/messages";

export const Route = createFileRoute("/")({
  component: Home,
});

const GITHUB_ROOT = "https://github.com/Nico-Mugi/monorepo/tree/main";

function useApps(): ProjectCardProps[] {
  return [
    {
      name: "Portfolio",
      description: m.playground_card_portfolio_description(),
      href: "https://nicolas-thouvenin.dev",
      githubHref: `${GITHUB_ROOT}/apps/portfolio`,
      openSource: true,
      chromeLabel: "nicolas-thouvenin.dev",
      screenshot: {
        src: "/screenshots/portfolio.png",
        alt: m.playground_card_portfolio_alt(),
      },
    },
    {
      name: "Registry Showcase",
      description: m.playground_card_registry_description(),
      href: "https://registry.playground.nicolas-thouvenin.dev",
      githubHref: `${GITHUB_ROOT}/apps/registry-showcase`,
      openSource: true,
      chromeLabel: "registry.playground.nicolas-thouvenin.dev",
      screenshot: {
        src: "/screenshots/registry-showcase.png",
        alt: m.playground_card_registry_alt(),
      },
    },
    {
      name: "Playground",
      description: m.playground_card_playground_description(),
      href: "https://playground.nicolas-thouvenin.dev",
      githubHref: `${GITHUB_ROOT}/apps/playground`,
      openSource: true,
      chromeLabel: "playground.nicolas-thouvenin.dev",
      screenshot: {
        src: "/screenshots/playground.png",
        alt: m.playground_card_playground_alt(),
      },
    },
  ];
}

function usePackages(): ProjectCardProps[] {
  return [
    {
      name: "@repo/ui",
      description: m.playground_card_ui_description(),
      githubHref: `${GITHUB_ROOT}/packages/ui`,
      openSource: true,
      chromeLabel: "packages/ui",
      icon: Palette,
    },
    {
      name: "@repo/registry",
      description: m.playground_card_registry_pkg_description(),
      githubHref: `${GITHUB_ROOT}/packages/registry`,
      openSource: true,
      chromeLabel: "packages/registry",
      icon: Blocks,
    },
    {
      name: "react-tailwind-to-pdf",
      description: m.playground_card_pdf_description(),
      githubHref: `${GITHUB_ROOT}/packages/react-tailwind-to-pdf`,
      openSource: true,
      chromeLabel: "packages/react-tailwind-to-pdf",
      icon: FileDown,
    },
    {
      name: "vite-plugin-print-to-pdf",
      description: m.playground_card_vite_pdf_description(),
      githubHref: `${GITHUB_ROOT}/packages/vite-print-to-pdf`,
      openSource: true,
      chromeLabel: "packages/vite-print-to-pdf",
      icon: Printer,
    },
  ];
}

function Home() {
  const apps = useApps();
  const packages = usePackages();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main className="mx-auto max-w-6xl px-6 pt-24 pb-16">
        <header className="mb-14">
          <h1 className="text-4xl font-bold">{m.playground_hero_title()}</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            {m.playground_hero_description()}
          </p>
        </header>

        <section className="mb-14">
          <h2 className="mb-5 text-sm font-semibold tracking-wide text-muted-foreground/70 uppercase">
            {m.playground_section_apps_title()}
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {apps.map((app) => (
              <ProjectCard key={app.name} {...app} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-5 text-sm font-semibold tracking-wide text-muted-foreground/70 uppercase">
            {m.playground_section_packages_title()}
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
