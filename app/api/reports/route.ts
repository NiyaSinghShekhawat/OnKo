import { NextResponse } from "next/server";
import { listReports } from "@/backend/services/reportService";

export async function GET() {
  try {
    const reports = await listReports();
    return NextResponse.json({ data: reports });
  } catch (error) {
    console.error("GET /api/reports failed", error);
    return NextResponse.json(
      { error: "Unable to load reports." },
      { status: 500 },
    );
  }
}
