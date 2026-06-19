"use client";

/**
 * Reusable AI camera surface: a grid of camera tiles (online + AI badges) and a
 * live object-detection feed. Drop into any module with a zone to scope it
 * (orchard, lake, driveway…) or leave unscoped for an estate-wide view. Fed by
 * useCameras (live camera_events + demo fallback).
 */
import { useCameras } from "../../lib/useCameras";

const OBJECT_ICON: Record<string, string> = { person: "🚶", car: "🚗", animal: "🦊", package: "📦", bicycle: "🚲", boat: "⛵" };
const OBJECT_COLOR: Record<string, string> = { person: "#F59E0B", car: "#22D3EE", animal: "#A78BFA", package: "#4ADE80" };

function ago(iso: string): string {
  const m = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (m < 1) return "acum";
  if (m < 60) return `${m}m`;
  const h = Math.round(m / 60);
  return h < 24 ? `${h}h` : `${Math.round(h / 24)}z`;
}

export default function CameraWall({ zone, title = "Camere · AI" }: { zone?: string; title?: string }) {
  const { cameras, events, source } = useCameras(zone);
  const live = source === "live";

  return (
    <div>
      <div className="flex items-center gap-2 mb-2.5 px-1">
        <p className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--text-2)" }}>{title}</p>
        <span className="flex items-center gap-1 text-[10px] font-semibold" style={{ color: live ? "#4ADE80" : "#9CA3AF" }}>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse-glow" style={{ background: live ? "#4ADE80" : "#9CA3AF" }} />
          {live ? "Live" : "Simulat"}
        </span>
      </div>

      {/* Camera tiles */}
      <div className="grid grid-cols-2 gap-2.5 mb-3">
        {cameras.map((c) => (
          <div key={c.id} className="rounded-2xl overflow-hidden liquid-glass">
            <div className="relative h-20 flex items-center justify-center" style={{ background: "linear-gradient(135deg, #0b1220, #11203a)" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3b4a63" strokeWidth="1.6"><path d="M23 7l-7 5 7 5V7z" /><rect x="1" y="5" width="15" height="14" rx="2" /></svg>
              <span className="absolute top-1.5 left-1.5 w-1.5 h-1.5 rounded-full" style={{ background: c.online ? "#4ADE80" : "#6B7280", boxShadow: c.online ? "0 0 6px #4ADE80" : undefined }} />
              {c.ai && <span className="absolute top-1.5 right-1.5 text-[8px] font-bold px-1 py-0.5 rounded" style={{ background: "rgba(167,139,250,0.2)", color: "#A78BFA" }}>AI</span>}
            </div>
            <div className="px-2.5 py-1.5">
              <p className="text-[11px] font-medium truncate" style={{ color: "var(--text-1)" }}>{c.name}</p>
              <p className="text-[9px]" style={{ color: c.online ? "var(--text-3)" : "#6B7280" }}>{c.online ? "Online" : "Offline"}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Detection feed */}
      <div className="space-y-2">
        {events.length === 0 && <p className="text-xs text-center py-3" style={{ color: "var(--text-3)" }}>Nicio detecție recentă.</p>}
        {events.map((e) => {
          const color = OBJECT_COLOR[e.object] ?? "#9CA3AF";
          const cam = cameras.find((c) => c.id === e.cameraId);
          return (
            <div key={e.id} className="flex items-center gap-3 rounded-2xl p-3 liquid-glass">
              <span className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0" style={{ background: `${color}1f`, border: `1px solid ${color}33` }}>{OBJECT_ICON[e.object] ?? "👁️"}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium capitalize" style={{ color: "var(--text-1)" }}>{e.object}{e.label ? ` · ${e.label}` : ""}</p>
                <p className="text-[11px]" style={{ color: "var(--text-3)" }}>{cam?.name ?? e.zone ?? "cameră"}{e.confidence != null ? ` · ${Math.round(e.confidence * 100)}%` : ""}</p>
              </div>
              <span className="text-[10px] font-semibold flex-shrink-0" style={{ color: "var(--text-3)" }}>{ago(e.at)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
