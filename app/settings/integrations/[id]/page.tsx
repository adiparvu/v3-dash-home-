"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import StatusBar from "../../../components/layout/StatusBar";
import { getIntegration, useIntegrations } from "../../../lib/integrations";
import { useT } from "../../../lib/i18n";
import EnergyTariffPanel from "../../../components/integrations/EnergyTariffPanel";
import AirQualityPanel from "../../../components/integrations/AirQualityPanel";
import SeismicPanel from "../../../components/integrations/SeismicPanel";

/**
 * Integration detail — connect/disconnect (persisted) and, once connected, the
 * integration's representative data + deep links to the surfaces it powers.
 */
export default function IntegrationDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const integration = getIntegration(params.id);
  const { isConnected, connect, disconnect } = useIntegrations();
  const [busy, setBusy] = useState(false);
  const t = useT();

  if (!integration) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 px-8 text-center" style={{ color: "var(--text-1)" }}>
        <p className="text-3xl">🔌</p>
        <p className="font-semibold">{t("int.notFound")}</p>
        <Link href="/settings/integrations" className="text-sm font-medium" style={{ color: "var(--accent)" }}>{t("int.back")}</Link>
      </div>
    );
  }

  const connected = isConnected(integration.id);

  const onConnect = () => {
    setBusy(true);
    // Simulate the pairing/OAuth handshake the backend would perform.
    setTimeout(() => {
      connect(integration.id);
      setBusy(false);
    }, 900);
  };

  return (
    <div className="min-h-screen pb-12" style={{ color: "var(--text-1)" }}>
      <StatusBar />

      <div className="px-5 pt-1 pb-4 flex items-center gap-3">
        <button onClick={() => router.push("/settings/integrations")} aria-label="Back" className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 liquid-glass" style={{ color: "var(--text-1)" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <h1 className="font-bold text-xl truncate" style={{ color: "var(--text-1)" }}>{integration.name}</h1>
      </div>

      <div className="px-4 space-y-5">
        {/* Header card */}
        <div className="liquid-glass rounded-3xl p-4 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: `${integration.color}18`, border: `1px solid ${integration.color}30` }}>{integration.icon}</div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-base" style={{ color: "var(--text-1)" }}>{integration.name}</p>
            <p className="text-text-secondary text-xs">{integration.desc}</p>
          </div>
          <span className="text-[10px] font-semibold px-2 py-1 rounded-full flex-shrink-0" style={connected
            ? { background: "rgba(74,222,128,0.15)", color: "#4ADE80" }
            : { background: "var(--glass-bg)", color: "var(--text-3)" }}>
            {connected ? (integration.connectedBadge ?? t("int.connectedPill")) : t("int.notConnected")}
          </span>
        </div>

        {connected ? (
          <>
            {/* Live data panel for real-API integrations */}
            {integration.live === "energy-tariff" && <EnergyTariffPanel />}
            {integration.live === "air-quality" && <AirQualityPanel />}
            {integration.live === "seismic" && <SeismicPanel />}

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-2">
              {integration.metrics.map((m) => (
                <div key={m.label} className="rounded-2xl p-3 text-center liquid-glass">
                  <p className="font-bold text-base" style={{ color: integration.color }}>{m.value}</p>
                  <p className="text-text-secondary text-[10px] mt-0.5">{m.label}</p>
                </div>
              ))}
            </div>

            {/* Recent activity */}
            {integration.feed && integration.feed.length > 0 && (
              <div>
                <p className="text-text-secondary text-xs font-medium uppercase tracking-wide mb-2 px-1">{t("home.recentActivity")}</p>
                <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.04)", border: "0.5px solid var(--glass-border)" }}>
                  {integration.feed.map((f, i) => (
                    <div key={i} className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: i < integration.feed!.length - 1 ? "1px solid rgba(255,255,255,0.06)" : undefined }}>
                      <span className="text-lg w-7 text-center flex-shrink-0">{f.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium leading-tight truncate" style={{ color: "var(--text-1)" }}>{f.title}</p>
                        <p className="text-text-secondary text-[11px]">{f.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            {integration.actions && integration.actions.length > 0 && (
              <div className="space-y-2">
                {integration.actions.map((a) => (
                  <Link key={a.href} href={a.href} className="block">
                    <button className="w-full rounded-2xl py-3 text-sm font-medium" style={{ background: "var(--accent)", color: "var(--bg-1)" }}>{a.label}</button>
                  </Link>
                ))}
              </div>
            )}

            <button onClick={() => disconnect(integration.id)} className="w-full rounded-2xl py-3 text-sm font-medium" style={{ background: "rgba(239,68,68,0.10)", border: "1px solid rgba(239,68,68,0.20)", color: "#EF4444" }}>
              {t("int.disconnect")}
            </button>
          </>
        ) : (
          <>
            {/* What you get */}
            <div>
              <p className="text-text-secondary text-xs font-medium uppercase tracking-wide mb-2 px-1">{t("int.whatYouGet")}</p>
              <div className="rounded-2xl p-4 space-y-2.5 liquid-glass">
                {integration.whatYouGet.map((w, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-sm">
                    <span className="flex-shrink-0 mt-0.5" style={{ color: "var(--accent)" }}>✓</span>
                    <span style={{ color: "var(--text-1)" }}>{w}</span>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={onConnect} disabled={busy} className="w-full rounded-2xl py-3.5 text-sm font-semibold transition-opacity" style={{ background: integration.color, color: "#08111E", opacity: busy ? 0.7 : 1 }}>
              {busy ? t("int.connecting") : (integration.connectLabel ?? t("int.connect"))}
            </button>
            <p className="text-text-tertiary text-[11px] text-center leading-relaxed">
              {t("int.connectNote")}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
