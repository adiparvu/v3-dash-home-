"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import StatusBar from "../components/layout/StatusBar";
import BottomNav from "../components/layout/BottomNav";

const specialties = ["All", "Plumbing", "Electrical", "HVAC", "Landscaping", "Tech"];
const CONTRACTORS_KEY = "prvio-contractors-v1";

type Contractor = {
  id: string; name: string; contact: string; phone: string; specialty: string;
  rating: number; jobs: number; status: string; lastJob: string; color: string;
  icon: string; verified: boolean; notes: string; custom?: boolean;
};

const specialtyMeta: Record<string, { color: string; icon: string }> = {
  Plumbing: { color: "#22D3EE", icon: "🔧" },
  Electrical: { color: "#F59E0B", icon: "⚡" },
  HVAC: { color: "#F59E0B", icon: "🌡️" },
  Landscaping: { color: "#4ADE80", icon: "🌿" },
  Tech: { color: "#7C3AED", icon: "📡" },
};

const seedContractors: Contractor[] = [
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
  const [custom, setCustom] = useState<Contractor[]>([]);
  const [mounted, setMounted] = useState(false);

  const [open, setOpen] = useState(false);
  const [fName, setFName] = useState("");
  const [fContact, setFContact] = useState("");
  const [fPhone, setFPhone] = useState("");
  const [fSpec, setFSpec] = useState("Plumbing");

  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem(CONTRACTORS_KEY);
      if (raw) setCustom(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);
  useEffect(() => {
    if (!mounted) return;
    try { localStorage.setItem(CONTRACTORS_KEY, JSON.stringify(custom)); } catch { /* ignore */ }
  }, [custom, mounted]);

  const addContractor = () => {
    if (!fName.trim()) return;
    const meta = specialtyMeta[fSpec] ?? { color: "#4ADE80", icon: "🔧" };
    setCustom((c) => [{
      id: `c${Date.now()}`, name: fName.trim(), contact: fContact.trim() || "—", phone: fPhone.trim() || "—",
      specialty: fSpec, rating: 5.0, jobs: 0, status: "active", lastJob: "—",
      color: meta.color, icon: meta.icon, verified: false, notes: "Recently added contractor.", custom: true,
    }, ...c]);
    setFName(""); setFContact(""); setFPhone(""); setFSpec("Plumbing"); setOpen(false);
  };

  const contractors = [...custom, ...seedContractors];

  const filtered = contractors.filter((c) => {
    const matchSpec = specialty === "All" || c.specialty === specialty;
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.contact.toLowerCase().includes(search.toLowerCase());
    return matchSpec && matchSearch;
  });

  return (
    <div className="min-h-screen pb-28" style={{ background: "var(--bg-1)" }}>
      <StatusBar />

      <div className="px-5 pt-1 pb-3 flex items-center gap-3">
        <Link href="/more" className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 liquid-glass" style={{ color: "var(--text-1)" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
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
                <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: c.status === "active" ? "rgba(74,222,128,0.15)" : "var(--glass-bg)", color: c.status === "active" ? "#4ADE80" : "var(--text-3)" }}>
                  {c.status === "active" ? "Active" : "Inactive"}
                </span>
                <span className="text-text-tertiary text-[10px]">Last: {c.lastJob}</span>
                {c.custom && (
                  <button onClick={() => setCustom((list) => list.filter((x) => x.id !== c.id))} aria-label="Delete contractor" className="mt-0.5" style={{ color: "var(--text-3)" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" /></svg>
                  </button>
                )}
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
        onClick={() => setOpen(true)}
        aria-label="Add contractor"
        className="fixed bottom-24 right-4 w-14 h-14 rounded-2xl flex items-center justify-center z-20 active:scale-90 transition-transform"
        style={{ background: "linear-gradient(135deg, #4ADE80 0%, #22D3EE 100%)", boxShadow: "0 4px 20px rgba(74,222,128,0.4)" }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M12 5v14M5 12h14" stroke="#050A14" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </button>

      {/* Composer */}
      {open && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center" style={{ background: "rgba(0,0,0,0.45)" }} onClick={() => setOpen(false)}>
          <div className="w-full md:w-[390px] rounded-t-[28px] p-5 pb-8 animate-slide-up liquid-glass-strong" onClick={(e) => e.stopPropagation()}>
            <div className="w-10 h-1 rounded-full mx-auto mb-4" style={{ background: "var(--glass-border)" }} />
            <h2 className="font-bold text-lg mb-4" style={{ color: "var(--text-1)" }}>Add Contractor</h2>
            {[
              { label: "Company / Name", val: fName, set: setFName, ph: "e.g. AquaTech Services" },
              { label: "Contact Person", val: fContact, set: setFContact, ph: "e.g. Mihai Ionescu" },
              { label: "Phone", val: fPhone, set: setFPhone, ph: "+40 ..." },
            ].map((f) => (
              <div key={f.label} className="mb-3">
                <label className="text-xs font-medium block mb-1.5 px-1" style={{ color: "var(--text-2)" }}>{f.label}</label>
                <div className="rounded-2xl overflow-hidden" style={{ background: "var(--glass-bg)", border: "0.5px solid var(--glass-border)" }}>
                  <input value={f.val} onChange={(e) => f.set(e.target.value)} placeholder={f.ph} className="w-full bg-transparent px-4 py-3 text-sm outline-none" style={{ color: "var(--text-1)", caretColor: "var(--accent)" }} />
                </div>
              </div>
            ))}
            <label className="text-xs font-medium block mb-2 px-1 mt-1" style={{ color: "var(--text-2)" }}>Specialty</label>
            <div className="flex flex-wrap gap-2 mb-6">
              {Object.keys(specialtyMeta).map((s) => (
                <button key={s} onClick={() => setFSpec(s)} className="px-3 py-1.5 rounded-xl text-xs font-medium transition-all active:scale-95" style={fSpec === s ? { background: "var(--accent)", color: "var(--bg-1)" } : { background: "var(--glass-bg)", color: "var(--text-2)", border: "0.5px solid var(--glass-border)" }}>{s}</button>
              ))}
            </div>
            <button onClick={addContractor} disabled={!fName.trim()} className="w-full py-3.5 rounded-2xl font-semibold text-base active:scale-[0.97] transition-transform" style={{ background: fName.trim() ? "linear-gradient(135deg, #4ADE80 0%, #22C55E 100%)" : "var(--glass-bg)", color: fName.trim() ? "#08111E" : "var(--text-3)", border: fName.trim() ? "none" : "0.5px solid var(--glass-border)" }}>Add Contractor</button>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
