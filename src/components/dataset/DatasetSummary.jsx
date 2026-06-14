import { CalendarRange, Database, MapPinned } from "lucide-react";
import Card from "@/components/ui/Card";

export default function DatasetSummary({ data, total }) {
  const destinations = new Set(data.map((item) => item.destinasi_wisata)).size;
  const years = new Set(data.map((item) => item.tahun)).size;

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {[
        { label: "Total Records", value: total, note: `${data.length} sesuai filter`, icon: Database },
        { label: "Total Destinations", value: destinations, note: "Destinasi unik", icon: MapPinned },
        { label: "Total Years", value: years, note: "Periode pengamatan", icon: CalendarRange },
      ].map(({ label, value, note, icon: Icon }) => (
        <Card key={label} className="flex items-center gap-4 p-4">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-600"><Icon size={18} /></span>
          <div>
            <p className="text-xs font-medium text-slate-500">{label}</p>
            <p className="mt-1 text-lg font-bold text-slate-900">{value}</p>
            <p className="mt-0.5 text-[11px] text-slate-400">{note}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}
