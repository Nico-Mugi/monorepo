import { siGithub } from "simple-icons";

export function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d={siGithub.path} />
    </svg>
  );
}
