import type { CareJourney } from "@/types/careJourney";

export async function fetchCareJourneys(): Promise<CareJourney[]> {
  const response = await fetch("/api/care-journey", { cache: "no-store" });
  if (!response.ok) throw new Error("Unable to load care journeys.");
  const payload = await response.json();
  return payload.data as CareJourney[];
}
