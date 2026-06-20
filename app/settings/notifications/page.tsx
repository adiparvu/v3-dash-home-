"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import StatusBar from "../../components/layout/StatusBar";
import { useT, type MessageKey } from "../../lib/i18n";

const NOTIF_KEY = "prvio-notif-settings-v1";

const categories: { id: string; lkey: MessageKey; dkey: MessageKey; icon: string; defaultOn: boolean }[] = [
  { id: "alerts", lkey: "nset.c.alerts", dkey: "nset.c.alerts.d", icon: "🚨", defaultOn: true },
  { id: "maintenance", lkey: "nset.c.maintenance", dkey: "nset.c.maintenance.d", icon: "🔧", defaultOn: true },
  { id: "automations", lkey: "nset.c.automations", dkey: "nset.c.automations.d", icon: "⚡", defaultOn: true },
  { id: "zones", lkey: "nset.c.zones", dkey: "nset.c.zones.d", icon: "🌿", defaultOn: false },
  { id: "chat", lkey: "nset.c.chat", dkey: "nset.c.chat.d", icon: "💬", defaultOn: true },
  { id: "reports", lkey: "nset.c.reports", dkey: "nset.c.reports.d", icon: "📊", defaultOn: false },
];

const channels: { id: string; label: string; desc: string; defaultOn: boolean }[] = [
  { id: "push", label: "Push Notifications", desc: "On this device", defaultOn: true },
  { id: "email", label: "Email", desc: "alex@prvio.earth", defaultOn: true },
  { id: "sms", label: "SMS", desc: "Critical alerts only", defaultOn: false },
];

export default function NotificationsSettingsPage() {
  const t = useT();
  const [cats, setCats] = useState<Record<string, boolean>>(
    Object.fromEntries(categories.map((c) => [c.id, c.defaultOn]))
  );
  const [chans, setChans] = useState<Record<string, boolean>>(
    Object.fromEntries(channels.map((c) => [c.id, c.defaultOn]))
  );
  const [quietHours, setQuietHours] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem(NOTIF_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        if (s.cats) setCats((c) => ({ ...c, ...s.cats }));
        if (s.chans) setChans((c) => ({ ...c, ...s.chans }));
        if (typeof s.quietHours === "boolean") setQuietHours(s.quietHours);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(NOTIF_KEY, JSON.stringify({ cats, chans, quietHours }));
    } catch {
      /* ignore */
    }
  }, [cats, chans, quietHours, mounted]);

  const Toggle = ({ on, onClick }: { on: boolean; onClick: () => void }) => (
    <button
      onClick={onClick}
      className="w-11 h-6 rounded-full relative transition-all duration-200 flex-shrink-0"
      style={{ background: on ? "var(--accent)" : "var(--glass-border)" }}
    >
      <div className="absolute top-0.5 w-5 h-5 rounded-full transition-all duration-200" style={{ left: on ? "calc(100% - 22px)" : "2px", background: on ? "var(--bg-1)" : "rgba(255,255,255,0.5)" }} />
    </button>
  );

  return (
    <div className="min-h-screen pb-10" style={{ color: "var(--text-1)" }}>
      <StatusBar />

      <div className="px-5 pt-1 pb-4 flex items-center gap-3">
        <Link href="/settings" aria-label="Back" className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 liquid-glass" style={{ color: "var(--text-1)" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </Link>
        <h1 className="font-bold text-xl" style={{ color: "var(--text-1)" }}>{t("page.notifications")}</h1>
      </div>

      <div className="px-4 space-y-5">
        {/* Channels */}
        <div>
          <p className="text-text-secondary text-xs font-medium uppercase tracking-wide mb-2 px-1">{t("nset.delivery")}</p>
          <div className="liquid-glass rounded-2xl overflow-hidden">
            {channels.map((c, i) => (
              <div key={c.id} className="flex items-center justify-between px-4 py-3.5" style={{ borderBottom: i < channels.length - 1 ? "0.5px solid var(--glass-border)" : undefined }}>
                <div>
                  <p className="text-sm font-medium" style={{ color: "var(--text-1)" }}>{c.id === "push" ? t("nset.push") : c.label}</p>
                  <p className="text-text-secondary text-xs">{c.id === "push" ? t("nset.push.d") : c.id === "sms" ? t("nset.sms.d") : c.desc}</p>
                </div>
                <Toggle on={chans[c.id]} onClick={() => setChans((s) => ({ ...s, [c.id]: !s[c.id] }))} />
              </div>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div>
          <p className="text-text-secondary text-xs font-medium uppercase tracking-wide mb-2 px-1">{t("nset.categories")}</p>
          <div className="liquid-glass rounded-2xl overflow-hidden">
            {categories.map((c, i) => (
              <div key={c.id} className="flex items-center gap-3.5 px-4 py-3.5" style={{ borderBottom: i < categories.length - 1 ? "0.5px solid var(--glass-border)" : undefined }}>
                <span className="text-xl w-7 text-center flex-shrink-0">{c.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium" style={{ color: "var(--text-1)" }}>{t(c.lkey)}</p>
                  <p className="text-text-secondary text-xs">{t(c.dkey)}</p>
                </div>
                <Toggle on={cats[c.id]} onClick={() => setCats((s) => ({ ...s, [c.id]: !s[c.id] }))} />
              </div>
            ))}
          </div>
        </div>

        {/* Quiet hours */}
        <div>
          <p className="text-text-secondary text-xs font-medium uppercase tracking-wide mb-2 px-1">{t("nset.quietHours")}</p>
          <div className="liquid-glass rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3.5" style={{ borderBottom: quietHours ? "0.5px solid var(--glass-border)" : undefined }}>
              <div>
                <p className="text-sm font-medium" style={{ color: "var(--text-1)" }}>{t("nset.dnd")}</p>
                <p className="text-text-secondary text-xs">{t("nset.dnd.d")}</p>
              </div>
              <Toggle on={quietHours} onClick={() => setQuietHours((v) => !v)} />
            </div>
            {quietHours && (
              <div className="flex items-center justify-between px-4 py-3.5">
                <div className="flex items-center gap-2">
                  <div className="rounded-xl px-3 py-2 text-center" style={{ background: "var(--glass-bg)", border: "0.5px solid var(--glass-border)" }}>
                    <p className="text-[9px]" style={{ color: "var(--text-2)" }}>{t("nset.from")}</p>
                    <p className="text-sm font-semibold" style={{ color: "var(--text-1)" }}>22:00</p>
                  </div>
                  <span style={{ color: "var(--text-3)" }}>→</span>
                  <div className="rounded-xl px-3 py-2 text-center" style={{ background: "var(--glass-bg)", border: "0.5px solid var(--glass-border)" }}>
                    <p className="text-[9px]" style={{ color: "var(--text-2)" }}>{t("nset.to")}</p>
                    <p className="text-sm font-semibold" style={{ color: "var(--text-1)" }}>07:00</p>
                  </div>
                </div>
                <span className="text-xs font-medium" style={{ color: "var(--accent)" }}>Daily</span>
              </div>
            )}
          </div>
          <p className="text-text-tertiary text-[11px] px-1 mt-2 leading-relaxed">Critical Alerts always break through Do Not Disturb to keep your estate safe.</p>
        </div>
      </div>
    </div>
  );
}
