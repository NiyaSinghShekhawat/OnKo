import { NextRequest, NextResponse } from "next/server";
import { requireDoctor } from "@/backend/api/auth";
import { getPatient } from "@/backend/services/patientService";
import { generateDoctorClinicalReview } from "@/backend/services/doctorClinicalReviewService";

export async function POST(request: NextRequest) {
  const auth = await requireDoctor(request);
  if ("error" in auth) return auth.error;
  try {
    const body = await request.json();
    const patientId = typeof body.patientId === "string" ? body.patientId : "";
    const question = typeof body.question === "string" ? body.question : "";
    const patient = await getPatient(patientId);
    if (!patient || patient.doctorId !== auth.doctorId) return NextResponse.json({ error: "Patient not found." }, { status: 404 });
    const data = await generateDoctorClinicalReview({ patientId, doctorId: auth.doctorId, question });
    return NextResponse.json({ data });
  } catch (error) {
    console.error("POST /api/doctor/clinical-review failed", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to generate evidence review." }, { status: 400 });
  }
}
