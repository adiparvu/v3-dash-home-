/**
 * Chart geometry helpers — Revolut-style smooth line/area paths.
 *
 * Produces monotone-ish smooth SVG paths (Catmull-Rom → cubic Bézier) so the
 * app's graphs read like Revolut's: flowing curves rather than polylines, with a
 * gradient area underneath. Signature-compatible with the previous scaledPath /
 * seriesPath helpers so they can delegate here.
 */
export type Pt = [number, number];

/** Map values to screen points. With `max` set, scale 0..max (clamped); else auto min..max. */
export function pointsFromValues(
  values: number[],
  w: number,
  h: number,
  pad: number,
  max?: number,
): Pt[] {
  if (values.length === 0) return [];
  const lo = max !== undefined ? 0 : Math.min(...values);
  const hi = max !== undefined ? max : Math.max(...values);
  const span = hi - lo || 1;
  const stepX = values.length > 1 ? (w - pad * 2) / (values.length - 1) : 0;
  return values.map((v, i) => {
    const t = Math.min(1, Math.max(0, (v - lo) / span));
    return [pad + i * stepX, pad + (h - pad * 2) * (1 - t)] as Pt;
  });
}

/** Smooth path through points using a Catmull-Rom spline expressed as cubic Béziers. */
export function smoothFromPoints(pts: Pt[], tension = 0.2): string {
  if (pts.length === 0) return "";
  if (pts.length === 1) return `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  const d = [`M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1[0] + (p2[0] - p0[0]) * tension;
    const c1y = p1[1] + (p2[1] - p0[1]) * tension;
    const c2x = p2[0] - (p3[0] - p1[0]) * tension;
    const c2y = p2[1] - (p3[1] - p1[1]) * tension;
    d.push(`C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`);
  }
  return d.join(" ");
}

/** Smooth line path for `values`. */
export function smoothPath(values: number[], w: number, h: number, pad: number, max?: number): string {
  return smoothFromPoints(pointsFromValues(values, w, h, pad, max));
}

/** Smooth area path (line closed down to the baseline) for gradient fills. */
export function smoothAreaPath(values: number[], w: number, h: number, pad: number, max?: number): string {
  const line = smoothPath(values, w, h, pad, max);
  if (!line) return "";
  return `${line} L${(w - pad).toFixed(1)},${(h - pad).toFixed(1)} L${pad.toFixed(1)},${(h - pad).toFixed(1)} Z`;
}

/** Final point (for an endpoint dot). */
export function lastPoint(values: number[], w: number, h: number, pad: number, max?: number): Pt | null {
  const pts = pointsFromValues(values, w, h, pad, max);
  return pts.length ? pts[pts.length - 1] : null;
}
