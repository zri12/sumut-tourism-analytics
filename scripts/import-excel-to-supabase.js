const path = require("path");
const XLSX = require("xlsx");
const { createClient } = require("@supabase/supabase-js");

const normalizeSupabaseUrl = (value) => {
  try {
    return new URL(value).origin;
  } catch {
    return "";
  }
};

const supabaseUrl = normalizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const shouldReset = process.argv.includes("--reset");

if (!supabaseUrl || !serviceRoleKey) {
  console.error("NEXT_PUBLIC_SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY wajib diisi.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const toNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
};

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

const normalizeMonth = (value) => {
  const text = String(value || "").trim();
  const number = Number(text);
  if (Number.isInteger(number) && number >= 1 && number <= 12) {
    return MONTHS[number - 1];
  }

  const match = MONTHS.find((month) => month.toLowerCase() === text.toLowerCase());
  return match || text;
};

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

async function main() {
  const excelPath = path.join(path.resolve(__dirname, ".."), "public", "datasets", "Dataset.xlsx");
  const workbook = XLSX.readFile(excelPath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = readRows(sheet);
  const mapped = rows
    .map(normalize)
    .filter((row) => row.kabupaten_kota && row.destinasi_wisata && row.tahun && row.bulan);

  const uniqueRows = [...new Map(mapped.map((row) => [rowKey(row), row])).values()];

  if (shouldReset) {
    const { error } = await supabase.from("tourism_data").delete().neq("id", 0);
    if (error) throw error;
  }

  const { data: existingData, error: existingError } = await supabase
    .from("tourism_data")
    .select("kabupaten_kota, destinasi_wisata, tahun, bulan, jumlah_kunjungan, musim_libur, libur_nasional");
  if (existingError) throw existingError;

  const existingKeys = new Set((existingData || []).map(rowKey));
  const rowsToInsert = shouldReset
    ? uniqueRows
    : uniqueRows.filter((row) => !existingKeys.has(rowKey(row)));

  if (!rowsToInsert.length) {
    console.log("Tidak ada data baru untuk diimport.");
    return;
  }

  const { error } = await supabase.from("tourism_data").insert(rowsToInsert);
  if (error) throw error;
  console.log(`${rowsToInsert.length} baris berhasil diimport ke Supabase.`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
