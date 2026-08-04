import { DefaultCatchBoundary as DefaultCatchBoundaryBase } from "@repo/ui";
import type { ErrorComponentProps } from "@tanstack/react-router";

export function DefaultCatchBoundary(props: ErrorComponentProps) {
  return (
    <DefaultCatchBoundaryBase {...props} showErrorDetails={import.meta.env.DEV} />
  );
}
