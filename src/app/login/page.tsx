"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { api } from "@/services/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [webLoading, setWebLoading] = useState(false);
  const [error, setError] = useState("");

  async function loginLocal() {
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/local/login", { email, password });
      window.sessionStorage.setItem("sqlwhale_show_home_loader", "1");
      window.location.assign("/");
    } catch (err: any) {
      setError(err?.response?.data?.error || "Unable to login to SQLWhale.");
    } finally {
      setLoading(false);
    }
  }

  function loginWithWebXWhale() {
    setError("");
    setWebLoading(true);
    window.sessionStorage.setItem("sqlwhale_show_home_loader", "1");
    window.location.assign(`${process.env.NEXT_PUBLIC_API_URL}/auth/webxwhale/start`);
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
          <h1>Login to SQLWhale</h1>
          <p className="auth-intro">Choose how you want to sign in.</p>

          {error ? <div className="auth-error" role="alert">{error}</div> : null}

          <div className="local-auth-form">
            <label>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" /></label>
            <label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your SQLWhale password" /></label>
            <button type="button" className="auth-primary-button" onClick={loginLocal} disabled={loading || webLoading}>
              {loading ? "Logging in..." : "Login with SQLWhale"}
            </button>
          </div>

          <div className="auth-divider"><span>OR</span></div>

          <button type="button" className="webx-auth-button webx-simple-button" onClick={loginWithWebXWhale} disabled={loading || webLoading}>
            <span className="webx-icon">W</span>
            <span>{webLoading ? "Connecting..." : "Login with WEBXWHALE"}</span>
          </button>

          <p className="auth-switch">Don't have a SQLWhale account? <Link href="/signup">Create one</Link></p>
          <p className="auth-switch">Want one account across WEBXWHALE products? <a href="https://webxwhale-ebon.vercel.app/signup">Create WEBXWHALE account ↗</a></p>
        </section>

        <Link href="/" className="auth-back">← Back to SQLWhale</Link>
      </div>
    </main>
  );
}
