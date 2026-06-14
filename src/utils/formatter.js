export const formatNumber = (value) =>
  new Intl.NumberFormat("id-ID").format(value || 0);

export const formatCompactNumber = (value) =>
  new Intl.NumberFormat("id-ID", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value || 0);

export const formatBoolean = (value) => (Number(value) === 1 ? "Ya" : "Tidak");
