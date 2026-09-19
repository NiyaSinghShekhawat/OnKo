"use client";

import { useState } from "react";
import { PatientShell } from "@/patient-dashboard/components/PatientShell";
import type { Query, QueryMessage } from "@/types/query";

const initialMessages: QueryMessage[] = [
  { messageId: "MSG-001", senderRole: "doctor", senderName: "Dr. S. Kulkarni", body: "Your latest care-plan update is available. Please use this space if you have questions about your upcoming visit.", sentAt: "Jul 16, 2026 · 10:30 AM" },
  { messageId: "MSG-002", senderRole: "patient", senderName: "Ananya", body: "Thank you, doctor. I have a question about my next appointment.", sentAt: "Jul 16, 2026 · 11:04 AM" },
];

const activeQuery: Query = {
  queryId: "QRY-021",
  patientId: "ONK-0821",
  doctorId: "DOC-001",
  subject: "Upcoming appointment",
  status: "open",
  createdAt: "Jul 16, 2026",
  messages: initialMessages,
};

export default function QueriesPage() {
  const [messages, setMessages] = useState(activeQuery.messages);
  const [draft, setDraft] = useState("");

  function sendMessage() {
    const body = draft.trim();
    if (!body) return;
    const next: QueryMessage = {
      messageId: `MSG-${messages.length + 1}`,
      senderRole: "patient",
      senderName: "Ananya",
      body,
      sentAt: "Just now",
    };
    setMessages((current) => [...current, next]);
    setDraft("");
  }

  return (
    <PatientShell>
      <main className="onko-page">
        <section className="patient-card">
          <span className="patient-eyebrow">ASK CARE TEAM</span>
          <h1 className="onko-page-title">Questions for your care team</h1>
          <p className="onko-page-subtitle">
            Send a question to your care team and keep the conversation with your care record.
          </p>
        </section>

        <section className="query-layout">
          <div className="patient-card query-list">
            <div className="patient-card-heading">
              <div>
                <span className="patient-eyebrow">CONVERSATIONS</span>
                <h2 className="journey-section-title">My queries</h2>
              </div>
              <span className="patient-time">1 open</span>
            </div>
            <button type="button" className="query-list-item active">
              <span className="query-list-status">OPEN</span>
              <strong>{activeQuery.subject}</strong>
              <span>Last message · Jul 16, 2026</span>
            </button>
          </div>

          <div className="patient-card query-thread">
            <div className="query-thread-header">
              <div>
                <span className="patient-eyebrow">QUERY</span>
                <h2>{activeQuery.subject}</h2>
              </div>
              <span className="clinical-status clinical-status--scheduled">Open</span>
            </div>

            <div className="query-messages">
              {messages.map((message) => (
                <div className={`query-message ${message.senderRole === "patient" ? "patient" : "doctor"}`} key={message.messageId}>
                  <span className="query-sender">{message.senderName}</span>
                  <p>{message.body}</p>
                  <time>{message.sentAt}</time>
                </div>
              ))}
            </div>

            <div className="query-composer">
              <textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Type your question for the care team..."
                rows={3}
                aria-label="Question for care team"
              />
              <button type="button" onClick={sendMessage}>Send question</button>
            </div>
          </div>
        </section>

        <section className="patient-safety-alert">
          <span className="patient-alert-icon">i</span>
          <div>
            <strong>Care-team communication</strong>
            <span>
              This space is for communication with your care team. It is not an emergency service and does not replace urgent medical care or the SOS pathway.
            </span>
          </div>
        </section>
      </main>
    </PatientShell>
  );
}
