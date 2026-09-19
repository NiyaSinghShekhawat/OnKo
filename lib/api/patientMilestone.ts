import type { Milestone } from "@/types/milestone";
import { authenticatedFetch } from "./authenticatedFetch";

export async function completePatientMilestone(milestoneId: string): Promise<Milestone> {
  const response = await authenticatedFetch("/api/milestones", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ milestoneId, status: "completed" }),
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.error ?? "Unable to complete milestone.");
  }
  return (await response.json()).data as Milestone;
}
