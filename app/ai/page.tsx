"use client";

import { useState } from "react";
import StatusBar from "../components/layout/StatusBar";
import BottomNav from "../components/layout/BottomNav";

const suggestions = [
  "What's the health status of my forest zone?",
  "When should I harvest the orchard?",
  "Is my greenhouse CO₂ level safe?",
  "Schedule maintenance for the lake pump",
];

const messages = [
  {
    id: 1,
    role: "assistant",
    content: "Hello! I'm your PRVIO Earth AI Assistant. I have full knowledge of your estate — zones, sensors, tasks, and history. How can I help you today?",
  },
];

export default function AIPage() {
  const [input, setInput] = useState("");
  const [chat, setChat] = useState(messages);

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg = { id: Date.now(), role: "user" as const, content: text };
    const aiMsg = {
      id: Date.now() + 1,
      role: "assistant" as const,
      content: "I'm analyzing your estate data... This feature will be connected to the AI backend once Supabase and the AI layer are configured. Your estate has 5 zones, 142 assets, and 7 pending tasks.",
    };
    setChat((prev) => [...prev, userMsg, aiMsg]);
    setInput("");
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#050A14" }}>
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
            <h1 className="text-white font-bold text-lg leading-tight">AI Assistant</h1>
            <div className="flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-accent-green" />
              <span className="text-accent-green text-[10px]">Online</span>
            </div>
          </div>
        </div>
        <button
          className="w-9 h-9 rounded-2xl flex items-center justify-center"
          style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.09)" }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="#9CA3AF" strokeWidth="1.75" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3">
        {chat.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "assistant" && (
              <div
                className="w-7 h-7 rounded-xl flex items-center justify-center text-sm mr-2 mt-auto flex-shrink-0"
                style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.3), rgba(34,211,238,0.3))", border: "1px solid rgba(124,58,237,0.3)" }}
              >
                ✨
              </div>
            )}
            <div
              className="max-w-[80%] rounded-2xl px-4 py-3"
              style={
                msg.role === "user"
                  ? { background: "linear-gradient(135deg, #7C3AED, #4F46E5)", borderBottomRightRadius: 6 }
                  : { background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.09)", borderBottomLeftRadius: 6 }
              }
            >
              <p className="text-white text-sm leading-relaxed">{msg.content}</p>
            </div>
          </div>
        ))}

        {/* Suggestions (shown when chat is empty-ish) */}
        {chat.length <= 1 && (
          <div className="space-y-2 mt-4">
            <p className="text-text-secondary text-xs px-1">Suggested questions</p>
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="w-full text-left rounded-2xl px-4 py-3 text-sm text-white active:scale-[0.98] transition-transform"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="px-4 pb-28 pt-2 flex-shrink-0">
        <div
          className="rounded-2xl flex items-end gap-2 p-2"
          style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your estate..."
            rows={1}
            className="flex-1 bg-transparent text-white text-sm placeholder-text-secondary outline-none resize-none px-2 py-1.5"
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
            style={{ maxHeight: 100 }}
          />
          <button
            onClick={() => send(input)}
            disabled={!input.trim()}
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all"
            style={
              input.trim()
                ? { background: "linear-gradient(135deg, #4ADE80, #22D3EE)", boxShadow: "0 0 12px rgba(74,222,128,0.3)" }
                : { background: "rgba(255,255,255,0.10)" }
            }
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" stroke={input.trim() ? "#050A14" : "#6B7280"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
