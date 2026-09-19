import { NextRequest, NextResponse } from "next/server";
import { requireDoctor } from "@/backend/api/auth";
import {
  detectAndStoreEngagementSignals,
  listPatientEngagementSignals,
  reviewEngagementSignal,
} from "@/backend/services/engagementSignalService";

export async function GET(request: NextRequest) {
  const auth = await requireDoctor(request);
  if ("error" in auth) return auth.error;

  try {
    const patientId = new URL(request.url).searchParams.get("patientId");
    if (!patientId) {
      return NextResponse.json({ error: "patientId is required." }, { status: 400 });
    }

    const detected = await detectAndStoreEngagementSignals(patientId, auth.doctorId);
    const existing = await listPatientEngagementSignals(patientId);
    const ids = new Set(detected.map((signal) => signal.signalId));
    const data = existing.filter((signal) => signal.doctorId === auth.doctorId || ids.has(signal.signalId));

    return NextResponse.json({ data });
  } catch (error) {
    console.error("GET /api/doctor/signals failed", error);
    return NextResponse.json({ error: "Unable to load engagement signals." }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const auth = await requireDoctor(request);
  if ("error" in auth) return auth.error;

  try {
    const body = await request.json();
    if (!body.signalId || !["reviewed", "dismissed"].includes(body.status)) {
      return NextResponse.json({ error: "Signal ID and valid review status are required." }, { status: 400 });
    }

    const result = await reviewEngagementSignal(
      String(body.signalId),
      auth.doctorId,
      body.status,
      String(body.note ?? ""),
    );

    return NextResponse.json({ data: result });
  } catch (error) {
    console.error("PATCH /api/doctor/signals failed", error);
    return NextResponse.json({ error: "Unable to review signal." }, { status: 500 });
  }
}
