import { NextResponse } from "next/server";
import { getAdminFromRequest } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { validateTourismPayload } from "@/lib/tourismData";

async function requireAdmin() {
  const admin = await getAdminFromRequest();
  if (!admin) return null;
  return admin;
}

export async function GET(_request, { params }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
  if (!supabaseAdmin) {
    return NextResponse.json({ success: false, message: "Konfigurasi Supabase admin belum lengkap." }, { status: 500 });
  }
  const { id } = await params;
  const { data, error } = await supabaseAdmin
    .from("tourism_data")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return NextResponse.json({ success: false, message: error.message }, { status: 404 });
  return NextResponse.json({ success: true, data });
}

export async function PUT(request, { params }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
  if (!supabaseAdmin) {
    return NextResponse.json({ success: false, message: "Konfigurasi Supabase admin belum lengkap." }, { status: 500 });
  }
  const { id } = await params;
  const payload = await request.json().catch(() => ({}));
  const validation = validateTourismPayload(payload);
  if (!validation.valid) {
    return NextResponse.json({ success: false, message: "Validasi gagal", errors: validation.errors }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("tourism_data")
    .update(validation.data)
    .eq("id", id)
    .select("*")
    .single();

  if (error) return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  return NextResponse.json({ success: true, data });
}

export async function DELETE(_request, { params }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
  if (!supabaseAdmin) {
    return NextResponse.json({ success: false, message: "Konfigurasi Supabase admin belum lengkap." }, { status: 500 });
  }
  const { id } = await params;
  const { error } = await supabaseAdmin.from("tourism_data").delete().eq("id", id);
  if (error) return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  return NextResponse.json({ success: true, message: "Data berhasil dihapus" });
}
