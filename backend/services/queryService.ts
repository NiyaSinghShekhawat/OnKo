import type { Query } from "@/types/query";
import { getDocument, listDocuments, listDocumentsByField } from "../firebase/firestore";
export const getQuery=(id:string)=>getDocument<Query>("queries",id);
export const listQueries=()=>listDocuments<Query>("queries");
export const listQueriesForPatient=(id:string)=>listDocumentsByField<Query>("queries","patientId",id);
