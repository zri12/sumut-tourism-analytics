"use client";

import { Edit, Trash2 } from "lucide-react";
import Button from "@/components/ui/Button";
import { formatNumber } from "@/utils/formatter";

export default function TourismTable({ data, onEdit, onDelete, startIndex = 0, loading = false }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-100 text-sm">
        <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
          <tr>
            {["No", "Kabupaten/Kota", "Destinasi Wisata", "Tahun", "Bulan", "Jumlah Kunjungan", "Musim Libur", "Libur Nasional", "Aksi"].map((header) => (
              <th key={header} className="px-4 py-3">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {data.map((item, index) => (
            <tr key={item.id} className="text-slate-700">
              <td className="px-4 py-3">{startIndex + index + 1}</td>
              <td className="px-4 py-3 font-semibold text-slate-900">{item.kabupaten_kota}</td>
              <td className="px-4 py-3">{item.destinasi_wisata}</td>
              <td className="px-4 py-3">{item.tahun}</td>
              <td className="px-4 py-3">{item.bulan}</td>
              <td className="px-4 py-3">{formatNumber(item.jumlah_kunjungan)}</td>
              <td className="px-4 py-3">{item.musim_libur}</td>
              <td className="px-4 py-3">{item.libur_nasional}</td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <Button variant="secondary" className="h-9 px-3" onClick={() => onEdit(item)}><Edit size={15} /></Button>
                  <Button variant="secondary" className="h-9 px-3 text-red-600 hover:bg-red-50" onClick={() => onDelete(item)}><Trash2 size={15} /></Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {loading ? <p className="p-8 text-center text-sm text-slate-500">Memuat data wisata...</p> : null}
      {!loading && !data.length ? <p className="p-8 text-center text-sm text-slate-500">Data wisata belum tersedia.</p> : null}
    </div>
  );
}
