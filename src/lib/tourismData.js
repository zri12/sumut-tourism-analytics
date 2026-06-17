import { supabase } from "@/lib/supabaseClient";

export const MONTH_ORDER = [
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

const PAGE_SIZE = 1000;

export const sortTourismRows = (data) =>
  [...(data || [])].sort((a, b) => {
    if (b.tahun !== a.tahun) return b.tahun - a.tahun;
    const monthDiff = MONTH_ORDER.indexOf(a.bulan) - MONTH_ORDER.indexOf(b.bulan);
    if (monthDiff !== 0) return monthDiff;
    return Number(b.id || 0) - Number(a.id || 0);
  });

export async function fetchTourismRows(
  client,
  applyFilters = (query) => query,
  select = "*",
) {
  const rows = [];

  for (let from = 0; ; from += PAGE_SIZE) {
    const to = from + PAGE_SIZE - 1;
    let query = client.from("tourism_data").select(select);
    query = applyFilters(query)
      .order("tahun", { ascending: false })
      .order("id", { ascending: false })
      .range(from, to);

    const { data, error } = await query;
    if (error) return { data: [], error };

    rows.push(...(data || []));
    if (!data || data.length < PAGE_SIZE) break;
  }

  return { data: sortTourismRows(rows), error: null };
}

export async function fetchTourismOptions(client) {
  const { data, error } = await fetchTourismRows(
    client,
    (query) => query,
    "kabupaten_kota,tahun",
  );

  if (error) return { years: [], regions: [], error };

  return {
    years: [...new Set(data.map((item) => item.tahun).filter(Boolean))].sort((a, b) => b - a),
    regions: [...new Set(data.map((item) => item.kabupaten_kota).filter(Boolean))].sort(),
    error: null,
  };
}

export async function getTourismData() {
  if (!supabase) return [];

  const { data, error } = await fetchTourismRows(supabase);

  if (error) {
    console.error("Gagal mengambil tourism_data:", error.message);
    return [];
  }

  return data;
}

export function validateTourismPayload(payload) {
  const errors = {};
  const data = {
    kabupaten_kota: String(payload.kabupaten_kota || "").trim(),
    destinasi_wisata: String(payload.destinasi_wisata || "").trim(),
    tahun: Number(payload.tahun),
    bulan: String(payload.bulan || "").trim(),
    jumlah_kunjungan: Number(payload.jumlah_kunjungan),
    musim_libur: Number(payload.musim_libur),
    libur_nasional: Number(payload.libur_nasional),
  };

  if (!data.kabupaten_kota) errors.kabupaten_kota = "Kabupaten/Kota wajib diisi.";
  if (!data.destinasi_wisata) errors.destinasi_wisata = "Destinasi wisata wajib diisi.";
  if (!Number.isInteger(data.tahun)) errors.tahun = "Tahun wajib berupa angka.";
  if (!data.bulan) errors.bulan = "Bulan wajib diisi.";
  if (!Number.isInteger(data.jumlah_kunjungan) || data.jumlah_kunjungan < 0) {
    errors.jumlah_kunjungan = "Jumlah kunjungan wajib angka dan tidak boleh negatif.";
  }
  if (![0, 1].includes(data.musim_libur)) errors.musim_libur = "Musim libur harus 0 atau 1.";
  if (![0, 1].includes(data.libur_nasional)) errors.libur_nasional = "Libur nasional harus 0 atau 1.";

  return {
    data,
    errors,
    valid: Object.keys(errors).length === 0,
  };
}
