import { Logo } from "./logo";
import { Link } from "@tanstack/react-router";
import { m } from "~/lib/paraglide/messages";

export function Footer() {
  return (
    <footer className="bg-background border-t border-border/50 py-8">
      <div className="max-w-5xl mx-auto px-6 md:pb-0 pb-14 flex flex-col sm:flex-row items-center justify-between gap-3">
        <a href="#" className="h-full sm:hidden flex w-24 items-center">
          <Logo />
        </a>
        <a href="#" className="h-full sm:flex hidden w-16 items-center">
          <Logo orientation="vertical" />
        </a>

        <p className="text-muted-foreground/50 text-sm">
          © {new Date().getFullYear()} {"Nicolas Thouvenin"} -{" "}
          {"Annecy, France"}
        </p>
        <Link
          to="/cv"
          className="text-sm text-muted-foreground/70 hover:text-primary transition-colors duration-200"
        >
          {m.footer_view_cv()}
        </Link>
      </div>
    </footer>
  );
}
