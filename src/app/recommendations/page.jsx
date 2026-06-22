import { Lightbulb } from "lucide-react";
import DestinationRecommendationExplorer from "@/components/recommendations/DestinationRecommendationExplorer";
import { fetchTourismDataFromApi } from "@/lib/fetchTourismData";

export const metadata = { title: "Rekomendasi Wisata" };
export const dynamic = "force-dynamic";

export default async function RecommendationsPage() {
  const tourismData = await fetchTourismDataFromApi();

  return (
    <div className="page-shell">
      <div className="mb-7">
        <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-blue-600">
          <Lightbulb size={17} /> Rekomendasi Perjalanan
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Temukan Waktu Ideal Berkunjung
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
          Cari destinasi wisata pilihan Anda untuk mendapatkan rekomendasi bulan terbaik dan melihat
          kecocokannya untuk keluarga, solo traveling, atau perjalanan bersama teman.
        </p>
      </div>

      {tourismData.length ? (
        <DestinationRecommendationExplorer data={tourismData} />
      ) : (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">
          Dataset wisata belum tersedia. Pastikan data pada Supabase sudah berhasil dimasukkan.
        </div>
      )}
    </div>
  );
}
