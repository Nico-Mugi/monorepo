import type { ComponentType, SVGProps } from "react";
import { ArrowUpRight, Lock } from "lucide-react";
import { cn, GithubIcon } from "@repo/ui";
import { m } from "~/lib/paraglide/messages";
import { ReadmeDialog } from "~/components/readme-dialog";

export interface ProjectCardProps {
  name: string;
  description: string;
  githubHref: string;
  openSource: boolean;
  chromeLabel: string;
  href?: string;
  screenshot?: { src: string; alt: string };
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  readme?: string;
  className?: string;
}

export function ProjectCard({
  name,
  description,
  githubHref,
  openSource,
  chromeLabel,
  href,
  screenshot,
  icon: Icon,
  readme,
  className,
}: ProjectCardProps) {
  return (
    <article
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-primary/30",
        className,
      )}
    >
      <div className="border-b border-border">
        <div className="flex items-center gap-1.5 border-b border-border px-3 py-2">
          <span className="size-2.5 rounded-full bg-muted-foreground/20" />
          <span className="size-2.5 rounded-full bg-muted-foreground/20" />
          <span className="size-2.5 rounded-full bg-muted-foreground/20" />
          <span className="ml-2 truncate font-mono text-xs text-muted-foreground/70">
            {chromeLabel}
          </span>
        </div>
        <div
          className={cn(
            "w-full overflow-hidden bg-muted",
            screenshot ? "aspect-video" : "aspect-[3/1]",
          )}
        >
          {screenshot ? (
            <img
              src={screenshot.src}
              alt={screenshot.alt}
              loading="lazy"
              className="size-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex size-full items-center justify-center bg-gradient-to-br from-primary/15 via-card to-background">
              {Icon ? (
                <div className="flex size-10 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold text-foreground">{name}</h3>
          <span
            className={cn(
              "inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium",
              openSource
                ? "border-primary/20 bg-primary/10 text-primary"
                : "border-border bg-secondary text-secondary-foreground",
            )}
          >
            {openSource ? (
              <GithubIcon className="size-3" />
            ) : (
              <Lock className="size-3" />
            )}
            {openSource
              ? m.playground_card_open_source_badge()
              : m.playground_card_private_badge()}
          </span>
        </div>

        <p className="flex-1 text-sm text-muted-foreground">{description}</p>

        <div className="flex items-center gap-2 pt-1">
          {href ? (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded-lg border border-input px-3 py-1.5 text-sm font-medium text-foreground transition-all hover:border-primary hover:text-primary"
            >
              {m.playground_card_visit_link()}
              <ArrowUpRight className="size-3.5" />
            </a>
          ) : null}
          {openSource ? (
            <a
              href={githubHref}
              target="_blank"
              rel="noreferrer"
              aria-label={m.playground_card_github_aria({ name })}
              className="inline-flex items-center gap-1 rounded-lg border border-input px-3 py-1.5 text-sm font-medium text-muted-foreground transition-all hover:border-primary hover:text-foreground"
            >
              <GithubIcon className="size-3.5" />
              {m.playground_card_source_link()}
            </a>
          ) : null}
          {readme ? <ReadmeDialog name={name} readme={readme} /> : null}
        </div>
      </div>
    </article>
  );
}
