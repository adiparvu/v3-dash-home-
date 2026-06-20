"use client";

import Link from "next/link";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import StatusBar from "../../components/layout/StatusBar";
import { useT } from "../../lib/i18n";
import { useTasks } from "../../lib/useTasks";

// Static metadata not modelled on the task record (prototype placeholders).
const taskMeta = {
  assignedTo: "James Thornton",
  createdBy: "Sarah Mitchell",
  createdAt: "Jun 14, 2026",
};

const BackIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M19 12H5M12 5l-7 7 7 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <polyline points="3 6 5 6 21 6" stroke="#EF4444" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="#EF4444" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10 11v6M14 11v6" stroke="#EF4444" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" stroke="#EF4444" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M12 5v14M5 12h14" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const NoteEmptyIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <polyline points="14 2 14 8 20 8" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="16" y1="13" x2="8" y2="13" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="16" y1="17" x2="8" y2="17" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" strokeLinecap="round" />
    <polyline points="10 9 9 9 8 9" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export default function TaskDetailPage() {
  const t = useT();
  const params = useParams();
  const router = useRouter();
  const { mounted, findTask, setStatus: setTaskStatus, notesMap, addNote, removeTask } = useTasks();
  const taskId = Number(params.id);
  const task = findTask(taskId);

  const status = (task?.status ?? "pending") as "pending" | "in_progress" | "completed";
  const progress = status === "completed" ? 100 : status === "in_progress" ? 40 : 0;
  const notes = notesMap[taskId] ?? [];

  const [noteOpen, setNoteOpen] = useState(false);
  const [noteText, setNoteText] = useState("");

  const priorityConfig = {
    high: { label: t("prio.high"), color: "#EF4444", bg: "rgba(239,68,68,0.14)", border: "rgba(239,68,68,0.25)" },
    normal: { label: t("prio.normal"), color: "#9CA3AF", bg: "rgba(156,163,175,0.10)", border: "rgba(156,163,175,0.18)" },
    low: { label: t("prio.low"), color: "#6B7280", bg: "rgba(107,114,128,0.10)", border: "rgba(107,114,128,0.18)" },
  };

  const statusConfig = {
    pending: { label: t("tdet.statusPending"), color: "#F59E0B", bg: "rgba(245,158,11,0.14)", border: "rgba(245,158,11,0.25)" },
    in_progress: { label: t("tdet.statusInProgress"), color: "#22D3EE", bg: "rgba(34,211,238,0.14)", border: "rgba(34,211,238,0.25)" },
    completed: { label: t("tdet.statusCompleted"), color: "#4ADE80", bg: "rgba(74,222,128,0.14)", border: "rgba(74,222,128,0.25)" },
  };

  if (!task) {
    if (!mounted) return null;
    return (
      <div className="min-h-screen pb-10 flex flex-col" style={{ background: "var(--bg-1)" }}>
        <StatusBar />
        <div className="flex-1 flex flex-col items-center justify-center gap-3 px-8 text-center">
          <NoteEmptyIcon />
          <p className="font-bold text-base" style={{ color: "var(--text-1)" }}>{t("tdet.notFound")}</p>
          <p className="text-sm" style={{ color: "var(--text-3)" }}>{t("tdet.notFoundHint")}</p>
          <Link
            href="/tasks"
            className="mt-2 px-4 py-2 rounded-xl text-sm font-semibold"
            style={{ background: "rgba(74,222,128,0.14)", color: "#4ADE80", border: "1px solid rgba(74,222,128,0.25)" }}
          >
            {t("tdet.backToTasks")}
          </Link>
        </div>
      </div>
    );
  }

  const pCfg = priorityConfig[task.priority as keyof typeof priorityConfig] ?? priorityConfig.normal;
  const sCfg = statusConfig[status];
  const zoneHref = `/zones/${task.zone.toLowerCase().replace(/\s+/g, "-")}`;

  const handleMarkInProgress = () => setTaskStatus(taskId, "in_progress");
  const handleMarkComplete = () => setTaskStatus(taskId, "completed");

  const handleSaveNote = () => {
    addNote(taskId, noteText);
    setNoteText("");
    setNoteOpen(false);
  };

  const handleDelete = () => {
    removeTask(taskId);
    router.push("/tasks");
  };

  const detailRows = [
    { label: t("tdet.rowZone"), value: task.zone, isLink: true, href: zoneHref },
    { label: t("tdet.rowCategory"), value: task.category },
    { label: t("tdet.rowDue"), value: task.due, color: task.dueColor },
    { label: t("tdet.rowAssigned"), value: taskMeta.assignedTo },
    { label: t("tdet.rowCreatedBy"), value: taskMeta.createdBy },
    { label: t("tdet.rowCreatedAt"), value: taskMeta.createdAt, color: "var(--text-3)" },
  ];

  return (
    <div className="min-h-screen pb-10" style={{ background: "var(--bg-1)" }}>
      <StatusBar />

      {/* Header */}
      <div className="px-5 pt-1 pb-4 flex items-center gap-3">
        <Link
          href="/tasks"
          className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 active:scale-95 transition-transform"
          style={{ background: "rgba(255,255,255,0.06)", border: "0.5px solid var(--glass-border)" }}
        >
          <BackIcon />
        </Link>
        <h1 className="font-bold text-lg truncate flex-1" style={{ color: "var(--text-1)" }}>{task.title}</h1>
        <button
          className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(255,255,255,0.06)", border: "0.5px solid var(--glass-border)" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="5" r="1.5" fill="white" />
            <circle cx="12" cy="12" r="1.5" fill="white" />
            <circle cx="12" cy="19" r="1.5" fill="white" />
          </svg>
        </button>
      </div>

      {/* Status badge row */}
      <div className="px-5 flex items-center gap-2 mb-4">
        <span
          className="text-xs font-semibold px-3 py-1 rounded-full"
          style={{ background: pCfg.bg, color: pCfg.color, border: `1px solid ${pCfg.border}` }}
        >
          {pCfg.label} {t("tdet.priorityLabel")}
        </span>
        <span
          className="text-xs font-semibold px-3 py-1 rounded-full"
          style={{ background: sCfg.bg, color: sCfg.color, border: `1px solid ${sCfg.border}` }}
        >
          {sCfg.label}
        </span>
      </div>

      <div className="px-4 space-y-3">
        {/* Main task card */}
        <div
          className="liquid-glass rounded-2xl p-5"
          style={{
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
              style={{ background: "rgba(74,222,128,0.10)", border: "1px solid rgba(74,222,128,0.20)" }}
            >
              {task.icon}
            </div>
            <h2 className="font-bold text-base leading-snug" style={{ color: "var(--text-1)" }}>{task.title}</h2>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-2)" }}>
            {t("tdet.desc")}
          </p>
        </div>

        {/* Details card */}
        <div
          className="liquid-glass rounded-2xl overflow-hidden"
          style={{
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          }}
        >
          <div className="px-4 pt-4 pb-1">
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-3)" }}>
              {t("tdet.details")}
            </p>
          </div>
          {detailRows.map((row, i) => (
            <div
              key={row.label}
              className="flex items-center justify-between px-4 py-3"
              style={{ borderTop: i === 0 ? "none" : "1px solid rgba(255,255,255,0.06)" }}
            >
              <span className="text-sm" style={{ color: "var(--text-2)" }}>{row.label}</span>
              {row.isLink ? (
                <Link
                  href={row.href!}
                  className="text-sm font-medium"
                  style={{ color: "var(--accent-cyan)" }}
                >
                  {row.value} →
                </Link>
              ) : (
                <span className="text-sm font-medium" style={{ color: row.color ?? "var(--text-1)" }}>
                  {row.value}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Progress section */}
        <div
          className="liquid-glass rounded-2xl p-5"
          style={{
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-3)" }}>
              {t("tdet.progress")}
            </p>
            <span className="text-sm font-bold" style={{ color: progress === 100 ? "#4ADE80" : "#F59E0B" }}>
              {progress}%
            </span>
          </div>
          <div className="h-2 rounded-full mb-4" style={{ background: "rgba(255,255,255,0.08)" }}>
            <div
              className="h-2 rounded-full transition-all duration-500"
              style={{
                width: `${progress}%`,
                background:
                  progress === 100
                    ? "linear-gradient(90deg, #4ADE80, #22D3EE)"
                    : "linear-gradient(90deg, #F59E0B, #F97316)",
              }}
            />
          </div>
          {status !== "completed" && (
            <div className="flex gap-2">
              {status !== "in_progress" && (
                <button
                  onClick={handleMarkInProgress}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold active:scale-[0.98] transition-transform"
                  style={{ background: "rgba(34,211,238,0.14)", color: "#22D3EE", border: "1px solid rgba(34,211,238,0.25)" }}
                >
                  {t("tdet.markInProgress")}
                </button>
              )}
              <button
                onClick={handleMarkComplete}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold active:scale-[0.98] transition-transform"
                style={{ background: "rgba(74,222,128,0.14)", color: "#4ADE80", border: "1px solid rgba(74,222,128,0.25)" }}
              >
                {t("tdet.markComplete")}
              </button>
            </div>
          )}
          {status === "completed" && (
            <div
              className="py-2.5 rounded-xl text-sm font-semibold text-center"
              style={{ background: "rgba(74,222,128,0.10)", color: "#4ADE80", border: "1px solid rgba(74,222,128,0.20)" }}
            >
              {t("tdet.taskCompleted")}
            </div>
          )}
        </div>

        {/* Notes section */}
        <div
          className="liquid-glass rounded-2xl p-5"
          style={{
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-3)" }}>
              {t("tdet.notes")}
            </p>
            <button
              onClick={() => setNoteOpen((v) => !v)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium active:scale-95 transition-transform"
              style={{ background: "rgba(255,255,255,0.07)", color: "var(--text-2)", border: "0.5px solid var(--glass-border)" }}
            >
              <PlusIcon />
              {t("tdet.addNote")}
            </button>
          </div>

          {/* Note composer */}
          {noteOpen && (
            <div className="mb-4">
              <textarea
                autoFocus
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder={t("tdet.notePh")}
                rows={3}
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none resize-none"
                style={{ background: "var(--glass-bg)", border: "0.5px solid var(--glass-border)", color: "var(--text-1)", caretColor: "var(--accent)" }}
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => { setNoteOpen(false); setNoteText(""); }}
                  className="flex-1 py-2 rounded-xl text-xs font-semibold"
                  style={{ background: "var(--glass-bg)", color: "var(--text-3)", border: "0.5px solid var(--glass-border)" }}
                >
                  {t("tdet.cancel")}
                </button>
                <button
                  onClick={handleSaveNote}
                  disabled={!noteText.trim()}
                  className="flex-1 py-2 rounded-xl text-xs font-semibold"
                  style={noteText.trim()
                    ? { background: "rgba(74,222,128,0.14)", color: "#4ADE80", border: "1px solid rgba(74,222,128,0.25)" }
                    : { background: "var(--glass-bg)", color: "var(--text-3)", border: "0.5px solid var(--glass-border)" }}
                >
                  {t("tdet.saveNote")}
                </button>
              </div>
            </div>
          )}

          {notes.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center py-4 gap-2">
              <NoteEmptyIcon />
              <p className="text-sm" style={{ color: "var(--text-3)" }}>{t("tdet.noNotes")}</p>
              <p className="text-xs text-center" style={{ color: "var(--text-3)" }}>
                {t("tdet.noNotesHint")}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {notes.map((n) => (
                <div
                  key={n.id}
                  className="rounded-xl px-3 py-2.5"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
                >
                  <p className="text-sm leading-snug" style={{ color: "var(--text-1)" }}>{n.text}</p>
                  <p className="text-[10px] mt-1" style={{ color: "var(--text-3)" }}>
                    {new Date(n.at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Related section */}
        <div
          className="liquid-glass rounded-2xl p-5"
          style={{
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--text-3)" }}>
            {t("tdet.related")}
          </p>
          <div className="space-y-2">
            <Link
              href={zoneHref}
              className="flex items-center gap-3 py-2 rounded-xl px-3 active:scale-[0.98] transition-transform"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <span className="text-lg">{task.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-medium" style={{ color: "var(--text-1)" }}>{task.zone}</p>
                <p className="text-xs" style={{ color: "var(--text-3)" }}>{t("tdet.viewZone")}</p>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M9 18l6-6-6-6" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <div
              className="flex items-center gap-3 py-2 rounded-xl px-3"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <span className="text-lg">🔧</span>
              <div className="flex-1">
                <p className="text-sm font-medium" style={{ color: "var(--text-1)" }}>{t("tdet.dripKit")}</p>
                <p className="text-xs" style={{ color: "var(--text-3)" }}>{t("tdet.assetInventory")}</p>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M9 18l6-6-6-6" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>

        {/* Delete button */}
        <button
          onClick={handleDelete}
          className="w-full py-3 rounded-2xl flex items-center justify-center gap-2 text-sm font-semibold active:scale-[0.98] transition-transform mt-2"
          style={{ border: "1px solid rgba(239,68,68,0.30)", color: "#EF4444", background: "rgba(239,68,68,0.06)" }}
        >
          <TrashIcon />
          {t("tdet.deleteTask")}
        </button>
      </div>
    </div>
  );
}
