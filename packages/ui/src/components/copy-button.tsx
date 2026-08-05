import { useState, type ComponentProps } from "react";
import { CheckIcon, CopyIcon } from "lucide-react";

import { Button } from "./button";

export type CopyButtonProps = {
  /** The text copied to the clipboard when clicked. */
  text: string;
  /** If provided, copies this as rich `text/html` (with `text` as the `text/plain` fallback) instead of plain text. */
  html?: string;
  /** Consumers should pass their own translated string. */
  label: string;
  /** Consumers should pass their own translated string. */
  copiedLabel: string;
  /** Called after a copy attempt, `success` is false if the clipboard write was rejected. */
  onResult?: (success: boolean) => void;
  /** How long the copied state is shown before reverting, in ms. */
  resetAfterMs?: number;
} & Omit<ComponentProps<typeof Button>, "onClick" | "children">;

export function CopyButton({
  text,
  html,
  label,
  copiedLabel,
  onResult,
  resetAfterMs = 2000,
  variant = "outline",
  size = "sm",
  ...props
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleClick() {
    try {
      if (html) {
        await navigator.clipboard.write([
          new ClipboardItem({
            "text/html": new Blob([html], { type: "text/html" }),
            "text/plain": new Blob([text], { type: "text/plain" }),
          }),
        ]);
      } else {
        await navigator.clipboard.writeText(text);
      }
      setCopied(true);
      onResult?.(true);
      setTimeout(() => setCopied(false), resetAfterMs);
    } catch {
      onResult?.(false);
    }
  }

  return (
    <Button variant={variant} size={size} onClick={handleClick} {...props}>
      {copied ? <CheckIcon size={16} /> : <CopyIcon size={16} />}
      {copied ? copiedLabel : label}
    </Button>
  );
}
