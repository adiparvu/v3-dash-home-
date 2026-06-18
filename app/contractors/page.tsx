"use client";

import { useState } from "react";
import Link from "next/link";
import StatusBar from "../components/layout/StatusBar";
import BottomNav from "../components/layout/BottomNav";

const specialties = ["All", "Plumbing", "Electrical", "HVAC", "Landscaping", "Tech"];

const contractors = [
  { id: "c1", name: "AquaTech Services", contact: "Mihai Ionescu", phone: "+40 722 000 001", specialty: "Plumbing", rating: 4.9, jobs: 12, status: "active", lastJob: "Jun 12", color: "#22D3EE", icon: "🔧", verified: true, notes: "Specializes in lake and pond pump systems." },
  { id: "c2", name: "GreenGrow Landscaping", contact: "Elena Popa", phone: "+40 722 000 002", specialty: "Landscaping", rating: 4.8, jobs: 8, status: "active", lastJob: "Jun 8", color: "#4ADE80", icon: "🌿", verified: true, notes: "Orchard pruning and garden maintenance." },
  { id: "c3", name: "ClimaSmart HVAC", contact: "Dan Marin", phone: "+40 722 000 003", specialty: "HVAC", rating: 4.7, jobs: 5, status: "active", lastJob: "May 30", color: "#F59E0B", icon: "🌡️", verified: true, notes: "Greenhouse climate control systems." },
  { id: "c4", name: "VoltPro Electrical", contact: "Andrei Dumitrescu", phone: "+40 722 000 004", specialty: "Electrical", rating: 4.9, jobs: 7, status: "active", lastJob: "May 15", color: "#F59E0B", icon: "⚡", verified: true, notes: "Solar and general estate electrical." },
  { id: "c5", name: "SmartHome Solutions", contact: "Radu Voinea", phone: "+40 722 000 005", specialty: "Tech", rating: 4.6, jobs: 4, status: "active", lastJob: "Apr 20", color: "#7C3AED", icon: "📡", verified: false, notes: "Home automation and sensor installation." },
  { id: "c6", name: "ForesTech Environmental", contact: "Ioana Constantin", phone: "+40 722 000 006", specialty: "Landscaping", rating: 4.5, jobs: 3, status: "inactive", lastJob: "Mar 10", color: "#4ADE80", icon: "🌲", verified: false, notes: "Forest health assessment." },
];

function Stars({ n }: { n: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} width="9" height="9" viewBox="0 0 24 24" fill={i <= Math.round(n) ? "#F59E0B" : "none"} stroke="#F59E0B" strokeWidth="1.5">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export default function ContractorsPage() {
  const [specialty, setSpecialty] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = contractors.filter((c) => {
    const matchSpec = specialty === "All" || c.specialty === specialty;
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.contact.toLowerCase().includes(search.toLowerCase());
    return matchSpec && matchSearch;
  });

  return (
    <div className="min-h-screen pb-28" style={{ background: "var(--bg-1)" }}>
      <StatusBar />

      <div className="px-5 pt-1 pb-3 flex items-center gap-3">
        <Link href="/more" className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 liquid-glass">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 5l-7 7 7 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </Link>
        <h1 className="font-bold text-2xl" style={{ color: "var(--text-1)" }}>Contractors</h1>
      </div>

      {/* Search */}
      <div className="px-4 mb-3">
        <div className="flex items-center gap-2 rounded-2xl px-3 py-2.5 liquid-glass">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="#6B7280" strokeWidth="1.75" /><path d="M16.5 16.5L21 21" stroke="#6B7280" strokeWidth="1.75" strokeLinecap="round" /></svg>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search contractors…" className="flex-1 bg-transparent text-sm placeholder-text-tertiary outline-none" style={{ color: "var(--text-1)" }} />
        </div>
      </div>

      {/* Filter */}
      <div className="px-4 mb-4 flex gap-2 overflow-x-auto scrollbar-hide">
        {specialties.map((s) => (
          <button key={s} onClick={() => setSpecialty(s)} className="px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap flex-shrink-0 transition-all"
            style={specialty === s ? { background: "var(--accent)", color: "#050A14" } : { background: "rgba(255,255,255,0.07)", color: "var(--text-3)", border: "1px solid rgba(255,255,255,0.09)" }}>
            {s}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="px-4 space-y-3">
        {filtered.map((c) => (
          <div key={c.id} className="rounded-3xl p-4 liquid-glass">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: `${c.color}15`, border: `1px solid ${c.color}25` }}>
                {c.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-sm" style={{ color: "var(--text-1)" }}>{c.name}</p>
                  {c.verified && (
                    <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full" style={{ background: "rgba(74,222,128,0.15)", color: "#4ADE80" }}>✓ Verified</span>
                  )}
                </div>
                <p className="text-text-secondary text-xs">{c.contact} · {c.specialty}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <Stars n={c.rating} />
                  <span className="text-text-secondary text-xs">{c.rating} · {c.jobs} jobs</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: c.status === "active" ? "rgba(74,222,128,0.15)" : "rgba(255,255,255,0.08)", color: c.status === "active" ? "#4ADE80" : "#9CA3AF" }}>
                  {c.status === "active" ? "Active" : "Inactive"}
                </span>
                <span className="text-text-tertiary text-[10px]">Last: {c.lastJob}</span>
              </div>
            </div>

            <p className="text-text-secondary text-xs mb-3 leading-relaxed">{c.notes}</p>

            <div className="flex gap-2">
              <a href={`tel:${c.phone}`} className="flex-1 py-2 rounded-xl text-xs font-medium text-center flex items-center justify-center gap-1.5" style={{ background: "rgba(74,222,128,0.12)", border: "1px solid rgba(74,222,128,0.25)", color: "#4ADE80" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z" stroke="#4ADE80" strokeWidth="1.75" /></svg>
                Call
              </a>
              <button className="flex-1 py-2 rounded-xl text-xs font-medium" style={{ background: "rgba(255,255,255,0.07)", border: "0.5px solid var(--glass-border)", color: "var(--text-1)" }}>
                Message
              </button>
              <button className="flex-1 py-2 rounded-xl text-xs font-medium" style={{ background: "rgba(255,255,255,0.07)", border: "0.5px solid var(--glass-border)", color: "var(--text-1)" }}>
                Schedule
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add FAB */}
      <button
        className="fixed bottom-24 right-4 w-14 h-14 rounded-2xl flex items-center justify-center z-20"
        style={{ background: "linear-gradient(135deg, #4ADE80 0%, #22D3EE 100%)", boxShadow: "0 4px 20px rgba(74,222,128,0.4)" }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M12 5v14M5 12h14" stroke="#050A14" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </button>

      <BottomNav />
    </div>
  );
}
