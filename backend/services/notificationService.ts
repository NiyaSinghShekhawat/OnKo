import type { Notification, NotificationType } from "@/types/notification";
import { createDocument, documentRef, listDocumentsByField } from "@/backend/firebase/firestore";

export async function createPatientNotification(input:{patientId:string;type:NotificationType;title:string;message:string;channel?:Notification["channel"];metadata?:Record<string,string>}){
  const channel=input.channel||"in-app";
  const notification:Notification={
    notificationId:"notif-"+crypto.randomUUID(),patientId:input.patientId,type:input.type,title:input.title,message:input.message,
    createdAt:new Date().toISOString(),channel,status:channel==="in-app"?"sent":"pending",metadata:input.metadata
  };
  await createDocument("notifications",notification);
  return notification;
}
export async function listPatientNotifications(patientId:string){
  return (await listDocumentsByField<Notification>("notifications","patientId",patientId)).sort((a,b)=>new Date(b.createdAt).getTime()-new Date(a.createdAt).getTime());
}
export async function markPatientNotificationRead(notificationId:string,patientId:string){
  const ref=documentRef<Notification>("notifications",notificationId);const snap=await ref.get();
  if(!snap.exists)throw new Error("Notification not found.");
  const notification=snap.data() as Notification;if(notification.patientId!==patientId)throw new Error("Not authorized.");
  const readAt=new Date().toISOString();await ref.update({status:"read",readAt});
  return {...notification,status:"read" as const,readAt};
}
export async function updateNotificationDeliveryStatus(notificationId:string,status:Notification["status"]){
  const ref=documentRef<Notification>("notifications",notificationId);const snap=await ref.get();
  if(!snap.exists)throw new Error("Notification not found.");
  await ref.update({status,...(status==="read"?{readAt:new Date().toISOString()}:{})});
  return {...(snap.data() as Notification),status};
}