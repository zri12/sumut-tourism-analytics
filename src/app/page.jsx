import { BookOpenText } from "lucide-react";
import DashboardSummary from "@/components/dashboard/DashboardSummary";
import MonthlyTrendChart from "@/components/dashboard/MonthlyTrendChart";
import InsightPanel from "@/components/dashboard/InsightPanel";
import ResearchSummary from "@/components/dashboard/ResearchSummary";
import ClusterDistribution from "@/components/dashboard/ClusterDistribution";
import RecentAnalysis from "@/components/dashboard/RecentAnalysis";
import tourismData from "@/data/tourism.json";
import { getClusterDistribution, getMonthlyTrend } from "@/lib/statistics";
import { kMeans } from "@/lib/kmeans";

export default function DashboardPage() {
  const monthlyData = getMonthlyTrend(tourismData);
  const { results } = kMeans(tourismData);
  const distribution = getClusterDistribution(results);
  const chartData = Object.entries(distribution).map(([name, value]) => ({ name, value }));

  return (
    <div className="page-shell">
      <div className="mb-7 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-blue-600">
            <BookOpenText size={17} />
            Research Dashboard
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Tourism Visit Pattern Analytics</h1>
          <p className="mt-2 text-sm text-slate-500">
            K-Means Clustering · Sumatera Utara Tourism Analytics
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-card">
          <span className="text-slate-500">Dataset aktif</span>
          <strong className="ml-2 text-slate-900">{tourismData.length} baris</strong>
        </div>
      </div>

      <div className="space-y-5">
        <ResearchSummary totalRecords={tourismData.length} />
        <DashboardSummary data={tourismData} />
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1.8fr)_340px]">
        <MonthlyTrendChart data={monthlyData} />
        <ClusterDistribution data={chartData} />
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1.8fr)_340px]">
        <RecentAnalysis data={results} />
        <InsightPanel data={results} />
      </div>
    </div>
  );
}
