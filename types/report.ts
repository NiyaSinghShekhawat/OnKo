export type ReportStatus = "uploaded" | "reviewed";

export interface Report {
  reportId: string;
  patientId: string;
  title: string;
  reportType?: string;
  uploadedAt: string;
  fileName: string;
  storagePath?: string;
  status: ReportStatus;
  notes?: string;
}
