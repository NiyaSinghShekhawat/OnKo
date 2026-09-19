import { authenticatedFetch } from "./authenticatedFetch";
import type { SOSEvent } from "@/types/sos";

export async function triggerSOS(message?: string): Promise<SOSEvent> {
  const response = await authenticatedFetch("/api/sos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(body?.error ?? "Unable to trigger SOS.");
  return body.data as SOSEvent;
}
