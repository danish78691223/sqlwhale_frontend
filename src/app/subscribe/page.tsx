"use client";

import Link from "next/link";
import Image from "next/image";
import SubscribeBargainButton from "@/components/SubscribeBargainButton";

export default function SubscribePage() {
  return (
    <main className="min-h-screen bg-[#07070b] text-white">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 sm:px-10">
        <Link href="/" aria-label="SQLWhale home" className="flex items-center gap-3">
          <Image src="/sqlwhale-logo-main.png" alt="SQLWhale" width={42} height={42} priority />
          <span className="text-lg font-semibold tracking-tight">SQLWhale</span>
        </Link>
        <Link href="/" className="rounded-full border border-white/20 px-4 py-2 text-sm text-white/75 transition hover:border-white/50 hover:text-white">
          ← Back to home
        </Link>
      </header>

      <section className="relative mx-auto flex min-h-[72vh] w-full max-w-5xl flex-col items-center justify-center overflow-hidden px-6 py-20 text-center sm:px-10">
        <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 h-[460px] w-[460px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/15 blur-[120px]" />
        <div className="relative z-10 mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/65">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
          Building in public
        </div>
        <h1 className="relative z-10 max-w-3xl text-4xl font-semibold leading-[1.08] tracking-[-0.045em] sm:text-6xl md:text-7xl">
          Make a deal with <span className="text-blue-400">the Whale.</span>
        </h1>
        <p className="relative z-10 mt-6 max-w-2xl text-base leading-7 text-white/65 sm:text-lg">
          Unlock a more powerful SQL learning experience. Choose the listed price or make an offer and see if the Whale accepts.
        </p>

        <div className="relative z-10 mt-10 w-full max-w-xl rounded-3xl border border-white/12 bg-white/[0.04] p-6 text-left shadow-2xl shadow-blue-950/20 sm:p-9">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">SQLWhale Premium</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">Your next level of SQL learning</h2>
            </div>
            <div aria-hidden="true" className="text-4xl">🐳</div>
          </div>
          <div className="my-6 h-px bg-white/10" />
          <ul className="space-y-3 text-sm leading-6 text-white/70">
            <li className="flex gap-3"><span className="text-blue-400">✓</span><span>Learn with a more powerful SQLWhale experience</span></li>
            <li className="flex gap-3"><span className="text-blue-400">✓</span><span>Make an offer and negotiate with the Whale</span></li>
            <li className="flex gap-3"><span className="text-blue-400">✓</span><span>Secure INR checkout powered by Razorpay</span></li>
          </ul>
          <div className="mt-8">
            <SubscribeBargainButton inline />
          </div>
          <p className="mt-4 text-center text-xs leading-5 text-white/40">You’ll be asked to log in before subscribing. Payment is completed securely through Razorpay.</p>
        </div>
        <p className="relative z-10 mt-8 text-sm text-white/35">Built in public by WebxWhale</p>
      </section>
    </main>
  );
}
