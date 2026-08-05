import { GithubIcon } from "./github-icon";

export function GitHubLink({
  href = "https://github.com/Nico-Mugi",
  ariaLabel = "GitHub profile",
}: {
  href?: string;
  /** Consumers should pass their own translated string. */
  ariaLabel?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="px-3 py-1.5 rounded-lg border border-input text-muted-foreground hover:border-primary hover:text-foreground transition-all duration-200"
      aria-label={ariaLabel}
    >
      <GithubIcon className="size-5 shrink-0" />
    </a>
  );
}
