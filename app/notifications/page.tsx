"use client";

import { useState } from "react";
import Link from "next/link";
import StatusBar from "../components/layout/StatusBar";
import BottomNav from "../components/layout/BottomNav";

const notifications = [
  {
    id: 1, type: "alert", icon: "⚠️", title: "Greenhouse CO₂ High",
    desc: "CO₂ level reached 850 ppm — above optimal range of 800 ppm", time: "5m ago",
    color: "#F97316", read: false,
  },
  {
    id: 2, type: "task", icon: "✅", title: "Task Due Today",
    desc: "Irrigation System Maintenance is due today", time: "1h ago",
    color: "#F59E0B", read: false,
  },
  {
    id: 3, type: "automation", icon: "⚡", title: "Automation Ran",
    desc: "Morning Irrigation completed successfully — Orchard", time: "6h ago",
    color: "#4ADE80", read: false,
  },
  {
    id: 4, type: "system", icon: "🌿", title: "Forest Health Improved",
    desc: "Health score increased from 89 to 91 after sensor update", time: "1d ago",
    color: "#4ADE80", read: true,
  },
  {
    id: 5, type: "security", icon: "🔒", title: "New Sign-in Detected",
    desc: "iPad Pro signed in from Bucharest, RO", time: "3d ago",
    color: "#7C3AED", read: true,
  },
  {
    id: 6, type: "maintenance", icon: "🔧", title: "Maintenance Reminder",
    desc: "Lake pump scheduled maintenance in 5 days", time: "5d ago",
    color: "#22D3EE", read: true,
  },
];

export default function NotificationsPage() {
  const [items, setItems] = useState(notifications);

  const unreadCount = items.filter((n) => !n.read).length;

  const markAllRead = () => setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  const markRead = (id: number) => setItems((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));

  return (
    <div className="min-h-screen pb-28" style={{ background: "#050A14" }}>
      <StatusBar />

      <div className="px-5 pt-1 pb-3 flex items-center justify-between">
        <div>
          <h1 className="text-white font-bold text-2xl">Notifications</h1>
          {unreadCount > 0 && <p className="text-text-secondary text-xs">{unreadCount} unread</p>}
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="text-accent-green text-xs font-medium">
            Mark all read
          </button>
        )}
      </div>

      <div className="px-4 space-y-2">
        {items.map((notif) => (
          <button
            key={notif.id}
            onClick={() => markRead(notif.id)}
            className="w-full rounded-2xl p-3.5 flex items-start gap-3 text-left active:scale-[0.98] transition-transform"
            style={{
              background: notif.read ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.07)",
              border: `1px solid ${notif.read ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.11)"}`,
            }}
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0 mt-0.5"
              style={{ background: `${notif.color}15`, border: `1px solid ${notif.color}25` }}
            >
              {notif.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className={`text-sm font-medium leading-tight ${notif.read ? "text-text-secondary" : "text-white"}`}>
                  {notif.title}
                </p>
                {!notif.read && (
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: notif.color }} />
                )}
              </div>
              <p className="text-text-secondary text-xs mt-0.5 leading-snug">{notif.desc}</p>
            </div>
            <span className="text-text-tertiary text-[10px] flex-shrink-0 mt-0.5">{notif.time}</span>
          </button>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}
