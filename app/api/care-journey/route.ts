import { NextResponse } from "next/server";
import { listCareJourneys } from "@/backend/services/careJourneyService";

export async function GET() {
  try {
    const journeys = await listCareJourneys();
    return NextResponse.json({ data: journeys });
  } catch (error) {
    console.error("GET /api/care-journey failed", error);
    return NextResponse.json(
      { error: "Unable to load care journeys." },
      { status: 500 },
    );
  }
}
