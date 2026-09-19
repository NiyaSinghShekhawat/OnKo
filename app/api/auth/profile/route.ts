import { NextRequest, NextResponse } from "next/server";
import { verifyBearerToken } from "@/backend/firebase/auth";

export async function GET(request: NextRequest) {
  try {
    const token = await verifyBearerToken(request.headers.get("authorization"));
    return NextResponse.json({
      data: {
        uid: token.uid,
        email: token.email ?? null,
        role: token.role ?? null,
        patientId: token.patientId ?? null,
        doctorId: token.doctorId ?? null,
        caregiverId: token.caregiverId ?? null,
      },
    });
  } catch (error) {
    console.error("GET /api/auth/profile failed", error);
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }
}
