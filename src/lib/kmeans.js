import { normalizeData } from "./normalize";

const CLUSTER_META = {
  Sepi: { color: "blue" },
  Sedang: { color: "amber" },
  Ramai: { color: "green" },
};

const toFiniteNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
};

export function euclideanDistance(pointA, pointB) {
  return Math.sqrt(
    pointA.reduce(
      (sum, value, index) => sum + (value - pointB[index]) ** 2,
      0,
    ),
  );
}

export function initializeCentroids(points, k) {
  if (!points.length || k < 1) return [];

  const sorted = [...points].sort((a, b) => a[0] - b[0]);
  return Array.from({ length: k }, (_, index) => {
    const position =
      k === 1 ? 0 : Math.round((index * (sorted.length - 1)) / (k - 1));
    return [...sorted[position]];
  });
}

export function assignClusters(points, centroids) {
  return points.map((point) => {
    const distances = centroids.map((centroid) =>
      euclideanDistance(point, centroid),
    );
    return distances.indexOf(Math.min(...distances));
  });
}

export function updateCentroids(points, assignments, k, previousCentroids) {
  const dimensions = points[0]?.length || 0;
  const sums = Array.from({ length: k }, () => Array(dimensions).fill(0));
  const counts = Array(k).fill(0);

  points.forEach((point, index) => {
    const cluster = assignments[index];
    counts[cluster] += 1;
    point.forEach((value, featureIndex) => {
      sums[cluster][featureIndex] += value;
    });
  });

  return sums.map((sum, cluster) => {
    if (!counts[cluster]) return previousCentroids[cluster];
    return sum.map((value) => value / counts[cluster]);
  });
}

export function labelClusters(data, assignments, k = 3) {
  const averages = Array.from({ length: k }, (_, cluster) => {
    const visits = data
      .filter((_, index) => assignments[index] === cluster)
      .map((item) => toFiniteNumber(item.jumlah_kunjungan));
    return {
      cluster,
      average: visits.length
        ? visits.reduce((sum, value) => sum + value, 0) / visits.length
        : Number.POSITIVE_INFINITY,
    };
  }).sort((a, b) => a.average - b.average);

  const labels = ["Sepi", "Sedang", "Ramai"];
  return averages.reduce((result, item, index) => {
    result[item.cluster] = labels[index] || `Cluster ${index + 1}`;
    return result;
  }, {});
}

export function kMeans(data, k = 3, maxIterations = 100) {
  if (!Array.isArray(data) || !data.length) {
    return {
      results: [],
      centroids: [],
      assignments: [],
      labels: {},
      iterations: 0,
    };
  }

  const cleanData = data.map((item) => ({
    ...item,
    jumlah_kunjungan: toFiniteNumber(item.jumlah_kunjungan),
    musim_libur: toFiniteNumber(item.musim_libur),
    libur_nasional: toFiniteNumber(item.libur_nasional),
  }));
  const fields = ["jumlah_kunjungan", "musim_libur", "libur_nasional"];
  const points = normalizeData(cleanData, fields);
  let centroids = initializeCentroids(points, k);
  let assignments = [];
  let iterations = 0;

  while (iterations < maxIterations) {
    const nextAssignments = assignClusters(points, centroids);
    const nextCentroids = updateCentroids(
      points,
      nextAssignments,
      k,
      centroids,
    );
    const stable =
      assignments.length > 0 &&
      nextAssignments.every(
        (cluster, index) => cluster === assignments[index],
      );

    assignments = nextAssignments;
    centroids = nextCentroids;
    iterations += 1;
    if (stable) break;
  }

  const labels = labelClusters(cleanData, assignments, k);
  const results = cleanData.map((item, index) => {
    const cluster = assignments[index];
    const clusterLabel = labels[cluster];
    return {
      ...item,
      cluster,
      cluster_label: clusterLabel,
      cluster_color: CLUSTER_META[clusterLabel]?.color || "gray",
    };
  });

  return { results, centroids, assignments, labels, iterations };
}
