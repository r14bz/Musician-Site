# Website musisi (Next.js + Supabase)

## Struktur halaman
- `/` — Beranda: logo, deskripsi, daftar lagu (play/download/share), ikon sosial media
- `/profil` — cerita perjalanan musikmu
- `/kontak` — email, WhatsApp, Facebook, Instagram, X, YouTube
- `/login` — login admin
- `/admin` — dashboard admin (dilindungi, tidak diindex Google): upload lagu, edit isi beranda/profil/kontak

## 1. Setup Supabase
1. Buka project Supabase kamu → menu **SQL Editor**.
2. Copy-paste seluruh isi file `supabase/schema.sql`, lalu jalankan (Run).
   Ini akan membuat tabel `songs`, `site_content`, bucket storage `songs`, dan security policy-nya.
3. Buat akun admin: buka **Authentication > Users > Add user**, isi email dan password kamu sendiri.
   Ini akun yang dipakai untuk login ke `/admin`.

## 2. Setup environment variable
1. Buka **Project Settings > API** di Supabase, salin `Project URL` dan `anon public key`.
2. Copy file `.env.local.example` menjadi `.env.local`, lalu isi:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_SITE_URL=https://namadomainkamu.com
```

## 3. Install dan jalankan lokal
```
npm install
npm run dev
```
Buka `http://localhost:3000`.

## 4. Deploy ke Vercel
1. Push folder ini ke repository GitHub.
2. Import repo di [vercel.com](https://vercel.com).
3. Saat setup, masukkan environment variable yang sama seperti di `.env.local`.
4. Deploy. Setelah live, update `NEXT_PUBLIC_SITE_URL` ke domain asli lalu redeploy.

## 5. Supaya terindex Google
- File `app/sitemap.js` dan `app/robots.js` otomatis menghasilkan `/sitemap.xml` dan `/robots.txt` — tidak perlu setup manual.
- Setelah live, daftarkan domainmu di **Google Search Console** (search.google.com/search-console), verifikasi kepemilikan domain, lalu submit `https://namadomainkamu.com/sitemap.xml`.
- Halaman `/admin` dan `/login` otomatis diblokir dari indexing lewat `robots.js`.
- Semua halaman publik (beranda, profil, kontak) di-render di server (Server Components), jadi kontennya langsung terbaca Google tanpa perlu JavaScript — bagus untuk SEO.

## Mengganti nama "Namamu"
Cari teks "Namamu" di `app/layout.jsx` dan "namamu" di `components/Navbar.jsx`, ganti dengan nama artis/panggungmu.

## Catatan upload lagu
- Format file bisa mp3, wav, dll — disimpan di Supabase Storage bucket `songs` (public, jadi bisa langsung di-stream/download).
- Field cover lagu (`cover_url`) sudah disiapkan di database kalau nanti kamu mau tambahkan upload cover art per lagu.
