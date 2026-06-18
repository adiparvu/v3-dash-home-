"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import StatusBar from "../components/layout/StatusBar";
import BottomNav from "../components/layout/BottomNav";

const docCategories = ["All", "Legal", "Technical", "Financial", "Manuals"];
const DOCS_KEY = "prvio-docs-v1";

type Doc = {
  id: string; name: string; category: string; type: string; size: string;
  date: string; zone: string; icon: string; color: string; pinned: boolean; custom?: boolean;
};

const seedDocuments: Doc[] = [
  { id: "d1", name: "Property Deed – Prvio Estate", category: "Legal", type: "PDF", size: "2.4 MB", date: "Jan 2024", zone: "Estate", icon: "📜", color: "#7C3AED", pinned: true },
  { id: "d2", name: "Purchase Agreement", category: "Legal", type: "PDF", size: "1.1 MB", date: "Jan 2024", zone: "Estate", icon: "📄", color: "#7C3AED", pinned: true },
  { id: "d3", name: "Greenhouse Blueprint", category: "Technical", type: "DWG", size: "8.2 MB", date: "Mar 2023", zone: "Greenhouse", icon: "📐", color: "#22D3EE", pinned: false },
  { id: "d4", name: "Irrigation System Manual", category: "Manuals", type: "PDF", size: "3.7 MB", date: "Feb 2023", zone: "Orchard", icon: "📖", color: "#4ADE80", pinned: false },
  { id: "d5", name: "Lake Pump Service Manual", category: "Manuals", type: "PDF", size: "5.1 MB", date: "Jun 2022", zone: "Lake", icon: "📖", color: "#22D3EE", pinned: false },
  { id: "d6", name: "Q2 2024 Financial Report", category: "Financial", type: "XLSX", size: "420 KB", date: "Jun 2024", zone: "Estate", icon: "💰", color: "#F59E0B", pinned: false },
  { id: "d7", name: "Q3 2024 Budget Plan", category: "Financial", type: "XLSX", size: "380 KB", date: "Jul 2024", zone: "Estate", icon: "💰", color: "#F59E0B", pinned: false },
  { id: "d8", name: "Sensor Network Wiring Diagram", category: "Technical", type: "PDF", size: "1.8 MB", date: "Apr 2023", zone: "Estate", icon: "📡", color: "#22D3EE", pinned: false },
  { id: "d9", name: "Pond Ecosystem Analysis", category: "Technical", type: "PDF", size: "2.2 MB", date: "May 2024", zone: "Smart Pond", icon: "🐟", color: "#22D3EE", pinned: false },
  { id: "d10", name: "Environmental Impact Assessment", category: "Legal", type: "PDF", size: "4.6 MB", date: "Nov 2023", zone: "Forest", icon: "🌲", color: "#4ADE80", pinned: false },
  { id: "d11", name: "Solar Panel Warranty", category: "Legal", type: "PDF", size: "890 KB", date: "Dec 2022", zone: "Estate", icon: "☀️", color: "#F59E0B", pinned: false },
  { id: "d12", name: "HVAC Service History", category: "Technical", type: "PDF", size: "1.3 MB", date: "Aug 2024", zone: "Greenhouse", icon: "🌡️", color: "#4ADE80", pinned: false },
];

const typeColors: Record<string, string> = { PDF: "rgba(239,68,68,0.15)", XLSX: "rgba(74,222,128,0.12)", DWG: "rgba(34,211,238,0.12)", DOC: "rgba(124,58,237,0.12)" };
const typeTextColors: Record<string, string> = { PDF: "#EF4444", XLSX: "#4ADE80", DWG: "#22D3EE", DOC: "#7C3AED" };
const catColor: Record<string, string> = { Legal: "#7C3AED", Technical: "#22D3EE", Financial: "#F59E0B", Manuals: "#4ADE80" };
const catIcon: Record<string, string> = { Legal: "📄", Technical: "📐", Financial: "💰", Manuals: "📖" };

export default function DocumentsPage() {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [customDocs, setCustomDocs] = useState<Doc[]>([]);
  const [mounted, setMounted] = useState(false);

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [cat, setCat] = useState("Legal");
  const [type, setType] = useState("PDF");

  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem(DOCS_KEY);
      if (raw) setCustomDocs(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);
  useEffect(() => {
    if (!mounted) return;
    try { localStorage.setItem(DOCS_KEY, JSON.stringify(customDocs)); } catch { /* ignore */ }
  }, [customDocs, mounted]);

  const addDoc = () => {
    if (!name.trim()) return;
    const now = new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" });
    setCustomDocs((d) => [{
      id: `c${Date.now()}`, name: name.trim(), category: cat, type, size: "—",
      date: now, zone: "Estate", icon: catIcon[cat] ?? "📄", color: catColor[cat] ?? "#4ADE80", pinned: false, custom: true,
    }, ...d]);
    setName(""); setCat("Legal"); setType("PDF"); setOpen(false);
  };

  const documents = [...customDocs, ...seedDocuments];

  const filtered = documents.filter((d) => {
    const matchCat = category === "All" || d.category === category;
    const matchSearch = !search || d.name.toLowerCase().includes(search.toLowerCase()) || d.zone.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const pinned = filtered.filter((d) => d.pinned);
  const rest = filtered.filter((d) => !d.pinned);

  const DocCard = ({ doc }: { doc: Doc }) => (
    <div className="rounded-2xl p-3.5 flex items-center gap-3 liquid-glass">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0" style={{ background: `${doc.color}15`, border: `1px solid ${doc.color}25` }}>
        {doc.icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate" style={{ color: "var(--text-1)" }}>{doc.name}</p>
        <p className="text-text-secondary text-xs">{doc.zone} · {doc.date}</p>
      </div>
      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: typeColors[doc.type] || "var(--glass-bg)", color: typeTextColors[doc.type] || "var(--text-2)" }}>
          {doc.type}
        </span>
        <span className="text-text-tertiary text-[10px]">{doc.size}</span>
      </div>
      {doc.custom && (
        <button onClick={() => setCustomDocs((d) => d.filter((x) => x.id !== doc.id))} aria-label="Delete document" className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0" style={{ color: "var(--text-3)" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" /></svg>
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen pb-28" style={{ color: "var(--text-1)" }}>
      <StatusBar />

      <div className="px-5 pt-1 pb-3 flex items-center gap-3">
        <Link href="/more" className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(255,255,255,0.07)", border: "0.5px solid var(--glass-border)", color: "var(--text-1)" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </Link>
        <h1 className="font-bold text-2xl" style={{ color: "var(--text-1)" }}>Documents</h1>
        <span className="text-text-secondary text-sm ml-1">{documents.length}</span>
      </div>

      {/* Stats strip */}
      <div className="px-4 mb-4">
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: "Total", value: documents.length },
            { label: "Legal", value: documents.filter((d) => d.category === "Legal").length },
            { label: "Technical", value: documents.filter((d) => d.category === "Technical").length },
            { label: "Financial", value: documents.filter((d) => d.category === "Financial").length },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl p-2.5 text-center liquid-glass">
              <p className="font-bold text-lg" style={{ color: "var(--text-1)" }}>{s.value}</p>
              <p className="text-text-secondary text-[10px]">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="px-4 mb-3">
        <div className="flex items-center gap-2 rounded-2xl px-3 py-2.5 liquid-glass">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ color: "var(--text-3)", flexShrink: 0 }}><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.75" /><path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" /></svg>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search documents…" className="flex-1 bg-transparent text-sm outline-none" style={{ color: "var(--text-1)", caretColor: "var(--accent)" }} />
        </div>
      </div>

      {/* Category filter */}
      <div className="px-4 mb-4 flex gap-2 overflow-x-auto scrollbar-hide">
        {docCategories.map((c) => (
          <button key={c} onClick={() => setCategory(c)} className="px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap flex-shrink-0 transition-all"
            style={category === c ? { background: "#4ADE80", color: "#050A14" } : { background: "var(--glass-bg)", color: "var(--text-2)", border: "0.5px solid var(--glass-border)" }}>
            {c}
          </button>
        ))}
      </div>

      <div className="px-4 space-y-3">
        {pinned.length > 0 && (
          <div>
            <p className="text-text-secondary text-xs font-medium uppercase tracking-wide mb-2 px-1">Pinned</p>
            <div className="space-y-2">{pinned.map((d) => <DocCard key={d.id} doc={d} />)}</div>
          </div>
        )}
        <div>
          {pinned.length > 0 && <p className="text-text-secondary text-xs font-medium uppercase tracking-wide mb-2 px-1">All Documents</p>}
          <div className="space-y-2">{rest.map((d) => <DocCard key={d.id} doc={d} />)}</div>
        </div>
      </div>

      {/* Upload FAB */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Add document"
        className="fixed bottom-24 right-4 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg z-20 active:scale-90 transition-transform"
        style={{ background: "linear-gradient(135deg, #4ADE80 0%, #22D3EE 100%)", boxShadow: "0 4px 20px rgba(74,222,128,0.4)" }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="#050A14" strokeWidth="2.5" strokeLinecap="round" /></svg>
      </button>

      {/* Composer */}
      {open && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center" style={{ background: "rgba(0,0,0,0.45)" }} onClick={() => setOpen(false)}>
          <div className="w-full md:w-[390px] rounded-t-[28px] p-5 pb-8 animate-slide-up liquid-glass-strong" onClick={(e) => e.stopPropagation()}>
            <div className="w-10 h-1 rounded-full mx-auto mb-4" style={{ background: "var(--glass-border)" }} />
            <h2 className="font-bold text-lg mb-4" style={{ color: "var(--text-1)" }}>Add Document</h2>
            <label className="text-xs font-medium block mb-1.5 px-1" style={{ color: "var(--text-2)" }}>Name</label>
            <div className="rounded-2xl overflow-hidden mb-4" style={{ background: "var(--glass-bg)", border: "0.5px solid var(--glass-border)" }}>
              <input autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Insurance Policy" className="w-full bg-transparent px-4 py-3.5 text-sm outline-none" style={{ color: "var(--text-1)", caretColor: "var(--accent)" }} />
            </div>
            <label className="text-xs font-medium block mb-2 px-1" style={{ color: "var(--text-2)" }}>Category</label>
            <div className="flex flex-wrap gap-2 mb-4">
              {["Legal", "Technical", "Financial", "Manuals"].map((c) => (
                <button key={c} onClick={() => setCat(c)} className="px-3 py-1.5 rounded-xl text-xs font-medium transition-all active:scale-95" style={cat === c ? { background: "var(--accent)", color: "var(--bg-1)" } : { background: "var(--glass-bg)", color: "var(--text-2)", border: "0.5px solid var(--glass-border)" }}>{c}</button>
              ))}
            </div>
            <label className="text-xs font-medium block mb-2 px-1" style={{ color: "var(--text-2)" }}>Type</label>
            <div className="flex gap-2 mb-6">
              {["PDF", "XLSX", "DWG", "DOC"].map((t) => (
                <button key={t} onClick={() => setType(t)} className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all active:scale-95" style={type === t ? { background: typeColors[t], color: typeTextColors[t], border: `1px solid ${typeTextColors[t]}55` } : { background: "var(--glass-bg)", color: "var(--text-3)", border: "0.5px solid var(--glass-border)" }}>{t}</button>
              ))}
            </div>
            <button onClick={addDoc} disabled={!name.trim()} className="w-full py-3.5 rounded-2xl font-semibold text-base active:scale-[0.97] transition-transform" style={{ background: name.trim() ? "linear-gradient(135deg, #4ADE80 0%, #22C55E 100%)" : "var(--glass-bg)", color: name.trim() ? "#08111E" : "var(--text-3)", border: name.trim() ? "none" : "0.5px solid var(--glass-border)" }}>Add Document</button>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
