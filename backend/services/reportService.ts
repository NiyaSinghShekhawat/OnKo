import type { Report } from "@/types/report";
import { getDocument, listDocuments, listDocumentsByField, setDocument } from "../firebase/firestore";

export function listReportsForPatient(patientId: string) {
  return listDocumentsByField<Report>("reports", "patientId", patientId);
}

export function listReports() {
  return listDocuments<Report>("reports");
}

export async function getDoctorReport(reportId: string, doctorId: string) {
  const r = await getDocument<Report>("reports", reportId);
  if (!r) return null;
  const p = await getDocument<{ patientId: string; doctorId: string }>("patients", r.patientId);
  if (!p || p.doctorId !== doctorId) return null;
  return r;
}

export async function reviewDoctorReport(reportId: string, doctorId: string, notes: string) {
  const r = await getDoctorReport(reportId, doctorId);
  if (!r) throw new Error("Report not found.");
  const next = { ...r, status: "reviewed" as const, notes: notes.trim() || r.notes };
  await setDocument<Report>("reports", reportId, next);
  return next;
}
