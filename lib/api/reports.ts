import type { Report } from "@/types/report";
import { authenticatedFetch } from "./authenticatedFetch";

export async function fetchReports():Promise<Report[]>{
  const r=await authenticatedFetch("/api/reports");
  if(!r.ok)throw new Error("Unable to load reports.");
  return (await r.json()).data as Report[];
}

export async function uploadReport(input:{file:File;title?:string;reportType?:string}):Promise<Report>{
  const form=new FormData();
  form.append("file",input.file);
  if(input.title)form.append("title",input.title);
  if(input.reportType)form.append("reportType",input.reportType);
  const r=await authenticatedFetch("/api/reports",{method:"POST",body:form});
  if(!r.ok){const body=await r.json().catch(()=>null);throw new Error(body?.error||"Unable to upload report.");}
  return (await r.json()).data as Report;
}
