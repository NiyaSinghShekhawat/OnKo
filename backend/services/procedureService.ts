import type { Procedure } from "@/types/procedure";
import { listDocumentsByField } from "../firebase/firestore";

export function listProceduresForPatient(patientId: string) {
  return listDocumentsByField<Procedure>("procedures", "patientId", patientId);
}
