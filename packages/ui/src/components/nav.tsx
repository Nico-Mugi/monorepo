import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

export type NavLink = Omit<
  React.DetailedHTMLProps<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
  >,
  "children" | "className"
> & {
  icon: React.ReactNode;
  label: string;
};

export type NavProps = {
  links: NavLink[];
  /** Primary call to action. Shown as a text button in the desktop header (md and up)
   *  and folded into the mobile tab bar (below md) alongside `links`, so `icon` is
   *  required the same way it is for `links`. */
  ctaLink?: {
    label: string;
    href: string;
    icon: ReactNode;
    target?: string;
    rel?: string;
    /** Shown instead of `label` in the mobile tab bar, where a long phrase wraps
     *  across multiple lines. Defaults to `label`. */
    shortLabel?: string;
  };
  /** Rendered in the desktop header (sm and up). */
  logo: ReactNode;
  /** Rendered in place of `logo` below the `sm` breakpoint. Defaults to `logo`. */
  logoMobile?: ReactNode;
  /** Route the logo links to. */
  logoHref?: string;
  /** Extra controls after the CTA — GitHub link, locale switcher, theme toggle, etc. */
  actions?: ReactNode;
  /** Consumers should pass their own translated string. */
  primaryNavAriaLabel?: string;
  /** Consumers should pass their own translated string. */
  mobileNavAriaLabel?: string;
};

export function Nav({
  links,
  ctaLink,
  logo,
  logoMobile = logo,
  logoHref = "/",
  actions,
  primaryNavAriaLabel = "Primary navigation",
  mobileNavAriaLabel = "Mobile navigation",
}: NavProps) {
  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50 print:hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            to={logoHref}
            className="h-full sm:flex hidden w-auto items-center"
          >
            {logo}
          </Link>
          <Link
            to={logoHref}
            className="h-full sm:hidden flex w-auto items-center"
          >
            {logoMobile}
          </Link>
          <nav
            className="hidden lg:flex items-center gap-8"
            aria-label={primaryNavAriaLabel}
          >
            {links.map(({ label, icon, ...props }, index) => (
              <a
                key={`nav-link-desktop-${index}`}
                {...props}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 flex flex-row align-middle items-center gap-2 py-2"
              >
                <div>{icon}</div>
                <div>{label}</div>
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2 sm:gap-3">
            {actions}
            {ctaLink && (
              <a
                href={ctaLink.href}
                target={ctaLink.target}
                rel={ctaLink.rel}
                className="hidden lg:inline-flex text-sm font-semibold px-4 py-1.5 rounded-lg bg-primary text-primary-foreground hover:brightness-110 transition-all duration-200"
              >
                {ctaLink.label}
              </a>
            )}
          </div>
        </div>
      </header>
      {(links.length > 0 || ctaLink) && (
        <nav
          className="flex lg:hidden fixed bottom-0 justify-around w-full z-50 bg-background/80 backdrop-blur-md border-t border-border/50 text-center py-2 print:hidden"
          aria-label={mobileNavAriaLabel}
        >
          {links.map(({ label, icon, ...props }, index) => (
            <a
              key={`nav-link-mobile-${index}`}
              {...props}
              className="w-full px-1 grow text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 flex flex-col items-center py-2"
            >
              <div>{icon}</div>
              <div className="text-[11px]">{label}</div>
            </a>
          ))}
          {ctaLink && (
            <a
              href={ctaLink.href}
              target={ctaLink.target}
              rel={ctaLink.rel}
              className="w-full px-1 grow text-sm text-primary hover:text-primary/80 transition-colors duration-200 flex flex-col items-center py-2 font-medium"
            >
              <div>{ctaLink.icon}</div>
              <div className="text-[11px]">{ctaLink.shortLabel ?? ctaLink.label}</div>
            </a>
          )}
        </nav>
      )}
    </>
  );
}
