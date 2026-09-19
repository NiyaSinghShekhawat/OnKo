import {authenticatedFetch} from "@/lib/api/authenticatedFetch";
export async function getReportAccessUrl(reportId:string){const r=await authenticatedFetch("/api/reports/"+encodeURIComponent(reportId)+"/access");if(!r.ok)throw new Error("Unable to access report.");return (await r.json()).url as string;}
