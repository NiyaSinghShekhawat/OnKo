import type { Query } from "@/types/query";

export async function fetchQueries(): Promise<Query[]> {
  const response = await fetch("/api/queries", { cache: "no-store" });
  if (!response.ok) throw new Error("Unable to load queries.");
  const payload = await response.json();
  return payload.data as Query[];
}
