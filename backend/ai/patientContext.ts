import { getPatient } from "@/backend/services/patientService";
import { listAppointmentsForPatient } from "@/backend/services/appointmentService";
import { listMedicinesForPatient } from "@/backend/services/medicineService";
import { listProceduresForPatient } from "@/backend/services/procedureService";
import { listReportsForPatient } from "@/backend/services/reportService";
import { listQueriesForPatient } from "@/backend/services/queryService";
import { listCareJourneysForPatient } from "@/backend/services/careJourneyService";
import { listMilestonesForPatient } from "@/backend/services/milestoneService";

export interface PatientContext {
  patient: NonNullable<Awaited<ReturnType<typeof getPatient>>>;
  appointments: Awaited<ReturnType<typeof listAppointmentsForPatient>>;
  medicines: Awaited<ReturnType<typeof listMedicinesForPatient>>;
  procedures: Awaited<ReturnType<typeof listProceduresForPatient>>;
  reports: Awaited<ReturnType<typeof listReportsForPatient>>;
  queries: Awaited<ReturnType<typeof listQueriesForPatient>>;
  careJourneys: Awaited<ReturnType<typeof listCareJourneysForPatient>>;
  milestones: Awaited<ReturnType<typeof listMilestonesForPatient>>;
  careJourney: Awaited<ReturnType<typeof listCareJourneysForPatient>>[number] | null;
}

export function buildPatientInsightContext(data: PatientContext) {
  return {
    patient: data.patient,
    appointments: data.appointments.map((x) => ({ title: x.title, date: x.date, time: x.time, status: x.status, location: x.location, instructions: x.instructions })),
    medicines: data.medicines.map((x) => ({ name: x.name, dosage: x.dosage, frequency: x.frequency, instructions: x.instructions, status: x.status, startDate: x.startDate, endDate: x.endDate })),
    procedures: data.procedures.map((x) => ({ name: x.name, date: x.date, purpose: x.purpose, details: x.details, status: x.status, followUpDate: x.followUpDate })),
    reports: data.reports.map((x) => ({ title: x.title, reportType: x.reportType, uploadedAt: x.uploadedAt, status: x.status, fileName: x.fileName })),
    queries: data.queries.map((x) => ({ subject: x.subject, status: x.status, createdAt: x.createdAt, updatedAt: x.updatedAt, messageCount: x.messages.length })),
    careJourneys: data.careJourneys.map((x) => ({ currentState: x.currentState, progressPercent: x.progressPercent, updatedAt: x.updatedAt, milestoneCount: x.milestones.length })),
    milestones: data.milestones.map((x) => ({ title: x.title, dueDate: x.dueDate, status: x.status, completedAt: x.completedAt })),
    careJourney: data.careJourney,
  };
}

export async function getPatientContext(patientId: string, doctorId: string): Promise<PatientContext> {
  const patient = await getPatient(patientId);
  if (!patient || patient.doctorId !== doctorId) throw new Error("Patient not found.");
  const [appointments, medicines, procedures, reports, queries, careJourneys, milestones] = await Promise.all([
    listAppointmentsForPatient(patientId),
    listMedicinesForPatient(patientId),
    listProceduresForPatient(patientId),
    listReportsForPatient(patientId),
    listQueriesForPatient(patientId),
    listCareJourneysForPatient(patientId),
    listMilestonesForPatient(patientId),
  ]);
  return {
    patient,
    appointments,
    medicines,
    procedures,
    reports,
    queries,
    careJourneys,
    milestones,
    careJourney: careJourneys[0] ?? null,
  };
}
