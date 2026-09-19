import type { Medicine } from "@/types/medicine";
import { getDocument, listDocuments, listDocumentsByField } from "../firebase/firestore";
export const getMedicine=(id:string)=>getDocument<Medicine>("medicines",id);
export const listMedicines=()=>listDocuments<Medicine>("medicines");
export const listMedicinesForPatient=(id:string)=>listDocumentsByField<Medicine>("medicines","patientId",id);
