"use client";

/**
 * Reusable bottom sheet — the surface a Detail Disclosure Button reveals.
 * Renders a dimmed backdrop + a slide-up glass card with a title and arbitrary
 * content. Closes on backdrop tap, the close button, or Escape. Accessible:
 * role="dialog" + aria-modal, labelled by its title.
 */
import { useEffect } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  icon?: string;
  accent?: string;
  children: React.ReactNode;
};

export default function DetailSheet({ open, onClose, title, icon, accent = "var(--accent)", children }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center"
      style={{ background: "rgba(0,0,0,0.5)", animation: "ddFade 0.18s ease" }}
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className="w-full md:w-[390px] rounded-t-[28px] p-5 pb-8"
        style={{
          background: "var(--bg-1)",
          borderTop: "0.5px solid var(--glass-border)",
          boxShadow: "0 -8px 40px rgba(0,0,0,0.4)",
          maxHeight: "80vh",
          overflowY: "auto",
          animation: "ddSlideUp 0.26s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Grabber */}
        <div className="flex justify-center mb-4">
          <div className="w-9 h-1 rounded-full" style={{ background: "var(--glass-border)" }} />
        </div>

        <div className="flex items-center gap-3 mb-4">
          {icon && (
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg flex-shrink-0"
              style={{ background: `${accent}18`, border: `1px solid ${accent}30` }}
            >
              {icon}
            </div>
          )}
          <h2 className="font-bold text-lg flex-1" style={{ color: "var(--text-1)" }}>{title}</h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: "var(--glass-bg)", color: "var(--text-2)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}
