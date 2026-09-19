import { NextResponse } from "next/server";
import { listAppointments } from "@/backend/services/appointmentService";

export async function GET() {
  try {
    const appointments = await listAppointments();
    return NextResponse.json({ data: appointments });
  } catch (error) {
    console.error("GET /api/appointments failed", error);
    return NextResponse.json(
      { error: "Unable to load appointments." },
      { status: 500 },
    );
  }
}
