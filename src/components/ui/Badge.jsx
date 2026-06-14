import { CLUSTERS } from "@/constants/clusters";

export default function Badge({ children, variant }) {
  const style = CLUSTERS[variant]?.badge || "bg-slate-50 text-slate-700 ring-slate-200";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${style}`}
    >
      {CLUSTERS[variant] && (
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: CLUSTERS[variant].color }}
        />
      )}
      {children}
    </span>
  );
}
