"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { authApi } from "@/services/api";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function submit() {
    setError("");
    setSuccess("");
    if (!token) { setError("This reset link is missing or invalid. Request a new one."); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters long."); return; }
    if (password !== confirmPassword) { setError("The passwords do not match."); return; }
    setLoading(true);
    try {
      const response = await authApi.post("/auth/reset-password", { token, password });
      setSuccess(response.data?.message || "Your password has been reset. You can now log in.");
      setPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setError(err?.response?.data?.error || "This reset link may have expired. Request a new one.");
    } finally {
      setLoading(false);
    }
  }

  return <main className="auth-page sqlwhale-light-auth"><div className="auth-shell auth-simple-shell">
    <Link href="/" className="auth-brand"><span className="auth-logo-wrap"><Image src="/sqlwhale-logo-main.png" alt="SQLWhale" width={46} height={46} priority /></span><span className="auth-brand-text"><strong>SQL</strong>Whale</span></Link>
    <section className="auth-card auth-simple-card">
      <div className="auth-eyebrow"><span /> SQLWHALE ACCOUNT</div>
      <h1>Choose a new password</h1>
      <p className="auth-intro">Enter your new password twice. This reset link is valid for 5 minutes and works only once.</p>
      {error ? <div className="auth-error" role="alert">{error}</div> : null}
      {success ? <div role="status" style={{padding:12,borderRadius:10,background:"#ecfdf5",color:"#065f46",fontSize:14,marginBottom:16}}>{success} <Link href="/login" style={{fontWeight:700,textDecoration:"underline"}}>Login</Link></div> : null}
      {!success ? <div className="local-auth-form">
        <label>New password<input type="password" autoComplete="new-password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="At least 8 characters" /></label>
        <label>Re-enter new password<input type="password" autoComplete="new-password" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} placeholder="Enter the same password again" /></label>
        <button type="button" className="auth-primary-button" onClick={submit} disabled={loading || !password || !confirmPassword}>{loading ? "Updating password..." : "Reset password"}</button>
      </div> : null}
      <p className="auth-switch"><Link href="/forgot-password">Request a new reset link</Link></p>
    </section>
    <Link href="/" className="auth-back">← Back to SQLWhale</Link>
  </div></main>;
}

export default function ResetPasswordPage() {
  return <Suspense fallback={<main className="auth-page sqlwhale-light-auth"><div className="auth-shell auth-simple-shell"><p>Loading secure reset form…</p></div></main>}><ResetPasswordForm /></Suspense>;
}
