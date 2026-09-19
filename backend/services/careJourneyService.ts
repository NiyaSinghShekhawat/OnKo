import type { CareJourney } from "@/types/careJourney";
import { getDocument, listDocuments, listDocumentsByField } from "../firebase/firestore";
export const getCareJourney=(id:string)=>getDocument<CareJourney>("careJourneys",id);
export const listCareJourneys=()=>listDocuments<CareJourney>("careJourneys");
export const listCareJourneysForPatient=(id:string)=>listDocumentsByField<CareJourney>("careJourneys","patientId",id);
