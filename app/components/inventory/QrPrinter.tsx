"use client";

/**
 * Headless printer: renders a single off-screen QR canvas for one asset, then
 * opens the print-label window once it has painted and calls onDone. Mount it
 * conditionally (one at a time) to print a label without leaving the list.
 */
import { useEffect, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { labelHtml, printLabelWindow } from "../../lib/printLabel";

export default function QrPrinter({
  path,
  name,
  assetId,
  location,
  onDone,
}: {
  path: string;
  name: string;
  assetId: string;
  location: string;
  onDone: () => void;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const value = `${typeof window !== "undefined" ? window.location.origin : ""}${path}`;

  useEffect(() => {
    const id = setTimeout(() => {
      const canvas = ref.current;
      if (canvas) printLabelWindow(labelHtml({ dataUrl: canvas.toDataURL("image/png"), name, assetId, location }));
      onDone();
    }, 80);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div aria-hidden style={{ position: "fixed", left: -9999, top: -9999, pointerEvents: "none" }}>
      <QRCodeCanvas ref={ref} value={value} size={208} level="M" marginSize={2} />
    </div>
  );
}
