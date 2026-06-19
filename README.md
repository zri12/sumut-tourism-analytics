# Data Mining Pola Kunjungan Wisatawan Sumatera Utara

Website penelitian untuk menganalisis pola kunjungan wisatawan menggunakan algoritma **K-Means Clustering** dan menghasilkan rekomendasi waktu berkunjung ideal pada destinasi wisata di Sumatera Utara.

## Fitur Utama

- Dashboard ringkasan kunjungan wisatawan.
- Eksplorasi dataset berdasarkan destinasi, wilayah, bulan, dan tahun.
- Proses clustering K-Means dengan K = 3.
- Visualisasi hasil cluster Sepi, Sedang, dan Ramai.
- Rekomendasi waktu berkunjung berdasarkan hasil cluster dan tren bulanan.
- Panel admin untuk login, melihat ringkasan, serta mengelola data wisata.

## Tech Stack

- Next.js App Router
- React
- Tailwind CSS
- Recharts
- Lucide React
- Supabase PostgreSQL
- Vercel

## Struktur Project

```text
database/         SQL schema dan seed dataset
public/datasets/  File Excel sumber dataset
scripts/          Script generate SQL, import Excel, dan seed admin
src/app/          Halaman dan API route Next.js
src/components/   Komponen UI, dashboard, dataset, hasil, rekomendasi, admin
src/constants/    Konstanta route dan cluster
src/lib/          Supabase, auth admin, K-Means, statistik, rekomendasi
src/utils/        Formatter tampilan
```

## Environment Variables

Buat `.env.local` untuk development lokal atau isi Environment Variables di Vercel:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=change_this_secret_key
```

`SUPABASE_SERVICE_ROLE_KEY` hanya dipakai di server/API route dan script lokal. Jangan gunakan key ini di client component.

## Setup Database Supabase

1. Buat project di Supabase.
2. Buka SQL Editor.
3. Jalankan `database/supabase_schema.sql`.
4. Generate ulang seed dari Excel bila dataset berubah:

```bash
npm run db:generate-sql:reset
```

5. Jalankan `database/tourism_data_seed.sql` di SQL Editor.
6. Buat admin awal:

```bash
npm run db:seed-admin
```

Default admin:

```text
username: admin
password: admin123
```

## Menjalankan Lokal

```bash
npm install
npm run dev
```

URL aplikasi:

```text
Public: http://localhost:3000
Admin:  http://localhost:3000/admin/login
```

## Perintah NPM

```bash
npm run dev
npm run build
npm run start
npm run db:generate-sql
npm run db:generate-sql:reset
npm run db:import-excel
npm run db:import-excel:reset
npm run db:seed-admin
```

## Alur Data

```text
Supabase PostgreSQL
API /api/tourism
Halaman public dan dashboard admin
K-Means JavaScript
Cluster Sepi / Sedang / Ramai
Grafik dan rekomendasi waktu kunjungan
```

Halaman `/`, `/dataset`, `/clustering`, `/results`, dan `/recommendations` mengambil data dari Supabase melalui helper server-side. File Excel di `public/datasets/Dataset.xlsx` adalah sumber dataset untuk generate/import, bukan sumber data runtime aplikasi.

Clustering memakai atribut `jumlah_kunjungan`, `musim_libur`, dan `libur_nasional`. Label cluster ditentukan dari rata-rata kunjungan: cluster terendah menjadi Sepi, tengah menjadi Sedang, dan tertinggi menjadi Ramai.

## Deployment Vercel

1. Import repository ini ke Vercel.
2. Pastikan Framework Preset adalah Next.js.
3. Isi Environment Variables sesuai `.env.example`.
4. Pastikan database Supabase sudah berisi schema, seed data, dan admin.
5. Deploy.

Konfigurasi Vercel sudah tersedia di `vercel.json` dengan `npm ci` sebagai install command dan `npm run build` sebagai build command.
