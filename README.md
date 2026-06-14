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
  images/         # Aset gambar publik
src/
  app/            # Route dan layout Next.js
  components/     # Komponen UI reusable
  constants/      # Konstanta route dan cluster
  data/           # Dataset JSON
  lib/            # K-Means, normalisasi, statistik, rekomendasi
  utils/          # Formatter
docs/             # Dokumentasi project
UI/               # Referensi desain awal
```

## Dataset dan K-Means

Data aplikasi dibaca dari `src/data/tourism.json` yang dihasilkan dari
`public/datasets/Dataset.xlsx`. Fitur clustering terdiri dari
`jumlah_kunjungan`, `musim_libur`, dan `libur_nasional`. Data dinormalisasi
sebelum diproses dengan K = 3, lalu cluster diberi label Sepi, Sedang, dan
Ramai berdasarkan rata-rata jumlah kunjungan.

## Deployment Vercel

1. Push project ke repository GitHub.
2. Import repository melalui Vercel.
3. Gunakan framework preset **Next.js**.
4. Jalankan deployment tanpa konfigurasi tambahan.
