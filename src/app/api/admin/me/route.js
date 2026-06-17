import { NextResponse } from "next/server";
import { getAdminFromRequest } from "@/lib/adminAuth";

export async function GET() {
  const admin = await getAdminFromRequest();
  if (!admin) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ success: true, admin });
}
