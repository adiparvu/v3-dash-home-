"use client";

/**
 * useProfile — single source of truth for the Account & Identity screens.
 *
 * When Supabase is configured AND the visitor is authenticated, profile data is
 * read from and written through the versioned `/api/v1/profile` endpoints (RLS
 * enforced server-side). Otherwise it transparently falls back to the localStorage
 * client store, so the app keeps working as a prototype with no backend.
 *
 * Both paths expose the identical interface the settings/profile page consumes.
 */
import { useCallback, useEffect, useState } from "react";
import { useStore, type Profile, type SocialLink, type TrustedPerson } from "./store";

const configured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

type Source = "store" | "loading" | "remote";

// UI permission labels ↔ database enum values.
const PERM_TO_ENUM: Record<string, string> = {
  "Emergency access": "emergency_access",
  "Ownership transfer": "ownership_transfer",
  "Recovery approvals": "recovery_approvals",
  "Estate continuity": "estate_continuity",
};
const ENUM_TO_PERM: Record<string, string> = Object.fromEntries(
  Object.entries(PERM_TO_ENUM).map(([label, value]) => [value, label])
);

/* eslint-disable @typescript-eslint/no-explicit-any */
function mapProfile(d: any): Profile {
  const p = d.profile ?? {};
  return {
    firstName: p.first_name ?? "",
    lastName: p.last_name ?? "",
    displayName: p.display_name ?? p.full_name ?? "",
    email: p.email ?? "",
    phone: p.phone ?? "",
    notes: p.notes ?? "",
    ringColor: p.avatar_ring_color ?? 0,
    createdAt: p.created_at ?? new Date().toISOString(),
    socialLinks: (d.socialLinks ?? []).map((l: any): SocialLink => ({
      id: l.id,
      platform: l.platform,
      url: l.url,
    })),
    trustedPersons: (d.trustedPersons ?? []).map((t: any): TrustedPerson => ({
      id: t.id,
      name: t.name,
      relationship: t.relationship ?? "",
      email: t.email ?? "",
      permissions: (t.permissions ?? []).map((e: string) => ENUM_TO_PERM[e] ?? e),
    })),
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

const PROFILE_FIELD_TO_COLUMN: Partial<Record<keyof Profile, string>> = {
  firstName: "first_name",
  lastName: "last_name",
  displayName: "display_name",
  notes: "notes",
  phone: "phone",
  ringColor: "avatar_ring_color",
};

export interface UseProfile {
  ready: boolean;
  /** Where the data is coming from — useful for a "Synced / Local" badge. */
  source: Source;
  profile: Profile;
  setProfile: (patch: Partial<Profile>) => void;
  addSocialLink: (link: SocialLink) => void;
  removeSocialLink: (id: string) => void;
  addTrustedPerson: (person: TrustedPerson) => void;
  removeTrustedPerson: (id: string) => void;
}

export function useProfile(): UseProfile {
  const store = useStore();
  const [source, setSource] = useState<Source>(configured ? "loading" : "store");
  const [remote, setRemote] = useState<Profile | null>(null);

  useEffect(() => {
    if (!configured) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/v1/profile", { cache: "no-store" });
        if (!res.ok) {
          // 401 (signed out) or any error → prototype/store mode.
          if (!cancelled) setSource("store");
          return;
        }
        const json = await res.json();
        if (cancelled) return;
        setRemote(mapProfile(json.data));
        setSource("remote");
      } catch {
        if (!cancelled) setSource("store");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // ── Remote mutations ───────────────────────────────────────────────────────
  const remoteSetProfile = useCallback((patch: Partial<Profile>) => {
    setRemote((prev) => (prev ? { ...prev, ...patch } : prev));
    const body: Record<string, unknown> = {};
    for (const [key, col] of Object.entries(PROFILE_FIELD_TO_COLUMN)) {
      if (key in patch) body[col] = (patch as Record<string, unknown>)[key];
    }
    if (Object.keys(body).length === 0) return;
    void fetch("/api/v1/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  }, []);

  const remoteAddSocialLink = useCallback((link: SocialLink) => {
    void (async () => {
      const res = await fetch("/api/v1/profile/social-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform: link.platform, url: link.url }),
      });
      if (!res.ok) return;
      const json = await res.json();
      const saved: SocialLink = { id: json.data.link.id, platform: json.data.link.platform, url: json.data.link.url };
      setRemote((prev) => (prev ? { ...prev, socialLinks: [...prev.socialLinks, saved] } : prev));
    })();
  }, []);

  const remoteRemoveSocialLink = useCallback((id: string) => {
    setRemote((prev) => (prev ? { ...prev, socialLinks: prev.socialLinks.filter((l) => l.id !== id) } : prev));
    void fetch(`/api/v1/profile/social-links/${id}`, { method: "DELETE" });
  }, []);

  const remoteAddTrustedPerson = useCallback((person: TrustedPerson) => {
    void (async () => {
      const res = await fetch("/api/v1/profile/trusted-persons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: person.name,
          relationship: person.relationship,
          email: person.email,
          permissions: person.permissions.map((p) => PERM_TO_ENUM[p] ?? p),
        }),
      });
      if (!res.ok) return;
      const json = await res.json();
      const t = json.data.person;
      const saved: TrustedPerson = {
        id: t.id,
        name: t.name,
        relationship: t.relationship ?? "",
        email: t.email ?? "",
        permissions: (t.permissions ?? []).map((e: string) => ENUM_TO_PERM[e] ?? e),
      };
      setRemote((prev) => (prev ? { ...prev, trustedPersons: [...prev.trustedPersons, saved] } : prev));
    })();
  }, []);

  const remoteRemoveTrustedPerson = useCallback((id: string) => {
    setRemote((prev) => (prev ? { ...prev, trustedPersons: prev.trustedPersons.filter((t) => t.id !== id) } : prev));
    void fetch(`/api/v1/profile/trusted-persons/${id}`, { method: "DELETE" });
  }, []);

  if (source === "remote" && remote) {
    return {
      ready: true,
      source,
      profile: remote,
      setProfile: remoteSetProfile,
      addSocialLink: remoteAddSocialLink,
      removeSocialLink: remoteRemoveSocialLink,
      addTrustedPerson: remoteAddTrustedPerson,
      removeTrustedPerson: remoteRemoveTrustedPerson,
    };
  }

  // Store / loading fallback — delegate to the localStorage-backed store.
  return {
    ready: store.ready && source !== "loading",
    source,
    profile: store.profile,
    setProfile: store.setProfile,
    addSocialLink: store.addSocialLink,
    removeSocialLink: store.removeSocialLink,
    addTrustedPerson: store.addTrustedPerson,
    removeTrustedPerson: store.removeTrustedPerson,
  };
}
