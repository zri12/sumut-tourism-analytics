import { Table, TableCell, TableHead, TableHeader } from "@/components/ui/Table";
import { formatBoolean, formatNumber } from "@/utils/formatter";

export default function DatasetTable({ data }) {
  return (
    <Table>
      <TableHead>
        <tr>
          <TableHeader>No.</TableHeader>
          <TableHeader>Kabupaten/Kota</TableHeader>
          <TableHeader>Destinasi</TableHeader>
          <TableHeader>Tahun</TableHeader>
          <TableHeader>Bulan</TableHeader>
          <TableHeader>Kunjungan</TableHeader>
          <TableHeader>Musim Libur</TableHeader>
          <TableHeader>Hari Libur Nasional</TableHeader>
        </tr>
      </TableHead>
      <tbody className="divide-y divide-slate-100">
        {data.map((item) => (
          <tr key={item.id} className="hover:bg-slate-50/70">
            <TableCell>{item.id}</TableCell>
            <TableCell className="font-medium text-slate-800">{item.kabupaten_kota}</TableCell>
            <TableCell>{item.destinasi_wisata}</TableCell>
            <TableCell>{item.tahun}</TableCell>
            <TableCell>{item.bulan}</TableCell>
            <TableCell className="font-semibold text-slate-800">{formatNumber(item.jumlah_kunjungan)}</TableCell>
            <TableCell>{formatBoolean(item.musim_libur)}</TableCell>
            <TableCell>{formatNumber(item.libur_nasional)}</TableCell>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
