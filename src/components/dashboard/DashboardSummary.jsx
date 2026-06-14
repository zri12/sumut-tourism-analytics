import { Database, MapPinned, Map, Boxes } from "lucide-react";
import StatisticCard from "./StatisticCard";
import {
  getTotalDestinations,
  getTotalRegions,
  getTotalVisits,
} from "@/lib/statistics";
import { formatCompactNumber, formatNumber } from "@/utils/formatter";

export default function DashboardSummary({ data }) {
  const cards = [
    {
      label: "Total Destinasi",
      value: getTotalDestinations(data),
      note: "Destinasi unik dalam dataset",
      icon: MapPinned,
    },
    {
      label: "Total Kunjungan",
      value: formatCompactNumber(getTotalVisits(data)),
      note: `${formatNumber(getTotalVisits(data))} kunjungan`,
      icon: Database,
    },
    {
      label: "Kabupaten/Kota",
      value: getTotalRegions(data),
      note: "Wilayah Sumatera Utara",
      icon: Map,
    },
    {
      label: "Jumlah Cluster",
      value: 3,
      note: "Sepi, Sedang, dan Ramai",
      icon: Boxes,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => <StatisticCard key={card.label} {...card} />)}
    </div>
  );
}
