import { Nav as NavBase, GitHubLink } from "@repo/ui";
import type { NavLink } from "@repo/ui";
import { Logo } from "./logo";
import { getLocale, setLocale } from "~/lib/paraglide/runtime";

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
          <GitHubLink />
          <button
            type="button"
            onClick={() => setLocale(getLocale() === "en" ? "fr" : "en")}
            className="text-sm font-medium px-3 py-1.5 rounded-lg border border-input text-muted-foreground hover:border-primary hover:text-foreground transition-all duration-200"
            aria-label="Switch language"
          >
            {getLocale() === "en" ? "FR" : "EN"}
          </button>
        </>
      }
    />
  );
}
