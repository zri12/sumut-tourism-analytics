import { NextResponse } from "next/server";
import { getAdminFromRequest } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { fetchTourismRows } from "@/lib/tourismData";

export async function GET() {
  const admin = await getAdminFromRequest();
  if (!admin) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
  if (!supabaseAdmin) {
    return NextResponse.json({ success: false, message: "Konfigurasi Supabase admin belum lengkap." }, { status: 500 });
  }

  const { count, error: countError } = await supabaseAdmin
    .from("tourism_data")
    .select("id", { count: "exact", head: true });

  if (countError) {
    return NextResponse.json({ success: false, message: countError.message }, { status: 500 });
  }

  const { data, error } = await fetchTourismRows(
    supabaseAdmin,
    (query) => query,
    "kabupaten_kota,destinasi_wisata,jumlah_kunjungan",
  );

  if (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    summary: {
      records: count || 0,
      destinations: new Set(data.map((item) => item.destinasi_wisata).filter(Boolean)).size,
      regions: new Set(data.map((item) => item.kabupaten_kota).filter(Boolean)).size,
      visits: data.reduce((sum, item) => sum + Number(item.jumlah_kunjungan || 0), 0),
    },
  });
}
