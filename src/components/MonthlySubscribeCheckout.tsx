"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import api from "@/services/api";

type CheckoutReply = {
  razorpay_payment_id: string;
  razorpay_subscription_id: string;
  razorpay_signature: string;
};

type RazorpayCheckout = {
  open: () => void;
  on: (event: string, callback: (payload: any) => void) => void;
};
type RazorpayConstructor = new (options: Record<string, unknown>) => RazorpayCheckout;

declare global {
  interface Window {
    Razorpay?: RazorpayConstructor;
  }
}

async function loadRazorpay(): Promise<RazorpayConstructor> {
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
    script.onerror = () => reject(new Error("Unable to load Razorpay Checkout. Check your connection and try again."));
    document.body.appendChild(script);
  });
  if (!window.Razorpay) throw new Error("Razorpay Checkout did not initialize.");
  return window.Razorpay;
}

type MonthlyStatus = {
  subscribed?: boolean;
  recurring?: boolean;
  subscriptionId?: string | null;
  status?: string | null;
  cancelAtCycleEnd?: boolean;
};

export default function MonthlySubscribeCheckout() {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [refundAccepted, setRefundAccepted] = useState(false);
  const [recurringConsent, setRecurringConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<MonthlyStatus | null>(null);
  const [loggedOut, setLoggedOut] = useState(false);

  async function refreshStatus() {
    try {
      const response = await api.get("/subscription/status");
      setStatus(response.data || null);
      setLoggedOut(false);
    } catch (err: any) {
      if (err?.response?.status === 401) setLoggedOut(true);
    }
  }

  useEffect(() => { void refreshStatus(); }, []);

  async function proceedToPay() {
    if (!termsAccepted || !refundAccepted || !recurringConsent) {
      setError("Please accept all three terms before continuing.");
      return;
    }
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const response = await api.post("/subscription/monthly/order", {
        termsAccepted,
        refundPolicyAccepted: refundAccepted,
        recurringConsent,
      });
      const { subscriptionId, keyId, plan } = response.data || {};
      if (!subscriptionId || !keyId) {
        throw new Error("Subscription checkout is not configured yet. Please try again later.");
      }

      const Razorpay = await loadRazorpay();
      const checkout = new Razorpay({
        key: keyId,
        subscription_id: subscriptionId,
        name: "SQLWhale",
        description: plan?.description || "SQLWhale Premium — ₹49 per month",
        image: "/sqlwhale-logo-main.png",
        theme: { color: "#1862FD" },
        handler: async (payment: CheckoutReply) => {
          setBusy(true);
          setError("");
          try {
            const verified = await api.post("/subscription/monthly/verify", payment);
            if (verified.data?.subscribed) {
              setMessage("Payment and subscription verified. SQLWhale Premium is now active.");
            } else {
              setMessage(verified.data?.message || "Your recurring payment authorization was received. Premium access will activate when Razorpay confirms the subscription.");
            }
            await refreshStatus();
          } catch (err: any) {
            setError(err?.response?.data?.error || "We could not verify the subscription yet. Please keep the payment reference and contact support.");
          } finally {
            setBusy(false);
          }
        },
        modal: {
          ondismiss: () => setBusy(false),
          escape: true,
          confirm_close: true,
        },
        prefill: {},
        notes: { product: "SQLWhale Premium Monthly" },
      });
      checkout.on("payment.failed", (failure: any) => {
        setError(failure?.error?.description || "Payment authorization failed. No subscription has been activated.");
        setBusy(false);
      });
      checkout.open();
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.message || "Could not start checkout. Please try again.");
      setBusy(false);
    }
  }

  async function cancelRenewal() {
    if (!status?.subscriptionId || cancelling) return;
    setCancelling(true);
    setError("");
    setMessage("");
    try {
      const response = await api.post("/subscription/monthly/cancel", { subscriptionId: status.subscriptionId });
      setMessage(response.data?.message || "Future renewal cancellation has been requested.");
      await refreshStatus();
    } catch (err: any) {
      setError(err?.response?.data?.error || "Unable to request cancellation. Please contact support.");
    } finally {
      setCancelling(false);
    }
  }

  const hasActiveMonthly = Boolean(status?.subscribed && status?.recurring);

  return (
    <section className="monthly-checkout">
      <div className="monthly-checkout-hero">
        <span className="monthly-checkout-eyebrow">SQLWHALE PREMIUM / MONTHLY</span>
        <h1>Learn SQL. <span>See the whole query.</span></h1>
        <p>Unlock SQLWhale Premium with a straightforward monthly plan. Secure recurring billing is handled by Razorpay.</p>
      </div>

      <div className="monthly-checkout-card">
        <div className="monthly-plan-top">
          <div>
            <span className="monthly-plan-label">SQLWHALE PREMIUM</span>
            <h2>Monthly learning plan</h2>
            <p>Access premium SQL learning features while your subscription is active.</p>
          </div>
          <div className="monthly-price"><strong>₹49</strong><span>/ month</span></div>
        </div>

        <div className="monthly-plan-divider" />
        <ul className="monthly-benefits">
          <li><span>✓</span> Premium SQL learning access while active</li>
          <li><span>✓</span> One monthly charge of ₹49 through Razorpay</li>
          <li><span>✓</span> Cancel future renewals from this page</li>
        </ul>

        {hasActiveMonthly ? (
          <div className="monthly-active-panel" role="status">
            <strong>Your monthly subscription is active.</strong>
            <span>Status: {status?.status || "active"}{status?.cancelAtCycleEnd ? " · Future renewal cancellation requested" : ""}</span>
            {!status?.cancelAtCycleEnd ? (
              <button type="button" className="monthly-secondary-button" onClick={() => void cancelRenewal()} disabled={cancelling}>
                {cancelling ? "Requesting cancellation…" : "Cancel future renewals"}
              </button>
            ) : null}
          </div>
        ) : (
          <>
            <div className="monthly-consent-list">
              <label className="monthly-consent">
                <input type="checkbox" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} />
                <span>I have read and agree to the <Link href="/terms" target="_blank">Terms &amp; Conditions</Link>.</span>
              </label>
              <label className="monthly-consent">
                <input type="checkbox" checked={refundAccepted} onChange={(e) => setRefundAccepted(e.target.checked)} />
                <span>I have read and agree to the <Link href="/refund-policy" target="_blank">Return &amp; Cancellation Policy</Link>, including the non-refundable fee rule subject to the stated exceptions.</span>
              </label>
              <label className="monthly-consent">
                <input type="checkbox" checked={recurringConsent} onChange={(e) => setRecurringConsent(e.target.checked)} />
                <span>I authorize Razorpay to set up recurring billing of ₹49 each month until I cancel. I understand that cancellation stops future renewals, and the current paid billing period is generally non-refundable except as stated in the policy or required by law.</span>
              </label>
            </div>
            <button type="button" className="monthly-pay-button" onClick={() => void proceedToPay()} disabled={busy || !termsAccepted || !refundAccepted || !recurringConsent}>
              {busy ? "Opening secure checkout…" : "Proceed to Pay ₹49 / month"}
            </button>
            <p className="monthly-secure-note">The payment button becomes available after you check all boxes. You will confirm the payment method or mandate in Razorpay Checkout.</p>
            {loggedOut ? <p className="monthly-login-note">Please <Link href="/login">log in</Link> before starting your subscription.</p> : null}
          </>
        )}

        {error ? <p className="monthly-feedback monthly-error" role="alert">{error}</p> : null}
        {message ? <p className="monthly-feedback monthly-success" role="status">{message}</p> : null}
        <p className="monthly-policy-footnote">Plan: ₹49/month · INR · Recurring subscription · <Link href="/refund-policy">Refund and cancellation details</Link></p>
      </div>
    </section>
  );
}
