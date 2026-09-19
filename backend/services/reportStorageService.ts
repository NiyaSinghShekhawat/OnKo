import { getDocument } from "@/backend/firebase/firestore";
import { getAdminStorageBucket } from "@/backend/firebase/storage";
import type { Report } from "@/types/report";

export async function getPatientReport(reportId:string,patientId:string){
  const report=await getDocument<Report>("reports",reportId);
  if(!report||report.patientId!==patientId)return null;
  return report;
}
export async function getDoctorReportFile(reportId:string,doctorId:string){
  const report=await getDocument<Report>("reports",reportId);
  if(!report)return null;
  const patient=await getDocument<{patientId:string;doctorId:string}>("patients",report.patientId);
  if(!patient||patient.doctorId!==doctorId)return null;
  return report;
}
export async function createReportAccessUrl(report:Report){
  if(!report.storagePath)throw new Error("Report file is not available.");
  const [url]=await getAdminStorageBucket().file(report.storagePath).getSignedUrl({
    version:"v4",action:"read",expires:Date.now()+5*60*1000,
  });
  return url;
}
