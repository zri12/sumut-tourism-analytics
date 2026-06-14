"use client";

import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import Card from "@/components/ui/Card";
import { formatNumber } from "@/utils/formatter";

export default function RecommendationTrendChart({ data }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    <Card className="p-5 sm:p-6">
      <h2 className="text-sm font-bold text-slate-900">Monthly Visit Trend</h2>
      <p className="mt-1 text-xs text-slate-500">Pola kunjungan sebagai dasar rekomendasi waktu.</p>
      <div className="mt-5 h-64">
        {mounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ left: -15, right: 8 }}>
              <defs><linearGradient id="recommendationTrend" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2563EB" stopOpacity={0.2} /><stop offset="100%" stopColor="#2563EB" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="bulan" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#6B7280" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#6B7280" }} />
              <Tooltip formatter={(value) => [`${formatNumber(value)} kunjungan`, "Total"]} />
              <Area type="monotone" dataKey="jumlah_kunjungan" stroke="#2563EB" strokeWidth={2.5} fill="url(#recommendationTrend)" />
            </AreaChart>
          </ResponsiveContainer>
        ) : <div className="h-full rounded-xl bg-slate-50" />}
      </div>
    </Card>
  );
}
