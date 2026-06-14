import { AlertTriangle, CalendarCheck2, CalendarClock } from "lucide-react";
import Card from "@/components/ui/Card";
import { formatNumber } from "@/utils/formatter";

export default function RecommendationCard({ title, description, months, type }) {
  const Icon = type === "best" ? CalendarCheck2 : type === "peak" ? AlertTriangle : CalendarClock;
  const tone = type === "best" ? "bg-emerald-50 text-emerald-600" : type === "peak" ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-blue-600";
  return (
    <Card className="p-5 sm:p-6">
      <span className={`grid h-10 w-10 place-items-center rounded-xl ${tone}`}>
        <Icon size={19} />
      </span>
      <h2 className="mt-5 font-bold text-slate-900">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
      <div className="mt-5 space-y-2">
        {months.map((item, index) => (
          <div key={item.bulan} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
            <span className="text-sm font-semibold text-slate-800">{index + 1}. {item.bulan}</span>
            <span className="text-xs text-slate-500">{formatNumber(Math.round(item.average))} rata-rata</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
