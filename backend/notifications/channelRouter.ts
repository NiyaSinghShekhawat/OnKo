import type {Notification} from "@/types/notification";
import {sendWhatsAppNotification} from "@/backend/notifications/whatsappAdapter";
import {getWhatsAppConsent} from "@/backend/services/whatsappConsentService";
import {updateNotificationDeliveryStatus} from "@/backend/services/notificationService";

export async function deliverNotification(notification:Notification){
  if(notification.channel==="whatsapp"){
    const consent=await getWhatsAppConsent(notification.patientId);
    const result=await sendWhatsAppNotification(notification,consent);
    if(result.status==="queued") await updateNotificationDeliveryStatus(notification.notificationId,"sent");
    if(result.status==="not-consented") await updateNotificationDeliveryStatus(notification.notificationId,"failed");
    return result;
  }
  await updateNotificationDeliveryStatus(notification.notificationId,"sent");
  return {status:"sent" as const,channel:"in-app" as const,notificationId:notification.notificationId};
}