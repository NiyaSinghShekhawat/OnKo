import { NextRequest, NextResponse } from "next/server";
import { requireDoctor } from "@/backend/api/auth";
import { getPatient } from "@/backend/services/patientService";
import { listAppointmentsForPatient } from "@/backend/services/appointmentService";
import { listMedicinesForPatient } from "@/backend/services/medicineService";
import { listProceduresForPatient } from "@/backend/services/procedureService";
import { listReportsForPatient } from "@/backend/services/reportService";
import { listQueriesForPatient } from "@/backend/services/queryService";
import { listCareJourneysForPatient } from "@/backend/services/careJourneyService";
import { listMilestonesForPatient } from "@/backend/services/milestoneService";

export async function GET(request: NextRequest, { params }: { params: Promise<{ patientId: string }> }) {
  const auth = await requireDoctor(request);
  if ("error" in auth) return auth.error;
  const { patientId } = await params;
  try {
    const patient = await getPatient(patientId);
    if (!patient || patient.doctorId !== auth.doctorId) return NextResponse.json({ error: "Patient not found." }, { status: 404 });
    const [appointments, medicines, procedures, reports, queries, careJourneys, milestones] = await Promise.all([
      listAppointmentsForPatient(patientId), listMedicinesForPatient(patientId), listProceduresForPatient(patientId),
      listReportsForPatient(patientId), listQueriesForPatient(patientId), listCareJourneysForPatient(patientId), listMilestonesForPatient(patientId),
    ]);
    return NextResponse.json({ data: { patient, appointments, medicines, procedures, reports, queries, careJourneys, milestones } });
  } catch (error) {
    console.error("GET /api/doctor/patients/[patientId] failed", error);
    return NextResponse.json({ error: "Unable to load patient history." }, { status: 500 });
  }
}
