"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import StatusBar from "../components/layout/StatusBar";
import BottomNav from "../components/layout/BottomNav";

const rooms = [
  { id: "general", name: "General", icon: "🏡", type: "group", unread: 0 },
  { id: "estate", name: "Estate Team", icon: "👥", type: "group", unread: 2 },
  { id: "greenhouse", name: "Greenhouse", icon: "🏡", type: "zone", unread: 1 },
  { id: "lake", name: "Lake Zone", icon: "💧", type: "zone", unread: 0 },
  { id: "orchard", name: "Orchard", icon: "🍎", type: "zone", unread: 0 },
  { id: "ion", name: "Ion (Caretaker)", icon: "👨‍🌾", type: "dm", unread: 3 },
  { id: "ana", name: "Ana (Manager)", icon: "👩‍💼", type: "dm", unread: 0 },
];

const messagesData: Record<string, Message[]> = {
  general: [
    { id: 1, author: "Ion", role: "Caretaker", avatar: "👨‍🌾", avatarColor: "#22D3EE", text: "Morning! Irrigation ran fine this morning, orchard looks great.", time: "7:02", mine: false },
    { id: 2, author: "Ana", role: "Manager", avatar: "👩‍💼", avatarColor: "#7C3AED", text: "Thanks Ion. I'll be on-site around 10. Can you make sure the greenhouse vents are open?", time: "7:15", mine: false },
    { id: 3, author: "Ion", role: "Caretaker", avatar: "👨‍🌾", avatarColor: "#22D3EE", text: "Done, vents are open. CO₂ is back in range 780 ppm.", time: "7:22", mine: false },
    { id: 4, author: "You", role: "Owner", avatar: "🏠", avatarColor: "#4ADE80", text: "Great work everyone. Let's review the pond sensors when I'm back Friday.", time: "9:45", mine: true },
    { id: 5, author: "Ana", role: "Manager", avatar: "👩‍💼", avatarColor: "#7C3AED", text: "Noted! I'll prep the report by Thursday.", time: "9:47", mine: false },
  ],
  estate: [
    { id: 1, author: "System", role: "Bot", avatar: "⚡", avatarColor: "#F59E0B", text: "Morning Irrigation automation ran successfully at 06:00.", time: "6:00", mine: false, system: true },
    { id: 2, author: "Ana", role: "Manager", avatar: "👩‍💼", avatarColor: "#7C3AED", text: "Q3 maintenance schedule is ready for review in Documents.", time: "8:30", mine: false },
    { id: 3, author: "You", role: "Owner", avatar: "🏠", avatarColor: "#4ADE80", text: "Approved. Go ahead with the pump inspection next week.", time: "10:12", mine: true },
  ],
  greenhouse: [
    { id: 1, author: "System", role: "Bot", avatar: "⚡", avatarColor: "#F59E0B", text: "CO₂ alert: 850 ppm detected. Above optimal range.", time: "5m ago", mine: false, system: true },
    { id: 2, author: "Ion", role: "Caretaker", avatar: "👨‍🌾", avatarColor: "#22D3EE", text: "On it — opening vents manually now.", time: "4m ago", mine: false },
    { id: 3, author: "System", role: "Bot", avatar: "⚡", avatarColor: "#4ADE80", text: "CO₂ normalized: 780 ppm. All good.", time: "1m ago", mine: false, system: true },
  ],
  lake: [
    { id: 1, author: "You", role: "Owner", avatar: "🏠", avatarColor: "#4ADE80", text: "Water temperature is perfect today. Any plans for the new sensor placement?", time: "Yesterday", mine: true },
    { id: 2, author: "Ion", role: "Caretaker", avatar: "👨‍🌾", avatarColor: "#22D3EE", text: "Planning to install the DO sensor near the inlet this week.", time: "Yesterday", mine: false },
  ],
  orchard: [
    { id: 1, author: "Ion", role: "Caretaker", avatar: "👨‍🌾", avatarColor: "#22D3EE", text: "First batch of apples ready in ~3 weeks. Yield looking around 12 tonnes.", time: "2d ago", mine: false },
    { id: 2, author: "You", role: "Owner", avatar: "🏠", avatarColor: "#4ADE80", text: "Excellent. Book the contractor for harvesting.", time: "2d ago", mine: true },
  ],
  ion: [
    { id: 1, author: "Ion", role: "Caretaker", avatar: "👨‍🌾", avatarColor: "#22D3EE", text: "Hey, the lake pump is making a noise. Should I call the repair service?", time: "10:30", mine: false },
    { id: 2, author: "You", role: "Owner", avatar: "🏠", avatarColor: "#4ADE80", text: "Yes, go ahead. Use the usual contractor.", time: "10:45", mine: true },
    { id: 3, author: "Ion", role: "Caretaker", avatar: "👨‍🌾", avatarColor: "#22D3EE", text: "Booked for tomorrow morning 9am.", time: "10:47", mine: false },
    { id: 4, author: "Ion", role: "Caretaker", avatar: "👨‍🌾", avatarColor: "#22D3EE", text: "Also — should I fertilize the orchard this week or wait for the rain?", time: "11:02", mine: false },
    { id: 5, author: "Ion", role: "Caretaker", avatar: "👨‍🌾", avatarColor: "#22D3EE", text: "Rain is forecast Wednesday.", time: "11:02", mine: false },
  ],
  ana: [
    { id: 1, author: "Ana", role: "Manager", avatar: "👩‍💼", avatarColor: "#7C3AED", text: "I've updated the Q3 budget proposal. Let me know your thoughts.", time: "Yesterday", mine: false },
    { id: 2, author: "You", role: "Owner", avatar: "🏠", avatarColor: "#4ADE80", text: "I'll review tonight.", time: "Yesterday", mine: true },
  ],
};

interface Message {
  id: number;
  author: string;
  role: string;
  avatar: string;
  avatarColor: string;
  text: string;
  time: string;
  mine: boolean;
  system?: boolean;
}

export default function ChatPage() {
  const [activeRoom, setActiveRoom] = useState("general");
  const [showRooms, setShowRooms] = useState(false);
  const [messages, setMessages] = useState<Record<string, Message[]>>(messagesData);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const room = rooms.find((r) => r.id === activeRoom)!;
  const currentMessages = messages[activeRoom] || [];
  const totalUnread = rooms.reduce((s, r) => s + r.unread, 0);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeRoom, messages]);

  function sendMessage() {
    const text = input.trim();
    if (!text) return;
    const newMsg: Message = {
      id: Date.now(),
      author: "You",
      role: "Owner",
      avatar: "🏠",
      avatarColor: "#4ADE80",
      text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      mine: true,
    };
    setMessages((prev) => ({
      ...prev,
      [activeRoom]: [...(prev[activeRoom] || []), newMsg],
    }));
    setInput("");
    inputRef.current?.focus();
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function switchRoom(id: string) {
    setActiveRoom(id);
    setShowRooms(false);
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#050A14" }}>
      <StatusBar />

      {/* Header */}
      <div className="px-4 pt-1 pb-3 flex items-center gap-3 flex-shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <button
          onClick={() => setShowRooms(!showRooms)}
          className="w-9 h-9 rounded-2xl flex items-center justify-center relative flex-shrink-0"
          style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.09)" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M4 6h16M4 12h16M4 18h16" stroke="white" strokeWidth="1.75" strokeLinecap="round" />
          </svg>
          {totalUnread > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center" style={{ background: "#4ADE80", color: "#050A14" }}>
              {totalUnread}
            </span>
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-base">{room.icon}</span>
            <h1 className="text-white font-semibold text-base truncate">{room.name}</h1>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full flex-shrink-0" style={{
              background: room.type === "dm" ? "rgba(124,58,237,0.15)" : room.type === "zone" ? "rgba(34,211,238,0.12)" : "rgba(74,222,128,0.12)",
              color: room.type === "dm" ? "#7C3AED" : room.type === "zone" ? "#22D3EE" : "#4ADE80",
            }}>
              {room.type === "dm" ? "DM" : room.type === "zone" ? "Zone" : "Group"}
            </span>
          </div>
        </div>

        <button className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.09)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="1.5" fill="white" />
            <circle cx="6" cy="12" r="1.5" fill="white" />
            <circle cx="18" cy="12" r="1.5" fill="white" />
          </svg>
        </button>
      </div>

      {/* Room drawer overlay */}
      {showRooms && (
        <div className="absolute inset-0 z-40 flex" style={{ top: 0 }} onClick={() => setShowRooms(false)}>
          <div className="w-72 h-full flex flex-col pt-16 pb-4" style={{ background: "rgba(5,10,20,0.98)", borderRight: "1px solid rgba(255,255,255,0.08)" }} onClick={(e) => e.stopPropagation()}>
            <div className="px-4 mb-3">
              <p className="text-white font-bold text-lg">Messages</p>
            </div>

            {[
              { label: "Group Chats", items: rooms.filter((r) => r.type === "group") },
              { label: "Zone Channels", items: rooms.filter((r) => r.type === "zone") },
              { label: "Direct Messages", items: rooms.filter((r) => r.type === "dm") },
            ].map((section) => (
              <div key={section.label} className="mb-3">
                <p className="text-text-secondary text-[10px] font-medium uppercase tracking-wide px-4 mb-1">{section.label}</p>
                {section.items.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => switchRoom(r.id)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 transition-colors"
                    style={{ background: activeRoom === r.id ? "rgba(74,222,128,0.08)" : "transparent" }}
                  >
                    <span className="text-lg w-7 text-center">{r.icon}</span>
                    <span className="flex-1 text-sm font-medium text-left" style={{ color: activeRoom === r.id ? "#4ADE80" : "white" }}>{r.name}</span>
                    {r.unread > 0 && (
                      <span className="w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center" style={{ background: "#4ADE80", color: "#050A14" }}>
                        {r.unread}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1 pb-4" style={{ overflowAnchor: "none" }}>
        {currentMessages.map((msg, i) => {
          const prevMsg = currentMessages[i - 1];
          const showMeta = !prevMsg || prevMsg.author !== msg.author || prevMsg.system !== msg.system;

          if (msg.system) {
            return (
              <div key={msg.id} className="flex items-center gap-2 py-2 justify-center">
                <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.06)" }} />
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <span className="text-xs">{msg.avatar}</span>
                  <span className="text-text-secondary text-[11px]">{msg.text}</span>
                  <span className="text-text-tertiary text-[10px]">{msg.time}</span>
                </div>
                <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.06)" }} />
              </div>
            );
          }

          if (msg.mine) {
            return (
              <div key={msg.id} className={`flex flex-col items-end ${showMeta ? "mt-3" : "mt-0.5"}`}>
                <div
                  className="max-w-[75%] px-3.5 py-2.5 rounded-[18px] rounded-tr-md text-sm leading-relaxed"
                  style={{ background: "linear-gradient(135deg, #4ADE80 0%, #22D3EE 100%)", color: "#050A14", fontWeight: 500 }}
                >
                  {msg.text}
                </div>
                {showMeta && (
                  <span className="text-text-tertiary text-[10px] mt-0.5 mr-1">{msg.time}</span>
                )}
              </div>
            );
          }

          return (
            <div key={msg.id} className={`flex items-end gap-2 ${showMeta ? "mt-3" : "mt-0.5"}`}>
              {showMeta ? (
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0"
                  style={{ background: `${msg.avatarColor}20`, border: `2px solid ${msg.avatarColor}50` }}
                >
                  {msg.avatar}
                </div>
              ) : (
                <div className="w-8 flex-shrink-0" />
              )}
              <div className="flex flex-col items-start max-w-[75%]">
                {showMeta && (
                  <div className="flex items-center gap-1.5 mb-1 ml-1">
                    <span className="text-white text-xs font-semibold">{msg.author}</span>
                    <span className="text-text-tertiary text-[10px]">{msg.role}</span>
                    <span className="text-text-tertiary text-[10px]">· {msg.time}</span>
                  </div>
                )}
                <div
                  className="px-3.5 py-2.5 rounded-[18px] rounded-tl-md text-sm text-white leading-relaxed"
                  style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.09)" }}
                >
                  {msg.text}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="flex-shrink-0 px-4 pb-28 pt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.07)", background: "rgba(5,10,20,0.95)" }}>
        <div
          className="flex items-end gap-2 rounded-2xl px-3 py-2"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)" }}
        >
          <button className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mb-0.5" style={{ background: "rgba(255,255,255,0.07)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66L9.41 17.41a2 2 0 01-2.83-2.83l8.49-8.48" stroke="#9CA3AF" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder={`Message ${room.name}…`}
            rows={1}
            className="flex-1 bg-transparent text-white text-sm placeholder-text-tertiary resize-none outline-none leading-relaxed py-1"
            style={{ maxHeight: "100px" }}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mb-0.5 transition-all"
            style={{
              background: input.trim() ? "linear-gradient(135deg, #4ADE80 0%, #22D3EE 100%)" : "rgba(255,255,255,0.07)",
              opacity: input.trim() ? 1 : 0.5,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke={input.trim() ? "#050A14" : "#9CA3AF"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
