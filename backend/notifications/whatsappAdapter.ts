import type {Notification} from "@/types/notification";
import type {WhatsAppConsent} from "@/types/whatsappConsent";
import twilio from "twilio";

export interface WhatsAppDeliveryResult{status:"sent"|"not-configured"|"not-consented"|"failed";channel:"whatsapp";notificationId:string;reason?:string}

function templateSidFor(type:Notification["type"]){
 const map:Partial<Record<Notification["type"],string>>={
  "appointment-reminder":process.env.TWILIO_WHATSAPP_TEMPLATE_APPOINTMENT,
  "milestone-reminder":process.env.TWILIO_WHATSAPP_TEMPLATE_MILESTONE,
  "doctor-update":process.env.TWILIO_WHATSAPP_TEMPLATE_DOCTOR_UPDATE,
  "query-update":process.env.TWILIO_WHATSAPP_TEMPLATE_QUERY_UPDATE,
  "safety-alert":process.env.TWILIO_WHATSAPP_TEMPLATE_SAFETY_ALERT,
 };
 return map[type];
}
function variables(notification:Notification){return notification.metadata?.templateVariables?JSON.parse(notification.metadata.templateVariables):{};}
function configured(){return !!(process.env.TWILIO_ACCOUNT_SID&&process.env.TWILIO_API_KEY&&process.env.TWILIO_API_SECRET&&process.env.TWILIO_WHATSAPP_FROM);}
export async function sendWhatsAppNotification(notification:Notification,consent?:WhatsAppConsent|null):Promise<WhatsAppDeliveryResult>{
 if(!consent||consent.status!=="opted-in")return{status:"not-consented",channel:"whatsapp",notificationId:notification.notificationId,reason:"Patient has not opted in to WhatsApp notifications."};
 if(!consent.phoneNumber)return{status:"failed",channel:"whatsapp",notificationId:notification.notificationId,reason:"No WhatsApp phone number is registered for this consent."};
 const contentSid=templateSidFor(notification.type);
 if(!configured()||!contentSid)return{status:"not-configured",channel:"whatsapp",notificationId:notification.notificationId,reason:"Twilio WhatsApp sender, credentials, or approved Content Template is not configured."};
 try{
  const client=twilio(process.env.TWILIO_API_KEY!,process.env.TWILIO_API_SECRET!,{accountSid:process.env.TWILIO_ACCOUNT_SID!});
  await client.messages.create({from:"whatsapp:"+process.env.TWILIO_WHATSAPP_FROM!,to:"whatsapp:"+consent.phoneNumber,contentSid,contentVariables:JSON.stringify(variables(notification))});
  return{status:"sent",channel:"whatsapp",notificationId:notification.notificationId};
 }catch(error){console.error("Twilio WhatsApp delivery failed.",error);return{status:"failed",channel:"whatsapp",notificationId:notification.notificationId,reason:"Twilio rejected or could not deliver the message."};}
}
