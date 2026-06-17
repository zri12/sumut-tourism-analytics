import { NextResponse } from "next/server";
import { getAdminFromRequest } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { validateTourismPayload } from "@/lib/tourismData";

async function requireAdmin() {
  const admin = await getAdminFromRequest();
  if (!admin) return null;
  return admin;
}

export async function GET(request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
  if (!supabaseAdmin) {
    return NextResponse.json({ success: false, message: "Konfigurasi Supabase admin belum lengkap." }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");
  const tahun = searchParams.get("tahun");
  const kabupatenKota = searchParams.get("kabupaten_kota");
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const pageSize = Math.min(500, Math.max(10, Number(searchParams.get("pageSize")) || 100));
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const applyFilters = (query) => {
    let filtered = query;
    if (search) filtered = filtered.or(`kabupaten_kota.ilike.%${search}%,destinasi_wisata.ilike.%${search}%`);
    if (tahun) filtered = filtered.eq("tahun", Number(tahun));
    if (kabupatenKota) filtered = filtered.eq("kabupaten_kota", kabupatenKota);
    return filtered;
  };

  const { data, error, count } = await applyFilters(
    supabaseAdmin.from("tourism_data").select("*", { count: "exact" }),
  )
    .order("tahun", { ascending: false })
    .order("id", { ascending: false })
    .range(from, to);

  if (error) return NextResponse.json({ success: false, message: error.message }, { status: 500 });

  return NextResponse.json({
    success: true,
    data,
    pagination: {
      page,
      pageSize,
      total: count || 0,
      totalPages: Math.max(1, Math.ceil((count || 0) / pageSize)),
    },
  });
}

export async function POST(request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
  if (!supabaseAdmin) {
    return NextResponse.json({ success: false, message: "Konfigurasi Supabase admin belum lengkap." }, { status: 500 });
  }

  const payload = await request.json().catch(() => ({}));
  const validation = validateTourismPayload(payload);
  if (!validation.valid) {
    return NextResponse.json({ success: false, message: "Validasi gagal", errors: validation.errors }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("tourism_data")
    .insert(validation.data)
    .select("*")
    .single();

  if (error) return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  return NextResponse.json({ success: true, data }, { status: 201 });
}
