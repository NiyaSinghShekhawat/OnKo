import { NextRequest, NextResponse } from "next/server";
import { requirePatient } from "@/backend/api/auth";
import { getPatient } from "@/backend/services/patientService";

export async function GET(request: NextRequest) {
  const auth = await requirePatient(request);
  if ("error" in auth) return auth.error;
  try {
    const patient = await getPatient(auth.patientId);
    return NextResponse.json({ data: patient ? [patient] : [] });
  } catch (error) {
    console.error("GET /api/patients failed", error);
    return NextResponse.json({ error: "Unable to load patient." }, { status: 500 });
  }
}
