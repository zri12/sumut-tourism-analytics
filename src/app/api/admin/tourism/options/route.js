import { NextResponse } from "next/server";
import { getAdminFromRequest } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { fetchTourismOptions } from "@/lib/tourismData";

export async function GET() {
  const admin = await getAdminFromRequest();
  if (!admin) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
  if (!supabaseAdmin) {
    return NextResponse.json({ success: false, message: "Konfigurasi Supabase admin belum lengkap." }, { status: 500 });
  }

  const options = await fetchTourismOptions(supabaseAdmin);
  if (options.error) {
    return NextResponse.json({ success: false, message: options.error.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    filters: {
      years: options.years,
      regions: options.regions,
    },
  });
}
