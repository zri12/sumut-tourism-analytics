import { ChartNoAxesCombined } from "lucide-react";
import Card from "@/components/ui/Card";
import ClusterSummaryCard from "@/components/results/ClusterSummaryCard";
import ClusterResultTable from "@/components/results/ClusterResultTable";
import ClusterPieChart from "@/components/results/ClusterPieChart";
import ClusterBarChart from "@/components/results/ClusterBarChart";
import ResultInsights from "@/components/results/ResultInsights";
import { kMeans } from "@/lib/kmeans";
import { getClusterDistribution } from "@/lib/statistics";
import { fetchTourismDataFromApi } from "@/lib/fetchTourismData";

export const metadata = { title: "Hasil Clustering" };
export const dynamic = "force-dynamic";

export default async function ResultsPage() {
  const tourismData = await fetchTourismDataFromApi();
  const { results } = kMeans(tourismData);
  const distribution = getClusterDistribution(results);
  const chartData = Object.entries(distribution).map(([name, value]) => ({ name, value }));

  return (
    <div className="page-shell">
      <div className="mb-7">
        <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-blue-600">
          <ChartNoAxesCombined size={17} /> Hasil Analisis
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Hasil Clustering</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
          Distribusi data kunjungan setelah normalisasi dan proses iterasi K-Means.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {["Sepi", "Sedang", "Ramai"].map((label) => (
          <ClusterSummaryCard key={label} label={label} data={results} total={results.length} />
        ))}
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <ClusterPieChart data={chartData} />
        <ClusterBarChart data={chartData} />
      </div>
      <div className="mt-5"><ResultInsights data={results} /></div>
      <Card className="mt-5 overflow-hidden">
        <div className="p-5 sm:p-6">
          <h2 className="font-bold text-slate-900">Detail Hasil Clustering</h2>
          <p className="mt-1 text-sm text-slate-500">Label cluster untuk setiap observasi dataset.</p>
        </div>
        <ClusterResultTable data={results} />
      </Card>
    </div>
  );
}
