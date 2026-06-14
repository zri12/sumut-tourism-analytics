import { CLUSTERS } from "@/constants/clusters";
import Card from "@/components/ui/Card";

export default function RecommendationTimeline({ data }) {
  const byMonth = Object.values(
    data.reduce((result, item) => {
      result[item.bulan] ??= { bulan: item.bulan, visits: 0, count: 0, clusters: {} };
      result[item.bulan].visits += item.jumlah_kunjungan;
      result[item.bulan].count += 1;
      result[item.bulan].clusters[item.cluster_label] = (result[item.bulan].clusters[item.cluster_label] || 0) + 1;
      return result;
    }, {}),
  ).map((item) => ({
    ...item,
    cluster: Object.entries(item.clusters).sort((a, b) => b[1] - a[1])[0][0],
  }));

  return (
    <Card className="p-5 sm:p-6">
      <h2 className="font-bold text-slate-900">Peta Waktu Kunjungan</h2>
      <p className="mt-1 text-sm text-slate-500">Kategori dominan pada setiap bulan.</p>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {byMonth.map((item) => (
          <div key={item.bulan} className="rounded-xl border border-slate-200 p-3">
            <span className="block h-1.5 rounded-full" style={{ backgroundColor: CLUSTERS[item.cluster].color }} />
            <p className="mt-3 text-sm font-bold text-slate-900">{item.bulan}</p>
            <p className="mt-1 text-xs font-medium" style={{ color: CLUSTERS[item.cluster].color }}>{item.cluster}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
