import { NextRequest, NextResponse } from "next/server";
import { requirePatient } from "@/backend/api/auth";
import { listProceduresForPatient } from "@/backend/services/procedureService";

export async function GET(request: NextRequest) {
  const auth = await requirePatient(request);
  if ("error" in auth) return auth.error;
  try {
    return NextResponse.json({ data: await listProceduresForPatient(auth.patientId) });
  } catch (error) {
    console.error("GET /api/procedures failed", error);
    return NextResponse.json({ error: "Unable to load procedures." }, { status: 500 });
  }
}
