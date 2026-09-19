export type ProcedureStatus = "scheduled" | "completed" | "cancelled";

export interface Procedure {
  procedureId: string;
  patientId: string;
  name: string;
  date: string;
  reason?: string;
  purpose?: string;
  details?: string;
  followUpDate?: string;
  notes?: string;
  status: ProcedureStatus;
}
