import { useCallback, useEffect, useState } from "react";
import { defaultSignatureData, type SignatureData } from "./schema";

const DRAFT_KEY = "signature:draft";
const HISTORY_KEY = "signature:history";

export type SignatureHistoryEntry = {
  id: string;
  label: string;
  savedAt: string;
  data: SignatureData;
};

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

/**
 * All state lives in the browser's localStorage, never sent to a server.
 * `hydrated` stays false during SSR/first paint so the form only mounts
 * once the real draft has been read from the browser.
 */
export function useSignatureStorage() {
  const [draft, setDraft] = useState<SignatureData>(defaultSignatureData);
  const [history, setHistory] = useState<SignatureHistoryEntry[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setDraft(readJSON(DRAFT_KEY, defaultSignatureData));
    setHistory(readJSON(HISTORY_KEY, []));
    setHydrated(true);
  }, []);

  const saveDraft = useCallback((data: SignatureData) => {
    // Clone: `data` is the form's own live values object, which TanStack Form
    // mutates in place on later changes. Storing the reference directly would
    // let this snapshot silently drift as the user keeps typing.
    const snapshot = structuredClone(data);
    setDraft(snapshot);
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify(snapshot));
  }, []);

  const saveToHistory = useCallback((label: string, data: SignatureData) => {
    setHistory((prev) => {
      const entry: SignatureHistoryEntry = {
        id: crypto.randomUUID(),
        label,
        savedAt: new Date().toISOString(),
        data: structuredClone(data),
      };
      const next = [entry, ...prev];
      window.localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const deleteFromHistory = useCallback((id: string) => {
    setHistory((prev) => {
      const next = prev.filter((entry) => entry.id !== id);
      window.localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { draft, hydrated, saveDraft, history, saveToHistory, deleteFromHistory };
}
