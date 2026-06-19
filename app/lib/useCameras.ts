"use client";

/**
 * Cameras & AI-detection hook (Frigate-style).
 *
 * Loads the camera registry + recent detections from /api/v1/twin/cameras and
 * subscribes to camera_events INSERTs (migration 010 publishes them on Realtime)
 * so the detection feed updates live. Falls back to a demo wall when Supabase is
 * unconfigured / signed out / empty. `source` badges Live vs Simulat.
 */
import { useEffect, useRef, useState } from "react";

const CONFIGURED = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);
const MAX_EVENTS = 30;

export type UICamera = { id: string; name: string; zone: string | null; online: boolean; ai: boolean };
export type UICameraEvent = { id: string; cameraId: string; object: string; label: string | null; confidence: number | null; zone: string | null; at: string };
type Source = "demo" | "live";

const minsAgo = (m: number) => new Date(Date.now() - m * 60000).toISOString();

const DEMO_CAMERAS: UICamera[] = [
  { id: "c1", name: "Poartă principală", zone: "driveway", online: true, ai: true },
  { id: "c2", name: "Livadă nord", zone: "orchard", online: true, ai: true },
  { id: "c3", name: "Heleșteu", zone: "lake", online: true, ai: true },
  { id: "c4", name: "Curte interioară", zone: "house", online: false, ai: true },
];
const DEMO_EVENTS: UICameraEvent[] = [
  { id: "e1", cameraId: "c1", object: "person", label: "curier", confidence: 0.94, zone: "driveway", at: minsAgo(2) },
  { id: "e2", cameraId: "c2", object: "animal", label: "căprioară", confidence: 0.81, zone: "orchard", at: minsAgo(11) },
  { id: "e3", cameraId: "c1", object: "car", label: null, confidence: 0.97, zone: "driveway", at: minsAgo(26) },
  { id: "e4", cameraId: "c3", object: "person", label: null, confidence: 0.88, zone: "lake", at: minsAgo(48) },
];

export function useCameras(zone?: string): { cameras: UICamera[]; events: UICameraEvent[]; source: Source } {
  const [cameras, setCameras] = useState<UICamera[]>(() => (zone ? DEMO_CAMERAS.filter((c) => c.zone === zone) : DEMO_CAMERAS));
  const [events, setEvents] = useState<UICameraEvent[]>(() => (zone ? DEMO_EVENTS.filter((e) => e.zone === zone) : DEMO_EVENTS));
  const [source, setSource] = useState<Source>("demo");
  const camIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!CONFIGURED) return;
    let cancelled = false;
    let unsubscribe: (() => void) | undefined;

    fetch(`/api/v1/twin/cameras${zone ? `?zone=${encodeURIComponent(zone)}` : ""}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((j) => {
        if (cancelled || !j?.data) return;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const cams: any[] = j.data.cameras ?? [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const evs: any[] = j.data.events ?? [];
        if (!cams.length) return;
        camIds.current = new Set(cams.map((c) => c.id));
        setCameras(cams.map((c) => ({ id: c.id, name: c.name, zone: c.zone, online: c.is_online, ai: c.ai_enabled })));
        setEvents(evs.map((e) => ({ id: e.id, cameraId: e.camera_id, object: e.object, label: e.label, confidence: e.confidence, zone: e.zone, at: e.recorded_at })));
        setSource("live");
      })
      .catch(() => {});

    (async () => {
      const { createClient } = await import("../../lib/supabase/client");
      const supabase = createClient();
      const channel = supabase
        .channel(`camera-events${zone ? `-${zone}` : ""}`)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .on("postgres_changes", { event: "INSERT", schema: "public", table: "camera_events" }, (msg: { new?: any }) => {
          if (cancelled || !msg.new) return;
          const e = msg.new;
          if (zone && e.zone !== zone) return;
          if (camIds.current.size && !camIds.current.has(e.camera_id)) return;
          setEvents((prev) => [{ id: e.id, cameraId: e.camera_id, object: e.object, label: e.label, confidence: e.confidence, zone: e.zone, at: e.recorded_at }, ...prev].slice(0, MAX_EVENTS));
          setSource("live");
        })
        .subscribe();
      unsubscribe = () => { supabase.removeChannel(channel); };
    })();

    return () => { cancelled = true; unsubscribe?.(); };
  }, [zone]);

  return { cameras, events, source };
}
