"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const API_URL =
  (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").replace(/\/$/, "");

export default function SignupPage() {
  const [loading, setLoading] = useState(false);

  function signupWithWebXWhale() {
    setLoading(true);
    window.location.assign(`${API_URL}/auth/webxwhale/start?screen=signup`);
  }

  return (
    <main className="auth-page">
      <div className="auth-grid" aria-hidden="true" />
      <div className="auth-orb auth-orb-one" aria-hidden="true" />
      <div className="auth-orb auth-orb-two" aria-hidden="true" />

      <div className="auth-shell">
        <Link href="/" className="auth-brand">
          <span className="auth-logo-wrap">
            <Image src="/assets/sqlwhale-logo.png" alt="SQLWhale" width={52} height={52} priority />
          </span>
          <span className="auth-brand-text"><strong>SQL</strong>Whale</span>
        </Link>

        <section className="auth-card auth-card-signup">
          <div className="auth-card-glow" aria-hidden="true" />
          <div className="auth-eyebrow"><span /> JOIN SQLWHALE</div>
          <h1>Create your account</h1>
          <p className="auth-intro">Create one <strong>WEBXWHALE</strong> identity and use it across SQLWhale and future products.</p>

          <button type="button" onClick={signupWithWebXWhale} disabled={loading} className="webx-auth-button">
            <span className="webx-icon">W</span>
            <span className="webx-button-copy">
              <strong>{loading ? "Connecting..." : "Sign up with WEBXWHALE"}</strong>
              <small>Create your central account</small>
            </span>
            <span className="webx-arrow">↗</span>
          </button>

          <div className="auth-divider"><span>CENTRAL IDENTITY</span></div>

          <p className="auth-switch">
            Already have an account?{" "}
            <Link href="/login">Login with WEBXWHALE <span>↗</span></Link>
          </p>
        </section>

        <div className="auth-trust">
          <span className="auth-lock">◆</span>
          <span>Your WEBXWHALE password stays with the central identity service.</span>
        </div>

        <Link href="/" className="auth-back">← Back to SQLWhale</Link>
      </div>
    </main>
  );
}
