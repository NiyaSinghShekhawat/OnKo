import type { Medicine } from "@/types/medicine";
import { authenticatedFetch } from "./authenticatedFetch";
export async function fetchMedicines():Promise<Medicine[]>{const r=await authenticatedFetch("/api/medicines");if(!r.ok)throw new Error("Unable to load medicines.");return (await r.json()).data as Medicine[];}
