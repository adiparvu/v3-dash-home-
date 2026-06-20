"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import StatusBar from "../../components/layout/StatusBar";
import { useT, type MessageKey } from "../../lib/i18n";

const recentScans: { nameKey: MessageKey; id: string; timeKey: MessageKey; icon: string; href: string }[] = [
  { nameKey: "qr.scanWaterPump", id: "WP-001", timeKey: "qr.time2h", icon: "⚙️", href: "/inventory/water-pump" },
  { nameKey: "qr.scanFicus", id: "FT-002", timeKey: "qr.time1d", icon: "🌱", href: "/inventory/ficus-tree" },
  { nameKey: "qr.scanAC", id: "AC-003", timeKey: "qr.time3d", icon: "❄️", href: "/inventory/air-conditioner" },
];

/* Minimal type for the native BarcodeDetector API (Chromium) */
type DetectedBarcode = { rawValue: string };
type BarcodeDetectorLike = { detect: (src: CanvasImageSource) => Promise<DetectedBarcode[]> };
type BarcodeDetectorCtor = {
  new (opts?: { formats?: string[] }): BarcodeDetectorLike;
  getSupportedFormats?: () => Promise<string[]>;
};

export default function QRScannerPage() {
  const router = useRouter();
  const t = useT();
  const [manualCode, setManualCode] = useState("");
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detected, setDetected] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);

  const stopCamera = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setScanning(false);
  }, []);

  const handleHit = useCallback(
    (value: string) => {
      setDetected(value);
      stopCamera();
      const code = value.trim();
      // If the QR encodes a full path, use it; otherwise treat as asset code
      const target = code.startsWith("/") ? code : `/inventory/qr/${encodeURIComponent(code)}`;
      setTimeout(() => router.push(target), 450);
    },
    [router, stopCamera]
  );

  const startCamera = useCallback(async () => {
    setError(null);
    setDetected(null);
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setError(t("qr.cameraNotAvailable"));
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      streamRef.current = stream;
      setScanning(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      const Ctor = (window as unknown as { BarcodeDetector?: BarcodeDetectorCtor }).BarcodeDetector;
      if (!Ctor) {
        // Camera works, but no on-device decoder — user can still see feed + use manual entry
        setError(t("qr.decodingUnsupported"));
        return;
      }
      const detector = new Ctor({ formats: ["qr_code"] });

      const tick = async () => {
        if (!videoRef.current || !streamRef.current) return;
        try {
          const codes = await detector.detect(videoRef.current);
          if (codes.length > 0 && codes[0].rawValue) {
            handleHit(codes[0].rawValue);
            return;
          }
        } catch {
          /* transient decode error — keep scanning */
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    } catch {
      setError(t("qr.permissionDenied"));
      setScanning(false);
    }
  }, [handleHit, t]);

  // Cleanup on unmount
  useEffect(() => () => stopCamera(), [stopCamera]);

  return (
    <div className="min-h-screen pb-10" style={{ color: "var(--text-1)" }}>
      <StatusBar />

      <div className="px-5 pt-1 pb-5 flex items-center gap-3">
        <Link href="/inventory" aria-label={t("inv.back")} onClick={stopCamera} className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 liquid-glass" style={{ color: "var(--text-1)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </Link>
        <h1 className="font-bold text-xl" style={{ color: "var(--text-1)" }}>{t("qr.title")}</h1>
      </div>

      {/* Viewfinder */}
      <div className="flex flex-col items-center px-5 mb-6">
        <div
          className="relative rounded-3xl overflow-hidden flex items-center justify-center"
          style={{ width: 280, height: 280, background: "#000", border: "1px solid var(--glass-border)" }}
        >
          {/* Camera feed */}
          <video
            ref={videoRef}
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover"
            style={{ opacity: scanning ? 1 : 0, transition: "opacity 0.3s ease" }}
          />

          {/* Corner marks */}
          {[
            { c: "top-4 left-4", d: "M2 16V2H16" },
            { c: "top-4 right-4", d: "M30 16V2H16" },
            { c: "bottom-4 left-4", d: "M2 16V30H16" },
            { c: "bottom-4 right-4", d: "M30 16V30H16" },
          ].map((m) => (
            <svg key={m.c} className={`absolute ${m.c} z-10`} width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d={m.d} stroke="#4ADE80" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ))}

          {/* Idle placeholder */}
          {!scanning && !detected && (
            <div className="flex flex-col items-center gap-3 opacity-40 z-[5]">
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="7" height="7" rx="1" stroke="var(--text-1)" strokeWidth="1.5" />
                <rect x="14" y="3" width="7" height="7" rx="1" stroke="var(--text-1)" strokeWidth="1.5" />
                <rect x="3" y="14" width="7" height="7" rx="1" stroke="var(--text-1)" strokeWidth="1.5" />
                <path d="M14 14h2v2h-2zM18 14h3v3h-3M14 18h3v3h-3" stroke="var(--text-1)" strokeWidth="1.5" />
              </svg>
            </div>
          )}

          {/* Scan line */}
          {scanning && (
            <div className="absolute left-8 right-8 h-[2px] rounded-full z-10 animate-scanline" style={{ background: "linear-gradient(90deg, transparent, #4ADE80, transparent)" }} />
          )}

          {/* Detected flash */}
          {detected && (
            <div className="absolute inset-0 flex items-center justify-center z-20" style={{ background: "rgba(74,222,128,0.18)" }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "#4ADE80" }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#08111E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
            </div>
          )}
        </div>

        {/* Start / Stop */}
        {!scanning ? (
          <button
            onClick={startCamera}
            className="mt-5 px-6 py-3 rounded-2xl text-sm font-semibold active:scale-95 transition-transform flex items-center gap-2"
            style={{ background: "linear-gradient(135deg, #4ADE80, #22D3EE)", color: "#08111E", boxShadow: "0 8px 24px rgba(74,222,128,0.25)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" stroke="#08111E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /><circle cx="12" cy="13" r="4" stroke="#08111E" strokeWidth="1.8" /></svg>
            {t("qr.startCamera")}
          </button>
        ) : (
          <button onClick={stopCamera} className="mt-5 px-6 py-3 rounded-2xl text-sm font-semibold active:scale-95 transition-transform" style={{ background: "var(--glass-bg)", border: "0.5px solid var(--glass-border)", color: "var(--text-1)" }}>
            {t("qr.stopCamera")}
          </button>
        )}

        <p className="mt-3 text-sm text-center" style={{ color: "var(--text-2)" }}>
          {detected ? t("qr.assetFound") : scanning ? t("qr.pointCamera") : t("qr.tapToStart")}
        </p>
        {error && <p className="mt-1 text-xs text-center max-w-[260px]" style={{ color: "#F59E0B" }}>{error}</p>}
      </div>

      {/* Manual entry */}
      <div className="px-5 mb-6">
        <div className="liquid-glass rounded-2xl p-4">
          <p className="font-semibold text-sm mb-3" style={{ color: "var(--text-1)" }}>{t("qr.enterManually")}</p>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder={t("qr.codePh")}
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              className="flex-1 rounded-xl px-3.5 py-2.5 text-sm outline-none"
              style={{ background: "var(--glass-bg)", border: "0.5px solid var(--glass-border)", color: "var(--text-1)", caretColor: "var(--accent)" }}
            />
            <button
              onClick={() => manualCode.trim() && router.push(`/inventory/qr/${encodeURIComponent(manualCode.trim())}`)}
              disabled={!manualCode.trim()}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center flex-shrink-0"
              style={{
                background: manualCode.trim() ? "linear-gradient(135deg, #4ADE80, #22D3EE)" : "var(--glass-bg)",
                color: manualCode.trim() ? "#08111E" : "var(--text-3)",
                border: manualCode.trim() ? "none" : "0.5px solid var(--glass-border)",
              }}
            >
              {t("qr.findAsset")}
            </button>
          </div>
        </div>
      </div>

      {/* Recent Scans */}
      <div className="px-5">
        <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--text-3)" }}>{t("qr.recentScans")}</p>
        <div className="liquid-glass rounded-2xl overflow-hidden">
          {recentScans.map((scan, i) => (
            <Link key={scan.id} href={scan.href} onClick={stopCamera}>
              <div className="flex items-center gap-3.5 px-4 py-3.5 transition-colors" style={i < recentScans.length - 1 ? { borderBottom: "0.5px solid var(--glass-border)" } : {}}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0" style={{ background: "var(--glass-bg)", border: "0.5px solid var(--glass-border)" }}>{scan.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium" style={{ color: "var(--text-1)" }}>{t(scan.nameKey)}</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-3)" }}>{scan.id} · {t(scan.timeKey)}</p>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.4 }}><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
