import { getPatient } from "@/backend/services/patientService";
import { listAppointmentsForPatient } from "@/backend/services/appointmentService";
import { listMedicinesForPatient } from "@/backend/services/medicineService";
import { listProceduresForPatient } from "@/backend/services/procedureService";
import { listQueriesForPatient } from "@/backend/services/queryService";
import { listCareJourneysForPatient } from "@/backend/services/careJourneyService";
import { listMilestonesForPatient } from "@/backend/services/milestoneService";

export async function getPatientCompanionContext(patientId:string){
 const patient=await getPatient(patientId); if(!patient)throw new Error("Patient not found.");
 const [appointments,medicines,procedures,queries,journeys,milestones]=await Promise.all([listAppointmentsForPatient(patientId),listMedicinesForPatient(patientId),listProceduresForPatient(patientId),listQueriesForPatient(patientId),listCareJourneysForPatient(patientId),listMilestonesForPatient(patientId)]);
 return {patient:{patientId:patient.patientId,name:patient.name,currentCarePhase:patient.currentCarePhase,journeyProgress:patient.journeyProgress},appointments:appointments.map(x=>({title:x.title,date:x.date,time:x.time,status:x.status,location:x.location,instructions:x.instructions})),medicines:medicines.map(x=>({name:x.name,dosage:x.dosage,frequency:x.frequency,instructions:x.instructions,status:x.status,startDate:x.startDate,endDate:x.endDate})),procedures:procedures.map(x=>({name:x.name,date:x.date,purpose:x.purpose,details:x.details,status:x.status,followUpDate:x.followUpDate})),queries:queries.map(x=>({subject:x.subject,status:x.status,createdAt:x.createdAt,updatedAt:x.updatedAt})),careJourneys:journeys.map(x=>({currentState:x.currentState,progressPercent:x.progressPercent,updatedAt:x.updatedAt})),milestones:milestones.map(x=>({title:x.title,description:x.description,dueDate:x.dueDate,status:x.status,completedAt:x.completedAt}))};
}
