"use client";

import Link from "next/link";

export default function PrivacyPolicyPage() {
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
              circle at 85% 5%,
              rgba(0, 210, 220, 0.08),
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
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
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
          position: relative;
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
          max-width: 900px;
          animation: fadeUp 0.8s 0.08s ease both;
        }

        .legal-hero h1 span {
          color: #009eaa;
        }

        .legal-intro {
          max-width: 700px;
          color: #596170;
          font-size: 18px;
          line-height: 1.75;
          margin: 0;
          animation: fadeUp 0.8s 0.16s ease both;
        }

        .legal-meta {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
          margin-top: 28px;
          animation: fadeUp 0.8s 0.24s ease both;
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

        .legal-card p {
          color: #596170;
          line-height: 1.8;
          font-size: 15px;
          margin: 10px 0;
        }

        .legal-card ul {
          padding-left: 20px;
          margin: 15px 0;
        }

        .legal-card li {
          color: #596170;
          line-height: 1.8;
          font-size: 15px;
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
          position: relative;
          overflow: hidden;
        }

        .legal-contact::after {
          content: "";
          position: absolute;
          width: 180px;
          height: 180px;
          border-radius: 50%;
          border: 1px solid rgba(0, 210, 220, 0.35);
          right: -55px;
          top: -70px;
        }

        .legal-contact h2 {
          margin: 0 0 10px;
          font-size: 28px;
          letter-spacing: -0.04em;
        }

        .legal-contact p {
          color: #b8c0cb;
          line-height: 1.7;
          max-width: 650px;
        }

        .legal-contact a {
          color: #61e1e8;
          text-decoration: none;
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

          .back-home {
            padding: 8px 12px;
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
          Privacy <span>Policy.</span>
        </h1>

        <p className="legal-intro">
          Your privacy matters to us. This Privacy Policy explains what
          information SQLWhale may collect, how it is used, how it is
          protected, and the choices available to you when using our platform.
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
          <a href="#collection">02 / Information</a>
          <a href="#usage">03 / Usage</a>
          <a href="#queries">04 / SQL Queries</a>
          <a href="#cookies">05 / Cookies</a>
          <a href="#third-party">06 / Third Parties</a>
          <a href="#security">07 / Security</a>
          <a href="#retention">08 / Retention</a>
          <a href="#rights">09 / Your Rights</a>
          <a href="#children">10 / Children</a>
          <a href="#changes">11 / Changes</a>
        </aside>

        <div className="legal-content">
          <article id="scope" className="legal-card">
            <div className="legal-number">01 / SCOPE</div>
            <h2>About this policy</h2>
            <p>
              This Privacy Policy applies to SQLWhale and explains how
              information may be collected and handled when you access or use
              the SQLWhale website, SQL editor, visualization tools, and
              related services.
            </p>
            <p>
              By using SQLWhale, you acknowledge that you have read and
              understood this policy.
            </p>
          </article>

          <article id="collection" className="legal-card">
            <div className="legal-number">02 / INFORMATION</div>
            <h2>Information we may collect</h2>
            <p>
              Depending on how SQLWhale is used, we may process information
              such as:
            </p>

            <ul>
              <li>Basic account information, if account features are introduced.</li>
              <li>Email or contact information when voluntarily provided.</li>
              <li>Technical information such as browser, device, and operating system details.</li>
              <li>Usage information related to interactions with SQLWhale.</li>
              <li>Information voluntarily submitted through support or feedback channels.</li>
            </ul>

            <p>
              We aim to collect only information that is reasonably necessary
              for operating, improving, securing, and supporting the platform.
            </p>
          </article>

          <article id="usage" className="legal-card">
            <div className="legal-number">03 / USAGE</div>
            <h2>How information is used</h2>
            <p>Information may be used to:</p>

            <ul>
              <li>Provide and maintain SQLWhale.</li>
              <li>Improve platform functionality and user experience.</li>
              <li>Understand how features are used.</li>
              <li>Detect abuse, security issues, and technical problems.</li>
              <li>Respond to support requests and feedback.</li>
              <li>Communicate important service-related information.</li>
            </ul>

            <p>
              We do not intend to use personal information for purposes that
              are materially inconsistent with the purpose for which it was
              collected without appropriate notice.
            </p>
          </article>

          <article id="queries" className="legal-card">
            <div className="legal-number">04 / SQL QUERIES</div>
            <h2>SQL queries and database activity</h2>

            <p>
              SQLWhale is designed as an interactive SQL learning environment.
              Queries entered into the platform may be processed to execute
              demonstrations, produce results, and visualize SQL operations.
            </p>

            <p>
              Users should avoid entering passwords, API keys, payment
              information, personally identifiable information, confidential
              business information, or other sensitive data into SQLWhale
              unless the platform specifically indicates that such information
              is appropriate.
            </p>

            <p>
              Where technical logs are generated, they may be retained for
              security, debugging, performance, and service-improvement
              purposes for an appropriate period.
            </p>
          </article>

          <article id="cookies" className="legal-card">
            <div className="legal-number">05 / COOKIES</div>
            <h2>Cookies and local technologies</h2>

            <p>
              SQLWhale may use cookies, local storage, or similar technologies
              to remember preferences, maintain functionality, understand
              usage patterns, or improve the platform.
            </p>

            <p>
              You can control cookies through your browser settings. Disabling
              certain technologies may affect some functionality of the
              platform.
            </p>
          </article>

          <article id="third-party" className="legal-card">
            <div className="legal-number">06 / THIRD PARTIES</div>
            <h2>Third-party services</h2>

            <p>
              SQLWhale may rely on third-party infrastructure, analytics,
              hosting, payment, security, or other service providers.
            </p>

            <p>
              These providers may process information on our behalf according
              to their own contractual obligations and applicable privacy
              practices. Their services may also have separate privacy
              policies and terms.
            </p>
          </article>

          <article id="security" className="legal-card">
            <div className="legal-number">07 / SECURITY</div>
            <h2>Data security</h2>

            <p>
              We take reasonable technical and organizational measures to
              protect information against unauthorized access, misuse,
              alteration, disclosure, or destruction.
            </p>

            <p>
              However, no website, network, storage system, or method of
              electronic transmission can be guaranteed to be completely
              secure.
            </p>
          </article>

          <article id="retention" className="legal-card">
            <div className="legal-number">08 / RETENTION</div>
            <h2>Data retention</h2>

            <p>
              Information is retained only for as long as reasonably necessary
              for the purposes described in this policy, including service
              operation, security, legal compliance, dispute resolution, and
              legitimate technical requirements.
            </p>
          </article>

          <article id="rights" className="legal-card">
            <div className="legal-number">09 / YOUR RIGHTS</div>
            <h2>Your choices and rights</h2>

            <p>
              Depending on applicable law and the nature of the information,
              you may have rights relating to your personal information,
              including requesting access, correction, deletion, or
              clarification regarding its use.
            </p>

            <p>
              Requests can be submitted through the contact information
              provided below. We may need to verify a request before acting on
              it.
            </p>
          </article>

          <article id="children" className="legal-card">
            <div className="legal-number">10 / CHILDREN</div>
            <h2>Children's privacy</h2>

            <p>
              SQLWhale is intended as an educational technology platform. We
              do not knowingly seek to collect personal information from
              children in violation of applicable law.
            </p>

            <p>
              If you believe that information belonging to a child has been
              submitted improperly, please contact us so that the matter can
              be reviewed.
            </p>
          </article>

          <article id="changes" className="legal-card">
            <div className="legal-number">11 / CHANGES</div>
            <h2>Changes to this policy</h2>

            <p>
              We may update this Privacy Policy when SQLWhale's features,
              technologies, legal requirements, or business practices change.
            </p>

            <p>
              The updated version will be published on this page with a
              revised effective or update date.
            </p>
          </article>

          <div className="legal-contact">
            <h2>Questions about privacy?</h2>
            <p>
              If you have a privacy-related question, request, or concern,
              contact the SQLWhale / WEBWHALE team through the official contact
              channel associated with the platform.
            </p>
            <p>
              <strong>Platform:</strong> SQLWhale
              <br />
              <strong>Built by:</strong> WEBWHALE
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