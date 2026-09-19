import type { Query, QueryStatus } from "@/types/query";
import { authenticatedFetch } from "./authenticatedFetch";
export async function replyToDoctorQuery(input:{queryId:string;message:string}):Promise<Query>{const r=await authenticatedFetch("/api/doctor/queries/reply",{method:"POST",body:JSON.stringify(input)});if(!r.ok)throw new Error("Unable to send reply.");return(await r.json()).data as Query}
export async function updateDoctorQueryStatus(input:{queryId:string;status:QueryStatus}):Promise<Query>{const r=await authenticatedFetch("/api/doctor/queries",{method:"PATCH",body:JSON.stringify(input)});if(!r.ok)throw new Error("Unable to update query.");return(await r.json()).data as Query}
