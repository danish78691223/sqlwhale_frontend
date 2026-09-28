"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { api, authApi } from "@/services/api";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [webLoading, setWebLoading] = useState(false);
  const [error, setError] = useState("");

  async function signupLocal() {
    setError("");
    setLoading(true);
    try {
      await authApi.post("/auth/local/signup", { name, email, password });
      window.sessionStorage.setItem("sqlwhale_show_home_loader", "1");
      window.location.assign("/");
    } catch (err: any) {
      setError(err?.response?.data?.error || "Unable to create SQLWhale account.");
    } finally {
      setLoading(false);
    }
  }

  function signupWithWebXWhale() {
    setError("");
    setWebLoading(true);
    window.location.assign("/api/auth/webxwhale/start?screen=signup");
  }

  return (
    <main className="auth-page">
      <div className="auth-shell auth-simple-shell">
        <Link href="/" className="auth-brand">
          <span className="auth-logo-wrap">
            <Image src="/assets/sqlwhale-logo.png" alt="SQLWhale" width={46} height={46} priority />
          </span>
          <span className="auth-brand-text"><strong>SQL</strong>Whale</span>
        </Link>

        <section className="auth-card auth-simple-card">
          <h1>Create SQLWhale account</h1>
          <p className="auth-intro">Create a SQLWhale-only account or use WEBXWHALE.</p>

          {error ? <div className="auth-error" role="alert">{error}</div> : null}

          <div className="local-auth-form">
            <label>Name<input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" /></label>
            <label>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" /></label>
            <label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Minimum 8 characters" /></label>
            <button type="button" className="auth-primary-button" onClick={signupLocal} disabled={loading || webLoading}>
              {loading ? "Creating..." : "Create SQLWhale account"}
            </button>
          </div>

          <div className="auth-divider"><span>OR</span></div>

          <button type="button" className="webx-auth-button webx-simple-button" onClick={signupWithWebXWhale} disabled={loading || webLoading}>
            <span className="webx-icon">W</span>
            <span>{webLoading ? "Connecting..." : "Sign up with WEBXWHALE"}</span>
          </button>

          <p className="auth-switch">Already have a SQLWhale account? <Link href="/login">Login here</Link></p>
          <p className="auth-switch">WEBXWHALE account creates one identity for supported products.</p>
        </section>

        <Link href="/" className="auth-back">← Back to SQLWhale</Link>
      </div>
    </main>
  );
}
