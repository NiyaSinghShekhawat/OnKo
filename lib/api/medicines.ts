import type { Medicine } from "@/types/medicine";

export async function fetchMedicines(): Promise<Medicine[]> {
  const response = await fetch("/api/medicines", { cache: "no-store" });
  if (!response.ok) throw new Error("Unable to load medicines.");
  const payload = await response.json();
  return payload.data as Medicine[];
}
