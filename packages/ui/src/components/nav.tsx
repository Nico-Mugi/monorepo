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
  ctaLink?: {
    label: string;
    href: string;
  };
  /** Rendered in the desktop header (sm and up). */
  logo: ReactNode;
  /** Rendered in place of `logo` below the `sm` breakpoint. Defaults to `logo`. */
  logoMobile?: ReactNode;
  /** Route the logo links to. */
  logoHref?: string;
  /** Extra controls after the CTA — GitHub link, locale switcher, theme toggle, etc. */
  actions?: ReactNode;
};

export function Nav({
  links,
  ctaLink,
  logo,
  logoMobile = logo,
  logoHref = "/",
  actions,
}: NavProps) {
  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50 print:hidden">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to={logoHref} className="h-full sm:flex hidden w-auto items-center">
            {logo}
          </Link>
          <Link to={logoHref} className="h-full sm:hidden flex w-auto items-center">
            {logoMobile}
          </Link>
          <nav
            className="hidden md:flex items-center gap-8"
            aria-label="Primary navigation"
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
          <div className="flex items-center gap-3">
            {actions}
            {ctaLink && (
              <Link
                to={ctaLink.href}
                className="text-sm font-medium px-3 py-1.5 rounded-lg border border-input text-foreground/90 hover:border-primary hover:text-foreground transition-all duration-200"
              >
                {ctaLink.label}
              </Link>
            )}
          </div>
        </div>
      </header>
      {links.length > 0 && (
        <nav
          className="flex md:hidden fixed bottom-0 justify-around w-full z-50 bg-background/80 backdrop-blur-md border-b border-border/50 text-center py-2 print:hidden"
          aria-label="Mobile navigation"
        >
          {links.map(({ label, icon, ...props }, index) => (
            <a
              key={`nav-link-mobile-${index}`}
              {...props}
              className="w-full px-2 grow text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 flex flex-col items-center py-2"
            >
              <div>{icon}</div>
              <div className="text-xs">{label}</div>
            </a>
          ))}
        </nav>
      )}
    </>
  );
}