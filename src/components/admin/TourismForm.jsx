"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { MONTH_ORDER } from "@/lib/tourismData";

const emptyForm = {
  kabupaten_kota: "",
  destinasi_wisata: "",
  tahun: new Date().getFullYear(),
  bulan: "Januari",
  jumlah_kunjungan: 0,
  musim_libur: 0,
  libur_nasional: 0,
};

export { emptyForm };

export default function TourismForm({ form, setForm, errors = {}, onCancel, onSubmit, submitting, mode = "Tambah" }) {
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Kabupaten/Kota" error={errors.kabupaten_kota}>
          <Input value={form.kabupaten_kota} onChange={(event) => update("kabupaten_kota", event.target.value)} />
        </Field>
        <Field label="Destinasi Wisata" error={errors.destinasi_wisata}>
          <Input value={form.destinasi_wisata} onChange={(event) => update("destinasi_wisata", event.target.value)} />
        </Field>
        <Field label="Tahun" error={errors.tahun}>
          <Input type="number" value={form.tahun} onChange={(event) => update("tahun", event.target.value)} />
        </Field>
        <Field label="Bulan" error={errors.bulan}>
          <select
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
            value={form.bulan}
            onChange={(event) => update("bulan", event.target.value)}
          >
            {MONTH_ORDER.map((month) => <option key={month}>{month}</option>)}
          </select>
        </Field>
        <Field label="Jumlah Kunjungan" error={errors.jumlah_kunjungan}>
          <Input type="number" min="0" value={form.jumlah_kunjungan} onChange={(event) => update("jumlah_kunjungan", event.target.value)} />
        </Field>
        <Field label="Musim Libur" error={errors.musim_libur}>
          <select className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none" value={form.musim_libur} onChange={(event) => update("musim_libur", event.target.value)}>
            <option value={0}>0 - Tidak</option>
            <option value={1}>1 - Ya</option>
          </select>
        </Field>
        <Field label="Jumlah Hari Libur Nasional" error={errors.libur_nasional}>
          <Input type="number" min="0" value={form.libur_nasional} onChange={(event) => update("libur_nasional", event.target.value)} />
        </Field>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Batal</Button>
        <Button type="submit" disabled={submitting}>{submitting ? "Menyimpan..." : `${mode} Data`}</Button>
      </div>
    </form>
  );
}

function Field({ label, error, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-slate-600">{label}</span>
      {children}
      {error ? <span className="mt-1 block text-xs text-red-600">{error}</span> : null}
    </label>
  );
}
