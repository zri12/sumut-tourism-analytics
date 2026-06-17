export default function AdminStatCard({ label, value, icon: Icon }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-card">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
        </div>
        {Icon ? (
          <span className="grid h-11 w-11 place-items-center rounded-lg bg-blue-50 text-blue-600">
            <Icon size={20} />
          </span>
        ) : null}
      </div>
    </div>
  );
}
