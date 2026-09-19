import type { CareJourney } from "@/types/careJourney";
import { authenticatedFetch } from "./authenticatedFetch";
export async function fetchCareJourneys():Promise<CareJourney[]>{const r=await authenticatedFetch("/api/care-journey");if(!r.ok)throw new Error("Unable to load care journeys.");return (await r.json()).data as CareJourney[];}
