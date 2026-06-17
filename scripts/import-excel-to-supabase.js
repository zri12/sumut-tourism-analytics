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

const toBinary = (value) => (toNumber(value) === 0 ? 0 : 1);

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

async function main() {
  const excelPath = path.join(process.cwd(), "public", "datasets", "Dataset.xlsx");
  const workbook = XLSX.readFile(excelPath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet);
  const mapped = rows
    .map(normalize)
    .filter((row) => row.kabupaten_kota && row.destinasi_wisata && row.bulan);

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
