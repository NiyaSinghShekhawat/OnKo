import type {DoctorNotification,DoctorNotificationType} from "@/types/doctorNotification";
import {createDocument,getDocument,listDocumentsByField,setDocument} from "@/backend/firebase/firestore";

export async function createDoctorNotification(input:{doctorId:string;patientId:string;type:DoctorNotificationType;title:string;message:string;entityId?:string;metadata?:Record<string,string>}){
  const notification:DoctorNotification={notificationId:crypto.randomUUID(),doctorId:input.doctorId,patientId:input.patientId,type:input.type,title:input.title,message:input.message,createdAt:new Date().toISOString(),status:"unread",...(input.entityId?{entityId:input.entityId}:{}),...(input.metadata?{metadata:input.metadata}:{})};
  await createDocument("doctorNotifications",notification);
  return notification;
}
export async function listDoctorNotifications(doctorId:string){
  const rows=await listDocumentsByField<DoctorNotification>("doctorNotifications","doctorId",doctorId);
  return rows.sort((a,b)=>new Date(b.createdAt).getTime()-new Date(a.createdAt).getTime());
}
export async function markDoctorNotificationRead(doctorId:string,notificationId:string){
  const n=await getDocument<DoctorNotification>("doctorNotifications",notificationId);
  if(!n||n.doctorId!==doctorId)throw new Error("Notification not found.");
  const next={...n,status:"read" as const,readAt:new Date().toISOString()};
  await setDocument("doctorNotifications",notificationId,next);
  return next;
}