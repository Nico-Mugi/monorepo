import { Nav as NavBase, GitHubLink, LocaleSwitcher } from "@repo/ui";
import type { NavLink } from "@repo/ui";
import { Logo } from "./logo";
import { getLocale, setLocale, locales } from "~/lib/paraglide/runtime";
import { m } from "~/lib/paraglide/messages";

interface NavProps {
  links: NavLink[];
  ctaLink: {
    label: string;
    href: string;
  };
}

export function Nav({ links, ctaLink }: NavProps) {
  return (
    <NavBase
      links={links}
      ctaLink={ctaLink}
      logo={<Logo />}
      logoMobile={<Logo orientation="vertical" />}
      actions={
        <>
          <GitHubLink ariaLabel={m.shared_github_profile_aria()} />
          <LocaleSwitcher
            locales={locales.map((code) => ({ code, label: code.toUpperCase() }))}
            activeLocale={getLocale()}
            onSelect={(code) => setLocale(code as (typeof locales)[number])}
            ariaLabel={m.shared_locale_switch_aria()}
          />
        </>
      }
    />
  );
}
