import { useState } from "react";
import { t, cluster } from "./theme";
import type { ClusterName } from "./theme";

const FONT = t.font;

function lscale(v: number, d0: number, d1: number, r0: number, r1: number) {
  return r0 + ((v - d0) / (d1 - d0)) * (r1 - r0);
}

function niceTicks(max: number, count = 4): number[] {
  if (max <= 0) return [0];
  const roughStep = max / count;
  const mag = Math.pow(10, Math.floor(Math.log10(roughStep)));
  const norm = roughStep / mag;
  const step = norm < 1.5 ? mag : norm < 3.5 ? 2 * mag : norm < 7.5 ? 5 * mag : 10 * mag;
  const ticks: number[] = [];
  for (let v = 0; v <= max * 1.05 + step * 0.01; v += step) {
    ticks.push(Math.round(v * 1e8) / 1e8);
    if (ticks.length > count + 2) break;
  }
  return ticks;
}

// ── TrendAreaChart ─────────────────────────────────────────────────
// Two-series area chart: 2024 (solid) and 2023 (dashed).
export function TrendAreaChart({
  data,
  height = 240,
}: {
  data: { month: string; visitors: number; prev: number }[];
  height?: number;
}) {
  const W = 700, H = height;
  const pl = 46, pr = 12, pt = 8, pb = 28;
  const pw = W - pl - pr, ph = H - pt - pb;

  const yMax = Math.max(...data.flatMap((d) => [d.visitors, d.prev]));
  const yTicks = niceTicks(yMax, 4);

  const px = (i: number) => pl + (i / (data.length - 1)) * pw;
  const py = (v: number) => pt + ph - (v / (yMax * 1.05)) * ph;

  const lineD = (key: "visitors" | "prev") =>
    data.map((d, i) => `${i === 0 ? "M" : "L"}${px(i).toFixed(1)},${py(d[key]).toFixed(1)}`).join(" ");
  const areaD = (key: "visitors" | "prev") =>
    `${lineD(key)} L${px(data.length - 1).toFixed(1)},${(pt + ph).toFixed(1)} L${pl},${(pt + ph).toFixed(1)}Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} preserveAspectRatio="none">
      <defs>
        <linearGradient id="ta-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={t.primary} stopOpacity={0.14} />
          <stop offset="100%" stopColor={t.primary} stopOpacity={0} />
        </linearGradient>
      </defs>
      {yTicks.map((v) => (
        <line key={`g${v}`} x1={pl} x2={pl + pw} y1={py(v)} y2={py(v)} stroke={t.borderSoft} strokeWidth={0.8} />
      ))}
      <path d={areaD("prev")} fill="#D1D5DB" fillOpacity={0.15} />
      <path d={areaD("visitors")} fill="url(#ta-g)" />
      <path d={lineD("prev")} fill="none" stroke="#D1D5DB" strokeWidth={1.5} strokeDasharray="4 4" />
      <path d={lineD("visitors")} fill="none" stroke={t.primary} strokeWidth={2.5} />
      {data.map((d, i) => (
        <text key={`xt${i}`} x={px(i)} y={H - 6} textAnchor="middle" fontSize={10} fill={t.textMuted} fontFamily={FONT}>
          {d.month}
        </text>
      ))}
      {yTicks.filter((v) => v > 0).map((v) => (
        <text key={`yt${v}`} x={pl - 5} y={py(v) + 3} textAnchor="end" fontSize={10} fill={t.textMuted} fontFamily={FONT}>
          {(v / 1000).toFixed(0)}k
        </text>
      ))}
    </svg>
  );
}

// ── ScoreAreaChart ─────────────────────────────────────────────────
// Single-series 0–100 score area chart for Recommendations.
export function ScoreAreaChart({
  data,
  height = 260,
}: {
  data: { month: string; score: number }[];
  height?: number;
}) {
  const W = 680, H = height;
  const pl = 36, pr = 12, pt = 18, pb = 28;
  const pw = W - pl - pr, ph = H - pt - pb;
  const yMax = 100;
  const yTicks = [0, 25, 50, 75, 100];

  const px = (i: number) => pl + (i / (data.length - 1)) * pw;
  const py = (v: number) => pt + ph - (v / yMax) * ph;

  const lineD = data.map((d, i) => `${i === 0 ? "M" : "L"}${px(i).toFixed(1)},${py(d.score).toFixed(1)}`).join(" ");
  const areaD = `${lineD} L${px(data.length - 1).toFixed(1)},${(pt + ph).toFixed(1)} L${pl},${(pt + ph).toFixed(1)}Z`;

  const [tip, setTip] = useState<{ x: number; y: number; label: string; val: number } | null>(null);

  return (
    <div style={{ position: "relative" }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        height={H}
        preserveAspectRatio="none"
        onMouseLeave={() => setTip(null)}
      >
        <defs>
          <linearGradient id="sc-g" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={t.primary} stopOpacity={0.14} />
            <stop offset="100%" stopColor={t.primary} stopOpacity={0} />
          </linearGradient>
        </defs>
        {yTicks.map((v) => (
          <line key={`g${v}`} x1={pl} x2={pl + pw} y1={py(v)} y2={py(v)} stroke={t.borderSoft} strokeWidth={0.8} />
        ))}
        <path d={areaD} fill="url(#sc-g)" />
        <path d={lineD} fill="none" stroke={t.primary} strokeWidth={2.5} />
        {data.map((d, i) => (
          <g key={`pt${i}`}>
            <circle
              cx={px(i)}
              cy={py(d.score)}
              r={12}
              fill="transparent"
              onMouseEnter={() => setTip({ x: px(i) / W, y: py(d.score) / H, label: d.month, val: d.score })}
            />
            <circle cx={px(i)} cy={py(d.score)} r={3} fill={t.primary} />
          </g>
        ))}
        {data.map((d, i) => (
          <text key={`xt${i}`} x={px(i)} y={H - 6} textAnchor="middle" fontSize={10} fill={t.textMuted} fontFamily={FONT}>
            {d.month}
          </text>
        ))}
        {yTicks.filter((v) => v > 0).map((v) => (
          <text key={`yt${v}`} x={pl - 5} y={py(v) + 3} textAnchor="end" fontSize={10} fill={t.textMuted} fontFamily={FONT}>
            {v}
          </text>
        ))}
      </svg>
      {tip && (
        <div
          style={{
            position: "absolute",
            left: `calc(${tip.x * 100}% + 8px)`,
            top: `calc(${tip.y * 100}% - 32px)`,
            pointerEvents: "none",
            background: t.surface,
            border: `1px solid ${t.border}`,
            borderRadius: 8,
            padding: "6px 10px",
            boxShadow: t.shadow,
            fontFamily: FONT,
            whiteSpace: "nowrap",
            zIndex: 10,
          }}
        >
          <p style={{ fontSize: 11, color: t.textMuted }}>{tip.label}</p>
          <p style={{ fontSize: 13, fontWeight: 700, color: t.primary }}>Score: {tip.val}/100</p>
        </div>
      )}
    </div>
  );
}

// ── ConvergenceLineChart ───────────────────────────────────────────
// Single line chart for K-Means convergence curve.
export function ConvergenceLineChart({
  data,
  height = 240,
}: {
  data: { iter: string; inertia: number }[];
  height?: number;
}) {
  const W = 560, H = height;
  const pl = 48, pr = 16, pt = 16, pb = 28;
  const pw = W - pl - pr, ph = H - pt - pb;

  const yMax = Math.max(...data.map((d) => d.inertia));
  const yTicks = niceTicks(yMax, 4);

  const px = (i: number) => pl + (i / (data.length - 1)) * pw;
  const py = (v: number) => pt + ph - (v / (yMax * 1.05)) * ph;

  const lineD = data.map((d, i) => `${i === 0 ? "M" : "L"}${px(i).toFixed(1)},${py(d.inertia).toFixed(1)}`).join(" ");

  const [tip, setTip] = useState<{ idx: number } | null>(null);

  return (
    <div style={{ position: "relative" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} preserveAspectRatio="none" onMouseLeave={() => setTip(null)}>
        {yTicks.map((v) => (
          <line key={`g${v}`} x1={pl} x2={pl + pw} y1={py(v)} y2={py(v)} stroke={t.borderSoft} strokeWidth={0.8} />
        ))}
        <path d={lineD} fill="none" stroke={t.primary} strokeWidth={2.5} />
        {data.map((d, i) => (
          <g key={`dot${i}`}>
            <circle
              cx={px(i)}
              cy={py(d.inertia)}
              r={12}
              fill="transparent"
              style={{ cursor: "crosshair" }}
              onMouseEnter={() => setTip({ idx: i })}
            />
            <circle cx={px(i)} cy={py(d.inertia)} r={3.5} fill={t.primary} />
          </g>
        ))}
        {data.map((d, i) => (
          <text key={`xt${i}`} x={px(i)} y={H - 6} textAnchor="middle" fontSize={10} fill={t.textMuted} fontFamily={FONT}>
            {d.iter}
          </text>
        ))}
        {yTicks.filter((v) => v > 0).map((v) => (
          <text key={`yt${v}`} x={pl - 5} y={py(v) + 3} textAnchor="end" fontSize={10} fill={t.textMuted} fontFamily={FONT}>
            {(v / 1000000).toFixed(1)}M
          </text>
        ))}
      </svg>
      {tip !== null && (
        <div
          style={{
            position: "absolute",
            left: `calc(${(px(tip.idx) / W) * 100}% + 10px)`,
            top: `calc(${(py(data[tip.idx].inertia) / H) * 100}% - 32px)`,
            pointerEvents: "none",
            background: t.surface,
            border: `1px solid ${t.border}`,
            borderRadius: 8,
            padding: "6px 10px",
            boxShadow: t.shadow,
            fontFamily: FONT,
            whiteSpace: "nowrap",
            zIndex: 10,
          }}
        >
          <p style={{ fontSize: 11, color: t.textMuted }}>Iteration {data[tip.idx].iter}</p>
          <p style={{ fontSize: 13, fontWeight: 700, color: t.text }}>
            {(data[tip.idx].inertia / 1000).toFixed(0)}k inertia
          </p>
        </div>
      )}
    </div>
  );
}

// ── ScatterPlot ────────────────────────────────────────────────────
type ScatterGroup = { name: ClusterName; data: { x: number; y: number; name: string }[] };
type Centroid = { x: number; y: number; c: ClusterName };

export function ScatterPlot({
  groups,
  centroids: cents,
  height = 360,
}: {
  groups: ScatterGroup[];
  centroids: Centroid[];
  height?: number;
}) {
  const W = 700, H = height;
  const pl = 52, pr = 20, pt = 16, pb = 48;
  const pw = W - pl - pr, ph = H - pt - pb;

  const xMin = 0, xMax = 9;
  const yMin = 0, yMax = 80000;
  const xTicks = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const yTicks = [0, 20000, 40000, 60000, 80000];

  const px = (v: number) => lscale(v, xMin, xMax, pl, pl + pw);
  const py = (v: number) => lscale(v, yMin, yMax, pt + ph, pt);

  const [tip, setTip] = useState<{ x: number; y: number; name: string; cluster: ClusterName; visitors: number } | null>(null);

  return (
    <div style={{ position: "relative" }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        height={H}
        preserveAspectRatio="none"
        onMouseLeave={() => setTip(null)}
      >
        {/* Grid */}
        {yTicks.map((v) => (
          <line key={`gy${v}`} x1={pl} x2={pl + pw} y1={py(v)} y2={py(v)} stroke={t.borderSoft} strokeWidth={0.8} />
        ))}
        {xTicks.map((v) => (
          <line key={`gx${v}`} x1={px(v)} x2={px(v)} y1={pt} y2={pt + ph} stroke={t.borderSoft} strokeWidth={0.8} />
        ))}
        {/* Data points */}
        {groups.map((g) =>
          g.data.map((d, i) => (
            <circle
              key={`${g.name}-${i}`}
              cx={px(d.x)}
              cy={py(d.y)}
              r={7}
              fill={cluster[g.name].dot}
              fillOpacity={0.85}
              style={{ cursor: "crosshair" }}
              onMouseEnter={() =>
                setTip({ x: px(d.x) / W, y: py(d.y) / H, name: d.name, cluster: g.name, visitors: d.y })
              }
            />
          ))
        )}
        {/* Centroids */}
        {cents.map((c) => (
          <g key={`cent-${c.c}`}>
            <circle cx={px(c.x)} cy={py(c.y)} r={13} fill={cluster[c.c].dot} fillOpacity={0.18} />
            <circle cx={px(c.x)} cy={py(c.y)} r={7} fill={cluster[c.c].dot} stroke="#fff" strokeWidth={2} />
          </g>
        ))}
        {/* X-axis */}
        {xTicks.map((v) => (
          <text key={`xt${v}`} x={px(v)} y={pt + ph + 16} textAnchor="middle" fontSize={10} fill={t.textMuted} fontFamily={FONT}>
            {v}
          </text>
        ))}
        {/* Y-axis */}
        {yTicks.filter((v) => v > 0).map((v) => (
          <text key={`yt${v}`} x={pl - 6} y={py(v) + 3} textAnchor="end" fontSize={10} fill={t.textMuted} fontFamily={FONT}>
            {(v / 1000).toFixed(0)}k
          </text>
        ))}
        {/* Axis labels */}
        <text x={pl + pw / 2} y={H - 4} textAnchor="middle" fontSize={10} fill={t.textMuted} fontFamily={FONT}>
          Peak Month Intensity Score
        </text>
        <text
          x={11}
          y={pt + ph / 2}
          textAnchor="middle"
          fontSize={10}
          fill={t.textMuted}
          fontFamily={FONT}
          transform={`rotate(-90, 11, ${pt + ph / 2})`}
        >
          Annual Visitors
        </text>
      </svg>
      {tip && (
        <div
          style={{
            position: "absolute",
            left: `calc(${tip.x * 100}% + 10px)`,
            top: `calc(${tip.y * 100}% - 36px)`,
            pointerEvents: "none",
            background: t.surface,
            border: `1px solid ${t.border}`,
            borderRadius: 8,
            padding: "8px 12px",
            boxShadow: t.shadow,
            fontFamily: FONT,
            whiteSpace: "nowrap",
            zIndex: 10,
          }}
        >
          <p style={{ fontSize: 12, fontWeight: 600, color: t.text }}>{tip.name}</p>
          <p style={{ fontSize: 11, color: cluster[tip.cluster].text }}>Cluster {tip.cluster}</p>
          <p style={{ fontSize: 11, color: t.textSecondary }}>{tip.visitors.toLocaleString()} visitors</p>
        </div>
      )}
    </div>
  );
}

// ── DonutChart ─────────────────────────────────────────────────────
function donutSlice(
  cx: number,
  cy: number,
  r1: number,
  r2: number,
  a1: number,
  a2: number
): string {
  const cos = Math.cos, sin = Math.sin;
  const x1 = cx + r2 * cos(a1), y1 = cy + r2 * sin(a1);
  const x2 = cx + r2 * cos(a2), y2 = cy + r2 * sin(a2);
  const x3 = cx + r1 * cos(a2), y3 = cy + r1 * sin(a2);
  const x4 = cx + r1 * cos(a1), y4 = cy + r1 * sin(a1);
  const large = a2 - a1 > Math.PI ? 1 : 0;
  return [
    `M${x1.toFixed(2)},${y1.toFixed(2)}`,
    `A${r2},${r2} 0 ${large} 1 ${x2.toFixed(2)},${y2.toFixed(2)}`,
    `L${x3.toFixed(2)},${y3.toFixed(2)}`,
    `A${r1},${r1} 0 ${large} 0 ${x4.toFixed(2)},${y4.toFixed(2)}Z`,
  ].join(" ");
}

export function DonutChart({
  data,
  height = 180,
}: {
  data: { name: ClusterName; value: number }[];
  height?: number;
}) {
  const W = 240, H = height;
  const cx = W / 2, cy = H / 2;
  const r1 = 42, r2 = 70;
  const total = data.reduce((s, d) => s + d.value, 0);
  const GAP = 0.025;

  let angle = -Math.PI / 2;
  const slices = data.map((d) => {
    const sweep = (d.value / total) * 2 * Math.PI;
    const a1 = angle + GAP / 2;
    const a2 = angle + sweep - GAP / 2;
    angle += sweep;
    return { ...d, a1, a2 };
  });

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H}>
      {slices.map((s) => (
        <path key={s.name} d={donutSlice(cx, cy, r1, r2, s.a1, s.a2)} fill={cluster[s.name].dot}>
          <title>
            {s.name}: {s.value} ({Math.round((s.value / total) * 100)}%)
          </title>
        </path>
      ))}
      <text x={cx} y={cy - 4} textAnchor="middle" fontSize={18} fontWeight={700} fill={t.text} fontFamily={FONT}>
        {total}
      </text>
      <text x={cx} y={cy + 14} textAnchor="middle" fontSize={10} fill={t.textMuted} fontFamily={FONT}>
        destinasi
      </text>
    </svg>
  );
}

// ── DestBarChart ───────────────────────────────────────────────────
export function DestBarChart({
  data,
  height = 280,
}: {
  data: { name: string; visitors: number; cluster: ClusterName }[];
  height?: number;
}) {
  const W = 600, H = height;
  const pl = 44, pr = 12, pt = 16, pb = 72;
  const pw = W - pl - pr, ph = H - pt - pb;

  const yMax = Math.max(...data.map((d) => d.visitors));
  const yTicks = niceTicks(yMax, 4);

  const slotW = pw / data.length;
  const barW = slotW * 0.72;
  const barOff = (slotW - barW) / 2;

  const bx = (i: number) => pl + i * slotW + barOff;
  const by = (v: number) => pt + ph - (v / (yMax * 1.05)) * ph;
  const bh = (v: number) => (v / (yMax * 1.05)) * ph;

  const [hov, setHov] = useState<number | null>(null);

  return (
    <div style={{ position: "relative" }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        height={H}
        preserveAspectRatio="none"
        onMouseLeave={() => setHov(null)}
      >
        {yTicks.map((v) => (
          <line key={`g${v}`} x1={pl} x2={pl + pw} y1={by(v)} y2={by(v)} stroke={t.borderSoft} strokeWidth={0.8} />
        ))}
        {data.map((d, i) => (
          <rect
            key={`b${i}`}
            x={bx(i)}
            y={by(d.visitors)}
            width={barW}
            height={bh(d.visitors)}
            rx={4}
            fill={cluster[d.cluster].dot}
            fillOpacity={hov === i ? 1 : 0.85}
            style={{ cursor: "crosshair" }}
            onMouseEnter={() => setHov(i)}
          />
        ))}
        {data.map((d, i) => {
          const lx = bx(i) + barW / 2;
          const ly = H - pb + 14;
          return (
            <text
              key={`xl${i}`}
              x={lx}
              y={ly}
              textAnchor="end"
              fontSize={9.5}
              fill={t.textMuted}
              fontFamily={FONT}
              transform={`rotate(-28,${lx},${ly})`}
            >
              {d.name.length > 14 ? d.name.slice(0, 14) + "…" : d.name}
            </text>
          );
        })}
        {yTicks.filter((v) => v > 0).map((v) => (
          <text key={`yt${v}`} x={pl - 5} y={by(v) + 3} textAnchor="end" fontSize={10} fill={t.textMuted} fontFamily={FONT}>
            {(v / 1000).toFixed(0)}k
          </text>
        ))}
      </svg>
      {hov !== null && (
        <div
          style={{
            position: "absolute",
            left: `calc(${((bx(hov) + barW / 2) / W) * 100}% + 6px)`,
            top: `calc(${(by(data[hov].visitors) / H) * 100}% - 40px)`,
            pointerEvents: "none",
            background: t.surface,
            border: `1px solid ${t.border}`,
            borderRadius: 8,
            padding: "6px 10px",
            boxShadow: t.shadow,
            fontFamily: FONT,
            whiteSpace: "nowrap",
            zIndex: 10,
          }}
        >
          <p style={{ fontSize: 11, color: t.textMuted }}>Annual</p>
          <p style={{ fontSize: 13, fontWeight: 700, color: t.text }}>
            {data[hov].visitors.toLocaleString()} visitors
          </p>
        </div>
      )}
    </div>
  );
}
