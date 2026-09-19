import type { Procedure } from "@/types/procedure";
import { createDocument, getDocument, listDocumentsByField, setDocument } from "../firebase/firestore";
export function listProceduresForPatient(patientId:string){return listDocumentsByField<Procedure>("procedures","patientId",patientId)}
export async function getProcedure(id:string){const rows=await listDocumentsByField<Procedure>("procedures","procedureId",id);return rows[0]??null}
export async function createDoctorProcedure(p:Procedure){await createDocument<Procedure>("procedures",p);return p}
export async function updateDoctorProcedure(id:string,p:Procedure){await setDocument<Procedure>("procedures",id,p);return p}