-- Jalankan script ini di Supabase Dashboard > SQL Editor

-- 1. Tabel lagu
create table if not exists songs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  cover_url text,
  audio_url text not null,
  file_path text not null,
  duration_seconds int,
  play_count int default 0,
  created_at timestamptz default now()
);

alter table songs enable row level security;

-- Siapa saja boleh membaca daftar lagu (untuk halaman beranda publik)
create policy "Public read songs"
  on songs for select
  using (true);

-- Hanya user yang sudah login (admin) yang boleh insert/update/delete
create policy "Admin manage songs"
  on songs for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- 2. Tabel konten halaman (beranda, profil, kontak) — disimpan sebagai key-value JSON
create table if not exists site_content (
  key text primary key,
  data jsonb not null,
  updated_at timestamptz default now()
);

alter table site_content enable row level security;

create policy "Public read content"
  on site_content for select
  using (true);

create policy "Admin manage content"
  on site_content for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- 3. Data awal (default) supaya halaman tidak kosong sebelum admin edit
insert into site_content (key, data) values
  ('beranda', '{
    "logo_url": "",
    "deskripsi": "Musisi independen. Menulis dan memproduksi musik sendiri sejak 2020."
  }'),
  ('profil', '{
    "deskripsi": "Ceritakan di sini perjalanan musikmu dari awal mula hingga sekarang."
  }'),
  ('kontak', '{
    "email": "",
    "whatsapp": "",
    "facebook": "",
    "instagram": "",
    "x": "",
    "youtube": ""
  }')
on conflict (key) do nothing;

-- 4. Storage bucket untuk file audio & cover (buat manual juga bisa lewat Dashboard > Storage)
insert into storage.buckets (id, name, public)
values ('songs', 'songs', true)
on conflict (id) do nothing;

-- Policy: siapa saja boleh membaca file (karena bucket public untuk streaming/download)
create policy "Public read song files"
  on storage.objects for select
  using (bucket_id = 'songs');

-- Policy: hanya user login yang boleh upload/hapus file
create policy "Admin upload song files"
  on storage.objects for insert
  with check (bucket_id = 'songs' and auth.role() = 'authenticated');

create policy "Admin delete song files"
  on storage.objects for delete
  using (bucket_id = 'songs' and auth.role() = 'authenticated');
