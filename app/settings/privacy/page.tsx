"use client";

import { useState } from "react";
import Link from "next/link";
import StatusBar from "../../components/layout/StatusBar";

export default function PrivacyPage() {
  const [analytics, setAnalytics] = useState(false);
  const [crashReports, setCrashReports] = useState(true);

  return (
    <div className="min-h-screen pb-10" style={{ background: "#050A14" }}>
      <StatusBar />

      <div className="px-5 pt-1 pb-4 flex items-center gap-3">
        <Link href="/settings" className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.09)" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 5l-7 7 7 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </Link>
        <h1 className="text-white font-bold text-xl">Privacy & Data</h1>
      </div>

      <div className="px-4 space-y-4">
        {/* Data ownership */}
        <div className="rounded-3xl p-4" style={{ background: "rgba(74,222,128,0.07)", border: "1px solid rgba(74,222,128,0.20)" }}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">🛡️</span>
            <p className="text-white font-semibold text-sm">You own your data</p>
          </div>
          <p className="text-text-secondary text-xs leading-relaxed">
            All your estate data, documents, communications, and AI knowledge bases remain your property at all times. PRVIO Earth never sells your data to third parties.
          </p>
        </div>

        {/* Data collection toggles */}
        <div>
          <p className="text-text-secondary text-xs font-medium uppercase tracking-wide mb-2 px-1">Data Collection</p>
          <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
            {[
              { label: "Analytics", desc: "Help improve the app with usage data", enabled: analytics, toggle: () => setAnalytics(!analytics) },
              { label: "Crash Reports", desc: "Automatically report crashes", enabled: crashReports, toggle: () => setCrashReports(!crashReports) },
            ].map((item, i) => (
              <div key={item.label} className="flex items-center justify-between px-4 py-3.5" style={{ borderBottom: i === 0 ? "1px solid rgba(255,255,255,0.06)" : undefined }}>
                <div>
                  <p className="text-white text-sm font-medium">{item.label}</p>
                  <p className="text-text-secondary text-xs">{item.desc}</p>
                </div>
                <button onClick={item.toggle} className="w-11 h-6 rounded-full relative transition-all duration-200 flex-shrink-0" style={{ background: item.enabled ? "#4ADE80" : "rgba(255,255,255,0.15)" }}>
                  <div className="absolute top-0.5 w-5 h-5 rounded-full transition-all duration-200" style={{ left: item.enabled ? "calc(100% - 22px)" : "2px", background: item.enabled ? "#050A14" : "rgba(255,255,255,0.5)" }} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Rights */}
        <div>
          <p className="text-text-secondary text-xs font-medium uppercase tracking-wide mb-2 px-1">Your Rights (GDPR / CCPA)</p>
          <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
            {[
              { label: "Download My Data", desc: "Export all your data as JSON/CSV", action: "Export" },
              { label: "Request Data Report", desc: "Summary of what we store", action: "Request" },
              { label: "Correct My Information", desc: "Update or rectify your data", action: "Edit" },
              { label: "Restrict Processing", desc: "Limit how we use your data", action: "Manage" },
            ].map((item, i, arr) => (
              <div key={item.label} className="flex items-center justify-between px-4 py-3.5" style={{ borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.06)" : undefined }}>
                <div>
                  <p className="text-white text-sm font-medium">{item.label}</p>
                  <p className="text-text-secondary text-xs">{item.desc}</p>
                </div>
                <button className="text-xs px-3 py-1.5 rounded-full flex-shrink-0" style={{ background: "rgba(74,222,128,0.10)", border: "1px solid rgba(74,222,128,0.25)", color: "#4ADE80" }}>
                  {item.action}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Danger zone */}
        <div>
          <p className="text-text-secondary text-xs font-medium uppercase tracking-wide mb-2 px-1">Danger Zone</p>
          <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.15)" }}>
            <div className="flex items-center justify-between px-4 py-3.5" style={{ borderBottom: "1px solid rgba(239,68,68,0.10)" }}>
              <div>
                <p className="text-white text-sm font-medium">Delete All Data</p>
                <p className="text-text-secondary text-xs">Permanently erase all estate data</p>
              </div>
              <button className="text-xs px-3 py-1.5 rounded-full" style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)", color: "#EF4444" }}>Delete</button>
            </div>
            <div className="flex items-center justify-between px-4 py-3.5">
              <div>
                <p className="text-white text-sm font-medium">Delete Account</p>
                <p className="text-text-secondary text-xs">Close account · subject to legal requirements</p>
              </div>
              <button className="text-xs px-3 py-1.5 rounded-full" style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)", color: "#EF4444" }}>Close</button>
            </div>
          </div>
        </div>

        <p className="text-text-tertiary text-xs text-center pb-4">Compliant with GDPR · CCPA · Privacy by Design</p>
      </div>
    </div>
  );
}
