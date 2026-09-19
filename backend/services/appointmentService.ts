import type { Appointment } from "@/types/appointment";
import { getDocument, listDocuments, listDocumentsByField } from "../firebase/firestore";
export const getAppointment=(id:string)=>getDocument<Appointment>("appointments",id);
export const listAppointments=()=>listDocuments<Appointment>("appointments");
export const listAppointmentsForPatient=(id:string)=>listDocumentsByField<Appointment>("appointments","patientId",id);
