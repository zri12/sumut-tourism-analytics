"use client";

import { Cell, Pie, PieChart, Tooltip } from "recharts";
import Card from "@/components/ui/Card";
import ChartFrame from "@/components/ui/ChartFrame";
import { CLUSTERS } from "@/constants/clusters";

export default function ClusterPieChart({ data }) {
  return (
    <Card className="p-5 sm:p-6">
      <h2 className="font-bold text-slate-900">Distribusi Cluster</h2>
      <p className="mt-1 text-sm text-slate-500">Proporsi data pada setiap kategori.</p>
      <ChartFrame className="mt-4 h-64 w-full">
        {({ width, height }) => (
          <PieChart width={width} height={height}>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={58} outerRadius={88} paddingAngle={3}>
              {data.map((item) => <Cell key={item.name} fill={CLUSTERS[item.name].color} />)}
            </Pie>
            <Tooltip formatter={(value) => [`${value} data`, "Jumlah"]} />
          </PieChart>
        )}
      </ChartFrame>
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
