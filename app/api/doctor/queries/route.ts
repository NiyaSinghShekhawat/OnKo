import { NextRequest, NextResponse } from "next/server";
import { requireDoctor } from "@/backend/api/auth";
import { getPatient } from "@/backend/services/patientService";
import { getQuery } from "@/backend/services/queryService";
import { setDocument } from "@/backend/firebase/firestore";
import { notifyQueryUpdate } from "@/backend/services/notificationTriggers";
import type { Query, QueryMessage } from "@/types/query";

export async function POST(request: NextRequest) {
  const auth = await requireDoctor(request);
  if ("error" in auth) return auth.error;
  try {
    const body = await request.json();
    const queryId = typeof body.queryId === "string" ? body.queryId : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";
    if (!queryId || !message) return NextResponse.json({ error: "Query and message are required." }, { status: 400 });
    const query = await getQuery(queryId);
    if (!query) return NextResponse.json({ error: "Query not found." }, { status: 404 });
    if (query.doctorId !== auth.doctorId) return NextResponse.json({ error: "Query not found." }, { status: 404 });
    const patient = await getPatient(query.patientId);
    if (!patient || patient.doctorId !== auth.doctorId) return NextResponse.json({ error: "Query not found." }, { status: 404 });
    const now = new Date().toISOString();
    const reply: QueryMessage = { messageId: crypto.randomUUID(), senderId: auth.doctorId, senderRole: "doctor", message, createdAt: now };
    const next: Query = { ...query, status: "answered", messages: [...query.messages, reply], updatedAt: now };
    await setDocument<Query>("queries", queryId, next);
    await notifyQueryUpdate(query.patientId, queryId, query.subject);
    return NextResponse.json({ data: next });
  } catch (error) {
    console.error("POST /api/doctor/queries/reply failed", error);
    return NextResponse.json({ error: "Unable to send reply." }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const auth = await requireDoctor(request);
  if ("error" in auth) return auth.error;
  try {
    const body = await request.json();
    const queryId = typeof body.queryId === "string" ? body.queryId : "";
    const status = body.status;
    if (!queryId || !["open", "answered", "resolved"].includes(status)) return NextResponse.json({ error: "Query ID and valid status are required." }, { status: 400 });
    const query = await getQuery(queryId);
    if (!query || query.doctorId !== auth.doctorId) return NextResponse.json({ error: "Query not found." }, { status: 404 });
    const patient = await getPatient(query.patientId);
    if (!patient || patient.doctorId !== auth.doctorId) return NextResponse.json({ error: "Query not found." }, { status: 404 });
    const next = { ...query, status, updatedAt: new Date().toISOString() } as Query;
    await setDocument<Query>("queries", queryId, next);
    return NextResponse.json({ data: next });
  } catch (error) {
    console.error("PATCH /api/doctor/queries failed", error);
    return NextResponse.json({ error: "Unable to update query." }, { status: 500 });
  }
}
