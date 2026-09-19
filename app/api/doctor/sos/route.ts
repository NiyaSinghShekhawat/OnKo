import { NextRequest, NextResponse } from "next/server";
import { requireDoctor } from "@/backend/api/auth";
import { getDocument, listDocumentsByField, setDocument, createDocument } from "@/backend/firebase/firestore";
import { getPatient } from "@/backend/services/patientService";
import type { SOSEvent } from "@/types/sos";

export async function GET(request: NextRequest) {
  const auth = await requireDoctor(request);
  if ("error" in auth) return auth.error;
  try {
    const patientId = new URL(request.url).searchParams.get("patientId");
    if (patientId) {
      const patient = await getPatient(patientId);
      if (!patient || patient.doctorId !== auth.doctorId) return NextResponse.json({ error: "Patient not found." }, { status: 404 });
      return NextResponse.json({ data: await listDocumentsByField<SOSEvent>("sosEvents", "patientId", patientId) });
    }
    const patients = await import("@/backend/services/patientService").then(x => x.listPatientsByDoctor(auth.doctorId));
    const events = (await Promise.all(patients.map(p => listDocumentsByField<SOSEvent>("sosEvents", "patientId", p.patientId)))).flat();
    return NextResponse.json({ data: events.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) });
  } catch (error) {
    console.error("GET /api/doctor/sos failed", error);
    return NextResponse.json({ error: "Unable to load SOS events." }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const auth = await requireDoctor(request);
  if ("error" in auth) return auth.error;
  try {
    const body = await request.json();
    const sosId = typeof body.sosId === "string" ? body.sosId : "";
    const status = body.status;
    if (!sosId || !["acknowledged", "resolved"].includes(status)) return NextResponse.json({ error: "SOS ID and valid status are required." }, { status: 400 });
    const existing = await getDocument<SOSEvent>("sosEvents", sosId);
    if (!existing) return NextResponse.json({ error: "SOS event not found." }, { status: 404 });
    const patient = await getPatient(existing.patientId);
    if (!patient || patient.doctorId !== auth.doctorId) return NextResponse.json({ error: "SOS event not found." }, { status: 404 });
    const now = new Date().toISOString();
    const next: SOSEvent = status === "acknowledged"
      ? { ...existing, status, acknowledgedAt: existing.acknowledgedAt ?? now, acknowledgedBy: existing.acknowledgedBy ?? auth.doctorId }
      : { ...existing, status, resolvedAt: existing.resolvedAt ?? now, resolvedBy: existing.resolvedBy ?? auth.doctorId };
    await setDocument("sosEvents", sosId, next);
    await createDocument("auditLogs", {
      auditId: "sos-" + status + "-" + sosId + "-" + Date.now(),
      actorId: auth.doctorId,
      actorRole: "doctor",
      action: status === "acknowledged" ? "sos_acknowledged" : "sos_resolved",
      entityType: "sos",
      entityId: sosId,
      patientId: existing.patientId,
      createdAt: now,
    });
    return NextResponse.json({ data: next });
  } catch (error) {
    console.error("PATCH /api/doctor/sos failed", error);
    return NextResponse.json({ error: "Unable to update SOS event." }, { status: 500 });
  }
}
