import { Binary, Database, FlaskConical, ListTree } from "lucide-react";
import Card from "@/components/ui/Card";
import ClusterFlow from "@/components/clustering/ClusterFlow";
import ClusterCategoryCard from "@/components/clustering/ClusterCategoryCard";
import ClusteringProcess from "@/components/clustering/ClusteringProcess";
import { kMeans } from "@/lib/kmeans";
import { getClusterDistribution } from "@/lib/statistics";
import { fetchTourismDataFromApi } from "@/lib/fetchTourismData";

export const metadata = { title: "Clustering" };
export const dynamic = "force-dynamic";

export default async function ClusteringPage() {
  const tourismData = await fetchTourismDataFromApi();
  const clustering = kMeans(tourismData);
  const distribution = getClusterDistribution(clustering.results);
  return (
    <div className="page-shell">
      <div className="mb-7">
        <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-blue-600">
          <FlaskConical size={17} /> Metode Analisis
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Proses Clustering</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
          Pengelompokan dilakukan dengan K = 3. Label ditentukan dari rata-rata jumlah kunjungan setiap cluster.
        </p>
      </div>
      <div className="space-y-5">
        <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
          <Card className="p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Cluster Settings</h2>
                <p className="mt-1 text-xs text-slate-500">Konfigurasi kategori penelitian.</p>
              </div>
              <div className="rounded-xl bg-blue-50 px-4 py-2 text-center">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-blue-500">Number of clusters</p>
                <p className="text-xl font-bold text-blue-700">3</p>
              </div>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {["Sepi", "Sedang", "Ramai"].map((label, index) => <ClusterCategoryCard key={label} label={label} index={index + 1} />)}
            </div>
          </Card>
          <Card className="p-5 sm:p-6">
            <h2 className="text-sm font-bold text-slate-900">Dataset Information</h2>
            <p className="mt-1 text-xs text-slate-500">Informasi input untuk proses analisis.</p>
            <div className="mt-5 space-y-4">
              {[
                { label: "Jumlah data", value: `${tourismData.length} records`, icon: Database },
                { label: "Fitur utama", value: "jumlah_kunjungan", icon: Binary },
                { label: "Fitur pendukung", value: "musim_libur, libur_nasional", icon: ListTree },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-slate-50 text-blue-600"><Icon size={16} /></span>
                  <div><p className="text-[11px] text-slate-400">{label}</p><p className="text-sm font-semibold text-slate-800">{value}</p></div>
                </div>
              ))}
            </div>
          </Card>
        </div>
        <ClusterFlow />
        <ClusteringProcess
          totalData={tourismData.length}
          iterations={clustering.iterations}
          distribution={distribution}
        />
      </div>
    </div>
  );
}
