-- Jalankan ini di Supabase Dashboard > SQL Editor
-- (tambahan untuk fitur: lirik, embed video, play count)

-- 1. Kolom lirik di tabel songs
alter table songs add column if not exists lyrics text;

-- 2. Tabel video YouTube
create table if not exists videos (
  id uuid primary key default gen_random_uuid(),
  youtube_id text not null,
  title text,
  created_at timestamptz default now()
);

alter table videos enable row level security;

create policy "Public read videos"
  on videos for select
  using (true);

create policy "Admin manage videos"
  on videos for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- 3. Fungsi untuk menambah play count tanpa perlu login
-- (aman karena hanya boleh menambah 1, tidak bisa mengubah data lain)
create or replace function increment_play_count(song_id uuid)
returns void
language sql
security definer
as $$
  update songs set play_count = coalesce(play_count, 0) + 1 where id = song_id;
$$;

grant execute on function increment_play_count(uuid) to anon, authenticated;
