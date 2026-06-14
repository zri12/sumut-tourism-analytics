import Card from "@/components/ui/Card";
import { CLUSTERS } from "@/constants/clusters";

export default function ClusterCategoryCard({ label, index }) {
  const cluster = CLUSTERS[label];
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: cluster.color }} />
        <h3 className="font-bold text-slate-900">Cluster {label}</h3>
        </div>
        <span className="text-xs font-semibold text-slate-400">C{index}</span>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-500">{cluster.description}.</p>
    </Card>
  );
}
