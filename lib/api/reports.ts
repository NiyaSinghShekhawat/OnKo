import type { Report } from "@/types/report";

export async function fetchReports(): Promise<Report[]> {
  const response = await fetch("/api/reports", { cache: "no-store" });
  if (!response.ok) throw new Error("Unable to load reports.");
  const payload = await response.json();
  return payload.data as Report[];
}
