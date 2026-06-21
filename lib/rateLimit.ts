/**
 * Lightweight in-memory rate limiter (spec: Security & AI Guardrails → API rate
 * limiting, throttling, and abuse prevention). Fixed-window per key.
 *
 * Note: state is per-runtime-instance (best-effort on serverless/edge). It is a
 * baseline abuse-prevention control; a shared store (e.g. Upstash/Redis) is the
 * upgrade path for strict, cross-instance limits.
 */
export type RateRule = { limit: number; windowMs: number };

type Bucket = { count: number; resetAt: number };
const store = new Map<string, Bucket>();

/** Stricter limits for the AI layer; a generous default elsewhere. */
export function ruleForPath(pathname: string): RateRule {
  if (pathname.startsWith("/api/v1/ai/")) return { limit: 20, windowMs: 60_000 };
  return { limit: 120, windowMs: 60_000 };
}

export function rateLimit(key: string, rule: RateRule): { ok: boolean; retryAfter: number; remaining: number } {
  const now = Date.now();

  // Bound memory: occasionally sweep expired buckets.
  if (store.size > 5000) {
    store.forEach((b, k) => { if (now >= b.resetAt) store.delete(k); });
  }

  const bucket = store.get(key);
  if (!bucket || now >= bucket.resetAt) {
    store.set(key, { count: 1, resetAt: now + rule.windowMs });
    return { ok: true, retryAfter: 0, remaining: rule.limit - 1 };
  }
  if (bucket.count >= rule.limit) {
    return { ok: false, retryAfter: Math.ceil((bucket.resetAt - now) / 1000), remaining: 0 };
  }
  bucket.count += 1;
  return { ok: true, retryAfter: 0, remaining: rule.limit - bucket.count };
}
