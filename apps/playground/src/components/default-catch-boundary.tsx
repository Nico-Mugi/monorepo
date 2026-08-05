import { DefaultCatchBoundary as DefaultCatchBoundaryBase } from "@repo/ui";
import type { ErrorComponentProps } from "@tanstack/react-router";
import { m } from "~/lib/paraglide/messages";

export function DefaultCatchBoundary(props: ErrorComponentProps) {
  return (
    <DefaultCatchBoundaryBase
      {...props}
      badge={m.shared_error_boundary_badge()}
      title={m.shared_error_boundary_title()}
      retryLabel={m.shared_error_boundary_retry_cta()}
      homeLabel={m.shared_error_boundary_home_cta()}
      backLabel={m.shared_error_boundary_back_cta()}
      showErrorDetails={import.meta.env.DEV}
    />
  );
}
