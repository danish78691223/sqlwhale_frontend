"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PaymentFailedPage() {
  const router = useRouter();
  const [reason, setReason] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setReason(params.get("reason") || "");
    const timer = window.setTimeout(() => router.replace("/contact?issue=payment"), 10000);
    return () => window.clearTimeout(timer);
  }, [router]);

  return (
    <main className="payment-failed-page">
      <style jsx global>{`
        .payment-failed-page,.payment-failed-page *{box-sizing:border-box}
        .payment-failed-page{display:grid;min-height:100vh;place-items:center;padding:24px;background:radial-gradient(circle at 50% 0%,rgba(255,94,94,.14),transparent 38%),#081317;color:#edf4f5;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
        .payment-failed-card{width:min(650px,100%);padding:clamp(24px,5vw,44px);border:1px solid rgba(255,160,160,.19);border-radius:26px;background:linear-gradient(145deg,rgba(35,34,39,.98),rgba(14,26,31,.98));box-shadow:0 28px 90px rgba(0,0,0,.3);text-align:center}
        .payment-failed-icon{display:grid;width:74px;height:74px;place-items:center;margin:0 auto 20px;border-radius:50%;border:1px solid rgba(255,116,116,.3);background:rgba(207,57,57,.13);color:#ff8585;font-size:36px;font-weight:700}
        .payment-failed-label{color:#ff9696;font-size:11px;font-weight:800;letter-spacing:.2em;text-transform:uppercase}
        .payment-failed-title{margin:13px 0;color:#fff;font-size:clamp(30px,6vw,44px);letter-spacing:-.04em}
        .payment-failed-copy{margin:0 auto;max-width:520px;color:#becbd0;font-size:14px;line-height:1.85}
        .payment-failed-reason{margin-top:18px;padding:12px 14px;border-radius:12px;background:rgba(255,255,255,.045);color:#e5bdbe;font-size:12px;line-height:1.7;overflow-wrap:anywhere}
        .payment-failed-note{margin-top:20px;color:#9cb0b7;font-size:12px;line-height:1.8}
        .payment-failed-actions{display:flex;flex-wrap:wrap;justify-content:center;gap:11px;margin-top:26px}
        .payment-failed-button{display:inline-flex;min-height:46px;align-items:center;justify-content:center;padding:0 18px;border:1px solid #00b8c4;border-radius:11px;background:#00aab5;color:#051417!important;font-size:13px;font-weight:800;text-decoration:none!important}
        .payment-failed-button.secondary{border-color:rgba(185,215,220,.22);background:rgba(255,255,255,.04);color:#e7f5f7!important}
        @media(max-width:520px){.payment-failed-actions{flex-direction:column}.payment-failed-button{width:100%}}
      `}</style>
      <section className="payment-failed-card">
        <div className="payment-failed-icon" aria-hidden="true">!</div>
        <div className="payment-failed-label">SQLWhale checkout</div>
        <h1 className="payment-failed-title">Payment failed</h1>
        <p className="payment-failed-copy">
          We couldn't complete your payment. Your SQLWhale Premium access has not been activated by this failed checkout. Please do not retry if money was deducted—first contact support so we can help check the transaction.
        </p>
        {reason ? <div className="payment-failed-reason"><strong>Checkout message:</strong> {reason}</div> : null}
        <p className="payment-failed-note">
          If you get an issue while making the payment, send a query through our Contact Us page and select <strong>Payment related Issues</strong>. You will be redirected to Contact Us automatically in 10 seconds.
        </p>
        <div className="payment-failed-actions">
          <Link className="payment-failed-button" href="/contact?issue=payment">Contact Us</Link>
          <Link className="payment-failed-button secondary" href="/">Go to Home</Link>
        </div>
      </section>
    </main>
  );
}
