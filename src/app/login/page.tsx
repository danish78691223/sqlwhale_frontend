"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { authApi } from "@/services/api";

export default function LoginPage() {
  const [email,setEmail]=useState(""); const [password,setPassword]=useState("");
  const [loading,setLoading]=useState(false); const [error,setError]=useState("");
  async function login(){
    setError(""); setLoading(true);
    try{await authApi.post("/auth/login",{email,password});window.sessionStorage.setItem("sqlwhale_show_home_loader","1");window.location.assign("/");}
    catch(err:any){setError(err?.response?.data?.error||"Unable to login to SQLWhale.");}
    finally{setLoading(false);}
  }
  return <main className="auth-page sqlwhale-light-auth"><div className="auth-shell auth-simple-shell">
    <Link href="/" className="auth-brand"><span className="auth-logo-wrap"><Image src="/assets/sqlwhale-logo.png" alt="SQLWhale" width={46} height={46} priority/></span><span className="auth-brand-text"><strong>SQL</strong>Whale</span></Link>
    <section className="auth-card auth-simple-card">
      <div className="auth-eyebrow"><span/> SQLWHALE ACCOUNT</div>
      <h1>Welcome back</h1><p className="auth-intro">Login to your SQLWhale account.</p>
      {error?<div className="auth-error" role="alert">{error}</div>:null}
      <div className="local-auth-form">
        <label>Email<input type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"/></label>
        <label>Password<input type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Your password"/></label>
        <button type="button" className="auth-primary-button" onClick={login} disabled={loading}>{loading?"Logging in...":"Login"}</button>
      </div>
      <p className="auth-switch">Don't have a SQLWhale account? <Link href="/signup">Create one</Link></p>
    </section>
    <Link href="/" className="auth-back">← Back to SQLWhale</Link>
  </div></main>;
}