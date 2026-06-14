import { Compass, MapPin, TicketCheck } from "lucide-react";
import Card from "@/components/ui/Card";

export default function TourismInsight() {
  const items = [
    { title: "Datang lebih awal", note: "Pilih jam operasional awal pada periode ramai.", icon: TicketCheck },
    { title: "Eksplorasi alternatif", note: "Destinasi cluster Sepi membantu pemerataan kunjungan.", icon: Compass },
    { title: "Periksa musim libur", note: "Hari libur meningkatkan potensi kepadatan destinasi.", icon: MapPin },
  ];
  return (
    <Card className="p-5 sm:p-6">
      <h2 className="text-sm font-bold text-slate-900">Tourism Insight</h2>
      <p className="mt-1 text-xs text-slate-500">Pertimbangan praktis bagi calon wisatawan.</p>
      <div className="mt-5 space-y-4">
        {items.map(({ title, note, icon: Icon }) => (
          <div key={title} className="flex gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-600"><Icon size={16} /></span>
            <div><p className="text-sm font-semibold text-slate-800">{title}</p><p className="mt-1 text-xs leading-5 text-slate-500">{note}</p></div>
          </div>
        ))}
      </div>
    </Card>
  );
}
