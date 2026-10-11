"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { authApi } from "@/services/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function submit() {
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const response = await authApi.post("/auth/forgot-password", { email });
      setMessage(response.data?.message || "If an account exists for that email, a reset link has been sent.");
    } catch (err: any) {
      setError(err?.response?.data?.error || "Unable to send a reset link right now.");
    } finally {
      setLoading(false);
    }
  }

  return <main className="auth-page sqlwhale-light-auth"><div className="auth-shell auth-simple-shell">
    <Link href="/" className="auth-brand"><span className="auth-logo-wrap"><Image src="/sqlwhale-logo-main.png" alt="SQLWhale" width={46} height={46} priority /></span><span className="auth-brand-text"><strong>SQL</strong>Whale</span></Link>
    <section className="auth-card auth-simple-card">
      <div className="auth-eyebrow"><span /> SQLWHALE ACCOUNT</div>
      <h1>Reset your password</h1>
      <p className="auth-intro">Enter the email address linked to your SQLWhale account. We’ll send you a secure reset link that expires in 5 minutes.</p>
      {error ? <div className="auth-error" role="alert">{error}</div> : null}
      {message ? <div role="status" style={{padding:12,borderRadius:10,background:"#ecfdf5",color:"#065f46",fontSize:14,marginBottom:16}}>{message}</div> : null}
      <div className="local-auth-form">
        <label>Email<input type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" required /></label>
        <button type="button" className="auth-primary-button" onClick={submit} disabled={loading || !email.trim()}>{loading ? "Sending link..." : "Send reset link"}</button>
      </div>
      <p className="auth-switch"><Link href="/login">← Back to login</Link></p>
    </section>
    <Link href="/" className="auth-back">← Back to SQLWhale</Link>
  </div></main>;
}
