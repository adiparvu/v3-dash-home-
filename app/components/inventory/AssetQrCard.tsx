"use client";

/**
 * Real, scannable QR for an inventory asset. Encodes an absolute URL to the
 * asset (so a phone camera opens it directly), renders it to a <canvas>, and
 * offers Download (PNG) and Print Label (a clean, printable sticker layout).
 */
import { useMemo, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { useT } from "../../lib/i18n";
import { labelHtml, printLabelWindow } from "../../lib/printLabel";

export default function AssetQrCard({
  path,
  assetName,
  assetId,
  location,
}: {
  /** App path the QR should resolve to, e.g. "/inventory/water-pump". */
  path: string;
  assetName: string;
  assetId: string;
  location: string;
}) {
  const t = useT();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Absolute URL so a phone's native camera opens the asset directly.
  const value = useMemo(() => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    return `${origin}${path}`;
  }, [path]);

  function download() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = `${assetId || "asset"}-qr.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  function printLabel() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    printLabelWindow(labelHtml({ dataUrl: canvas.toDataURL("image/png"), name: assetName, assetId, location }));
  }

  return (
    <div className="flex flex-col items-center">
      {/* QR card */}
      <div className="liquid-glass w-full rounded-2xl p-6 flex flex-col items-center mb-4">
        <div className="rounded-2xl p-3 mb-4" style={{ background: "white" }}>
          <QRCodeCanvas ref={canvasRef} value={value} size={176} level="M" marginSize={2} title={assetId} />
        </div>
        <p className="text-sm font-medium mb-1" style={{ color: "var(--text-2)" }}>{t("idet.assetId")}</p>
        <p className="font-bold text-lg tracking-widest" style={{ color: "var(--text-1)" }}>{assetId}</p>
      </div>

      {/* Download QR */}
      <button
        onClick={download}
        className="w-full py-3.5 rounded-2xl text-sm font-semibold mb-3 active:scale-[0.98] transition-transform"
        style={{ background: "linear-gradient(135deg, #4ADE80, #22D3EE)", color: "#050A14" }}
      >
        {t("idet.downloadQr")}
      </button>

      {/* Print Label */}
      <button
        onClick={printLabel}
        className="w-full py-3.5 rounded-2xl text-sm font-semibold active:scale-[0.98] transition-transform"
        style={{ background: "var(--glass-bg)", color: "var(--text-1)", border: "0.5px solid var(--glass-border)", backdropFilter: "blur(20px)" }}
      >
        {t("idet.printLabel")}
      </button>
    </div>
  );
}
