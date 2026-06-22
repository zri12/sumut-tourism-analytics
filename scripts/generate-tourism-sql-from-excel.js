const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");

const shouldReset = process.argv.includes("--reset");
const projectRoot = path.resolve(__dirname, "..");
const inputArgumentIndex = process.argv.indexOf("--input");
const inputArgument = inputArgumentIndex >= 0 ? process.argv[inputArgumentIndex + 1] : "";
const excelPath = inputArgument
  ? path.resolve(inputArgument)
  : path.join(projectRoot, "public", "datasets", "Dataset.xlsx");
const outputPath = path.join(projectRoot, "database", "tourism_data_seed.sql");
const deleteOutputPath = path.join(projectRoot, "database", "tourism_data_delete.sql");

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

const getValue = (row, names) => {
  for (const name of names) {
    if (Object.prototype.hasOwnProperty.call(row, name)) return row[name];
  }
  return "";
};

const readRows = (sheet) => {
  const matrix = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "", raw: true });
  const headerIndex = matrix.findIndex((row) =>
    row.some((cell) => ["Kabupaten/Kota", "Kabupaten / Kota"].includes(String(cell).trim())),
  );

  if (headerIndex < 0) {
    throw new Error("Header Kabupaten/Kota tidak ditemukan pada sheet pertama.");
  }

  const headers = matrix[headerIndex].map((header) => String(header).trim());
  return matrix.slice(headerIndex + 1).map((values) =>
    Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""])),
  );
};

const normalize = (row) => ({
  kabupaten_kota: String(getValue(row, ["Kabupaten/Kota", "Kabupaten / Kota"])).trim(),
  destinasi_wisata: String(getValue(row, ["Destinasi Wisata"])).trim(),
  tahun: toNumber(getValue(row, ["Tahun"])),
  bulan: normalizeMonth(getValue(row, ["Bulan", "Nama Bulan", "No. Bulan"])),
  jumlah_kunjungan: toNumber(getValue(row, ["Jumlah Kunjungan", "Jumlah Kunjungan (Orang)"])),
  musim_libur: toNumber(getValue(row, ["Musim Libur (0/1)", "Musim Libur Sekolah (0/1)"])),
  libur_nasional: toNumber(getValue(row, ["Libur Nasional (0/1)", "Jumlah Hari Libur Nasional"])),
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
  const rows = readRows(sheet);
  const mapped = rows
    .map(normalize)
    .filter((row) => row.kabupaten_kota && row.destinasi_wisata && row.tahun && row.bulan);
  const uniqueRows = [...new Map(mapped.map((row) => [rowKey(row), row])).values()];

  const statements = [
    "-- ==================================================",
    "-- TOURISM DATA SEED",
    `-- Generated from ${excelPath.replace(/\\/g, "/")}`,
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
  fs.writeFileSync(
    deleteOutputPath,
    [
      "-- Hapus seluruh dataset lama sebelum menjalankan tourism_data_seed.sql",
      "begin;",
      "truncate table public.tourism_data restart identity;",
      "commit;",
      "",
    ].join("\n"),
    "utf8",
  );
  fs.writeFileSync(outputPath, statements.join("\n"), "utf8");
  console.log(`Berhasil membuat ${deleteOutputPath}`);
  console.log(`Berhasil membuat ${outputPath}`);
  console.log(`${uniqueRows.length} baris unik ditulis dari ${mapped.length} baris valid Excel.`);
}

main();
