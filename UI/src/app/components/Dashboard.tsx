import { TrendAreaChart } from "./charts";
import {
  MapPin,
  Users,
  Map as MapIcon,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
  Calendar,
  Database,
  CircleDot,
} from "lucide-react";
import { t, cluster, type ClusterName } from "./theme";

const monthlyData = [
  { month: "Jan", visitors: 28400, prev: 22100 },
  { month: "Feb", visitors: 31200, prev: 25800 },
  { month: "Mar", visitors: 29800, prev: 24300 },
  { month: "Apr", visitors: 35600, prev: 28900 },
  { month: "May", visitors: 42100, prev: 33700 },
  { month: "Jun", visitors: 58900, prev: 45200 },
  { month: "Jul", visitors: 72400, prev: 58100 },
  { month: "Aug", visitors: 68300, prev: 54600 },
  { month: "Sep", visitors: 45700, prev: 38200 },
  { month: "Oct", visitors: 38900, prev: 31400 },
  { month: "Nov", visitors: 33100, prev: 27600 },
  { month: "Dec", visitors: 51200, prev: 42800 },
];

const clusterDist: { name: ClusterName; value: number }[] = [
  { name: "Ramai", value: 8 },
  { name: "Sedang", value: 14 },
  { name: "Sepi", value: 23 },
];
const totalDest = clusterDist.reduce((s, c) => s + c.value, 0);

const kpis = [
  { label: "Total Destinations", value: "45", delta: "+3", up: true, icon: MapPin },
  { label: "Total Visits", value: "535,800", delta: "+12.4%", up: true, icon: Users },
  { label: "Total Regions", value: "33", delta: "Kab/Kota", up: null, icon: MapIcon },
  { label: "Total Clusters", value: "3", delta: "K = 3", up: null, icon: Layers },
];

const recentAnalysis: { destination: string; city: string; cluster: ClusterName; visitors: number; trend: string }[] = [
  { destination: "Danau Toba", city: "Samosir", cluster: "Ramai", visitors: 83200, trend: "+12.4%" },
  { destination: "Bukit Lawang", city: "Langkat", cluster: "Ramai", visitors: 61200, trend: "+8.7%" },
  { destination: "Berastagi", city: "Karo", cluster: "Ramai", visitors: 58800, trend: "+5.2%" },
  { destination: "Istana Maimun", city: "Medan", cluster: "Sedang", visitors: 42300, trend: "+3.1%" },
  { destination: "Pantai Cermin", city: "Serdang Bedagai", cluster: "Sepi", visitors: 18900, trend: "-2.3%" },
];

const insights = [
  {
    title: "Puncak kunjungan pada kuartal ketiga",
    body: "Periode Juni–Agustus mencatat 41% dari total kunjungan tahunan, didorong oleh musim liburan dan kondisi cuaca kering.",
  },
  {
    title: "Cluster Ramai terkonsentrasi di kawasan danau",
    body: "Delapan destinasi Cluster Ramai didominasi wisata alam sekitar Danau Toba — Samosir, Karo, dan Simalungun.",
  },
  {
    title: "Mayoritas destinasi tergolong Sepi",
    body: "23 dari 45 destinasi (51%) berada pada Cluster Sepi, menandakan peluang pemerataan kunjungan ke destinasi alternatif.",
  },
];


function ClusterBadge({ name }: { name: ClusterName }) {
  const c = cluster[name];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "3px 10px",
        borderRadius: 999,
        background: c.soft,
        border: `1px solid ${c.border}`,
        fontSize: 11,
        fontWeight: 600,
        color: c.text,
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: c.dot }} />
      {name}
    </span>
  );
}

const sectionTitle: React.CSSProperties = { fontSize: 15, fontWeight: 600, color: t.text };
const sectionSub: React.CSSProperties = { fontSize: 12, color: t.textMuted, marginTop: 2 };

export function Dashboard() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Row 1 — Research summary */}
      <div
        style={{
          background: t.surface,
          border: `1px solid ${t.border}`,
          borderRadius: t.radius,
          boxShadow: t.shadowSm,
          padding: 24,
          display: "grid",
          gridTemplateColumns: "1.6fr 1fr 1fr 1fr",
          gap: 24,
          alignItems: "center",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: t.success }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: t.success, letterSpacing: "0.04em" }}>
              ANALYSIS COMPLETE
            </span>
          </div>
          <p style={{ fontSize: 16, fontWeight: 600, color: t.text, lineHeight: 1.4 }}>
            Data Mining Pola Kunjungan Wisatawan
          </p>
          <p style={{ fontSize: 13, color: t.textSecondary, marginTop: 4, lineHeight: 1.5 }}>
            Algoritma K-Means Clustering untuk rekomendasi waktu berkunjung ideal di Sumatera Utara.
          </p>
        </div>
        {[
          { icon: Database, label: "Dataset", value: "540 records" },
          { icon: Layers, label: "Clusters", value: "3 groups" },
          { icon: Calendar, label: "Last Analysis", value: "14 Jun 2026" },
        ].map((m, i) => (
          <div key={i} style={{ borderLeft: `1px solid ${t.borderSoft}`, paddingLeft: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 6 }}>
              <m.icon size={14} color={t.textMuted} />
              <span style={{ fontSize: 11, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {m.label}
              </span>
            </div>
            <p style={{ fontSize: 16, fontWeight: 600, color: t.text }}>{m.value}</p>
          </div>
        ))}
      </div>

      {/* Row 2 — Compact horizontal KPI cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {kpis.map((k, i) => (
          <div
            key={i}
            style={{
              background: t.surface,
              border: `1px solid ${t.border}`,
              borderRadius: t.radius,
              boxShadow: t.shadowSm,
              padding: 18,
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: t.surfaceMuted,
                border: `1px solid ${t.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <k.icon size={18} color={t.primary} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <p style={{ fontSize: 22, fontWeight: 700, color: t.text, letterSpacing: "-0.02em" }}>{k.value}</p>
                {k.up !== null ? (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 2,
                      fontSize: 11,
                      fontWeight: 600,
                      color: k.up ? t.success : t.danger,
                    }}
                  >
                    {k.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {k.delta}
                  </span>
                ) : (
                  <span style={{ fontSize: 11, color: t.textMuted }}>{k.delta}</span>
                )}
              </div>
              <p style={{ fontSize: 12.5, color: t.textSecondary, marginTop: 1 }}>{k.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Row 3 — Large trend + small distribution */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 16, alignItems: "stretch" }}>
        <div
          style={{
            background: t.surface,
            border: `1px solid ${t.border}`,
            borderRadius: t.radius,
            boxShadow: t.shadowSm,
            padding: 24,
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
            <div>
              <h3 style={sectionTitle}>Monthly Visitor Trend</h3>
              <p style={sectionSub}>Total kunjungan bulanan · 2024 vs 2023</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <Legend dot={t.primary} label="2024" />
              <Legend dot="#D1D5DB" label="2023" />
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "4px 10px",
                  borderRadius: 8,
                  background: t.successSoft,
                  fontSize: 11,
                  fontWeight: 600,
                  color: t.success,
                }}
              >
                <ArrowUpRight size={12} /> +15.8% YoY
              </span>
            </div>
          </div>
          <TrendAreaChart data={monthlyData} height={240} />
        </div>

        {/* Distribution */}
        <div
          style={{
            background: t.surface,
            border: `1px solid ${t.border}`,
            borderRadius: t.radius,
            boxShadow: t.shadowSm,
            padding: 24,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h3 style={sectionTitle}>Cluster Distribution</h3>
          <p style={sectionSub}>{totalDest} destinasi terklasifikasi</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 18, marginTop: 22 }}>
            {clusterDist.map((c) => {
              const pct = Math.round((c.value / totalDest) * 100);
              const col = cluster[c.name];
              return (
                <div key={c.name}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: t.text, fontWeight: 500 }}>
                      <span style={{ width: 9, height: 9, borderRadius: 3, background: col.dot }} />
                      {c.name}
                    </span>
                    <span style={{ fontSize: 12, color: t.textSecondary }}>
                      <strong style={{ color: t.text, fontWeight: 600 }}>{c.value}</strong> · {pct}%
                    </span>
                  </div>
                  <div style={{ height: 8, borderRadius: 999, background: t.borderSoft, overflow: "hidden" }}>
                    <div style={{ width: `${pct}%`, height: "100%", borderRadius: 999, background: col.dot }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div
            style={{
              marginTop: "auto",
              paddingTop: 18,
              borderTop: `1px solid ${t.borderSoft}`,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <CircleDot size={14} color={t.primary} />
            <p style={{ fontSize: 12, color: t.textSecondary, lineHeight: 1.4 }}>
              Cluster <strong style={{ color: t.text }}>Sepi</strong> mendominasi dengan separuh total destinasi.
            </p>
          </div>
        </div>
      </div>

      {/* Row 4 — Recent analysis table */}
      <div
        style={{
          background: t.surface,
          border: `1px solid ${t.border}`,
          borderRadius: t.radius,
          boxShadow: t.shadowSm,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "18px 24px",
            borderBottom: `1px solid ${t.borderSoft}`,
          }}
        >
          <div>
            <h3 style={sectionTitle}>Recent Analysis</h3>
            <p style={sectionSub}>Destinasi dengan kunjungan tertinggi tahun berjalan</p>
          </div>
          <button
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "transparent",
              border: "none",
              fontSize: 12.5,
              fontWeight: 600,
              color: t.primary,
              cursor: "pointer",
            }}
          >
            View all results <ArrowRight size={14} />
          </button>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["Destination", "Region", "Cluster", "Annual Visitors", "YoY"].map((h, i) => (
                <th
                  key={h}
                  style={{
                    textAlign: i >= 3 ? "right" : "left",
                    padding: "11px 24px",
                    fontSize: 11,
                    fontWeight: 600,
                    color: t.textMuted,
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    background: t.surfaceMuted,
                    borderBottom: `1px solid ${t.borderSoft}`,
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentAnalysis.map((row, i) => {
              const down = row.trend.startsWith("-");
              return (
                <tr
                  key={row.destination}
                  style={{ borderBottom: i < recentAnalysis.length - 1 ? `1px solid ${t.borderSoft}` : "none" }}
                >
                  <td style={{ padding: "14px 24px", fontSize: 13.5, fontWeight: 600, color: t.text }}>
                    {row.destination}
                  </td>
                  <td style={{ padding: "14px 24px", fontSize: 13, color: t.textSecondary }}>{row.city}</td>
                  <td style={{ padding: "14px 24px" }}>
                    <ClusterBadge name={row.cluster} />
                  </td>
                  <td style={{ padding: "14px 24px", textAlign: "right", fontSize: 13.5, fontWeight: 600, color: t.text }}>
                    {row.visitors.toLocaleString()}
                  </td>
                  <td style={{ padding: "14px 24px", textAlign: "right" }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 3,
                        fontSize: 12.5,
                        fontWeight: 600,
                        color: down ? t.danger : t.success,
                      }}
                    >
                      {down ? <ArrowDownRight size={13} /> : <ArrowUpRight size={13} />}
                      {row.trend}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Row 5 — Research insights */}
      <div
        style={{
          background: t.surface,
          border: `1px solid ${t.border}`,
          borderRadius: t.radius,
          boxShadow: t.shadowSm,
          padding: 24,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <h3 style={sectionTitle}>Research Insights</h3>
            <p style={sectionSub}>Kesimpulan yang dihasilkan dari proses clustering</p>
          </div>
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: t.primary,
              background: t.primarySoft,
              border: `1px solid ${t.primaryBorder}`,
              borderRadius: 999,
              padding: "4px 10px",
            }}
          >
            K-Means · K=3
          </span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {insights.map((ins, i) => (
            <div
              key={i}
              style={{
                background: t.surfaceMuted,
                border: `1px solid ${t.border}`,
                borderRadius: 12,
                padding: 18,
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 24,
                  height: 24,
                  borderRadius: 7,
                  background: t.primarySoft,
                  color: t.primary,
                  fontSize: 12,
                  fontWeight: 700,
                  marginBottom: 12,
                }}
              >
                {i + 1}
              </span>
              <p style={{ fontSize: 13.5, fontWeight: 600, color: t.text, lineHeight: 1.4 }}>{ins.title}</p>
              <p style={{ fontSize: 12.5, color: t.textSecondary, marginTop: 6, lineHeight: 1.6 }}>{ins.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Legend({ dot, label }: { dot: string; label: string }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: dot }} />
      <span style={{ fontSize: 11, color: t.textSecondary }}>{label}</span>
    </span>
  );
}
