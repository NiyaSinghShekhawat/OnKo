import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

function adminApp() {
  if (getApps().length) return getApps()[0];
  const key = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !key) {
    throw new Error("Firebase Admin environment variables are not configured.");
  }
  return initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: key,
    }),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });
}
export const getAdminAuth = () => getAuth(adminApp());
export const getAdminDb = () => getFirestore(adminApp());
export const getAdminStorage = () => getStorage(adminApp());
