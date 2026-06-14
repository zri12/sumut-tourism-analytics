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

const toFiniteNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
};

export const getTotalVisits = (data) =>
  data.reduce(
    (total, item) => total + toFiniteNumber(item.jumlah_kunjungan),
    0,
  );

export const getTotalDestinations = (data) =>
  new Set(data.map((item) => item.destinasi_wisata).filter(Boolean)).size;

export const getTotalRegions = (data) =>
  new Set(data.map((item) => item.kabupaten_kota).filter(Boolean)).size;

export const getTotalYears = (data) =>
  new Set(data.map((item) => toFiniteNumber(item.tahun)).filter(Boolean)).size;

export const getMonthlyTrend = (data) =>
  MONTHS.map((bulan) => ({
    bulan: bulan.slice(0, 3),
    bulan_lengkap: bulan,
    jumlah_kunjungan: data
      .filter((item) => item.bulan === bulan)
      .reduce(
        (sum, item) => sum + toFiniteNumber(item.jumlah_kunjungan),
        0,
      ),
  }));

export const getClusterDistribution = (clusteredData) =>
  clusteredData.reduce(
    (distribution, item) => {
      const label = item.cluster_label;
      if (Object.hasOwn(distribution, label)) distribution[label] += 1;
      return distribution;
    },
    { Sepi: 0, Sedang: 0, Ramai: 0 },
  );

// Alias untuk kompatibilitas komponen chart yang sudah ada.
export const getMonthlyVisits = getMonthlyTrend;
