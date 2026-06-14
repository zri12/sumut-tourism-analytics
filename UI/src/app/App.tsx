import { useState } from "react";
import { TopNav, type Page } from "./components/TopNav";
import { Dashboard } from "./components/Dashboard";
import { Dataset } from "./components/Dataset";
import { Clustering } from "./components/ClusteringProcess";
import { Results } from "./components/ClusteringResults";
import { Recommendations } from "./components/Recommendations";
import { t } from "./components/theme";

const pageMeta: Record<Page, { eyebrow: string; title: string; subtitle: string }> = {
  dashboard: {
    eyebrow: "Overview",
    title: "Research Dashboard",
    subtitle:
      "Ringkasan analisis pola kunjungan wisatawan dan hasil clustering K-Means untuk destinasi Sumatera Utara.",
  },
  dataset: {
    eyebrow: "Data",
    title: "Dataset",
    subtitle: "Data mentah kunjungan wisatawan per destinasi, kota, dan periode bulan.",
  },
  clustering: {
    eyebrow: "Method",
    title: "K-Means Clustering",
    subtitle: "Alur kerja algoritma dari preprocessing hingga konvergensi centroid.",
  },
  results: {
    eyebrow: "Findings",
    title: "Clustering Results",
    subtitle: "Hasil pengelompokan destinasi ke dalam tiga cluster — Sepi, Sedang, dan Ramai.",
  },
  recommendations: {
    eyebrow: "Report",
    title: "Recommendations",
    subtitle: "Rekomendasi waktu berkunjung ideal berdasarkan intensitas kunjungan musiman.",
  },
};

export default function App() {
  const [activePage, setActivePage] = useState<Page>("dashboard");
  const meta = pageMeta[activePage];

  return (
    <div style={{ fontFamily: t.font, background: t.bg, minHeight: "100vh", color: t.text }}>
      <TopNav activePage={activePage} onNavigate={setActivePage} />

      <main style={{ maxWidth: 1440, margin: "0 auto", padding: "40px 32px 72px" }}>
        {/* Page header — editorial, generous whitespace */}
        <div style={{ marginBottom: 32, maxWidth: 720 }}>
          <p
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: t.primary,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            {meta.eyebrow}
          </p>
          <h1 style={{ fontSize: 32, fontWeight: 700, color: t.text, letterSpacing: "-0.02em", lineHeight: 1.15 }}>
            {meta.title}
          </h1>
          <p style={{ fontSize: 14, color: t.textSecondary, marginTop: 10, lineHeight: 1.6 }}>
            {meta.subtitle}
          </p>
        </div>

        {activePage === "dashboard" && <Dashboard />}
        {activePage === "dataset" && <Dataset />}
        {activePage === "clustering" && <Clustering />}
        {activePage === "results" && <Results />}
        {activePage === "recommendations" && <Recommendations />}
      </main>
    </div>
  );
}
