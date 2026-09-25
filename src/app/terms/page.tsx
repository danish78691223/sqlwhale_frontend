"use client";

import Link from "next/link";

export default function TermsPage() {
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
              circle at 10% 8%,
              rgba(0, 184, 196, 0.08),
              transparent 28%
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
          font-size: clamp(48px, 8vw, 92px);
          line-height: 0.92;
          letter-spacing: -0.065em;
          margin: 24px 0;
          max-width: 950px;
          animation: fadeUp 0.8s 0.08s ease both;
        }

        .legal-hero h1 span {
          color: #009eaa;
        }

        .legal-intro {
          max-width: 720px;
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
            src="/assets/sqlwhale-logo.png"
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
          Terms &amp; <span>Conditions.</span>
        </h1>

        <p className="legal-intro">
          These Terms &amp; Conditions govern your access to and use of
          SQLWhale. Please read them carefully before using the platform,
          SQL editor, visualization tools, or related services.
        </p>

        <div className="legal-meta">
          <span className="meta-pill">Effective: September 21, 2026</span>
          <span className="meta-pill">Last Updated: September 21, 2026</span>
        </div>
      </section>

      <section className="legal-layout">
        <aside className="legal-index">
          <div className="legal-index-title">ON THIS PAGE</div>

          <a href="#acceptance">01 / Acceptance</a>
          <a href="#service">02 / Service</a>
          <a href="#account">03 / Accounts</a>
          <a href="#acceptable">04 / Acceptable Use</a>
          <a href="#queries">05 / SQL Queries</a>
          <a href="#content">06 / Content</a>
          <a href="#ip">07 / Ownership</a>
          <a href="#availability">08 / Availability</a>
          <a href="#third-party">09 / Third Parties</a>
          <a href="#disclaimer">10 / Disclaimer</a>
          <a href="#liability">11 / Liability</a>
          <a href="#termination">12 / Termination</a>
          <a href="#changes">13 / Changes</a>
        </aside>

        <div className="legal-content">
          <article id="acceptance" className="legal-card">
            <div className="legal-number">01 / ACCEPTANCE</div>
            <h2>Acceptance of these terms</h2>

            <p>
              By accessing or using SQLWhale, you agree to be bound by these
              Terms &amp; Conditions and applicable laws and regulations.
            </p>

            <p>
              If you do not agree with these terms, you should not use the
              platform.
            </p>
          </article>

          <article id="service" className="legal-card">
            <div className="legal-number">02 / SERVICE</div>
            <h2>About SQLWhale</h2>

            <p>
              SQLWhale is an interactive SQL learning platform designed to
              help users understand SQL queries through execution, results, and
              visual explanations.
            </p>

            <p>
              Features may change, be added, modified, temporarily suspended,
              or discontinued as the platform develops.
            </p>
          </article>

          <article id="account" className="legal-card">
            <div className="legal-number">03 / ACCOUNTS</div>
            <h2>Accounts and user responsibility</h2>

            <p>
              If SQLWhale provides account functionality, you are responsible
              for maintaining the confidentiality of your account credentials
              and for activity performed through your account.
            </p>

            <p>
              You should provide accurate information and promptly notify the
              platform team if you believe that your account has been
              compromised.
            </p>
          </article>

          <article id="acceptable" className="legal-card">
            <div className="legal-number">04 / ACCEPTABLE USE</div>
            <h2>Permitted and prohibited use</h2>

            <p>
              SQLWhale should be used for lawful educational, learning,
              experimentation, and other legitimate purposes.
            </p>

            <p>You must not use SQLWhale to:</p>

            <ul>
              <li>Attempt unauthorized access to systems or accounts.</li>
              <li>Distribute malware or malicious code.</li>
              <li>Conduct attacks against infrastructure or third-party services.</li>
              <li>Attempt to bypass security controls.</li>
              <li>Abuse, disrupt, overload, or interfere with the platform.</li>
              <li>Use the platform for unlawful activity.</li>
              <li>Submit confidential information that you do not have permission to disclose.</li>
            </ul>
          </article>

          <article id="queries" className="legal-card">
            <div className="legal-number">05 / SQL QUERIES</div>
            <h2>Queries and database interaction</h2>

            <p>
              SQLWhale may provide sample or platform-managed database tables
              for learning and visualization.
            </p>

            <p>
              Query execution results are intended to support learning and
              demonstration. Results should not be treated as professional
              database, financial, operational, security, or production
              guidance.
            </p>

            <p>
              You are responsible for the queries and data you submit.
            </p>
          </article>

          <article id="content" className="legal-card">
            <div className="legal-number">06 / CONTENT</div>
            <h2>User-submitted content</h2>

            <p>
              You retain responsibility for content, queries, text, feedback,
              or other information that you voluntarily submit through
              SQLWhale.
            </p>

            <p>
              You must ensure that you have the necessary rights and
              permissions to submit such content.
            </p>
          </article>

          <article id="ip" className="legal-card">
            <div className="legal-number">07 / OWNERSHIP</div>
            <h2>Intellectual property</h2>

            <p>
              SQLWhale, including its branding, interface, visual design,
              original content, software, graphics, logos, and other platform
              materials, is owned by or licensed to SQLWhale / WEBWHALE unless
              otherwise stated.
            </p>

            <p>
              You may not copy, reproduce, redistribute, modify, reverse
              engineer, or commercially exploit protected platform materials
              without appropriate authorization.
            </p>
          </article>

          <article id="availability" className="legal-card">
            <div className="legal-number">08 / AVAILABILITY</div>
            <h2>Service availability</h2>

            <p>
              We aim to keep SQLWhale available and reliable, but continuous
              uninterrupted availability cannot be guaranteed.
            </p>

            <p>
              Maintenance, upgrades, infrastructure failures, security
              incidents, network problems, or other circumstances may
              temporarily affect access.
            </p>
          </article>

          <article id="third-party" className="legal-card">
            <div className="legal-number">09 / THIRD PARTIES</div>
            <h2>Third-party services</h2>

            <p>
              SQLWhale may integrate with or depend upon third-party services,
              hosting providers, analytics systems, payment processors,
              libraries, APIs, or infrastructure.
            </p>

            <p>
              Third-party services may have their own terms and privacy
              policies. SQLWhale is not responsible for independent
              third-party services beyond the extent required by applicable
              law.
            </p>
          </article>

          <article id="disclaimer" className="legal-card">
            <div className="legal-number">10 / DISCLAIMER</div>
            <h2>Educational purpose and disclaimer</h2>

            <p>
              SQLWhale is primarily an educational and interactive learning
              platform.
            </p>

            <p>
              Information, examples, query results, explanations, and
              visualizations are provided for learning purposes and may not
              represent every possible database engine, environment, version,
              or production configuration.
            </p>
          </article>

          <article id="liability" className="legal-card">
            <div className="legal-number">11 / LIABILITY</div>
            <h2>Limitation of liability</h2>

            <p>
              To the maximum extent permitted by applicable law, SQLWhale /
              WEBWHALE will not be responsible for indirect, incidental,
              consequential, special, or similar losses arising from use of,
              or inability to use, the platform.
            </p>

            <p>
              Nothing in these terms is intended to exclude liability that
              cannot legally be excluded or limited.
            </p>
          </article>

          <article id="termination" className="legal-card">
            <div className="legal-number">12 / TERMINATION</div>
            <h2>Suspension and termination</h2>

            <p>
              Access to SQLWhale may be suspended or terminated where
              reasonably necessary to protect the platform, users, third
              parties, or comply with legal obligations.
            </p>

            <p>
              Prohibited or abusive use may result in immediate restriction of
              access where appropriate.
            </p>
          </article>

          <article id="changes" className="legal-card">
            <div className="legal-number">13 / CHANGES</div>
            <h2>Changes to these terms</h2>

            <p>
              These Terms &amp; Conditions may be updated as SQLWhale evolves.
              Updated terms will be published on this page together with a
              revised update date.
            </p>

            <p>
              Continued use of SQLWhale after an update constitutes acceptance
              of the revised terms to the extent permitted by applicable law.
            </p>
          </article>

          <div className="legal-contact">
            <h2>Questions about these terms?</h2>

            <p>
              For questions regarding these Terms &amp; Conditions or the use
              of SQLWhale, contact the SQLWhale / WEBWHALE team through the
              official contact channel associated with the platform.
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