import type { Milestone } from "@/types/milestone";
import { listDocuments, listDocumentsByField } from "../firebase/firestore";

export function listMilestonesForPatient(patientId: string) {
  return listDocumentsByField<Milestone>("milestones", "patientId", patientId);
}

export function listMilestones() {
  return listDocuments<Milestone>("milestones");
}
