import { NextResponse } from "next/server";
import { listPatients } from "@/backend/services/patientService";

export async function GET() {
  try {
    const patients = await listPatients();
    return NextResponse.json({ data: patients });
  } catch (error) {
    console.error("GET /api/patients failed", error);
    return NextResponse.json(
      { error: "Unable to load patients." },
      { status: 500 },
    );
  }
}
