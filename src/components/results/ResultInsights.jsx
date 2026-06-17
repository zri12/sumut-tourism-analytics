import { ArrowDownToLine, ArrowUpToLine, Gauge } from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { formatNumber } from "@/utils/formatter";

export default function ResultInsights({ data }) {
  if (!data.length) {
    return (
      <Card className="p-5 text-sm text-slate-500">
        Data clustering belum tersedia. Pastikan environment Supabase sudah diisi dan tabel tourism_data memiliki data.
      </Card>
    );
  }

  const sorted = [...data].sort((a, b) => b.jumlah_kunjungan - a.jumlah_kunjungan);
  const crowded = sorted[0];
  const least = sorted[sorted.length - 1];
  const mediumItems = data.filter((item) => item.cluster_label === "Sedang").sort((a, b) => b.jumlah_kunjungan - a.jumlah_kunjungan);
  const medium = mediumItems[Math.floor(mediumItems.length / 2)] || sorted[Math.floor(sorted.length / 2)];
  const insights = [
    { title: "Most Crowded Destination", item: crowded, icon: ArrowUpToLine, tone: "bg-emerald-50 text-emerald-600" },
    { title: "Medium Traffic Destination", item: medium, icon: Gauge, tone: "bg-amber-50 text-amber-600" },
    { title: "Least Crowded Destination", item: least, icon: ArrowDownToLine, tone: "bg-blue-50 text-blue-600" },
  ];
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {insights.map(({ title, item, icon: Icon, tone }) => (
        <Card key={title} className="p-5">
          <div className="flex items-start justify-between">
            <span className={`grid h-9 w-9 place-items-center rounded-lg ${tone}`}><Icon size={17} /></span>
            <Badge variant={item.cluster_label}>{item.cluster_label}</Badge>
          </div>
          <p className="mt-4 text-[11px] font-semibold uppercase tracking-wide text-slate-400">{title}</p>
          <h3 className="mt-2 font-bold text-slate-900">{item.destinasi_wisata}</h3>
          <p className="mt-1 text-xs text-slate-500">{item.kabupaten_kota} · {item.bulan} {item.tahun}</p>
          <p className="mt-3 text-sm font-semibold text-slate-700">{formatNumber(item.jumlah_kunjungan)} kunjungan</p>
        </Card>
      ))}
    </div>
  );
}
