-- =============================================================================
-- PRVIO Earth — Harden function grants
-- Migration: 003_harden_function_grants.sql
--
-- Addresses Supabase security advisors 0028/0029: SECURITY DEFINER functions
-- should not be exposed on the REST RPC surface. Trigger-only helpers never need
-- to be callable directly (triggers fire regardless of EXECUTE grants).
-- =============================================================================

revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.handle_updated_at() from public, anon, authenticated;

-- owns_property() is referenced inside RLS policies, so it must remain executable
-- by the authenticated role; revoke only from anon (which never passes RLS anyway).
revoke execute on function public.owns_property(uuid) from public, anon;
