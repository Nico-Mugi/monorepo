import {
  Link,
  rootRouteId,
  useMatch,
  useRouter,
} from "@tanstack/react-router";
import type { ErrorComponentProps } from "@tanstack/react-router";
import { TriangleAlertIcon } from "lucide-react";

export type DefaultCatchBoundaryProps = ErrorComponentProps & {
  badge?: string;
  title?: string;
  retryLabel?: string;
  homeLabel?: string;
  backLabel?: string;
  /** Show the raw error message. Pass `import.meta.env.DEV` from the consuming app. */
  showErrorDetails?: boolean;
};

export function DefaultCatchBoundary({
  error,
  badge = "Error",
  title = "Something went wrong",
  retryLabel = "Try again",
  homeLabel = "Back to home",
  backLabel = "Previous page",
  showErrorDetails = false,
}: DefaultCatchBoundaryProps) {
  const router = useRouter();
  const isRoot = useMatch({
    strict: false,
    select: (state) => state.id === rootRouteId,
  });

  console.error("DefaultCatchBoundary Error:", error);

  return (
    <div className="relative min-h-screen flex items-center bg-background overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-destructive/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-5xl mx-auto px-6 py-24 w-full">
        <div className="max-w-lg mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-destructive/10 border border-destructive/25 text-destructive text-xs font-medium mb-6">
            <TriangleAlertIcon size={13} />
            {badge}
          </div>

          <p className="text-lg font-medium text-foreground mb-8">{title}</p>

          {showErrorDetails && (
            <div className="text-destructive/90 leading-relaxed mb-8 text-sm font-mono bg-card border border-border rounded-2xl p-4 text-left overflow-auto">
              {error.message}
            </div>
          )}

          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => {
                router.invalidate();
              }}
              className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:brightness-110 transition-all duration-200"
            >
              {retryLabel}
            </button>

            {isRoot ? (
              <Link
                to="/"
                className="px-6 py-2.5 rounded-lg border border-input text-foreground/90 text-sm font-medium hover:border-muted-foreground hover:text-foreground transition-all duration-200"
              >
                {homeLabel}
              </Link>
            ) : (
              <Link
                to="/"
                className="px-6 py-2.5 rounded-lg border border-input text-foreground/90 text-sm font-medium hover:border-muted-foreground hover:text-foreground transition-all duration-200"
                onClick={(e) => {
                  e.preventDefault();
                  window.history.back();
                }}
              >
                {backLabel}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
