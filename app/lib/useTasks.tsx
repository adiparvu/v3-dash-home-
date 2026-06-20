"use client";

/**
 * useTasks — shared task store for the prototype.
 *
 * Holds the seeded task list plus any custom tasks, with per-task status,
 * notes and deletions persisted to localStorage so the list view and the
 * detail view stay in sync.
 */
import { useState, useEffect, useCallback } from "react";

export type TaskStatus = "pending" | "in_progress" | "completed";

export type Task = {
  id: number;
  title: string;
  zone: string;
  priority: string;
  status: string;
  due: string;
  dueColor: string;
  category: string;
  icon: string;
};

export type TaskNote = { id: string; text: string; at: string };

export const SEED_TASKS: Task[] = [
  { id: 1, title: "Irrigation System Maintenance", zone: "Orchard", priority: "high", status: "pending", due: "Today", dueColor: "#EF4444", category: "Maintenance", icon: "💧" },
  { id: 2, title: "Greenhouse CO₂ Calibration", zone: "Greenhouse", priority: "high", status: "in_progress", due: "Today", dueColor: "#F97316", category: "Inspection", icon: "🏡" },
  { id: 3, title: "Forest Health Survey", zone: "Forest", priority: "normal", status: "pending", due: "Tomorrow", dueColor: "#9CA3AF", category: "Survey", icon: "🌲" },
  { id: 4, title: "Lake Water Quality Test", zone: "Lake", priority: "normal", status: "pending", due: "In 3 days", dueColor: "#9CA3AF", category: "Inspection", icon: "💧" },
  { id: 5, title: "Orchard Pruning Season Prep", zone: "Orchard", priority: "low", status: "pending", due: "Next week", dueColor: "#9CA3AF", category: "Seasonal", icon: "🍎" },
  { id: 6, title: "Security Camera Firmware Update", zone: "Driveway", priority: "normal", status: "completed", due: "Done", dueColor: "#4ADE80", category: "System", icon: "📷" },
  { id: 7, title: "Lawn Mower Blade Replacement", zone: "Garden", priority: "normal", status: "completed", due: "Done", dueColor: "#4ADE80", category: "Maintenance", icon: "🌿" },
];

const STATUS_KEY = "prvio-tasks-status-v1";
const NOTES_KEY = "prvio-tasks-notes-v1";
const DELETED_KEY = "prvio-tasks-deleted-v1";
const CUSTOM_KEY = "prvio-tasks-custom-v1";
const LEGACY_DONE_KEY = "prvio-tasks-done-v1";

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

/** Migrate the legacy boolean done-map into the 3-state status map once. */
function migrateLegacy(status: Record<number, TaskStatus>): Record<number, TaskStatus> {
  const legacy = read<Record<number, boolean>>(LEGACY_DONE_KEY, {});
  let changed = false;
  const next = { ...status };
  for (const [k, done] of Object.entries(legacy)) {
    const id = Number(k);
    if (id in next) continue;
    const seed = SEED_TASKS.find((s) => s.id === id);
    next[id] = done ? "completed" : seed?.status === "completed" ? "pending" : (seed?.status as TaskStatus) ?? "pending";
    changed = true;
  }
  return changed ? next : status;
}

export function useTasks() {
  const [statusMap, setStatusMap] = useState<Record<number, TaskStatus>>({});
  const [notesMap, setNotesMap] = useState<Record<number, TaskNote[]>>({});
  const [deleted, setDeleted] = useState<number[]>([]);
  const [customTasks, setCustomTasks] = useState<Task[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setStatusMap(migrateLegacy(read<Record<number, TaskStatus>>(STATUS_KEY, {})));
    setNotesMap(read<Record<number, TaskNote[]>>(NOTES_KEY, {}));
    setDeleted(read<number[]>(DELETED_KEY, []));
    setCustomTasks(read<Task[]>(CUSTOM_KEY, []));
    setMounted(true);
  }, []);

  useEffect(() => { if (mounted) write(STATUS_KEY, statusMap); }, [statusMap, mounted]);
  useEffect(() => { if (mounted) write(NOTES_KEY, notesMap); }, [notesMap, mounted]);
  useEffect(() => { if (mounted) write(DELETED_KEY, deleted); }, [deleted, mounted]);
  useEffect(() => { if (mounted) write(CUSTOM_KEY, customTasks); }, [customTasks, mounted]);

  const statusOf = useCallback(
    (task: Task): TaskStatus => (statusMap[task.id] ?? (task.status as TaskStatus)),
    [statusMap],
  );

  const setStatus = useCallback((id: number, status: TaskStatus) => {
    setStatusMap((m) => ({ ...m, [id]: status }));
  }, []);

  const addNote = useCallback((id: number, text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const note: TaskNote = { id: `${Date.now()}`, text: trimmed, at: new Date().toISOString() };
    setNotesMap((m) => ({ ...m, [id]: [note, ...(m[id] ?? [])] }));
  }, []);

  const removeNote = useCallback((taskId: number, noteId: string) => {
    setNotesMap((m) => ({ ...m, [taskId]: (m[taskId] ?? []).filter((n) => n.id !== noteId) }));
  }, []);

  const addTask = useCallback((task: Task) => {
    setCustomTasks((c) => [task, ...c]);
  }, []);

  const removeTask = useCallback((id: number) => {
    setCustomTasks((c) => c.filter((tk) => tk.id !== id));
    setDeleted((d) => (d.includes(id) ? d : [...d, id]));
  }, []);

  // Merged, non-deleted tasks with the effective status applied.
  const tasks: Task[] = [...customTasks, ...SEED_TASKS]
    .filter((tk) => !deleted.includes(tk.id))
    .map((tk) => {
      const status = statusMap[tk.id] ?? tk.status;
      const done = status === "completed";
      return { ...tk, status, due: done ? "Done" : tk.due, dueColor: done ? "#4ADE80" : tk.dueColor };
    });

  const findTask = useCallback(
    (id: number): Task | null => {
      const base = [...customTasks, ...SEED_TASKS].find((tk) => tk.id === id);
      if (!base || deleted.includes(id)) return null;
      const status = statusMap[id] ?? base.status;
      const done = status === "completed";
      return { ...base, status, due: done ? "Done" : base.due, dueColor: done ? "#4ADE80" : base.dueColor };
    },
    [customTasks, deleted, statusMap],
  );

  return {
    mounted,
    tasks,
    notesMap,
    statusOf,
    setStatus,
    addNote,
    removeNote,
    addTask,
    removeTask,
    findTask,
  };
}
