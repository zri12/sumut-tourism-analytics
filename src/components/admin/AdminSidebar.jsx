"use client";

import Link from "next/link";
import { BarChart3, Database } from "lucide-react";

const items = [
  { href: "/admin/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/admin/data-wisata", label: "Data Wisata", icon: Database },
];

export default function AdminSidebar() {
  return (
    <aside className="border-b border-slate-200 bg-white p-4 lg:min-h-[calc(100vh-73px)] lg:w-64 lg:border-b-0 lg:border-r">
      <nav className="flex gap-2 overflow-x-auto lg:flex-col">
        {items.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-blue-50 hover:text-blue-700"
          >
            <Icon size={16} /> {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
