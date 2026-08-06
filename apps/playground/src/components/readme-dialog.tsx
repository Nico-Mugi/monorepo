import type { AnchorHTMLAttributes } from "react";
import { Markdown, type MarkdownComponents } from "@tanstack/markdown/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  cn,
} from "@repo/ui";
import { FileText } from "lucide-react";
import { m } from "~/lib/paraglide/messages";

function ReadmeLink(props: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      {...props}
      target="_blank"
      rel="noreferrer"
      className="text-primary underline underline-offset-2 hover:text-primary/80"
    />
  );
}

const readmeComponents: MarkdownComponents = {
  h1: (props) => (
    <h1 className="mt-6 text-2xl font-semibold text-foreground first:mt-0" {...props} />
  ),
  h2: (props) => (
    <h2 className="mt-6 text-xl font-semibold text-foreground first:mt-0" {...props} />
  ),
  h3: (props) => (
    <h3 className="mt-5 text-lg font-semibold text-foreground first:mt-0" {...props} />
  ),
  h4: (props) => (
    <h4 className="mt-4 text-base font-semibold text-foreground first:mt-0" {...props} />
  ),
  p: (props) => <p className="text-sm leading-relaxed text-muted-foreground" {...props} />,
  a: ReadmeLink,
  ul: (props) => (
    <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground" {...props} />
  ),
  ol: (props) => (
    <ol className="list-decimal space-y-1 pl-5 text-sm text-muted-foreground" {...props} />
  ),
  li: (props) => <li className="leading-relaxed" {...props} />,
  code: ({ className, ...props }) => (
    <code
      className={cn(
        "wrap-break-word rounded bg-muted px-1 py-0.5 font-mono text-xs text-foreground",
        className,
      )}
      {...props}
    />
  ),
  pre: ({ className, ...props }) => (
    <pre
      className={cn(
        "my-3 rounded-lg bg-muted p-3 font-mono text-xs whitespace-pre-wrap wrap-break-word text-foreground [&_code]:bg-transparent [&_code]:p-0",
        className,
      )}
      {...props}
    />
  ),
  table: (props) => (
    <div className="my-3 overflow-x-auto">
      <table className="w-full border-collapse text-sm" {...props} />
    </div>
  ),
  th: (props) => (
    <th
      className="border border-border bg-muted px-2 py-1 text-left font-medium text-foreground"
      {...props}
    />
  ),
  td: (props) => (
    <td className="border border-border px-2 py-1 text-muted-foreground" {...props} />
  ),
  blockquote: (props) => (
    <blockquote
      className="border-l-2 border-primary/40 pl-3 text-muted-foreground italic"
      {...props}
    />
  ),
  hr: (props) => <hr className="my-4 border-border" {...props} />,
};

export interface ReadmeDialogProps {
  name: string;
  readme: string;
}

export function ReadmeDialog({ name, readme }: ReadmeDialogProps) {
  return (
    <Dialog>
      <DialogTrigger
        aria-label={m.playground_card_details_aria({ name })}
        className="inline-flex items-center gap-1 rounded-lg border border-input px-3 py-1.5 text-sm font-medium text-muted-foreground transition-all hover:border-primary hover:text-foreground"
      >
        <FileText className="size-3.5" />
        {m.playground_card_details_button()}
      </DialogTrigger>
      <DialogContent className="flex max-h-[85vh] max-w-2xl flex-col overflow-hidden">
        <DialogHeader className="shrink-0">
          <DialogTitle>{m.playground_card_details_title({ name })}</DialogTitle>
        </DialogHeader>
        <div className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto pr-3">
          <Markdown components={readmeComponents}>{readme}</Markdown>
        </div>
      </DialogContent>
    </Dialog>
  );
}
