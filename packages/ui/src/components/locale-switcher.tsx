import { cn } from "../utils/cn";

export type LocaleOption = {
  code: string;
  label: string;
};

export type LocaleSwitcherProps = {
  locales: LocaleOption[];
  activeLocale: string;
  onSelect: (code: string) => void;
  /** Consumers should pass their own translated string. */
  ariaLabel?: string;
};

export function LocaleSwitcher({
  locales,
  activeLocale,
  onSelect,
  ariaLabel = "Language",
}: LocaleSwitcherProps) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      data-slot="locale-switcher"
      className="flex items-center gap-0.5 rounded-lg border border-input p-0.5"
    >
      {locales.map(({ code, label }) => (
        <button
          key={code}
          type="button"
          aria-pressed={code === activeLocale}
          data-slot="locale-option"
          data-locale={code}
          onClick={() => onSelect(code)}
          className={cn(
            "px-2 py-1 rounded-md text-xs font-medium transition-colors duration-200",
            code === activeLocale
              ? "bg-muted text-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
