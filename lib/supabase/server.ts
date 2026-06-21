import { createServerClient } from '@supabase/ssr'
import { cookies, headers } from 'next/headers'
import { Database } from '../types/database.types'
import { extractBearerToken } from './auth-header'

/**
 * Read a bearer token from the incoming request's Authorization header, if any.
 * Lets token-based clients (the native Apple app) authenticate against the same
 * `/api/v1` as the cookie-based web client.
 */
export async function bearerToken(): Promise<string | null> {
  try {
    const headerStore = await headers()
    return extractBearerToken(headerStore.get('authorization'))
  } catch {
    // headers() is unavailable outside a request scope — treat as no token.
    return null
  }
}

export async function createClient() {
  const cookieStore = await cookies()
  const token = await bearerToken()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      // When a bearer token is present, scope every PostgREST/RPC request to that
      // user so RLS sees the right auth.uid(); the cookie session is used otherwise.
      ...(token
        ? { global: { headers: { Authorization: `Bearer ${token}` } } }
        : {}),
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // setAll called from a Server Component — cookies can only be
            // mutated in a Server Action or Route Handler; safe to ignore.
          }
        },
      },
    }
  )
}

export async function createServiceClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Safe to ignore in Server Components
          }
        },
      },
    }
  )
}
