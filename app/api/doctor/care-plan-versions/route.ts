import { NextRequest, NextResponse } from "next/server";
import { requireDoctor } from "@/backend/api/auth";
import { getPatient } from "@/backend/services/patientService";
import { createCarePlanVersion, listCarePlanVersions } from "@/backend/services/carePlanVersionService";

export async function GET(request: NextRequest) {
  const auth = await requireDoctor(request);
  if ("error" in auth) return auth.error;
  const patientId = new URL(request.url).searchParams.get("patientId");
  if (!patientId) return NextResponse.json({ error: "patientId is required." }, { status: 400 });
  try {
    const patient = await getPatient(patientId);
    if (!patient || patient.doctorId !== auth.doctorId) return NextResponse.json({ error: "Patient not found." }, { status: 404 });
    return NextResponse.json({ data: await listCarePlanVersions(patientId, auth.doctorId) });
  } catch (error) {
    console.error("GET /api/doctor/care-plan-versions failed", error);
    return NextResponse.json({ error: "Unable to load care plan versions." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireDoctor(request);
  if ("error" in auth) return auth.error;
  try {
    const body = await request.json();
    const patientId = typeof body.patientId === "string" ? body.patientId : "";
    const patient = await getPatient(patientId);
    if (!patient || patient.doctorId !== auth.doctorId) return NextResponse.json({ error: "Patient not found." }, { status: 404 });
    const version = await createCarePlanVersion(patientId, auth.doctorId);
    return NextResponse.json({ data: version }, { status: 201 });
  } catch (error) {
    console.error("POST /api/doctor/care-plan-versions failed", error);
    return NextResponse.json({ error: "Unable to create care plan version." }, { status: 500 });
  }
}
