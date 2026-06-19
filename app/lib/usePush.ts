"use client";

/**
 * Web Push subscription hook.
 *
 * Registers the service worker and subscribes the browser to push using the
 * VAPID public key (NEXT_PUBLIC_VAPID_PUBLIC_KEY), then POSTs the subscription
 * to /api/v1/notifications/push so the push-notify edge function can reach this
 * device. Degrades gracefully: when push is unsupported, permission is denied,
 * or no VAPID key is configured, `supported`/`reason` reflect why and the UI can
 * hide or disable the toggle.
 */
import { useCallback, useEffect, useState } from "react";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? "";

type Status = "unsupported" | "unconfigured" | "default" | "granted" | "denied";

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

export function usePush() {
  const [status, setStatus] = useState<Status>("unsupported");
  const [busy, setBusy] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const supported =
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      "PushManager" in window &&
      "Notification" in window;
    if (!supported) { setStatus("unsupported"); return; }
    if (!VAPID_PUBLIC_KEY) { setStatus("unconfigured"); return; }
    setStatus(Notification.permission as Status);
    // Reflect any existing subscription.
    navigator.serviceWorker.getRegistration().then((reg) => {
      reg?.pushManager.getSubscription().then((s) => setSubscribed(Boolean(s)));
    });
  }, []);

  const subscribe = useCallback(async () => {
    if (status === "unsupported" || status === "unconfigured" || busy) return;
    setBusy(true);
    try {
      const reg = await navigator.serviceWorker.register("/sw.js");
      await navigator.serviceWorker.ready;
      const permission = await Notification.requestPermission();
      setStatus(permission as Status);
      if (permission !== "granted") return;
      const sub =
        (await reg.pushManager.getSubscription()) ||
        (await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY) as BufferSource,
        }));
      const res = await fetch("/api/v1/notifications/push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sub.toJSON()),
      });
      setSubscribed(res.ok);
    } catch {
      setSubscribed(false);
    } finally {
      setBusy(false);
    }
  }, [status, busy]);

  const unsubscribe = useCallback(async () => {
    if (busy) return;
    setBusy(true);
    try {
      const reg = await navigator.serviceWorker.getRegistration();
      const sub = await reg?.pushManager.getSubscription();
      if (sub) {
        await fetch(`/api/v1/notifications/push?endpoint=${encodeURIComponent(sub.endpoint)}`, { method: "DELETE" });
        await sub.unsubscribe();
      }
      setSubscribed(false);
    } finally {
      setBusy(false);
    }
  }, [busy]);

  return { status, busy, subscribed, subscribe, unsubscribe };
}
