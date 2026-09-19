import type {Notification} from "@/types/notification";
import type {WhatsAppConsent} from "@/types/whatsappConsent";
export interface WhatsAppDeliveryResult{status:"queued"|"not-configured"|"not-consented";channel:"whatsapp";notificationId:string;reason?:string}
/** Transport remains disabled until an approved WhatsApp Business sender, credentials and templates are configured. */
export async function sendWhatsAppNotification(notification:Notification,consent?:WhatsAppConsent|null):Promise<WhatsAppDeliveryResult>{
  if(!consent||consent.status!=="opted-in")return{status:"not-consented",channel:"whatsapp",notificationId:notification.notificationId,reason:"Patient has not opted in to WhatsApp notifications."};
  return{status:"not-configured",channel:"whatsapp",notificationId:notification.notificationId,reason:"WhatsApp Business transport is not configured yet. No external WhatsApp API request was made."};
}