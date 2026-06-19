"use client";

import { useEffect } from "react";

/**
 * Registers the service worker on load so the PWA shell is cached for offline
 * use independently of the push-subscription flow (usePush also registers it
 * when enabling notifications; registering the same /sw.js is idempotent).
 */
export default function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
    const register = () => navigator.serviceWorker.register("/sw.js").catch(() => {});
    if (document.readyState === "complete") register();
    else window.addEventListener("load", register, { once: true });
  }, []);

  return null;
}
