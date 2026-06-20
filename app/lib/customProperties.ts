"use client";

/**
 * customProperties — locally-added properties for the prototype.
 *
 * When Supabase is not configured we persist properties created from the
 * "Add Property" form to localStorage so they survive reloads and show up in
 * the portfolio alongside the demo estate.
 */
import type { UIProperty } from "./useProperties";

const KEY = "prvio-properties-custom-v1";

export function readCustomProperties(): UIProperty[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as UIProperty[]) : [];
  } catch {
    return [];
  }
}

export function addCustomProperty(property: UIProperty): void {
  if (typeof window === "undefined") return;
  try {
    const existing = readCustomProperties();
    window.localStorage.setItem(KEY, JSON.stringify([property, ...existing]));
  } catch {
    /* ignore quota / serialization errors */
  }
}

export function slugifyProperty(name: string): string {
  const base = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base || `property-${Date.now()}`;
}
