export function Table({ children }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] text-left text-sm">{children}</table>
    </div>
  );
}

export function TableHead({ children }) {
  return (
    <thead className="border-y border-slate-200 bg-slate-50/80 text-xs uppercase tracking-wide text-slate-500">
      {children}
    </thead>
  );
}

export function TableHeader({ children }) {
  return <th className="whitespace-nowrap px-5 py-3.5 font-semibold">{children}</th>;
}

export function TableCell({ children, className = "" }) {
  return <td className={`px-5 py-4 text-slate-600 ${className}`}>{children}</td>;
}
