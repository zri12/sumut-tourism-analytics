import { Activity, Boxes, Database, FlaskConical } from "lucide-react";
import Card from "@/components/ui/Card";

export default function ResearchSummary({ totalRecords }) {
  const details = [
    { label: "Dataset", value: `${totalRecords} records`, icon: Database },
    { label: "Algorithm", value: "K-Means", icon: FlaskConical },
    { label: "Categories", value: "3 clusters", icon: Boxes },
  ];

  return (
    <Card className="p-5 sm:p-6">
      <div className="grid gap-6 lg:grid-cols-[1.7fr_repeat(3,1fr)] lg:items-center">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.12em] text-emerald-600">
            <Activity size={13} />
            Research Active
          </div>
          <h2 className="mt-3 text-base font-bold leading-6 text-slate-900">
            Data Mining Pada Pola Kunjungan Wisatawan
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
            Analisis pola kunjungan untuk rekomendasi waktu berkunjung ideal di
            destinasi Sumatera Utara.
          </p>
        </div>
        {details.map(({ label, value, icon: Icon }) => (
          <div key={label} className="border-t border-slate-100 pt-4 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              <Icon size={14} />
              {label}
            </div>
            <p className="mt-2 text-base font-bold text-slate-900">{value}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
