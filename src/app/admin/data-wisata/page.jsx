"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search } from "lucide-react";
import AdminNavbar from "@/components/admin/AdminNavbar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import TourismForm, { emptyForm } from "@/components/admin/TourismForm";
import TourismTable from "@/components/admin/TourismTable";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";

export default function AdminTourismPage() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({ search: "", tahun: "", kabupaten_kota: "" });
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [pagination, setPagination] = useState({ page: 1, pageSize: 100, total: 0, totalPages: 1 });
  const [filterOptions, setFilterOptions] = useState({ years: [], regions: [] });
  const [loading, setLoading] = useState(true);
  const [sessionReady, setSessionReady] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const years = useMemo(() => filterOptions.years, [filterOptions.years]);
  const regions = useMemo(() => filterOptions.regions, [filterOptions.regions]);

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
  };

  useEffect(() => {
    async function checkSession() {
      const session = await fetch("/api/admin/me");
      if (!session.ok) {
        router.replace("/admin/login");
        return;
      }
      const optionsResponse = await fetch("/api/admin/tourism/options");
      if (optionsResponse.ok) {
        const optionsResult = await optionsResponse.json();
        setFilterOptions(optionsResult.filters || { years: [], regions: [] });
      }
      setSessionReady(true);
    }
    checkSession();
  }, [router]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(filters.search);
      setPagination((current) => ({ ...current, page: 1 }));
    }, 350);
    return () => window.clearTimeout(timer);
  }, [filters.search]);

  const loadData = async () => {
    if (!sessionReady) return;
    setLoading(true);
    const params = new URLSearchParams();
    Object.entries({ ...filters, search: debouncedSearch }).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    params.set("page", String(pagination.page));
    params.set("pageSize", String(pagination.pageSize));
    const response = await fetch(`/api/admin/tourism?${params.toString()}`);
    const result = await response.json();
    if (!response.ok) {
      setMessage(result.message || "Data gagal dimuat.");
      setData([]);
      setLoading(false);
      return;
    }
    setData(result.data || []);
    setPagination((current) => ({ ...current, ...(result.pagination || {}) }));
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [sessionReady, debouncedSearch, filters.tahun, filters.kabupaten_kota, pagination.page, pagination.pageSize]);

  const updateFilter = (nextFilters) => {
    setFilters(nextFilters);
    setPagination((current) => ({ ...current, page: 1 }));
  };

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setErrors({});
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm(item);
    setErrors({});
    setModalOpen(true);
  };

  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setErrors({});
    setMessage("");

    const response = await fetch(editing ? `/api/admin/tourism/${editing.id}` : "/api/admin/tourism", {
      method: editing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const result = await response.json();
    setSubmitting(false);

    if (!response.ok) {
      setErrors(result.errors || {});
      setMessage(result.message || "Data gagal disimpan.");
      return;
    }

    setModalOpen(false);
    setMessage(editing ? "Data berhasil diperbarui." : "Data berhasil ditambahkan.");
    await loadData();
  };

  const remove = async (item) => {
    if (!window.confirm(`Hapus data ${item.destinasi_wisata}?`)) return;
    const response = await fetch(`/api/admin/tourism/${item.id}`, { method: "DELETE" });
    const result = await response.json();
    setMessage(result.message || (response.ok ? "Data berhasil dihapus." : "Data gagal dihapus."));
    if (response.ok) await loadData();
  };

  return (
    <div className="bg-slate-50">
      <AdminNavbar title="Data Wisata" onLogout={logout} />
      <div className="lg:flex">
        <AdminSidebar />
        <main className="min-h-[calc(100vh-73px)] flex-1 p-4 sm:p-6">
          <Card className="overflow-hidden">
            <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-lg font-bold text-slate-900">Kelola Data Wisata</h1>
                <p className="mt-1 text-sm text-slate-500">Data ini dipakai oleh dashboard publik, clustering, hasil, dan rekomendasi.</p>
              </div>
              <Button onClick={openCreate}><Plus size={16} /> Tambah Data</Button>
            </div>
            <div className="grid gap-3 border-b border-slate-100 p-5 md:grid-cols-[minmax(0,1fr)_180px_240px]">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-3 text-slate-400" size={16} />
                <Input className="pl-9" placeholder="Cari kabupaten atau destinasi" value={filters.search} onChange={(event) => setFilters({ ...filters, search: event.target.value })} />
              </div>
              <select className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none" value={filters.tahun} onChange={(event) => updateFilter({ ...filters, tahun: event.target.value })}>
                <option value="">Semua Tahun</option>
                {years.map((year) => <option key={year} value={year}>{year}</option>)}
              </select>
              <select className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none" value={filters.kabupaten_kota} onChange={(event) => updateFilter({ ...filters, kabupaten_kota: event.target.value })}>
                <option value="">Semua Kabupaten/Kota</option>
                {regions.map((region) => <option key={region} value={region}>{region}</option>)}
              </select>
            </div>
            {message ? <p className="border-b border-slate-100 px-5 py-3 text-sm text-slate-600">{message}</p> : null}
            <TourismTable
              data={data}
              onEdit={openEdit}
              onDelete={remove}
              loading={loading}
              startIndex={(pagination.page - 1) * pagination.pageSize}
            />
            <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-slate-500">
                Menampilkan {pagination.total ? (pagination.page - 1) * pagination.pageSize + 1 : 0}
                -{Math.min(pagination.page * pagination.pageSize, pagination.total)} dari {pagination.total} data
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <select
                  className="h-9 rounded-lg border border-slate-200 bg-white px-2 text-xs font-semibold text-slate-600 outline-none"
                  value={pagination.pageSize}
                  onChange={(event) => setPagination({ page: 1, pageSize: Number(event.target.value), total: pagination.total, totalPages: pagination.totalPages })}
                >
                  {[50, 100, 200, 500].map((size) => <option key={size} value={size}>{size} / halaman</option>)}
                </select>
                <Button
                  variant="secondary"
                  className="h-9 px-3"
                  disabled={loading || pagination.page <= 1}
                  onClick={() => setPagination((current) => ({ ...current, page: current.page - 1 }))}
                >
                  Sebelumnya
                </Button>
                <span className="px-2 text-xs font-semibold text-slate-600">
                  {pagination.page} / {pagination.totalPages}
                </span>
                <Button
                  variant="secondary"
                  className="h-9 px-3"
                  disabled={loading || pagination.page >= pagination.totalPages}
                  onClick={() => setPagination((current) => ({ ...current, page: current.page + 1 }))}
                >
                  Selanjutnya
                </Button>
              </div>
            </div>
          </Card>
        </main>
      </div>

      {modalOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/40 px-4 py-6">
          <div className="w-full max-w-3xl rounded-lg bg-white p-5 shadow-xl sm:p-6">
            <div className="mb-5">
              <h2 className="text-base font-bold text-slate-900">{editing ? "Edit Data Wisata" : "Tambah Data Wisata"}</h2>
              <p className="mt-1 text-sm text-slate-500">Pastikan nilai angka dan pilihan 0/1 sudah sesuai.</p>
            </div>
            {message && Object.keys(errors).length ? <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{message}</p> : null}
            <TourismForm
              form={form}
              setForm={setForm}
              errors={errors}
              onCancel={() => setModalOpen(false)}
              onSubmit={submit}
              submitting={submitting}
              mode={editing ? "Update" : "Tambah"}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
