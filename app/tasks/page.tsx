"use client";

import { useState, useEffect } from "react";
import StatusBar from "../components/layout/StatusBar";
import BottomNav from "../components/layout/BottomNav";
import { useT } from "../lib/i18n";

const filters = ["All", "Pending", "In Progress", "Completed"];

const TASKS_KEY = "prvio-tasks-done-v1";

const seedTasks = [
  {
    id: 1,
    title: "Irrigation System Maintenance",
    zone: "Orchard",
    priority: "high",
    status: "pending",
    due: "Today",
    dueColor: "#EF4444",
    category: "Maintenance",
    icon: "💧",
  },
  {
    id: 2,
    title: "Greenhouse CO₂ Calibration",
    zone: "Greenhouse",
    priority: "high",
    status: "in_progress",
    due: "Today",
    dueColor: "#F97316",
    category: "Inspection",
    icon: "🏡",
  },
  {
    id: 3,
    title: "Forest Health Survey",
    zone: "Forest",
    priority: "normal",
    status: "pending",
    due: "Tomorrow",
    dueColor: "#9CA3AF",
    category: "Survey",
    icon: "🌲",
  },
  {
    id: 4,
    title: "Lake Water Quality Test",
    zone: "Lake",
    priority: "normal",
    status: "pending",
    due: "In 3 days",
    dueColor: "#9CA3AF",
    category: "Inspection",
    icon: "💧",
  },
  {
    id: 5,
    title: "Orchard Pruning Season Prep",
    zone: "Orchard",
    priority: "low",
    status: "pending",
    due: "Next week",
    dueColor: "#9CA3AF",
    category: "Seasonal",
    icon: "🍎",
  },
  {
    id: 6,
    title: "Security Camera Firmware Update",
    zone: "Driveway",
    priority: "normal",
    status: "completed",
    due: "Done",
    dueColor: "#4ADE80",
    category: "System",
    icon: "📷",
  },
  {
    id: 7,
    title: "Lawn Mower Blade Replacement",
    zone: "Garden",
    priority: "normal",
    status: "completed",
    due: "Done",
    dueColor: "#4ADE80",
    category: "Maintenance",
    icon: "🌿",
  },
];

const priorityConfig = {
  high: { label: "High", color: "#EF4444", bg: "rgba(239,68,68,0.12)" },
  normal: { label: "Normal", color: "#9CA3AF", bg: "rgba(156,163,175,0.10)" },
  low: { label: "Low", color: "#6B7280", bg: "rgba(107,114,128,0.10)" },
};

const CUSTOM_KEY = "prvio-tasks-custom-v1";
const zoneChoices = ["Lake", "Forest", "Greenhouse", "Orchard", "Garden", "House", "Driveway"];
const zoneIcons: Record<string, string> = {
  Lake: "💧", Forest: "🌲", Greenhouse: "🏡", Orchard: "🍎", Garden: "🌿", House: "🏠", Driveway: "📷",
};

type Task = typeof seedTasks[number];

export default function TasksPage() {
  const t = useT();
  const [activeFilter, setActiveFilter] = useState("All");
  const [overrides, setOverrides] = useState<Record<number, boolean>>({});
  const [customTasks, setCustomTasks] = useState<Task[]>([]);
  const [mounted, setMounted] = useState(false);

  // Composer state
  const [composerOpen, setComposerOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newZone, setNewZone] = useState("Lake");
  const [newPriority, setNewPriority] = useState<"high" | "normal" | "low">("normal");

  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem(TASKS_KEY);
      if (raw) setOverrides(JSON.parse(raw));
      const rawC = localStorage.getItem(CUSTOM_KEY);
      if (rawC) setCustomTasks(JSON.parse(rawC));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(TASKS_KEY, JSON.stringify(overrides));
    } catch {
      /* ignore */
    }
  }, [overrides, mounted]);

  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(CUSTOM_KEY, JSON.stringify(customTasks));
    } catch {
      /* ignore */
    }
  }, [customTasks, mounted]);

  const addTask = () => {
    if (!newTitle.trim()) return;
    const task: Task = {
      id: Date.now(),
      title: newTitle.trim(),
      zone: newZone,
      priority: newPriority,
      status: "pending",
      due: "Today",
      dueColor: "#F59E0B",
      category: "Custom",
      icon: zoneIcons[newZone] ?? "📋",
    };
    setCustomTasks((c) => [task, ...c]);
    setNewTitle("");
    setNewPriority("normal");
    setComposerOpen(false);
  };

  const statusOf = (t: (typeof seedTasks)[number]): string => {
    if (t.id in overrides) {
      if (overrides[t.id]) return "completed";
      return t.status === "completed" ? "pending" : t.status;
    }
    return t.status;
  };

  const toggle = (id: number, isDone: boolean) =>
    setOverrides((o) => ({ ...o, [id]: !isDone }));

  const tasks = [...customTasks, ...seedTasks].map((t) => {
    const status = statusOf(t);
    const done = status === "completed";
    return {
      ...t,
      status,
      due: done ? "Done" : t.due,
      dueColor: done ? "#4ADE80" : t.dueColor,
    };
  });

  const filtered = tasks.filter((t) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Pending") return t.status === "pending";
    if (activeFilter === "In Progress") return t.status === "in_progress";
    if (activeFilter === "Completed") return t.status === "completed";
    return true;
  });

  const pending = tasks.filter((t) => t.status === "pending").length;
  const inProgress = tasks.filter((t) => t.status === "in_progress").length;

  return (
    <div className="min-h-screen pb-28" style={{ background: "var(--bg-1)" }}>
      <StatusBar />

      {/* Header */}
      <div className="px-5 pt-1 pb-3 flex items-center justify-between">
        <div>
          <h1 className="font-bold text-2xl" style={{ color: "var(--text-1)" }}>{t("page.tasks")}</h1>
          <p className="text-text-secondary text-xs">{pending} pending · {inProgress} in progress</p>
        </div>
        <button
          onClick={() => setComposerOpen(true)}
          aria-label="Add task"
          className="w-9 h-9 rounded-2xl flex items-center justify-center active:scale-90 transition-transform"
          style={{ background: "rgba(74,222,128,0.15)", border: "1px solid rgba(74,222,128,0.30)", color: "var(--accent)" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
        </button>
      </div>

      {/* Summary strip */}
      <div className="px-4 mb-4 flex gap-2">
        {[
          { label: "Total", value: tasks.length.toString(), color: "var(--text-1)" },
          { label: "Pending", value: pending.toString(), color: "#F59E0B" },
          { label: "In Progress", value: inProgress.toString(), color: "#22D3EE" },
          { label: "Done", value: tasks.filter((t) => t.status === "completed").length.toString(), color: "#4ADE80" },
        ].map((s) => (
          <div key={s.label} className="flex-1 rounded-2xl p-2.5 text-center" style={{ background: "rgba(255,255,255,0.05)", border: "0.5px solid var(--glass-border)" }}>
            <p className="font-bold text-base" style={{ color: s.color }}>{s.value}</p>
            <p className="text-text-tertiary text-[9px] mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="px-4 mb-4 flex gap-2 overflow-x-auto scrollbar-hide">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className="px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap flex-shrink-0 transition-all"
            style={
              activeFilter === f
                ? { background: "#4ADE80", color: "#050A14" }
                : { background: "rgba(255,255,255,0.07)", color: "var(--text-2)", border: "0.5px solid var(--glass-border)" }
            }
          >
            {f}
          </button>
        ))}
      </div>

      {/* Tasks list */}
      <div className="px-4 space-y-2.5">
        {filtered.map((task) => {
          const pConfig = priorityConfig[task.priority as keyof typeof priorityConfig];

          return (
            <div
              key={task.id}
              className="liquid-glass rounded-2xl p-4 active:scale-[0.98] transition-transform"
            >
              <div className="flex items-start gap-3">
                {/* Checkbox */}
                <button
                  onClick={() => toggle(task.id, task.status === "completed")}
                  aria-label={task.status === "completed" ? "Mark as not done" : "Mark as done"}
                  className="w-5 h-5 rounded-full flex-shrink-0 mt-0.5 flex items-center justify-center active:scale-90 transition-transform"
                  style={{
                    border: task.status === "completed" ? "none" : "1.5px solid var(--text-3)",
                    background: task.status === "completed" ? "#4ADE80" : "transparent",
                  }}
                >
                  {task.status === "completed" && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#050A14" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  )}
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium leading-tight ${task.status === "completed" ? "line-through text-text-tertiary" : ""}`} style={task.status !== "completed" ? { color: "var(--text-1)" } : undefined}>
                    {task.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[10px]">{task.icon}</span>
                    <span className="text-text-secondary text-[10px]">{task.zone}</span>
                    <span className="text-text-tertiary text-[10px]">·</span>
                    <span className="text-[10px]" style={{ color: task.dueColor }}>{task.due}</span>
                  </div>
                </div>

                {/* Priority badge */}
                <span
                  className="text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0"
                  style={{ background: pConfig.bg, color: pConfig.color }}
                >
                  {pConfig.label}
                </span>
              </div>

              {/* Status indicator for in-progress */}
              {task.status === "in_progress" && (
                <div className="mt-2.5 flex items-center gap-1.5">
                  <div className="flex-1 h-1 rounded-full" style={{ background: "rgba(255,255,255,0.10)" }}>
                    <div className="h-1 rounded-full w-[40%]" style={{ background: "linear-gradient(90deg, #F59E0B, #F97316)" }} />
                  </div>
                  <span className="text-text-tertiary text-[10px]">40%</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Composer sheet */}
      {composerOpen && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center" style={{ background: "rgba(0,0,0,0.45)" }} onClick={() => setComposerOpen(false)}>
          <div
            className="w-full md:w-[390px] rounded-t-[28px] p-5 pb-8 animate-slide-up liquid-glass-strong"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 rounded-full mx-auto mb-4" style={{ background: "var(--glass-border)" }} />
            <h2 className="font-bold text-lg mb-4" style={{ color: "var(--text-1)" }}>New Task</h2>

            <label className="text-xs font-medium block mb-1.5 px-1" style={{ color: "var(--text-2)" }}>Title</label>
            <div className="rounded-2xl overflow-hidden mb-4" style={{ background: "var(--glass-bg)", border: "0.5px solid var(--glass-border)" }}>
              <input
                autoFocus
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Check irrigation valves"
                className="w-full bg-transparent px-4 py-3.5 text-sm outline-none"
                style={{ color: "var(--text-1)", caretColor: "var(--accent)" }}
              />
            </div>

            <label className="text-xs font-medium block mb-2 px-1" style={{ color: "var(--text-2)" }}>Zone</label>
            <div className="flex flex-wrap gap-2 mb-4">
              {zoneChoices.map((z) => {
                const active = newZone === z;
                return (
                  <button key={z} onClick={() => setNewZone(z)} className="px-3 py-1.5 rounded-xl text-xs font-medium transition-all active:scale-95" style={active ? { background: "var(--accent)", color: "var(--bg-1)" } : { background: "var(--glass-bg)", color: "var(--text-2)", border: "0.5px solid var(--glass-border)" }}>
                    {z}
                  </button>
                );
              })}
            </div>

            <label className="text-xs font-medium block mb-2 px-1" style={{ color: "var(--text-2)" }}>Priority</label>
            <div className="flex gap-2 mb-6">
              {(["high", "normal", "low"] as const).map((pr) => {
                const cfg = priorityConfig[pr];
                const active = newPriority === pr;
                return (
                  <button key={pr} onClick={() => setNewPriority(pr)} className="flex-1 py-2.5 rounded-xl text-sm font-medium capitalize transition-all active:scale-95" style={active ? { background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}55` } : { background: "var(--glass-bg)", color: "var(--text-3)", border: "0.5px solid var(--glass-border)" }}>
                    {cfg.label}
                  </button>
                );
              })}
            </div>

            <button
              onClick={addTask}
              disabled={!newTitle.trim()}
              className="w-full py-3.5 rounded-2xl font-semibold text-base transition-all active:scale-[0.97]"
              style={{
                background: newTitle.trim() ? "linear-gradient(135deg, #4ADE80 0%, #22C55E 100%)" : "var(--glass-bg)",
                color: newTitle.trim() ? "#08111E" : "var(--text-3)",
                border: newTitle.trim() ? "none" : "0.5px solid var(--glass-border)",
              }}
            >
              Add Task
            </button>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
