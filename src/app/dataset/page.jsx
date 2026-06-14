import { Database } from "lucide-react";
import DatasetExplorer from "@/components/dataset/DatasetExplorer";
import tourismData from "@/data/tourism.json";

export const metadata = { title: "Dataset" };

export default function DatasetPage() {
  return (
    <div className="page-shell">
      <div className="mb-7">
        <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-blue-600">
          <Database size={17} /> Sumber Data
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dataset Wisatawan</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Data contoh kunjungan destinasi wisata Sumatera Utara yang digunakan pada proses clustering.
        </p>
      </div>
      <DatasetExplorer data={tourismData} />
    </div>
  );
}
