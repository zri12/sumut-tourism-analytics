"use client";

import { Check, Circle, LoaderCircle, Play, RotateCcw } from "lucide-react";
import { useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

export default function ClusteringProcess({ totalData, iterations, distribution }) {
  const [processed, setProcessed] = useState(false);
  const status = [
    { label: "Ready", note: `${totalData} records tersedia` },
    { label: "Normalization", note: "Min-Max scaling" },
    { label: "Cluster Formation", note: "K = 3 categories" },
    { label: "Result Mapping", note: "Assign cluster labels" },
  ];

  return (
    <Card className="p-5 sm:p-6">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-bold text-slate-900">Proses K-Means Clustering</h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
            Sistem menggunakan tiga fitur yang telah dinormalisasi: jumlah kunjungan,
            musim libur, dan libur nasional dengan nilai K = 3.
          </p>
        </div>
        <Button onClick={() => setProcessed((value) => !value)}>
          {processed ? <RotateCcw size={17} /> : <Play size={17} />}
          {processed ? "Ulangi Proses" : "Proses Clustering"}
        </Button>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {status.map((item, index) => {
          const complete = processed || index === 0;
          const Icon = complete ? Check : index === 1 && processed ? LoaderCircle : Circle;
          return (
            <div key={item.label} className={`rounded-xl border p-4 ${complete ? "border-blue-200 bg-blue-50/60" : "border-slate-200"}`}>
              <div className="flex items-center gap-2">
                <span className={`grid h-7 w-7 place-items-center rounded-full ${complete ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400"}`}>
                  <Icon size={14} />
                </span>
                <p className="text-sm font-semibold text-slate-800">{item.label}</p>
              </div>
              <p className="mt-2 text-xs text-slate-500">{item.note}</p>
            </div>
          );
        })}
      </div>
      {processed && (
        <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
            <Check size={15} /> Clustering selesai dalam {iterations} iterasi.
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {Object.entries(distribution).map(([label, count]) => (
              <div key={label} className="flex items-center justify-between rounded-lg bg-white px-3 py-2 ring-1 ring-emerald-100">
                <Badge variant={label}>{label}</Badge>
                <span className="text-sm font-bold text-slate-800">{count} data</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
