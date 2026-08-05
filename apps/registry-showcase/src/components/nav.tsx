import { Nav as NavBase, GitHubLink } from "@repo/ui";
import { Logo } from "./logo";

export function Nav() {
  return (
    <NavBase
      links={[]}
      logo={<Logo />}
      logoMobile={<Logo orientation="vertical" />}
      actions={<GitHubLink />}
    />
  );
}
