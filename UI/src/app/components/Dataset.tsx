import { useState, useMemo } from "react";
import {
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  ArrowUpDown,
  Plus,
  Table2,
} from "lucide-react";
import { t } from "./theme";

type Row = {
  id: number;
  destination: string;
  city: string;
  category: "Alam" | "Budaya" | "Pantai";
  year: number;
  jan: number; feb: number; mar: number; apr: number; may: number; jun: number;
  jul: number; aug: number; sep: number; oct: number; nov: number; dec: number;
  total: number;
};

const allData: Row[] = [
  { id: 1, destination: "Danau Toba", city: "Samosir", category: "Alam", year: 2024, jan: 4200, feb: 3800, mar: 4100, apr: 5200, may: 6800, jun: 9400, jul: 12300, aug: 11200, sep: 7400, oct: 5800, nov: 4900, dec: 8100, total: 83200 },
  { id: 2, destination: "Bukit Lawang", city: "Langkat", category: "Alam", year: 2024, jan: 2800, feb: 2400, mar: 2900, apr: 3800, may: 5200, jun: 7100, jul: 9600, aug: 8800, sep: 5600, oct: 4100, nov: 3200, dec: 5700, total: 61200 },
  { id: 3, destination: "Berastagi", city: "Karo", category: "Alam", year: 2024, jan: 3100, feb: 2900, mar: 3200, apr: 4100, may: 5400, jun: 6200, jul: 7800, aug: 7100, sep: 5200, oct: 4300, nov: 3600, dec: 5900, total: 58800 },
  { id: 4, destination: "Sipisopiso", city: "Karo", category: "Alam", year: 2024, jan: 1800, feb: 1600, mar: 1900, apr: 2400, may: 3100, jun: 3800, jul: 4900, aug: 4400, sep: 3100, oct: 2500, nov: 2100, dec: 3400, total: 35100 },
  { id: 5, destination: "Istana Maimun", city: "Medan", category: "Budaya", year: 2024, jan: 2200, feb: 2000, mar: 2300, apr: 3100, may: 3900, jun: 4500, jul: 5800, aug: 5200, sep: 3600, oct: 3000, nov: 2500, dec: 4200, total: 42300 },
  { id: 6, destination: "Pantai Cermin", city: "Serdang Bedagai", category: "Pantai", year: 2024, jan: 1200, feb: 1000, mar: 1300, apr: 1800, may: 2600, jun: 4100, jul: 6200, aug: 5800, sep: 2900, oct: 1900, nov: 1400, dec: 2800, total: 33000 },
  { id: 7, destination: "Masjid Raya Al-Mashun", city: "Medan", category: "Budaya", year: 2024, jan: 1900, feb: 1700, mar: 2100, apr: 2800, may: 3400, jun: 3900, jul: 5100, aug: 4600, sep: 3200, oct: 2700, nov: 2200, dec: 3700, total: 37400 },
  { id: 8, destination: "Vihara Gunung Timur", city: "Medan", category: "Budaya", year: 2024, jan: 1400, feb: 2800, mar: 1200, apr: 1600, may: 2000, jun: 2400, jul: 3100, aug: 2800, sep: 2000, oct: 1700, nov: 1400, dec: 2200, total: 24700 },
  { id: 9, destination: "Pulau Nias", city: "Nias", category: "Pantai", year: 2024, jan: 800, feb: 700, mar: 900, apr: 1200, may: 1800, jun: 2800, jul: 4200, aug: 3900, sep: 1900, oct: 1200, nov: 900, dec: 1800, total: 22200 },
  { id: 10, destination: "Museum Sumatera Utara", city: "Medan", category: "Budaya", year: 2024, jan: 1100, feb: 1000, mar: 1200, apr: 1600, may: 2000, jun: 2300, jul: 3000, aug: 2700, sep: 1900, oct: 1600, nov: 1300, dec: 2100, total: 21800 },
  { id: 11, destination: "Air Terjun Sipiso-piso", city: "Karo", category: "Alam", year: 2023, jan: 1600, feb: 1400, mar: 1700, apr: 2200, may: 2800, jun: 3400, jul: 4400, aug: 4000, sep: 2800, oct: 2200, nov: 1800, dec: 3000, total: 31400 },
  { id: 12, destination: "Pantai Sialang Buah", city: "Langkat", category: "Pantai", year: 2023, jan: 900, feb: 800, mar: 1000, apr: 1300, may: 2000, jun: 3100, jul: 4600, aug: 4300, sep: 2100, oct: 1300, nov: 1000, dec: 2000, total: 24400 },
];

const months = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"] as const;
const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const catColor: Record<Row["category"], string> = { Alam: "#0D9488", Budaya: "#D97706", Pantai: "#2563EB" };

const cities = ["All Cities", "Medan", "Samosir", "Langkat", "Karo", "Serdang Bedagai", "Nias"];
const years = ["All Years", "2024", "2023"];
const categories = ["All Categories", "Alam", "Budaya", "Pantai"];

const PAGE_SIZE = 8;

function FilterSelect({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        height: 36,
        background: t.surface,
        border: `1px solid ${t.border}`,
        borderRadius: 10,
        padding: "0 30px 0 12px",
        fontSize: 13,
        color: t.text,
        outline: "none",
        cursor: "pointer",
        fontFamily: t.font,
        appearance: "none",
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2'><polyline points='6 9 12 15 18 9'/></svg>\")",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 9px center",
      }}
    >
      {options.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  );
}

export function Dataset() {
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("All Cities");
  const [year, setYear] = useState("All Years");
  const [category, setCategory] = useState("All Categories");
  const [sortDesc, setSortDesc] = useState(true);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const out = allData.filter((d) => {
      const s = search.toLowerCase();
      const matchSearch = d.destination.toLowerCase().includes(s) || d.city.toLowerCase().includes(s);
      const matchCity = city === "All Cities" || d.city === city;
      const matchYear = year === "All Years" || d.year.toString() === year;
      const matchCat = category === "All Categories" || d.category === category;
      return matchSearch && matchCity && matchYear && matchCat;
    });
    out.sort((a, b) => (sortDesc ? b.total - a.total : a.total - b.total));
    return out;
  }, [search, city, year, category, sortDesc]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const resetPage = () => setPage(1);

  return (
    <div
      style={{
        background: t.surface,
        border: `1px solid ${t.border}`,
        borderRadius: t.radius,
        boxShadow: t.shadowSm,
        overflow: "hidden",
      }}
    >
      {/* Toolbar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          padding: "14px 20px",
          borderBottom: `1px solid ${t.borderSoft}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Table2 size={16} color={t.primary} />
            <span style={{ fontSize: 14, fontWeight: 600, color: t.text }}>Tourism Visits</span>
            <span
              style={{
                fontSize: 11,
                color: t.textSecondary,
                background: t.surfaceMuted,
                border: `1px solid ${t.border}`,
                borderRadius: 999,
                padding: "2px 9px",
              }}
            >
              {filtered.length} records
            </span>
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              height: 36,
              width: 240,
              padding: "0 12px",
              borderRadius: 10,
              background: t.surfaceMuted,
              border: `1px solid ${t.border}`,
            }}
          >
            <Search size={15} color={t.textMuted} />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); resetPage(); }}
              placeholder="Search destination or region…"
              style={{ background: "transparent", border: "none", outline: "none", fontSize: 13, color: t.text, width: "100%", fontFamily: t.font }}
            />
          </div>
          <button
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              height: 36,
              padding: "0 14px",
              borderRadius: 10,
              background: t.primary,
              border: "none",
              fontSize: 13,
              fontWeight: 600,
              color: "#fff",
              cursor: "pointer",
              fontFamily: t.font,
            }}
          >
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      {/* Filter row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "12px 20px",
          borderBottom: `1px solid ${t.borderSoft}`,
          background: t.surfaceMuted,
        }}
      >
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: t.textSecondary, fontWeight: 500 }}>
          <SlidersHorizontal size={14} color={t.textMuted} /> Filters
        </span>
        <FilterSelect value={city} onChange={(v) => { setCity(v); resetPage(); }} options={cities} />
        <FilterSelect value={year} onChange={(v) => { setYear(v); resetPage(); }} options={years} />
        <FilterSelect value={category} onChange={(v) => { setCategory(v); resetPage(); }} options={categories} />
        <button
          onClick={() => setSortDesc((s) => !s)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            height: 36,
            padding: "0 12px",
            borderRadius: 10,
            background: t.surface,
            border: `1px solid ${t.border}`,
            fontSize: 13,
            color: t.text,
            cursor: "pointer",
            fontFamily: t.font,
          }}
        >
          <ArrowUpDown size={14} color={t.textMuted} />
          Total {sortDesc ? "↓" : "↑"}
        </button>
        <button
          style={{
            marginLeft: "auto",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            height: 36,
            padding: "0 12px",
            borderRadius: 10,
            background: t.surface,
            border: `1px solid ${t.border}`,
            fontSize: 13,
            color: t.textSecondary,
            cursor: "pointer",
            fontFamily: t.font,
          }}
        >
          <Plus size={14} /> Add record
        </button>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 1000 }}>
          <thead>
            <tr>
              {[
                { label: "Destination", align: "left", sticky: true },
                { label: "Region", align: "left" },
                { label: "Category", align: "left" },
                { label: "Year", align: "left" },
                ...monthNames.map((m) => ({ label: m, align: "right" as const })),
                { label: "Total", align: "right" },
              ].map((col, i) => (
                <th
                  key={i}
                  style={{
                    textAlign: col.align as any,
                    padding: "10px 16px",
                    fontSize: 11,
                    fontWeight: 600,
                    color: t.textMuted,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    background: t.surfaceMuted,
                    borderBottom: `1px solid ${t.border}`,
                    whiteSpace: "nowrap",
                    position: (col as any).sticky ? "sticky" : undefined,
                    left: (col as any).sticky ? 0 : undefined,
                    zIndex: (col as any).sticky ? 1 : undefined,
                  }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.map((row) => {
              const peakIdx = months.reduce((best, m, idx) => (row[m] > row[months[best]] ? idx : best), 0);
              return (
                <tr
                  key={row.id}
                  style={{ borderBottom: `1px solid ${t.borderSoft}` }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = t.surfaceMuted)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <td
                    style={{
                      padding: "12px 16px",
                      fontSize: 13.5,
                      fontWeight: 600,
                      color: t.text,
                      whiteSpace: "nowrap",
                      position: "sticky",
                      left: 0,
                      background: "inherit",
                    }}
                  >
                    {row.destination}
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: t.textSecondary, whiteSpace: "nowrap" }}>{row.city}</td>
                  <td style={{ padding: "12px 16px", whiteSpace: "nowrap" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, color: t.text }}>
                      <span style={{ width: 7, height: 7, borderRadius: 2, background: catColor[row.category] }} />
                      {row.category}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: t.textSecondary }}>{row.year}</td>
                  {months.map((m, idx) => (
                    <td
                      key={m}
                      style={{
                        padding: "12px 16px",
                        textAlign: "right",
                        fontSize: 12.5,
                        color: idx === peakIdx ? t.text : t.textSecondary,
                        fontWeight: idx === peakIdx ? 700 : 400,
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {row[m].toLocaleString()}
                    </td>
                  ))}
                  <td
                    style={{
                      padding: "12px 16px",
                      textAlign: "right",
                      fontSize: 13.5,
                      fontWeight: 700,
                      color: t.text,
                      fontVariantNumeric: "tabular-nums",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {row.total.toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 20px",
          borderTop: `1px solid ${t.borderSoft}`,
        }}
      >
        <p style={{ fontSize: 12.5, color: t.textMuted }}>
          Showing {filtered.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filtered.length)} of {filtered.length}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <PageBtn disabled={safePage === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
            <ChevronLeft size={15} color={t.textSecondary} />
          </PageBtn>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              style={{
                minWidth: 32,
                height: 32,
                borderRadius: 8,
                background: p === safePage ? t.primary : t.surface,
                border: `1px solid ${p === safePage ? t.primary : t.border}`,
                color: p === safePage ? "#fff" : t.textSecondary,
                fontSize: 13,
                fontWeight: p === safePage ? 600 : 500,
                cursor: "pointer",
                fontFamily: t.font,
              }}
            >
              {p}
            </button>
          ))}
          <PageBtn disabled={safePage === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
            <ChevronRight size={15} color={t.textSecondary} />
          </PageBtn>
        </div>
      </div>
    </div>
  );
}

function PageBtn({ children, disabled, onClick }: { children: React.ReactNode; disabled?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: 32,
        height: 32,
        borderRadius: 8,
        background: t.surface,
        border: `1px solid ${t.border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.45 : 1,
      }}
    >
      {children}
    </button>
  );
}
