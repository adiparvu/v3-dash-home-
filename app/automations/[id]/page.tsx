"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import StatusBar from "../../components/layout/StatusBar";

// ─── Types ────────────────────────────────────────────────────────────────────

type NodeStatus = "ok" | "error" | "warning" | "inactive";

interface TriggerNode {
  type: string;
  label: string;
  icon: string;
  status: NodeStatus;
}

interface ConditionNode {
  label: string;
  icon: string;
  status: NodeStatus;
}

interface ActionNode {
  label: string;
  icon: string;
  status: NodeStatus;
  detail: string;
}

interface LogEntry {
  time: string;
  msg: string;
  status: NodeStatus;
}

interface AutomationDetail {
  name: string;
  zone: string;
  active: boolean;
  lastRun: string;
  runsToday: number;
  successRate: number;
  icon: string;
  accentColor: string;
  trigger: TriggerNode;
  conditions: ConditionNode[];
  actions: ActionNode[];
  logs: LogEntry[];
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const automationData: Record<string, AutomationDetail> = {
  "1": {
    name: "Morning Irrigation",
    zone: "Orchard",
    active: true,
    lastRun: "6h ago",
    runsToday: 1,
    successRate: 100,
    icon: "💧",
    accentColor: "#22D3EE",
    trigger: { type: "Schedule", label: "Every day at 06:00", icon: "⏰", status: "ok" },
    conditions: [
      { label: "Zone is Active", icon: "✅", status: "ok" },
      { label: "No recent rain", icon: "☁️", status: "ok" },
    ],
    actions: [
      { label: "Open drip valves", icon: "🔧", status: "ok", detail: "Zones A, B, C" },
      { label: "Run for 45 min", icon: "⏱️", status: "ok", detail: "Timer active" },
      { label: "Send notification", icon: "🔔", status: "ok", detail: "Irrigation started" },
    ],
    logs: [
      { time: "06:00 today", msg: "Trigger fired", status: "ok" },
      { time: "06:00 today", msg: "Conditions passed", status: "ok" },
      { time: "06:01 today", msg: "Drip valves opened", status: "ok" },
      { time: "06:46 today", msg: "Completed successfully", status: "ok" },
    ],
  },
  "2": {
    name: "Greenhouse Temperature Alert",
    zone: "Greenhouse",
    active: true,
    lastRun: "2d ago",
    runsToday: 0,
    successRate: 98,
    icon: "🌡️",
    accentColor: "#F59E0B",
    trigger: { type: "Sensor Threshold", label: "Temperature > 30°C", icon: "🌡️", status: "ok" },
    conditions: [
      { label: "Greenhouse Active", icon: "✅", status: "ok" },
    ],
    actions: [
      { label: "Open vents", icon: "💨", status: "error", detail: "Vent motor offline" },
      { label: "Send notification", icon: "🔔", status: "ok", detail: "Alert sent" },
    ],
    logs: [
      { time: "2d ago 14:22", msg: "Trigger: Temp reached 31.2°C", status: "ok" },
      { time: "2d ago 14:22", msg: "Conditions passed", status: "ok" },
      { time: "2d ago 14:22", msg: "Open vents — FAILED: motor offline", status: "error" },
      { time: "2d ago 14:22", msg: "Notification sent", status: "ok" },
    ],
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function statusBorder(status: NodeStatus): string {
  switch (status) {
    case "ok":
      return "rgba(74,222,128,0.25)";
    case "error":
      return "rgba(239,68,68,0.5)";
    case "warning":
      return "rgba(245,158,11,0.4)";
    default:
      return "rgba(255,255,255,0.10)";
  }
}

function statusGlow(status: NodeStatus): string | undefined {
  if (status === "error") return "0 0 12px rgba(239,68,68,0.25)";
  return undefined;
}

function StatusDot({ status }: { status: NodeStatus }) {
  if (status === "ok") {
    return (
      <div
        className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: "rgba(74,222,128,0.15)", border: "1px solid rgba(74,222,128,0.4)" }}
      >
        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
          <path d="M1 4L3.5 6.5L9 1" stroke="#4ADE80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    );
  }
  if (status === "error") {
    return (
      <div
        className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.5)" }}
      >
        <span style={{ color: "#EF4444", fontSize: 11, fontWeight: 700 }}>✕</span>
      </div>
    );
  }
  if (status === "warning") {
    return (
      <div
        className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.4)" }}
      >
        <span style={{ color: "#F59E0B", fontSize: 11, fontWeight: 700 }}>!</span>
      </div>
    );
  }
  return (
    <div
      className="w-6 h-6 rounded-full flex-shrink-0"
      style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}
    />
  );
}

// ─── Connector ────────────────────────────────────────────────────────────────

function Connector({ status = "ok", height = 40 }: { status?: NodeStatus; height?: number }) {
  const isError = status === "error";
  const lineColor = isError ? "#EF4444" : status === "warning" ? "#F59E0B" : "#4ADE80";

  return (
    <div className="flex flex-col items-center" style={{ height }}>
      <div
        style={{
          width: 2,
          height: "100%",
          background: isError
            ? "repeating-linear-gradient(to bottom, #EF4444 0px, #EF4444 6px, transparent 6px, transparent 12px)"
            : `linear-gradient(to bottom, ${lineColor}60, ${lineColor}20)`,
          position: "relative",
        }}
      >
        {/* Animated traveling dot */}
        {!isError && (
          <div
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: lineColor,
              boxShadow: `0 0 6px ${lineColor}`,
              animation: "flowDown 1.8s ease-in-out infinite",
            }}
          />
        )}
      </div>
    </div>
  );
}

// ─── Flow Node ────────────────────────────────────────────────────────────────

function FlowNode({
  typeLabel,
  icon,
  label,
  status,
  detail,
  accentColor,
}: {
  typeLabel: string;
  icon: string;
  label: string;
  status: NodeStatus;
  detail?: string;
  accentColor: string;
}) {
  return (
    <div
      className="rounded-2xl p-3.5 flex items-center gap-3 w-full"
      style={{
        background: "rgba(255,255,255,0.06)",
        backdropFilter: "blur(20px)",
        border: `1px solid ${statusBorder(status)}`,
        boxShadow: statusGlow(status),
      }}
    >
      {/* Icon circle */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
        style={{ background: `${accentColor}15`, border: `1px solid ${accentColor}30` }}
      >
        {icon}
      </div>

      {/* Labels */}
      <div className="flex-1 min-w-0">
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
          {typeLabel}
        </p>
        <p className="text-white font-semibold text-sm leading-tight mt-0.5 truncate">{label}</p>
        {detail && (
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 11 }} className="mt-0.5 truncate">
            {detail}
          </p>
        )}
      </div>

      {/* Status indicator */}
      <StatusDot status={status} />
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AutomationDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const data: AutomationDetail = automationData[id] ?? automationData["1"];

  const [active, setActive] = useState(data.active);
  const [logsOpen, setLogsOpen] = useState(false);

  const hasError = data.actions.some((a) => a.status === "error");

  // Determine the status to use for connectors after trigger
  const triggerConnectorStatus = hasError ? "error" : data.trigger.status;

  return (
    <div className="min-h-screen pb-32" style={{ background: "#050A14" }}>
      {/* CSS keyframe animation injected inline */}
      <style>{`
        @keyframes flowDown {
          0%   { top: 0%;   opacity: 1; }
          80%  { top: 90%;  opacity: 0.6; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>

      <StatusBar />

      {/* ── Header ── */}
      <div className="px-4 pt-1 pb-4 flex items-center gap-3">
        <Link href="/automations">
          <button
            className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </Link>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xl">{data.icon}</span>
            <h1 className="text-white font-bold text-lg leading-tight truncate">{data.name}</h1>
          </div>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>{data.zone}</p>
        </div>

        {/* Active toggle */}
        <button
          onClick={() => setActive((v) => !v)}
          className="w-12 h-6 rounded-full relative transition-all duration-200 flex-shrink-0"
          style={{ background: active ? "#4ADE80" : "rgba(255,255,255,0.15)" }}
        >
          <div
            className="absolute top-0.5 w-5 h-5 rounded-full transition-all duration-200"
            style={{
              left: active ? "calc(100% - 22px)" : "2px",
              background: active ? "#050A14" : "rgba(255,255,255,0.5)",
            }}
          />
        </button>
      </div>

      {/* ── Status Banner ── */}
      <div className="px-4 mb-5">
        {hasError ? (
          <div
            className="rounded-2xl px-4 py-3 flex items-center gap-3"
            style={{
              background: "rgba(239,68,68,0.10)",
              border: "1px solid rgba(239,68,68,0.35)",
              boxShadow: "0 0 20px rgba(239,68,68,0.08)",
            }}
          >
            <span className="text-xl">⚠️</span>
            <div>
              <p className="text-white font-semibold text-sm">Fault Detected</p>
              <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 12 }}>
                One action failed · tap node for details
              </p>
            </div>
            <div className="ml-auto text-right">
              <p style={{ color: "#EF4444", fontSize: 12, fontWeight: 600 }}>
                {data.successRate}%
              </p>
              <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 10 }}>success</p>
            </div>
          </div>
        ) : (
          <div
            className="rounded-2xl px-4 py-3 flex items-center gap-3"
            style={{
              background: "rgba(74,222,128,0.08)",
              border: "1px solid rgba(74,222,128,0.25)",
            }}
          >
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(74,222,128,0.15)" }}
            >
              <svg width="14" height="11" viewBox="0 0 14 11" fill="none">
                <path d="M1 5.5L5 9.5L13 1" stroke="#4ADE80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Running Smoothly</p>
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 12 }}>
                Last run {data.lastRun} · {data.successRate}% success rate
              </p>
            </div>
            <div className="ml-auto text-right">
              <p style={{ color: "#4ADE80", fontSize: 13, fontWeight: 700 }}>
                {data.runsToday}
              </p>
              <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 10 }}>today</p>
            </div>
          </div>
        )}
      </div>

      {/* ── Circuit Flow Diagram ── */}
      <div className="px-4 mb-6">
        <p
          className="font-semibold text-sm mb-3"
          style={{ color: "rgba(255,255,255,0.5)", letterSpacing: "0.04em", textTransform: "uppercase", fontSize: 11 }}
        >
          Flow Diagram
        </p>

        <div className="flex flex-col items-center">

          {/* TRIGGER */}
          <FlowNode
            typeLabel="Trigger"
            icon={data.trigger.icon}
            label={data.trigger.label}
            status={data.trigger.status}
            detail={data.trigger.type}
            accentColor={data.accentColor}
          />

          {/* Connector: trigger → conditions */}
          <Connector status={triggerConnectorStatus} height={36} />

          {/* CONDITIONS */}
          {data.conditions.length === 1 ? (
            <FlowNode
              typeLabel="Condition"
              icon={data.conditions[0].icon}
              label={data.conditions[0].label}
              status={data.conditions[0].status}
              accentColor={data.accentColor}
            />
          ) : (
            <div className="w-full">
              {/* Split line into two */}
              <div className="flex justify-center gap-4 mb-0">
                <div className="flex-1 flex flex-col items-center">
                  <div style={{ width: 2, height: 0, background: "transparent" }} />
                </div>
              </div>

              {/* Side-by-side conditions */}
              <div className="grid grid-cols-2 gap-2 w-full">
                {data.conditions.map((cond, i) => (
                  <div
                    key={i}
                    className="rounded-2xl p-3 flex flex-col items-start gap-1.5"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      backdropFilter: "blur(20px)",
                      border: `1px solid ${statusBorder(cond.status)}`,
                      boxShadow: statusGlow(cond.status),
                    }}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                        style={{ background: `${data.accentColor}15`, border: `1px solid ${data.accentColor}30` }}
                      >
                        {cond.icon}
                      </div>
                      <StatusDot status={cond.status} />
                    </div>
                    <div>
                      <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 9, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                        Condition
                      </p>
                      <p className="text-white font-semibold leading-tight" style={{ fontSize: 12 }}>
                        {cond.label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Merge connector: converge lines */}
              <div className="flex justify-center">
                <div className="relative w-full flex flex-col items-center" style={{ height: 36 }}>
                  {/* Horizontal merge bar */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: "25%",
                      right: "25%",
                      height: 2,
                      background: `linear-gradient(to right, ${data.accentColor}40, ${data.accentColor}60, ${data.accentColor}40)`,
                    }}
                  />
                  {/* Left diagonal drop */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: "25%",
                      width: 2,
                      height: 18,
                      background: `${data.accentColor}40`,
                    }}
                  />
                  {/* Right diagonal drop */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      right: "25%",
                      width: 2,
                      height: 18,
                      background: `${data.accentColor}40`,
                    }}
                  />
                  {/* Center vertical down */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: 2,
                      height: "100%",
                      background: `linear-gradient(to bottom, ${data.accentColor}60, ${data.accentColor}20)`,
                    }}
                  >
                    {/* Animated dot on center line */}
                    <div
                      style={{
                        position: "absolute",
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: data.accentColor,
                        boxShadow: `0 0 6px ${data.accentColor}`,
                        animation: "flowDown 1.8s ease-in-out infinite",
                        animationDelay: "0.3s",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Connector: conditions → first action */}
          {data.conditions.length === 1 && (
            <Connector
              status={data.conditions[0].status === "error" ? "error" : triggerConnectorStatus}
              height={36}
            />
          )}

          {/* ACTIONS */}
          {data.actions.map((action, i) => (
            <div key={i} className="w-full flex flex-col items-center">
              <FlowNode
                typeLabel="Action"
                icon={action.icon}
                label={action.label}
                status={action.status}
                detail={action.detail}
                accentColor={action.status === "error" ? "#EF4444" : data.accentColor}
              />
              {/* Connector between actions (not after the last one) */}
              {i < data.actions.length - 1 && (
                <Connector
                  status={action.status === "error" ? "error" : "ok"}
                  height={28}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Run Log ── */}
      <div className="px-4 mb-6">
        <button
          onClick={() => setLogsOpen((v) => !v)}
          className="w-full flex items-center justify-between mb-3"
        >
          <p
            className="font-semibold text-sm"
            style={{ color: "rgba(255,255,255,0.5)", letterSpacing: "0.04em", textTransform: "uppercase", fontSize: 11 }}
          >
            Run History
          </p>
          <div className="flex items-center gap-1.5">
            <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 11 }}>
              {data.logs.length} entries
            </span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              style={{
                transform: logsOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s ease",
              }}
            >
              <path d="M6 9L12 15L18 9" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </button>

        {logsOpen && (
          <div
            className="rounded-2xl overflow-hidden"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)" }}
          >
            {data.logs.map((log, i) => (
              <div
                key={i}
                className="px-4 py-3 flex items-start gap-3"
                style={{
                  borderBottom:
                    i < data.logs.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
                }}
              >
                {/* Log status dot */}
                <div className="mt-0.5 flex-shrink-0">
                  {log.status === "ok" ? (
                    <div
                      className="w-2 h-2 rounded-full mt-1.5"
                      style={{ background: "#4ADE80", boxShadow: "0 0 4px rgba(74,222,128,0.6)" }}
                    />
                  ) : log.status === "error" ? (
                    <div
                      className="w-2 h-2 rounded-full mt-1.5"
                      style={{ background: "#EF4444", boxShadow: "0 0 4px rgba(239,68,68,0.6)" }}
                    />
                  ) : (
                    <div className="w-2 h-2 rounded-full mt-1.5" style={{ background: "#F59E0B" }} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm leading-snug"
                    style={{ color: log.status === "error" ? "#EF4444" : "rgba(255,255,255,0.85)" }}
                  >
                    {log.msg}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
                    {log.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Action Buttons ── */}
      <div className="px-4 fixed bottom-0 left-0 right-0 pb-8 pt-4" style={{ background: "linear-gradient(to top, #050A14 60%, transparent)" }}>
        <div className="flex gap-2.5 mb-3">
          {/* Run Now */}
          <button
            className="flex-1 h-12 rounded-2xl font-semibold text-sm transition-opacity active:opacity-70 flex items-center justify-center gap-2"
            style={{
              background: "linear-gradient(135deg, #4ADE80, #22D3EE)",
              color: "#050A14",
              fontWeight: 700,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M5 3L19 12L5 21V3Z" fill="#050A14" />
            </svg>
            Run Now
          </button>

          {/* Edit Automation */}
          <button
            className="flex-1 h-12 rounded-2xl font-semibold text-sm transition-opacity active:opacity-70 flex items-center justify-center gap-2"
            style={{
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.13)",
              color: "rgba(255,255,255,0.85)",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M11 4H4C3.44772 4 3 4.44772 3 5V20C3 20.5523 3.44772 21 4 21H19C19.5523 21 20 20.5523 20 19V12" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" />
              <path d="M18.5 2.5L21.5 5.5L12 15H9V12L18.5 2.5Z" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Edit
          </button>
        </div>

        {/* Delete */}
        <button
          className="w-full h-10 rounded-2xl font-medium text-sm transition-opacity active:opacity-70"
          style={{
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.25)",
            color: "#EF4444",
          }}
        >
          Delete Automation
        </button>
      </div>
    </div>
  );
}
