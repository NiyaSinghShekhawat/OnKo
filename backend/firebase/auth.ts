import { getAdminAuth } from "@/lib/firebase/admin";
import type { DecodedIdToken } from "firebase-admin/auth";

export async function verifyBearerToken(header: string | null): Promise<DecodedIdToken> {
  if (!header?.startsWith("Bearer ")) throw new Error("Missing authentication token.");
  return getAdminAuth().verifyIdToken(header.slice(7).trim());
}

export function patientIdFromToken(token: DecodedIdToken) {
  if (token.role !== "patient" || typeof token.patientId !== "string" || !token.patientId) {
    throw new Error("Authenticated account is not linked to a patient.");
  }
  return token.patientId;
}

export function doctorIdFromToken(token: DecodedIdToken) {
  if (token.role !== "doctor" || typeof token.doctorId !== "string" || !token.doctorId) {
    throw new Error("Authenticated account is not linked to a doctor.");
  }
  return token.doctorId;
}
