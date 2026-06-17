"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Database, MapPin, Navigation, Users } from "lucide-react";
import AdminNavbar from "@/components/admin/AdminNavbar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminStatCard from "@/components/admin/AdminStatCard";
import Card from "@/components/ui/Card";
import { formatNumber } from "@/utils/formatter";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [summary, setSummary] = useState({
    records: 0,
    destinations: 0,
    regions: 0,
    visits: 0,
  });
  const [loading, setLoading] = useState(true);

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
  };

  useEffect(() => {
    async function load() {
      const session = await fetch("/api/admin/me");
      if (!session.ok) {
        router.replace("/admin/login");
        return;
      }
      const response = await fetch("/api/admin/tourism/summary");
      const result = await response.json();
      setSummary(result.summary || { records: 0, destinations: 0, regions: 0, visits: 0 });
      setLoading(false);
    }
    load();
  }, [router]);

  return (
    <div className="bg-slate-50">
      <AdminNavbar title="Dashboard Admin" onLogout={logout} />
      <div className="lg:flex">
        <AdminSidebar />
        <main className="min-h-[calc(100vh-73px)] flex-1 p-4 sm:p-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <AdminStatCard label="Total Data Wisata" value={loading ? "..." : formatNumber(summary.records)} icon={Database} />
            <AdminStatCard label="Total Destinasi" value={loading ? "..." : formatNumber(summary.destinations)} icon={Navigation} />
            <AdminStatCard label="Total Kabupaten/Kota" value={loading ? "..." : formatNumber(summary.regions)} icon={MapPin} />
            <AdminStatCard label="Total Kunjungan" value={loading ? "..." : formatNumber(summary.visits)} icon={Users} />
          </div>
          <Card className="mt-5 p-5 sm:p-6">
            <h2 className="text-base font-bold text-slate-900">Kelola Data Wisata</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Tambah, edit, dan hapus data kunjungan wisata yang menjadi sumber analisis K-Means pada halaman publik.
            </p>
            <Link
              href="/admin/data-wisata"
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Buka Data Wisata
            </Link>
          </Card>
        </main>
      </div>
    </div>
  );
}
