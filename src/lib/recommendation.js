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

const toNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
};

const average = (values) =>
  values.length ? values.reduce((total, value) => total + value, 0) / values.length : 0;

const clampScore = (value) => Math.max(0, Math.min(100, Math.round(value)));

const getSuitabilityLabel = (score) => {
  if (score >= 70) return "Sangat cocok";
  if (score >= 45) return "Cocok";
  return "Cukup cocok";
};

const getDestinationStats = (data) =>
  Object.values(
    data.reduce((result, item) => {
      const name = String(item.destinasi_wisata || "").trim();
      if (!name) return result;
      result[name] ??= { name, visits: [], holidayVisits: [], regularVisits: [] };
      const visits = toNumber(item.jumlah_kunjungan);
      const isHoliday = toNumber(item.musim_libur) > 0 || toNumber(item.libur_nasional) > 0;
      result[name].visits.push(visits);
      result[name][isHoliday ? "holidayVisits" : "regularVisits"].push(visits);
      return result;
    }, {}),
  ).map((item) => {
    const regularAverage = average(item.regularVisits);
    return {
      ...item,
      average: average(item.visits),
      holidayLift: regularAverage ? average(item.holidayVisits) / regularAverage : 1,
    };
  });

export function getDestinationRecommendation(data, destination) {
  const destinationStats = getDestinationStats(data);
  const selectedStats = destinationStats.find((item) => item.name === destination);
  const rows = data.filter((item) => item.destinasi_wisata === destination);

  if (!selectedStats || !rows.length) return null;

  const monthly = MONTHS.map((bulan) => {
    const monthRows = rows.filter((item) => item.bulan === bulan);
    return {
      bulan,
      bulan_pendek: bulan.slice(0, 3),
      jumlah_kunjungan: Math.round(average(monthRows.map((item) => toNumber(item.jumlah_kunjungan)))),
      musim_libur: average(monthRows.map((item) => toNumber(item.musim_libur))),
      libur_nasional: average(monthRows.map((item) => toNumber(item.libur_nasional))),
    };
  }).filter((item) => item.jumlah_kunjungan > 0);

  const rankedByCrowd = [...monthly].sort((a, b) => a.jumlah_kunjungan - b.jumlah_kunjungan);
  const crowdRank = new Map(rankedByCrowd.map((item, index) => [item.bulan, index]));
  const maxRank = Math.max(rankedByCrowd.length - 1, 1);
  const enrichedMonths = monthly.map((item) => ({
    ...item,
    crowdScore: (crowdRank.get(item.bulan) || 0) / maxRank,
    holidayScore: Math.min(1, item.musim_libur * 0.65 + item.libur_nasional / 4),
  }));

  const idealMonths = [...enrichedMonths]
    .sort((a, b) => a.crowdScore - b.crowdScore || a.holidayScore - b.holidayScore)
    .slice(0, 3);
  const soloMonths = [...enrichedMonths]
    .sort((a, b) => (a.crowdScore + a.holidayScore * 0.35) - (b.crowdScore + b.holidayScore * 0.35))
    .slice(0, 3);
  const familyMonths = [...enrichedMonths]
    .sort((a, b) => {
      const scoreA = a.holidayScore * 0.65 + (1 - Math.abs(a.crowdScore - 0.45)) * 0.35;
      const scoreB = b.holidayScore * 0.65 + (1 - Math.abs(b.crowdScore - 0.45)) * 0.35;
      return scoreB - scoreA;
    })
    .slice(0, 3);
  const friendsMonths = [...enrichedMonths]
    .sort((a, b) => (b.crowdScore + b.holidayScore * 0.25) - (a.crowdScore + a.holidayScore * 0.25))
    .slice(0, 3);

  const activityOrder = [...destinationStats].sort((a, b) => a.average - b.average);
  const activityIndex = activityOrder.findIndex((item) => item.name === destination);
  const activityPercentile = activityOrder.length > 1 ? activityIndex / (activityOrder.length - 1) : 0.5;
  const lifts = destinationStats.map((item) => item.holidayLift);
  const minLift = Math.min(...lifts);
  const maxLift = Math.max(...lifts);
  const holidayStrength = maxLift > minLift
    ? (selectedStats.holidayLift - minLift) / (maxLift - minLift)
    : 0.5;

  const profiles = [
    {
      type: "family",
      title: "Keluarga",
      score: clampScore((holidayStrength * 0.55 + (1 - Math.abs(activityPercentile - 0.55)) * 0.45) * 100),
      months: familyMonths,
      reason: "Mengutamakan musim libur dengan tingkat keramaian yang masih seimbang.",
    },
    {
      type: "solo",
      title: "Solo traveling",
      score: clampScore((1 - activityPercentile * 0.75) * 100),
      months: soloMonths,
      reason: "Mengutamakan bulan yang lebih tenang dan minim tekanan musim libur.",
    },
    {
      type: "friends",
      title: "Bersama teman",
      score: clampScore((0.3 + activityPercentile * 0.7) * 100),
      months: friendsMonths,
      reason: "Mengutamakan periode yang lebih hidup dan bertepatan dengan waktu libur.",
    },
  ].map((profile) => ({ ...profile, label: getSuitabilityLabel(profile.score) }));

  const bestProfile = [...profiles].sort((a, b) => b.score - a.score)[0];
  const regions = [...new Set(rows.map((item) => item.kabupaten_kota).filter(Boolean))];

  return {
    destination,
    region: regions.join(", "),
    idealMonths,
    profiles,
    bestProfile,
    monthly: enrichedMonths,
    averageVisits: Math.round(selectedStats.average),
  };
}

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
