import { NextRequest, NextResponse } from "next/server";
import { patientIdFromToken, verifyBearerToken } from "@/backend/firebase/auth";

export async function requirePatient(request: NextRequest) {
  try {
    return { patientId: patientIdFromToken(await verifyBearerToken(request.headers.get("authorization"))) };
  } catch (error) {
    console.error("Patient authentication failed", error);
    return { error: NextResponse.json({ error: "Authentication required." }, { status: 401 }) };
  }
}
