"use client";

import { useEffect, useState } from "react";
import { authApi } from "../services/api";

const CATEGORIES = [
  ["learning", "Learning experience"],
  ["bug", "Bug / problem"],
  ["ui", "UI / experience"],
  ["feature", "Feature request"],
  ["other", "Something else"],
];

export default function FeedbackWidget() {
  const [user, setUser] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [category, setCategory] = useState("learning");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState("");

  useEffect(() => {
    const openFeedback = () => setOpen(true);
    window.addEventListener("sqlwhale:open-feedback", openFeedback);
    let active = true;
    authApi.get("/auth/me")
      .then((response) => {
        if (active) setUser(response.data?.user || null);
      })
      .catch(() => {
        if (active) setUser(null);
      });
    return () => {
      active = false;
      window.removeEventListener("sqlwhale:open-feedback", openFeedback);
    };
  }, []);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!message.trim()) return;

    setSending(true);
    setResult("");

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: "SQLWhale",
          userId: user?.id || "",
          name: user?.name || "SQLWhale visitor",
          email: user?.email || "",
          rating,
          category,
          message: message.trim(),
          page: window.location.pathname,
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || "Unable to submit feedback.");

      setMessage("");
      setRating(5);
      setCategory("learning");
      setResult("Thanks — your feedback has been sent.");
    } catch (error: any) {
      setResult(error.message || "Unable to submit feedback.");
    } finally {
      setSending(false);
    }
  }

  return (
    <>
   {open && (
        <div className="sqlwhale-feedback-backdrop" onClick={() => setOpen(false)}>
          <section className="sqlwhale-feedback-modal" onClick={(event) => event.stopPropagation()}>
            <button className="sqlwhale-feedback-close" onClick={() => setOpen(false)} aria-label="Close">×</button>
            <p className="sqlwhale-feedback-eyebrow">HELP US BUILD SQLWHALE</p>
            <h2>What do you think?</h2>
            <p className="sqlwhale-feedback-copy">
              Tell us what made SQL learning easier, what confused you, or what you want us to improve.
            </p>

            <form onSubmit={submit}>
              <label>How would you rate your experience?</label>
              <div className="sqlwhale-feedback-stars" role="radiogroup" aria-label="Rating">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    className={value <= rating ? "active" : ""}
                    onClick={() => setRating(value)}
                    aria-label={value + " stars"}
                  >
                    ★
                  </button>
                ))}
              </div>

              <label>What is this about?</label>
              <select value={category} onChange={(event) => setCategory(event.target.value)}>
                {CATEGORIES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>

              <label>Your feedback</label>
              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="What should we keep, change, fix or build?"
                maxLength={3000}
                rows={5}
                required
              />

              {result && <p className="sqlwhale-feedback-result">{result}</p>}

              <button type="submit" disabled={sending || !message.trim()}>
                {sending ? "Sending…" : "Send feedback"}
              </button>
            </form>
          </section>
        </div>
      )}
    </>
  );
}
