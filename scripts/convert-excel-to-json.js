const fs = require("node:fs");
const path = require("node:path");
const XLSX = require("xlsx");

const projectRoot = path.resolve(__dirname, "..");
const inputPath = path.join(projectRoot, "public", "datasets", "Dataset.xlsx");
const outputPath = path.join(projectRoot, "src", "data", "tourism.json");

const monthNames = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

function toText(value) {
  if (value === null || value === undefined || String(value).trim() === "") {
    return "-";
  }
  return String(value).trim();
}

function toNumber(value) {
  if (value === null || value === undefined || value === "") return 0;
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;

  const normalized = String(value)
    .trim()
    .replace(/\s/g, "")
    .replace(/\.(?=\d{3}(?:\D|$))/g, "")
    .replace(",", ".");
  const number = Number(normalized);
  return Number.isFinite(number) ? number : 0;
}

function toMonth(value) {
  const numericMonth = toNumber(value);
  if (Number.isInteger(numericMonth) && numericMonth >= 1 && numericMonth <= 12) {
    return monthNames[numericMonth - 1];
  }
  return toText(value);
}

function isEmptyRow(row) {
  const fields = [
    "Kabupaten/Kota",
    "Destinasi Wisata",
    "Tahun",
    "Bulan",
    "Jumlah Kunjungan",
    "Musim Libur (0/1)",
    "Libur Nasional (0/1)",
  ];
  return fields.every((field) => {
    const value = row[field];
    return value === null || value === undefined || String(value).trim() === "";
  });
}

if (!fs.existsSync(inputPath)) {
  throw new Error(`File Excel tidak ditemukan: ${inputPath}`);
}

const workbook = XLSX.readFile(inputPath);
const firstSheetName = workbook.SheetNames[0];

if (!firstSheetName) {
  throw new Error("Workbook tidak memiliki sheet.");
}

const rows = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheetName], {
  defval: null,
  raw: true,
});

const tourismData = rows
  .filter((row) => !isEmptyRow(row))
  .map((row, index) => ({
    id: index + 1,
    kabupaten_kota: toText(row["Kabupaten/Kota"]),
    destinasi_wisata: toText(row["Destinasi Wisata"]),
    tahun: toNumber(row.Tahun),
    bulan: toMonth(row.Bulan),
    jumlah_kunjungan: toNumber(row["Jumlah Kunjungan"]),
    musim_libur: toNumber(row["Musim Libur (0/1)"]),
    libur_nasional: toNumber(row["Libur Nasional (0/1)"]),
  }));

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(tourismData, null, 2)}\n`, "utf8");

console.log(`Sheet: ${firstSheetName}`);
console.log(`Data berhasil dikonversi: ${tourismData.length} baris`);
console.log(`Output: ${outputPath}`);
