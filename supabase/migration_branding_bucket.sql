-- Jalankan ini di Supabase Dashboard > SQL Editor
-- (tambahan setelah schema.sql yang pertama, untuk fitur upload foto beranda)

insert into storage.buckets (id, name, public)
values ('branding', 'branding', true)
on conflict (id) do nothing;

create policy "Public read branding files"
  on storage.objects for select
  using (bucket_id = 'branding');

create policy "Admin upload branding files"
  on storage.objects for insert
  with check (bucket_id = 'branding' and auth.role() = 'authenticated');

create policy "Admin update branding files"
  on storage.objects for update
  using (bucket_id = 'branding' and auth.role() = 'authenticated');
