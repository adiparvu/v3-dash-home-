"use client";

/**
 * scanContext — one-shot hand-off of a scanned asset's context between the QR
 * scan-result screen and the Tasks / Diagnostics screens. Stored in
 * sessionStorage and consumed (cleared) on read so it only prefills once.
 */
export type ScanContext = {
  assetName: string;
  location: string;
  assetId: string;
};

const KEY = "prvio-scan-context-v1";

export function setScanContext(ctx: ScanContext): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(ctx));
  } catch {
    /* ignore */
  }
}

/** Read and clear the pending scan context (one-shot). */
export function takeScanContext(): ScanContext | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(KEY);
    if (!raw) return null;
    window.sessionStorage.removeItem(KEY);
    return JSON.parse(raw) as ScanContext;
  } catch {
    return null;
  }
}
