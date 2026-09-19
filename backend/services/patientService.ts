import type { Patient } from "@/types/patient";
import { getDocument, listDocuments, listDocumentsByField } from "../firebase/firestore";

export function getPatient(patientId: string) {
  return getDocument<Patient>("patients", patientId);
}

export function listPatients() {
  return listDocuments<Patient>("patients");
}

export function listPatientsByDoctor(doctorId: string) {
  return listDocumentsByField<Patient>("patients", "doctorId", doctorId);
}
