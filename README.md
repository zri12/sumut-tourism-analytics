# Data Mining Pola Kunjungan Wisatawan

Website penelitian berjudul **Data Mining Pada Pola Kunjungan Wisatawan Menggunakan Algoritma K-Means Clustering untuk Rekomendasi Waktu Berkunjung Ideal di Destinasi Sumatera Utara**.

## Tech Stack

- Next.js App Router (JavaScript)
- React
- Tailwind CSS
- Recharts
- Lucide React
- K-Means Clustering dengan JavaScript

## Instalasi

```bash
npm install
npm run dev
```

Buka `http://localhost:3000` pada browser.

## Perintah

```bash
npm run convert:data
npm run dev
npm run build
npm run start
```

`npm run convert:data` membaca `public/datasets/Dataset.xlsx` dan membentuk
`src/data/tourism.json` dari sheet pertama. Jalankan kembali perintah tersebut
setiap kali file Excel diperbarui.

## Struktur Folder

```text
public/
  datasets/       # File Excel asli
src/
  app/            # Route dan layout Next.js
  components/     # Komponen UI reusable
  constants/      # Konstanta route dan cluster
  data/           # Dataset JSON
  lib/            # K-Means, normalisasi, statistik, rekomendasi
  utils/          # Formatter
scripts/          # Konversi Excel menjadi JSON
```

## Dataset dan K-Means

Data aplikasi dibaca dari `src/data/tourism.json` yang dihasilkan dari
`public/datasets/Dataset.xlsx`. Fitur clustering terdiri dari
`jumlah_kunjungan`, `musim_libur`, dan `libur_nasional`. Data dinormalisasi
sebelum diproses dengan K = 3, lalu cluster diberi label Sepi, Sedang, dan
Ramai berdasarkan rata-rata jumlah kunjungan.

## Deployment Vercel

Project sudah dikonfigurasi melalui `vercel.json`:

- Framework: **Next.js**
- Install command: `npm ci`
- Build command: `npm run build`
- Node.js: `24.x`
- Output directory: otomatis dikelola oleh preset Next.js

Langkah deployment:

1. Buka [Vercel](https://vercel.com/new).
2. Import repository `zri12/sumut-tourism-analytics`.
3. Pastikan **Root Directory** adalah root repository.
4. Biarkan Framework Preset sebagai **Next.js**.
5. Tidak perlu menambahkan Environment Variables.
6. Klik **Deploy**.

Dataset Excel tidak dibaca saat runtime Vercel. Aplikasi menggunakan
`src/data/tourism.json` yang sudah tersedia di repository. Jika Excel berubah,
jalankan `npm run convert:data`, commit hasil JSON, lalu push kembali agar
Vercel melakukan deployment ulang.
