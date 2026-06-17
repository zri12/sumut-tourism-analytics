"use client";

import { LogOut } from "lucide-react";
import Button from "@/components/ui/Button";

export default function AdminNavbar({ title = "Admin", onLogout }) {
  return (
    <div className="flex flex-col gap-3 border-b border-slate-200 bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">SumutCluster Admin</p>
        <h1 className="text-xl font-bold text-slate-900">{title}</h1>
      </div>
      <Button variant="secondary" onClick={onLogout} className="h-10">
        <LogOut size={16} /> Logout
      </Button>
    </div>
  );
}
