import { NextResponse } from "next/server";
import { listMedicines } from "@/backend/services/medicineService";

export async function GET() {
  try {
    const medicines = await listMedicines();
    return NextResponse.json({ data: medicines });
  } catch (error) {
    console.error("GET /api/medicines failed", error);
    return NextResponse.json(
      { error: "Unable to load medicines." },
      { status: 500 },
    );
  }
}
