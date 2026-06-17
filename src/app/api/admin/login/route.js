import { NextResponse } from "next/server";
import { COOKIE_NAME, comparePassword, generateAdminToken, getAdminCookieOptions } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request) {
  if (!supabaseAdmin) {
    return NextResponse.json({ success: false, message: "Konfigurasi Supabase admin belum lengkap." }, { status: 500 });
  }

  const { username, password } = await request.json().catch(() => ({}));
  if (!username || !password) {
    return NextResponse.json({ success: false, message: "Username dan password wajib diisi." }, { status: 400 });
  }

  const { data: admin, error } = await supabaseAdmin
    .from("admins")
    .select("id, name, username, password_hash")
    .eq("username", username)
    .maybeSingle();

  if (error || !admin || !(await comparePassword(password, admin.password_hash))) {
    return NextResponse.json({ success: false, message: "Username atau password salah." }, { status: 401 });
  }

  const safeAdmin = { id: admin.id, name: admin.name, username: admin.username };
  const response = NextResponse.json({ success: true, message: "Login berhasil", admin: safeAdmin });
  response.cookies.set(COOKIE_NAME, generateAdminToken(safeAdmin), getAdminCookieOptions());
  return response;
}
