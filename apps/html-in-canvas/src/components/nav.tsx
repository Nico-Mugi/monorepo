import { LayoutGridIcon } from "lucide-react";
import { Nav as NavBase, GitHubLink, LocaleSwitcher, saveScrollPosition } from "@repo/ui";
import { Logo } from "./logo";
import { getLocale, setLocale, locales } from "~/lib/paraglide/runtime";
import { m } from "~/lib/paraglide/messages";

const PLAYGROUND_URL = "https://playground.nicolas-thouvenin.dev";

export function Nav() {
  return (
    <NavBase
      links={[]}
      logo={<Logo />}
      logoMobile={<Logo orientation="vertical" />}
      ctaLink={{
        label: m.shared_nav_access_playground(),
        shortLabel: m.shared_nav_access_playground_short(),
        href: PLAYGROUND_URL,
        icon: <LayoutGridIcon size={20} />,
        target: "_blank",
        rel: "noreferrer",
      }}
      actions={
        <>
          <GitHubLink
            href="https://github.com/Nico-Mugi/monorepo/tree/main/apps/html-in-canvas"
            ariaLabel={m.shared_github_source_aria()}
          />
          <LocaleSwitcher
            locales={locales.map((code) => ({ code, label: code.toUpperCase() }))}
            activeLocale={getLocale()}
            onSelect={(code) => {
              saveScrollPosition();
              setLocale(code as (typeof locales)[number]);
            }}
            ariaLabel={m.shared_locale_switch_aria()}
          />
        </>
      }
    />
  );
}
