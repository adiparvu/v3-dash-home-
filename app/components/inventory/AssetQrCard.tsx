"use client";

/**
 * Real, scannable QR for an inventory asset. Encodes an absolute URL to the
 * asset (so a phone camera opens it directly), renders it to a <canvas>, and
 * offers Download (PNG) and Print Label (a clean, printable sticker layout).
 */
import { useMemo, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { useT } from "../../lib/i18n";

function esc(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));
}

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
    const dataUrl = canvas.toDataURL("image/png");
    const win = window.open("", "_blank", "width=420,height=600");
    if (!win) return;
    win.document.write(`<!doctype html><html><head><meta charset="utf-8" />
      <title>${esc(assetId)}</title>
      <style>
        *{margin:0;padding:0;box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;}
        body{display:flex;align-items:center;justify-content:center;min-height:100vh;background:#fff;padding:24px;}
        .label{width:300px;border:2px solid #0b0b0b;border-radius:18px;padding:22px;text-align:center;}
        .name{font-size:19px;font-weight:700;color:#0b0b0b;line-height:1.2;}
        .loc{font-size:12px;color:#555;margin-top:4px;margin-bottom:16px;}
        img{width:208px;height:208px;display:block;margin:0 auto;}
        .id{margin-top:14px;font-size:17px;font-weight:700;letter-spacing:3px;color:#0b0b0b;}
        .brand{margin-top:8px;font-size:10px;color:#999;letter-spacing:1.5px;text-transform:uppercase;}
        @media print{body{padding:0;} .label{border-color:#000;}}
      </style></head>
      <body><div class="label">
        <div class="name">${esc(assetName)}</div>
        <div class="loc">${esc(location)}</div>
        <img src="${dataUrl}" alt="QR" />
        <div class="id">${esc(assetId)}</div>
        <div class="brand">PRVIO Earth</div>
      </div>
      <script>window.onload=function(){setTimeout(function(){window.focus();window.print();},150);};</script>
      </body></html>`);
    win.document.close();
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
