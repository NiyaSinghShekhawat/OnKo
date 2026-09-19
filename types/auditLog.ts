export type AuditAction =
  | "signal-reviewed"
  | "signal-dismissed"
  | "ai-insight-reviewed"
  | "ai-insight-dismissed"
  | "milestone_completed"
  | "query_replied"
  | "report_reviewed"
  | "sos_triggered"
  | "sos_acknowledged"
  | "sos_resolved";

export type AuditEntityType =
  | "engagement-signal"
  | "ai-insight"
  | "milestone"
  | "query"
  | "report"
  | "sos";

export interface AuditLog {
  auditId: string;
  actorId: string;
  actorRole: "patient" | "doctor" | "admin";
  action: AuditAction;
  entityType: AuditEntityType;
  entityId: string;
  patientId: string;
  note?: string;
  metadata?: Record<string, string>;
  createdAt: string;
}
