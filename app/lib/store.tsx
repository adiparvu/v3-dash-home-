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

/** Avatar ring gradients — shared so the profile, settings card and chat stay in sync. */
export const RING_COLORS: { label: string; value: string }[] = [
  { label: "Green", value: "linear-gradient(135deg, #4ADE80, #22D3EE)" },
  { label: "Purple", value: "linear-gradient(135deg, #7C3AED, #22D3EE)" },
  { label: "Gold", value: "linear-gradient(135deg, #F59E0B, #EF4444)" },
  { label: "Pink", value: "linear-gradient(135deg, #EC4899, #7C3AED)" },
  { label: "Cyan", value: "linear-gradient(135deg, #22D3EE, #4ADE80)" },
  { label: "White", value: "linear-gradient(135deg, #FFFFFF, #9CA3AF)" },
];

/** Social platforms supported by the Contacts-style "+" add experience. */
export const SOCIAL_PLATFORMS: { id: string; label: string; icon: string }[] = [
  { id: "facebook", label: "Facebook", icon: "📘" },
  { id: "instagram", label: "Instagram", icon: "📸" },
  { id: "x", label: "X", icon: "✖️" },
  { id: "threads", label: "Threads", icon: "🧵" },
  { id: "linkedin", label: "LinkedIn", icon: "💼" },
  { id: "tiktok", label: "TikTok", icon: "🎵" },
  { id: "youtube", label: "YouTube", icon: "▶️" },
  { id: "telegram", label: "Telegram", icon: "✈️" },
  { id: "whatsapp", label: "WhatsApp", icon: "💬" },
  { id: "custom", label: "Custom Link", icon: "🔗" },
];

export type SocialLink = { id: string; platform: string; url: string };

export type TrustedPerson = {
  id: string;
  name: string;
  relationship: string;
  email: string;
  /** Continuity capabilities granted to this person. */
  permissions: string[];
};

export type Profile = {
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  phone: string;
  notes: string;
  /** Index into RING_COLORS. */
  ringColor: number;
  socialLinks: SocialLink[];
  trustedPersons: TrustedPerson[];
  /** ISO date the account was created — drives the "Member since" badge. */
  createdAt: string;
};

const defaultProfile: Profile = {
  firstName: "Alex",
  lastName: "Owner",
  displayName: "Alex Owner",
  email: "alex@prvio.earth",
  phone: "+40 700 000 000",
  notes: "Estate owner & nature enthusiast.",
  ringColor: 0,
  socialLinks: [],
  trustedPersons: [],
  createdAt: "2024-01-15",
};

/** Personality presets for the user-owned AI assistant. */
export const ASSISTANT_PERSONALITIES: { id: string; label: string; blurb: string }[] = [
  { id: "concise", label: "Concise", blurb: "Short, direct answers." },
  { id: "friendly", label: "Friendly", blurb: "Warm and conversational." },
  { id: "expert", label: "Expert", blurb: "Detailed and technical." },
  { id: "proactive", label: "Proactive", blurb: "Suggests next steps." },
];

/** Avatar glyphs the assistant can use. */
export const ASSISTANT_AVATARS = ["✨", "🌿", "🤖", "🦉", "🛰️", "🌍"];

export type Assistant = {
  name: string;
  avatar: string;
  personality: string;
  /** Model identifier — supports bring-your-own-model. */
  model: string;
  voiceEnabled: boolean;
};

const defaultAssistant: Assistant = {
  name: "PRVIO Assistant",
  avatar: "✨",
  personality: "friendly",
  model: "on-device",
  voiceEnabled: false,
};

/** Auto-lock durations mandated by the Account & Security spec. */
export const AUTO_LOCK_OPTIONS: { id: string; label: string; seconds: number }[] = [
  { id: "immediately", label: "Immediately", seconds: 0 },
  { id: "30s", label: "30 seconds", seconds: 30 },
  { id: "1m", label: "1 minute", seconds: 60 },
  { id: "5m", label: "5 minutes", seconds: 300 },
  { id: "15m", label: "15 minutes", seconds: 900 },
  { id: "30m", label: "30 minutes", seconds: 1800 },
  { id: "1h", label: "1 hour", seconds: 3600 },
  { id: "custom", label: "Custom", seconds: -1 },
];

/** Persisted device-security preferences (local prototype mirror of backend policy). */
export type SecurityPrefs = {
  faceId: boolean;
  touchId: boolean;
  passcodeLock: boolean;
  loginAlerts: boolean;
  suspiciousActivity: boolean;
  /** AUTO_LOCK_OPTIONS id. */
  autoLock: string;
  /** Minutes used when autoLock === "custom". */
  autoLockCustomMinutes: number;
};

const defaultSecurity: SecurityPrefs = {
  faceId: true,
  touchId: false,
  passcodeLock: true,
  loginAlerts: true,
  suspiciousActivity: true,
  autoLock: "5m",
  autoLockCustomMinutes: 10,
};

/** Human-readable auto-lock label including the custom duration when selected. */
export function autoLockLabel(prefs: SecurityPrefs): string {
  if (prefs.autoLock === "custom") {
    const m = prefs.autoLockCustomMinutes;
    return `${m} ${m === 1 ? "minute" : "minutes"}`;
  }
  return AUTO_LOCK_OPTIONS.find((o) => o.id === prefs.autoLock)?.label ?? "5 minutes";
}

/** Granular consent toggles for privacy-by-default consent management. */
export type ConsentState = {
  analytics: boolean;
  crashReports: boolean;
  personalization: boolean;
  marketing: boolean;
  aiProcessing: boolean;
  /** ISO timestamp of the last consent change — part of the consent record. */
  updatedAt: string;
};

const defaultConsents: ConsentState = {
  analytics: false,
  crashReports: true,
  personalization: true,
  marketing: false,
  aiProcessing: true,
  updatedAt: "2024-01-15T00:00:00.000Z",
};

/** Data-subject request categories required by GDPR / CCPA. */
export const PRIVACY_REQUEST_TYPES: { id: PrivacyRequestType; label: string; desc: string }[] = [
  { id: "access", label: "Right of Access", desc: "A report of the personal data we hold about you." },
  { id: "portability", label: "Data Portability", desc: "A structured, machine-readable export of your data." },
  { id: "rectification", label: "Correction", desc: "Correct or rectify inaccurate information." },
  { id: "erasure", label: "Erasure", desc: "Delete your data, subject to legal retention." },
  { id: "restriction", label: "Restrict Processing", desc: "Limit how your data is processed." },
  { id: "objection", label: "Object to Processing", desc: "Object to processing where applicable." },
];

export type PrivacyRequestType =
  | "access"
  | "portability"
  | "rectification"
  | "erasure"
  | "restriction"
  | "objection";

export type PrivacyRequest = {
  id: string;
  type: PrivacyRequestType;
  status: "submitted" | "in_review" | "completed";
  regulation: "GDPR" | "CCPA";
  createdAt: string;
  note?: string;
};

/** A recorded AI authorization decision — part of the AI audit trail. */
export type AiAuditEntry = {
  id: string;
  at: string;
  /** Truncated prompt text. */
  prompt: string;
  classification: string;
  risk: string;
  allowed: boolean;
  /** Scopes that were retrieved to answer (provenance). */
  scopes: string[];
};

/** Powerwall / energy preferences (Tesla-style energy module). */
export type EnergyMode = "self_powered" | "time_based";
export type EnergyPrefs = {
  /** Backup reserve percentage kept for grid outages. */
  backupReserve: number;
  mode: EnergyMode;
  offGrid: boolean;
  stormWatch: boolean;
};

const defaultEnergy: EnergyPrefs = {
  backupReserve: 20,
  mode: "time_based",
  offGrid: false,
  stormWatch: true,
};

/** An ownership-transfer record (spec: Property & Estate Management → Property Transfer). */
export type PropertyTransfer = {
  id: string;
  property: string;
  recipientName: string;
  recipientEmail: string;
  jurisdiction: string;
  effectiveDate: string;
  assetsIncluded: boolean;
  documentsIncluded: boolean;
  /** Audit history is always preserved across a transfer. */
  auditPreserved: boolean;
  status: "pending" | "completed";
  createdAt: string;
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
  profile: Profile;
  setProfile: (patch: Partial<Profile>) => void;
  addSocialLink: (link: SocialLink) => void;
  removeSocialLink: (id: string) => void;
  addTrustedPerson: (person: TrustedPerson) => void;
  removeTrustedPerson: (id: string) => void;
  assistant: Assistant;
  setAssistant: (patch: Partial<Assistant>) => void;
  security: SecurityPrefs;
  setSecurity: (patch: Partial<SecurityPrefs>) => void;
  consents: ConsentState;
  setConsent: (key: keyof Omit<ConsentState, "updatedAt">, value: boolean) => void;
  privacyRequests: PrivacyRequest[];
  addPrivacyRequest: (type: PrivacyRequestType, regulation: PrivacyRequest["regulation"]) => void;
  removePrivacyRequest: (id: string) => void;
  aiAuditLog: AiAuditEntry[];
  logAiDecision: (entry: Omit<AiAuditEntry, "id" | "at">) => void;
  propertyTransfers: PropertyTransfer[];
  addPropertyTransfer: (t: Omit<PropertyTransfer, "id" | "createdAt" | "status">) => void;
  energy: EnergyPrefs;
  setEnergy: (patch: Partial<EnergyPrefs>) => void;
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
  profile: defaultProfile,
  setProfile: () => {},
  addSocialLink: () => {},
  removeSocialLink: () => {},
  addTrustedPerson: () => {},
  removeTrustedPerson: () => {},
  assistant: defaultAssistant,
  setAssistant: () => {},
  security: defaultSecurity,
  setSecurity: () => {},
  consents: defaultConsents,
  setConsent: () => {},
  privacyRequests: [],
  addPrivacyRequest: () => {},
  removePrivacyRequest: () => {},
  aiAuditLog: [],
  logAiDecision: () => {},
  propertyTransfers: [],
  addPropertyTransfer: () => {},
  energy: defaultEnergy,
  setEnergy: () => {},
};

const StoreContext = createContext<StoreCtx>(defaultCtx);

type Persisted = {
  estateName: string;
  onboarded: boolean;
  addedZones: Zone[];
  addedAssets: Asset[];
  profile: Profile;
  assistant: Assistant;
  security: SecurityPrefs;
  consents: ConsentState;
  privacyRequests: PrivacyRequest[];
  aiAuditLog: AiAuditEntry[];
  propertyTransfers: PropertyTransfer[];
  energy: EnergyPrefs;
};

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [estateName, setEstateNameState] = useState("My Property");
  const [onboarded, setOnboardedState] = useState(true);
  const [addedZones, setAddedZones] = useState<Zone[]>([]);
  const [addedAssets, setAddedAssets] = useState<Asset[]>([]);
  const [profile, setProfileState] = useState<Profile>(defaultProfile);
  const [assistant, setAssistantState] = useState<Assistant>(defaultAssistant);
  const [security, setSecurityState] = useState<SecurityPrefs>(defaultSecurity);
  const [consents, setConsentsState] = useState<ConsentState>(defaultConsents);
  const [privacyRequests, setPrivacyRequests] = useState<PrivacyRequest[]>([]);
  const [aiAuditLog, setAiAuditLog] = useState<AiAuditEntry[]>([]);
  const [propertyTransfers, setPropertyTransfers] = useState<PropertyTransfer[]>([]);
  const [energy, setEnergyState] = useState<EnergyPrefs>(defaultEnergy);

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
        if (p.profile && typeof p.profile === "object") {
          // Merge so new fields added in later versions get sane defaults.
          setProfileState({ ...defaultProfile, ...p.profile });
        }
        if (p.assistant && typeof p.assistant === "object") {
          setAssistantState({ ...defaultAssistant, ...p.assistant });
        }
        if (p.security && typeof p.security === "object") {
          setSecurityState({ ...defaultSecurity, ...p.security });
        }
        if (p.consents && typeof p.consents === "object") {
          setConsentsState({ ...defaultConsents, ...p.consents });
        }
        if (Array.isArray(p.privacyRequests)) setPrivacyRequests(p.privacyRequests);
        if (Array.isArray(p.aiAuditLog)) setAiAuditLog(p.aiAuditLog);
        if (Array.isArray(p.propertyTransfers)) setPropertyTransfers(p.propertyTransfers);
        if (p.energy && typeof p.energy === "object") setEnergyState({ ...defaultEnergy, ...p.energy });
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
    const data: Persisted = { estateName, onboarded, addedZones, addedAssets, profile, assistant, security, consents, privacyRequests, aiAuditLog, propertyTransfers, energy };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      /* quota / private mode — ignore */
    }
  }, [ready, estateName, onboarded, addedZones, addedAssets, profile, assistant, security, consents, privacyRequests, aiAuditLog, propertyTransfers, energy]);

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

  const setProfile = useCallback(
    (patch: Partial<Profile>) => setProfileState((prev) => ({ ...prev, ...patch })),
    []
  );
  const addSocialLink = useCallback(
    (link: SocialLink) => setProfileState((prev) => ({ ...prev, socialLinks: [...prev.socialLinks, link] })),
    []
  );
  const removeSocialLink = useCallback(
    (id: string) => setProfileState((prev) => ({ ...prev, socialLinks: prev.socialLinks.filter((l) => l.id !== id) })),
    []
  );
  const addTrustedPerson = useCallback(
    (person: TrustedPerson) => setProfileState((prev) => ({ ...prev, trustedPersons: [...prev.trustedPersons, person] })),
    []
  );
  const removeTrustedPerson = useCallback(
    (id: string) => setProfileState((prev) => ({ ...prev, trustedPersons: prev.trustedPersons.filter((t) => t.id !== id) })),
    []
  );
  const setAssistant = useCallback(
    (patch: Partial<Assistant>) => setAssistantState((prev) => ({ ...prev, ...patch })),
    []
  );
  const setSecurity = useCallback(
    (patch: Partial<SecurityPrefs>) => setSecurityState((prev) => ({ ...prev, ...patch })),
    []
  );
  const setConsent = useCallback(
    (key: keyof Omit<ConsentState, "updatedAt">, value: boolean) =>
      setConsentsState((prev) => ({ ...prev, [key]: value, updatedAt: new Date().toISOString() })),
    []
  );
  const addPrivacyRequest = useCallback(
    (type: PrivacyRequestType, regulation: PrivacyRequest["regulation"]) =>
      setPrivacyRequests((prev) => [
        { id: `req-${Date.now()}`, type, regulation, status: "submitted", createdAt: new Date().toISOString() },
        ...prev,
      ]),
    []
  );
  const removePrivacyRequest = useCallback(
    (id: string) => setPrivacyRequests((prev) => prev.filter((r) => r.id !== id)),
    []
  );
  const logAiDecision = useCallback(
    (entry: Omit<AiAuditEntry, "id" | "at">) =>
      setAiAuditLog((prev) => [
        { ...entry, id: `ai-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, at: new Date().toISOString() },
        ...prev,
      ].slice(0, 50)),
    []
  );
  const addPropertyTransfer = useCallback(
    (t: Omit<PropertyTransfer, "id" | "createdAt" | "status">) =>
      setPropertyTransfers((prev) => [
        { ...t, id: `xfer-${Date.now()}`, createdAt: new Date().toISOString(), status: "pending" },
        ...prev,
      ]),
    []
  );
  const setEnergy = useCallback(
    (patch: Partial<EnergyPrefs>) => setEnergyState((prev) => ({ ...prev, ...patch })),
    []
  );

  return (
    <StoreContext.Provider
      value={{ ready, estateName, setEstateName, onboarded, setOnboarded, addedZones, addedAssets, addZone, addAsset, updateAsset, updateZone, removeAsset, removeZone, findAsset, findZone, profile, setProfile, addSocialLink, removeSocialLink, addTrustedPerson, removeTrustedPerson, assistant, setAssistant, security, setSecurity, consents, setConsent, privacyRequests, addPrivacyRequest, removePrivacyRequest, aiAuditLog, logAiDecision, propertyTransfers, addPropertyTransfer, energy, setEnergy }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => useContext(StoreContext);

/** Format an ISO date as "January 2024" for the Member Since badge. */
export function memberSince(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

/** Human-readable elapsed time since the account was created. */
export function totalTimeUsing(iso: string, now: Date = new Date()): string {
  const start = new Date(iso);
  if (isNaN(start.getTime())) return "—";
  let months =
    (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
  if (now.getDate() < start.getDate()) months -= 1;
  if (months < 1) return "Less than a month";
  const years = Math.floor(months / 12);
  const rem = months % 12;
  const parts: string[] = [];
  if (years) parts.push(`${years} ${years === 1 ? "year" : "years"}`);
  if (rem) parts.push(`${rem} ${rem === 1 ? "month" : "months"}`);
  return parts.join(", ");
}

/** Two-letter initials from a display name, for avatars. */
export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/** Build a URL-safe slug from a display name. */
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
