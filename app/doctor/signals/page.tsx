"use client";
import {useEffect,useState} from "react";
import DoctorEngagementSignals from "@/doctor-dashboard/components/DoctorEngagementSignals";
import type {EngagementSignal} from "@/types/engagementSignal";
import {authenticatedFetch} from "@/lib/api/authenticatedFetch";

export default function DoctorSignalsPage(){
 const[signals,setSignals]=useState<EngagementSignal[]>([]);
 const[loading,setLoading]=useState(true);
 const[error,setError]=useState<string|null>(null);
 const params=typeof window!=="undefined"?new URLSearchParams(window.location.search):null;
 const patientId=params?.get("patientId")||"ONK-DEMO-001";
 const load=async()=>{try{setLoading(true);setError(null);const r=await authenticatedFetch("/api/doctor/engagement-signals?patientId="+encodeURIComponent(patientId));if(!r.ok)throw new Error("Unable to load engagement signals.");const d=await r.json();setSignals(d.signals||[])}catch(e){setError(e instanceof Error?e.message:"Unable to load engagement signals.")}finally{setLoading(false)}};
 useEffect(()=>{void load()},[patientId]);
 const review=async(signal:EngagementSignal,note:string)=>{const parts=note.split(": ");const status=parts[0] as "reviewed"|"dismissed";const reviewNote=parts.slice(1).join(": ");const r=await authenticatedFetch("/api/doctor/engagement-signals",{method:"PATCH",body:JSON.stringify({signalId:signal.signalId,status,reviewNote})});if(!r.ok)throw new Error("Unable to review engagement signal.");await load()};
 return <main className="doctor-page"><div className="doctor-page-heading"><span className="doctor-eyebrow">ENGAGEMENT SIGNALS</span><h1>AI Engagement Review</h1><p className="doctor-muted-text">Review patient-coordination signals before any care-team action.</p></div>{error&&<p className="doctor-directory-error">{error}</p>}{loading?<p>Loading signals…</p>:<DoctorEngagementSignals signals={signals} onReview={review}/>}</main>
}