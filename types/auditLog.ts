export type AuditAction="signal-reviewed"|"signal-dismissed"|"ai-insight-reviewed"|"ai-insight-dismissed";
export type AuditEntityType="engagement-signal"|"ai-insight";
export interface AuditLog{auditId:string;actorId:string;actorRole:"doctor"|"admin";action:AuditAction;entityType:AuditEntityType;entityId:string;patientId:string;note?:string;createdAt:string;}