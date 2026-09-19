"use client";

import { getIdTokenResult, type User } from "firebase/auth";

export type OnKoRole = "doctor" | "patient";

export async function getOnKoRole(user: User): Promise<OnKoRole | null> {
  const token = await getIdTokenResult(user, true);
  const role = token.claims.role;
  return role === "doctor" || role === "patient" ? role : null;
}
