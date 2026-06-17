"use client";

import { Bar, BarChart, CartesianGrid, Cell, Tooltip, XAxis, YAxis } from "recharts";
import Card from "@/components/ui/Card";
import ChartFrame from "@/components/ui/ChartFrame";
import { CLUSTERS } from "@/constants/clusters";

export default function ClusterBarChart({ data }) {
  return (
    <Card className="p-5 sm:p-6">
      <h2 className="font-bold text-slate-900">Jumlah Data per Cluster</h2>
      <p className="mt-1 text-sm text-slate-500">Perbandingan jumlah anggota setiap kelompok.</p>
      <ChartFrame className="mt-4 h-72 w-full">
        {({ width, height }) => (
          <BarChart width={width} height={height} data={data} margin={{ left: -22, right: 8 }}>
            <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#E5E7EB" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#64748B", fontSize: 12 }} />
            <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: "#64748B", fontSize: 12 }} />
            <Tooltip formatter={(value) => [`${value} data`, "Jumlah"]} />
            <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={70}>
              {data.map((item) => <Cell key={item.name} fill={CLUSTERS[item.name].color} />)}
            </Bar>
          </BarChart>
        )}
      </ChartFrame>
    </Card>
  );
}
