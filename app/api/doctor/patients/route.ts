import { NextRequest, NextResponse } from "next/server";
import { requireDoctor } from "@/backend/api/auth";
import { listPatientsByDoctor } from "@/backend/services/patientService";

export async function GET(request: NextRequest) {
  const auth = await requireDoctor(request);
  if ("error" in auth) return auth.error;

  try {
    const patients = await listPatientsByDoctor(auth.doctorId);
    return NextResponse.json({ data: patients });
  } catch (error) {
    console.error("GET /api/doctor/patients failed", error);
    return NextResponse.json({ error: "Unable to load doctor patients." }, { status: 500 });
  }
}
