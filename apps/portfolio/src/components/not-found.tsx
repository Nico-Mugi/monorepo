import { NotFound as NotFoundBase } from "@repo/ui";
import { m } from "~/lib/paraglide/messages";

export function NotFound({ children }: { children?: React.ReactNode }) {
  return (
    <NotFoundBase
      badge={m.not_found_badge()}
      title={m.not_found_title()}
      description={m.not_found_description()}
      homeLabel={m.not_found_home_cta()}
      backLabel={m.not_found_back_cta()}
    >
      {children}
    </NotFoundBase>
  );
}
