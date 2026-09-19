import {NextRequest,NextResponse} from "next/server";import {runWhatsAppDeliverySweep} from "@/backend/services/whatsappDeliverySweep";
function authorized(r:NextRequest){const expected=process.env.CRON_SECRET;return !!expected&&r.headers.get("authorization")==="Bearer "+expected;}
export async function GET(r:NextRequest){if(!authorized(r))return NextResponse.json({error:"Unauthorized."},{status:401});try{return NextResponse.json({data:await runWhatsAppDeliverySweep()})}catch(e){console.error(e);return NextResponse.json({error:"Unable to run WhatsApp delivery sweep."},{status:500})}}
export async function POST(r:NextRequest){return GET(r);}
