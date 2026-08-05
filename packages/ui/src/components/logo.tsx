import { cn } from "../utils/cn";

export type LogoOrientation = "horizontal" | "vertical";

/** The base brand mark — "NT.DEV". Identical across every app. */
export function LogoMark({
  orientation = "horizontal",
  className,
}: {
  orientation?: LogoOrientation;
  className?: string;
}) {
  if (orientation === "vertical") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="1.5 1.8 55.3 38.2"
        className={cn("h-[38.2px] w-auto shrink-0", className)}
      >
        <text
          x="6.333333"
          y="20"
          className="fill-foreground"
          fontFamily="Inter, sans-serif"
          fontWeight={700}
          fontSize={25}
          letterSpacing={"-0.025em"}
        >
          NT
        </text>
        <text
          y="40"
          className="fill-primary"
          fontFamily="Inter, sans-serif"
          fontWeight={700}
          fontSize={25}
          letterSpacing={"-0.025em"}
        >
          .DEV
        </text>
      </svg>
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 2.7 86.5 17.3"
      className={cn("h-[17.3px] w-auto shrink-0", className)}
    >
      <text
        y="20"
        className="fill-foreground"
        fontFamily="Inter, sans-serif"
        fontWeight={700}
        fontSize={25}
        letterSpacing={"-0.025em"}
      >
        NT
        <tspan className="fill-primary">.DEV</tspan>
      </text>
    </svg>
  );
}

export type AppLogoProps = {
  /** App name, shown in caps next to the mark — e.g. "PORTFOLIO". */
  appName: string;
  orientation?: LogoOrientation;
  className?: string;
};

/**
 * Base mark + app name. Horizontal (default): mark, pipe, name in a row —
 * for standard header slots. Vertical: stacked mark with the name centered
 * beside it, no pipe — for tight mobile slots.
 */
export function AppLogo({
  appName,
  orientation = "horizontal",
  className,
}: AppLogoProps) {
  if (orientation === "vertical") {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <LogoMark orientation="vertical" />
        <span className="hidden min-[360px]:inline text-[25px] leading-none font-bold tracking-tight text-foreground/90 whitespace-nowrap">
          {appName}
        </span>
      </div>
    );
  }

  return (
    <div className={cn("flex items-baseline gap-2.5", className)}>
      <LogoMark orientation="horizontal" />
      <span aria-hidden="true" className="h-[17.3px] w-px bg-muted-foreground" />
      <span className="text-[25px] leading-none font-bold tracking-tight text-foreground/90 whitespace-nowrap">
        {appName}
      </span>
    </div>
  );
}
