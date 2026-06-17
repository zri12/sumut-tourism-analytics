# Data Mining Pola Kunjungan Wisatawan

Website penelitian berjudul **Data Mining Pada Pola Kunjungan Wisatawan Menggunakan Algoritma K-Means Clustering untuk Rekomendasi Waktu Berkunjung Ideal di Destinasi Sumatera Utara**.

## Tech Stack

- Next.js App Router
- React JavaScript JSX
- Tailwind CSS
- Recharts
- Lucide React
- K-Means Clustering JavaScript
- Supabase PostgreSQL
- Vercel

## Setup Supabase

1. Buka Supabase Dashboard.
2. Buat project baru.
3. Masuk ke menu SQL Editor.
4. Jalankan isi file `database/supabase_schema.sql`.
5. Masuk ke menu Project Settings.
6. Ambil Project URL, anon/public key, dan service_role key.
7. Masukkan ke file `.env.local`.
8. Pastikan RLS aktif pada tabel `admins` dan `tourism_data`.
9. Pastikan policy public read untuk `tourism_data` sudah ada.
10. Pastikan policy service_role untuk `admins` dan `tourism_data` sudah ada.

Isi `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=change_this_secret_key
```

## Import Dataset

Dataset awal ada di:

```text
public/datasets/Dataset.xlsx
```

Generate SQL dari Excel:

```bash
npm run db:generate-sql:reset
```

Lalu jalankan isi file ini di Supabase SQL Editor:

```text
database/tourism_data_seed.sql
```

Alternatif import langsung ke Supabase:

```bash
npm run db:import-excel:reset
```

Script import/generate akan membaca semua baris valid dari Excel, mengubah bulan angka `1..12` menjadi `Januari..Desember`, dan menormalisasi kolom flag `Musim Libur (0/1)` serta `Libur Nasional (0/1)` menjadi nilai `0` atau `1`.

## Seed Admin

```bash
npm run db:seed-admin
```

Default admin:

```text
username: admin
password: admin123
```

## Menjalankan Project

```bash
npm install
npm run db:generate-sql:reset
npm run db:seed-admin
npm run dev
```

Public:

```text
http://localhost:3000
```

Admin:

```text
http://localhost:3000/admin/login
```

## Perintah

```bash
npm run convert:data
npm run db:generate-sql
npm run db:generate-sql:reset
npm run db:seed-admin
npm run db:import-excel
npm run db:import-excel:reset
npm run dev
npm run build
npm run start
```

## Alur Data

```text
Supabase PostgreSQL
API /api/tourism
Halaman public
K-Means JavaScript
Cluster Sepi / Sedang / Ramai
Grafik dan rekomendasi
```

Halaman `/`, `/dataset`, `/clustering`, `/results`, dan `/recommendations` memakai data dari `/api/tourism`. File Excel tidak dibaca sebagai sumber data runtime.

Fitur clustering memakai `jumlah_kunjungan`, `musim_libur`, dan `libur_nasional` dengan K = 3. Label cluster ditentukan dari rata-rata kunjungan: terendah Sepi, tengah Sedang, tertinggi Ramai.

## Struktur Folder

```text
database/         # SQL schema dan SQL seed dataset
public/datasets/  # File Excel asli
scripts/          # Generate SQL, seed admin, dan import Excel
src/app/          # Route, API route, dan halaman Next.js
src/components/   # Komponen UI dan admin
src/lib/          # K-Means, Supabase client, auth, statistik, rekomendasi
src/utils/        # Formatter
```

## Deployment Vercel

1. Import repository ke Vercel.
2. Pastikan Framework Preset adalah Next.js.
3. Isi Environment Variables sesuai `.env.example`.
4. Jalankan `database/supabase_schema.sql` di Supabase.
5. Jalankan `database/tourism_data_seed.sql` di Supabase atau gunakan `npm run db:import-excel:reset`.
6. Jalankan `npm run db:seed-admin`.
7. Deploy.

Service role key hanya dipakai di API route server-side dan script lokal. Jangan gunakan `SUPABASE_SERVICE_ROLE_KEY` di client component.
