"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

export type Metric = { label: string; value: string };

export type Zone = {
  href: string;
  name: string;
  subtitle: string;
  type: string;
  status: string;
  statusColor: string;
  health: number;
  icon: string;
  accentColor: string;
  metrics: Metric[];
  custom?: boolean;
};

export type Asset = {
  href: string;
  name: string;
  category: string;
  location: string;
  status: string;
  statusColor: string;
  icon: string;
  accentColor: string;
  brand?: string;
  model?: string;
  serial?: string;
  custom?: boolean;
};

interface StoreCtx {
  ready: boolean;
  estateName: string;
  setEstateName: (s: string) => void;
  onboarded: boolean;
  setOnboarded: (b: boolean) => void;
  addedZones: Zone[];
  addedAssets: Asset[];
  addZone: (z: Zone) => void;
  addAsset: (a: Asset) => void;
  updateAsset: (href: string, patch: Partial<Asset>) => void;
  updateZone: (href: string, patch: Partial<Zone>) => void;
  removeAsset: (href: string) => void;
  removeZone: (href: string) => void;
  findAsset: (slug: string) => Asset | undefined;
  findZone: (slug: string) => Zone | undefined;
}

const STORAGE_KEY = "prvio-store-v1";

const defaultCtx: StoreCtx = {
  ready: false,
  estateName: "My Property",
  setEstateName: () => {},
  onboarded: true,
  setOnboarded: () => {},
  addedZones: [],
  addedAssets: [],
  addZone: () => {},
  addAsset: () => {},
  updateAsset: () => {},
  updateZone: () => {},
  removeAsset: () => {},
  removeZone: () => {},
  findAsset: () => undefined,
  findZone: () => undefined,
};

const StoreContext = createContext<StoreCtx>(defaultCtx);

type Persisted = {
  estateName: string;
  onboarded: boolean;
  addedZones: Zone[];
  addedAssets: Asset[];
};

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [estateName, setEstateNameState] = useState("My Property");
  const [onboarded, setOnboardedState] = useState(true);
  const [addedZones, setAddedZones] = useState<Zone[]>([]);
  const [addedAssets, setAddedAssets] = useState<Asset[]>([]);

  // Load
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const p = JSON.parse(raw) as Partial<Persisted>;
        if (typeof p.estateName === "string") setEstateNameState(p.estateName);
        if (typeof p.onboarded === "boolean") setOnboardedState(p.onboarded);
        else setOnboardedState(false);
        if (Array.isArray(p.addedZones)) setAddedZones(p.addedZones);
        if (Array.isArray(p.addedAssets)) setAddedAssets(p.addedAssets);
      } else {
        // No store yet → treat as first launch
        setOnboardedState(false);
      }
    } catch {
      /* ignore corrupted store */
    }
    setReady(true);
  }, []);

  // Persist
  useEffect(() => {
    if (!ready) return;
    const data: Persisted = { estateName, onboarded, addedZones, addedAssets };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      /* quota / private mode — ignore */
    }
  }, [ready, estateName, onboarded, addedZones, addedAssets]);

  const setEstateName = useCallback((s: string) => setEstateNameState(s), []);
  const setOnboarded = useCallback((b: boolean) => setOnboardedState(b), []);
  const addZone = useCallback((z: Zone) => setAddedZones((prev) => [{ ...z, custom: true }, ...prev]), []);
  const addAsset = useCallback((a: Asset) => setAddedAssets((prev) => [{ ...a, custom: true }, ...prev]), []);
  const updateAsset = useCallback(
    (href: string, patch: Partial<Asset>) =>
      setAddedAssets((prev) => prev.map((a) => (a.href === href ? { ...a, ...patch } : a))),
    []
  );
  const updateZone = useCallback(
    (href: string, patch: Partial<Zone>) =>
      setAddedZones((prev) => prev.map((z) => (z.href === href ? { ...z, ...patch } : z))),
    []
  );
  const removeAsset = useCallback((href: string) => setAddedAssets((prev) => prev.filter((a) => a.href !== href)), []);
  const removeZone = useCallback((href: string) => setAddedZones((prev) => prev.filter((z) => z.href !== href)), []);
  const findAsset = useCallback(
    (slug: string) => addedAssets.find((a) => a.href === `/inventory/${slug}` || a.href.endsWith(`/${slug}`)),
    [addedAssets]
  );
  const findZone = useCallback(
    (slug: string) => addedZones.find((z) => z.href === `/zones/${slug}` || z.href.endsWith(`/${slug}`)),
    [addedZones]
  );

  return (
    <StoreContext.Provider
      value={{ ready, estateName, setEstateName, onboarded, setOnboarded, addedZones, addedAssets, addZone, addAsset, updateAsset, updateZone, removeAsset, removeZone, findAsset, findZone }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => useContext(StoreContext);

/** Build a URL-safe slug from a display name. */
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
