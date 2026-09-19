export type SOSStatus = "triggered" | "acknowledged" | "resolved";

export interface SOSEvent {
  sosId: string;
  patientId: string;
  status: SOSStatus;
  message?: string;
  createdAt: string;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
  resolvedAt?: string;
  resolvedBy?: string;
}
