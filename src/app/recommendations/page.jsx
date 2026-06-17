import { Lightbulb, Sparkles } from "lucide-react";
import Card from "@/components/ui/Card";
import RecommendationCard from "@/components/recommendations/RecommendationCard";
import RecommendationTimeline from "@/components/recommendations/RecommendationTimeline";
import ConclusionPanel from "@/components/recommendations/ConclusionPanel";
import RecommendationTrendChart from "@/components/recommendations/RecommendationTrendChart";
import TourismInsight from "@/components/recommendations/TourismInsight";
import { kMeans } from "@/lib/kmeans";
import {
  generateRecommendationSummary,
  getBestVisitMonths,
  getModerateMonths,
  getPeakMonths,
} from "@/lib/recommendation";
import { getMonthlyTrend } from "@/lib/statistics";
import { fetchTourismDataFromApi } from "@/lib/fetchTourismData";

export const metadata = { title: "Rekomendasi" };
export const dynamic = "force-dynamic";

export default async function RecommendationsPage() {
  const tourismData = await fetchTourismDataFromApi();
  const { results } = kMeans(tourismData);
  const bestMonths = getBestVisitMonths(results);
  const peakMonths = getPeakMonths(results);
  const monthlyData = getMonthlyTrend(tourismData);
  const moderateMonths = getModerateMonths(results);

  return (
    <div className="page-shell">
      <div className="mb-7">
        <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-blue-600">
          <Lightbulb size={17} /> Interpretasi Hasil
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Rekomendasi Waktu Berkunjung</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
          Rekomendasi berbasis pola rata-rata kunjungan bulanan dan hasil pengelompokan K-Means.
        </p>
      </div>
      <Card className="mb-5 flex items-start gap-4 p-5 sm:p-6">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600"><Sparkles size={19} /></span>
        <div>
          <h2 className="text-sm font-bold text-slate-900">Recommendation Summary</h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">{generateRecommendationSummary(results)}</p>
        </div>
      </Card>
      <div className="grid gap-5 lg:grid-cols-3">
        <RecommendationCard
          title="Best Time To Visit"
          description="Bulan dengan rata-rata kunjungan lebih rendah, sesuai untuk wisatawan yang mengutamakan suasana tenang."
          months={bestMonths}
          type="best"
        />
        <RecommendationCard
          title="Avoid Peak Season"
          description="Bulan dengan kecenderungan kunjungan tinggi. Persiapan jadwal dan reservasi lebih awal disarankan."
          months={peakMonths}
          type="peak"
        />
        <RecommendationCard
          title="Moderate Visit Period"
          description="Periode dengan tingkat kunjungan menengah untuk keseimbangan suasana dan aktivitas."
          months={moderateMonths}
          type="moderate"
        />
      </div>
      <div className="mt-5 space-y-5">
        <RecommendationTimeline data={results} />
        <div className="grid gap-5 lg:grid-cols-[1.6fr_0.8fr]">
          <RecommendationTrendChart data={monthlyData} />
          <TourismInsight />
        </div>
        <ConclusionPanel summary={generateRecommendationSummary(results)} />
      </div>
    </div>
  );
}
