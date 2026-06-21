/**
 * Parse a bearer token from an HTTP `Authorization` header value.
 *
 * Native clients (the Apple app) authenticate with `Authorization: Bearer <jwt>`
 * rather than the SSR cookie session used by the web client. This is the single,
 * pure place that recognises that scheme so it can be unit-tested in isolation.
 *
 * Returns the raw token (no validation — the caller validates it against Supabase
 * via `auth.getUser(token)`), or `null` when the header is absent or not a
 * non-empty `Bearer` credential.
 */
export function extractBearerToken(header: string | null | undefined): string | null {
  if (!header) return null;
  const match = /^Bearer[ ]+(.+)$/i.exec(header.trim());
  const token = match?.[1]?.trim();
  return token ? token : null;
}
