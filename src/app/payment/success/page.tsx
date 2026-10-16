"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";

type Status = {
  subscribed?: boolean;
  currentPlan?: string;
  recurring?: boolean;
  subscriptionStatus?: string | null;
  activationPending?: boolean;
  currentPeriodEnd?: string | null;
};

const premiumFeatures = [
  { title: "Premium SQL tasks", detail: "Practice the available SQL task library, including medium and hard challenges." },
  { title: "Reveal Answer", detail: "Access task answer reveal wherever the feature is enabled for Premium members." },
  { title: "Structured SQL learning", detail: "Continue through lessons and SQL concepts with your learning progress." },
  { title: "Query history & progress", detail: "Review your saved query activity and learning progress from your account." },
  { title: "Premium plan management", detail: "Check your subscription state and manage future monthly renewals from your profile." },
];

export default function PaymentSuccessPage() {
  const router = useRouter();
  const [status, setStatus] = useState<Status | null>(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(10);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let alive = true;

    async function verifyCurrentStatus() {
      try {
        const response = await api.get("/subscription/status");
        if (!alive) return;
        const next = response.data as Status;
        setStatus(next);
        if (next?.subscribed && next.currentPlan === "SQLWhale Premium") {
          setMessage("Payment success! You can now use SQLWhale Premium features.");
        } else if (next?.activationPending) {
          setMessage("Your payment authorization was received. Razorpay is still activating the subscription. You do not need to pay again; refresh your profile shortly.");
        } else {
          setMessage("We couldn't confirm Premium activation yet. Please check your profile before attempting another payment.");
        }
      } catch (error: any) {
        if (!alive) return;
        if (error?.response?.status === 401) {
          setMessage("Please log in to check your SQLWhale Premium status.");
        } else {
          setMessage("We couldn't refresh your subscription status. Please check your profile before trying another payment.");
        }
      } finally {
        if (alive) setLoading(false);
      }
    }

    void verifyCurrentStatus();
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    if (loading) return;
    if (countdown <= 0) {
      router.replace("/account");
      return;
    }
    const timer = window.setTimeout(() => setCountdown((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [countdown, loading, router]);

  const isPremium = Boolean(status?.subscribed && status?.currentPlan === "SQLWhale Premium");
  const isPending = Boolean(status?.activationPending && !isPremium);

  return (
    <main className="payment-result-page">
      <style jsx global>{`
        .payment-result-page,.payment-result-page *{box-sizing:border-box}
        .payment-result-page{min-height:100vh;padding:36px 18px 60px;background:radial-gradient(circle at 50% 0%,rgba(0,184,196,.18),transparent 35%),#07151a;color:#e8f1f3;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
        .payment-result-shell{width:min(920px,100%);margin:0 auto}
        .payment-result-brand{display:flex;align-items:center;gap:10px;margin:0 0 28px;color:#e9f8fa;font-size:13px;font-weight:800;letter-spacing:.14em;text-transform:uppercase}
        .payment-result-brand img{width:38px;height:38px;object-fit:contain}
        .payment-result-card{padding:clamp(24px,5vw,46px);border:1px solid rgba(134,219,222,.2);border-radius:28px;background:linear-gradient(145deg,rgba(18,43,49,.97),rgba(9,26,32,.98));box-shadow:0 30px 100px rgba(0,0,0,.28)}
        .payment-result-icon{display:grid;width:76px;height:76px;place-items:center;margin:0 auto 22px;border:1px solid rgba(62,226,169,.36);border-radius:50%;background:rgba(29,185,129,.13);color:#4ce0a7;font-size:38px;font-weight:800}
        .payment-result-kicker{text-align:center;color:#68dce0;font-size:11px;font-weight:800;letter-spacing:.2em;text-transform:uppercase}
        .payment-result-title{margin:13px 0 12px;text-align:center;font-size:clamp(30px,6vw,48px);line-height:1.08;letter-spacing:-.045em;color:#fff}
        .payment-result-subtitle{max-width:620px;margin:0 auto;text-align:center;color:#b9cbd0;font-size:15px;line-height:1.8}
        .payment-result-status{margin:24px auto 0;padding:14px 16px;border:1px solid rgba(72,216,167,.25);border-radius:14px;background:rgba(20,133,94,.12);color:#c3f6e1;font-size:13px;line-height:1.7;text-align:center}
        .payment-result-status.pending{border-color:rgba(247,190,83,.25);background:rgba(180,119,24,.12);color:#ffe6ad}
        .payment-result-features{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:13px;margin-top:30px}
        .payment-result-feature{padding:18px;border:1px solid rgba(160,206,214,.14);border-radius:15px;background:rgba(255,255,255,.035)}
        .payment-result-feature h2{margin:0 0 8px;color:#f3fcfd;font-size:14px}
        .payment-result-feature p{margin:0;color:#a9bec4;font-size:12px;line-height:1.7}
        .payment-result-feature-mark{display:inline-grid;width:25px;height:25px;place-items:center;margin-bottom:12px;border-radius:8px;background:rgba(0,184,196,.14);color:#5be0e4;font-size:13px}
        .payment-result-footer{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:14px;margin-top:28px}
        .payment-result-countdown{color:#91a8ae;font-size:12px;line-height:1.6}
        .payment-result-actions{display:flex;flex-wrap:wrap;gap:10px}
        .payment-result-button{display:inline-flex;min-height:44px;align-items:center;justify-content:center;padding:0 17px;border:1px solid #00b8c4;border-radius:11px;background:#00aab5;color:#041418!important;font-size:13px;font-weight:800;text-decoration:none!important;transition:transform .18s ease,background .18s ease}
        .payment-result-button:hover{transform:translateY(-1px);background:#47d2d8}
        .payment-result-button.secondary{border-color:rgba(183,216,222,.22);background:rgba(255,255,255,.05);color:#e7f5f7!important}
        @media(max-width:640px){.payment-result-page{padding:22px 13px 42px}.payment-result-features{grid-template-columns:1fr}.payment-result-footer{align-items:stretch}.payment-result-actions{width:100%}.payment-result-button{flex:1}.payment-result-countdown{text-align:center;width:100%}}
      `}</style>

      <div className="payment-result-shell">
        <div className="payment-result-brand"><img src="/sqlwhale-logo-main.png" alt="SQLWhale logo" /><span>SQLWhale Premium</span></div>
        <section className="payment-result-card">
          <div className="payment-result-icon" aria-hidden="true">{isPending ? "…" : isPremium ? "✓" : "✓"}</div>
          <div className="payment-result-kicker">{isPending ? "Payment received" : isPremium ? "Payment verified" : "Payment return"}</div>
          <h1 className="payment-result-title">{isPending ? "Activation in progress" : isPremium ? "You're Premium now!" : "Check your Premium status"}</h1>
          <p className="payment-result-subtitle">
            {isPremium
              ? "Payment success! You can now use Premium features of SQLWhale. Keep learning, practice more SQL, and track your progress."
              : isPending
                ? "Your payment authorization was verified, but Razorpay has not activated the subscription yet."
                : "This page alone does not confirm payment. We checked your account with the server; review the status below before making another payment."}
          </p>
          {loading ? <div className="payment-result-status" role="status">Verifying your SQLWhale subscription with the server…</div> : null}
          {!loading && message ? <div className={isPending ? "payment-result-status pending" : "payment-result-status"} role="status">{message}</div> : null}

          <div className="payment-result-features">
            {premiumFeatures.map((feature, index) => (
              <article className="payment-result-feature" key={feature.title}>
                <span className="payment-result-feature-mark" aria-hidden="true">{["✦", "⌘", "▤", "↗", "◷"][index]}</span>
                <h2>{feature.title}</h2>
                <p>{feature.detail}</p>
              </article>
            ))}
          </div>

          <div className="payment-result-footer">
            <span className="payment-result-countdown">
              {loading ? "Please wait while we verify…" : "Redirecting to your profile in " + countdown + " seconds."}
            </span>
            <div className="payment-result-actions">
              <Link className="payment-result-button" href="/account">Go to Profile ↗</Link>
              <Link className="payment-result-button secondary" href="/">Go to Home</Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
