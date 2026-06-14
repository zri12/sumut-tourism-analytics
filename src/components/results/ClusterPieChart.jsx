"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import { CLUSTERS } from "@/constants/clusters";

export default function ClusterPieChart({ data }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <Card className="p-5 sm:p-6">
      <h2 className="font-bold text-slate-900">Distribusi Cluster</h2>
      <p className="mt-1 text-sm text-slate-500">Proporsi data pada setiap kategori.</p>
      <div className="mt-4 h-64">
        {mounted ? <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={58} outerRadius={88} paddingAngle={3}>
              {data.map((item) => <Cell key={item.name} fill={CLUSTERS[item.name].color} />)}
            </Pie>
            <Tooltip formatter={(value) => [`${value} data`, "Jumlah"]} />
          </PieChart>
        </ResponsiveContainer> : <div className="h-full w-full rounded-xl bg-slate-50" />}
      </div>
      <div className="flex flex-wrap justify-center gap-4">
        {data.map((item) => (
          <span key={item.name} className="flex items-center gap-2 text-xs font-medium text-slate-600">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: CLUSTERS[item.name].color }} />
            {item.name} ({item.value})
          </span>
        ))}
      </div>
    </Card>
  );
}
