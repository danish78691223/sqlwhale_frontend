"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const API_URL =
  (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").replace(/\/$/, "");

export default function LoginPage() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const reason = searchParams.get("error");
    if (reason === "oauth_cancelled") setError("WEBXWHALE login was cancelled.");
    if (reason === "oauth_failed") setError("WEBXWHALE login could not be completed. Please try again.");
    if (reason === "missing_code") setError("WEBXWHALE did not return an authorization code.");
  }, [searchParams]);

  function loginWithWebXWhale() {
    setError("");
    setLoading(true);
    window.location.assign(`${API_URL}/auth/webxwhale/start`);
  }

  return (
    <main className="min-h-screen bg-[#071018] text-white flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-3 mb-10">
          <Image
            src="/assets/sqlwhale-logo.png"
            alt="SQLWhale"
            width={52}
            height={52}
            priority
          />
          <span className="text-2xl font-semibold tracking-tight">SQLWhale</span>
        </Link>

        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl backdrop-blur">
          <div className="mb-8">
            <p className="text-xs font-semibold tracking-[0.25em] text-cyan-300">
              SQLWHALE ACCOUNT
            </p>
            <h1 className="mt-3 text-3xl font-semibold">Welcome back</h1>
            <p className="mt-2 text-sm leading-6 text-white/60">
              Use your WEBXWHALE account to continue to SQLWhale.
            </p>
          </div>

          {error ? (
            <div className="mb-5 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          ) : null}

          <button
            type="button"
            onClick={loginWithWebXWhale}
            disabled={loading}
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-white px-5 py-4 text-sm font-semibold text-[#071018] transition hover:bg-cyan-50 disabled:cursor-wait disabled:opacity-60"
          >
            <span className="text-lg" aria-hidden="true">🐋</span>
            {loading ? "Connecting to WEBXWHALE…" : "Login with WEBXWHALE"}
          </button>

          <div className="my-7 flex items-center gap-3 text-xs text-white/30">
            <span className="h-px flex-1 bg-white/10" />
            <span>CENTRAL ACCOUNT</span>
            <span className="h-px flex-1 bg-white/10" />
          </div>

          <p className="text-center text-sm text-white/55">
            New to WEBXWHALE?{" "}
            <a
              href="https://webxwhale-ebon.vercel.app/signup"
              className="font-semibold text-cyan-300 hover:text-cyan-200"
            >
              Create your account
            </a>
          </p>
        </section>

        <p className="mt-6 text-center text-xs leading-5 text-white/35">
          One WEBXWHALE identity can be used across SQLWhale and other WEBXWHALE products.
        </p>
      </div>
    </main>
  );
}
