"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/services/api";

type CertificateData = { certificateId: string; learnerName: string; competitionName: string; rank: number; issuedAt: string; issuer: string };
export default function CompetitionCertificatePage() {
  const params = useParams<{ certificateId: string }>();
  const id = String(params.certificateId || "").replace(/^SQLW-/i, "").toUpperCase();
  const [certificate, setCertificate] = useState<CertificateData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => { if (!id) return; api.get("/certificate/competition/verify/" + encodeURIComponent(id)).then(r => { if (r.data?.valid) setCertificate(r.data.certificate); else setError(r.data?.message || "Certificate not found."); }).catch(e => setError(e?.response?.data?.message || "This certificate could not be loaded.")).finally(() => setLoading(false)); }, [id]);
  return <main style={{ minHeight: "100vh", background: "#eef2f7", padding: "32px 16px", color: "#172033" }}>
    <div className="no-print" style={{ maxWidth: 1000, margin: "0 auto 18px", display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}><a href="/account">← Back to profile</a><button onClick={() => window.print()} disabled={!certificate} style={{ padding: "12px 18px", border: 0, borderRadius: 8, background: "#facc15", fontWeight: 800, cursor: "pointer" }}>Download / Save as PDF</button></div>
    {loading ? <p style={{ textAlign: "center" }}>Loading certificate…</p> : error ? <p role="alert" style={{ textAlign: "center" }}>{error}</p> : certificate ? <article className="certificate-print" style={{ boxSizing: "border-box", maxWidth: 1000, minHeight: 650, margin: "auto", padding: "64px 56px", background: "#fff", border: "12px double #c69b32", textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", boxShadow: "0 20px 60px rgba(15,23,42,.12)" }}>
      <div style={{ fontSize: 13, letterSpacing: ".28em", fontWeight: 800, color: "#8b6a20" }}>SQLWHALE · WEBXWHALE</div>
      <div style={{ width: 90, height: 4, background: "#c69b32", margin: "28px auto" }} />
      <h1 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(34px,5vw,58px)", margin: "0 0 16px", color: "#14213d" }}>Certificate of Achievement</h1>
      <p style={{ fontSize: 17, color: "#596579" }}>This certificate is proudly presented to</p>
      <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(30px,4vw,46px)", color: "#8b6a20", margin: "16px 0" }}>{certificate.learnerName}</h2>
      <p style={{ maxWidth: 680, lineHeight: 1.8, fontSize: 16 }}>For securing <strong>Rank #{certificate.rank}</strong> in <strong>{certificate.competitionName}</strong>, demonstrating SQL knowledge, problem-solving ability and dedication.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 48, width: "100%", marginTop: 54, marginBottom: 38 }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ minHeight: 42, display: "flex", alignItems: "end", justifyContent: "center", borderBottom: "1px solid #9aa3b2", paddingBottom: 5 }}>
            <span style={{ fontFamily: "'Brush Script MT', 'Segoe Script', cursive", fontSize: 34, fontStyle: "italic", color: "#172554" }}>Danish Khan</span>
          </div>
          <div style={{ fontSize: 12, color: "#667085", marginTop: 4 }}>Co-Founder, WEBXWHALE</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ minHeight: 42, display: "flex", alignItems: "end", justifyContent: "center", borderBottom: "1px solid #9aa3b2", paddingBottom: 5 }}>
            <span style={{ fontFamily: "'Brush Script MT', 'Segoe Script', cursive", fontSize: 34, fontStyle: "italic", color: "#172554" }}>Ismail Shaikh</span>
          </div>
          <div style={{ fontSize: 12, color: "#667085", marginTop: 4 }}>Co-Founder, WEBXWHALE</div>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 24, flexWrap: "wrap", width: "100%", borderTop: "1px solid #d9dee8", paddingTop: 18, textAlign: "left" }}>
        <div><strong>{new Date(certificate.issuedAt).toLocaleDateString("en-IN",{day:"2-digit",month:"long",year:"numeric"})}</strong><div style={{ fontSize: 12, color: "#667085", marginTop: 5 }}>DATE OF ISSUE</div></div>
        <div><strong>{certificate.issuer}</strong><div style={{ fontSize: 12, color: "#667085", marginTop: 5 }}>ISSUED BY</div></div>
        <div><strong>SQLW-{certificate.certificateId}</strong><div style={{ fontSize: 12, color: "#667085", marginTop: 5 }}>CERTIFICATE ID</div></div>
      </div>
    </article> : null}
    <style jsx global>{`
      @media print {
        @page { size: A4 landscape; margin: 0; }
        html, body { width: 297mm !important; height: 210mm !important; margin: 0 !important; padding: 0 !important; overflow: hidden !important; background: #fff !important; }
        body * { visibility: hidden !important; }
        .certificate-print, .certificate-print * { visibility: visible !important; }
        .no-print { display: none !important; }
        .certificate-print {
          position: absolute !important; top: 8mm !important; left: 8mm !important;
          width: 281mm !important; height: 194mm !important; min-height: 0 !important; max-width: none !important;
          margin: 0 !important; padding: 12mm 16mm !important; box-sizing: border-box !important;
          overflow: hidden !important; box-shadow: none !important;
          break-inside: avoid !important; page-break-inside: avoid !important;
          print-color-adjust: exact !important; -webkit-print-color-adjust: exact !important;
        }
      }
    `}</style>
  </main>;
}
