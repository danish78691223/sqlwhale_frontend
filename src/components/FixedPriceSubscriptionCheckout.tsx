"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import api from "@/services/api";

type RazorpayReply = {
  razorpay_payment_id: string;
  razorpay_subscription_id: string;
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
};

declare global {
  interface Window {
    Razorpay?: RazorpayConstructor;
  }
}

async function loadRazorpayCheckout(): Promise<RazorpayConstructor> {
  if (window.Razorpay) return window.Razorpay;

  await new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-razorpay-checkout="true"]');
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Unable to load Razorpay Checkout.")), { once: true });
      if (window.Razorpay) resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.dataset.razorpayCheckout = "true";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Unable to load Razorpay Checkout. Please check your connection."));
    document.body.appendChild(script);
  });

  if (!window.Razorpay) throw new Error("Razorpay Checkout did not initialize.");
  return window.Razorpay;
}

export default function FixedPriceSubscriptionCheckout() {
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
      if (err?.response?.status === 401) {
        setLoggedOut(true);
        setStatus(null);
      }
    } finally {
      setStatusLoading(false);
    }
  }

  useEffect(() => {
    void refreshStatus();
  }, []);

  async function proceedToPay() {
    if (!policyAccepted || processing) {
      if (!policyAccepted) setError("Please accept the policies and recurring-payment authorization before proceeding.");
      return;
    }
    if (loggedOut) {
      setError("Please log in before subscribing to SQLWhale Premium.");
      return;
    }

    setProcessing(true);
    setError("");
    setMessage("");

    try {
      const response = await api.post("/subscription/fixed-order", {
        termsAccepted: true,
        refundPolicyAccepted: true,
        recurringConsent: true,
      });
      const { subscriptionId, keyId, plan } = response.data || {};
      if (!keyId || !subscriptionId) {
        throw new Error("Monthly plan or Razorpay settings are not configured yet. Please try again later.");
      }

      const Razorpay = await loadRazorpayCheckout();
      const checkout = new Razorpay({
        key: keyId,
        subscription_id: subscriptionId,
        name: "SQLWhale",
        description: plan || "SQLWhale Premium — ₹49/month",
        image: "/sqlwhale-logo-main.png",
        theme: { color: "#009eaa" },
        handler: async (payment: RazorpayReply) => {
          setProcessing(true);
          setError("");
          try {
            const verified = await api.post("/subscription/verify-subscription", payment);
            if (verified.data?.verified && verified.data?.subscribed) {
              setMessage("Payment verified. Your ₹49/month SQLWhale Premium subscription is active.");
              setPolicyAccepted(false);
              await refreshStatus();
            } else if (verified.data?.pendingActivation) {
              setMessage(verified.data?.message || "Payment authorization was verified. Premium will activate once Razorpay confirms the subscription.");
              await refreshStatus();
            } else {
              setError(verified.data?.error || "Razorpay has not activated the subscription yet. Please check the status again shortly.");
            }
          } catch (err: any) {
            setError(err?.response?.data?.error || "Subscription verification failed. Save your payment ID and contact support if money was deducted.");
          } finally {
            setProcessing(false);
          }
        },
        modal: {
          ondismiss: () => setProcessing(false),
          escape: true,
          confirm_close: true,
        },
        prefill: {},
        notes: { plan: "SQLWhale Premium", purchaseType: "monthly_49" },
      });

      checkout.on("payment.failed", (failure: any) => {
        setError(failure?.error?.description || "Payment authorization failed. You can try again.");
        setProcessing(false);
      });
      checkout.open();
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.message || "Unable to start Razorpay subscription checkout. Please try again.");
      setProcessing(false);
    }
  }

  async function cancelRenewals() {
    if (!status?.subscriptionId || cancelling) return;
    setCancelling(true);
    setError("");
    setMessage("");
    try {
      const response = await api.post("/subscription/monthly/cancel", { subscriptionId: status.subscriptionId });
      setMessage(response.data?.message || "Future renewals cancellation has been requested.");
      await refreshStatus();
    } catch (err: any) {
      setError(err?.response?.data?.error || "Unable to request cancellation. Please try again.");
    } finally {
      setCancelling(false);
    }
  }

  const premiumActive = Boolean(status?.subscribed);
  const monthlyActive = Boolean(status?.recurring);

  return (
    <div className="fixed-plan-checkout">
      {statusLoading ? <p className="fixed-plan-hint" role="status">Checking your SQLWhale subscription…</p> : null}

      {premiumActive ? (
        <div className="fixed-plan-active" role="status">
          <strong>{monthlyActive ? "Your ₹49/month Premium subscription is active." : "SQLWhale Premium is already active on your account."}</strong>
          {monthlyActive && status?.subscriptionStatus ? <span>Subscription status: {status.subscriptionStatus}</span> : null}
          {status?.cancelAtCycleEnd ? (
            <span>Future renewals are scheduled to stop at the end of the current billing period{status.currentPeriodEnd ? " (" + new Date(status.currentPeriodEnd).toLocaleDateString("en-IN") + ")" : ""}.</span>
          ) : null}
          {monthlyActive && !status?.cancelAtCycleEnd && status?.subscriptionId ? (
            <button type="button" className="fixed-plan-cancel-button" onClick={() => void cancelRenewals()} disabled={cancelling || processing}>
              {cancelling ? "Requesting cancellation…" : "Cancel future renewals"}
            </button>
          ) : null}
        </div>
      ) : (
        <>
          <label className="fixed-plan-consent">
            <input
              type="checkbox"
              checked={policyAccepted}
              onChange={(event) => {
                setPolicyAccepted(event.target.checked);
                setError("");
              }}
              disabled={processing || statusLoading}
            />
            <span>
              I agree to the <Link href="/terms" target="_blank" rel="noopener noreferrer">Terms &amp; Conditions</Link> and the <Link href="/refund-policy" target="_blank" rel="noopener noreferrer">Refund &amp; Cancellation Policy</Link>. I explicitly authorize recurring billing of ₹49 every month through Razorpay for up to 120 monthly billing cycles unless I cancel sooner. I understand the current paid billing period is generally non-refundable except where the policy or applicable law says otherwise.
            </span>
          </label>

          <button
            type="button"
            className="fixed-plan-pay-button"
            onClick={() => void proceedToPay()}
            disabled={!policyAccepted || processing || statusLoading || loggedOut}
          >
            {processing ? "Opening secure subscription checkout…" : "Subscribe for ₹49/month"}
            {!processing ? <span aria-hidden="true">↗</span> : null}
          </button>

          {loggedOut ? <p className="fixed-plan-hint">Please <Link href="/login">log in</Link> before subscribing.</p> : null}
          {!policyAccepted ? <p className="fixed-plan-hint">Check the box above to authorize monthly billing and enable checkout.</p> : null}
        </>
      )}

      {error ? <p className="fixed-plan-feedback is-error" role="alert">{error}</p> : null}
      {message ? <p className="fixed-plan-feedback is-success" role="status">{message}</p> : null}
    </div>
  );
}
