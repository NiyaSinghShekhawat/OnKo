"use client";

import {
  onAuthStateChanged,
  signOut,
  type User,
} from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import type { AuthUser } from "../types/auth";

export function mapFirebaseUser(user: User | null): AuthUser | null {
  if (!user) return null;

  const role = (user.displayName?.startsWith("doctor:")
    ? "doctor"
    : user.displayName?.startsWith("admin:")
      ? "admin"
      : user.displayName?.startsWith("caregiver:")
        ? "caregiver"
        : "patient") as AuthUser["role"];

  return {
    uid: user.uid,
    email: user.email,
    role,
  };
}

export function subscribeToAuth(
  callback: (user: AuthUser | null) => void,
) {
  return onAuthStateChanged(auth, (user) => callback(mapFirebaseUser(user)));
}

export function logout() {
  return signOut(auth);
}
