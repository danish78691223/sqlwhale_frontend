"use client";

import Link from "next/link";
import { useState } from "react";
import api from "@/services/api";

type RazorpayReply = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
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
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function proceedToPay() {
    if (!policyAccepted || processing) {
      if (!policyAccepted) setError("Please accept the Terms & Conditions and Refund/Cancellation Policy before proceeding.");
      return;
    }

    setProcessing(true);
    setError("");
    setMessage("");

    try {
      const response = await api.post("/subscription/fixed-order", {
        termsAccepted: true,
        refundPolicyAccepted: true,
      });
      const { order, keyId, plan } = response.data || {};
      if (!keyId || !order?.id) {
        throw new Error("Payment settings are not ready yet. Please try again later.");
      }

      const Razorpay = await loadRazorpayCheckout();
      const checkout = new Razorpay({
        key: keyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        name: "SQLWhale",
        description: plan || "SQLWhale Premium Plan — ₹49",
        image: "/sqlwhale-logo-main.png",
        theme: { color: "#009eaa" },
        handler: async (payment: RazorpayReply) => {
          setProcessing(true);
          setError("");
          try {
            const verified = await api.post("/subscription/verify", payment);
            if (verified.data?.verified && verified.data?.subscribed) {
              setMessage("Payment verified successfully. SQLWhale Premium is now active.");
            } else {
              setError("Payment confirmation has not been verified yet. Please check your account status.");
            }
          } catch (err: any) {
            setError(err?.response?.data?.error || "Payment verification failed. Save your payment ID and contact support if money was deducted.");
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
        notes: { plan: "SQLWhale Premium", purchaseType: "fixed_49" },
      });

      checkout.on("payment.failed", (failure: any) => {
        setError(failure?.error?.description || "Payment failed. You can try again.");
        setProcessing(false);
      });
      checkout.open();
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.message || "Unable to start checkout. Please try again.");
      setProcessing(false);
    }
  }

  return (
    <div className="fixed-plan-checkout">
      <label className="fixed-plan-consent">
        <input
          type="checkbox"
          checked={policyAccepted}
          onChange={(event) => {
            setPolicyAccepted(event.target.checked);
            setError("");
          }}
          disabled={processing}
        />
        <span>
          I agree to the <Link href="/terms" target="_blank" rel="noopener noreferrer">Terms &amp; Conditions</Link> and the <Link href="/refund-policy" target="_blank" rel="noopener noreferrer">Refund &amp; Cancellation Policy</Link>. I understand the ₹49 plan payment is non-refundable except for the cases described in that policy or required by law.
        </span>
      </label>

      <button
        type="button"
        className="fixed-plan-pay-button"
        onClick={() => void proceedToPay()}
        disabled={!policyAccepted || processing}
      >
        {processing ? "Processing secure checkout…" : "Proceed to Pay ₹49"}
        {!processing ? <span aria-hidden="true">↗</span> : null}
      </button>

      {!policyAccepted ? <p className="fixed-plan-hint">Check the box above to enable payment.</p> : null}
      {error ? <p className="fixed-plan-feedback is-error" role="alert">{error}</p> : null}
      {message ? <p className="fixed-plan-feedback is-success" role="status">{message}</p> : null}
    </div>
  );
}
