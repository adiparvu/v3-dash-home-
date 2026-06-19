"use client";

/**
 * Smart-home client hooks (migrations 006/007): room presence, automation
 * schedules and durable notifications. Each loads from its versioned route when
 * Supabase is configured + authenticated, otherwise returns demo data so the
 * prototype keeps rendering. `source` badges which is shown.
 */
import { useEffect, useState } from "react";

const configured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);
type Source = "demo" | "loading" | "remote";

// ── Presence (room → person keys) ─────────────────────────────────────────────
const DEMO_PRESENCE: Record<string, string[]> = { living: ["alex"], kitchen: ["maria"], office: ["sofia"] };

export function usePresence(): { source: Source; byRoom: Record<string, string[]> } {
  const [source, setSource] = useState<Source>(configured ? "loading" : "demo");
  const [byRoom, setByRoom] = useState<Record<string, string[]>>(DEMO_PRESENCE);
  useEffect(() => {
    if (!configured) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/v1/twin/presence", { cache: "no-store" });
        if (!res.ok) { if (!cancelled) setSource("demo"); return; }
        const json = await res.json();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rows: any[] = json?.data?.presence ?? [];
        if (cancelled) return;
        const latest = new Map<string, { room: string; present: boolean }>();
        for (const r of rows) if (!latest.has(r.person)) latest.set(r.person, { room: r.room, present: r.present });
        const map: Record<string, string[]> = {};
        for (const [person, v] of Array.from(latest.entries())) if (v.present) (map[v.room] ??= []).push(person.toLowerCase());
        if (Object.keys(map).length) { setByRoom(map); setSource("remote"); } else setSource("demo");
      } catch { if (!cancelled) setSource("demo"); }
    })();
    return () => { cancelled = true; };
  }, []);
  return { source, byRoom };
}

// ── Automation schedules ──────────────────────────────────────────────────────
export type UISchedule = { id: string; time: string; name: string; enabled: boolean };

export function useSchedules(): { source: Source; schedules: UISchedule[] | null } {
  const [source, setSource] = useState<Source>(configured ? "loading" : "demo");
  const [schedules, setSchedules] = useState<UISchedule[] | null>(null);
  useEffect(() => {
    if (!configured) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/v1/automations/schedules", { cache: "no-store" });
        if (!res.ok) { if (!cancelled) setSource("demo"); return; }
        const json = await res.json();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rows: any[] = json?.data?.schedules ?? [];
        if (cancelled) return;
        if (!rows.length) { setSource("demo"); return; }
        setSchedules(rows.map((r) => ({ id: r.id, time: r.at_time, name: r.automation_id, enabled: r.enabled })));
        setSource("remote");
      } catch { if (!cancelled) setSource("demo"); }
    })();
    return () => { cancelled = true; };
  }, []);
  return { source, schedules };
}

// ── Notifications (durable history) ───────────────────────────────────────────
export type UINotification = { id: string; kind: string; title: string; body: string; severity: string; read: boolean };

export function useNotifications(): { source: Source; items: UINotification[] | null } {
  const [source, setSource] = useState<Source>(configured ? "loading" : "demo");
  const [items, setItems] = useState<UINotification[] | null>(null);
  useEffect(() => {
    if (!configured) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/v1/notifications", { cache: "no-store" });
        if (!res.ok) { if (!cancelled) setSource("demo"); return; }
        const json = await res.json();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rows: any[] = json?.data?.notifications ?? [];
        if (cancelled) return;
        if (!rows.length) { setSource("demo"); return; }
        setItems(rows.map((r) => ({ id: r.id, kind: r.type, title: r.title, body: r.body ?? "", severity: r.type === "alert" ? "alert" : "info", read: Boolean(r.is_read) })));
        setSource("remote");
      } catch { if (!cancelled) setSource("demo"); }
    })();
    return () => { cancelled = true; };
  }, []);
  return { source, items };
}
