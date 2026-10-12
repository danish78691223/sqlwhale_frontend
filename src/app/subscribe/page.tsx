"use client";

import Link from "next/link";
import Image from "next/image";
import SubscribeBargainButton from "@/components/SubscribeBargainButton";

export default function SubscribePage() {
  return (
    <main className="subscription-page">
      <style jsx global>{`
        .subscription-page, .subscription-page * { box-sizing: border-box; }
        .subscription-page {
          min-height: 100vh; background: #f5f3ed; color: #111827;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          overflow: hidden;
        }
        .subscription-page a { color: inherit; text-decoration: none; }
        .subscription-header {
          width: min(1160px, calc(100% - 48px)); min-height: 88px; margin: 0 auto;
          display: flex; align-items: center; justify-content: space-between; gap: 24px;
          border-bottom: 1px solid rgba(17,24,39,.10);
        }
        .subscription-brand { display: inline-flex; align-items: center; gap: 12px; font-size: 18px; font-weight: 750; letter-spacing: -.03em; }
        .subscription-back { color: #596170 !important; font-size: 13px; padding: 10px 15px; border: 1px solid rgba(17,24,39,.14); border-radius: 999px; transition: .2s ease; }
        .subscription-back:hover { border-color: rgba(17,24,39,.5); color: #111827 !important; }
        .subscription-content { position: relative; width: min(1160px, calc(100% - 48px)); margin: 0 auto; padding: 72px 0 64px; }
        .subscription-glow { position: absolute; z-index: 0; width: 520px; height: 520px; left: 50%; top: 80px; transform: translateX(-50%); border-radius: 50%; background: rgba(0,184,196,.10); filter: blur(110px); pointer-events: none; }
        .subscription-heading { position: relative; z-index: 1; max-width: 760px; margin: 0 auto 42px; text-align: center; }
        .subscription-eyebrow { display: inline-flex; align-items: center; gap: 9px; padding: 8px 13px; border: 1px solid rgba(17,24,39,.12); border-radius: 999px; background: rgba(255,255,255,.48); color: #596170; font-size: 11px; font-weight: 700; letter-spacing: .18em; text-transform: uppercase; }
        .subscription-eyebrow:before { content: ""; width: 6px; height: 6px; border-radius: 50%; background: #00b8c4; box-shadow: 0 0 12px #009eaa; }
        .subscription-title { margin: 24px 0 0; color: #111827 !important; font-size: clamp(38px, 6vw, 68px); line-height: 1.04; font-weight: 760; letter-spacing: -.055em; }
        .subscription-title span { color: #00b8c4; }
        .subscription-description { max-width: 620px; margin: 20px auto 0; color: #596170 !important; font-size: 16px; line-height: 1.8; }
        .subscription-card { position: relative; z-index: 1; width: min(100%, 620px); margin: 0 auto; padding: 34px; border: 1px solid rgba(255,255,255,.14); border-radius: 24px; background: linear-gradient(145deg, rgba(255,255,255,.78), rgba(255,255,255,.55)); box-shadow: 0 24px 90px rgba(17,24,39,.045); }
        .subscription-card-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; }
        .subscription-plan-label { margin: 0; color: #008e99 !important; font-size: 11px; font-weight: 750; letter-spacing: .16em; text-transform: uppercase; }
        .subscription-card-title { margin: 10px 0 0; color: #111827 !important; font-size: 25px; line-height: 1.25; font-weight: 700; letter-spacing: -.035em; }
        .subscription-whale { font-size: 36px; line-height: 1; }
        .subscription-divider { height: 1px; margin: 26px 0; background: rgba(17,24,39,.10); }
        .subscription-benefits { display: grid; gap: 15px; margin: 0; padding: 0; list-style: none; }
        .subscription-benefits li { display: flex; align-items: flex-start; gap: 12px; color: #374151 !important; font-size: 14px; line-height: 1.65; }
        .subscription-check { flex: 0 0 21px; width: 21px; height: 21px; display: inline-grid; place-items: center; border: 1px solid rgba(0,184,196,.28); border-radius: 50%; color: #008e99; font-size: 12px; }
        .subscription-cta { margin-top: 30px; }
        .subscription-cta .sqlwhale-subscribe-trigger { display: flex !important; width: 100% !important; min-height: 52px !important; align-items: center !important; justify-content: center !important; gap: 10px !important; border: 1px solid #009eaa !important; border-radius: 13px !important; background: #009eaa !important; color: #111827 !important; font-size: 15px !important; font-weight: 700 !important; box-shadow: 0 8px 28px rgba(0,158,170,.18) !important; cursor: pointer; transition: background .2s ease, transform .2s ease !important; }
        .subscription-cta .sqlwhale-subscribe-trigger:hover { background: #007f89 !important; transform: translateY(-1px); }
        .subscription-note { margin: 15px 0 0; color: #697180 !important; font-size: 12px; line-height: 1.7; text-align: center; }
        .subscription-footer { width: min(1160px, calc(100% - 48px)); margin: 0 auto; padding: 23px 0 30px; display: flex; align-items: center; justify-content: space-between; gap: 20px; border-top: 1px solid rgba(17,24,39,.10); color: #697180; font-size: 12px; }
        .subscription-legal { display: flex; flex-wrap: wrap; gap: 20px; }
        .subscription-legal a { color: #596170 !important; transition: color .2s ease; }
        .subscription-legal a:hover { color: #111827 !important; text-decoration: underline; text-underline-offset: 4px; }
        @media (max-width: 640px) {
          .subscription-header, .subscription-content, .subscription-footer { width: min(100% - 32px, 1160px); }
          .subscription-header { min-height: 76px; }
          .subscription-brand { font-size: 16px; gap: 8px; }
          .subscription-brand img { width: 34px; height: 34px; }
          .subscription-back { padding: 9px 11px; font-size: 12px; }
          .subscription-content { padding: 54px 0 42px; }
          .subscription-heading { margin-bottom: 30px; }
          .subscription-description { font-size: 14px; }
          .subscription-card { padding: 23px 20px; border-radius: 20px; }
          .subscription-card-title { font-size: 22px; }
          .subscription-footer { align-items: flex-start; flex-direction: column; padding-top: 22px; }
          .subscription-legal { gap: 15px; }
        }
      `}</style>

      <header className="subscription-header">
        <Link href="/" aria-label="SQLWhale home" className="subscription-brand">
          <Image src="/sqlwhale-logo-main.png" alt="SQLWhale" width={42} height={42} priority />
          <span>SQLWhale</span>
        </Link>
        <Link href="/" className="subscription-back">← Back to home</Link>
      </header>

      <section className="subscription-content">
        <div className="subscription-glow" aria-hidden="true" />
        <div className="subscription-heading">
          <div className="subscription-eyebrow">Building in public · Membership</div>
          <h1 className="subscription-title">Make a deal with <span>the Whale.</span></h1>
          <p className="subscription-description">
            Choose your way into a more powerful SQL learning experience. Pay the listed price or make an offer and see if the Whale accepts.
          </p>
        </div>

        <section className="subscription-card" aria-labelledby="subscription-plan-title">
          <div className="subscription-card-head">
            <div>
              <p className="subscription-plan-label">SQLWhale Premium</p>
              <h2 id="subscription-plan-title" className="subscription-card-title">More clarity. More confidence with SQL.</h2>
            </div>
            <span className="subscription-whale" aria-hidden="true">🐳</span>
          </div>
          <div className="subscription-divider" />
          <ul className="subscription-benefits">
            <li><span className="subscription-check">✓</span><span>Build your SQL skills with a more powerful learning experience.</span></li>
            <li><span className="subscription-check">✓</span><span>Make an offer and negotiate directly with the Whale.</span></li>
            <li><span className="subscription-check">✓</span><span>Complete your payment through Razorpay’s secure checkout.</span></li>
          </ul>
          <div className="subscription-cta">
            <SubscribeBargainButton inline />
          </div>
          <p className="subscription-note">Sign in is required to subscribe. Review the terms and refund policy before completing your purchase.</p>
        </section>
      </section>

      <footer className="subscription-footer">
        <span>© {new Date().getFullYear()} SQLWhale · A WebxWhale product</span>
        <nav className="subscription-legal" aria-label="Legal links">
          <Link href="/terms">Terms &amp; Conditions</Link>
          <Link href="/refund-policy">Refund Policy</Link>
          <Link href="/privacy-policy">Privacy Policy</Link>
        </nav>
      </footer>
    </main>
  );
}
