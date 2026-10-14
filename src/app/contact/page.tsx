"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Mail, MessageSquare, Send } from "lucide-react";

const WEBXWHALE_URL = "https://webxwhale-ebon.vercel.app/home";

const SERVICES = [
  ["web-development", "Web Development"],
  ["software", "Software / Product Development"],
  ["ai-ml", "AI / Machine Learning"],
  ["consulting", "Consulting"],
  ["collaboration", "Collaboration"],
  ["other", "Something else"],
] as const;

export default function ContactPage() {
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<"success" | "error" | "">("");
  const [errorText, setErrorText] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;

    setSending(true);
    setMessage("");
    setErrorText("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      service: String(formData.get("service") || ""),
      message: String(formData.get("message") || ""),
    };

    try {
      const response = await fetch("/api/webxwhale-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok || result.success === false) {
        throw new Error(result.message || "Unable to send your enquiry.");
      }

      form.reset();
      setMessage("success");
    } catch (error) {
      setMessage("error");
      setErrorText(
        error instanceof Error
          ? error.message
          : "Unable to send your enquiry. Please try again."
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="sqlwhale-contact-page">


      <section className="sqlwhale-contact-hero">
        <div className="contact-hero-grid" aria-hidden="true" />
        <div className="contact-hero-glow contact-hero-glow-one" aria-hidden="true" />
        <div className="contact-hero-glow contact-hero-glow-two" aria-hidden="true" />

        <div className="sqlwhale-contact-hero-copy">
          <span className="section-label">CONTACT SQLWHALE</span>
          <h1>
            Have an idea,
            <br />
            question or <em>feedback?</em>
          </h1>
          <p>
            Tell us what you&apos;re building, what you&apos;re learning, or what
            you would like to see in SQLWhale.
          </p>
        </div>

        <div className="sqlwhale-contact-hero-meta">
          <span>SQLWHALE / CONTACT</span>
          <span>WEBXWHALE LEAD PIPELINE</span>
        </div>
      </section>

      <section className="sqlwhale-contact-content">
        <div className="sqlwhale-contact-layout">
          <aside className="sqlwhale-contact-info">
            <span className="section-label">GET IN TOUCH</span>
            <h2>
              Start the
              <br />
              <span>conversation.</span>
            </h2>
            <p>
              Your message will be submitted directly to the WebXWhale
              contact system and can then be reviewed from the WebXWhale
              Control Center under Leads.
            </p>

            <div className="sqlwhale-contact-detail">
              <Mail size={18} />
              <div>
                <small>PLATFORM</small>
                <strong>SQLWhale</strong>
              </div>
            </div>

            <div className="sqlwhale-contact-detail">
              <MessageSquare size={18} />
              <div>
                <small>DESTINATION</small>
                <strong>WebXWhale Lead Management</strong>
              </div>
            </div>

            <a
              href={WEBXWHALE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="sqlwhale-contact-company-link"
            >
              Visit WEBXWHALE
              <ArrowUpRight size={17} />
            </a>
          </aside>

          <div className="sqlwhale-contact-card">
            <div className="contact-card-head">
              <div>
                <span>LEAD FORM</span>
                <h2>Tell us what you need.</h2>
              </div>
              <span className="contact-card-status"><i /> SECURE SUBMISSION</span>
            </div>

            <form className="sqlwhale-contact-form" onSubmit={handleSubmit}>
              <div className="sqlwhale-contact-form-row">
                <label>
                  <span>Name</span>
                  <input name="name" type="text" placeholder="Your name" minLength={2} maxLength={80} required />
                </label>
                <label>
                  <span>Email</span>
                  <input name="email" type="email" placeholder="you@example.com" maxLength={254} required />
                </label>
              </div>

              <label>
                <span>What can we help with?</span>
                <select name="service" defaultValue="" required>
                  <option value="" disabled>Select an option</option>
                  {SERVICES.map(([value, label]) => (
                    <option value={value} key={value}>{label}</option>
                  ))}
                </select>
              </label>

              <label>
                <span>Message</span>
                <textarea
                  name="message"
                  rows={8}
                  minLength={10}
                  maxLength={3000}
                  placeholder="Tell us about your idea, project or question..."
                  required
                />
              </label>

              <div className="sqlwhale-contact-form-foot">
                <p>
                  We only use the details submitted here to respond to your
                  enquiry.
                </p>

                <button type="submit" className="sqlwhale-contact-submit" disabled={sending}>
                  {sending ? "Sending..." : "Send enquiry"}
                  {sending ? <span className="contact-submit-spinner" /> : <Send size={17} />}
                </button>
              </div>

              {message === "success" ? (
                <div className="sqlwhale-contact-feedback success" role="status">
                  <strong>Enquiry received.</strong>
                  <span>Your message has been added to the WebXWhale lead pipeline.</span>
                </div>
              ) : null}

              {message === "error" ? (
                <div className="sqlwhale-contact-feedback error" role="alert">
                  <strong>Submission failed.</strong>
                  <span>{errorText}</span>
                </div>
              ) : null}
            </form>
          </div>
        </div>
      </section>

      <section className="sqlwhale-contact-bottom">
        <div>
          <span className="section-label">BUILT BY</span>
          <h2>
            SQL learning,
            <br />
            powered by <em>WEBXWHALE.</em>
          </h2>
        </div>
        <a href={WEBXWHALE_URL} target="_blank" rel="noopener noreferrer">
          WEBXWHALE TECH &amp; SOLUTIONS
          <ArrowUpRight size={18} />
        </a>
      </section>


    </main>
  );
}
