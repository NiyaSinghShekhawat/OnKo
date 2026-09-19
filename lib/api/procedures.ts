import type { Procedure } from "@/types/procedure";
import { authenticatedFetch } from "./authenticatedFetch";

export async function fetchProcedures(): Promise<Procedure[]> {
  const response = await authenticatedFetch("/api/procedures");
  if (!response.ok) throw new Error("Unable to load procedures.");
  return (await response.json()).data as Procedure[];
}
