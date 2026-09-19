import type { Milestone } from "@/types/milestone";
import { authenticatedFetch } from "./authenticatedFetch";

export async function fetchMilestones(): Promise<Milestone[]> {
  const response = await authenticatedFetch("/api/milestones");
  if (!response.ok) throw new Error("Unable to load milestones.");
  return (await response.json()).data as Milestone[];
}
