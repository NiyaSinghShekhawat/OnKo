"use client";
import { useState } from "react";
import { triggerSOS } from "@/lib/api/sos";

export default function SOSButton() {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  async function sendSOS() {
    setLoading(true); setMessage(null);
    try {
      await triggerSOS();
      setMessage("SOS recorded. Follow your care team's emergency instructions and contact local emergency services if you are in immediate danger.");
      setConfirming(false);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to trigger SOS.");
    } finally { setLoading(false); }
  }
  return <div>
    {!confirming ? <button type="button" className="patient-sos-button" onClick={() => setConfirming(true)}>SOS / Safety</button> : <div className="patient-card">
      <strong>Trigger SOS?</strong><p>This records an urgent safety event for your configured OnKo care-team workflow. It does not replace local emergency services.</p>
      <button type="button" onClick={sendSOS} disabled={loading}>{loading ? "Sending…" : "Confirm SOS"}</button>
      <button type="button" onClick={() => setConfirming(false)} disabled={loading}>Cancel</button>
    </div>}
    {message && <p role="status">{message}</p>}
  </div>;
}
