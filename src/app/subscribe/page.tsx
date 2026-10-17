"use client";

import SubscribeBargainButton from "@/components/SubscribeBargainButton";
import FixedPriceSubscriptionCheckout from "@/components/FixedPriceSubscriptionCheckout";

const plans = [
  { id: "monthly", label: "Monthly", duration: "1 month", amount: 49, detail: "Flexible monthly billing", featured: false },
  { id: "five-month", label: "5-Month Plan", duration: "5 months", amount: 149, detail: "Just ₹29.80 per month", featured: true },
  { id: "ten-month", label: "10-Month Plan", duration: "10 months", amount: 249, detail: "Just ₹24.90 per month", featured: false },
] as const;

export default function SubscribePage() {
  return (
    <main className="subscription-page">
      <style jsx global>{`
        .subscription-page,.subscription-page *{box-sizing:border-box}
        .subscription-page{min-height:100vh;background:#f5f3ed;color:#111827;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;overflow:hidden}
        .subscription-page a{color:inherit;text-decoration:none}
        .subscription-content{position:relative;width:min(1160px,calc(100% - 48px));margin:0 auto;padding:72px 0 64px}
        .subscription-glow{position:absolute;z-index:0;width:520px;height:520px;left:50%;top:80px;transform:translateX(-50%);border-radius:50%;background:rgba(0,184,196,.10);filter:blur(110px);pointer-events:none}
        .subscription-heading{position:relative;z-index:1;max-width:760px;margin:0 auto 38px;text-align:center}
        .subscription-eyebrow{display:inline-flex;align-items:center;gap:9px;padding:8px 13px;border:1px solid rgba(17,24,39,.12);border-radius:999px;background:rgba(255,255,255,.48);color:#596170;font-size:11px;font-weight:700;letter-spacing:.18em;text-transform:uppercase}
        .subscription-eyebrow:before{content:"";width:6px;height:6px;border-radius:50%;background:#00b8c4;box-shadow:0 0 12px #009eaa}
        .subscription-title{margin:24px 0 0;color:#111827!important;font-size:clamp(38px,6vw,68px);line-height:1.04;font-weight:760;letter-spacing:-.055em}
        .subscription-title span{color:#00aab5}
        .subscription-description{max-width:660px;margin:20px auto 0;color:#596170!important;font-size:16px;line-height:1.8}
        .subscription-plan-grid{position:relative;z-index:1;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));align-items:stretch;gap:18px;margin:0 auto}
        .subscription-plan-card{position:relative;display:flex;flex-direction:column;min-width:0;padding:29px 25px 25px;border:1px solid rgba(17,24,39,.13);border-radius:22px;background:rgba(255,255,255,.78);box-shadow:0 16px 48px rgba(17,24,39,.045)}
        .subscription-plan-card.featured{z-index:2;transform:translateY(-9px);border:2px solid #111827;background:linear-gradient(155deg,#fff 0%,#f1ffff 100%);box-shadow:0 24px 65px rgba(0,145,156,.14)}
        .subscription-popular{position:absolute;top:-1px;right:-1px;display:inline-flex;align-items:center;gap:7px;padding:10px 15px;border-radius:0 19px 0 15px;background:#111827;color:#fff;font-size:12px;font-weight:800}
        .subscription-plan-top{min-height:58px}
        .subscription-plan-label{margin:0;color:#6b7280!important;font-size:11px;font-weight:800;letter-spacing:.15em;text-transform:uppercase}
        .subscription-plan-name{margin:9px 0 0;color:#111827;font-size:21px;font-weight:750;letter-spacing:-.035em}
        .subscription-plan-whale{font-size:27px;float:right;margin-top:5px}
        .subscription-plan-price-row{display:flex;align-items:baseline;flex-wrap:wrap;gap:8px;margin-top:24px}
        .subscription-plan-price{font-size:clamp(42px,4.4vw,56px);line-height:1;font-weight:850;letter-spacing:-.065em;color:#080d13}
        .subscription-plan-duration{color:#687180;font-size:13px}
        .subscription-plan-detail{min-height:25px;margin:10px 0 0;color:#697180;font-size:12px;line-height:1.6}
        .subscription-plan-divider{height:1px;margin:22px 0;background:rgba(17,24,39,.1)}
        .subscription-plan-features{display:grid;gap:13px;margin:0 0 23px;padding:0;list-style:none;flex:1}
        .subscription-plan-features li{display:flex;align-items:flex-start;gap:10px;color:#374151;font-size:13px;line-height:1.6}
        .subscription-plan-check{flex:0 0 19px;width:19px;height:19px;display:inline-grid;place-items:center;border:1px solid rgba(0,184,196,.28);border-radius:50%;color:#008e99;font-size:11px}
        .subscription-plan-cta{display:block;margin-top:auto}
        .subscription-plan-cta .fixed-plan-checkout{margin-top:0}
        .subscription-plan-note{margin:20px 0 0;color:#697180;font-size:11px;line-height:1.7;text-align:center}
        .subscription-alternative{position:relative;z-index:1;width:min(100%,760px);margin:32px auto 0;padding:22px 26px;border:1px solid rgba(17,24,39,.12);border-radius:18px;background:rgba(255,255,255,.48)}
        .subscription-alternative h3{margin:0;color:#222b38;font-size:16px;font-weight:750}
        .subscription-alternative p{margin:7px 0 15px;color:#687180;font-size:12px;line-height:1.65}
        .subscription-alternative .sqlwhale-subscribe-trigger{display:inline-flex!important;min-height:42px!important;align-items:center!important;justify-content:center!important;gap:8px!important;padding:0 17px!important;border:1px solid rgba(17,24,39,.18)!important;border-radius:11px!important;background:transparent!important;color:#202a36!important;font-size:13px!important;font-weight:700!important;cursor:pointer}
        .subscription-alternative .sqlwhale-subscribe-trigger:hover{background:rgba(17,24,39,.05)!important}
        @media(max-width:900px){.subscription-plan-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.subscription-plan-card.featured{transform:none;grid-row:1;grid-column:span 2;max-width:560px;width:100%;justify-self:center}.subscription-plan-card{padding:25px 22px}}
        @media(max-width:600px){.subscription-content{width:min(100% - 28px,1160px);padding:48px 0 38px}.subscription-heading{margin-bottom:26px}.subscription-description{font-size:14px}.subscription-plan-grid{grid-template-columns:1fr;gap:15px}.subscription-plan-card.featured{grid-column:auto;grid-row:auto;max-width:none}.subscription-plan-card{padding:24px 21px;border-radius:19px}.subscription-plan-top{min-height:50px}.subscription-plan-name{font-size:20px}.subscription-plan-price{font-size:48px}.subscription-alternative{padding:19px;margin-top:24px}}
      `}</style>

      <section className="subscription-content">
        <div className="subscription-glow" aria-hidden="true" />
        <div className="subscription-heading">
          <div className="subscription-eyebrow">SQLWhale Premium · Simple plans</div>
          <h1 className="subscription-title">Simple, transparent <span>pricing.</span></h1>
          <p className="subscription-description">
            Choose the Premium plan that works for you. Every plan unlocks SQLWhale Premium learning access after your payment is verified.
          </p>
        </div>

        <div className="subscription-plan-grid">
          {plans.map((plan) => (
            <section key={plan.id} className={"subscription-plan-card" + (plan.featured ? " featured" : "")} aria-label={plan.label}>
              {plan.featured ? <div className="subscription-popular">★ Best value</div> : null}
              <div className="subscription-plan-top">
                <p className="subscription-plan-label">SQLWhale Premium</p>
                <span className="subscription-plan-whale" aria-hidden="true">🐳</span>
                <h2 className="subscription-plan-name">{plan.label}</h2>
              </div>
              <div className="subscription-plan-price-row">
                <strong className="subscription-plan-price">₹{plan.amount}</strong>
                {plan.id === "monthly" ? <span className="subscription-plan-duration">per month</span> : <span className="subscription-plan-duration">for {plan.duration}</span>}
              </div>
              <p className="subscription-plan-detail">{plan.detail}</p>
              <div className="subscription-plan-divider" />
              <ul className="subscription-plan-features">
                <li><span className="subscription-plan-check">✓</span><span>Premium SQL learning and practice access</span></li>
                <li><span className="subscription-plan-check">✓</span><span>Unlock Premium answer reveals</span></li>
                <li><span className="subscription-plan-check">✓</span><span>Save your SQL progress and query history</span></li>
                <li><span className="subscription-plan-check">✓</span><span>{plan.id === "monthly" ? "Renews monthly; cancel future renewals any time" : "One-time payment, no automatic renewal"}</span></li>
              </ul>
              <div className="subscription-plan-cta">
                <FixedPriceSubscriptionCheckout planId={plan.id} amount={plan.amount} duration={plan.duration} featured={plan.featured} />
              </div>
            </section>
          ))}
        </div>

        <p className="subscription-plan-note">The ₹49 plan is billed monthly through Razorpay recurring subscription. The ₹149 and ₹249 plans are one-time payments for fixed-duration access and do not auto-renew. Charges are subject to the Refund &amp; Cancellation Policy and applicable law.</p>

        <section className="subscription-alternative" aria-label="Alternative subscription option">
          <h3>Want to bargain with the Whale?</h3>
          <p>The existing bargain flow is still available. You must accept the Terms &amp; Conditions and Refund &amp; Cancellation Policy before any payment can proceed.</p>
          <SubscribeBargainButton inline />
        </section>
      </section>
    </main>
  );
}
