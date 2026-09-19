import type { Appointment, Milestone } from "@/backend/types/firestore";
import { createPatientNotification } from "@/backend/services/notificationService";
import { generatePatientReminders } from "@/backend/services/reminderEngine";

export async function notifyUpcomingAppointment(patientId:string,appointment:Appointment){return createPatientNotification({patientId,type:"appointment-reminder",title:"Upcoming appointment",message:"You have an upcoming appointment: "+appointment.title+" on "+appointment.date+" at "+appointment.time+".",metadata:{appointmentId:appointment.appointmentId}})}
export async function notifyMilestoneDue(patientId:string,milestone:Milestone){return createPatientNotification({patientId,type:"milestone-reminder",title:"Care milestone reminder",message:"Your clinician-defined milestone is due: "+milestone.title+".",metadata:{milestoneId:milestone.milestoneId}})}
export async function notifyQueryUpdate(patientId:string,queryId:string,subject:string){return createPatientNotification({patientId,type:"query-update",title:"Care team replied",message:'Your care-team query "'+subject+'" has a new response.',metadata:{queryId}})}
export async function notifyDoctorUpdate(patientId:string,title:string,message:string,metadata:Record<string,string>={}){return createPatientNotification({patientId,type:"doctor-update",title,message,metadata})}
export { generatePatientReminders };