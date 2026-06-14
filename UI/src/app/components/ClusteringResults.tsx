// Clustering Results — research report view (exports `Results`)
import { useState, useMemo } from "react";
import { Filter } from "lucide-react";
import { t, cluster, type ClusterName } from "./theme";
import { DonutChart, DestBarChart } from "./charts";

type Result = {
  id: number;
  destination: string;
  city: string;
  category: string;
  year: number;
  total: number;
  cluster: ClusterName;
  rank: number;
};

const results: Result[] = [
  { id: 1, destination: "Danau Toba", city: "Samosir", category: "Alam", year: 2024, total: 83200, cluster: "Ramai", rank: 1 },
  { id: 2, destination: "Bukit Lawang", city: "Langkat", category: "Alam", year: 2024, total: 61200, cluster: "Ramai", rank: 2 },
  { id: 3, destination: "Berastagi", city: "Karo", category: "Alam", year: 2024, total: 58800, cluster: "Ramai", rank: 3 },
  { id: 4, destination: "Prapat", city: "Simalungun", category: "Alam", year: 2024, total: 52000, cluster: "Ramai", rank: 4 },
  { id: 5, destination: "Sipiso-piso (Upper)", city: "Karo", category: "Alam", year: 2024, total: 47200, cluster: "Ramai", rank: 5 },
  { id: 6, destination: "Istana Maimun", city: "Medan", category: "Budaya", year: 2024, total: 42300, cluster: "Sedang", rank: 6 },
  { id: 7, destination: "Masjid Al-Mashun", city: "Medan", category: "Budaya", year: 2024, total: 37400, cluster: "Sedang", rank: 7 },
  { id: 8, destination: "Sipisopiso", city: "Karo", category: "Alam", year: 2024, total: 35100, cluster: "Sedang", rank: 8 },
  { id: 9, destination: "Pantai Cermin", city: "Serdang Bedagai", category: "Pantai", year: 2024, total: 33000, cluster: "Sedang", rank: 9 },
  { id: 10, destination: "Air Terjun", city: "Karo", category: "Alam", year: 2024, total: 31400, cluster: "Sedang", rank: 10 },
  { id: 11, destination: "Vihara Gunung Timur", city: "Medan", category: "Budaya", year: 2024, total: 24700, cluster: "Sepi", rank: 11 },
  { id: 12, destination: "Pulau Nias", city: "Nias", category: "Pantai", year: 2024, total: 22200, cluster: "Sepi", rank: 12 },
  { id: 13, destination: "Museum Sumatera Utara", city: "Medan", category: "Budaya", year: 2024, total: 21800, cluster: "Sepi", rank: 13 },
  { id: 14, destination: "Pantai Sialang Buah", city: "Langkat", category: "Pantai", year: 2024, total: 18900, cluster: "Sepi", rank: 14 },
  { id: 15, destination: "Bukit Gundaling", city: "Karo", category: "Alam", year: 2024, total: 15400, cluster: "Sepi", rank: 15 },
];

const pieData: { name: ClusterName; value: number }[] = [
  { name: "Ramai", value: 8 },
  { name: "Sedang", value: 14 },
  { name: "Sepi", value: 23 },
];
const totalDest = pieData.reduce((s, p) => s + p.value, 0);

const barData = results.slice(0, 8).map((r) => ({ name: r.destination, visitors: r.total, cluster: r.cluster }));

const clusterCards: { name: ClusterName; title: string; range: string; avg: string; desc: string }[] = [
  {
    name: "Sepi",
    title: "Low Traffic",
    range: "0 – 25,000",
    avg: "12,450",
    desc: "Destinasi dengan kunjungan rendah sepanjang tahun. Cocok untuk wisatawan yang mencari ketenangan.",
  },
  {
    name: "Sedang",
    title: "Moderate Traffic",
    range: "25,001 – 55,000",
    avg: "38,200",
    desc: "Kunjungan moderat dengan fluktuasi musiman. Keseimbangan antara fasilitas dan keramaian.",
  },
  {
    name: "Ramai",
    title: "High Traffic",
    range: "55,001 +",
    avg: "61,500",
    desc: "Destinasi unggulan dengan kunjungan tinggi, terutama pada musim puncak Juni–Agustus.",
  },
];

const sectionTitle: React.CSSProperties = { fontSize: 15, fontWeight: 600, color: t.text };
const sectionSub: React.CSSProperties = { fontSize: 12, color: t.textMuted, marginTop: 2 };
const cardBase: React.CSSProperties = {
  background: t.surface,
  border: `1px solid ${t.border}`,
  borderRadius: t.radius,
  boxShadow: t.shadowSm,
};

function FilterSelect({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        height: 34,
        background: t.surface,
        border: `1px solid ${t.border}`,
        borderRadius: 10,
        padding: "0 28px 0 11px",
        fontSize: 12.5,
        color: t.text,
        outline: "none",
        cursor: "pointer",
        fontFamily: t.font,
        appearance: "none",
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2'><polyline points='6 9 12 15 18 9'/></svg>\")",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 8px center",
      }}
    >
      {options.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  );
}

export function Results() {
  const [filterCluster, setFilterCluster] = useState("All");
  const [filterCity, setFilterCity] = useState("All Cities");
  const [filterYear, setFilterYear] = useState("All Years");

  const filtered = useMemo(
    () =>
      results.filter((r) => {
        const cMatch = filterCluster === "All" || r.cluster === filterCluster;
        const cityMatch = filterCity === "All Cities" || r.city === filterCity;
        const yearMatch = filterYear === "All Years" || r.year.toString() === filterYear;
        return cMatch && cityMatch && yearMatch;
      }),
    [filterCluster, filterCity, filterYear]
  );

  const maxTotal = Math.max(...results.map((r) => r.total));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Cluster report cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {clusterCards.map((c) => {
          const col = cluster[c.name];
          const count = pieData.find((p) => p.name === c.name)!.value;
          return (
            <div key={c.name} style={{ ...cardBase, padding: 22, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, width: 4, height: "100%", background: col.dot }} />
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 3, background: col.dot }} />
                  <span style={{ fontSize: 14, fontWeight: 600, color: t.text }}>Cluster {c.name}</span>
                </span>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: col.text,
                    background: col.soft,
                    border: `1px solid ${col.border}`,
                    borderRadius: 999,
                    padding: "3px 10px",
                  }}
                >
                  {c.title}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                <span style={{ fontSize: 30, fontWeight: 700, color: t.text, letterSpacing: "-0.02em" }}>{count}</span>
                <span style={{ fontSize: 13, color: t.textSecondary }}>destinasi · {Math.round((count / totalDest) * 100)}%</span>
              </div>
              <div style={{ display: "flex", gap: 20, margin: "14px 0", paddingTop: 14, borderTop: `1px solid ${t.borderSoft}` }}>
                <div>
                  <p style={{ fontSize: 11, color: t.textMuted }}>Avg Visitors</p>
                  <p style={{ fontSize: 13.5, fontWeight: 600, color: t.text }}>{c.avg}</p>
                </div>
                <div>
                  <p style={{ fontSize: 11, color: t.textMuted }}>Range</p>
                  <p style={{ fontSize: 13.5, fontWeight: 600, color: t.text }}>{c.range}</p>
                </div>
              </div>
              <p style={{ fontSize: 12.5, color: t.textSecondary, lineHeight: 1.6 }}>{c.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: 16 }}>
        <div style={{ ...cardBase, padding: 24 }}>
          <h3 style={sectionTitle}>Cluster Distribution</h3>
          <p style={sectionSub}>{totalDest} destinasi terklasifikasi</p>
          <DonutChart data={pieData} height={180} />
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 8 }}>
            {pieData.map((d) => (
              <div key={d.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: t.textSecondary }}>
                  <span style={{ width: 9, height: 9, borderRadius: "50%", background: cluster[d.name].dot }} />
                  {d.name}
                </span>
                <span style={{ fontSize: 13, color: t.textSecondary }}>
                  <strong style={{ color: t.text, fontWeight: 600 }}>{d.value}</strong> · {Math.round((d.value / totalDest) * 100)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ ...cardBase, padding: 24 }}>
          <h3 style={sectionTitle}>Annual Visitors by Destination</h3>
          <p style={sectionSub}>Top 8 destinasi diwarnai per cluster</p>
          <DestBarChart data={barData} height={280} />
        </div>
      </div>

      {/* Findings note */}
      <div style={{ ...cardBase, padding: 24, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
        {[
          { k: "Finding 01", v: "Wisata alam mendominasi Cluster Ramai", d: "Seluruh 8 destinasi Cluster Ramai berkategori Alam dan berlokasi di sekitar kawasan Danau Toba." },
          { k: "Finding 02", v: "Pola musiman seragam antar cluster", d: "Puncak kunjungan konsisten terjadi pada Juli untuk semua cluster, menandakan faktor musiman yang kuat." },
          { k: "Finding 03", v: "Potensi pemerataan kunjungan", d: "51% destinasi tergolong Sepi — peluang besar untuk pengembangan dan promosi destinasi alternatif." },
        ].map((f, i) => (
          <div key={i} style={{ borderLeft: i > 0 ? `1px solid ${t.borderSoft}` : "none", paddingLeft: i > 0 ? 24 : 0 }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: t.primary, letterSpacing: "0.06em", textTransform: "uppercase" }}>{f.k}</p>
            <p style={{ fontSize: 14, fontWeight: 600, color: t.text, marginTop: 8, lineHeight: 1.4 }}>{f.v}</p>
            <p style={{ fontSize: 12.5, color: t.textSecondary, marginTop: 8, lineHeight: 1.6 }}>{f.d}</p>
          </div>
        ))}
      </div>

      {/* Results table */}
      <div style={{ ...cardBase, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 24px", borderBottom: `1px solid ${t.borderSoft}` }}>
          <div>
            <h3 style={sectionTitle}>Detailed Cluster Assignments</h3>
            <p style={sectionSub}>{filtered.length} dari {results.length} destinasi</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Filter size={14} color={t.textMuted} />
            <FilterSelect value={filterCluster} onChange={setFilterCluster} options={["All", "Ramai", "Sedang", "Sepi"]} />
            <FilterSelect value={filterCity} onChange={setFilterCity} options={["All Cities", "Medan", "Samosir", "Langkat", "Karo", "Serdang Bedagai", "Nias", "Simalungun"]} />
            <FilterSelect value={filterYear} onChange={setFilterYear} options={["All Years", "2024", "2023"]} />
          </div>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {[
                { l: "#", a: "left" },
                { l: "Destination", a: "left" },
                { l: "Region", a: "left" },
                { l: "Category", a: "left" },
                { l: "Annual Visitors", a: "left" },
                { l: "Cluster", a: "right" },
              ].map((c) => (
                <th
                  key={c.l}
                  style={{
                    textAlign: c.a as any,
                    padding: "11px 24px",
                    fontSize: 11,
                    fontWeight: 600,
                    color: t.textMuted,
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    background: t.surfaceMuted,
                    borderBottom: `1px solid ${t.border}`,
                  }}
                >
                  {c.l}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((row, i) => {
              const col = cluster[row.cluster];
              return (
                <tr
                  key={row.id}
                  style={{ borderBottom: i < filtered.length - 1 ? `1px solid ${t.borderSoft}` : "none" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = t.surfaceMuted)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <td style={{ padding: "13px 24px", fontSize: 12.5, color: t.textMuted, fontVariantNumeric: "tabular-nums" }}>
                    {String(row.rank).padStart(2, "0")}
                  </td>
                  <td style={{ padding: "13px 24px", fontSize: 13.5, fontWeight: 600, color: t.text }}>{row.destination}</td>
                  <td style={{ padding: "13px 24px", fontSize: 13, color: t.textSecondary }}>{row.city}</td>
                  <td style={{ padding: "13px 24px", fontSize: 13, color: t.textSecondary }}>{row.category}</td>
                  <td style={{ padding: "13px 24px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 13.5, fontWeight: 600, color: t.text, fontVariantNumeric: "tabular-nums", minWidth: 56 }}>
                        {row.total.toLocaleString()}
                      </span>
                      <div style={{ width: 120, height: 6, borderRadius: 999, background: t.borderSoft, overflow: "hidden" }}>
                        <div style={{ width: `${(row.total / maxTotal) * 100}%`, height: "100%", background: col.dot, borderRadius: 999 }} />
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "13px 24px", textAlign: "right" }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "3px 10px",
                        borderRadius: 999,
                        background: col.soft,
                        border: `1px solid ${col.border}`,
                        fontSize: 11,
                        fontWeight: 600,
                        color: col.text,
                      }}
                    >
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: col.dot }} />
                      {row.cluster}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
