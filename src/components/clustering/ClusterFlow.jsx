import { ArrowRight, BrainCircuit, Database, SlidersHorizontal, TableProperties } from "lucide-react";
import Card from "@/components/ui/Card";

export default function ClusterFlow() {
  const steps = [
    { label: "Dataset", note: "Data kunjungan", icon: Database },
    { label: "Preprocessing", note: "Normalisasi fitur", icon: SlidersHorizontal },
    { label: "K-Means", note: "Iterasi centroid", icon: BrainCircuit },
    { label: "Hasil", note: "Label cluster", icon: TableProperties },
  ];

  return (
    <Card className="p-5 sm:p-6">
      <h2 className="font-bold text-slate-900">Alur Pengolahan Data</h2>
      <p className="mt-1 text-sm text-slate-500">Tahapan utama analisis clustering.</p>
      <div className="mt-6 grid gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] md:items-center">
        {steps.map(({ label, note, icon: Icon }, index) => (
          <div className="contents" key={label}>
            <div className="rounded-2xl border border-slate-200 p-4 text-center">
              <span className="mx-auto grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-600"><Icon size={19} /></span>
              <p className="mt-3 text-sm font-bold text-slate-900">{label}</p>
              <p className="mt-1 text-xs text-slate-500">{note}</p>
            </div>
            {index < steps.length - 1 && <ArrowRight className="mx-auto rotate-90 text-slate-300 md:rotate-0" size={19} />}
          </div>
        ))}
      </div>
    </Card>
  );
}
