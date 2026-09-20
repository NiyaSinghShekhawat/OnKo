import { NextRequest, NextResponse } from "next/server";
import { requireDoctor } from "@/backend/api/auth";
import { listDocuments, listDocumentsByField } from "@/backend/firebase/firestore";
import { listPatientsByDoctor } from "@/backend/services/patientService";

export async function GET(request: NextRequest) {
  const auth = await requireDoctor(request);
  if ("error" in auth) return auth.error;

  try {
    const patients = await listPatientsByDoctor(auth.doctorId);
    const patientIds = new Set(patients.map((p) => p.patientId));

    const [appointments, medicines, procedures, reports, queries, milestones, caregivers, sosEvents, auditLogs] =
      await Promise.all([
        Promise.all(patients.map((p) => listDocumentsByField("appointments", "patientId", p.patientId))).then((x) => x.flat()),
        Promise.all(patients.map((p) => listDocumentsByField("medicines", "patientId", p.patientId))).then((x) => x.flat()),
        Promise.all(patients.map((p) => listDocumentsByField("procedures", "patientId", p.patientId))).then((x) => x.flat()),
        Promise.all(patients.map((p) => listDocumentsByField("reports", "patientId", p.patientId))).then((x) => x.flat()),
        Promise.all(patients.map((p) => listDocumentsByField("queries", "patientId", p.patientId))).then((x) => x.flat()),
        Promise.all(patients.map((p) => listDocumentsByField("milestones", "patientId", p.patientId))).then((x) => x.flat()),
        Promise.all(patients.map((p) => listDocumentsByField("caregivers", "patientId", p.patientId))).then((x) => x.flat()),
        Promise.all(patients.map((p) => listDocumentsByField("sosEvents", "patientId", p.patientId))).then((x) => x.flat()),
        listDocuments("auditLogs"),
      ]);

    return NextResponse.json({
      data: {
        patients,
        appointments,
        medicines,
        procedures,
        reports,
        queries,
        milestones,
        caregivers,
        sosEvents,
        auditLogs: auditLogs.filter((log: any) => patientIds.has(log.patientId)),
      },
    });
  } catch (error) {
    console.error("GET /api/doctor/workspace failed", error);
    return NextResponse.json({ error: "Unable to load doctor workspace data." }, { status: 500 });
  }
}
