"use client";

import { useState } from "react";
import Link from "next/link";
import StatusBar from "../../components/layout/StatusBar";

const ringColors = [
  { label: "Green", value: "linear-gradient(135deg, #4ADE80, #22D3EE)" },
  { label: "Purple", value: "linear-gradient(135deg, #7C3AED, #22D3EE)" },
  { label: "Gold", value: "linear-gradient(135deg, #F59E0B, #EF4444)" },
  { label: "Pink", value: "linear-gradient(135deg, #EC4899, #7C3AED)" },
  { label: "Cyan", value: "linear-gradient(135deg, #22D3EE, #4ADE80)" },
  { label: "White", value: "linear-gradient(135deg, #FFFFFF, #9CA3AF)" },
];

export default function ProfilePage() {
  const [name, setName] = useState("Alex Owner");
  const [email, setEmail] = useState("alex@prvio.earth");
  const [phone, setPhone] = useState("+40 700 000 000");
  const [bio, setBio] = useState("Estate owner & nature enthusiast.");
  const [ringColor, setRingColor] = useState(0);
  const [saved, setSaved] = useState(false);

  function save() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="min-h-screen pb-10" style={{ background: "var(--bg-1)" }}>
      <StatusBar />

      <div className="px-5 pt-1 pb-4 flex items-center gap-3">
        <Link href="/settings" className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 liquid-glass">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 5l-7 7 7 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </Link>
        <h1 className="font-bold text-xl" style={{ color: "var(--text-1)" }}>Edit Profile</h1>
      </div>

      <div className="px-4 space-y-5">
        {/* Avatar */}
        <div className="flex flex-col items-center py-4 gap-3">
          <div className="relative">
            <div className="w-20 h-20 rounded-full flex items-center justify-center p-0.5" style={{ background: ringColors[ringColor].value }}>
              <div className="w-full h-full rounded-full flex items-center justify-center" style={{ background: "var(--bg-1)" }}>
                <span className="font-bold text-3xl" style={{ color: "var(--text-1)" }}>A</span>
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
          <p className="text-text-secondary text-xs font-medium uppercase tracking-wide mb-2 px-1">Avatar Ring</p>
          <div className="flex gap-3 px-1">
            {ringColors.map((c, i) => (
              <button
                key={c.label}
                onClick={() => setRingColor(i)}
                className="w-9 h-9 rounded-full p-0.5 transition-all"
                style={{
                  background: c.value,
                  boxShadow: ringColor === i ? `0 0 0 2px #050A14, 0 0 0 4px white` : undefined,
                  transform: ringColor === i ? "scale(1.15)" : undefined,
                }}
              />
            ))}
          </div>
        </div>

        {/* Fields */}
        <div>
          <p className="text-text-secondary text-xs font-medium uppercase tracking-wide mb-2 px-1">Personal Info</p>
          <div className="space-y-2">
            {[
              { label: "Full Name", value: name, onChange: setName, placeholder: "Your name" },
              { label: "Email", value: email, onChange: setEmail, placeholder: "Email address", type: "email" },
              { label: "Phone", value: phone, onChange: setPhone, placeholder: "Phone number", type: "tel" },
            ].map((field) => (
              <div key={field.label} className="rounded-2xl px-4 py-3 liquid-glass">
                <p className="text-text-secondary text-[10px] mb-1 uppercase tracking-wide">{field.label}</p>
                <input
                  type={field.type || "text"}
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full bg-transparent text-sm outline-none"
                  style={{ caretColor: "var(--accent)", color: "var(--text-1)" }}
                />
              </div>
            ))}
            <div className="rounded-2xl px-4 py-3 liquid-glass">
              <p className="text-text-secondary text-[10px] mb-1 uppercase tracking-wide">Bio</p>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={2}
                placeholder="Short bio…"
                className="w-full bg-transparent text-sm outline-none resize-none"
                style={{ caretColor: "var(--accent)", color: "var(--text-1)" }}
              />
            </div>
          </div>
        </div>

        {/* Role / plan */}
        <div>
          <p className="text-text-secondary text-xs font-medium uppercase tracking-wide mb-2 px-1">Account</p>
          <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.04)", border: "0.5px solid var(--glass-border)" }}>
            {[
              { label: "Role", value: "Owner" },
              { label: "Plan", value: "Pro · since Jan 2024" },
              { label: "Member since", value: "January 2024" },
            ].map((row, i, arr) => (
              <div key={row.label} className="flex items-center justify-between px-4 py-3" style={{ borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.06)" : undefined }}>
                <p className="text-text-secondary text-sm">{row.label}</p>
                <p className="text-sm font-medium" style={{ color: "var(--text-1)" }}>{row.value}</p>
              </div>
            ))}
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
          {saved ? "✓ Saved!" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
