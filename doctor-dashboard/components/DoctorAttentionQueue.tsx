"use client";
import {useEffect,useMemo,useState} from "react";
import {fetchDoctorNotifications,markDoctorNotificationRead} from "@/lib/api/doctorNotifications";
import type {DoctorNotification} from "@/types/doctorNotification";

const priority:Record<DoctorNotification["type"],number>={"emergency":0,"new-report":1,"patient-query":2,"missed-follow-up":3,"caregiver-change":4,"milestone-change":5,"doctor-update":6};
export default function DoctorAttentionQueue(){
 const[items,setItems]=useState<DoctorNotification[]>([]);const[loading,setLoading]=useState(true);const[error,setError]=useState<string|null>(null);
 async function load(){try{setLoading(true);setError(null);setItems(await fetchDoctorNotifications())}catch(e){setError(e instanceof Error?e.message:"Unable to load attention queue.")}finally{setLoading(false)}}
 useEffect(()=>{void load();const id=window.setInterval(()=>void load(),30000);return()=>window.clearInterval(id)},[]);
 const pending=useMemo(()=>items.filter(x=>x.status==="unread").sort((a,b)=>priority[a.type]-priority[b.type]||new Date(b.createdAt).getTime()-new Date(a.createdAt).getTime()),[items]);
 async function open(item:DoctorNotification){try{await markDoctorNotificationRead(item.notificationId);setItems(v=>v.map(x=>x.notificationId===item.notificationId?{...x,status:"read"}:x))}catch(e){setError(e instanceof Error?e.message:"Unable to update notification.")}}
 if(loading)return <article className="doctor-card"><span className="doctor-eyebrow">ATTENTION QUEUE</span><h2>Loading care-team attention…</h2></article>;
 return <article className="doctor-card doctor-attention-queue">
  <div className="doctor-card-heading"><div><span className="doctor-eyebrow">ATTENTION QUEUE</span><h2>What needs your attention</h2><p className="doctor-muted-text">Cross-dashboard events from patient activity, reports, queries and safety workflows.</p></div><span className="doctor-neutral-pill">{pending.length} unread</span></div>
  {error&&<p className="doctor-directory-error">{error}</p>}
  {pending.length===0?<p className="doctor-muted-text">No new items require attention.</p>:pending.slice(0,8).map(x=><div className={`doctor-review-item doctor-attention-item doctor-attention-${x.type}`} key={x.notificationId}><div className="doctor-review-number">{x.type==="emergency"?"!":x.type==="new-report"?"▤":"•"}</div><div><strong>{x.title}</strong><p>{x.message}</p><small>{x.patientId} · {new Date(x.createdAt).toLocaleString("en-IN")}</small><button type="button" onClick={()=>void open(x)}>Mark handled</button></div></div>)}
 </article>
}