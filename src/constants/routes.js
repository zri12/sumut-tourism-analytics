import {
  ChartNoAxesCombined,
  Database,
  FlaskConical,
  LayoutDashboard,
  Lightbulb,
} from "lucide-react";

export const ROUTES = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Dataset", href: "/dataset", icon: Database },
  { label: "Clustering", href: "/clustering", icon: FlaskConical },
  { label: "Results", href: "/results", icon: ChartNoAxesCombined },
  { label: "Recommendations", href: "/recommendations", icon: Lightbulb },
];
