import Link from "next/link";

/**
 * Offline fallback — served by the service worker when a navigation fails with
 * no network. Static so it is always available from the precache.
 */
export const metadata = { title: "Offline · PRVIO Earth" };

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-8" style={{ background: "var(--bg-1)", color: "var(--text-1)" }}>
      <div
        className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6"
        style={{ background: "var(--glass-bg)", border: "0.5px solid var(--glass-border)" }}
      >
        <span style={{ fontSize: 36 }}>🌐</span>
      </div>
      <h1 className="font-bold text-2xl mb-2">You&apos;re offline</h1>
      <p className="text-sm mb-8 max-w-xs" style={{ color: "var(--text-2)" }}>
        PRVIO Earth can&apos;t reach the estate right now. Cached screens stay available — reconnect to sync live data.
      </p>
      <Link
        href="/"
        className="rounded-2xl px-6 py-3 text-sm font-medium"
        style={{ background: "var(--accent)", color: "var(--bg-1)" }}
      >
        Try again
      </Link>
    </div>
  );
}
