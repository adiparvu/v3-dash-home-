"use client";

import { useState } from "react";
import Link from "next/link";
import StatusBar from "../../components/layout/StatusBar";
import {
  RING_COLORS,
  SOCIAL_PLATFORMS,
  memberSince,
  totalTimeUsing,
  initials,
  type SocialLink,
  type TrustedPerson,
} from "../../lib/store";
import { useProfile } from "../../lib/useProfile";
import { useT, type MessageKey } from "../../lib/i18n";

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

const TRUSTED_PERMISSIONS = [
  "Emergency access",
  "Ownership transfer",
  "Recovery approvals",
  "Estate continuity",
];

const PERM_KEYS: Record<string, MessageKey> = {
  "Emergency access": "prof.perm.emergency",
  "Ownership transfer": "prof.perm.ownership",
  "Recovery approvals": "prof.perm.recovery",
  "Estate continuity": "prof.perm.continuity",
};

export default function ProfilePage() {
  const {
    profile,
    source,
    setProfile,
    addSocialLink,
    removeSocialLink,
    addTrustedPerson,
    removeTrustedPerson,
  } = useProfile();
  const t = useT();

  const [saved, setSaved] = useState(false);

  // Add-social sheet state
  const [socialOpen, setSocialOpen] = useState(false);
  const [socialPlatform, setSocialPlatform] = useState(SOCIAL_PLATFORMS[0].id);
  const [socialUrl, setSocialUrl] = useState("");

  // Add-trusted-person sheet state
  const [trustedOpen, setTrustedOpen] = useState(false);
  const [tpName, setTpName] = useState("");
  const [tpRelationship, setTpRelationship] = useState("");
  const [tpEmail, setTpEmail] = useState("");
  const [tpPerms, setTpPerms] = useState<string[]>([]);

  function save() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function confirmSocial() {
    if (!socialUrl.trim()) return;
    const link: SocialLink = { id: uid(), platform: socialPlatform, url: socialUrl.trim() };
    addSocialLink(link);
    setSocialUrl("");
    setSocialPlatform(SOCIAL_PLATFORMS[0].id);
    setSocialOpen(false);
  }

  function togglePerm(p: string) {
    setTpPerms((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]));
  }

  function confirmTrusted() {
    if (!tpName.trim()) return;
    const person: TrustedPerson = {
      id: uid(),
      name: tpName.trim(),
      relationship: tpRelationship.trim() || "Trusted person",
      email: tpEmail.trim(),
      permissions: tpPerms,
    };
    addTrustedPerson(person);
    setTpName("");
    setTpRelationship("");
    setTpEmail("");
    setTpPerms([]);
    setTrustedOpen(false);
  }

  const ring = RING_COLORS[profile.ringColor] ?? RING_COLORS[0];

  return (
    <div className="min-h-screen pb-10" style={{ background: "var(--bg-1)" }}>
      <StatusBar />

      <div className="px-5 pt-1 pb-4 flex items-center gap-3">
        <Link href="/settings" className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 liquid-glass">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 5l-7 7 7 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </Link>
        <h1 className="font-bold text-xl" style={{ color: "var(--text-1)" }}>{t("set.editProfile")}</h1>
        <span
          className="ml-auto text-[10px] font-medium px-2 py-1 rounded-full"
          style={
            source === "remote"
              ? { background: "rgba(74,222,128,0.12)", border: "1px solid rgba(74,222,128,0.30)", color: "var(--accent)" }
              : { background: "var(--glass-bg)", border: "0.5px solid var(--glass-border)", color: "var(--text-3)" }
          }
        >
          {source === "remote" ? "● Synced" : source === "loading" ? "…" : "Local"}
        </span>
      </div>

      <div className="px-4 space-y-5">
        {/* Avatar */}
        <div className="flex flex-col items-center py-4 gap-3">
          <div className="relative">
            <div className="w-20 h-20 rounded-full flex items-center justify-center p-0.5" style={{ background: ring.value }}>
              <div className="w-full h-full rounded-full flex items-center justify-center" style={{ background: "var(--bg-1)" }}>
                <span className="font-bold text-3xl" style={{ color: "var(--text-1)" }}>{initials(profile.displayName)}</span>
              </div>
            </div>
            <button
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center"
              style={{ background: "var(--accent)" }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" stroke="#050A14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
          <p className="text-text-secondary text-xs">Tap to change photo</p>
        </div>

        {/* Avatar ring color */}
        <div>
          <p className="text-text-secondary text-xs font-medium uppercase tracking-wide mb-2 px-1">{t("prof.avatarRing")}</p>
          <div className="flex gap-3 px-1">
            {RING_COLORS.map((c, i) => (
              <button
                key={c.label}
                aria-label={`${c.label} ring`}
                onClick={() => setProfile({ ringColor: i })}
                className="w-9 h-9 rounded-full p-0.5 transition-all"
                style={{
                  background: c.value,
                  boxShadow: profile.ringColor === i ? `0 0 0 2px var(--bg-1), 0 0 0 4px var(--text-1)` : undefined,
                  transform: profile.ringColor === i ? "scale(1.15)" : undefined,
                }}
              />
            ))}
          </div>
        </div>

        {/* Fields */}
        <div>
          <p className="text-text-secondary text-xs font-medium uppercase tracking-wide mb-2 px-1">{t("prof.personalInfo")}</p>
          <div className="space-y-2">
            {[
              { label: t("prof.firstName"), value: profile.firstName, key: "firstName" as const, placeholder: t("prof.firstName.ph") },
              { label: t("prof.lastName"), value: profile.lastName, key: "lastName" as const, placeholder: t("prof.lastName.ph") },
              { label: t("prof.displayName"), value: profile.displayName, key: "displayName" as const, placeholder: t("prof.displayName.ph") },
              { label: t("prof.email"), value: profile.email, key: "email" as const, placeholder: t("prof.email.ph"), type: "email" },
              { label: t("prof.phone"), value: profile.phone, key: "phone" as const, placeholder: t("prof.phone.ph"), type: "tel" },
            ].map((field) => (
              <div key={field.label} className="rounded-2xl px-4 py-3 liquid-glass">
                <p className="text-text-secondary text-[10px] mb-1 uppercase tracking-wide">{field.label}</p>
                <input
                  type={field.type || "text"}
                  value={field.value}
                  onChange={(e) => setProfile({ [field.key]: e.target.value })}
                  placeholder={field.placeholder}
                  className="w-full bg-transparent text-sm outline-none"
                  style={{ caretColor: "var(--accent)", color: "var(--text-1)" }}
                />
              </div>
            ))}
            <div className="rounded-2xl px-4 py-3 liquid-glass">
              <p className="text-text-secondary text-[10px] mb-1 uppercase tracking-wide">{t("prof.notes")}</p>
              <textarea
                value={profile.notes}
                onChange={(e) => setProfile({ notes: e.target.value })}
                rows={2}
                placeholder={t("prof.notes.ph")}
                className="w-full bg-transparent text-sm outline-none resize-none"
                style={{ caretColor: "var(--accent)", color: "var(--text-1)" }}
              />
            </div>
          </div>
        </div>

        {/* Social media links */}
        <div>
          <div className="flex items-center justify-between mb-2 px-1">
            <p className="text-text-secondary text-xs font-medium uppercase tracking-wide">{t("prof.socialLinks")}</p>
            <button
              onClick={() => setSocialOpen(true)}
              className="flex items-center gap-1 text-xs font-medium"
              style={{ color: "var(--accent)" }}
            >
              <span className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "rgba(74,222,128,0.15)" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="var(--accent)" strokeWidth="2.2" strokeLinecap="round" /></svg>
              </span>
              {t("prof.add")}
            </button>
          </div>
          <div className="rounded-2xl overflow-hidden liquid-glass">
            {profile.socialLinks.length === 0 ? (
              <p className="text-text-tertiary text-xs px-4 py-3.5">{t("prof.noSocial")}</p>
            ) : (
              profile.socialLinks.map((l, i) => {
                const meta = SOCIAL_PLATFORMS.find((p) => p.id === l.platform) ?? SOCIAL_PLATFORMS[SOCIAL_PLATFORMS.length - 1];
                return (
                  <div key={l.id} className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: i < profile.socialLinks.length - 1 ? "1px solid var(--glass-border)" : undefined }}>
                    <span className="text-lg w-7 text-center flex-shrink-0">{meta.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium" style={{ color: "var(--text-1)" }}>{meta.label}</p>
                      <p className="text-text-secondary text-xs truncate">{l.url}</p>
                    </div>
                    <button
                      onClick={() => removeSocialLink(l.id)}
                      aria-label={t("prof.removeLink")}
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(239,68,68,0.10)" }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M5 12h14" stroke="#EF4444" strokeWidth="2.2" strokeLinecap="round" /></svg>
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Trusted persons */}
        <div>
          <div className="flex items-center justify-between mb-2 px-1">
            <p className="text-text-secondary text-xs font-medium uppercase tracking-wide">{t("prof.trustedPersons")}</p>
            <button
              onClick={() => setTrustedOpen(true)}
              className="flex items-center gap-1 text-xs font-medium"
              style={{ color: "var(--accent)" }}
            >
              <span className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "rgba(74,222,128,0.15)" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="var(--accent)" strokeWidth="2.2" strokeLinecap="round" /></svg>
              </span>
              {t("prof.add")}
            </button>
          </div>
          <p className="text-text-tertiary text-[11px] px-1 mb-2">
            {t("prof.trustedNote")}
          </p>
          <div className="space-y-2">
            {profile.trustedPersons.length === 0 ? (
              <div className="rounded-2xl px-4 py-3.5 liquid-glass">
                <p className="text-text-tertiary text-xs">{t("prof.noTrusted")}</p>
              </div>
            ) : (
              profile.trustedPersons.map((tp) => (
                <div key={tp.id} className="rounded-2xl p-3.5 liquid-glass flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg, #7C3AED, #22D3EE)" }}>
                    <span className="text-bg font-bold text-sm" style={{ color: "#050A14" }}>{initials(tp.name)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium" style={{ color: "var(--text-1)" }}>{tp.name}</p>
                    <p className="text-text-secondary text-xs">{tp.relationship}{tp.email ? ` · ${tp.email}` : ""}</p>
                    {tp.permissions.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {tp.permissions.map((p) => (
                          <span key={p} className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ background: "rgba(124,58,237,0.15)", color: "var(--accent-purple)" }}>{PERM_KEYS[p] ? t(PERM_KEYS[p]) : p}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => removeTrustedPerson(tp.id)}
                    aria-label={t("prof.removeTrusted")}
                    className="text-xs px-2.5 py-1 rounded-full flex-shrink-0"
                    style={{ background: "rgba(239,68,68,0.10)", border: "1px solid rgba(239,68,68,0.20)", color: "#EF4444" }}
                  >
                    {t("prof.remove")}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Membership */}
        <div>
          <p className="text-text-secondary text-xs font-medium uppercase tracking-wide mb-2 px-1">{t("prof.membership")}</p>
          <div className="rounded-2xl overflow-hidden liquid-glass">
            {[
              { label: t("prof.role"), value: t("prof.owner") },
              { label: t("prof.accountCreated"), value: new Date(profile.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" }) },
              { label: t("prof.memberSince"), value: memberSince(profile.createdAt) },
              { label: t("prof.totalTime"), value: totalTimeUsing(profile.createdAt) },
            ].map((row, i, arr) => (
              <div key={row.label} className="flex items-center justify-between px-4 py-3 gap-3" style={{ borderBottom: i < arr.length - 1 ? "1px solid var(--glass-border)" : undefined }}>
                <p className="text-text-secondary text-sm flex-shrink-0">{row.label}</p>
                <p className="text-sm font-medium text-right" style={{ color: "var(--text-1)" }}>{row.value}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium" style={{ background: "rgba(74,222,128,0.12)", border: "1px solid rgba(74,222,128,0.30)", color: "var(--accent)" }}>
              <span>🏅</span> {t("prof.memberSinceShort")} {memberSince(profile.createdAt)}
            </span>
          </div>
        </div>

        {/* Save */}
        <button
          onClick={save}
          className="w-full py-3.5 rounded-2xl text-sm font-semibold transition-all"
          style={{
            background: saved ? "rgba(74,222,128,0.2)" : "linear-gradient(135deg, #4ADE80 0%, #22D3EE 100%)",
            color: saved ? "#4ADE80" : "#050A14",
            border: saved ? "1px solid rgba(74,222,128,0.4)" : undefined,
          }}
        >
          {saved ? t("prof.saved") : t("prof.saveChanges")}
        </button>
      </div>

      {/* Add social link sheet */}
      {socialOpen && (
        <Sheet title={t("prof.addSocialLink")} onClose={() => setSocialOpen(false)}>
          <p className="text-text-secondary text-[10px] uppercase tracking-wide mb-2 px-1">{t("prof.platform")}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {SOCIAL_PLATFORMS.map((p) => (
              <button
                key={p.id}
                onClick={() => setSocialPlatform(p.id)}
                className="px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all"
                style={
                  socialPlatform === p.id
                    ? { background: "rgba(74,222,128,0.15)", border: "1px solid rgba(74,222,128,0.35)", color: "var(--accent)" }
                    : { background: "var(--glass-bg)", border: "0.5px solid var(--glass-border)", color: "var(--text-2)" }
                }
              >
                <span>{p.icon}</span>{p.label}
              </button>
            ))}
          </div>
          <div className="rounded-2xl px-4 py-3 liquid-glass mb-4">
            <p className="text-text-secondary text-[10px] mb-1 uppercase tracking-wide">{t("prof.urlHandle")}</p>
            <input
              autoFocus
              value={socialUrl}
              onChange={(e) => setSocialUrl(e.target.value)}
              placeholder="https://… or @handle"
              className="w-full bg-transparent text-sm outline-none"
              style={{ caretColor: "var(--accent)", color: "var(--text-1)" }}
              onKeyDown={(e) => { if (e.key === "Enter") confirmSocial(); }}
            />
          </div>
          <button
            onClick={confirmSocial}
            disabled={!socialUrl.trim()}
            className="w-full py-3 rounded-2xl text-sm font-semibold"
            style={socialUrl.trim() ? { background: "linear-gradient(135deg, #4ADE80, #22D3EE)", color: "#050A14" } : { background: "var(--glass-bg)", border: "0.5px solid var(--glass-border)", color: "var(--text-3)" }}
          >
            {t("prof.addLink")}
          </button>
        </Sheet>
      )}

      {/* Add trusted person sheet */}
      {trustedOpen && (
        <Sheet title={t("prof.addTrustedPerson")} onClose={() => setTrustedOpen(false)}>
          <div className="space-y-2 mb-4">
            {[
              { label: t("prof.name"), value: tpName, set: setTpName, placeholder: t("prof.name.ph") },
              { label: t("prof.relationship"), value: tpRelationship, set: setTpRelationship, placeholder: t("prof.relationship.ph") },
              { label: t("prof.email"), value: tpEmail, set: setTpEmail, placeholder: t("prof.email.ph") },
            ].map((f) => (
              <div key={f.label} className="rounded-2xl px-4 py-3 liquid-glass">
                <p className="text-text-secondary text-[10px] mb-1 uppercase tracking-wide">{f.label}</p>
                <input
                  value={f.value}
                  onChange={(e) => f.set(e.target.value)}
                  placeholder={f.placeholder}
                  className="w-full bg-transparent text-sm outline-none"
                  style={{ caretColor: "var(--accent)", color: "var(--text-1)" }}
                />
              </div>
            ))}
          </div>
          <p className="text-text-secondary text-[10px] uppercase tracking-wide mb-2 px-1">{t("prof.permissions")}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {TRUSTED_PERMISSIONS.map((p) => (
              <button
                key={p}
                onClick={() => togglePerm(p)}
                className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                style={
                  tpPerms.includes(p)
                    ? { background: "rgba(124,58,237,0.18)", border: "1px solid rgba(124,58,237,0.40)", color: "var(--accent-purple)" }
                    : { background: "var(--glass-bg)", border: "0.5px solid var(--glass-border)", color: "var(--text-2)" }
                }
              >
                {PERM_KEYS[p] ? t(PERM_KEYS[p]) : p}
              </button>
            ))}
          </div>
          <button
            onClick={confirmTrusted}
            disabled={!tpName.trim()}
            className="w-full py-3 rounded-2xl text-sm font-semibold"
            style={tpName.trim() ? { background: "linear-gradient(135deg, #4ADE80, #22D3EE)", color: "#050A14" } : { background: "var(--glass-bg)", border: "0.5px solid var(--glass-border)", color: "var(--text-3)" }}
          >
            {t("prof.addTrustedPerson")}
          </button>
        </Sheet>
      )}
    </div>
  );
}

/** Bottom sheet modal matching the iOS-style frame. */
function Sheet({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: "rgba(0,0,0,0.5)" }} onClick={onClose}>
      <div
        className="w-full md:w-[390px] rounded-t-3xl p-5 pb-8 animate-slide-up liquid-glass-strong"
        onClick={(e) => e.stopPropagation()}
        style={{ maxHeight: "85%", overflowY: "auto" }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg" style={{ color: "var(--text-1)" }}>{title}</h2>
          <button onClick={onClose} aria-label="Close" className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "var(--glass-bg)", border: "0.5px solid var(--glass-border)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="var(--text-2)" strokeWidth="2" strokeLinecap="round" /></svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
