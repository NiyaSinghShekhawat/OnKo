"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.push("/patient");
    } catch (err) {
      console.error("Login failed", err);
      setError("Unable to sign in. Check your credentials and account setup.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
      <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: 420, display: "grid", gap: 16 }}>
        <div>
          <p>OnKo</p>
          <h1>Patient sign in</h1>
          <p>Sign in to access your care dashboard.</p>
        </div>
        <label>
          Email
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="email" required />
        </label>
        <label>
          Password
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" autoComplete="current-password" required />
        </label>
        {error && <p role="alert">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </main>
  );
}
