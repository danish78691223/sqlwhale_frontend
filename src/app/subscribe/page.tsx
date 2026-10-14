"use client";

import SubscribeBargainButton from "@/components/SubscribeBargainButton";
import FixedPriceSubscriptionCheckout from "@/components/FixedPriceSubscriptionCheckout";

export default function SubscribePage() {
  return (
    <main className="subscription-page">
      <style jsx global>{`
        .subscription-page, .subscription-page * { box-sizing: border-box; }
        .subscription-page {
          min-height: 100vh;
          background: #f5f3ed;
          color: #111827;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          overflow: hidden;
        }
        .subscription-page a { color: inherit; text-decoration: none; }
        .subscription-content { position: relative; width: min(1160px, calc(100% - 48px)); margin: 0 auto; padding: 72px 0 64px; }
        .subscription-glow { position: absolute; z-index: 0; width: 520px; height: 520px; left: 50%; top: 80px; transform: translateX(-50%); border-radius: 50%; background: rgba(0,184,196,.10); filter: blur(110px); pointer-events: none; }
        .subscription-heading { position: relative; z-index: 1; max-width: 760px; margin: 0 auto 42px; text-align: center; }
        .subscription-eyebrow { display: inline-flex; align-items: center; gap: 9px; padding: 8px 13px; border: 1px solid rgba(17,24,39,.12); border-radius: 999px; background: rgba(255,255,255,.48); color: #596170; font-size: 11px; font-weight: 700; letter-spacing: .18em; text-transform: uppercase; }
        .subscription-eyebrow:before { content: ""; width: 6px; height: 6px; border-radius: 50%; background: #00b8c4; box-shadow: 0 0 12px #009eaa; }
        .subscription-title { margin: 24px 0 0; color: #111827 !important; font-size: clamp(38px, 6vw, 68px); line-height: 1.04; font-weight: 760; letter-spacing: -.055em; }
        .subscription-title span { color: #00aab5; }
        .subscription-description { max-width: 620px; margin: 20px auto 0; color: #596170 !important; font-size: 16px; line-height: 1.8; }
        .subscription-card { position: relative; z-index: 1; width: min(100%, 620px); margin: 0 auto; padding: 34px; border: 1px solid rgba(255,255,255,.85); border-radius: 24px; background: linear-gradient(145deg, rgba(255,255,255,.91), rgba(255,255,255,.69)); box-shadow: 0 24px 90px rgba(17,24,39,.07); }
        .subscription-card-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; }
        .subscription-plan-label { margin: 0; color: #008e99 !important; font-size: 11px; font-weight: 750; letter-spacing: .16em; text-transform: uppercase; }
        .subscription-card-title { margin: 10px 0 0; color: #111827 !important; font-size: 25px; line-height: 1.25; font-weight: 700; letter-spacing: -.035em; }
        .subscription-whale { font-size: 36px; line-height: 1; }
        .subscription-divider { height: 1px; margin: 26px 0; background: rgba(17,24,39,.10); }
        .subscription-price-row { display: flex; align-items: baseline; gap: 10px; margin-top: 22px; }
        .subscription-price { color: #111827; font-size: 54px; line-height: 1; font-weight: 800; letter-spacing: -.06em; }
        .subscription-price-note { color: #687180; font-size: 13px; }
        .subscription-benefits { display: grid; gap: 15px; margin: 0; padding: 0; list-style: none; }
        .subscription-benefits li { display: flex; align-items: flex-start; gap: 12px; color: #374151 !important; font-size: 14px; line-height: 1.65; }
        .subscription-check { flex: 0 0 21px; width: 21px; height: 21px; display: inline-grid; place-items: center; border: 1px solid rgba(0,184,196,.28); border-radius: 50%; color: #008e99; font-size: 12px; }
        .subscription-note { margin: 15px 0 0; color: #697180 !important; font-size: 12px; line-height: 1.7; text-align: center; }
        .fixed-plan-checkout { display: grid; gap: 12px; margin-top: 28px; }
        .fixed-plan-consent { display: flex; align-items: flex-start; gap: 10px; padding: 14px; border: 1px solid #d7e3e5; border-radius: 12px; background: rgba(245,251,252,.88); color: #52606c; font-size: 12px; font-weight: 500; line-height: 1.65; cursor: pointer; }
        .fixed-plan-consent input[type="checkbox"] { appearance: auto; flex: 0 0 16px; width: 16px; height: 16px; margin: 2px 0 0; padding: 0; accent-color: #009eaa; cursor: pointer; }
        .fixed-plan-consent a { color: #007f89 !important; font-weight: 750; text-decoration: underline !important; text-underline-offset: 3px; }
        .fixed-plan-consent a:hover { color: #005f67 !important; }
        .fixed-plan-pay-button { display: flex; width: 100%; min-height: 52px; align-items: center; justify-content: center; gap: 10px; padding: 13px 18px; border: 1px solid #009eaa; border-radius: 13px; background: #009eaa; color: #fff; font-size: 15px; font-weight: 750; box-shadow: 0 8px 28px rgba(0,158,170,.18); cursor: pointer; transition: background .2s ease, transform .2s ease, opacity .2s ease; }
        .fixed-plan-pay-button:hover:not(:disabled) { background: #007f89; transform: translateY(-1px); }
        .fixed-plan-pay-button:disabled { cursor: not-allowed; opacity: .48; box-shadow: none; }
        .fixed-plan-hint { margin: 0; color: #7b8790; font-size: 11px; text-align: center; line-height: 1.55; }
        .fixed-plan-hint a { color: #007f89 !important; font-weight: 700; text-decoration: underline !important; }
        .fixed-plan-active { display: grid; gap: 10px; margin-top: 28px; padding: 16px; border: 1px solid #b9e6d1; border-radius: 13px; background: #effbf5; color: #205a42; font-size: 12px; line-height: 1.6; }
        .fixed-plan-active strong { font-size: 14px; }
        .fixed-plan-cancel-button { width: fit-content; min-height: 38px; padding: 8px 13px; border: 1px solid #b6c9c1; border-radius: 9px; background: #fff; color: #205a42; font-size: 12px; font-weight: 700; cursor: pointer; }
        .fixed-plan-cancel-button:disabled { opacity: .6; cursor: not-allowed; }
        .fixed-plan-feedback { margin: 0; padding: 12px 14px; border-radius: 10px; font-size: 12px; line-height: 1.6; }
        .fixed-plan-feedback.is-error { background: #fff1f0; color: #a52720; border: 1px solid #ffd0cc; }
        .fixed-plan-feedback.is-success { background: #ecfdf5; color: #166534; border: 1px solid #bbf7d0; }
        .subscription-alternative { position: relative; z-index: 1; width: min(100%, 620px); margin: 24px auto 0; padding: 22px 26px; border: 1px solid rgba(17,24,39,.12); border-radius: 18px; background: rgba(255,255,255,.48); }
        .subscription-alternative h3 { margin: 0; color: #222b38; font-size: 16px; font-weight: 750; }
        .subscription-alternative p { margin: 7px 0 15px; color: #687180; font-size: 12px; line-height: 1.65; }
        .subscription-alternative .sqlwhale-subscribe-trigger { display: inline-flex !important; min-height: 42px !important; align-items: center !important; justify-content: center !important; gap: 8px !important; padding: 0 17px !important; border: 1px solid rgba(17,24,39,.18) !important; border-radius: 11px !important; background: transparent !important; color: #202a36 !important; font-size: 13px !important; font-weight: 700 !important; cursor: pointer; }
        .subscription-alternative .sqlwhale-subscribe-trigger:hover { background: rgba(17,24,39,.05) !important; }
        @media (max-width: 640px) {
          .subscription-content { width: min(100% - 32px, 1160px); padding: 54px 0 42px; }
          .subscription-heading { margin-bottom: 30px; }
          .subscription-description { font-size: 14px; }
          .subscription-card { padding: 23px 20px; border-radius: 20px; }
          .subscription-card-title { font-size: 22px; }
          .subscription-price { font-size: 48px; }
          .subscription-alternative { padding: 19px; }
        }
      `}</style>

      <section className="subscription-content">
        <div className="subscription-glow" aria-hidden="true" />
        <div className="subscription-heading">
          <div className="subscription-eyebrow">SQLWhale Premium · Monthly plan</div>
          <h1 className="subscription-title">Unlock more with <span>SQLWhale.</span></h1>
          <p className="subscription-description">
            Get SQLWhale Premium for ₹49 each month. Review the policies and explicitly authorize recurring billing before opening secure Razorpay subscription checkout.
          </p>
        </div>

        <section className="subscription-card" aria-labelledby="subscription-plan-title">
          <div className="subscription-card-head">
            <div>
              <p className="subscription-plan-label">SQLWhale Premium</p>
              <h2 id="subscription-plan-title" className="subscription-card-title">More clarity. More confidence with SQL.</h2>
              <div className="subscription-price-row">
                <strong className="subscription-price">₹49</strong>
                <span className="subscription-price-note">per month · INR</span>
              </div>
            </div>
            <span className="subscription-whale" aria-hidden="true">🐳</span>
          </div>
          <div className="subscription-divider" />
          <ul className="subscription-benefits">
            <li><span className="subscription-check">✓</span><span>Unlock SQLWhale Premium learning access after verified payment.</span></li>
            <li><span className="subscription-check">✓</span><span>Secure recurring billing through Razorpay, with server-side signature verification.</span></li>
            <li><span className="subscription-check">✓</span><span>Cancel future renewals from this page; Premium access continues through the current paid period.</span></li>
          </ul>
          <FixedPriceSubscriptionCheckout />
          <p className="subscription-note">Each ₹49 monthly charge is non-refundable except for cases stated in the Refund &amp; Cancellation Policy or where required by law.</p>
        </section>

        <section className="subscription-alternative" aria-label="Alternative subscription option">
          <h3>Want to bargain with the Whale?</h3>
          <p>The existing bargain flow is still available. You must accept the Terms &amp; Conditions and Refund &amp; Cancellation Policy before any payment can proceed.</p>
          <SubscribeBargainButton inline />
        </section>
      </section>
    </main>
  );
}
