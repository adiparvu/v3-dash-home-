"use client";

/**
 * customAutomations — automations created through the wizard, persisted to
 * localStorage so the prototype shows them in the list alongside the seeded
 * examples.
 */

export type CustomAutomation = {
  id: string;
  name: string;
  trigger: string;
  action: string;
  zone: string;
  active: boolean;
  icon: string;
  accentColor: string;
  lastRun: string;
  runsToday: number;
  successRate: number;
};

const KEY = "prvio-automations-custom-v1";

export function readCustomAutomations(): CustomAutomation[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as CustomAutomation[]) : [];
  } catch {
    return [];
  }
}

export function addCustomAutomation(automation: CustomAutomation): void {
  if (typeof window === "undefined") return;
  try {
    const existing = readCustomAutomations();
    window.localStorage.setItem(KEY, JSON.stringify([automation, ...existing]));
  } catch {
    /* ignore quota / serialization errors */
  }
}
