import { ArrowRight, Lightbulb } from "lucide-react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import { getBestVisitMonths, getPeakMonths } from "@/lib/recommendation";

export default function InsightPanel({ data }) {
  const best = getBestVisitMonths(data, 1)[0];
  const peak = getPeakMonths(data, 1)[0];

  return (
    <Card className="flex h-full flex-col p-5 sm:p-6">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-50 text-amber-600">
        <Lightbulb size={20} />
      </span>
      <h2 className="mt-5 text-sm font-bold text-slate-900">Research Insight</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Berdasarkan rata-rata data, <strong>{best.bulan}</strong> merupakan periode
        paling tenang, sedangkan <strong>{peak.bulan}</strong> memiliki intensitas
        kunjungan tertinggi.
      </p>
      <div className="mt-5 rounded-xl bg-slate-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Fokus Analisis
        </p>
        <p className="mt-2 text-sm text-slate-700">
          K-Means mengelompokkan pola menjadi Sepi, Sedang, dan Ramai.
        </p>
      </div>
      <div className="mt-3 rounded-xl border border-slate-100 p-4">
        <p className="text-xs font-semibold text-slate-800">Interpretasi sementara</p>
        <p className="mt-1 text-xs leading-5 text-slate-500">
          Periode kunjungan rendah memberi peluang rekomendasi wisata yang lebih
          nyaman dan pemerataan kepadatan destinasi.
        </p>
      </div>
      <Link href="/recommendations" className="mt-auto flex items-center gap-2 pt-6 text-sm font-semibold text-blue-600">
        Lihat rekomendasi <ArrowRight size={16} />
      </Link>
    </Card>
  );
}
