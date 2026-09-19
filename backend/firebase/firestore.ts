import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  type CollectionReference,
  type DocumentData,
  type DocumentReference,
  type Query,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { COLLECTIONS, type FirestoreCollection } from "../types/firestore";

export function collectionRef<T extends DocumentData>(
  collectionName: FirestoreCollection,
): CollectionReference<T> {
  return collection(db, COLLECTIONS[collectionName]) as CollectionReference<T>;
}

export function documentRef<T extends DocumentData>(
  collectionName: FirestoreCollection,
  documentId: string,
): DocumentReference<T> {
  return doc(db, COLLECTIONS[collectionName], documentId) as DocumentReference<T>;
}

export async function getDocument<T extends DocumentData>(
  collectionName: FirestoreCollection,
  documentId: string,
): Promise<T | null> {
  const snapshot = await getDoc(documentRef<T>(collectionName, documentId));
  return snapshot.exists() ? ({ id: snapshot.id, ...snapshot.data() } as T) : null;
}

export async function listDocuments<T extends DocumentData>(
  collectionName: FirestoreCollection,
  constraints: Query<T> | null = null,
): Promise<T[]> {
  const target = constraints ?? collectionRef<T>(collectionName);
  const snapshot = await getDocs(target);
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() } as T));
}

export async function createDocument<T extends DocumentData>(
  collectionName: FirestoreCollection,
  data: T,
): Promise<string> {
  const created = await addDoc(collectionRef<T>(collectionName), data);
  return created.id;
}

export async function setDocument<T extends DocumentData>(
  collectionName: FirestoreCollection,
  documentId: string,
  data: T,
): Promise<void> {
  await setDoc(documentRef<T>(collectionName, documentId), data);
}

export async function removeDocument(
  collectionName: FirestoreCollection,
  documentId: string,
): Promise<void> {
  await deleteDoc(documentRef(collectionName, documentId));
}
