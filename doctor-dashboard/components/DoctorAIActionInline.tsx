"use client";
import {useEffect,useState} from "react";
import type {DoctorActionTask} from "@/types/doctorActionTask";
import {createDoctorActionTask,fetchDoctorActionTasks,updateDoctorActionTask} from "@/lib/api/doctorActionTasks";
export default function DoctorAIActionInline({patientId,signalId,title}:{patientId:string;signalId:string;title:string}){
 const[tasks,setTasks]=useState<DoctorActionTask[]>([]),[note,setNote]=useState(""),[open,setOpen]=useState(false),[busy,setBusy]=useState(false),[error,setError]=useState<string|null>(null);
 useEffect(()=>{fetchDoctorActionTasks(patientId).then(x=>setTasks(x.filter(t=>t.signalId===signalId))).catch(()=>{})},[patientId,signalId]);
 async function create(){if(!open){setOpen(true);return}setBusy(true);try{const t=await createDoctorActionTask({patientId,signalId,title,note:note.trim()||undefined});setTasks(x=>[t,...x]);setNote("");setOpen(false)}catch(e){setError(e instanceof Error?e.message:"Unable to create follow-up task.")}finally{setBusy(false)}}
 async function complete(id:string){setBusy(true);try{const t=await updateDoctorActionTask(id,"completed");setTasks(x=>x.map(v=>v.taskId===id?t:v))}catch(e){setError(e instanceof Error?e.message:"Unable to complete task.")}finally{setBusy(false)}}
 return <div className="doctor-inline-handoff"><button disabled={busy} onClick={create}>{open?"Save doctor follow-up":"Create doctor follow-up"}</button>{open&&<input value={note} onChange={e=>setNote(e.target.value)} placeholder="Optional follow-up note"/>}{error&&<small>{error}</small>}{tasks.map(t=>t.status==="open"?<span key={t.taskId}><b>Open follow-up</b>{t.note?" · "+t.note:""} <button disabled={busy} onClick={()=>complete(t.taskId)}>Complete</button></span>:<span key={t.taskId}><b>Completed follow-up</b></span>)}</div>;
}
