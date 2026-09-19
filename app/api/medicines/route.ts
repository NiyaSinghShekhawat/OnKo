import { NextRequest,NextResponse } from "next/server";
import { requirePatient } from "@/backend/api/auth";
import { listMedicinesForPatient } from "@/backend/services/medicineService";
export async function GET(request:NextRequest){const a=await requirePatient(request);if("error" in a)return a.error;try{return NextResponse.json({data:await listMedicinesForPatient(a.patientId)});}catch(e){console.error(e);return NextResponse.json({error:"Unable to load medicines."},{status:500});}}
