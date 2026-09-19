import type { Medicine } from "@/types/medicine";
import { createDocument, getDocument, listDocuments, listDocumentsByField, setDocument } from "../firebase/firestore";
export const getMedicine=(id:string)=>getDocument<Medicine>("medicines",id);
export const listMedicines=()=>listDocuments<Medicine>("medicines");
export const listMedicinesForPatient=(id:string)=>listDocumentsByField<Medicine>("medicines","patientId",id);
export async function createDoctorMedicine(m:Medicine){await createDocument<Medicine>("medicines",m);return m}
export async function updateDoctorMedicine(id:string,m:Medicine){await setDocument<Medicine>("medicines",id,m);return m}