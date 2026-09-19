import type { Query } from "@/types/query";
import { authenticatedFetch } from "./authenticatedFetch";
export async function fetchQueries():Promise<Query[]>{const r=await authenticatedFetch("/api/queries");if(!r.ok)throw new Error("Unable to load queries.");return (await r.json()).data as Query[];}
