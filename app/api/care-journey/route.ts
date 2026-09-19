import { NextRequest,NextResponse } from "next/server";
import { requirePatient } from "@/backend/api/auth";
import { listCareJourneysForPatient } from "@/backend/services/careJourneyService";
export async function GET(request:NextRequest){const a=await requirePatient(request);if("error" in a)return a.error;try{return NextResponse.json({data:await listCareJourneysForPatient(a.patientId)});}catch(e){console.error(e);return NextResponse.json({error:"Unable to load care journey."},{status:500});}}
