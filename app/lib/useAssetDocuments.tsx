"use client";

/**
 * Remote asset documents (Supabase Storage). Active only when the backend is
 * configured and the asset is a real remote asset; otherwise the caller falls
 * back to the localStorage prototype (useAssetRecords). `active` flips true once
 * the list has loaded so the UI can switch sources without a flash.
 */
import { useCallback, useEffect, useState } from "react";

const configured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

export type RemoteDoc = { id: string; name: string; size: string; url?: string };

function humanSize(bytes: number | null): string {
  if (!bytes && bytes !== 0) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function mapDoc(d: any): RemoteDoc {
  return { id: d.id, name: d.name ?? d.file_name, size: humanSize(d.file_size_bytes), url: d.download_url ?? undefined };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export function useAssetDocuments(assetId: string, enabled: boolean) {
  const allowed = configured && enabled;
  const [documents, setDocuments] = useState<RemoteDoc[]>([]);
  const [active, setActive] = useState(false);

  const refresh = useCallback(async () => {
    if (!allowed) return;
    try {
      const res = await fetch(`/api/v1/assets/${assetId}/documents`, { cache: "no-store" });
      if (!res.ok) {
        setActive(false);
        return;
      }
      const json = await res.json();
      setDocuments((json.data?.documents ?? []).map(mapDoc));
      setActive(true);
    } catch {
      setActive(false);
    }
  }, [allowed, assetId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const upload = useCallback(
    async (file: File): Promise<boolean> => {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch(`/api/v1/assets/${assetId}/documents`, { method: "POST", body: fd });
      if (res.ok) await refresh();
      return res.ok;
    },
    [assetId, refresh],
  );

  const remove = useCallback(
    async (id: string) => {
      const res = await fetch(`/api/v1/assets/${assetId}/documents/${id}`, { method: "DELETE" });
      if (res.ok) await refresh();
    },
    [assetId, refresh],
  );

  return { active, documents, upload, remove };
}
