"use client";

import { useState } from "react";
import api from "@/services/api";

type BargainState = {
  sessionId: string;
  originalPrice: number;
    attempts: number;
  remainingAttempts: number;
  locked: boolean;
  acceptedPrice: number | null;
};

type RazorpayReply = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

async function loadRazorpayCheckout() {
  const win = window as unknown as {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void; on: (event: string, callback: (response: any) => void) => void };
  };
  if (win.Razorpay) return win.Razorpay;

  await new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-razorpay-checkout="true"]');
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Unable to load Razorpay checkout.")), { once: true });
      if (win.Razorpay) resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.dataset.razorpayCheckout = "true";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Unable to load Razorpay checkout. Check your internet connection and retry."));
    document.body.appendChild(script);
  });

  if (!win.Razorpay) throw new Error("Razorpay checkout did not initialize. Please retry.");
  return win.Razorpay;
}

export default function SubscribeBargainButton({ inline = false }: { inline?: boolean }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paying, setPaying] = useState(false);
  const [offer, setOffer] = useState("500");
  const [bargain, setBargain] = useState<BargainState | null>(null);
  const [counterOffer, setCounterOffer] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [policyAccepted, setPolicyAccepted] = useState(false);
  const [view, setView] = useState<"choice" | "bargain">("choice");

  async function beginBargain() {
    setOpen(true);
    setPolicyAccepted(false);
    setView("choice");
    setLoading(true);
    setError("");
    setMessage("");
    setCounterOffer(null);
    setBargain(null);
    try {
      const statusResponse = await api.get("/subscription/status");
      if (statusResponse.data?.subscribed) {
        setSubscribed(true);
        setMessage("SQLWhale Premium aapke account par pehle se active hai. Happy querying! 🎉");
        return;
      }
      setMessage("");
    } catch (err: any) {
      const status = err?.response?.status;
      setError(status === 401
        ? "Subscribe karne ke liye pehle SQLWhale mein login karein."
        : err?.response?.data?.error || "Bargain start nahi ho paaya. Dobara try karein.");
    } finally {
      setLoading(false);
    }
  }

  async function startBargain() {
    setView("bargain");
    setLoading(true);
    setError("");
    setMessage("");
    setCounterOffer(null);
    setBargain(null);
    try {
      const response = await api.post("/subscription/bargain/start");
      setBargain(response.data.bargain);
      setMessage("Enter an offer and let's see if we can make a deal. 🐳");
    } catch (err: any) {
      setError(err?.response?.data?.error || "Could not start bargaining. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function submitOffer() {
    if (!bargain) return;
    const amount = Number(offer);
    if (!Number.isSafeInteger(amount) || amount < 1 || amount > 1000) {
      setError("₹1 se ₹1,000 ke beech whole-number offer enter karein.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await api.post("/subscription/bargain/offer", {
        sessionId: bargain.sessionId,
        offer: amount,
      });
      setBargain(response.data.bargain);
      setCounterOffer(response.data.counterOffer ?? null);
      setMessage(response.data.message || "");
    } catch (err: any) {
      setError(err?.response?.data?.error || "Offer submit nahi ho paaya. Dobara try karein.");
    } finally {
      setLoading(false);
    }
  }

  async function acceptCounterOffer() {
    if (!bargain || counterOffer === null) return;
    setLoading(true);
    setError("");
    try {
      const response = await api.post("/subscription/bargain/accept", {
        sessionId: bargain.sessionId,
        price: counterOffer,
      });
      setBargain(response.data.bargain);
      setCounterOffer(null);
      setMessage(response.data.message || "Counter-offer accepted.");
    } catch (err: any) {
      setError(err?.response?.data?.error || "Counter-offer accept nahi ho paaya.");
    } finally {
      setLoading(false);
    }
  }

  async function checkout(direct = false) {
    if (!policyAccepted) {
      setError("Please accept the Terms & Conditions and Refund/Cancellation Policy before paying.");
      return;
    }
    if (!direct && (!bargain || !bargain.locked || !bargain.acceptedPrice)) {
      setError("Accept a valid deal before checkout.");
      return;
    }
    setPaying(true);
    setError("");
    try {
      const response = await api.post("/subscription/order", { ...(direct ? { direct: true } : { sessionId: bargain?.sessionId }), termsAccepted: true, refundPolicyAccepted: true });
      const { order, keyId, plan } = response.data;
      if (!keyId || !order?.id) throw new Error("Payment settings abhi ready nahi hain. Please baad mein retry karein.");

      const Razorpay = await loadRazorpayCheckout();
      const checkoutInstance = new Razorpay({
        key: keyId,
        amount: order.amount,
        currency: order.currency,
        name: "SQLWhale",
        description: plan || "SQLWhale Premium Subscription",
        order_id: order.id,
        image: "/sqlwhale-logo-main.png",
        theme: { color: "#1862FD" },
        handler: async (payment: RazorpayReply) => {
          setPaying(true);
          try {
            const verified = await api.post("/subscription/verify", payment);
            if (verified.data?.verified && verified.data?.subscribed) {
              setSubscribed(true);
              setMessage("Payment verified! 🎉 SQLWhale Premium aapke account par active hai.");
              setError("");
            } else {
              setError("Payment confirmation abhi verify nahi hui. Account status check karein.");
            }
          } catch (err: any) {
            setError(err?.response?.data?.error || "Payment verify nahi ho paaya. Payment ID save karke support se contact karein.");
          } finally {
            setPaying(false);
          }
        },
        modal: {
          ondismiss: () => setPaying(false),
          escape: true,
          confirm_close: true,
        },
        prefill: {},
        notes: { plan: "SQLWhale Premium" },
      });
      checkoutInstance.on("payment.failed", (failure: any) => {
        setError(failure?.error?.description || "Payment fail hua. Aap dobara try kar sakte hain.");
        setPaying(false);
      });
      checkoutInstance.open();
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.message || "Checkout open nahi ho paaya.");
    } finally {
      setPaying(false);
    }
  }

  return (
    <>
      <button type="button" className="support-button sqlwhale-subscribe-trigger" onClick={() => { if (inline) void beginBargain(); else window.location.href = "/subscribe"; }}>
        Subscribe <span aria-hidden="true">↗</span>
      </button>

      {open ? (
        <div className="sqlwhale-bargain-overlay" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget && !loading && !paying) setOpen(false);
        }}>
          <section className="sqlwhale-bargain-modal" role="dialog" aria-modal="true" aria-labelledby="sqlwhale-bargain-title">
            <button type="button" className="sqlwhale-bargain-close" aria-label="Close subscription popup" onClick={() => setOpen(false)} disabled={loading || paying}>×</button>
            <div className="sqlwhale-bargain-whale" aria-hidden="true">{subscribed ? "🐳✨" : "🐳"}</div>
            <p className="sqlwhale-bargain-eyebrow">SQLWHALE PREMIUM / SUBSCRIPTION</p>
            <h2 id="sqlwhale-bargain-title">{subscribed ? "Welcome aboard!" : "Let's make a deal."}</h2>
            <p className="sqlwhale-bargain-intro">
              {subscribed
                ? "Premium access is active. Happy querying!"
                : "Tutorials se aage badho. Apna offer do aur Whale ke saath bargain karo."}
            </p>

            {!subscribed ? (
              <div className="sqlwhale-bargain-prices">
                <div><span>Original price</span><strong>₹1,000</strong></div>
                <div><span>Personal bargain</span><strong>Your offer</strong></div>
              </div>
            ) : null}

            {message ? <div className={subscribed ? "sqlwhale-bargain-message is-success" : "sqlwhale-bargain-message"} aria-live="polite">{message}</div> : null}
            {error ? <div className="sqlwhale-bargain-error" role="alert">{error}</div> : null}

            {!subscribed && (view === "choice" || Boolean(bargain?.locked)) ? (
              <label className="sqlwhale-bargain-consent">
                <input
                  type="checkbox"
                  checked={policyAccepted}
                  onChange={(event) => { setPolicyAccepted(event.target.checked); setError(""); }}
                  disabled={paying || loading}
                />
                <span>
                  I agree to the <a href="/terms" target="_blank" rel="noopener noreferrer">Terms &amp; Conditions</a> and <a href="/refund-policy" target="_blank" rel="noopener noreferrer">Refund &amp; Cancellation Policy</a>, including the non-refundable payment terms and stated exceptions.
                </span>
              </label>
            ) : null}

            {!subscribed && view === "choice" && !loading ? (
              <div className="sqlwhale-subscribe-choices">
                <button type="button" className="sqlwhale-bargain-primary" onClick={() => void checkout(true)} disabled={paying || !policyAccepted}>
                  Proceed to Pay ₹1,000
                </button>
                <button type="button" className="sqlwhale-bargain-secondary" onClick={() => void startBargain()} disabled={paying}>
                  🤝 Bargain for a better price
                </button>
                <p className="sqlwhale-bargain-choice-note">Pay the listed price instantly, or bargain with the Whale first.</p>
              </div>
            ) : null}

            {!subscribed && view === "bargain" && bargain && !bargain.locked ? (
              <form className="sqlwhale-bargain-form" onSubmit={(event) => { event.preventDefault(); void submitOffer(); }}>
                <label htmlFor="sqlwhale-bargain-offer">Your offer (₹)</label>
                <div className="sqlwhale-bargain-input-row">
                  <span>₹</span>
                  <input
                    id="sqlwhale-bargain-offer"
                    type="number"
                    min="1"
                    max="1000"
                    step="1"
                    inputMode="numeric"
                    value={offer}
                    onChange={(event) => setOffer(event.target.value)}
                    disabled={loading || paying}
                    required
                  />
                </div>
                <p className="sqlwhale-bargain-attempts">{bargain.remainingAttempts} offer attempt{bargain.remainingAttempts === 1 ? "" : "s"} remaining</p>
                <button type="submit" className="sqlwhale-bargain-primary" disabled={loading || paying}>
                  {loading ? "Checking offer…" : "Submit offer"}
                </button>
              </form>
            ) : null}

            {!subscribed && view === "bargain" && counterOffer !== null && !bargain?.locked ? (
              <button type="button" className="sqlwhale-bargain-secondary" onClick={() => void acceptCounterOffer()} disabled={loading || paying}>
                {loading ? "Accepting…" : "Accept Whale's offer · ₹" + counterOffer}
              </button>
            ) : null}

            {!subscribed && view === "bargain" && bargain?.locked ? (
              <div className="sqlwhale-bargain-checkout">
                <p>Deal price locked: <strong>₹{bargain.acceptedPrice?.toLocaleString("en-IN")}</strong></p>
                <button type="button" className="sqlwhale-bargain-primary" onClick={() => void checkout()} disabled={paying || loading || !policyAccepted}>
                  {paying ? "Processing…" : "Deal Done & Pay ₹" + bargain.acceptedPrice?.toLocaleString("en-IN")}
                </button>
              </div>
            ) : null}

            {!bargain && error.includes("login") ? (
              <a className="sqlwhale-bargain-login" href="/login">Login to continue ↗</a>
            ) : null}

            {loading || paying ? <p className="sqlwhale-bargain-loading" role="status">One moment, Whale is checking the database…</p> : null}
            <p className="sqlwhale-bargain-footnote">Secure checkout powered by Razorpay · INR payments</p>
          </section>
        </div>
      ) : null}
    </>
  );
}
