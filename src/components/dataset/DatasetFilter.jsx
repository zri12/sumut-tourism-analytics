import { Search } from "lucide-react";
import Input from "@/components/ui/Input";

export default function DatasetFilter({
  search,
  setSearch,
  year,
  setYear,
  region,
  setRegion,
  years,
  regions,
}) {
  const selectClass =
    "h-11 rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50";

  return (
    <div className="grid gap-3 lg:grid-cols-[1fr_180px_240px]">
      <label className="relative">
        <span className="sr-only">Cari dataset</span>
        <Search className="absolute left-3.5 top-3.5 text-slate-400" size={17} />
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Cari destinasi atau wilayah..."
          className="pl-10"
        />
      </label>
      <select aria-label="Filter tahun" value={year} onChange={(event) => setYear(event.target.value)} className={selectClass}>
        <option value="">Semua tahun</option>
        {years.map((item) => <option key={item}>{item}</option>)}
      </select>
      <select aria-label="Filter kabupaten atau kota" value={region} onChange={(event) => setRegion(event.target.value)} className={selectClass}>
        <option value="">Semua kabupaten/kota</option>
        {regions.map((item) => <option key={item}>{item}</option>)}
      </select>
    </div>
  );
}
