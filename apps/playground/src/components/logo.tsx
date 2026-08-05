import { AppLogo } from "@repo/ui";
import type { LogoOrientation } from "@repo/ui";

export function Logo({ orientation }: { orientation?: LogoOrientation }) {
  return <AppLogo appName="PLAYGROUND" orientation={orientation} />;
}
