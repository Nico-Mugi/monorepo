import { createFileRoute } from "@tanstack/react-router";
import { useForm, useStore } from "@tanstack/react-form";
import { useEffect, useRef, useState } from "react";
import { ChevronRightIcon, ShieldCheckIcon, Trash2Icon } from "lucide-react";
import {
  Button,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  CopyButton,
  Input,
} from "@repo/ui";
import { Nav } from "~/components/nav";
import { SignatureForm } from "~/components/signature-form";
import { signatureSchema, type SignatureData } from "~/lib/schema";
import { renderSignature } from "~/lib/render-signature";
import {
  useSignatureStorage,
  type SignatureHistoryEntry,
} from "~/lib/use-signature-storage";
import { m } from "~/lib/paraglide/messages";

export const Route = createFileRoute("/")({
  component: SignaturePage,
});

function SignaturePage() {
  const { draft, hydrated, saveDraft, history, saveToHistory, deleteFromHistory } =
    useSignatureStorage();

  // Loading a saved entry remounts SignatureBuilder (via `key`) with the loaded
  // values as its seed, instead of calling `form.reset()` on a live instance.
  // TanStack Form's per-field subscriptions did not reliably reflect `reset()`
  // in this version (form.state.values updated, but each field's own displayed
  // value stayed stale), so a full remount is the reliable way to load a saved
  // signature. `loadNonce` guarantees a fresh key even when loading the same
  // entry twice in a row.
  const loadNonce = useRef(0);
  const [loadedSeed, setLoadedSeed] = useState<{
    key: string;
    values: SignatureData;
  } | null>(null);

  function handleLoad(entry: SignatureHistoryEntry) {
    loadNonce.current += 1;
    setLoadedSeed({ key: `entry-${loadNonce.current}`, values: structuredClone(entry.data) });
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main className="mx-auto max-w-6xl px-6 pt-24 pb-16">
        <header className="mb-8">
          <h1 className="text-4xl font-bold">{m.signature_hero_title()}</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            {m.signature_hero_description()}
          </p>
        </header>

        <div className="mb-8 flex items-start gap-3 rounded-2xl border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
          <ShieldCheckIcon className="mt-0.5 size-5 shrink-0 text-primary" />
          <p>{m.signature_privacy_notice()}</p>
        </div>

        {hydrated ? (
          <SignatureBuilder
            key={loadedSeed?.key ?? "draft"}
            initialValues={loadedSeed?.values ?? draft}
            onDraftChange={saveDraft}
            history={history}
            onSaveToHistory={saveToHistory}
            onLoad={handleLoad}
            onDeleteFromHistory={deleteFromHistory}
          />
        ) : null}
      </main>
    </div>
  );
}

function SignatureBuilder({
  initialValues,
  onDraftChange,
  history,
  onSaveToHistory,
  onLoad,
  onDeleteFromHistory,
}: {
  initialValues: SignatureData;
  onDraftChange: (data: SignatureData) => void;
  history: SignatureHistoryEntry[];
  onSaveToHistory: (label: string, data: SignatureData) => void;
  onLoad: (entry: SignatureHistoryEntry) => void;
  onDeleteFromHistory: (id: string) => void;
}) {
  // Frozen at mount: `initialValues` must never feed back into `useForm` reactively.
  // The onChange effect below drives `initialValues` (via saveDraft) whenever the
  // user types, and this component does not remount for that case (only "Load"
  // remounts it, via the `key` in SignaturePage) — so passing the live prop
  // straight into `defaultValues` on every render would create a feedback loop.
  const [seedValues] = useState(initialValues);
  const form = useForm({
    defaultValues: seedValues,
    validators: { onChange: signatureSchema },
  });
  const values = useStore(form.store, (state) => state.values);

  useEffect(() => {
    onDraftChange(values);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values]);

  const html = renderSignature(values);
  const [copyFailed, setCopyFailed] = useState(false);
  const [historyLabel, setHistoryLabel] = useState("");

  function handleCopyResult(success: boolean) {
    if (success) {
      setCopyFailed(false);
      return;
    }
    setCopyFailed(true);
    setTimeout(() => setCopyFailed(false), 2000);
  }

  function handleSaveToHistory() {
    const label = historyLabel.trim();
    if (!label) return;
    onSaveToHistory(label, values);
    setHistoryLabel("");
  }

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
      <section>
        <h2 className="mb-4 text-sm font-semibold tracking-wide text-muted-foreground/70 uppercase">
          {m.signature_form_section_title()}
        </h2>
        <SignatureForm form={form} />
      </section>

      <section className="flex flex-col gap-8">
        <div>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-sm font-semibold tracking-wide text-muted-foreground/70 uppercase">
              {m.signature_preview_title()}
            </h2>
            <CopyButton
              text={html}
              html={html}
              label={m.signature_output_copy_styled_cta()}
              copiedLabel={m.signature_output_copied_confirmation()}
              onResult={handleCopyResult}
              variant="default"
              size="lg"
            />
          </div>
          <p className="mb-4 text-sm text-muted-foreground">{m.signature_paste_hint()}</p>
          {copyFailed ? (
            <p className="mb-4 text-sm text-destructive">
              {m.signature_output_copy_failed()}
            </p>
          ) : null}
          <div className="rounded-2xl border border-border bg-white p-6">
            <iframe
              title={m.signature_preview_title()}
              srcDoc={html}
              className="h-56 w-full border-0"
            />
          </div>
        </div>

        <Collapsible>
          <CollapsibleTrigger className="group/collapsible flex items-center gap-1.5 text-sm font-semibold tracking-wide text-muted-foreground/70 uppercase transition-colors hover:text-foreground">
            <ChevronRightIcon
              size={16}
              className="transition-transform group-data-panel-open/collapsible:rotate-90"
            />
            {m.signature_output_title()}
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="mt-4 mb-4 flex justify-end">
              <CopyButton
                text={html}
                label={m.signature_output_copy_cta()}
                copiedLabel={m.signature_output_copied_confirmation()}
                onResult={handleCopyResult}
              />
            </div>
            <pre className="max-h-64 overflow-auto rounded-2xl border border-border bg-muted/40 p-4 text-xs text-muted-foreground">
              <code>{html}</code>
            </pre>
          </CollapsibleContent>
        </Collapsible>

        <div>
          <h2 className="mb-4 text-sm font-semibold tracking-wide text-muted-foreground/70 uppercase">
            {m.signature_history_title()}
          </h2>
          <div className="flex gap-2">
            <Input
              value={historyLabel}
              placeholder={m.signature_history_name_placeholder()}
              onChange={(event) => setHistoryLabel(event.target.value)}
            />
            <Button onClick={handleSaveToHistory}>
              {m.signature_history_save_cta()}
            </Button>
          </div>
          {history.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">
              {m.signature_history_empty()}
            </p>
          ) : (
            <ul className="mt-3 flex flex-col gap-2">
              {history.map((entry) => (
                <li
                  key={entry.id}
                  className="flex items-center justify-between rounded-xl border border-border px-3 py-2 text-sm"
                >
                  <span>{entry.label}</span>
                  <div className="flex items-center gap-1">
                    <Button size="xs" variant="ghost" onClick={() => onLoad(entry)}>
                      {m.signature_history_load_cta()}
                    </Button>
                    <Button
                      size="icon-xs"
                      variant="ghost"
                      aria-label={m.signature_history_delete_cta()}
                      onClick={() => onDeleteFromHistory(entry.id)}
                    >
                      <Trash2Icon size={14} />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
