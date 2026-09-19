import type { Appointment, Milestone } from "@/backend/types/firestore";
import { createPatientNotification } from "@/backend/services/notificationService";
import { getWhatsAppConsent } from "@/backend/services/whatsappConsentService";
import { generatePatientReminders } from "@/backend/services/reminderEngine";
async function createCareNotification(input:Parameters<typeof createPatientNotification>[0]){
  const base=await createPatientNotification({...input,channel:"in-app"});
  const consent=await getWhatsAppConsent(input.patientId);
  if(consent?.status==="opted-in"){
    await createPatientNotification({...input,channel:"whatsapp"});
  }
  return base;
}
export async function notifyUpcomingAppointment(patientId:string,appointment:Appointment){
 const reminderKey="appointment:"+appointment.appointmentId+":"+appointment.date;
 return createCareNotification({patientId,type:"appointment-reminder",title:"Upcoming appointment",message:"You have an upcoming appointment: "+appointment.title+" on "+appointment.date+" at "+appointment.time+".",metadata:{appointmentId:appointment.appointmentId,reminderKey}});
}
export async function notifyMilestoneDue(patientId:string,milestone:Milestone){
 const reminderKey="milestone:"+milestone.milestoneId+":"+milestone.dueDate;
 return createCareNotification({patientId,type:"milestone-reminder",title:"Care milestone reminder",message:"Your clinician-defined milestone is due: "+milestone.title+".",metadata:{milestoneId:milestone.milestoneId,reminderKey}});
}
export async function notifyQueryUpdate(patientId:string,queryId:string,subject:string){
 return createCareNotification({patientId,type:"query-update",title:"Care team replied",message:'Your care-team query "'+subject+'" has a new response.',metadata:{queryId}});
}
export async function notifyDoctorUpdate(patientId:string,title:string,message:string,metadata:Record<string,string>={}){
 return createCareNotification({patientId,type:"doctor-update",title,message,metadata});
}
export { generatePatientReminders };
