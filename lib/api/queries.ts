import type { Query } from "@/types/query";
import { authenticatedFetch } from "./authenticatedFetch";
export async function fetchQueries():Promise<Query[]>{const r=await authenticatedFetch("/api/queries");if(!r.ok)throw new Error("Unable to load queries.");return (await r.json()).data as Query[];}
export async function createQuery(input:{subject:string;message:string;doctorId:string}):Promise<Query>{const r=await authenticatedFetch("/api/queries",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(input)});if(!r.ok)throw new Error((await r.json()).error ?? "Unable to create query.");return (await r.json()).data as Query;}
