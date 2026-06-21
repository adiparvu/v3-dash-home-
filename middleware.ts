import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "./lib/supabase/middleware";
import { rateLimit, ruleForPath } from "./lib/rateLimit";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rate-limit the versioned API (per client IP, stricter for the AI layer).
  if (pathname.startsWith("/api/v1/")) {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "anon";
    const group = pathname.startsWith("/api/v1/ai/") ? "ai" : "v1";
    const result = rateLimit(`${ip}:${group}`, ruleForPath(pathname));
    if (!result.ok) {
      return NextResponse.json(
        { apiVersion: "1.0.0", error: "rate_limited" },
        {
          status: 429,
          headers: {
            "Retry-After": String(result.retryAfter),
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }
  }

  return updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static assets and image files:
     * - _next/static, _next/image
     * - favicon and common static file extensions
     */
    "/((?!_next/static|_next/image|favicon.ico|fonts|manifest.json|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2)$).*)",
  ],
};
