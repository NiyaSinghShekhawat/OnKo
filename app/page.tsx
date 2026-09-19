import Link from "next/link";

export default function Home() {
  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg,#edf7f7,#f8fbfb)", display: "grid", placeItems: "center", padding: 24, color: "#123f48", fontFamily: "Arial, sans-serif" }}>
      <section style={{ width: "100%", maxWidth: 980, textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, display: "grid", placeItems: "center", background: "#0e5965", color: "white", fontWeight: 900 }}>O</div>
          <strong style={{ fontSize: 30 }}>OnKo</strong>
        </div>
        <p style={{ color: "#688086", letterSpacing: 1.2, fontSize: 12, fontWeight: 800 }}>CANCER CARE COORDINATION PLATFORM</p>
        <h1 style={{ fontSize: 48, lineHeight: 1.05, margin: "14px auto", maxWidth: 700 }}>Connected care for patients and care teams.</h1>
        <p style={{ maxWidth: 650, margin: "0 auto 34px", color: "#65777b", lineHeight: 1.7 }}>A prototype command center for coordinating patient journeys, treatments, reports, communication and human-reviewed AI signals.</p>
        <div style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
          <Link href="/login?role=doctor&next=/doctor" style={{ textDecoration: "none", background: "#0e5965", color: "white", padding: "14px 20px", borderRadius: 11, fontWeight: 800 }}>Doctor Command Center</Link>
          <Link href="/login?role=patient&next=/patient" style={{ textDecoration: "none", background: "white", color: "#164b55", padding: "14px 20px", borderRadius: 11, fontWeight: 800, border: "1px solid #cbdcde" }}>Patient Portal</Link>
        </div>
        <p style={{ marginTop: 28, fontSize: 12, color: "#7a8b8f" }}>Prototype only · Synthetic data · Clinical decisions remain with the care team</p>
      </section>
    </main>
  );
}
