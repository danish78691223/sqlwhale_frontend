"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { authApi } from "@/services/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await authApi.post("/auth/login", { email, password, rememberMe });
      window.location.assign("/");
    } catch (err: any) {
      setError(err?.response?.data?.error || "Unable to login to SQLWhale.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="sqlwhale-login-page">
      <section className="sqlwhale-login-layout" aria-label="Sign in to SQLWhale">
        <div className="sqlwhale-login-art">
          <Image
            src="/whale-login.png"
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
          <div className="sqlwhale-login-art-copy">
            <span className="sqlwhale-login-kicker">LEARN SQL BY SEEING IT</span>
            <h2>Make every query<br />make sense.</h2>
            <p>See the tables. Understand the result. Build real SQL confidence.</p>
          </div>
        </div>

        <div className="sqlwhale-login-panel">
          <Link href="/" className="sqlwhale-login-mobile-brand" aria-label="SQLWhale home">
            <Image src="/sqlwhale-logo-main.png" alt="" width={38} height={38} priority />
            <span>SQL<span>Whale</span></span>
          </Link>
          <form className="sqlwhale-login-form" onSubmit={login}>
            <span className="sqlwhale-login-kicker">YOUR SQL JOURNEY CONTINUES</span>
            <h1>Sign in</h1>
            <p className="sqlwhale-login-intro">Welcome back! Sign in to continue learning.</p>

            {error && <div className="sqlwhale-login-error" role="alert">{error}</div>}

            <label className="sqlwhale-login-field">
              <span>Email address</span>
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
              />
            </label>

            <label className="sqlwhale-login-field">
              <span>Password</span>
              <div className="sqlwhale-login-password">
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </label>

            <div className="sqlwhale-login-options">
              <label className="sqlwhale-login-remember">
                <input type="checkbox" checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} />
                <span>Remember me</span>
              </label>
              <Link href="/forgot-password">Forgot password?</Link>
            </div>

            <button type="submit" className="sqlwhale-login-submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </button>

            <p className="sqlwhale-login-signup">Don’t have an account? <Link href="/signup">Create an account</Link></p>
          </form>
          <Link href="/" className="sqlwhale-login-back">← Back to SQLWhale</Link>
        </div>
      </section>
    </main>
  );
}
