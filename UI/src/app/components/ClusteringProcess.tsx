import { useState } from "react";
import { Check, Play, RotateCcw } from "lucide-react";
import { t, cluster, type ClusterName } from "./theme";
import { ScatterPlot, ConvergenceLineChart } from "./charts";

const scatterData = [
  { x: 8.1, y: 72400, c: "Ramai", name: "Danau Toba" },
  { x: 7.2, y: 61200, c: "Ramai", name: "Bukit Lawang" },
  { x: 6.8, y: 58800, c: "Ramai", name: "Berastagi" },
  { x: 6.1, y: 52000, c: "Ramai", name: "Prapat" },
  { x: 5.9, y: 47200, c: "Ramai", name: "Sipiso-piso (Upper)" },
  { x: 5.4, y: 42300, c: "Sedang", name: "Istana Maimun" },
  { x: 4.9, y: 37400, c: "Sedang", name: "Masjid Al-Mashun" },
  { x: 4.6, y: 35100, c: "Sedang", name: "Sipisopiso" },
  { x: 4.2, y: 33000, c: "Sedang", name: "Pantai Cermin" },
  { x: 3.8, y: 31400, c: "Sedang", name: "Air Terjun" },
  { x: 3.4, y: 28600, c: "Sedang", name: "Taman Simalem" },
  { x: 3.1, y: 24700, c: "Sepi", name: "Vihara Gunung Timur" },
  { x: 2.8, y: 22200, c: "Sepi", name: "Pulau Nias" },
  { x: 2.4, y: 21800, c: "Sepi", name: "Museum Sumut" },
  { x: 2.1, y: 18900, c: "Sepi", name: "Pantai Sialang" },
  { x: 1.8, y: 15400, c: "Sepi", name: "Bukit Gundaling" },
  { x: 1.4, y: 12300, c: "Sepi", name: "Sungai Wampu" },
] as const;

const centroids = [
  { x: 6.8, y: 58300, c: "Ramai" as ClusterName },
  { x: 4.4, y: 34600, c: "Sedang" as ClusterName },
  { x: 2.2, y: 19200, c: "Sepi" as ClusterName },
];

const iterationData = [
  { iter: "0", inertia: 2840000 },
  { iter: "1", inertia: 1920000 },
  { iter: "2", inertia: 1340000 },
  { iter: "3", inertia: 980000 },
  { iter: "4", inertia: 820000 },
  { iter: "5", inertia: 760000 },
  { iter: "6", inertia: 742000 },
  { iter: "7", inertia: 737800 },
];

const steps = [
  { id: 0, label: "Dataset", desc: "540 records dimuat" },
  { id: 1, label: "Preprocessing", desc: "Normalisasi Min-Max" },
  { id: 2, label: "Clustering", desc: "K-Means, K = 3" },
  { id: 3, label: "Results", desc: "Cluster terbentuk" },
];

const clusterSummary: { name: ClusterName; count: number; pct: number; centroid: string; range: string }[] = [
  { name: "Sepi", count: 23, pct: 51, centroid: "12,450", range: "0 – 25,000" },
  { name: "Sedang", count: 14, pct: 31, centroid: "38,200", range: "25,001 – 55,000" },
  { name: "Ramai", count: 8, pct: 18, centroid: "61,500", range: "55,001 +" },
];

const sectionTitle: React.CSSProperties = { fontSize: 15, fontWeight: 600, color: t.text };
const sectionSub: React.CSSProperties = { fontSize: 12, color: t.textMuted, marginTop: 2 };
const cardBase: React.CSSProperties = {
  background: t.surface,
  border: `1px solid ${t.border}`,
  borderRadius: t.radius,
  boxShadow: t.shadowSm,
};

export function Clustering() {
  const [active, setActive] = useState(2);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Step indicator */}
      <div style={{ ...cardBase, padding: "20px 24px" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          {steps.map((s, i) => {
            const done = i < active;
            const current = i === active;
            return (
              <div key={s.id} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : "0 0 auto" }}>
                <button
                  onClick={() => setActive(i)}
                  style={{ display: "flex", alignItems: "center", gap: 12, background: "transparent", border: "none", cursor: "pointer", padding: 0 }}
                >
                  <span
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      background: done ? t.primary : current ? t.primarySoft : t.surfaceMuted,
                      border: `1.5px solid ${done || current ? t.primary : t.border}`,
                      color: done ? "#fff" : current ? t.primary : t.textMuted,
                      fontSize: 13,
                      fontWeight: 600,
                      transition: "all 120ms ease",
                    }}
                  >
                    {done ? <Check size={16} /> : i + 1}
                  </span>
                  <span style={{ textAlign: "left" }}>
                    <span style={{ display: "block", fontSize: 13, fontWeight: 600, color: done || current ? t.text : t.textMuted }}>
                      {s.label}
                    </span>
                    <span style={{ display: "block", fontSize: 11, color: t.textMuted }}>{s.desc}</span>
                  </span>
                </button>
                {i < steps.length - 1 && (
                  <div style={{ flex: 1, height: 1.5, margin: "0 16px", background: i < active ? t.primary : t.border, borderRadius: 999 }} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Stat strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {[
          { label: "Observations", value: "45", sub: "destinasi" },
          { label: "Clusters (K)", value: "3", sub: "Sepi · Sedang · Ramai" },
          { label: "Iterations", value: "7", sub: "hingga konvergen" },
          { label: "Final Inertia", value: "737.8k", sub: "within-cluster SS" },
        ].map((s, i) => (
          <div key={i} style={{ ...cardBase, padding: 18 }}>
            <p style={{ fontSize: 11, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</p>
            <p style={{ fontSize: 26, fontWeight: 700, color: t.text, letterSpacing: "-0.02em", marginTop: 4 }}>{s.value}</p>
            <p style={{ fontSize: 12, color: t.textSecondary, marginTop: 2 }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Main workspace — scatter centered */}
      <div style={{ ...cardBase, padding: 24 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <h3 style={sectionTitle}>Cluster Visualization</h3>
            <p style={sectionSub}>Skor bulan puncak vs total kunjungan tahunan — titik besar adalah centroid</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {(["Sepi", "Sedang", "Ramai"] as ClusterName[]).map((name) => (
              <span key={name} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: t.textSecondary }}>
                <span style={{ width: 9, height: 9, borderRadius: "50%", background: cluster[name].dot }} />
                {name}
              </span>
            ))}
            <button
              style={{
                marginLeft: 8,
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                height: 34,
                padding: "0 14px",
                borderRadius: 10,
                background: t.primary,
                border: "none",
                color: "#fff",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: t.font,
              }}
            >
              <Play size={13} /> Re-run
            </button>
            <button
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: t.surface,
                border: `1px solid ${t.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <RotateCcw size={14} color={t.textSecondary} />
            </button>
          </div>
        </div>

        <ScatterPlot
          groups={(["Sepi", "Sedang", "Ramai"] as ClusterName[]).map((name) => ({
            name,
            data: scatterData.filter((d) => d.c === name).map((d) => ({ x: d.x, y: d.y, name: d.name })),
          }))}
          centroids={centroids}
          height={360}
        />
      </div>

      {/* Cluster summary + convergence */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ ...cardBase, padding: 24 }}>
          <h3 style={sectionTitle}>Cluster Summary</h3>
          <p style={sectionSub}>Karakteristik tiap kelompok hasil clustering</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 18 }}>
            {clusterSummary.map((c, i) => {
              const col = cluster[c.name];
              return (
                <div key={c.name} style={{ border: `1px solid ${t.border}`, borderRadius: 12, padding: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, fontWeight: 600, color: t.text }}>
                      <span style={{ width: 10, height: 10, borderRadius: 3, background: col.dot }} />
                      Cluster {i} — {c.name}
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: col.text }}>{c.count} dest.</span>
                  </div>
                  <div style={{ display: "flex", gap: 24, marginBottom: 12 }}>
                    <div>
                      <p style={{ fontSize: 11, color: t.textMuted }}>Centroid</p>
                      <p style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{c.centroid}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: 11, color: t.textMuted }}>Visitor Range</p>
                      <p style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{c.range}</p>
                    </div>
                  </div>
                  <div style={{ height: 6, borderRadius: 999, background: t.borderSoft, overflow: "hidden" }}>
                    <div style={{ width: `${c.pct}%`, height: "100%", background: col.dot, borderRadius: 999 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ ...cardBase, padding: 24, display: "flex", flexDirection: "column" }}>
          <h3 style={sectionTitle}>Convergence Curve</h3>
          <p style={sectionSub}>Within-cluster sum of squares per iterasi</p>
          <ConvergenceLineChart data={iterationData} height={240} />
          <div
            style={{
              marginTop: "auto",
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: 12,
              borderRadius: 10,
              background: t.successSoft,
              border: `1px solid #CCFBEF`,
            }}
          >
            <Check size={15} color={t.success} />
            <p style={{ fontSize: 12.5, fontWeight: 600, color: t.success }}>
              Konvergen pada iterasi 7 · Inertia akhir 737,800
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

