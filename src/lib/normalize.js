const toFiniteNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
};

export function normalizeData(data, fields) {
  if (!Array.isArray(data) || !data.length) return [];

  const ranges = fields.reduce((result, field) => {
    const values = data.map((item) => toFiniteNumber(item[field]));
    result[field] = {
      min: Math.min(...values),
      max: Math.max(...values),
    };
    return result;
  }, {});

  return data.map((item) =>
    fields.map((field) => {
      const { min, max } = ranges[field];
      const value = toFiniteNumber(item[field]);
      return max === min ? 0 : (value - min) / (max - min);
    }),
  );
}
