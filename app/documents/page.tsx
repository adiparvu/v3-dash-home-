"use client";

import { useState } from "react";
import Link from "next/link";
import StatusBar from "../components/layout/StatusBar";
import BottomNav from "../components/layout/BottomNav";

const docCategories = ["All", "Legal", "Technical", "Financial", "Manuals"];

const documents = [
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

export default function DocumentsPage() {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = documents.filter((d) => {
    const matchCat = category === "All" || d.category === category;
    const matchSearch = !search || d.name.toLowerCase().includes(search.toLowerCase()) || d.zone.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const pinned = filtered.filter((d) => d.pinned);
  const rest = filtered.filter((d) => !d.pinned);

  const typeColors: Record<string, string> = {
    PDF: "rgba(239,68,68,0.15)",
    XLSX: "rgba(74,222,128,0.12)",
    DWG: "rgba(34,211,238,0.12)",
  };
  const typeTextColors: Record<string, string> = {
    PDF: "#EF4444",
    XLSX: "#4ADE80",
    DWG: "#22D3EE",
  };

  const DocCard = ({ doc }: { doc: typeof documents[0] }) => (
    <div className="rounded-2xl p-3.5 flex items-center gap-3 active:scale-[0.98] transition-transform" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0" style={{ background: `${doc.color}15`, border: `1px solid ${doc.color}25` }}>
        {doc.icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-medium truncate">{doc.name}</p>
        <p className="text-text-secondary text-xs">{doc.zone} · {doc.date}</p>
      </div>
      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: typeColors[doc.type] || "rgba(255,255,255,0.08)", color: typeTextColors[doc.type] || "white" }}>
          {doc.type}
        </span>
        <span className="text-text-tertiary text-[10px]">{doc.size}</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pb-28" style={{ background: "#050A14" }}>
      <StatusBar />

      <div className="px-5 pt-1 pb-3 flex items-center gap-3">
        <Link href="/more" className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.09)" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 5l-7 7 7 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </Link>
        <h1 className="text-white font-bold text-2xl">Documents</h1>
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
            <div key={s.label} className="rounded-2xl p-2.5 text-center" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <p className="text-white font-bold text-lg">{s.value}</p>
              <p className="text-text-secondary text-[10px]">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="px-4 mb-3">
        <div className="flex items-center gap-2 rounded-2xl px-3 py-2.5" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="#6B7280" strokeWidth="1.75" /><path d="M16.5 16.5L21 21" stroke="#6B7280" strokeWidth="1.75" strokeLinecap="round" /></svg>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search documents…" className="flex-1 bg-transparent text-white text-sm placeholder-text-tertiary outline-none" />
        </div>
      </div>

      {/* Category filter */}
      <div className="px-4 mb-4 flex gap-2 overflow-x-auto scrollbar-hide">
        {docCategories.map((c) => (
          <button key={c} onClick={() => setCategory(c)} className="px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap flex-shrink-0 transition-all"
            style={category === c ? { background: "#4ADE80", color: "#050A14" } : { background: "rgba(255,255,255,0.07)", color: "#9CA3AF", border: "1px solid rgba(255,255,255,0.09)" }}>
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
        className="fixed bottom-24 right-4 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg z-20"
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
