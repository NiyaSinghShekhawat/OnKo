import { NextResponse } from "next/server";
import { listQueries } from "@/backend/services/queryService";

export async function GET() {
  try {
    const queries = await listQueries();
    return NextResponse.json({ data: queries });
  } catch (error) {
    console.error("GET /api/queries failed", error);
    return NextResponse.json(
      { error: "Unable to load queries." },
      { status: 500 },
    );
  }
}
