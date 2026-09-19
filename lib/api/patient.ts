import type { Patient } from "@/types/patient";
import { authenticatedFetch } from "./authenticatedFetch";
export async function fetchPatients():Promise<Patient[]>{const r=await authenticatedFetch("/api/patients");if(!r.ok)throw new Error("Unable to load patients.");return (await r.json()).data as Patient[];}
