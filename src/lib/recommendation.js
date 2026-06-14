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

const summarizeMonths = (clusteredData) =>
  MONTHS.map((bulan) => {
    const rows = clusteredData.filter((item) => item.bulan === bulan);
    const total = rows.reduce(
      (sum, item) => sum + (Number(item.jumlah_kunjungan) || 0),
      0,
    );
    const distribution = rows.reduce(
      (result, item) => {
        if (Object.hasOwn(result, item.cluster_label)) {
          result[item.cluster_label] += 1;
        }
        return result;
      },
      { Sepi: 0, Sedang: 0, Ramai: 0 },
    );
    const dominantCluster = Object.entries(distribution).sort(
      (a, b) => b[1] - a[1],
    )[0]?.[0] || "Sepi";

    return {
      bulan,
      total,
      count: rows.length,
      average: rows.length ? total / rows.length : 0,
      cluster_label: dominantCluster,
      distribution,
    };
  });

export function getBestVisitMonths(clusteredData, limit = 4) {
  return summarizeMonths(clusteredData)
    .map((item) => ({
      ...item,
      recommended_ratio:
        item.count > 0
          ? (item.distribution.Sepi + item.distribution.Sedang) / item.count
          : 0,
    }))
    .sort(
      (a, b) =>
        b.recommended_ratio - a.recommended_ratio || a.average - b.average,
    )
    .slice(0, limit);
}

export function getPeakMonths(clusteredData, limit = 4) {
  return summarizeMonths(clusteredData)
    .map((item) => ({
      ...item,
      peak_ratio:
        item.count > 0 ? item.distribution.Ramai / item.count : 0,
    }))
    .sort((a, b) => b.peak_ratio - a.peak_ratio || b.average - a.average)
    .slice(0, limit);
}

export function getModerateMonths(clusteredData, limit = 4) {
  return summarizeMonths(clusteredData)
    .map((item) => ({
      ...item,
      moderate_ratio:
        item.count > 0 ? item.distribution.Sedang / item.count : 0,
    }))
    .sort(
      (a, b) =>
        b.moderate_ratio - a.moderate_ratio || a.average - b.average,
    )
    .slice(0, limit);
}

export function generateRecommendationSummary(clusteredData) {
  const best = getBestVisitMonths(clusteredData, 3);
  const peak = getPeakMonths(clusteredData, 3);
  const bestText = best.length
    ? best.map((item) => item.bulan).join(", ")
    : "periode berkategori sepi hingga sedang";
  const peakText = peak.length
    ? peak.map((item) => item.bulan).join(", ")
    : "periode dengan cluster ramai";

  return `Berdasarkan hasil K-Means, ${bestText} direkomendasikan sebagai waktu berkunjung karena memiliki pola kunjungan relatif rendah hingga sedang. Sementara itu, ${peakText} teridentifikasi sebagai periode ramai sehingga wisatawan disarankan melakukan perencanaan dan reservasi lebih awal.`;
}
