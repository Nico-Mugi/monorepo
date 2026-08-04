import { Logo, LogoVertical } from "./logo";
import { Link } from "@tanstack/react-router";
import { m } from "~/lib/paraglide/messages";

export function Footer() {
  return (
    <footer className="bg-neutral-950 border-t border-neutral-800/50 py-8">
      <div className="max-w-5xl mx-auto px-6 md:pb-0 pb-14 flex flex-col sm:flex-row items-center justify-between gap-3">
        <a href="#" className="h-full sm:hidden flex w-24 items-center">
          <Logo />
        </a>
        <a href="#" className="h-full sm:flex hidden w-16 items-center">
          <LogoVertical />
        </a>

        <p className="text-neutral-600 text-sm">
          © {new Date().getFullYear()} {"Nicolas Thouvenin"} -{" "}
          {"Annecy, France"}
        </p>
        <Link
          to="/cv"
          className="text-sm text-neutral-500 hover:text-[#8FAF83] transition-colors duration-200"
        >
          {m.footer_view_cv()}
        </Link>
      </div>
    </footer>
  );
}
