"use client";
import {useEffect,useState} from "react";
import DoctorSidebar from "@/doctor-dashboard/components/DoctorSidebar";
import DoctorHeader from "@/doctor-dashboard/components/DoctorHeader";
import DoctorAttentionQueue from "@/doctor-dashboard/components/DoctorAttentionQueue";
import {fetchDoctorNotifications,markDoctorNotificationRead} from "@/lib/api/doctorNotifications";
import type {DoctorNotification} from "@/types/doctorNotification";
export default function DoctorNotificationsPage(){
 const[items,setItems]=useState<DoctorNotification[]>([]);
 useEffect(()=>{void fetchDoctorNotifications().then(setItems).catch(()=>setItems([]))},[]);
 return <div className="doctor-shell"><DoctorSidebar/><main className="doctor-main"><DoctorHeader/><section className="doctor-page"><DoctorAttentionQueue/><article className="doctor-card"><span className="doctor-eyebrow">NOTIFICATION HISTORY</span><h2>All care-team events</h2>{items.map(x=><div className="doctor-detail-row" key={x.notificationId}><strong>{x.title}</strong><span>{x.patientId} · {new Date(x.createdAt).toLocaleString("en-IN")} · {x.status}</span><p>{x.message}</p>{x.status==="unread"&&<button onClick={async()=>{const n=await markDoctorNotificationRead(x.notificationId);setItems(v=>v.map(i=>i.notificationId===n.notificationId?n:i))}}>Mark read</button>}</div>)}</article></section></main></div>
}