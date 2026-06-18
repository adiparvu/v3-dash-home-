"use client";

import { useState } from "react";
import Link from "next/link";
import StatusBar from "../../components/layout/StatusBar";

const fields = [
  { key: "name", label: "Property Name", placeholder: "e.g. Prvio Estate", type: "text" },
  { key: "address", label: "Address", placeholder: "e.g. Str. Principală 12", type: "text" },
  { key: "city", label: "City", placeholder: "e.g. Cluj-Napoca", type: "text" },
  { key: "country", label: "Country", placeholder: "e.g. România", type: "text" },
  { key: "area", label: "Area (m²)", placeholder: "e.g. 450000", type: "number" },
];

export default function NewPropertyPage() {
  const [form, setForm] = useState<Record<string, string>>({
    name: "",
    address: "",
    city: "",
    country: "",
    area: "",
    description: "",
  });
  const [focused, setFocused] = useState<string | null>(null);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    // Placeholder — would call API
  };

  return (
    <div className="min-h-screen pb-10" style={{ background: "#050A14" }}>
      <StatusBar />

      {/* Header */}
      <div className="px-4 pt-1 pb-4 flex items-center gap-3">
        <Link href="/properties">
          <button
            className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.10)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </Link>
        <div>
          <h1 className="text-white font-bold text-xl leading-tight">Add Property</h1>
          <p className="text-[#9CA3AF] text-xs">Fill in the details below</p>
        </div>
      </div>

      {/* Form */}
      <div className="px-4 space-y-3">
        {/* Main fields */}
        {fields.map((field) => (
          <div key={field.key}>
            <label className="text-[#9CA3AF] text-xs font-medium block mb-1.5 px-1">{field.label}</label>
            <div
              className="rounded-2xl overflow-hidden transition-all"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: `1px solid ${focused === field.key ? "rgba(74,222,128,0.40)" : "rgba(255,255,255,0.10)"}`,
                backdropFilter: "blur(20px)",
              }}
            >
              <input
                type={field.type}
                placeholder={field.placeholder}
                value={form[field.key]}
                onChange={(e) => handleChange(field.key, e.target.value)}
                onFocus={() => setFocused(field.key)}
                onBlur={() => setFocused(null)}
                className="w-full bg-transparent px-4 py-3.5 text-white text-sm placeholder-[#4B5563] outline-none"
                style={{ caretColor: "#4ADE80" }}
              />
            </div>
          </div>
        ))}

        {/* Description textarea */}
        <div>
          <label className="text-[#9CA3AF] text-xs font-medium block mb-1.5 px-1">Description</label>
          <div
            className="rounded-2xl overflow-hidden transition-all"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: `1px solid ${focused === "description" ? "rgba(74,222,128,0.40)" : "rgba(255,255,255,0.10)"}`,
              backdropFilter: "blur(20px)",
            }}
          >
            <textarea
              placeholder="Brief description of the property…"
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              onFocus={() => setFocused("description")}
              onBlur={() => setFocused(null)}
              rows={4}
              className="w-full bg-transparent px-4 py-3.5 text-white text-sm placeholder-[#4B5563] outline-none resize-none"
              style={{ caretColor: "#4ADE80" }}
            />
          </div>
        </div>

        {/* Divider */}
        <div className="h-px" style={{ background: "rgba(255,255,255,0.06)" }} />

        {/* Property type picker hint */}
        <div
          className="rounded-2xl p-4 flex items-center gap-3"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(74,222,128,0.12)", border: "1px solid rgba(74,222,128,0.20)" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 9.5L12 3L21 9.5V20C21 20.55 20.55 21 20 21H15V15H9V21H4C3.45 21 3 20.55 3 20V9.5Z"
                stroke="#4ADE80"
                strokeWidth="1.75"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-white text-sm font-medium">Property type</p>
            <p className="text-[#9CA3AF] text-xs">Estate / Farm / Residential</p>
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M9 6L15 12L9 18" stroke="#6B7280" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Add Property primary button */}
        <button
          onClick={handleSubmit}
          className="w-full py-4 rounded-2xl font-semibold text-base transition-all active:scale-[0.97] mt-2"
          style={{
            background: "linear-gradient(135deg, #4ADE80 0%, #22C55E 100%)",
            color: "#050A14",
            boxShadow: "0 0 24px rgba(74,222,128,0.25)",
          }}
        >
          Add Property
        </button>

        {/* Cancel link */}
        <div className="flex justify-center pb-4">
          <Link href="/properties">
            <button className="text-[#9CA3AF] text-sm py-2 px-4">Cancel</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
