const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");

const shouldReset = process.argv.includes("--reset");
const excelPath = path.join(process.cwd(), "public", "datasets", "Dataset.xlsx");
const outputPath = path.join(process.cwd(), "database", "tourism_data_seed.sql");

const MONTHS = [
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

const toNumber = (value) => {
  const number = Number(String(value ?? "").replace(/,/g, "").trim());
  return Number.isFinite(number) ? Math.trunc(number) : 0;
};

const toBinary = (value) => (toNumber(value) === 0 ? 0 : 1);

const normalizeMonth = (value) => {
  const text = String(value ?? "").trim();
  const number = Number(text);
  if (Number.isInteger(number) && number >= 1 && number <= 12) {
    return MONTHS[number - 1];
  }

  const match = MONTHS.find((month) => month.toLowerCase() === text.toLowerCase());
  return match || text;
};

const sqlText = (value) => `'${String(value ?? "").replace(/'/g, "''")}'`;

const normalize = (row) => ({
  kabupaten_kota: String(row["Kabupaten/Kota"] || "").trim(),
  destinasi_wisata: String(row["Destinasi Wisata"] || "").trim(),
  tahun: toNumber(row["Tahun"]),
  bulan: normalizeMonth(row["Bulan"]),
  jumlah_kunjungan: toNumber(row["Jumlah Kunjungan"]),
  musim_libur: toBinary(row["Musim Libur (0/1)"]),
  libur_nasional: toBinary(row["Libur Nasional (0/1)"]),
});

const rowKey = (row) =>
  [
    row.kabupaten_kota,
    row.destinasi_wisata,
    row.tahun,
    row.bulan,
    row.jumlah_kunjungan,
    row.musim_libur,
    row.libur_nasional,
  ].join("|");

const toSqlTuple = (row) =>
  `(${sqlText(row.kabupaten_kota)}, ${sqlText(row.destinasi_wisata)}, ${row.tahun}, ${sqlText(row.bulan)}, ${row.jumlah_kunjungan}, ${row.musim_libur}, ${row.libur_nasional})`;

function main() {
  const workbook = XLSX.readFile(excelPath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });
  const mapped = rows
    .map(normalize)
    .filter((row) => row.kabupaten_kota && row.destinasi_wisata && row.tahun && row.bulan);
  const uniqueRows = [...new Map(mapped.map((row) => [rowKey(row), row])).values()];

  const statements = [
    "-- ==================================================",
    "-- TOURISM DATA SEED",
    "-- Generated from public/datasets/Dataset.xlsx",
    "-- ==================================================",
    "",
  ];

  if (shouldReset) {
    statements.push("truncate table public.tourism_data restart identity cascade;", "");
  }

  statements.push(
    "insert into public.tourism_data",
    "(kabupaten_kota, destinasi_wisata, tahun, bulan, jumlah_kunjungan, musim_libur, libur_nasional)",
    "values",
    `${uniqueRows.map(toSqlTuple).join(",\n")}`,
    "on conflict (kabupaten_kota, destinasi_wisata, tahun, bulan, jumlah_kunjungan, musim_libur, libur_nasional) do nothing;",
    "",
  );

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, statements.join("\n"), "utf8");
  console.log(`Berhasil membuat ${outputPath}`);
  console.log(`${uniqueRows.length} baris unik ditulis dari ${mapped.length} baris valid Excel.`);
}

main();
