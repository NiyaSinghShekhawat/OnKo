import { getIdToken } from "firebase/auth";
import { auth } from "@/lib/firebase/client";

export async function authenticatedFetch(input: RequestInfo | URL, init: RequestInit = {}) {
  const user = auth.currentUser;
  if (!user) throw new Error("Please sign in to access patient data.");
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${await getIdToken(user)}`);
  return fetch(input, { ...init, headers, cache: "no-store" });
}
