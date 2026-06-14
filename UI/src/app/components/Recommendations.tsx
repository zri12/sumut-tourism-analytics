import { ScoreAreaChart } from "./charts";
import {
  CalendarCheck,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { t, cluster, type ClusterName } from "./theme";

const monthlyTrend = [
  { month: "Jan", score: 42 }, { month: "Feb", score: 38 }, { month: "Mar", score: 40 },
  { month: "Apr", score: 55 }, { month: "May", score: 65 }, { month: "Jun", score: 82 },
  { month: "Jul", score: 95 }, { month: "Aug", score: 88 }, { month: "Sep", score: 68 },
  { month: "Oct", score: 52 }, { month: "Nov", score: 44 }, { month: "Dec", score: 70 },
];

type Band = "Off-peak" | "Moderate" | "Peak";
const heatmap: { label: string; score: number; band: Band }[] = [
  { label: "Jan", score: 42, band: "Off-peak" }, { label: "Feb", score: 38, band: "Off-peak" },
  { label: "Mar", score: 40, band: "Off-peak" }, { label: "Apr", score: 55, band: "Moderate" },
  { label: "May", score: 65, band: "Moderate" }, { label: "Jun", score: 82, band: "Peak" },
  { label: "Jul", score: 95, band: "Peak" }, { label: "Aug", score: 88, band: "Peak" },
  { label: "Sep", score: 68, band: "Moderate" }, { label: "Oct", score: 52, band: "Moderate" },
  { label: "Nov", score: 44, band: "Off-peak" }, { label: "Dec", score: 70, band: "Moderate" },
];

const heatStyle = (score: number) => {
  if (score >= 80) return { bg: "#1D4ED8", text: "#fff" };
  if (score >= 65) return { bg: "#3B82F6", text: "#fff" };
  if (score >= 50) return { bg: "#BFD4FF", text: "#1E3A8A" };
  return { bg: "#EEF2F7", text: "#6B7280" };
};

const recs: { name: string; city: string; best: string; avoid: string; cluster: ClusterName; score: number; tip: string }[] = [
  { name: "Danau Toba", city: "Samosir", best: "Jun – Aug", avoid: "Dec – Feb", cluster: "Ramai", score: 95, tip: "Datang pagi hari untuk menghindari keramaian tepi danau." },
  { name: "Bukit Lawang", city: "Langkat", best: "May – Sep", avoid: "Nov – Jan", cluster: "Ramai", score: 89, tip: "Musim kering ideal untuk trekking orangutan." },
  { name: "Berastagi", city: "Karo", best: "Apr – Aug", avoid: "Dec – Feb", cluster: "Ramai", score: 84, tip: "Pemandangan gunung paling jernih saat musim kemarau." },
  { name: "Istana Maimun", city: "Medan", best: "Jan – Mar", avoid: "Jun – Aug", cluster: "Sedang", score: 72, tip: "Off-peak menawarkan harga lebih ramah bagi wisatawan." },
  { name: "Pulau Nias", city: "Nias", best: "May – Oct", avoid: "Nov – Feb", cluster: "Sepi", score: 65, tip: "Destinasi tenang, cocok untuk wisatawan petualang." },
];

const sectionTitle: React.CSSProperties = { fontSize: 15, fontWeight: 600, color: t.text };
const sectionSub: React.CSSProperties = { fontSize: 12, color: t.textMuted, marginTop: 2 };
const cardBase: React.CSSProperties = {
  background: t.surface,
  border: `1px solid ${t.border}`,
  borderRadius: t.radius,
  boxShadow: t.shadowSm,
};

export function Recommendations() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Executive summary banner (flat, no gradient) */}
      <div style={{ ...cardBase, padding: 24, display: "flex", gap: 20, alignItems: "flex-start" }}>
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            background: t.primarySoft,
            border: `1px solid ${t.primaryBorder}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Sparkles size={20} color={t.primary} />
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: t.text }}>Executive Summary</h3>
          <p style={{ fontSize: 13.5, color: t.textSecondary, marginTop: 6, lineHeight: 1.7, maxWidth: 820 }}>
            Berdasarkan clustering K-Means (K=3), periode <strong style={{ color: t.text }}>Juni–Agustus</strong> merupakan
            waktu paling ramai berkunjung ke destinasi Sumatera Utara, dipimpin oleh <strong style={{ color: t.text }}>Danau Toba</strong> dan{" "}
            <strong style={{ color: t.text }}>Bukit Lawang</strong> dari Cluster Ramai. Wisatawan yang menghindari keramaian
            disarankan berkunjung pada <strong style={{ color: t.text }}>Januari–Maret</strong>.
          </p>
        </div>
      </div>

      {/* KPI summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {[
          { icon: CalendarCheck, label: "Best Window", value: "Jun – Aug", sub: "Skor ideal tertinggi", accent: t.primary, soft: t.primarySoft, border: t.primaryBorder },
          { icon: AlertTriangle, label: "Peak Warning", value: "Jul", sub: "Kepadatan maksimum", accent: t.warning, soft: t.warningSoft, border: "#FDE68A" },
          { icon: CheckCircle2, label: "Quiet Window", value: "Jan – Mar", sub: "Hindari keramaian", accent: t.success, soft: t.successSoft, border: "#CCFBEF" },
          { icon: TrendingUp, label: "Top Score", value: "95 / 100", sub: "Danau Toba", accent: t.primary, soft: t.primarySoft, border: t.primaryBorder },
        ].map((c, i) => (
          <div key={i} style={{ ...cardBase, padding: 18 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: c.soft,
                border: `1px solid ${c.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 14,
              }}
            >
              <c.icon size={18} color={c.accent} />
            </div>
            <p style={{ fontSize: 20, fontWeight: 700, color: t.text, letterSpacing: "-0.01em" }}>{c.value}</p>
            <p style={{ fontSize: 12.5, color: t.text, marginTop: 2, fontWeight: 500 }}>{c.label}</p>
            <p style={{ fontSize: 11.5, color: t.textMuted, marginTop: 1 }}>{c.sub}</p>
          </div>
        ))}
      </div>

      {/* Calendar heatmap + trend */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ ...cardBase, padding: 24 }}>
          <h3 style={sectionTitle}>Visit Calendar Heatmap</h3>
          <p style={sectionSub}>Intensitas kunjungan bulanan se-Sumatera Utara</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginTop: 18 }}>
            {heatmap.map((m) => {
              const s = heatStyle(m.score);
              return (
                <div key={m.label} style={{ borderRadius: 12, padding: "14px 10px", background: s.bg, textAlign: "center" }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: s.text, opacity: 0.85 }}>{m.label}</p>
                  <p style={{ fontSize: 22, fontWeight: 700, color: s.text, lineHeight: 1.2, marginTop: 4 }}>{m.score}</p>
                  <p style={{ fontSize: 10, color: s.text, opacity: 0.75, marginTop: 2 }}>{m.band}</p>
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 18, paddingTop: 16, borderTop: `1px solid ${t.borderSoft}` }}>
            <span style={{ fontSize: 11, color: t.textMuted }}>Intensity</span>
            {[
              { l: "Off-peak", c: "#EEF2F7" },
              { l: "Moderate", c: "#BFD4FF" },
              { l: "High", c: "#3B82F6" },
              { l: "Peak", c: "#1D4ED8" },
            ].map((l) => (
              <span key={l.l} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 11, height: 11, borderRadius: 3, background: l.c, border: `1px solid ${t.border}` }} />
                <span style={{ fontSize: 11, color: t.textSecondary }}>{l.l}</span>
              </span>
            ))}
          </div>
        </div>

        <div style={{ ...cardBase, padding: 24 }}>
          <h3 style={sectionTitle}>Ideal Visit Score Trend</h3>
          <p style={sectionSub}>Skor rekomendasi per bulan (100 = optimal)</p>
          <ScoreAreaChart data={monthlyTrend} height={260} />
        </div>
      </div>

      {/* Recommendation list */}
      <div style={{ ...cardBase, overflow: "hidden" }}>
        <div style={{ padding: "18px 24px", borderBottom: `1px solid ${t.borderSoft}` }}>
          <h3 style={sectionTitle}>Destination Recommendations</h3>
          <p style={sectionSub}>Waktu kunjungan optimal per destinasi, diurutkan berdasarkan skor</p>
        </div>
        <div>
          {recs.map((r, i) => {
            const col = cluster[r.cluster];
            return (
              <div
                key={r.name}
                style={{
                  display: "grid",
                  gridTemplateColumns: "28px 1.4fr 1fr 1fr 96px 150px",
                  alignItems: "center",
                  gap: 16,
                  padding: "16px 24px",
                  borderBottom: i < recs.length - 1 ? `1px solid ${t.borderSoft}` : "none",
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 700, color: t.textMuted, fontVariantNumeric: "tabular-nums" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <p style={{ fontSize: 13.5, fontWeight: 600, color: t.text }}>{r.name}</p>
                  <p style={{ fontSize: 12, color: t.textMuted, marginTop: 1, lineHeight: 1.4 }}>{r.tip}</p>
                </div>
                <div>
                  <p style={{ fontSize: 11, color: t.textMuted }}>Best time</p>
                  <p style={{ fontSize: 13, fontWeight: 600, color: t.success }}>{r.best}</p>
                </div>
                <div>
                  <p style={{ fontSize: 11, color: t.textMuted }}>Avoid</p>
                  <p style={{ fontSize: 13, fontWeight: 600, color: t.warning }}>{r.avoid}</p>
                </div>
                <span
                  style={{
                    justifySelf: "start",
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
                  {r.cluster}
                </span>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontSize: 11, color: t.textMuted }}>Score</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: t.text }}>{r.score}</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 999, background: t.borderSoft, overflow: "hidden" }}>
                    <div style={{ width: `${r.score}%`, height: "100%", background: t.primary, borderRadius: 999 }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Timeline analysis */}
      <div style={{ ...cardBase, padding: 24 }}>
        <h3 style={sectionTitle}>Seasonal Timeline Analysis</h3>
        <p style={sectionSub}>Fase musiman kunjungan sepanjang tahun</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginTop: 18 }}>
          {[
            { phase: "Low Season", period: "Januari – Maret", band: "Off-peak", desc: "Kunjungan terendah, cuaca basah. Ideal untuk wisata tenang dan hemat biaya.", color: t.success, soft: t.successSoft, border: "#CCFBEF" },
            { phase: "Shoulder Season", period: "April – Mei · Sep – Okt", band: "Moderate", desc: "Transisi musim dengan kepadatan menengah dan cuaca relatif stabil.", color: t.primary, soft: t.primarySoft, border: t.primaryBorder },
            { phase: "High Season", period: "Juni – Agustus", band: "Peak", desc: "Puncak kunjungan tahunan. Disarankan reservasi awal dan datang pagi.", color: t.warning, soft: t.warningSoft, border: "#FDE68A" },
          ].map((p, i) => (
            <div key={i} style={{ border: `1px solid ${t.border}`, borderRadius: 12, padding: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: p.color, background: p.soft, border: `1px solid ${p.border}`, borderRadius: 999, padding: "3px 10px" }}>
                {p.band}
              </span>
              <p style={{ fontSize: 14, fontWeight: 600, color: t.text, marginTop: 12 }}>{p.phase}</p>
              <p style={{ fontSize: 12.5, color: t.textSecondary, marginTop: 2 }}>{p.period}</p>
              <p style={{ fontSize: 12.5, color: t.textSecondary, marginTop: 10, lineHeight: 1.6 }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
