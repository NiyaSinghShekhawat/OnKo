export interface CarePlanVersion {
  versionId: string;
  patientId: string;
  doctorId: string;
  version: number;
  createdAt: string;
  source: "doctor-workspace";
  summary: {
    milestones: number;
    activeMedicines: number;
    procedures: number;
  };
  snapshot: {
    milestones: unknown[];
    medicines: unknown[];
    procedures: unknown[];
  };
}
