-- =============================================================================
-- 011_documents_storage.sql
-- Private Storage bucket for asset/property documents, with RLS scoped to the
-- property owner. Object path convention:
--   {property_id}/{asset_id}/{uuid}-{filename}
-- so the first path segment is the property id and ownership is enforced by the
-- existing public.owns_property() helper (see 001_initial_schema.sql).
-- =============================================================================

insert into storage.buckets (id, name, public)
values ('documents', 'documents', false)
on conflict (id) do nothing;

-- Owners can read their own property documents (folder[1] = property_id).
create policy "documents storage: owner select"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'documents'
    and public.owns_property(((storage.foldername(name))[1])::uuid)
  );

create policy "documents storage: owner insert"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'documents'
    and public.owns_property(((storage.foldername(name))[1])::uuid)
  );

create policy "documents storage: owner update"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'documents'
    and public.owns_property(((storage.foldername(name))[1])::uuid)
  )
  with check (
    bucket_id = 'documents'
    and public.owns_property(((storage.foldername(name))[1])::uuid)
  );

create policy "documents storage: owner delete"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'documents'
    and public.owns_property(((storage.foldername(name))[1])::uuid)
  );
