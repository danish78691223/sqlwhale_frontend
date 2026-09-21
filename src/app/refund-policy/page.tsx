"use client";

import Link from "next/link";

export default function RefundPolicyPage() {
  return (
    <main className="legal-page">
      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          background: #f5f3ed;
          color: #111827;
          font-family:
            "DM Sans",
            Inter,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        .legal-page {
          min-height: 100vh;
          background:
            radial-gradient(
              circle at 85% 10%,
              rgba(0, 184, 196, 0.09),
              transparent 30%
            ),
            #f5f3ed;
          overflow: hidden;
        }

        .legal-topbar {
          height: 76px;
          border-bottom: 1px solid rgba(17, 24, 39, 0.1);
          background: rgba(245, 243, 237, 0.88);
          backdrop-filter: blur(16px);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 6vw;
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .legal-logo {
          display: flex;
          align-items: center;
          gap: 11px;
          color: #111827;
          text-decoration: none;
          font-weight: 800;
          letter-spacing: -0.04em;
          font-size: 20px;
        }

        .legal-logo-mark {
          width: 38px;
          height: 38px;
          border-radius: 11px;
          object-fit: cover;
        }

        .back-home {
          color: #111827;
          text-decoration: none;
          font-size: 14px;
          font-weight: 700;
          border: 1px solid rgba(17, 24, 39, 0.14);
          padding: 10px 16px;
          border-radius: 999px;
          transition: all 0.3s ease;
        }

        .back-home:hover {
          background: #111827;
          color: white;
          transform: translateY(-2px);
        }

        .legal-hero {
          max-width: 1180px;
          margin: auto;
          padding: 95px 6vw 70px;
        }

        .legal-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          color: #008e99;
          font-family: "DM Mono", monospace;
          font-size: 12px;
          letter-spacing: 0.14em;
          font-weight: 700;
          animation: fadeUp 0.7s ease both;
        }

        .legal-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #00b8c4;
          box-shadow: 0 0 0 6px rgba(0, 184, 196, 0.1);
        }

        .legal-hero h1 {
          font-size: clamp(46px, 7.5vw, 88px);
          line-height: 0.92;
          letter-spacing: -0.065em;
          margin: 24px 0;
          max-width: 1000px;
          animation: fadeUp 0.8s 0.08s ease both;
        }

        .legal-hero h1 span {
          color: #009eaa;
        }

        .legal-intro {
          max-width: 730px;
          color: #596170;
          font-size: 18px;
          line-height: 1.75;
          animation: fadeUp 0.8s 0.16s ease both;
        }

        .legal-meta {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
          margin-top: 28px;
        }

        .meta-pill {
          border: 1px solid rgba(17, 24, 39, 0.12);
          background: rgba(255, 255, 255, 0.45);
          padding: 9px 14px;
          border-radius: 999px;
          font-size: 12px;
          color: #596170;
        }

        .legal-layout {
          max-width: 1180px;
          margin: auto;
          padding: 0 6vw 100px;
          display: grid;
          grid-template-columns: 230px 1fr;
          gap: 70px;
          align-items: start;
        }

        .legal-index {
          position: sticky;
          top: 105px;
          border-left: 2px solid rgba(0, 184, 196, 0.2);
          padding-left: 22px;
        }

        .legal-index-title {
          font-family: "DM Mono", monospace;
          font-size: 11px;
          color: #009eaa;
          letter-spacing: 0.12em;
          margin-bottom: 16px;
          font-weight: 700;
        }

        .legal-index a {
          display: block;
          text-decoration: none;
          color: #6b7280;
          font-size: 13px;
          margin: 11px 0;
          transition: all 0.25s ease;
        }

        .legal-index a:hover {
          color: #009eaa;
          transform: translateX(5px);
        }

        .legal-content {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .legal-card {
          background: rgba(255, 255, 255, 0.68);
          border: 1px solid rgba(17, 24, 39, 0.09);
          border-radius: 24px;
          padding: 34px 38px;
          box-shadow: 0 12px 40px rgba(17, 24, 39, 0.035);
          animation: reveal 0.7s ease both;
          transition:
            transform 0.35s ease,
            box-shadow 0.35s ease,
            border-color 0.35s ease;
        }

        .legal-card:hover {
          transform: translateY(-4px);
          border-color: rgba(0, 184, 196, 0.28);
          box-shadow: 0 20px 55px rgba(17, 24, 39, 0.07);
        }

        .legal-number {
          font-family: "DM Mono", monospace;
          color: #00a5b0;
          font-size: 12px;
          font-weight: 700;
          margin-bottom: 14px;
        }

        .legal-card h2 {
          font-size: 25px;
          letter-spacing: -0.035em;
          margin: 0 0 15px;
        }

        .legal-card p,
        .legal-card li {
          color: #596170;
          line-height: 1.8;
          font-size: 15px;
        }

        .legal-card p {
          margin: 10px 0;
        }

        .legal-card ul {
          padding-left: 20px;
          margin: 15px 0;
        }

        .legal-card li {
          margin: 7px 0;
        }

        .legal-card strong {
          color: #1f2937;
        }

        .status-banner {
          background: rgba(0, 184, 196, 0.08);
          border: 1px solid rgba(0, 184, 196, 0.22);
          border-radius: 20px;
          padding: 22px 24px;
          margin-bottom: 2px;
        }

        .status-banner strong {
          color: #007e88;
        }

        .legal-contact {
          background: #111827;
          color: white;
          border-radius: 26px;
          padding: 40px;
          margin-top: 20px;
        }

        .legal-contact h2 {
          margin: 0 0 10px;
          font-size: 28px;
          letter-spacing: -0.04em;
        }

        .legal-contact p {
          color: #b8c0cb;
          line-height: 1.7;
        }

        .legal-footer {
          border-top: 1px solid rgba(17, 24, 39, 0.1);
          padding: 28px 6vw;
          display: flex;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
          color: #697180;
          font-size: 13px;
          max-width: 1180px;
          margin: auto;
        }

        .legal-footer-links {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
        }

        .legal-footer a {
          color: #697180;
          text-decoration: none;
          transition: color 0.25s ease;
        }

        .legal-footer a:hover {
          color: #009eaa;
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(25px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes reveal {
          from {
            opacity: 0;
            transform: translateY(25px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 850px) {
          .legal-layout {
            grid-template-columns: 1fr;
            gap: 35px;
          }

          .legal-index {
            position: static;
            display: flex;
            flex-wrap: wrap;
            gap: 8px 18px;
            border-left: 0;
            border-bottom: 1px solid rgba(17, 24, 39, 0.1);
            padding: 0 0 18px;
          }

          .legal-index-title {
            width: 100%;
          }

          .legal-index a {
            margin: 0;
          }
        }

        @media (max-width: 600px) {
          .legal-topbar {
            padding: 0 20px;
          }

          .legal-hero {
            padding: 70px 20px 50px;
          }

          .legal-layout {
            padding: 0 20px 70px;
          }

          .legal-card {
            padding: 26px 22px;
            border-radius: 20px;
          }

          .legal-contact {
            padding: 28px 23px;
          }

          .legal-footer {
            padding: 25px 20px;
          }
        }
      `}</style>

      <header className="legal-topbar">
        <Link href="/" className="legal-logo">
          <img
            src="/assets/sqlwhale-logo.jpeg"
            alt="SQLWhale"
            className="legal-logo-mark"
          />
          <span>SQLWhale</span>
        </Link>

        <Link href="/" className="back-home">
          ← Back to SQLWhale
        </Link>
      </header>

      <section className="legal-hero">
        <div className="legal-eyebrow">
          <span className="legal-dot" />
          SQLWHALE / LEGAL
        </div>

        <h1>
          Return &amp; <span>Refund Policy.</span>
        </h1>

        <p className="legal-intro">
          This policy explains how cancellations, refunds, payment errors, and
          other payment-related requests are handled in connection with
          SQLWhale.
        </p>

        <div className="legal-meta">
          <span className="meta-pill">Effective: September 21, 2026</span>
          <span className="meta-pill">Last Updated: September 21, 2026</span>
        </div>
      </section>

      <section className="legal-layout">
        <aside className="legal-index">
          <div className="legal-index-title">ON THIS PAGE</div>

          <a href="#scope">01 / Scope</a>
          <a href="#free">02 / Free Service</a>
          <a href="#support">03 / Support Payments</a>
          <a href="#paid">04 / Paid Services</a>
          <a href="#eligible">05 / Eligibility</a>
          <a href="#nonrefundable">06 / Non-Refundable</a>
          <a href="#duplicate">07 / Duplicate Payments</a>
          <a href="#processing">08 / Processing</a>
          <a href="#request">09 / Requests</a>
          <a href="#changes">10 / Changes</a>
        </aside>

        <div className="legal-content">
          <div className="status-banner">
            <strong>Current service status:</strong> SQLWhale is primarily
            provided as an educational SQL learning platform. Any future paid
            products, subscriptions, or services may be subject to additional
            payment-specific terms displayed at the time of purchase.
          </div>

          <article id="scope" className="legal-card">
            <div className="legal-number">01 / SCOPE</div>
            <h2>About this policy</h2>

            <p>
              This Return &amp; Refund Policy applies to payments made in
              connection with SQLWhale and services provided by or through the
              platform.
            </p>

            <p>
              Because SQLWhale is primarily an educational platform, there may
              be no return process for the core free learning features.
            </p>
          </article>

          <article id="free" className="legal-card">
            <div className="legal-number">02 / FREE SERVICE</div>
            <h2>Free access</h2>

            <p>
              Where SQLWhale features are provided free of charge, there is no
              purchase price to return or refund.
            </p>

            <p>
              Free access may be changed, restricted, suspended, or
              discontinued in accordance with the Terms &amp; Conditions.
            </p>
          </article>

          <article id="support" className="legal-card">
            <div className="legal-number">03 / SUPPORT PAYMENTS</div>
            <h2>Voluntary support or contributions</h2>

            <p>
              SQLWhale may provide an optional way for users to support the
              project, such as a voluntary contribution or "Buy Us A Coffee"
              feature.
            </p>

            <p>
              Because such payments are voluntary contributions rather than
              purchases of a physical product, they are generally not
              refundable once successfully completed, except where required by
              applicable law or in cases such as an unauthorized or duplicate
              transaction.
            </p>
          </article>

          <article id="paid" className="legal-card">
            <div className="legal-number">04 / PAID SERVICES</div>
            <h2>Future paid products or subscriptions</h2>

            <p>
              If SQLWhale introduces paid subscriptions, courses, premium
              features, digital products, or other paid services, the
              applicable price, cancellation rules, access period, and refund
              conditions may be displayed separately before payment.
            </p>

            <p>
              Where a specific purchase page contains different refund terms,
              those purchase-specific terms will apply to that transaction to
              the extent permitted by applicable law.
            </p>
          </article>

          <article id="eligible" className="legal-card">
            <div className="legal-number">05 / ELIGIBILITY</div>
            <h2>When a refund may be considered</h2>

            <p>
              Subject to the applicable purchase terms and law, a refund may
              be considered in circumstances such as:
            </p>

            <ul>
              <li>A duplicate payment was processed.</li>
              <li>A payment was processed due to a verified technical error.</li>
              <li>An unauthorized transaction is reported and can be reasonably verified.</li>
              <li>A refund is required by applicable consumer protection law.</li>
              <li>A specific paid service explicitly provides a refund window.</li>
            </ul>
          </article>

          <article id="nonrefundable" className="legal-card">
            <div className="legal-number">06 / NON-REFUNDABLE</div>
            <h2>Situations that may not qualify</h2>

            <p>
              Unless otherwise required by law or expressly stated at the time
              of purchase, refunds may not be available for:
            </p>

            <ul>
              <li>Voluntary support payments after successful completion.</li>
              <li>Requests made after an applicable refund period has expired.</li>
              <li>Services that have already been fully delivered where the applicable terms exclude refunds.</li>
              <li>Misuse of a service or violation of platform terms.</li>
              <li>Changes in personal preference after a digital service has been accessed.</li>
            </ul>
          </article>

          <article id="duplicate" className="legal-card">
            <div className="legal-number">07 / DUPLICATE PAYMENTS</div>
            <h2>Duplicate or incorrect charges</h2>

            <p>
              If you believe you were charged more than once for the same
              transaction, contact us with the relevant transaction details.
            </p>

            <p>
              After verification, eligible duplicate or erroneous charges may
              be refunded through the original payment method where supported
              by the payment processor.
            </p>
          </article>

          <article id="processing" className="legal-card">
            <div className="legal-number">08 / PROCESSING</div>
            <h2>Refund processing</h2>

            <p>
              Approved refunds are generally initiated through the original
              payment method or payment provider, where technically possible.
            </p>

            <p>
              The time required for the refund to appear in your account may
              depend on the payment processor, bank, card issuer, or other
              financial institution.
            </p>
          </article>

          <article id="request" className="legal-card">
            <div className="legal-number">09 / REQUEST</div>
            <h2>How to request a refund</h2>

            <p>
              If you believe you are eligible for a refund, contact the
              SQLWhale / WEBWHALE team through the official support or contact
              channel associated with the platform.
            </p>

            <p>Include, where applicable:</p>

            <ul>
              <li>Your name or account information.</li>
              <li>Transaction or payment reference.</li>
              <li>Date of the transaction.</li>
              <li>Reason for the refund request.</li>
              <li>Any relevant payment evidence.</li>
            </ul>

            <p>
              Do not send passwords, full card numbers, CVV codes, OTPs, or
              other sensitive authentication information in a refund request.
            </p>
          </article>

          <article id="changes" className="legal-card">
            <div className="legal-number">10 / CHANGES</div>
            <h2>Changes to this policy</h2>

            <p>
              SQLWhale may update this Return &amp; Refund Policy as services,
              payment methods, or applicable requirements change.
            </p>

            <p>
              The latest version will be published on this page with an
              updated effective date.
            </p>
          </article>

          <div className="legal-contact">
            <h2>Need help with a payment?</h2>

            <p>
              Contact the SQLWhale / WEBWHALE team through the official
              support channel associated with the platform and provide your
              transaction details so the request can be reviewed.
            </p>
          </div>
        </div>
      </section>

      <footer className="legal-footer">
        <span>© {new Date().getFullYear()} SQLWhale. All rights reserved.</span>

        <div className="legal-footer-links">
          <Link href="/privacy-policy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/refund-policy">Refund Policy</Link>
          <Link href="/">SQLWhale Home</Link>
        </div>
      </footer>
    </main>
  );
}