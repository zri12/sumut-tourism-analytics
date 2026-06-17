import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { formatNumber } from "@/utils/formatter";
import { CLUSTERS } from "@/constants/clusters";

export default function ClusterSummaryCard({ label, data, total }) {
  const members = data.filter((item) => item.cluster_label === label);
  const percentage = total ? Math.round((members.length / total) * 100) : 0;
  const average = Math.round(
    members.reduce((sum, item) => sum + item.jumlah_kunjungan, 0) /
      Math.max(members.length, 1),
  );
  const min = members.length ? Math.min(...members.map((item) => item.jumlah_kunjungan)) : 0;
  const max = members.length ? Math.max(...members.map((item) => item.jumlah_kunjungan)) : 0;

  return (
    <Card className="relative overflow-hidden p-5">
      <span className="absolute inset-y-0 left-0 w-1" style={{ backgroundColor: CLUSTERS[label].color }} />
      <div className="flex items-center justify-between">
        <Badge variant={label}>{label}</Badge>
        <span className="text-xs font-semibold text-slate-400">
          {percentage}%
        </span>
      </div>
      <p className="mt-5 text-2xl font-bold text-slate-900">{members.length} records</p>
      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
        <div><p className="text-[10px] uppercase tracking-wide text-slate-400">Average</p><p className="mt-1 text-sm font-semibold text-slate-800">{formatNumber(average)}</p></div>
        <div><p className="text-[10px] uppercase tracking-wide text-slate-400">Range</p><p className="mt-1 text-xs font-semibold text-slate-800">{formatNumber(min)}–{formatNumber(max)}</p></div>
      </div>
    </Card>
  );
}
