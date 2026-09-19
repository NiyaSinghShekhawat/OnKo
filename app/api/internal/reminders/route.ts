import { NextRequest, NextResponse } from "next/server";
import { runReminderSweep } from "@/backend/services/reminderSweep";

function authorized(request: NextRequest) {
  const configured = process.env.CRON_SECRET;
  if (!configured) return false;
  const header = request.headers.get("authorization");
  return header === `Bearer ${configured}`;
}

async function execute(request: NextRequest) {
  if (!authorized(request)) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  try {
    const result = await runReminderSweep();
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    console.error("Reminder sweep failed", error);
    return NextResponse.json({ error: "Reminder sweep failed." }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  return execute(request);
}

export async function POST(request: NextRequest) {
  return execute(request);
}
