import type { EngagementSignal } from "@/types/engagementSignal";
import { listDocumentsByField, createDocument } from "../firebase/firestore";
import { listPatientsByDoctor } from "./patientService";
import { listMilestonesForPatient } from "./milestoneService";
import { listAppointmentsForPatient } from "./appointmentService";
import { listQueriesForPatient } from "./queryService";
export async function detectDoctorSignals(doctorId:string){
 const patients=await listPatientsByDoctor(doctorId); const now=new Date(); const signals:EngagementSignal[]=[];
 for(const p of patients){
  const [milestones,appointments,queries]=await Promise.all([listMilestonesForPatient(p.patientId),listAppointmentsForPatient(p.patientId),listQueriesForPatient(p.patientId)]);
  const overdue=milestones.filter(m=>m.status==="overdue"||(m.status==="pending"&&new Date(m.dueDate).getTime()<now.getTime()));
  if(overdue.length) signals.push({signalId:`${p.patientId}-missed-milestone`,patientId:p.patientId,doctorId,type:"missed-milestone",title:"Milestone requires review",description:`${overdue.length} milestone(s) are overdue or pending past the due date.`,detectedAt:now.toISOString(),status:"pending-review",source:"milestones"});
  const missed=appointments.filter(a=>a.status==="missed");
  if(missed.length) signals.push({signalId:`${p.patientId}-missed-follow-up`,patientId:p.patientId,doctorId,type:"missed-follow-up",title:"Missed appointment recorded",description:`${missed.length} appointment(s) are marked missed.`,detectedAt:now.toISOString(),status:"pending-review",source:"appointments"});
  const open=queries.filter(q=>q.status==="open");
  if(open.length) signals.push({signalId:`${p.patientId}-open-query`,patientId:p.patientId,doctorId,type:"open-query",title:"Patient query awaiting response",description:`${open.length} patient query(ies) remain open.`,detectedAt:now.toISOString(),status:"pending-review",source:"queries"});
 }
 return signals;
}
export async function listDoctorSignals(doctorId:string){return listDocumentsByField<EngagementSignal>("engagementSignals","doctorId",doctorId)}
export async function saveDoctorSignal(signal:EngagementSignal){await createDocument<EngagementSignal>("engagementSignals",signal);return signal}