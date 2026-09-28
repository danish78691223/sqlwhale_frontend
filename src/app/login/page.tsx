"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const API_URL =
  (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").replace(/\/$/, "");

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const reason = new URLSearchParams(window.location.search).get("error");
    if (reason === "oauth_cancelled") setError("WEBXWHALE login was cancelled.");
    if (reason === "oauth_failed") setError("WEBXWHALE login could not be completed. Please try again.");
    if (reason === "missing_code") setError("WEBXWHALE did not return an authorization code.");
  }, []);

  function loginWithWebXWhale() {
    setError("");
    setLoading(true);
    window.location.assign(`${API_URL}/auth/webxwhale/start`);
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

        <section className="auth-card">
          <div className="auth-card-glow" aria-hidden="true" />
          <div className="auth-eyebrow"><span /> SQLWHALE ACCOUNT</div>
          <h1>Welcome back</h1>
          <p className="auth-intro">Use your <strong>WEBXWHALE</strong> account to continue to SQLWhale.</p>

          {error ? (
            <div className="auth-error" role="alert">
              <span>!</span>{error}
            </div>
          ) : null}

          <button type="button" onClick={loginWithWebXWhale} disabled={loading} className="webx-auth-button">
            <span className="webx-icon">W</span>
            <span className="webx-button-copy">
              <strong>{loading ? "Connecting..." : "Login with WEBXWHALE"}</strong>
              <small>Continue with your central account</small>
            </span>
            <span className="webx-arrow">↗</span>
          </button>

          <div className="auth-divider"><span>SECURE CENTRAL ACCOUNT</span></div>

          <p className="auth-switch">
            New to WEBXWHALE?{" "}
            <a href="https://webxwhale-ebon.vercel.app/signup">Create your account <span>↗</span></a>
          </p>
        </section>

        <div className="auth-trust">
          <span className="auth-lock">◆</span>
          <span>One WEBXWHALE identity works across SQLWhale and other WEBXWHALE products.</span>
        </div>

        <Link href="/" className="auth-back">← Back to SQLWhale</Link>
      </div>
    </main>
  );
}
