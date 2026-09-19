import type { Patient } from "@/types/patient";
import { getDocument, listDocuments } from "../firebase/firestore";

export function getPatient(patientId: string) {
  return getDocument<Patient>("patients", patientId);
}

export function listPatients() {
  return listDocuments<Patient>("patients");
}
