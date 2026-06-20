"use client";

import { useState, useEffect } from "react";
import StatusBar from "../components/layout/StatusBar";
import BottomNav from "../components/layout/BottomNav";
import { useEnergyLive } from "../lib/twin/energyLive";
import { useStore } from "../lib/store";
import { deriveAlerts } from "../lib/twin/alerts";
import { useNotifications } from "../lib/useSmartHome";
import { usePush } from "../lib/usePush";
import { useT } from "../lib/i18n";

const SEV_COLOR: Record<string, string> = { alert: "#F97316", warn: "#F59E0B", info: "#22D3EE", ok: "#4ADE80" };
const KIND_ICON: Record<string, string> = { alert: "⚠️", task: "✅", automation: "⚡", system: "🌿", security: "🔒", maintenance: "🔧" };

const NOTIF_STATE_KEY = "prvio-notif-state-v1";

const notifications = [
  {
    id: 1, type: "alert", icon: "⚠️", title: "Greenhouse CO₂ High",
    desc: "CO₂ level reached 850 ppm — above optimal range of 800 ppm", time: "5m ago",
    color: "#F97316", read: false,
  },
  {
    id: 2, type: "task", icon: "✅", title: "Task Due Today",
    desc: "Irrigation System Maintenance is due today", time: "1h ago",
    color: "#F59E0B", read: false,
  },
  {
    id: 3, type: "automation", icon: "⚡", title: "Automation Ran",
    desc: "Morning Irrigation completed successfully — Orchard", time: "6h ago",
    color: "#4ADE80", read: false,
  },
  {
    id: 4, type: "system", icon: "🌿", title: "Forest Health Improved",
    desc: "Health score increased from 89 to 91 after sensor update", time: "1d ago",
    color: "#4ADE80", read: true,
  },
  {
    id: 5, type: "security", icon: "🔒", title: "New Sign-in Detected",
    desc: "iPad Pro signed in from Bucharest, RO", time: "3d ago",
    color: "#7C3AED", read: true,
  },
  {
    id: 6, type: "maintenance", icon: "🔧", title: "Maintenance Reminder",
    desc: "Lake pump scheduled maintenance in 5 days", time: "5d ago",
    color: "#22D3EE", read: true,
  },
];

export default function NotificationsPage() {
  const t = useT();
  const [readIds, setReadIds] = useState<number[]>([]);
  const [dismissedIds, setDismissedIds] = useState<number[]>([]);
  const [mounted, setMounted] = useState(false);
  const { s, carPct, source } = useEnergyLive();
  const { energy } = useStore();
  const liveAlerts = deriveAlerts(s, carPct, { backupReserve: energy.backupReserve, offGrid: energy.offGrid, stormWatch: energy.stormWatch });
  const remoteNotifs = useNotifications();
  const push = usePush();
  const pushAvailable = push.status !== "unsupported" && push.status !== "unconfigured";

  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem(NOTIF_STATE_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        if (Array.isArray(s.read)) setReadIds(s.read);
        if (Array.isArray(s.dismissed)) setDismissedIds(s.dismissed);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(NOTIF_STATE_KEY, JSON.stringify({ read: readIds, dismissed: dismissedIds }));
    } catch {
      /* ignore */
    }
  }, [readIds, dismissedIds, mounted]);

  const items = notifications
    .filter((n) => !dismissedIds.includes(n.id))
    .map((n) => ({ ...n, read: n.read || readIds.includes(n.id) }));

  const unreadCount = items.filter((n) => !n.read).length;

  const markRead = (id: number) => setReadIds((r) => (r.includes(id) ? r : [...r, id]));
  const markAllRead = () => setReadIds(notifications.map((n) => n.id));
  const dismiss = (id: number) => setDismissedIds((d) => (d.includes(id) ? d : [...d, id]));
  const clearAll = () => setDismissedIds(notifications.map((n) => n.id));

  return (
    <div className="min-h-screen pb-28" style={{ color: "var(--text-1)" }}>
      <StatusBar />

      <div className="px-5 pt-1 pb-3 flex items-center justify-between">
        <div>
          <h1 className="font-bold text-2xl" style={{ color: "var(--text-1)" }}>{t("page.notifications")}</h1>
          {unreadCount > 0 && <p className="text-text-secondary text-xs">{unreadCount} {t("notif.unread")}</p>}
        </div>
        <div className="flex items-center gap-3">
          {mounted && pushAvailable && (
            <button
              onClick={() => (push.subscribed ? push.unsubscribe() : push.subscribe())}
              disabled={push.busy}
              className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full"
              style={{
                background: push.subscribed ? "rgba(74,222,128,0.15)" : "var(--glass-bg)",
                border: `1px solid ${push.subscribed ? "rgba(74,222,128,0.35)" : "var(--glass-border)"}`,
                color: push.subscribed ? "#4ADE80" : "var(--text-2)",
                opacity: push.busy ? 0.6 : 1,
              }}
            >
              <span>{push.subscribed ? "🔔" : "🔕"}</span>
              {push.busy ? "…" : push.subscribed ? t("notif.pushOn") : push.status === "denied" ? t("notif.blocked") : t("notif.enablePush")}
            </button>
          )}
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="text-accent-green text-xs font-medium">{t("notif.markAllRead")}</button>
          )}
          {items.length > 0 && (
            <button onClick={clearAll} className="text-xs font-medium" style={{ color: "var(--text-2)" }}>{t("home.clearAll")}</button>
          )}
        </div>
      </div>

      {mounted && liveAlerts.length > 0 && (
        <div className="px-4 mb-3">
          <div className="flex items-center gap-2 mb-2 px-1">
            <p className="text-text-secondary text-xs font-medium uppercase tracking-wide">{t("notif.liveAlerts")}</p>
            <span className="flex items-center gap-1 text-[10px] font-semibold" style={{ color: source === "live" ? "#4ADE80" : "#9CA3AF" }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse-glow" style={{ background: source === "live" ? "#4ADE80" : "#9CA3AF" }} />
              {source === "live" ? t("notif.live") : t("notif.simulated")}
            </span>
          </div>
          <div className="space-y-2">
            {liveAlerts.map((a) => (
              <div key={a.id} className="w-full rounded-2xl p-3.5 flex items-start gap-3" style={{ background: `${a.color}10`, border: `1px solid ${a.color}30` }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0 mt-0.5" style={{ background: `${a.color}1f`, border: `1px solid ${a.color}33` }}>{a.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-tight" style={{ color: "var(--text-1)" }}>{a.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-2)" }}>{a.desc}</p>
                </div>
                <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0" style={{ background: `${a.color}22`, color: a.color }}>{t("common.now")}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {mounted && remoteNotifs.items && remoteNotifs.items.length > 0 && (
        <div className="px-4 mb-3">
          <div className="flex items-center gap-2 mb-2 px-1">
            <p className="text-text-secondary text-xs font-medium uppercase tracking-wide">{t("notif.historySynced")}</p>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: "rgba(74,222,128,0.15)", color: "#4ADE80" }}>{t("common.synced")}</span>
          </div>
          <div className="space-y-2">
            {remoteNotifs.items.map((n) => (
              <div key={n.id} className="w-full rounded-2xl p-3.5 flex items-start gap-3 liquid-glass" style={{ opacity: n.read ? 0.7 : 1 }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0 mt-0.5" style={{ background: `${SEV_COLOR[n.severity] ?? "#22D3EE"}15`, border: `1px solid ${SEV_COLOR[n.severity] ?? "#22D3EE"}25` }}>{KIND_ICON[n.kind] ?? "🔔"}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-tight" style={{ color: "var(--text-1)" }}>{n.title}</p>
                  {n.body && <p className="text-xs mt-0.5" style={{ color: "var(--text-2)" }}>{n.body}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-8 text-center mt-32">
          <span className="text-5xl mb-4">🔔</span>
          <p className="text-base font-semibold mb-1" style={{ color: "var(--text-1)" }}>{t("notif.allCaughtUp")}</p>
          <p className="text-sm" style={{ color: "var(--text-2)" }}>{t("notif.noNew")}</p>
        </div>
      ) : (
        <div className="px-4 space-y-2">
          {items.map((notif) => (
            <div
              key={notif.id}
              className="w-full rounded-2xl p-3.5 flex items-start gap-3 liquid-glass"
              style={{ opacity: notif.read ? 0.72 : 1 }}
            >
              <button onClick={() => markRead(notif.id)} className="flex items-start gap-3 flex-1 min-w-0 text-left">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0 mt-0.5"
                  style={{ background: `${notif.color}15`, border: `1px solid ${notif.color}25` }}
                >
                  {notif.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium leading-tight" style={{ color: notif.read ? "var(--text-2)" : "var(--text-1)" }}>
                      {notif.title}
                    </p>
                    {!notif.read && <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: notif.color }} />}
                  </div>
                  <p className="text-text-secondary text-xs mt-0.5 leading-snug">{notif.desc}</p>
                  <span className="text-text-tertiary text-[10px]">{notif.time}</span>
                </div>
              </button>
              <button onClick={() => dismiss(notif.id)} aria-label="Dismiss" className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 active:scale-90 transition-transform" style={{ color: "var(--text-3)" }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" /></svg>
              </button>
            </div>
          ))}
        </div>
      )}

      <BottomNav />
    </div>
  );
}
