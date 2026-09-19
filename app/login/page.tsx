"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getIdTokenResult, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase/client";

type Role = "patient" | "doctor";

const DEMO = {
  doctor: { email: "doctor.demo@onko.example", password: "OnKoDemo@2026!" },
  patient: { email: "patient.demo@onko.example", password: "OnKoDemo@2026!" },
};

function LoginPageContent() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("patient");
  const [email, setEmail] = useState(DEMO.patient.email);
  const [password, setPassword] = useState(DEMO.patient.password);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedRole: Role = params.get("role") === "doctor" ? "doctor" : "patient";
    const loginError = params.get("error");

    setRole(requestedRole);
    setEmail(DEMO[requestedRole].email);
    setPassword(DEMO[requestedRole].password);
    setError(
      loginError === "wrong-role"
        ? "That account belongs to the other OnKo workspace. Select the matching portal."
        : loginError === "session"
          ? "Your OnKo session could not be verified. Please sign in again."
          : ""
    );
  }, []);

  function chooseRole(value: Role) {
    setRole(value);
    setEmail(DEMO[value].email);
    setPassword(DEMO[value].password);
    setError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const token = await getIdTokenResult(credential.user, true);
      const actualRole = token.claims.role;

      if (actualRole !== role) {
        await auth.signOut();
        throw new Error("This account belongs to a different OnKo portal. Choose the correct workspace.");
      }

      const destination = role === "doctor" ? "/doctor" : "/patient";
      router.replace(destination);
    } catch (err) {
      console.error("OnKo login failed", err);
      setError(
        err instanceof Error && err.message.startsWith("This account")
          ? err.message
          : "Unable to sign in. Provision the demo accounts in Firebase Authentication first."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg,#edf7f7 0%,#f8fbfb 55%,#e8f3f3 100%)", display: "grid", placeItems: "center", padding: 24, color: "#123f48", fontFamily: "Arial, sans-serif" }}>
      <section style={{ width: "100%", maxWidth: 980, display: "grid", gridTemplateColumns: "0.9fr 1.1fr", background: "#fff", border: "1px solid #d7e4e5", borderRadius: 24, overflow: "hidden", boxShadow: "0 24px 70px rgba(17,62,70,.12)" }}>
        <div style={{ padding: 48, background: "#0e4b55", color: "white" }}>
          <div style={{ fontWeight: 800, fontSize: 30 }}>OnKo</div>
          <p style={{ opacity: .75, letterSpacing: 1 }}>CANCER CARE COORDINATION</p>
          <div style={{ marginTop: 80 }}>
            <span style={{ fontSize: 12, opacity: .7 }}>SECURE CLINICAL PORTAL</span>
            <h1 style={{ fontSize: 38, lineHeight: 1.08, margin: "12px 0" }}>One workspace.<br />Two care experiences.</h1>
            <p style={{ color: "#d6ebed", lineHeight: 1.7 }}>Choose the Doctor Command Center or Patient Companion. OnKo keeps clinical decisions with the care team while making the care journey easier to coordinate.</p>
          </div>
          <div style={{ marginTop: 54, padding: 16, border: "1px solid rgba(255,255,255,.2)", borderRadius: 14, fontSize: 13, lineHeight: 1.6 }}>
            <strong>Prototype mode</strong><br />
            All displayed demo records are synthetic and intended only for development and demonstration.
          </div>
        </div>

        <div style={{ padding: 48 }}>
          <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.2, color: "#668086" }}>WELCOME TO ONKO</span>
          <h2 style={{ margin: "8px 0 6px", fontSize: 30 }}>Sign in to your portal</h2>
          <p style={{ color: "#6c7d81", margin: "0 0 24px" }}>Select the workspace you want to open.</p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 24 }}>
            {(["patient", "doctor"] as Role[]).map((value) => (
              <button key={value} type="button" onClick={() => chooseRole(value)} style={{ border: role === value ? "2px solid #0e5965" : "1px solid #d6e1e3", background: role === value ? "#edf7f7" : "white", borderRadius: 14, padding: 16, textAlign: "left", cursor: "pointer", color: "#123f48" }}>
                <strong>{value === "patient" ? "Patient Portal" : "Doctor Command Center"}</strong>
                <small style={{ display: "block", marginTop: 5, color: "#718287" }}>{value === "patient" ? "Care journey & communication" : "Patients, reports & care operations"}</small>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} style={{ display: "grid", gap: 16 }}>
            <label style={{ display: "grid", gap: 7, fontWeight: 700, fontSize: 14 }}>
              Email
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="email" required style={{ padding: 13, border: "1px solid #cfdcde", borderRadius: 10, fontSize: 15 }} />
            </label>
            <label style={{ display: "grid", gap: 7, fontWeight: 700, fontSize: 14 }}>
              Password
              <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" autoComplete="current-password" required style={{ padding: 13, border: "1px solid #cfdcde", borderRadius: 10, fontSize: 15 }} />
            </label>

            {error && <div role="alert" style={{ padding: 12, borderRadius: 10, background: "#fff1f1", border: "1px solid #f1caca", color: "#a33a3a", fontSize: 14 }}>{error}</div>}

            <button type="submit" disabled={loading} style={{ border: 0, borderRadius: 11, padding: 14, background: "#0e5965", color: "white", fontWeight: 800, fontSize: 15, cursor: loading ? "wait" : "pointer" }}>
              {loading ? "Signing in…" : `Enter ${role === "doctor" ? "Doctor Workspace" : "Patient Portal"}`}
            </button>
          </form>

          <div style={{ marginTop: 24, padding: 16, borderRadius: 14, background: "#f5f9f9", border: "1px solid #dbe7e8" }}>
            <strong>Demo credentials</strong>
            <div style={{ marginTop: 10, fontSize: 13, color: "#607479", lineHeight: 1.8 }}>
              <div><strong>{role === "doctor" ? "Doctor" : "Patient"} email:</strong> {DEMO[role].email}</div>
              <div><strong>Password:</strong> {DEMO[role].password}</div>
              <div style={{ marginTop: 6 }}>These credentials are for the synthetic OnKo prototype only.</div>
            </div>
          </div>
        </div>
      </section>
      <p style={{ position: "fixed", bottom: 10, fontSize: 12, color: "#718287" }}>OnKo prototype · Synthetic data only · Human clinical oversight</p>
    </main>
  );
}

export default function LoginPage() {
  return <LoginPageContent />;
}
