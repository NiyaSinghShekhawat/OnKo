import {authenticatedFetch} from "./authenticatedFetch";
import type {PatientCompanionOutput} from "@/backend/ai/patientCompanionTypes";
export async function askPatientCompanion(question:string):Promise<{output:PatientCompanionOutput;model:string}>{const r=await authenticatedFetch("/api/patient/ai/companion",{method:"POST",body:JSON.stringify({question})});if(!r.ok){const b=await r.json().catch(()=>null);throw new Error(b?.error||"Unable to contact patient companion.");}return(await r.json()).data;}
