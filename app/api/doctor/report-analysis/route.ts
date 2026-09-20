import { NextRequest, NextResponse } from "next/server";
import { requireDoctor } from "@/backend/api/auth";
import { compareReportText } from "@/backend/services/reportAnalysisService";
import { getDoctorReport } from "@/backend/services/reportService";

export async function POST(request: NextRequest) {
  const auth = await requireDoctor(request);
  if ("error" in auth) return auth.error;
  try {
    const body = await request.json();
    const currentText = typeof body.currentText === "string" ? body.currentText : "";
    const previousText = typeof body.previousText === "string" ? body.previousText : "";
    if (typeof body.reportId === "string") {
      const report = await getDoctorReport(body.reportId, auth.doctorId);
      if (!report) return NextResponse.json({ error: "Report not found." }, { status: 404 });
    }
    const result = await compareReportText({ currentText, previousText });
    return NextResponse.json({ data: result });
  } catch (error) {
    console.error("POST /api/doctor/report-analysis failed", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to compare report text." }, { status: 400 });
  }
}
