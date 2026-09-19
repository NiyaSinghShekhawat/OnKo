"use client";

import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFirebaseConfig } from "./config";

const firebaseApp = getApps().length > 0
  ? getApp()
  : initializeApp(getFirebaseConfig());

export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);

export default firebaseApp;
