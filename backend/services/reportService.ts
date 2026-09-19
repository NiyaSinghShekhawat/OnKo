import type { Report } from "@/types/report";
import { getDocument, listDocuments, listDocumentsByField } from "../firebase/firestore";
export const getReport=(id:string)=>getDocument<Report>("reports",id);
export const listReports=()=>listDocuments<Report>("reports");
export const listReportsForPatient=(id:string)=>listDocumentsByField<Report>("reports","patientId",id);
