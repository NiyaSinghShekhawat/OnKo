import type { Milestone } from "@/types/milestone";
import { listDocumentsByField } from "../firebase/firestore";

export function listMilestonesForPatient(patientId: string) {
  return listDocumentsByField<Milestone>("milestones", "patientId", patientId);
}
