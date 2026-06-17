import { NextResponse } from "next/server";
import { getTourismData } from "@/lib/tourismData";

export async function GET() {
  const data = await getTourismData();
  return NextResponse.json({ success: true, data });
}
