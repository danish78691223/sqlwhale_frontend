"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { api } from "@/services/api";
import { ArrowLeft, BadgeCheck, CalendarDays, FileBadge, Search, ShieldCheck, XCircle } from "lucide-react";

type CertificateDetails = {
  certificateId: string;
  learnerName: string;
  courseName: string;
  issuedAt?: string | null;
  issuer: string;
};

type VerificationState = "idle" | "checking" | "valid" | "invalid" | "error";

export default function VerifyCertificatePage() {
  const [certificateId, setCertificateId] = useState("");
  const [state, setState] = useState<VerificationState>("idle");
  const [certificate, setCertificate] = useState<CertificateDetails | null>(null);
  const [message, setMessage] = useState("");

  async function verifyCertificate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const enteredId = certificateId.trim();
    if (!enteredId) {
      setState("invalid");
      setCertificate(null);
      setMessage("Enter the certificate ID printed on the certificate.");
      return;
    }

    setState("checking");
    setCertificate(null);
    setMessage("");
    try {
      const response = await api.get(
        `/certificate/verify/${encodeURIComponent(enteredId)}`,
        { headers: { "Cache-Control": "no-cache" } },
      );
      if (response.data?.valid && response.data?.certificate) {
        setCertificate(response.data.certificate);
        setState("valid");
      } else {
        setState("invalid");
        setMessage(response.data?.message || "We could not verify this certificate ID.");
      }
    } catch (requestError: any) {
      const data = requestError?.response?.data;
      if (requestError?.response?.status === 404 || data?.valid === false) {
        setState("invalid");
        setMessage(data?.message || data?.error || "No officially issued certificate was found for this ID.");
      } else {
        setState("error");
        setMessage(data?.error || "The verification service is temporarily unavailable. Please try again.");
      }
    }
  }

  const issuedDate = certificate?.issuedAt
    ? new Date(certificate.issuedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })
    : "Not available";

  return (
    <main className="verify-certificate-page">
      <div className="verify-certificate-wrap">
        <Link href="/learn" className="verify-back-link"><ArrowLeft size={16} /> Back to Learn</Link>

        <header className="verify-hero">
          <div className="verify-shield"><ShieldCheck size={32} /></div>
          <span className="verify-eyebrow">SQLWHALE · CREDENTIAL CHECK</span>
          <h1>Verify a Certificate</h1>
          <p>Confirm that a SQLWhale certificate was officially issued. Enter the unique certificate ID printed on the certificate.</p>
        </header>

        <section className="verify-panel" aria-labelledby="verify-form-title">
          <div className="verify-panel-heading">
            <div className="verify-heading-icon"><FileBadge size={21} /></div>
            <div>
              <h2 id="verify-form-title">Certificate verification</h2>
              <p>Use the full ID shown on the certificate, including the SQLW- prefix.</p>
            </div>
          </div>
          <form onSubmit={verifyCertificate}>
            <label htmlFor="certificate-id">Certificate ID</label>
            <div className="verify-input-row">
              <input
                id="certificate-id"
                name="certificateId"
                autoComplete="off"
                autoCapitalize="characters"
                spellCheck={false}
                placeholder="e.g. SQLW-A1B2C3D4..."
                value={certificateId}
                onChange={(event) => setCertificateId(event.target.value)}
                maxLength={90}
                required
              />
              <button type="submit" disabled={state === "checking" || !certificateId.trim()}>
                <Search size={17} /> {state === "checking" ? "Checking…" : "Verify ID"}
              </button>
            </div>
            <p className="verify-hint">The ID is checked against SQLWhale’s official certificate records.</p>
          </form>
        </section>

        {state === "valid" && certificate && (
          <section className="verify-result verify-result-valid" aria-live="polite" aria-labelledby="verification-result-title">
            <div className="verify-result-top">
              <BadgeCheck size={30} />
              <div><span>VERIFICATION STATUS</span><h2 id="verification-result-title">Certificate is valid</h2></div>
              <span className="verify-status-pill">VERIFIED</span>
            </div>
            <p className="verify-result-message">This certificate ID matches an officially issued SQLWhale certificate.</p>
            <div className="verify-details">
              <div><span>Learner name</span><strong>{certificate.learnerName}</strong></div>
              <div><span>Course completed</span><strong>{certificate.courseName}</strong></div>
              <div><span>Certificate ID</span><strong className="verify-id">SQLW-{certificate.certificateId}</strong></div>
              <div><span><CalendarDays size={14} /> Issue date</span><strong>{issuedDate}</strong></div>
              <div className="verify-issuer"><span>Issued by</span><strong>{certificate.issuer}</strong></div>
            </div>
          </section>
        )}

        {(state === "invalid" || state === "error") && (
          <section className={`verify-result ${state === "error" ? "verify-result-error" : "verify-result-invalid"}`} role="status" aria-live="polite">
            <div className="verify-result-top">
              <XCircle size={28} />
              <div><span>VERIFICATION STATUS</span><h2>{state === "error" ? "Verification unavailable" : "Certificate not verified"}</h2></div>
            </div>
            <p className="verify-result-message">{message}</p>
            {state === "invalid" && <p className="verify-small-note">Check for missing characters and try entering the ID exactly as printed.</p>}
          </section>
        )}

        <footer className="verify-footer">
          <span>Secure credential lookup</span><span>·</span><span>SQLWhale by WEBXWHALE</span>
        </footer>
      </div>

      <style jsx>{`
        .verify-certificate-page { min-height: 100vh; padding: 34px 20px 64px; color: #ecf3ff; background: radial-gradient(ellipse at 50% 0%, rgba(30, 91, 160, .22), transparent 54%), #07070b; }
        .verify-certificate-wrap { max-width: 800px; margin: 0 auto; }
        .verify-back-link { display: inline-flex; align-items: center; gap: 8px; color: #c6d6ec; text-decoration: none; font-size: 13px; font-weight: 650; margin-bottom: 32px; }
        .verify-back-link:hover { color: #77c2ff; }
        .verify-hero { text-align: center; margin: 0 auto 30px; max-width: 650px; }
        .verify-shield { display: grid; place-items: center; width: 68px; height: 68px; border: 1px solid rgba(96, 165, 250, .4); border-radius: 20px; color: #7fc4ff; background: rgba(59, 130, 246, .14); margin: 0 auto 17px; }
        .verify-eyebrow { color: #83c8ff; font-size: 10px; font-weight: 800; letter-spacing: .18em; }
        .verify-hero h1 { margin: 12px 0 10px; color: #f8fbff; font-size: clamp(32px, 5vw, 46px); letter-spacing: -.045em; line-height: 1.1; }
        .verify-hero p { max-width: 560px; margin: 0 auto; color: #aebbd0; font-size: 14px; line-height: 1.75; }
        .verify-panel, .verify-result { padding: clamp(18px, 4vw, 28px); border: 1px solid #263449; border-radius: 18px; background: rgba(14, 22, 35, .94); box-shadow: 0 18px 50px rgba(0, 0, 0, .18); }
        .verify-panel-heading { display: flex; align-items: center; gap: 13px; margin-bottom: 24px; }
        .verify-heading-icon { display: grid; place-items: center; flex: 0 0 44px; height: 44px; border-radius: 13px; color: #83c8ff; background: rgba(59, 130, 246, .15); }
        .verify-panel h2 { margin: 0 0 5px; color: #f5f8ff; font-size: 17px; }
        .verify-panel-heading p { margin: 0; color: #a7b5c9; font-size: 12px; line-height: 1.6; }
        .verify-panel form > label { display: block; margin-bottom: 9px; color: #e3ebf8; font-size: 12px; font-weight: 750; }
        .verify-input-row { display: flex; gap: 10px; }
        .verify-input-row input { min-width: 0; flex: 1; height: 48px; padding: 0 14px; border: 1px solid #3a4a62; border-radius: 10px; outline: none; color: #f8fbff; background: #0a111c; font: inherit; font-size: 14px; }
        .verify-input-row input:focus { border-color: #60a5fa; box-shadow: 0 0 0 3px rgba(59, 130, 246, .15); }
        .verify-input-row input::placeholder { color: #6f8097; }
        .verify-input-row button { display: inline-flex; justify-content: center; align-items: center; gap: 8px; min-width: 125px; padding: 0 15px; border: 0; border-radius: 10px; color: #071426; background: #83c8ff; font-size: 13px; font-weight: 800; cursor: pointer; }
        .verify-input-row button:disabled { cursor: wait; opacity: .65; }
        .verify-hint { margin: 10px 0 0; color: #8190a6; font-size: 11px; line-height: 1.6; }
        .verify-result { margin-top: 18px; }
        .verify-result-valid { border-color: rgba(52, 211, 153, .45); }
        .verify-result-invalid { border-color: rgba(248, 113, 113, .4); }
        .verify-result-error { border-color: rgba(251, 191, 36, .4); }
        .verify-result-top { display: flex; align-items: center; gap: 13px; color: #5ee4b1; }
        .verify-result-invalid .verify-result-top { color: #fda4af; }
        .verify-result-error .verify-result-top { color: #fcd34d; }
        .verify-result-top > div { min-width: 0; flex: 1; }
        .verify-result-top span:not(.verify-status-pill) { display: block; margin-bottom: 4px; color: #9fb0c7; font-size: 9px; font-weight: 800; letter-spacing: .14em; }
        .verify-result-top h2 { margin: 0; color: #f7fbff; font-size: 18px; }
        .verify-status-pill { padding: 7px 9px; border-radius: 99px; color: #77f0c1; background: rgba(16, 185, 129, .13); font-size: 9px; font-weight: 850; letter-spacing: .1em; }
        .verify-result-message { margin: 14px 0 20px; color: #b8c5d8; font-size: 13px; line-height: 1.7; }
        .verify-details { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); border: 1px solid #29364a; border-radius: 12px; overflow: hidden; }
        .verify-details > div { min-width: 0; padding: 14px; border-bottom: 1px solid #29364a; }
        .verify-details > div:nth-child(odd) { border-right: 1px solid #29364a; }
        .verify-details > div:nth-last-child(-n+2) { border-bottom: 0; }
        .verify-details span { display: flex; align-items: center; gap: 5px; margin-bottom: 7px; color: #8fa1ba; font-size: 10px; }
        .verify-details strong { display: block; color: #f1f6ff; font-size: 13px; line-height: 1.5; overflow-wrap: anywhere; }
        .verify-details .verify-id { color: #82c9ff; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
        .verify-small-note { color: #8d9cb2; font-size: 11px; }
        .verify-footer { display: flex; justify-content: center; align-items: center; flex-wrap: wrap; gap: 8px; padding: 28px 0 0; color: #77859b; font-size: 10px; }
        @media (max-width: 540px) { .verify-certificate-page { padding: 22px 13px 42px; } .verify-back-link { margin-bottom: 25px; } .verify-input-row { flex-direction: column; } .verify-input-row button { min-height: 46px; width: 100%; } .verify-result-top { align-items: flex-start; } .verify-status-pill { margin-left: auto; } .verify-details { grid-template-columns: 1fr; } .verify-details > div, .verify-details > div:nth-child(odd), .verify-details > div:nth-last-child(-n+2) { border-right: 0; border-bottom: 1px solid #29364a; } .verify-details > div:last-child { border-bottom: 0; } }
      `}</style>
    </main>
  );
}
