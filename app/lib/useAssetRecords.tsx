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
export type Loan = { borrower: string; contact?: string; since: string; note?: string };
export type LoanHistoryEntry = Loan & { returnedAt: string };
type Records = { maintenance: MaintRec[]; documents: DocRec[]; loan?: Loan | null; loanHistory?: LoanHistoryEntry[] };
type AllRecords = Record<string, Records>;

const EMPTY: Records = { maintenance: [], documents: [], loan: null, loanHistory: [] };

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
  const setLoan = useCallback((loan: Loan) => mutate((cur) => ({ ...cur, loan })), [mutate]);
  const clearLoan = useCallback(
    () =>
      mutate((cur) => {
        if (!cur.loan) return { ...cur, loan: null };
        // On return, archive the active loan into history (who/when).
        const entry: LoanHistoryEntry = { ...cur.loan, returnedAt: new Date().toISOString().slice(0, 10) };
        return { ...cur, loan: null, loanHistory: [entry, ...(cur.loanHistory ?? [])] };
      }),
    [mutate],
  );

  return { records, addMaintenance, toggleMaintenance, removeMaintenance, addDocument, removeDocument, setLoan, clearLoan };
}

/** Read the loan state for every asset (keyed by slug) — for list badges. */
export function useAllAssetLoans(): Record<string, Loan> {
  const [loans, setLoans] = useState<Record<string, Loan>>({});
  useEffect(() => {
    const all = readAll();
    const out: Record<string, Loan> = {};
    for (const [slug, rec] of Object.entries(all)) {
      if (rec.loan) out[slug] = rec.loan;
    }
    setLoans(out);
  }, []);
  return loans;
}
