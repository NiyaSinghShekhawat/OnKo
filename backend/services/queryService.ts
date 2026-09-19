import type { Query, QueryMessage } from "@/types/query";
import { getDocument, listDocuments, listDocumentsByField, createDocument, setDocument } from "../firebase/firestore";

export const getQuery=(id:string)=>getDocument<Query>("queries",id);
export const listQueries=()=>listDocuments<Query>("queries");
export const listQueriesForPatient=(id:string)=>listDocumentsByField<Query>("queries","patientId",id);

export async function createPatientQuery(patientId: string, doctorId: string, subject: string, message: string) {
  const now = new Date().toISOString();
  const queryId = await createDocument<Query>("queries", {
    queryId: crypto.randomUUID(),
    patientId,
    doctorId,
    subject,
    status: "open",
    messages: [{ messageId: crypto.randomUUID(), senderId: patientId, senderRole: "patient", message, createdAt: now }],
    createdAt: now,
    updatedAt: now,
  });
  const created = await getDocument<Query>("queries", queryId);
  if (!created) throw new Error("Query was created but could not be loaded.");
  return created;
}

export async function appendPatientQueryMessage(patientId: string, queryId: string, message: string) {
  const query = await getDocument<Query>("queries", queryId);
  if (!query || query.patientId !== patientId) throw new Error("Query not found.");
  const nextMessage: QueryMessage = {
    messageId: crypto.randomUUID(),
    senderId: patientId,
    senderRole: "patient",
    message,
    createdAt: new Date().toISOString(),
  };
  await setDocument<Query>("queries", queryId, { ...query, messages: [...query.messages, nextMessage], updatedAt: nextMessage.createdAt });
  return (await getDocument<Query>("queries", queryId))!;
}
