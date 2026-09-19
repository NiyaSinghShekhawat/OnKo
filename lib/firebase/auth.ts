"use client";

import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { auth } from "./client";

export function subscribeToUser(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export function logout() {
  return signOut(auth);
}
