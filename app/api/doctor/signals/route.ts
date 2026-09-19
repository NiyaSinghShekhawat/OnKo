import { NextRequest, NextResponse } from "next/server";
import { requireDoctor } from "@/backend/api/auth";
import { listPatientsByDoctor } from "@/backend/services/patientService";
import { detectAndStoreEngagementSignals, listPatientEngagementSignals, reviewEngagementSignal } from "@/backend/services/engagementSignalService";

export async function GET(request: NextRequest) {
  const auth = await requireDoctor(request);
  if ("error" in auth) return auth.error;
  try {
    const patientId = new URL(request.url).searchParams.get("patientId");
    if (patientId) {
      const patients = await listPatientsByDoctor(auth.doctorId);
      if (!patients.some((patient) => patient.patientId === patientId)) {
        return NextResponse.json({ error: "Patient not found." }, { status: 404 });
      }
      await detectAndStoreEngagementSignals(patientId, auth.doctorId);
      const data = await listPatientEngagementSignals(patientId);
      return NextResponse.json({ data: data.filter((signal) => signal.doctorId === auth.doctorId) });
    }

    const patients = await listPatientsByDoctor(auth.doctorId);
    await Promise.all(patients.map((patient) => detectAndStoreEngagementSignals(patient.patientId, auth.doctorId)));
    const allSignals = await Promise.all(patients.map((patient) => listPatientEngagementSignals(patient.patientId)));
    return NextResponse.json({ data: allSignals.flat().filter((signal) => signal.doctorId === auth.doctorId) });
  } catch (error) {
    console.error("GET /api/doctor/signals failed", error);
    return NextResponse.json({ error: "Unable to load engagement signals." }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const auth = await requireDoctor(request);
  if ("error" in auth) return auth.error;
  try {
    const body = await request.json();
    if (!body.signalId || !["reviewed", "dismissed"].includes(body.status)) {
      return NextResponse.json({ error: "Signal ID and valid review status are required." }, { status: 400 });
    }
    const result = await reviewEngagementSignal(String(body.signalId), auth.doctorId, body.status, String(body.note ?? ""));
    return NextResponse.json({ data: result });
  } catch (error) {
    console.error("PATCH /api/doctor/signals failed", error);
    return NextResponse.json({ error: "Unable to review signal." }, { status: 500 });
  }
}
