"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { Table, TableCell, TableHead, TableHeader } from "@/components/ui/Table";
import { formatNumber } from "@/utils/formatter";

export default function ClusterResultTable({ data }) {
  const pageSize = 20;
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paged = data.slice((safePage - 1) * pageSize, safePage * pageSize);

  return (
    <>
      <Table>
        <TableHead>
          <tr>
            <TableHeader>Destinasi</TableHeader>
            <TableHeader>Wilayah</TableHeader>
            <TableHeader>Periode</TableHeader>
            <TableHeader>Kunjungan</TableHeader>
            <TableHeader>Cluster</TableHeader>
          </tr>
        </TableHead>
        <tbody className="divide-y divide-slate-100">
          {paged.map((item) => (
            <tr key={item.id} className="hover:bg-slate-50/70">
              <TableCell className="font-medium text-slate-800">{item.destinasi_wisata}</TableCell>
              <TableCell>{item.kabupaten_kota}</TableCell>
              <TableCell>{item.bulan} {item.tahun}</TableCell>
              <TableCell className="font-semibold text-slate-800">{formatNumber(item.jumlah_kunjungan)}</TableCell>
              <TableCell><Badge variant={item.cluster_label}>{item.cluster_label}</Badge></TableCell>
            </tr>
          ))}
        </tbody>
      </Table>
      <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-slate-500">
          Showing {(safePage - 1) * pageSize + 1}–{Math.min(safePage * pageSize, data.length)} of {data.length}
        </p>
        <div className="flex items-center gap-2">
          <Button variant="secondary" className="h-9 px-3" disabled={safePage === 1} onClick={() => setPage((value) => value - 1)}>
            <ChevronLeft size={15} /> Previous
          </Button>
          <span className="px-2 text-xs font-semibold text-slate-600">{safePage} / {totalPages}</span>
          <Button variant="secondary" className="h-9 px-3" disabled={safePage === totalPages} onClick={() => setPage((value) => value + 1)}>
            Next <ChevronRight size={15} />
          </Button>
        </div>
      </div>
    </>
  );
}
