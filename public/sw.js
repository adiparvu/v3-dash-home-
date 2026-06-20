/* PRVIO Earth service worker.
 *
 * Two responsibilities:
 *  1. Web Push receiver — displays notifications pushed by the push-notify edge
 *     function and focuses/opens the app on click.
 *  2. Offline app shell — precaches the shell + key routes and serves a cached
 *     response (or the /offline fallback) when the network is unavailable, so
 *     the installed PWA opens without a connection.
 */

const CACHE = "prvio-shell-v1";
const OFFLINE_URL = "/offline";
const PRECACHE = ["/", "/offline", "/manifest.json", "/icon.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  // Never cache cross-origin or API/auth traffic — always hit the network.
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/auth/")) return;

  // Navigations: network-first with an offline fallback (keeps content fresh,
  // degrades to the cached shell / offline page when disconnected).
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((cache) => cache.put(req, copy));
          return res;
        })
        .catch(async () => (await caches.match(req)) || (await caches.match(OFFLINE_URL)) || Response.error()),
    );
    return;
  }

  // Static assets: cache-first, then network (and populate the cache).
  event.respondWith(
    caches.match(req).then(
      (cached) =>
        cached ||
        fetch(req).then((res) => {
          if (res.ok && (url.pathname.startsWith("/_next/") || PRECACHE.includes(url.pathname))) {
            const copy = res.clone();
            caches.open(CACHE).then((cache) => cache.put(req, copy));
          }
          return res;
        }),
    ),
  );
});

self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { title: "PRVIO Earth", body: event.data ? event.data.text() : "" };
  }
  const title = data.title || "PRVIO Earth";
  const options = {
    body: data.body || "",
    icon: data.icon || "/icon.svg",
    badge: "/icon.svg",
    tag: data.tag || undefined,
    data: { url: data.url || "/notifications" },
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || "/notifications";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if ("focus" in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      return self.clients.openWindow(url);
    }),
  );
});
