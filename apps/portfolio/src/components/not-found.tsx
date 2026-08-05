import { NotFound as NotFoundBase } from "@repo/ui";
import { m } from "~/lib/paraglide/messages";

export function NotFound({ children }: { children?: React.ReactNode }) {
  return (
    <NotFoundBase
      badge={m.shared_not_found_badge()}
      title={m.shared_not_found_title()}
      description={m.shared_not_found_description()}
      homeLabel={m.shared_not_found_home_cta()}
      backLabel={m.shared_not_found_back_cta()}
    >
      {children}
    </NotFoundBase>
  );
}
