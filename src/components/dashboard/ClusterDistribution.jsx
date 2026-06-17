"use client";

import { useEffect, useState } from "react";
import { Cell, Pie, PieChart, Tooltip } from "recharts";
import Card from "@/components/ui/Card";
import ChartFrame from "@/components/ui/ChartFrame";
import { CLUSTERS } from "@/constants/clusters";

export default function ClusterDistribution({ data }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className="p-5 sm:p-6">
      <h2 className="text-sm font-bold text-slate-900">Cluster Distribution</h2>
      <p className="mt-1 text-xs text-slate-500">{total} records classified</p>
      <div className="relative mt-3 h-48">
        {mounted ? (
          <ChartFrame className="h-48 w-full">
            {({ width, height }) => (
            <PieChart width={width} height={height}>
              <Pie data={data} dataKey="value" nameKey="name" innerRadius={52} outerRadius={74} paddingAngle={4}>
                {data.map((item) => <Cell key={item.name} fill={CLUSTERS[item.name].color} />)}
              </Pie>
              <Tooltip formatter={(value) => [`${value} records`, "Total"]} />
            </PieChart>
            )}
          </ChartFrame>
        ) : <div className="h-full rounded-xl bg-slate-50" />}
        <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
          <div><p className="text-xl font-bold text-slate-900">{total}</p><p className="text-[10px] text-slate-400">records</p></div>
        </div>
      </div>
      <div className="space-y-2">
        {data.map((item) => (
          <div key={item.name} className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-2 text-slate-600">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: CLUSTERS[item.name].color }} />
              {item.name}
            </span>
            <strong className="text-slate-900">{item.value} · {total ? Math.round(item.value / total * 100) : 0}%</strong>
          </div>
        ))}
      </div>
    </Card>
  );
}
