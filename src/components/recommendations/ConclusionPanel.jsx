import { CircleCheckBig } from "lucide-react";
import Card from "@/components/ui/Card";

export default function ConclusionPanel({ summary }) {
  return (
    <Card className="border-blue-200 bg-blue-50/50 p-5 sm:p-6">
      <div className="flex items-start gap-4">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-600 text-white">
          <CircleCheckBig size={19} />
        </span>
        <div>
          <h2 className="font-bold text-slate-900">Kesimpulan Analisis</h2>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Berdasarkan hasil clustering, periode dengan kategori sepi hingga sedang
            dapat direkomendasikan sebagai waktu berkunjung ideal karena kepadatan
            wisatawan relatif lebih rendah. {summary}
          </p>
        </div>
      </div>
    </Card>
  );
}
