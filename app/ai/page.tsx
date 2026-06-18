"use client";

import { useState, useRef, useEffect } from "react";
import StatusBar from "../components/layout/StatusBar";
import BottomNav from "../components/layout/BottomNav";
import { useStore } from "../lib/store";

const suggestions = [
  "What's the health status of my forest zone?",
  "When should I harvest the orchard?",
  "Is my greenhouse CO₂ level safe?",
  "How many zones and assets do I have?",
];

type Msg = { id: number; role: "user" | "assistant"; content: string };

const initial: Msg[] = [
  {
    id: 1,
    role: "assistant",
    content:
      "Hello! I'm your PRVIO Earth AI Assistant. I have full knowledge of your estate — zones, sensors, tasks, and history. How can I help you today?",
  },
];

export default function AIPage() {
  const { estateName, addedZones, addedAssets } = useStore();
  const [input, setInput] = useState("");
  const [chat, setChat] = useState<Msg[]>(initial);
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const totalZones = 26 + addedZones.length;
  const totalAssets = 140 + addedAssets.length;

  // Lightweight on-device knowledge engine over the estate's data.
  const answer = (raw: string): string => {
    const q = raw.toLowerCase();
    const has = (...w: string[]) => w.some((x) => q.includes(x));

    if (has("hello", "hi", "hey")) return `Hi! Everything at ${estateName} is running smoothly. Ask me about any zone, your tasks, or maintenance.`;
    if (has("forest")) return "🌲 The Forest zone is in good shape — health score 91/100, biodiversity high, ~2,543 trees tracked. No action needed this week.";
    if (has("lake")) return "💧 Lake zone: water quality Excellent, temp 18.4°C, pH 7.2, fish population healthy. Health score 95/100.";
    if (has("greenhouse") || has("co2", "co₂")) return "🏡 Greenhouse: 24.3°C, humidity 65%. CO₂ is 800 ppm — slightly above the 600–700 optimal range. I'd open the vents; your 'Greenhouse Temperature Alert' automation will trigger at 30°C.";
    if (has("orchard") || has("harvest")) return "🍎 Orchard: projected harvest in ~23 days, estimated yield 12.4 t, flowering at 75%. Irrigation is optimal and disease risk is low.";
    if (has("pond")) return "🐟 Smart Pond: pH 7.4, O₂ 8.2 mg/L, health 96/100. Auto-feeder ran twice today.";
    if (has("zone")) return `You have ${totalZones} zones across the estate${addedZones.length ? ` (${addedZones.length} you added)` : ""}. Overall estate health is 87/100 — Very Good.`;
    if (has("asset", "object", "inventory")) return `Inventory holds ${totalAssets} assets${addedAssets.length ? ` (${addedAssets.length} added by you)` : ""}: 118 active, 7 in maintenance, 3 offline.`;
    if (has("task", "to-do", "todo", "pending")) return "You have a few pending tasks — the highest priority is 'Irrigation System Maintenance' (Orchard), due today. Want me to mark it in progress?";
    if (has("maintenance", "pump", "service")) return "🔧 Next maintenance: Lake pump filter replacement is scheduled. The pump's last run was 5h ago at 97% success. I can schedule a service window if you'd like.";
    if (has("health", "score", "status", "overview")) return `${estateName} overview: health 87/100 (Very Good), ${totalZones} zones, ${totalAssets} assets, 3 active alerts. The main watch item is greenhouse CO₂.`;
    if (has("alert", "warning", "problem")) return "⚠️ 3 active alerts: irrigation maintenance due (3 days), greenhouse CO₂ above optimal, and orchard irrigation warranty expiring. Forest health actually improved to 91.";
    if (has("weather", "rain", "temperature")) return "🌤️ Conditions are mild today. No rain forecast for 48h — irrigation automations will run on their normal schedule.";
    if (has("thank")) return "Anytime! I'm always monitoring your estate in the background. 🌿";

    return `I can help with zones, assets, tasks, maintenance and alerts for ${estateName}. Try asking about a specific zone (e.g. "greenhouse"), your tasks, or "estate overview".`;
  };

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Msg = { id: Date.now(), role: "user", content: text.trim() };
    setChat((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);
    const reply = answer(text);
    setTimeout(() => {
      setChat((prev) => [...prev, { id: Date.now() + 1, role: "assistant", content: reply }]);
      setTyping(false);
    }, 650);
  };

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [chat, typing]);

  return (
    <div className="min-h-screen flex flex-col" style={{ color: "var(--text-1)" }}>
      <StatusBar />

      {/* Header */}
      <div className="px-5 pt-1 pb-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-2xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, rgba(124,58,237,0.3), rgba(34,211,238,0.3))",
              border: "1px solid rgba(124,58,237,0.4)",
              boxShadow: "0 0 20px rgba(124,58,237,0.2)",
            }}
          >
            <span className="text-base">✨</span>
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight" style={{ color: "var(--text-1)" }}>AI Assistant</h1>
            <div className="flex items-center gap-1">
              <span className="w-1 h-1 rounded-full" style={{ background: "var(--accent)" }} />
              <span className="text-[10px]" style={{ color: "var(--accent)" }}>Online</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => setChat(initial)}
          aria-label="New chat"
          className="w-9 h-9 rounded-2xl flex items-center justify-center"
          style={{ background: "var(--glass-bg)", border: "0.5px solid var(--glass-border)", color: "var(--text-2)" }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" /></svg>
        </button>
      </div>

      {/* Chat area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 pb-4 space-y-3">
        {chat.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "assistant" && (
              <div className="w-7 h-7 rounded-xl flex items-center justify-center text-sm mr-2 mt-auto flex-shrink-0" style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.3), rgba(34,211,238,0.3))", border: "1px solid rgba(124,58,237,0.3)" }}>
                ✨
              </div>
            )}
            <div
              className="max-w-[80%] rounded-2xl px-4 py-3"
              style={
                msg.role === "user"
                  ? { background: "linear-gradient(135deg, #7C3AED, #4F46E5)", borderBottomRightRadius: 6, color: "#fff" }
                  : { background: "var(--glass-bg)", border: "0.5px solid var(--glass-border)", borderBottomLeftRadius: 6, color: "var(--text-1)" }
              }
            >
              <p className="text-sm leading-relaxed">{msg.content}</p>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {typing && (
          <div className="flex justify-start">
            <div className="w-7 h-7 rounded-xl flex items-center justify-center text-sm mr-2 mt-auto flex-shrink-0" style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.3), rgba(34,211,238,0.3))", border: "1px solid rgba(124,58,237,0.3)" }}>✨</div>
            <div className="rounded-2xl px-4 py-3.5 flex items-center gap-1" style={{ background: "var(--glass-bg)", border: "0.5px solid var(--glass-border)", borderBottomLeftRadius: 6 }}>
              {[0, 1, 2].map((i) => (
                <span key={i} className="w-1.5 h-1.5 rounded-full animate-pulse-glow" style={{ background: "var(--text-3)", animationDelay: `${i * 0.2}s` }} />
              ))}
            </div>
          </div>
        )}

        {/* Suggestions */}
        {chat.length <= 1 && !typing && (
          <div className="space-y-2 mt-4">
            <p className="text-xs px-1" style={{ color: "var(--text-2)" }}>Suggested questions</p>
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="w-full text-left rounded-2xl px-4 py-3 text-sm active:scale-[0.98] transition-transform liquid-glass"
                style={{ color: "var(--text-1)" }}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="px-4 pb-28 pt-2 flex-shrink-0">
        <div className="rounded-2xl flex items-end gap-2 p-2" style={{ background: "var(--glass-bg)", border: "0.5px solid var(--glass-border)" }}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your estate..."
            rows={1}
            className="flex-1 bg-transparent text-sm outline-none resize-none px-2 py-1.5"
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
            style={{ maxHeight: 100, color: "var(--text-1)", caretColor: "var(--accent)" }}
          />
          <button
            onClick={() => send(input)}
            disabled={!input.trim()}
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all"
            style={input.trim() ? { background: "linear-gradient(135deg, #4ADE80, #22D3EE)", boxShadow: "0 0 12px rgba(74,222,128,0.3)" } : { background: "var(--glass-bg)", border: "0.5px solid var(--glass-border)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" stroke={input.trim() ? "#050A14" : "var(--text-3)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
