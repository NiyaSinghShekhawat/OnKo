"use client";
import { PatientShell } from "@/patient-dashboard/components/PatientShell";
import { usePatientContext } from "@/app/patient/data-provider";
import type { QueryMessage } from "@/types/query";
import { useState } from "react";

export default function QueriesPage() {
  const { queries, loading, error } = usePatientContext();
  const [draft, setDraft] = useState("");
  const activeQuery = queries[0];
  const messages = activeQuery?.messages ?? [];
  function sendMessage() {
    if (!draft.trim()) return;
    setDraft("");
  }
  return <PatientShell><main className="onko-page"><section className="patient-card"><span className="patient-eyebrow">ASK CARE TEAM</span><h1 className="onko-page-title">Questions for your care team</h1><p className="onko-page-subtitle">Send a question to your care team and keep the conversation with your care record.</p></section><section className="query-layout"><div className="patient-card query-list"><div className="patient-card-heading"><div><span className="patient-eyebrow">CONVERSATIONS</span><h2 className="journey-section-title">My queries</h2></div><span className="patient-time">{queries.length} total</span></div>{error ? <p className="patient-muted">{error}</p> : queries.length ? queries.map((q)=><button type="button" className={`query-list-item${q.queryId === activeQuery?.queryId ? " active" : ""}`} key={q.queryId}><span className="query-list-status">{q.status.toUpperCase()}</span><strong>{q.subject}</strong><span>Last updated · {q.updatedAt}</span></button>) : <p className="patient-muted">{loading ? "Loading questions…" : "No questions have been recorded yet."}</p>}</div><div className="patient-card query-thread">{activeQuery ? <><div className="query-thread-header"><div><span className="patient-eyebrow">QUERY</span><h2>{activeQuery.subject}</h2></div><span className="clinical-status clinical-status--scheduled">{activeQuery.status}</span></div><div className="query-messages">{messages.map((message: QueryMessage)=><div className={`query-message ${message.senderRole === "patient" ? "patient" : "doctor"}`} key={message.messageId}><span className="query-sender">{message.senderName}</span><p>{message.body}</p><time>{message.sentAt}</time></div>)}</div><div className="query-composer"><textarea value={draft} onChange={(e)=>setDraft(e.target.value)} placeholder="Type your question for the care team..." rows={3} aria-label="Question for care team"/><button type="button" onClick={sendMessage}>Send question</button></div></> : <div><h2>No query selected</h2><p className="patient-muted">{loading ? "Loading your care-team conversations…" : "Create a question to start a conversation with your care team."}</p></div>}</div></section><section className="patient-safety-alert"><span className="patient-alert-icon">i</span><div><strong>Care-team communication</strong><span>This space is for communication with your care team. It is not an emergency service and does not replace urgent medical care or the SOS pathway.</span></div></section></main></PatientShell>;
}