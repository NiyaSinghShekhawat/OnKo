export type CompanionAuditOutcome="completed"|"safety-blocked"|"failed";
export interface PatientCompanionAudit{auditId:string;patientId:string;conversationId?:string;intent:string;intentModel:string;responseModel:string;ragUsed:boolean;outcome:CompanionAuditOutcome;latencyMs:number;errorCategory?:string;createdAt:string;}
