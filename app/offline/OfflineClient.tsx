"use client";

import Link from "next/link";
import { useT } from "../lib/i18n";

export default function OfflineClient() {
  const t = useT();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-8" style={{ background: "var(--bg-1)", color: "var(--text-1)" }}>
      <div
        className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6"
        style={{ background: "var(--glass-bg)", border: "0.5px solid var(--glass-border)" }}
      >
        <span style={{ fontSize: 36 }}>🌐</span>
      </div>
      <h1 className="font-bold text-2xl mb-2">{t("offline.title")}</h1>
      <p className="text-sm mb-8 max-w-xs" style={{ color: "var(--text-2)" }}>
        {t("offline.body")}
      </p>
      <Link
        href="/"
        className="rounded-2xl px-6 py-3 text-sm font-medium"
        style={{ background: "var(--accent)", color: "var(--bg-1)" }}
      >
        {t("offline.retry")}
      </Link>
    </div>
  );
}
