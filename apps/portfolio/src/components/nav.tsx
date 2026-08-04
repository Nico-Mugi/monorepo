import { Logo, LogoVertical } from "./logo";
import { Link } from "@tanstack/react-router";
import { siGithub } from "simple-icons";
import { SimpleIcon } from "./custom-icons/simple-icon";
import { getLocale, setLocale } from "~/lib/paraglide/runtime";

type NavLink = Omit<
  React.DetailedHTMLProps<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
  >,
  "children" | "className"
> & {
  icon: React.ReactNode;
  label: string;
};

interface NavProps {
  links: NavLink[];
  ctaLink: {
    label: string;
    href: string;
  };
}

export function Nav({ links, ctaLink }: NavProps) {
  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 bg-neutral-950/80 backdrop-blur-md border-b border-white/5 print:hidden">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="h-full sm:flex hidden w-24 items-center">
            <Logo />
          </Link>
          <Link to="/" className="h-full sm:hidden flex w-16 items-center">
            <LogoVertical />
          </Link>
          <nav
            className="hidden md:flex items-center gap-8"
            aria-label="Primary navigation"
          >
            {links.map(({ label, icon, ...props }, index) => (
              <a
                key={`nav-link-desktop-${index}`}
                {...props}
                className="text-sm text-neutral-400 hover:text-white transition-colors duration-200 flex flex-row align-middle items-center gap-2 py-2"
              >
                <div>{icon}</div>
                <div>{label}</div>
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/Nico-Mugi"
              target="_blank"
              className="px-3 py-1.5 rounded-lg border border-neutral-700 text-neutral-400 hover:border-[#8FAF83] hover:text-white transition-all duration-200"
              aria-label="GitHub profile"
            >
              <SimpleIcon
                path={siGithub.path}
                title={siGithub.title}
                size={20}
              />
            </a>
            <button
              type="button"
              onClick={() => setLocale(getLocale() === "en" ? "fr" : "en")}
              className="text-sm font-medium px-3 py-1.5 rounded-lg border border-neutral-700 text-neutral-400 hover:border-[#8FAF83] hover:text-white transition-all duration-200"
              aria-label="Switch language"
            >
              {getLocale() === "en" ? "FR" : "EN"}
            </button>

            <Link
              to={ctaLink.href}
              className="text-sm font-medium px-3 py-1.5 rounded-lg border border-neutral-700 text-neutral-300 hover:border-[#8FAF83] hover:text-white transition-all duration-200"
            >
              {ctaLink.label}
            </Link>
          </div>
        </div>
      </header>
      <nav
        className="flex md:hidden fixed bottom-0 justify-around w-full z-50 bg-neutral-950/80 backdrop-blur-md border-b border-white/5 text-center py-2 print:hidden"
        aria-label="Mobile navigation"
      >
        {links.map(({ label, icon, ...props }, index) => (
          <a
            key={`nav-link-mobile-${index}`}
            {...props}
            className="w-full px-2 grow text-sm text-neutral-400 hover:text-white transition-colors duration-200 flex flex-col items-center py-2"
          >
            <div>{icon}</div>
            <div className="text-xs">{label}</div>
          </a>
        ))}
      </nav>
    </>
  );
}
