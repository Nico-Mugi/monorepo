import { cn } from "~/lib/shadcn/utils";

interface SimpleIconProps {
  path: string;
  title: string;
  className?: string;
  size?: number;
  color?: string;
}

export function SimpleIcon({
  path,
  title,
  className,
  size = 16,
  color = "currentColor",
}: SimpleIconProps) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill={color}
      aria-label={title}
      className={cn("shrink-0", className)}
    >
      <title>{title}</title>
      <path d={path} />
    </svg>
  );
}
