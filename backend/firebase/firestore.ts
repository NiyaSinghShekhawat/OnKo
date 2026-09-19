import { type DocumentData, type Query } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase/admin";
import { COLLECTIONS, type FirestoreCollection } from "../types/firestore";

export function collectionRef<T extends DocumentData>(name: FirestoreCollection) {
  return getAdminDb().collection(COLLECTIONS[name]) as FirebaseFirestore.CollectionReference<T>;
}
export function documentRef<T extends DocumentData>(name: FirestoreCollection, id: string) {
  return collectionRef<T>(name).doc(id);
}
export async function getDocument<T extends DocumentData>(name: FirestoreCollection, id: string): Promise<T | null> {
  const s = await documentRef<T>(name, id).get();
  return s.exists ? ({ id: s.id, ...s.data() } as T) : null;
}
export async function listDocuments<T extends DocumentData>(name: FirestoreCollection, q?: Query<T> | null): Promise<T[]> {
  const s = await (q ?? collectionRef<T>(name)).get();
  return s.docs.map(d => ({ id: d.id, ...d.data() } as T));
}
export async function listDocumentsByField<T extends DocumentData>(name: FirestoreCollection, field: string, value: string): Promise<T[]> {
  return listDocuments<T>(name, collectionRef<T>(name).where(field, "==", value) as Query<T>);
}
export async function createDocument<T extends DocumentData>(name: FirestoreCollection, data: T) {
  return (await collectionRef<T>(name).add(data)).id;
}
export async function setDocument<T extends DocumentData>(name: FirestoreCollection, id: string, data: T) {
  await documentRef<T>(name, id).set(data);
}
export async function removeDocument(name: FirestoreCollection, id: string) {
  await documentRef(name, id).delete();
}
