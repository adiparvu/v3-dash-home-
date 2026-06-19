/**
 * Live alert engine for the notifications center.
 *
 * Derives notifications from the live energy/twin state + user prefs (the
 * web-prototype stand-in for the backend alerts pipeline). Framework-free so it
 * can be unit-tested; the notifications screen renders these above the stored
 * history with a "Live" tag.
 */
import type { EnergyState } from "./energy";

export type LiveAlert = {
  id: string;
  icon: string;
  title: string;
  desc: string;
  color: string;
  severity: "alert" | "warn" | "info" | "ok";
};

export type AlertPrefs = { backupReserve: number; offGrid: boolean; stormWatch: boolean };

export function deriveAlerts(s: EnergyState, carPct: number, prefs: AlertPrefs): LiveAlert[] {
  const out: LiveAlert[] = [];

  if (s.batteryPct <= prefs.backupReserve + 5) {
    out.push({ id: "live-batt-low", icon: "🔋", title: "Powerwall aproape la rezervă", desc: `SOC ${Math.round(s.batteryPct)}% · rezervă ${prefs.backupReserve}%`, color: "#F97316", severity: "alert" });
  }
  if (s.grid > 2) {
    out.push({ id: "live-grid-import", icon: "🔌", title: "Import ridicat din rețea", desc: `Se importă ${s.grid.toFixed(1)} kW din rețea`, color: "#F59E0B", severity: "warn" });
  }
  if (s.grid < -1) {
    out.push({ id: "live-grid-export", icon: "💸", title: "Export activ în rețea", desc: `Surplus de ${Math.abs(s.grid).toFixed(1)} kW vândut în rețea`, color: "#4ADE80", severity: "ok" });
  }
  if (s.solar >= 5) {
    out.push({ id: "live-solar-peak", icon: "☀️", title: "Producție solară de vârf", desc: `${s.solar.toFixed(1)} kW generați acum`, color: "#4ADE80", severity: "ok" });
  }
  if (carPct >= 100) {
    out.push({ id: "live-ev-full", icon: "🏎️", title: "Porsche încărcat complet", desc: "Bateria mașinii a ajuns la 100%", color: "#4ADE80", severity: "ok" });
  } else if (s.vehicle > 0.1 && carPct >= 95) {
    out.push({ id: "live-ev-almost", icon: "🏎️", title: "Încărcare aproape gata", desc: `Mașina la ${Math.round(carPct)}% · ${s.vehicle.toFixed(1)} kW`, color: "#22D3EE", severity: "info" });
  }
  if (prefs.offGrid) {
    out.push({ id: "live-offgrid", icon: "⚡", title: "Sistem off-grid activ", desc: "Locuința rulează independent de rețea", color: "#F59E0B", severity: "warn" });
  }
  return out;
}
