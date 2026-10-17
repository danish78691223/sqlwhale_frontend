"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import api from "@/services/api";

type PlanId = "monthly" | "five-month" | "ten-month";
type RazorpayReply = {
  razorpay_payment_id: string;
  razorpay_subscription_id?: string;
  razorpay_order_id?: string;
  razorpay_signature: string;
};
type RazorpayCheckout = {
  open: () => void;
  on: (event: string, callback: (payload: any) => void) => void;
};
type RazorpayConstructor = new (options: Record<string, unknown>) => RazorpayCheckout;
type SubscriptionStatus = {
  subscribed?: boolean;
  recurring?: boolean;
  subscriptionId?: string | null;
  subscriptionStatus?: string | null;
  cancelAtCycleEnd?: boolean;
  currentPeriodEnd?: string | null;
  plan?: string | null;
  durationMonths?: number | null;
};
declare global { interface Window { Razorpay?: RazorpayConstructor; } }

async function loadRazorpayCheckout(): Promise<RazorpayConstructor> {
  if (window.Razorpay) return window.Razorpay;
  await new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-razorpay-checkout="true"]');
    existing?.remove();
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.dataset.razorpayCheckout = "true";
    script.onload = () => resolve();
    script.onerror = () => { script.remove(); reject(new Error("Unable to load Razorpay Checkout. Please check your connection.")); };
    document.body.appendChild(script);
  });
  if (!window.Razorpay) throw new Error("Razorpay Checkout did not initialize.");
  return window.Razorpay;
}

export default function FixedPriceSubscriptionCheckout({
  planId = "monthly",
  amount = 49,
  duration = "1 month",
  featured = false,
}: { planId?: PlanId; amount?: number; duration?: string; featured?: boolean }) {
  const [policyAccepted, setPolicyAccepted] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [statusLoading, setStatusLoading] = useState(true);
  const [status, setStatus] = useState<SubscriptionStatus | null>(null);
  const [loggedOut, setLoggedOut] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function refreshStatus() {
    try {
      const response = await api.get("/subscription/status");
      setStatus(response.data || null);
      setLoggedOut(false);
    } catch (err: any) {
      if (err?.response?.status === 401) { setLoggedOut(true); setStatus(null); }
    } finally { setStatusLoading(false); }
  }

  useEffect(() => { void refreshStatus(); }, []);

  async function proceedToPay() {
    if (!policyAccepted || processing) {
      if (!policyAccepted) setError("Please accept the Terms & Conditions and Refund/Cancellation Policy before proceeding.");
      return;
    }
    if (loggedOut) { setError("Please log in before subscribing to SQLWhale Premium."); return; }

    setProcessing(true); setError(""); setMessage("");
    try {
      if (planId === "monthly") {
        const response = await api.post("/subscription/fixed-order", {
          termsAccepted: true, refundPolicyAccepted: true, recurringConsent: true,
        });
        const { subscriptionId, keyId, plan } = response.data || {};
        if (!keyId || !subscriptionId) throw new Error("Monthly Razorpay plan or settings are not configured.");
        const Razorpay = await loadRazorpayCheckout();
        const checkout = new Razorpay({
          key: keyId, subscription_id: subscriptionId, name: "SQLWhale",
          description: plan || "SQLWhale Premium — ₹49/month",
          image: "/sqlwhale-logo-main.png", theme: { color: "#009eaa" },
          handler: async (payment: RazorpayReply) => {
            setProcessing(true);
            try {
              const verified = await api.post("/subscription/verify-subscription", payment);
              if ((verified.data?.verified && verified.data?.subscribed) || verified.data?.pendingActivation) {
                window.location.assign("/payment/success"); return;
              }
              const reason = verified.data?.error || "Razorpay has not activated the monthly subscription.";
              window.location.assign("/payment/failed?reason=" + encodeURIComponent(String(reason).slice(0, 220)));
            } catch (err: any) {
              const reason = err?.response?.data?.error || "Subscription verification failed. Contact support if money was deducted.";
              window.location.assign("/payment/failed?reason=" + encodeURIComponent(String(reason).slice(0, 220)));
            } finally { setProcessing(false); }
          },
          modal: { ondismiss: () => setProcessing(false), escape: true, confirm_close: true },
          prefill: {}, notes: { plan: "SQLWhale Premium", purchaseType: "monthly_49" },
        });
        checkout.on("payment.failed", (failure: any) => {
          const reason = failure?.error?.description || "Payment authorization failed.";
          window.location.assign("/payment/failed?reason=" + encodeURIComponent(String(reason).slice(0, 220)));
        });
        checkout.open();
        return;
      }

      const response = await api.post("/subscription/plan-order", {
        planId, termsAccepted: true, refundPolicyAccepted: true,
      });
      const { order, keyId, plan } = response.data || {};
      if (!keyId || !order?.id) throw new Error("Unable to start Razorpay checkout. Please try again.");
      const Razorpay = await loadRazorpayCheckout();
      const checkout = new Razorpay({
        key: keyId, amount: order.amount, currency: order.currency, order_id: order.id,
        name: "SQLWhale", description: plan || "SQLWhale Premium fixed-duration plan",
        image: "/sqlwhale-logo-main.png", theme: { color: "#009eaa" }, prefill: {},
        notes: { plan: planId },
        handler: async (payment: RazorpayReply) => {
          setProcessing(true);
          try {
            const verified = await api.post("/subscription/verify", payment);
            if (verified.data?.verified && verified.data?.subscribed) {
              window.location.assign("/payment/success"); return;
            }
            const reason = verified.data?.error || "Payment could not be verified.";
            window.location.assign("/payment/failed?reason=" + encodeURIComponent(String(reason).slice(0, 220)));
          } catch (err: any) {
            const reason = err?.response?.data?.error || "Payment verification failed. Contact support if money was deducted.";
            window.location.assign("/payment/failed?reason=" + encodeURIComponent(String(reason).slice(0, 220)));
          } finally { setProcessing(false); }
        },
        modal: { ondismiss: () => setProcessing(false), escape: true, confirm_close: true },
      });
      checkout.on("payment.failed", (failure: any) => {
        const reason = failure?.error?.description || "Payment failed.";
        window.location.assign("/payment/failed?reason=" + encodeURIComponent(String(reason).slice(0, 220)));
      });
      checkout.open();
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.message || "Unable to start checkout. Please try again.");
    } finally { setProcessing(false); }
  }

  async function cancelRenewals() {
    if (!status?.subscriptionId || cancelling) return;
    setCancelling(true); setError(""); setMessage("");
    try {
      const response = await api.post("/subscription/monthly/cancel", { subscriptionId: status.subscriptionId });
      setMessage(response.data?.message || "Future renewals cancellation has been requested.");
      await refreshStatus();
    } catch (err: any) { setError(err?.response?.data?.error || "Unable to request cancellation. Please try again."); }
    finally { setCancelling(false); }
  }

  const premiumActive = Boolean(status?.subscribed);
  const monthlyActive = Boolean(status?.recurring);
  const isMonthly = planId === "monthly";
  const buttonLabel = planId === "monthly" ? "Subscribe for ₹49/month" : (monthlyActive ? "Upgrade to " : "Choose ") + (planId === "five-month" ? "5-Month Plan · ₹149" : "10-Month Plan · ₹249");

  return (
    <div className="fixed-plan-checkout">
      {statusLoading ? <p className="fixed-plan-hint" role="status">Checking your SQLWhale plan…</p> : null}
      {premiumActive && ((isMonthly && monthlyActive) || (!isMonthly && !monthlyActive && status?.durationMonths === (planId === "five-month" ? 5 : 10))) ? (
        <div className="fixed-plan-active" role="status">
          <strong>{isMonthly ? "Current Plan · ₹49/month" : "Current Plan · ₹" + amount + " for " + duration}</strong>
          {monthlyActive && status?.subscriptionStatus ? <span>Subscription status: {status.subscriptionStatus}</span> : null}
          {status?.currentPeriodEnd ? <span>Premium access until {new Date(status.currentPeriodEnd).toLocaleDateString("en-IN")}.</span> : null}
          {status?.cancelAtCycleEnd ? <span>Future renewals are scheduled to stop at the end of the current billing period.</span> : null}
          {isMonthly && monthlyActive && !status?.cancelAtCycleEnd && status?.subscriptionId ? (
            <button type="button" className="fixed-plan-cancel-button" onClick={() => void cancelRenewals()} disabled={cancelling || processing}>
              {cancelling ? "Requesting cancellation…" : "Cancel future renewals"}
            </button>
          ) : null}
        </div>
      ) : (
        <>
          {premiumActive && !isMonthly && monthlyActive ? (
            <p className="fixed-plan-hint">Switching to this plan will replace your ₹49/month subscription. After the new payment is verified, future monthly renewals will be cancelled.</p>
          ) : premiumActive && !isMonthly ? (
            <p className="fixed-plan-hint">Choose this plan to switch your Premium access to a fixed {duration} period.</p>
          ) : null}
          <label className="fixed-plan-consent">
            <input type="checkbox" checked={policyAccepted} onChange={(event) => { setPolicyAccepted(event.target.checked); setError(""); }} disabled={processing || statusLoading} />
            <span>
              I agree to the <Link href="/terms" target="_blank" rel="noopener noreferrer">Terms &amp; Conditions</Link> and <Link href="/refund-policy" target="_blank" rel="noopener noreferrer">Refund &amp; Cancellation Policy</Link>.
              {isMonthly
                ? " I explicitly authorize recurring billing of ₹49 every month through Razorpay for up to 120 monthly billing cycles unless I cancel. The current paid billing period is generally non-refundable, subject to stated exceptions and applicable law."
                : " I understand this is a one-time payment for " + duration + " of Premium access, with no automatic renewal. Refunds follow the stated policy and applicable law."}
            </span>
          </label>
          <button type="button" className="fixed-plan-pay-button" onClick={() => void proceedToPay()} disabled={!policyAccepted || processing || statusLoading || loggedOut}>
            {processing ? "Opening secure Razorpay checkout…" : (premiumActive && !isMonthly ? buttonLabel : buttonLabel)}{!processing ? <span aria-hidden="true">↗</span> : null}
          </button>
          {loggedOut ? <p className="fixed-plan-hint">Please <Link href="/login">log in</Link> before subscribing.</p> : null}
          {!policyAccepted ? <p className="fixed-plan-hint">Accept the policies above to enable secure checkout.</p> : null}
        </>
      )}
      {error ? <p className="fixed-plan-feedback is-error" role="alert">{error}</p> : null}
      {message ? <p className="fixed-plan-feedback is-success" role="status">{message}</p> : null}
    </div>
  );
}
