"use client";

/**
 * Per-asset maintenance + document records, persisted in localStorage keyed by
 * the asset slug. Lets the inventory detail page actually schedule maintenance
 * and attach documents (prototype storage; documents keep a data URL when small
 * enough so Download works).
 */
import { useCallback, useEffect, useState } from "react";

const KEY = "prvio-asset-records-v1";
const MAX_DATAURL = 1_500_000; // ~1.5MB cap before we store metadata only

export type MaintRec = { id: string; title: string; date: string; done: boolean };
export type DocRec = { id: string; name: string; size: string; dataUrl?: string };
type Records = { maintenance: MaintRec[]; documents: DocRec[] };
type AllRecords = Record<string, Records>;

const EMPTY: Records = { maintenance: [], documents: [] };

function readAll(): AllRecords {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}") as AllRecords;
  } catch {
    return {};
  }
}

function writeAll(all: AllRecords) {
  try {
    localStorage.setItem(KEY, JSON.stringify(all));
  } catch {
    /* quota exceeded — ignore */
  }
}

function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function useAssetRecords(slug: string) {
  const [records, setRecords] = useState<Records>(EMPTY);

  useEffect(() => {
    setRecords(readAll()[slug] ?? EMPTY);
  }, [slug]);

  const mutate = useCallback(
    (fn: (cur: Records) => Records) => {
      const all = readAll();
      const next = fn(all[slug] ?? EMPTY);
      all[slug] = next;
      writeAll(all);
      setRecords(next);
    },
    [slug],
  );

  const addMaintenance = useCallback(
    (title: string, date: string) =>
      mutate((cur) => ({ ...cur, maintenance: [{ id: uid(), title, date, done: false }, ...cur.maintenance] })),
    [mutate],
  );
  const toggleMaintenance = useCallback(
    (id: string) =>
      mutate((cur) => ({ ...cur, maintenance: cur.maintenance.map((m) => (m.id === id ? { ...m, done: !m.done } : m)) })),
    [mutate],
  );
  const removeMaintenance = useCallback(
    (id: string) => mutate((cur) => ({ ...cur, maintenance: cur.maintenance.filter((m) => m.id !== id) })),
    [mutate],
  );
  const addDocument = useCallback(
    (name: string, size: string, dataUrl?: string) =>
      mutate((cur) => ({
        ...cur,
        documents: [{ id: uid(), name, size, dataUrl: dataUrl && dataUrl.length < MAX_DATAURL ? dataUrl : undefined }, ...cur.documents],
      })),
    [mutate],
  );
  const removeDocument = useCallback(
    (id: string) => mutate((cur) => ({ ...cur, documents: cur.documents.filter((d) => d.id !== id) })),
    [mutate],
  );

  return { records, addMaintenance, toggleMaintenance, removeMaintenance, addDocument, removeDocument };
}
