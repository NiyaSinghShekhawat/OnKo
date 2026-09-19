import { NextRequest,NextResponse } from "next/server";
import { requirePatient } from "@/backend/api/auth";
import { listQueriesForPatient } from "@/backend/services/queryService";
export async function GET(request:NextRequest){const a=await requirePatient(request);if("error" in a)return a.error;try{return NextResponse.json({data:await listQueriesForPatient(a.patientId)});}catch(e){console.error(e);return NextResponse.json({error:"Unable to load queries."},{status:500});}}
