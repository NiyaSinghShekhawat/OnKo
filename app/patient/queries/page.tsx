"use client";
import { PatientShell } from "@/patient-dashboard/components/PatientShell";
import { usePatientContext } from "@/app/patient/data-provider";
import { createQuery } from "@/lib/api/queries";
import { useEffect, useState } from "react";

export default function QueriesPage() {
  const { patient, queries, loading, error } = usePatientContext();
  const [subject,setSubject]=useState("");
  const [draft,setDraft]=useState("");
  const [sending,setSending]=useState(false);
  const [sendError,setSendError]=useState<string|null>(null);
  const [selectedQueryId,setSelectedQueryId]=useState<string|null>(null);

  async function sendMessage(){
    if(!patient||!subject.trim()||!draft.trim()||sending)return;
    setSending(true);setSendError(null);
    try{await createQuery({subject:subject.trim(),message:draft.trim(),doctorId:patient.doctorId});setDraft("");setSubject("");window.location.reload();}
    catch(e){setSendError(e instanceof Error?e.message:"Unable to send question.");}
    finally{setSending(false);}
  }
  useEffect(()=>{if(!selectedQueryId&&queries.length)setSelectedQueryId(queries[0].queryId);},[queries,selectedQueryId]);
  const activeQuery=queries.find(q=>q.queryId===selectedQueryId)??queries[0];
  return <PatientShell><main className="onko-page">
    <section className="patient-card"><span className="patient-eyebrow">ASK CARE TEAM</span><h1 className="onko-page-title">Questions for your care team</h1><p className="onko-page-subtitle">Send a question to your care team and keep the conversation with your care record.</p></section>
    <section className="query-layout">
      <div className="patient-card query-list"><div className="patient-card-heading"><div><span className="patient-eyebrow">CONVERSATIONS</span><h2 className="journey-section-title">My queries</h2></div><span className="patient-time">{queries.length} total</span></div>
        {error?<p className="patient-muted">{error}</p>:queries.length?queries.map(q=><div className="query-list-item" key={q.queryId}><span className="query-list-status">{q.status.toUpperCase()}</span><strong>{q.subject}</strong><span>Last updated · {q.updatedAt}</span></div>):<p className="patient-muted">{loading?"Loading questions…":"No questions have been recorded yet."}</p>}
      </div>
      <div className="patient-card query-thread">
        <div className="query-thread-header"><div><span className="patient-eyebrow">NEW QUESTION</span><h2>Ask your care team</h2></div></div>
        <div className="query-composer">
          <input value={subject} onChange={e=>setSubject(e.target.value)} placeholder="Question subject" aria-label="Question subject"/>
          <textarea value={draft} onChange={e=>setDraft(e.target.value)} placeholder="Type your question for the care team..." rows={5} aria-label="Question for care team"/>
          <button type="button" onClick={sendMessage} disabled={sending||!patient}>{sending?"Sending…":"Send question"}</button>
          {sendError&&<p className="patient-muted">{sendError}</p>}
        </div>
        {activeQuery&&<div className="query-messages">{activeQuery.messages.map(m=><div className={`query-message ${m.senderRole==="patient"?"patient":"doctor"}`} key={m.messageId}><span className="query-sender">{m.senderRole==="patient"?"You":"Care Team"}</span><p>{m.message}</p><time>{m.createdAt}</time></div>)}</div>}
      </div>
    </section>
    <section className="patient-safety-alert"><span className="patient-alert-icon">i</span><div><strong>Care-team communication</strong><span>This space is for communication with your care team. It is not an emergency service and does not replace urgent medical care or the SOS pathway.</span></div></section>
  </main></PatientShell>;
}