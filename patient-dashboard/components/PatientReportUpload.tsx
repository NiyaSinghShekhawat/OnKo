"use client";

import { useRef, useState } from "react";
import type { Report } from "@/types/report";
import { uploadReport } from "@/lib/api/reports";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["application/pdf", "image/jpeg", "image/png"]);

export default function PatientReportUpload({ onUploaded }: { onUploaded: (report: Report) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [reportType, setReportType] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const chooseFile = (next: File | undefined) => {
    setError(null);
    if (!next) return;
    if (!ALLOWED_TYPES.has(next.type)) {
      setFile(null);
      setError("Only PDF, JPEG, and PNG reports are supported.");
      return;
    }
    if (next.size > MAX_FILE_SIZE) {
      setFile(null);
      setError("Report files must be 10 MB or smaller.");
      return;
    }
    setFile(next);
  };

  const submit = async () => {
    if (!file) {
      setError("Choose a report file first.");
      return;
    }
    try {
      setUploading(true);
      setError(null);
      const report = await uploadReport({ file, title: title.trim() || undefined, reportType: reportType.trim() || undefined });
      onUploaded(report);
      setFile(null);
      setTitle("");
      setReportType("");
      if (inputRef.current) inputRef.current.value = "";
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to upload report.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className="patient-card">
      <div className="patient-card-heading">
        <div>
          <span className="patient-eyebrow">UPLOAD RECORD</span>
          <h2 className="journey-section-title">Add a report</h2>
          <p className="onko-page-subtitle">Upload a PDF, JPEG, or PNG for your care team to review.</p>
        </div>
      </div>
      <div className="patient-form-grid">
        <label>Report file<input ref={inputRef} type="file" accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png" onChange={(e) => chooseFile(e.target.files?.[0])} /></label>
        <label>Title <span className="patient-muted">(optional)</span><input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Blood test report" /></label>
        <label>Report type <span className="patient-muted">(optional)</span><input value={reportType} onChange={(e) => setReportType(e.target.value)} placeholder="e.g. Laboratory" /></label>
      </div>
      {file && <p className="patient-muted">Selected: {file.name} · {(file.size / 1024 / 1024).toFixed(2)} MB</p>}
      {error && <p className="patient-directory-error">{error}</p>}
      <button type="button" className="report-view-button" onClick={submit} disabled={!file || uploading}>
        {uploading ? "Uploading…" : "Upload report"}
      </button>
    </section>
  );
}
