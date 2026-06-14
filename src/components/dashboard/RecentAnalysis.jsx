import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import { Table, TableCell, TableHead, TableHeader } from "@/components/ui/Table";
import { formatNumber } from "@/utils/formatter";

export default function RecentAnalysis({ data }) {
  const recent = [...data].sort((a, b) => b.jumlah_kunjungan - a.jumlah_kunjungan).slice(0, 5);
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between p-5 sm:px-6">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Recent Analysis</h2>
          <p className="mt-1 text-xs text-slate-500">Observasi kunjungan tertinggi pada dataset</p>
        </div>
        <Link href="/results" className="flex items-center gap-1.5 text-xs font-semibold text-blue-600">
          View results <ArrowRight size={14} />
        </Link>
      </div>
      <Table>
        <TableHead><tr><TableHeader>Destination</TableHeader><TableHeader>Month</TableHeader><TableHeader>Visitors</TableHeader><TableHeader>Cluster</TableHeader></tr></TableHead>
        <tbody className="divide-y divide-slate-100">
          {recent.map((item) => (
            <tr key={item.id} className="hover:bg-slate-50">
              <TableCell className="font-semibold text-slate-800">
                {item.destinasi_wisata}<span className="mt-0.5 block text-xs font-normal text-slate-400">{item.kabupaten_kota}</span>
              </TableCell>
              <TableCell>{item.bulan} {item.tahun}</TableCell>
              <TableCell className="font-semibold text-slate-800">{formatNumber(item.jumlah_kunjungan)}</TableCell>
              <TableCell><Badge variant={item.cluster_label}>{item.cluster_label}</Badge></TableCell>
            </tr>
          ))}
        </tbody>
      </Table>
    </Card>
  );
}
