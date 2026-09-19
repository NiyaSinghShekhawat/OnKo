import type { EngagementSignal } from "@/types/engagementSignal";import type { AuditLog } from "@/types/auditLog";
import { getDocument,listDocumentsByField,createDocument,setDocument } from "../firebase/firestore";
export async function getDoctorSignal(id:string){return getDocument<EngagementSignal>("engagementSignals",id)}
export async function listDoctorSignals(doctorId:string){return listDocumentsByField<EngagementSignal>("engagementSignals","doctorId",doctorId)}
export async function reviewDoctorSignal(doctorId:string,signalId:string,status:"reviewed"|"dismissed",note?:string){
 const signal=await getDoctorSignal(signalId);if(!signal||signal.doctorId!==doctorId)throw new Error("Signal not found.");
 const next={...signal,status};await setDocument<EngagementSignal>("engagementSignals",signalId,next);
 const audit:AuditLog={auditId:crypto.randomUUID(),actorId:doctorId,actorRole:"doctor",action:status==="reviewed"?"signal-reviewed":"signal-dismissed",entityType:"engagement-signal",entityId:signalId,patientId:signal.patientId,note:note?.trim()||undefined,createdAt:new Date().toISOString()};
 await createDocument<AuditLog>("auditLogs",audit);return next;
}