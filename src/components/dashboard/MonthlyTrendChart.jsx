"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Card from "@/components/ui/Card";
import ChartFrame from "@/components/ui/ChartFrame";
import { formatNumber } from "@/utils/formatter";

export default function MonthlyTrendChart({ data, title = "Monthly Visitor Trend" }) {
  return (
    <Card className="p-5 sm:p-6">
      <div className="mb-6">
        <h2 className="text-sm font-bold text-slate-900">{title}</h2>
        <p className="mt-1 text-xs text-slate-500">
          Total kunjungan bulanan dari seluruh observasi.
        </p>
      </div>
      <ChartFrame className="h-72 w-full">
        {({ width, height }) => (
          <AreaChart width={width} height={height} data={data} margin={{ left: -15, right: 8 }}>
            <defs>
              <linearGradient id="visitColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#E5E7EB" />
            <XAxis dataKey="bulan" axisLine={false} tickLine={false} tick={{ fill: "#64748B", fontSize: 12 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748B", fontSize: 12 }} />
            <Tooltip formatter={(value) => [`${formatNumber(value)} kunjungan`, "Total"]} />
            <Area type="monotone" dataKey="jumlah_kunjungan" stroke="#2563EB" strokeWidth={2.5} fill="url(#visitColor)" />
          </AreaChart>
        )}
      </ChartFrame>
    </Card>
  );
}
