"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { authApi } from "@/services/api";

export default function SignupPage() {
  const [name,setName]=useState(""); const [email,setEmail]=useState(""); const [password,setPassword]=useState("");
  const [loading,setLoading]=useState(false); const [error,setError]=useState(""); const [showPassword,setShowPassword]=useState(false);
  async function signup(){
    setError(""); setLoading(true);
    try{await authApi.post("/auth/signup",{name,email,password});window.location.assign("/");}
    catch(err:any){setError(err?.response?.data?.error||"Unable to create SQLWhale account.");}
    finally{setLoading(false);}
  }
  return <main className="auth-page sqlwhale-light-auth"><div className="auth-shell auth-simple-shell">
    <Link href="/" className="auth-brand"><span className="auth-logo-wrap"><Image src="/assets/sqlwhale-logo.png" alt="SQLWhale" width={46} height={46} priority/></span><span className="auth-brand-text"><strong>SQL</strong>Whale</span></Link>
    <section className="auth-card auth-simple-card">
      <div className="auth-eyebrow"><span/> SQLWHALE ACCOUNT</div>
      <h1>Create your account</h1><p className="auth-intro">Create a separate account for SQLWhale.</p>
      {error?<div className="auth-error" role="alert">{error}</div>:null}
      <div className="local-auth-form">
        <label>Name<input type="text" autoComplete="name" value={name} onChange={e=>setName(e.target.value)} placeholder="Your name"/></label>
        <label>Email<input type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"/></label>
        <label>Password<div className="password-field-wrap"><input type={showPassword ? "text" : "password"} autoComplete="new-password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Minimum 8 characters"/><button type="button" className="password-toggle-button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">{showPassword ? <><path d="M3 3l18 18" strokeLinecap="round"/><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"/><path d="M9.9 5.1A10.7 10.7 0 0 1 12 4.9c5.2 0 9 5.1 9 7.1a11.4 11.4 0 0 1-3.2 4.5"/><path d="M6.6 6.7C4.4 8.2 3 10.4 3 12c0 2 3.8 7.1 9 7.1 1.1 0 2.1-.2 3-.5"/></> : <><path d="M2.8 12s3.5-6.5 9.2-6.5S21.2 12 21.2 12 17.7 18.5 12 18.5 2.8 12 2.8 12Z"/><circle cx="12" cy="12" r="2.8"/></>}</svg></button></div></label>
        <button type="button" className="auth-primary-button" onClick={signup} disabled={loading}>{loading?"Creating...":"Create account"}</button>
      </div>
      <p className="auth-switch">Already have a SQLWhale account? <Link href="/login">Login</Link></p>
    </section>
    <Link href="/" className="auth-back">← Back to SQLWhale</Link>
  </div></main>;
}