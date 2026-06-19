"use client";

/**
 * useSecurity — active sessions + audit log for the Security screen.
 *
 * Reads from the versioned `/api/v1/profile/sessions` and `/api/v1/audit`
 * endpoints when Supabase is configured and the visitor is authenticated;
 * otherwise returns representative demo data so the prototype still renders.
 */
import { useCallback, useEffect, useState } from "react";

const configured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export type UISession = {
  id: string;
  device: string;
  platform: string;
  location: string;
  lastActive: string;
  current: boolean;
  trusted: boolean;
};

export type UIAuditEntry = {
  id: string;
  action: string;
  detail: string;
  time: string;
  icon: string;
};

type Source = "demo" | "loading" | "remote";

const DEMO_SESSIONS: UISession[] = [
  { id: "d1", device: "iPhone 16 Pro", platform: "iOS 26", location: "Cluj-Napoca, RO", lastActive: "Active now", current: true, trusted: true },
  { id: "d2", device: "MacBook Pro", platform: "macOS Tahoe", location: "Cluj-Napoca, RO", lastActive: "2h ago", current: false, trusted: true },
  { id: "d3", device: "iPad Pro", platform: "iPadOS 26", location: "Bucharest, RO", lastActive: "3d ago", current: false, trusted: false },
];

const DEMO_AUDIT: UIAuditEntry[] = [
  { id: "a1", action: "Signed in", detail: "iPhone 16 Pro · Cluj-Napoca", time: "Active now", icon: "✅" },
  { id: "a2", action: "Automation triggered", detail: "Morning Irrigation · Orchard", time: "6h ago", icon: "⚡" },
  { id: "a3", action: "Task created", detail: "Irrigation Maintenance", time: "1d ago", icon: "✅" },
  { id: "a4", action: "Signed in", detail: "MacBook Pro · Cluj-Napoca", time: "2d ago", icon: "✅" },
  { id: "a5", action: "Property accessed", detail: "Prvio Estate data export", time: "5d ago", icon: "📋" },
];

function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  if (isNaN(then)) return "";
  const diff = Date.now() - then;
  const min = Math.floor(diff / 60000);
  if (min < 1) return "Active now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const days = Math.floor(hr / 24);
  return `${days}d ago`;
}

function auditIcon(action: string): string {
  if (action.includes("sign")) return "✅";
  if (action.startsWith("session")) return "🔐";
  if (action.startsWith("profile")) return "📝";
  if (action.startsWith("automation")) return "⚡";
  return "📋";
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function mapSession(s: any): UISession {
  return {
    id: s.id,
    device: s.device_name ?? "Unknown device",
    platform: s.platform ?? "",
    location: s.location ?? "",
    lastActive: s.is_current ? "Active now" : relativeTime(s.last_active_at),
    current: Boolean(s.is_current),
    trusted: Boolean(s.is_trusted),
  };
}

function mapAudit(e: any): UIAuditEntry {
  return {
    id: e.id,
    action: e.action,
    detail: e.detail ?? e.resource ?? "",
    time: relativeTime(e.created_at),
    icon: auditIcon(String(e.action ?? "")),
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export interface UseSecurity {
  source: Source;
  sessions: UISession[];
  auditLog: UIAuditEntry[];
  revokeSession: (id: string) => void;
  revokeOthers: () => void;
  toggleTrust: (id: string) => void;
}

export function useSecurity(): UseSecurity {
  const [source, setSource] = useState<Source>(configured ? "loading" : "demo");
  const [sessions, setSessions] = useState<UISession[]>(DEMO_SESSIONS);
  const [auditLog, setAuditLog] = useState<UIAuditEntry[]>(DEMO_AUDIT);

  useEffect(() => {
    if (!configured) return;
    let cancelled = false;
    (async () => {
      try {
        const [sRes, aRes] = await Promise.all([
          fetch("/api/v1/profile/sessions", { cache: "no-store" }),
          fetch("/api/v1/audit", { cache: "no-store" }),
        ]);
        if (!sRes.ok || !aRes.ok) {
          if (!cancelled) setSource("demo");
          return;
        }
        const sJson = await sRes.json();
        const aJson = await aRes.json();
        if (cancelled) return;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setSessions((sJson.data.sessions ?? []).map(mapSession));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setAuditLog((aJson.data.entries ?? []).map(mapAudit));
        setSource("remote");
      } catch {
        if (!cancelled) setSource("demo");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const revokeSession = useCallback((id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    if (configured) void fetch(`/api/v1/profile/sessions/${id}`, { method: "DELETE" });
  }, []);

  const revokeOthers = useCallback(() => {
    setSessions((prev) => prev.filter((s) => s.current));
    if (configured) void fetch("/api/v1/profile/sessions", { method: "DELETE" });
  }, []);

  const toggleTrust = useCallback((id: string) => {
    let next = false;
    setSessions((prev) => prev.map((s) => {
      if (s.id !== id) return s;
      next = !s.trusted;
      return { ...s, trusted: next };
    }));
    if (configured) void fetch(`/api/v1/profile/sessions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trusted: next }),
    });
  }, []);

  return { source, sessions, auditLog, revokeSession, revokeOthers, toggleTrust };
}
