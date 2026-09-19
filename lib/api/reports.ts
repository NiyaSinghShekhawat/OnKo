import type { Report } from "@/types/report";
import { authenticatedFetch } from "./authenticatedFetch";
export async function fetchReports():Promise<Report[]>{const r=await authenticatedFetch("/api/reports");if(!r.ok)throw new Error("Unable to load reports.");return (await r.json()).data as Report[];}
