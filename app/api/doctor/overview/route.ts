import { NextRequest,NextResponse } from "next/server";
import { requireDoctor } from "@/backend/api/auth";
import { getDoctorOverview } from "@/backend/services/doctorOverviewService";
export async function GET(request:NextRequest){const a=await requireDoctor(request);if("error"in a)return a.error;try{return NextResponse.json({data:await getDoctorOverview(a.doctorId)})}catch(e){console.error(e);return NextResponse.json({error:"Unable to load doctor overview."},{status:500})}}