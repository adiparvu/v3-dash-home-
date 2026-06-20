import OfflineClient from "./OfflineClient";

/**
 * Offline fallback — served by the service worker when a navigation fails with
 * no network. Static so it is always available from the precache; the visible
 * copy is localized client-side from the persisted locale.
 */
export const metadata = { title: "Offline · PRVIO Earth" };

export default function OfflinePage() {
  return <OfflineClient />;
}
