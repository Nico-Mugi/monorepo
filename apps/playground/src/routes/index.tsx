import { createFileRoute } from "@tanstack/react-router";
import { Blocks, FileDown, Palette, Printer } from "lucide-react";
import { Nav } from "~/components/nav";
import { ProjectCard, type ProjectCardProps } from "~/components/project-card";
import { m } from "~/lib/paraglide/messages";
import { getLocale } from "~/lib/paraglide/runtime";
import { getAppReadme, getPackageReadme } from "~/lib/readmes";

export const Route = createFileRoute("/")({
  component: Home,
});

const GITHUB_ROOT = "https://github.com/Nico-Mugi/monorepo/tree/main";

function useApps(locale: string): ProjectCardProps[] {
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
      readme: getAppReadme("portfolio", locale),
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
      readme: getAppReadme("registry-showcase", locale),
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
      readme: getAppReadme("playground", locale),
    },
    {
      name: "Signature",
      description: m.playground_card_signature_description(),
      href: "https://signature.playground.nicolas-thouvenin.dev",
      githubHref: `${GITHUB_ROOT}/apps/signature`,
      openSource: true,
      chromeLabel: "signature.playground.nicolas-thouvenin.dev",
      screenshot: {
        src: "/screenshots/signature.png",
        alt: m.playground_card_signature_alt(),
      },
      readme: getAppReadme("signature", locale),
    },
    {
      name: "Calendar",
      description: m.playground_card_calendar_description(),
      href: "https://calendar.playground.nicolas-thouvenin.dev",
      githubHref: `${GITHUB_ROOT}/apps/calendar`,
      openSource: true,
      chromeLabel: "calendar.playground.nicolas-thouvenin.dev",
      screenshot: {
        src: "/screenshots/calendar.png",
        alt: m.playground_card_calendar_alt(),
      },
      readme: getAppReadme("calendar", locale),
    },
    {
      name: "Parlor",
      description: m.playground_card_parlor_description(),
      href: "https://parlor.playground.nicolas-thouvenin.dev",
      githubHref: "",
      openSource: false,
      chromeLabel: "parlor.playground.nicolas-thouvenin.dev",
      screenshot: {
        src: "/screenshots/parlor.png",
        alt: m.playground_card_parlor_alt(),
      },
    },
    {
      name: "Facturation",
      description: m.playground_card_facturation_description(),
      href: "https://facturation.playground.nicolas-thouvenin.dev",
      githubHref: "",
      openSource: false,
      chromeLabel: "facturation.playground.nicolas-thouvenin.dev",
      screenshot: {
        src: "/screenshots/facturation.png",
        alt: m.playground_card_facturation_alt(),
      },
    },
    {
      name: "Books",
      description: m.playground_card_books_description(),
      href: "https://books.playground.nicolas-thouvenin.dev",
      githubHref: "",
      openSource: false,
      chromeLabel: "books.playground.nicolas-thouvenin.dev",
      screenshot: {
        src: "/screenshots/books.png",
        alt: m.playground_card_books_alt(),
      },
    },
  ];
}

function usePackages(locale: string): ProjectCardProps[] {
  return [
    {
      name: "@repo/ui",
      description: m.playground_card_ui_description(),
      githubHref: `${GITHUB_ROOT}/packages/ui`,
      openSource: true,
      chromeLabel: "packages/ui",
      icon: Palette,
      readme: getPackageReadme("ui", locale),
    },
    {
      name: "@repo/registry",
      description: m.playground_card_registry_pkg_description(),
      githubHref: `${GITHUB_ROOT}/packages/registry`,
      openSource: true,
      chromeLabel: "packages/registry",
      icon: Blocks,
      readme: getPackageReadme("registry", locale),
    },
    {
      name: "react-tailwind-to-pdf",
      description: m.playground_card_pdf_description(),
      githubHref: `${GITHUB_ROOT}/packages/react-tailwind-to-pdf`,
      openSource: true,
      chromeLabel: "packages/react-tailwind-to-pdf",
      icon: FileDown,
      readme: getPackageReadme("react-tailwind-to-pdf", locale),
    },
    {
      name: "vite-plugin-print-to-pdf",
      description: m.playground_card_vite_pdf_description(),
      githubHref: `${GITHUB_ROOT}/packages/vite-print-to-pdf`,
      openSource: true,
      chromeLabel: "packages/vite-print-to-pdf",
      icon: Printer,
      readme: getPackageReadme("vite-print-to-pdf", locale),
    },
  ];
}

function Home() {
  const locale = getLocale();
  const apps = useApps(locale);
  const packages = usePackages(locale);

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
