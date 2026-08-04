import { Link } from "@tanstack/react-router";
import { CompassIcon } from "lucide-react";
import type { ReactNode } from "react";

export type NotFoundProps = {
  badge?: string;
  title?: string;
  description?: string;
  homeLabel?: string;
  backLabel?: string;
  children?: ReactNode;
};

export function NotFound({
  badge = "404 error",
  title = "Page not found",
  description = "The page you are looking for doesn't exist or has been moved.",
  homeLabel = "Back to home",
  backLabel = "Previous page",
  children,
}: NotFoundProps) {
  return (
    <div className="relative min-h-screen flex items-center bg-background overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-primary/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-5xl mx-auto px-6 py-24 w-full">
        <div className="max-w-lg mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-medium mb-6">
            <CompassIcon size={13} />
            {badge}
          </div>

          <h1 className="text-7xl md:text-8xl font-bold text-foreground tracking-tight leading-none mb-4">
            4<span className="text-muted-foreground">0</span>4
          </h1>

          <p className="text-lg font-medium text-foreground mb-2">{title}</p>

          <div className="text-muted-foreground leading-relaxed mb-8">
            {children || <p>{description}</p>}
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              to="/"
              className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:brightness-110 transition-all duration-200"
            >
              {homeLabel}
            </Link>

            <button
              onClick={() => window.history.back()}
              className="px-6 py-2.5 rounded-lg border border-input text-foreground/90 text-sm font-medium hover:border-muted-foreground hover:text-foreground transition-all duration-200"
            >
              {backLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
