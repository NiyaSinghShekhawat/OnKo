import { createDocument, listDocumentsByField } from "@/backend/firebase/firestore";
import type { CarePlanVersion } from "@/types/carePlanVersion";
import { listMedicinesForPatient } from "@/backend/services/medicineService";
import { listProceduresForPatient } from "@/backend/services/procedureService";
import { listMilestonesForPatient } from "@/backend/services/milestoneService";

export async function listCarePlanVersions(patientId: string, doctorId: string) {
  const rows = await listDocumentsByField<CarePlanVersion>("carePlanVersions", "patientId", patientId);
  return rows.filter((x) => x.doctorId === doctorId).sort((a, b) => b.version - a.version);
}

export async function createCarePlanVersion(patientId: string, doctorId: string) {
  const [milestones, medicines, procedures, previous] = await Promise.all([
    listMilestonesForPatient(patientId),
    listMedicinesForPatient(patientId),
    listProceduresForPatient(patientId),
    listCarePlanVersions(patientId, doctorId),
  ]);
  const version = (previous[0]?.version ?? 0) + 1;
  const snapshot: CarePlanVersion = {
    versionId: crypto.randomUUID(),
    patientId,
    doctorId,
    version,
    createdAt: new Date().toISOString(),
    source: "doctor-workspace",
    summary: {
      milestones: milestones.filter((x) => x.status !== "cancelled").length,
      activeMedicines: medicines.filter((x) => x.status === "active").length,
      procedures: procedures.filter((x) => x.status !== "cancelled").length,
    },
    snapshot: {
      milestones: milestones.map((x) => ({ ...x })),
      medicines: medicines.map((x) => ({ ...x })),
      procedures: procedures.map((x) => ({ ...x })),
    },
  };
  await createDocument("carePlanVersions", snapshot);
  return snapshot;
}
