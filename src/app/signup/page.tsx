"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { authApi } from "@/services/api";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function signup() {
    setError("");

    if (!termsAccepted || !privacyAccepted) {
      setError("Please accept the Terms & Conditions and Privacy Policy before creating your account.");
      return;
    }

    setLoading(true);
    try {
      await authApi.post("/auth/signup", {
        name,
        email,
        password,
        termsAccepted,
        privacyAccepted,
      });
      window.location.assign("/");
    } catch (err: any) {
      setError(err?.response?.data?.error || "Unable to create SQLWhale account.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="sqlwhale-login-page sqlwhale-signup-page">
      <section className="sqlwhale-login-layout" aria-label="Create a SQLWhale account">
        <div className="sqlwhale-login-art">
          <Image
            src="/sign-up.png"
            alt="SQLWhale"
            fill
            priority
            sizes="(max-width: 767px) 100vw, 50vw"
            className="sqlwhale-login-art-image"
          />
          <div className="sqlwhale-login-art-shade" />
          <Link href="/" className="sqlwhale-login-art-brand" aria-label="SQLWhale home">
            <Image src="/sqlwhale-logo-main.png" alt="" width={38} height={38} priority />
            <span>SQL<span>Whale</span></span>
          </Link>
        </div>

        <div className="sqlwhale-login-panel">
          <Link href="/" className="sqlwhale-login-mobile-brand" aria-label="SQLWhale home">
            <Image src="/sqlwhale-logo-main.png" alt="" width={38} height={38} priority />
            <span>SQL<span>Whale</span></span>
          </Link>
          <form className="sqlwhale-login-form sqlwhale-signup-form" onSubmit={(event) => { event.preventDefault(); void signup(); }}>
            <span className="sqlwhale-login-kicker">START YOUR SQL JOURNEY</span>
            <h1>Create account</h1>
            <p className="sqlwhale-login-intro">Create your SQLWhale account and start learning.</p>
            {error ? <div className="sqlwhale-login-error" role="alert">{error}</div> : null}

            <label className="sqlwhale-login-field">
              <span>Name</span>
              <input type="text" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" required />
            </label>

            <label className="sqlwhale-login-field">
              <span>Email address</span>
              <input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required />
            </label>

            <label className="sqlwhale-login-field">
              <span>Password</span>
              <div className="sqlwhale-login-password">
                <input type={showPassword ? "text" : "password"} autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Minimum 8 characters" minLength={8} required />
                <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword}>{showPassword ? "Hide" : "Show"}</button>
              </div>
            </label>

            <div className="sqlwhale-signup-consents" aria-label="Required legal agreements">
              <label className="sqlwhale-signup-consent">
                <input type="checkbox" checked={termsAccepted} onChange={(event) => setTermsAccepted(event.target.checked)} required />
                <span>I agree to the <Link href="/terms" target="_blank" rel="noopener noreferrer">Terms &amp; Conditions</Link>.</span>
              </label>
              <label className="sqlwhale-signup-consent">
                <input type="checkbox" checked={privacyAccepted} onChange={(event) => setPrivacyAccepted(event.target.checked)} required />
                <span>I have read and acknowledge the <Link href="/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Policy</Link>.</span>
              </label>
            </div>

            <button type="submit" className="sqlwhale-login-submit" disabled={loading || !termsAccepted || !privacyAccepted}>
              {loading ? "Creating..." : "Create account"}
            </button>
            <p className="sqlwhale-signup-consent-hint">Accept both agreements to enable account registration.</p>
            <p className="sqlwhale-login-signup">Already have an account? <Link href="/login">Sign in</Link></p>
          </form>
          <Link href="/" className="sqlwhale-login-back">← Back to SQLWhale</Link>
        </div>
      </section>
    </main>
  );
}

