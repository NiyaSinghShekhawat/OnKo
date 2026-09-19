import { NextRequest, NextResponse } from "next/server";
import { doctorIdFromToken, patientIdFromToken, verifyBearerToken } from "@/backend/firebase/auth";

export async function requirePatient(request: NextRequest) {
  try {
    return { patientId: patientIdFromToken(await verifyBearerToken(request.headers.get("authorization"))) };
  } catch (error) {
    console.error("Patient authentication failed", error);
    return { error: NextResponse.json({ error: "Authentication required." }, { status: 401 }) };
  }
}

export async function requireDoctor(request: NextRequest) {
  try {
    return { doctorId: doctorIdFromToken(await verifyBearerToken(request.headers.get("authorization"))) };
  } catch (error) {
    console.error("Doctor authentication failed", error);
    return { error: NextResponse.json({ error: "Doctor authentication required." }, { status: 401 }) };
  }
}
