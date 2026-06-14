"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Table2 } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import DatasetFilter from "./DatasetFilter";
import DatasetSummary from "./DatasetSummary";
import DatasetTable from "./DatasetTable";

export default function DatasetExplorer({ data }) {
  const pageSize = 8;
  const [search, setSearch] = useState("");
  const [year, setYear] = useState("");
  const [region, setRegion] = useState("");
  const [page, setPage] = useState(1);
  const years = [...new Set(data.map((item) => item.tahun))].sort().reverse();
  const regions = [...new Set(data.map((item) => item.kabupaten_kota))].sort();

  const filtered = useMemo(() => {
    const query = search.toLowerCase();
    return data.filter((item) => {
      const matchesSearch =
        item.destinasi_wisata.toLowerCase().includes(query) ||
        item.kabupaten_kota.toLowerCase().includes(query);
      return (
        matchesSearch &&
        (!year || String(item.tahun) === year) &&
        (!region || item.kabupaten_kota === region)
      );
    });
  }, [data, search, year, region]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);
  const filterProps = {
    search,
    setSearch: (value) => { setSearch(value); setPage(1); },
    year,
    setYear: (value) => { setYear(value); setPage(1); },
    region,
    setRegion: (value) => { setRegion(value); setPage(1); },
    years,
    regions,
  };

  return (
    <div className="space-y-5">
      <DatasetSummary data={filtered} total={data.length} />
      <Card className="overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:p-6">
          <div className="flex items-center gap-2">
            <Table2 size={17} className="text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900">Tourism Visit Records</h2>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] text-slate-500">{filtered.length} records</span>
          </div>
          <DatasetFilter {...filterProps} />
        </div>
        <DatasetTable data={paged} />
        {!filtered.length && (
          <p className="p-10 text-center text-sm text-slate-500">Data tidak ditemukan.</p>
        )}
        <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">
            Showing {filtered.length ? (safePage - 1) * pageSize + 1 : 0}–{Math.min(safePage * pageSize, filtered.length)} of {filtered.length}
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
      </Card>
    </div>
  );
}
