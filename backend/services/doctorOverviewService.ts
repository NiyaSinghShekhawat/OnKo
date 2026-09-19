import { listPatientsByDoctor } from "@/backend/services/patientService";
import { listAppointments } from "@/backend/services/appointmentService";
import { listQueries } from "@/backend/services/queryService";
import { listReports } from "@/backend/services/reportService";
import { listMilestones } from "@/backend/services/milestoneService";
export async function getDoctorOverview(doctorId:string){
 const [patients,appointments,queries,reports,milestones]=await Promise.all([listPatientsByDoctor(doctorId),listAppointments(),listQueries(),listReports(),listMilestones()]);
 const ids=new Set(patients.map(p=>p.patientId));
 const scopedAppointments=appointments.filter(x=>ids.has(x.patientId)&&x.doctorId===doctorId);
 const scopedQueries=queries.filter(x=>ids.has(x.patientId)&&x.doctorId===doctorId);
 const scopedReports=reports.filter(x=>ids.has(x.patientId));
 const scopedMilestones=milestones.filter(x=>ids.has(x.patientId));
 const today=new Date().toISOString().slice(0,10);
 return {totalPatients:patients.length,activePatients:patients.filter(p=>p.currentCarePhase!=="deceased").length,todayAppointments:scopedAppointments.filter(x=>x.date===today&&x.status==="scheduled").length,pendingQueries:scopedQueries.filter(x=>x.status==="open").length,reportsForReview:scopedReports.filter(x=>x.status==="uploaded").length,upcomingFollowUps:scopedAppointments.filter(x=>x.date>=today&&x.status==="scheduled").length,recentActivity:[...scopedMilestones.map(x=>({date:x.completedAt??x.dueDate,title:x.title,detail:`Milestone · ${x.status}`})),...scopedQueries.map(x=>({date:x.updatedAt,title:x.subject,detail:`Query · ${x.status}`})),...scopedReports.map(x=>({date:x.uploadedAt,title:x.title,detail:`Report · ${x.status}`}))].sort((a,b)=>new Date(b.date).getTime()-new Date(a.date).getTime()).slice(0,6)};
}