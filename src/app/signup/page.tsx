"use client";

import Image from "next/image";
import Link from "next/link";

const API_URL =
  (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").replace(/\/$/, "");

export default function SignupPage() {
  function signupWithWebXWhale() {
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
          <p className="text-xs font-semibold tracking-[0.25em] text-cyan-300">
            JOIN SQLWHALE
          </p>
          <h1 className="mt-3 text-3xl font-semibold">Create your account</h1>
          <p className="mt-2 text-sm leading-6 text-white/60">
            Create one WEBXWHALE identity and use it across SQLWhale and future products.
          </p>

          <button
            type="button"
            onClick={signupWithWebXWhale}
            className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl bg-white px-5 py-4 text-sm font-semibold text-[#071018] transition hover:bg-cyan-50"
          >
            <span className="text-lg" aria-hidden="true">🐋</span>
            Sign up with WEBXWHALE
          </button>

          <p className="mt-6 text-center text-sm text-white/55">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-cyan-300 hover:text-cyan-200">
              Login with WEBXWHALE
            </Link>
          </p>
        </section>

        <p className="mt-6 text-center text-xs leading-5 text-white/35">
          Your WEBXWHALE password stays with the central identity service.
        </p>
      </div>
    </main>
  );
}
