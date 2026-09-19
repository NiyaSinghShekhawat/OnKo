import { NextRequest, NextResponse } from "next/server";
import { requirePatient } from "@/backend/api/auth";
import { getPatient } from "@/backend/services/patientService";
export async function GET(request:NextRequest){const a=await requirePatient(request);if("error" in a)return a.error;try{return NextResponse.json({data:(await getPatient(a.patientId))?[await getPatient(a.patientId)]:[]});}catch(e){console.error(e);return NextResponse.json({error:"Unable to load patient."},{status:500});}}
