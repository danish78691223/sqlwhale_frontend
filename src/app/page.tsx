"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

function SqlWhaleLoader({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers = [
      window.setTimeout(() => setStep(1), 650),
      window.setTimeout(() => setStep(2), 1450),
      window.setTimeout(() => setStep(3), 2350),
      window.setTimeout(() => setStep(4), 3250),
      window.setTimeout(onDone, 3900),
    ];
    return () => timers.forEach(window.clearTimeout);
  }, [onDone]);

  return (
    <div className="sql-loader" role="status" aria-label="Loading SQLWhale">
      <div className="sql-loader-grid" />
      <div className="sql-loader-topline"><span>SQLWHALE / SYSTEM BOOT</span><span>ONLINE</span></div>
      <div className="sql-loader-stage">
        <div className={`loader-user ${step >= 1 ? "loader-user-active" : ""}`}>
          <div className="loader-user-head" /><div className="loader-user-body" />
          <div className="loader-user-arm" /><div className="loader-user-leg loader-user-leg-left" /><div className="loader-user-leg loader-user-leg-right" />
        </div>
        <div className="loader-query-pill"><span className="loader-query-dot" />{step < 2 ? "collecting query..." : "query captured"}</div>
        <div className={`loader-route ${step >= 2 ? "loader-route-active" : ""}`}><span /></div>
        <div className={`loader-database ${step >= 3 ? "loader-database-active" : ""}`}>
          <div className="loader-db-top"><span>DATABASE</span><i /></div>
          <div className="loader-db-body"><span>SELECT</span><span>FROM</span><span>WHERE</span></div>
          <div className="loader-db-scan" />
        </div>
        <div className={`loader-message ${step >= 4 ? "loader-message-show" : ""}`}>
          <span className="loader-check">✓</span>
          <div><strong>Connection ready.</strong><span>You can go — happy learning!</span></div>
        </div>
      </div>
      <div className="sql-loader-footer">
        <div className="loader-progress"><span style={{ width: `${Math.min(step * 25, 100)}%` }} /></div>
        <span>{step >= 4 ? "READY" : "PREPARING YOUR SQL JOURNEY..."}</span>
      </div>
    </div>
  );
}

function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`scroll-reveal ${className}`}>{children}</div>;
}

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.body.classList.toggle("sql-loader-lock", loading);
    return () => document.body.classList.remove("sql-loader-lock");
  }, [loading]);

  useEffect(() => {
    if (loading) return;
    const elements = Array.from(document.querySelectorAll<HTMLElement>(".scroll-reveal"));
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("scroll-reveal-visible")),
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [loading]);

  if (loading) return <SqlWhaleLoader onDone={() => setLoading(false)} />;

  return (
    <main className="sqlwhale-home">
      <header className="sqlwhale-navbar">
        <div className="navbar-inner">
          <Link href="/" className="sqlwhale-logo" aria-label="SQLWhale Home" onClick={() => setMobileMenuOpen(false)}>
            <Image src="/assets/sqlwhale-logo.jpeg" alt="SQLWhale" width={46} height={46} className="sqlwhale-logo-image" priority />
            <span className="logo-wordmark"><span className="logo-whale">SQL</span><span className="logo-text">Whale</span></span>
          </Link>
          <nav className="navbar-links" aria-label="Primary navigation">
            <Link href="/" className="nav-link active">Home</Link><Link href="/run-query" className="nav-link">Run Query</Link>
            <a href="#about" className="nav-link">About</a><a href="#how-it-works" className="nav-link">How It Works</a><a href="#contact" className="nav-link">Contact</a>
          </nav>
          <a href="https://buymeacoffee.com/danishkhanww" target="_blank" rel="noopener noreferrer" className="buy-coffee-btn"><span className="coffee-icon">☕</span><span>Support SQLWhale</span></a>
          <button type="button" className={`mobile-menu-button ${mobileMenuOpen ? "is-open" : ""}`} onClick={() => setMobileMenuOpen((prev) => !prev)} aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"} aria-expanded={mobileMenuOpen}><span /><span /><span /></button>
        </div>
        <div className={`mobile-menu ${mobileMenuOpen ? "mobile-menu-open" : ""}`}>
          <nav className="mobile-menu-links">
            <Link href="/" className="mobile-nav-link active" onClick={() => setMobileMenuOpen(false)}><span>01</span>Home</Link>
            <Link href="/run-query" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}><span>02</span>Run Query</Link>
            <a href="#about" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}><span>03</span>About</a>
            <a href="#how-it-works" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}><span>04</span>How It Works</a>
            <a href="#contact" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}><span>05</span>Contact</a>
            <a href="https://buymeacoffee.com/danishkhanww" target="_blank" rel="noopener noreferrer" className="mobile-coffee-button" onClick={() => setMobileMenuOpen(false)}>☕ Support SQLWhale</a>
          </nav>
        </div>
      </header>

      <section className="home-hero hero-revamp">
        <div className="ww-hero-grid" aria-hidden="true" />
        <div className="ww-hero-orb ww-hero-orb-one" aria-hidden="true" />
        <div className="ww-hero-orb ww-hero-orb-two" aria-hidden="true" />

        <Reveal className="hero-content">
          <div className="hero-kicker">Built for learning what&apos;s next</div>
          <h1>
            Learn SQL by seeing.
            <br />
            <em>What actually happens.</em>
          </h1>
          <p>
            Write a query, run it, and watch the data move. SQLWhale turns SQL
            execution into something you can see, follow, and understand.
          </p>

          <div className="hero-actions">
            <Link href="/run-query" className="primary-button">
              Run Your First Query <span>↗</span>
            </Link>
            <a href="#how-it-works" className="secondary-button">
              See how it works <span>↓</span>
            </a>
          </div>
        </Reveal>

        <Reveal className="hero-visual">
          <div className="hero-orbit hero-orbit-one" />
          <div className="hero-orbit hero-orbit-two" />

          <div className="sql-window">
            <div className="sql-window-header">
              <div className="window-dots"><span /><span /><span /></div>
              <span>SQLWhale Editor</span>
              <span className="window-status">LIVE</span>
            </div>
            <div className="sql-code">
              <div><span className="line-number">01</span><span className="keyword">SELECT</span>{" "}<span className="field">name</span>,{" "}<span className="field">salary</span></div>
              <div><span className="line-number">02</span><span className="keyword">FROM</span>{" "}<span className="table-name">employees</span></div>
              <div><span className="line-number">03</span><span className="keyword">WHERE</span>{" "}<span className="field">salary</span>{" "}<span className="operator">&gt;</span>{" "}<span className="number">50000</span>;</div>
            </div>
            <div className="sql-flow-strip"><span>TABLE</span><b>→</b><span>FILTER</span><b>→</b><span>RESULT</span></div>
            <div className="sql-result-preview">
              <div className="result-title">Query Result <span>✓ Executed</span></div>
              <div className="result-row result-heading"><span>Name</span><span>Salary</span></div>
              <div className="result-row"><span>Rahul</span><span>₹75,000</span></div>
              <div className="result-row highlighted"><span>Priya</span><span>₹62,000</span></div>
              <div className="result-row"><span>Arjun</span><span>₹58,000</span></div>
            </div>
          </div>
        </Reveal>

        <div className="ww-hero-stats" aria-label="SQLWhale platform facts">
          <div><strong>01</strong><span>place to learn,<br />build &amp; understand</span></div>
          <div><strong>SQL</strong><span>learn by doing,<br />not memorizing</span></div>
        </div>

        <div className="ww-hero-sticker">
          <span>SQL</span>
          <span>IN MOTION</span>
          <i>↗</i>
        </div>
      </section>

      <section id="about" className="home-section about-section">
        <Reveal><div className="section-label">ABOUT SQLWHALE</div><div className="about-grid"><div className="section-heading"><h2>SQL should be<br /><span>understood, not memorized.</span></h2></div><div className="section-description"><p>SQLWhale is an interactive platform designed to help beginners understand how SQL queries work internally.</p><p>Instead of showing only the final result, SQLWhale focuses on the journey of your query — from source table to filtering, sorting, joining, grouping and finally producing the result.</p></div></div></Reveal>
        <div className="about-cards">{[["01","Write","Write a real SQL query using our interactive SQL editor."],["02","Execute","Execute the query against the available database tables."],["03","Understand","See the operations performed by SQL and understand the final result."]].map(([num,title,copy]) => <Reveal key={num} className="info-card-wrap"><div className="info-card"><div className="card-number">{num}</div><h3>{title}</h3><p>{copy}</p></div></Reveal>)}</div>
      </section>

      <section className="home-section purpose-section">
        <Reveal className="purpose-content"><div className="section-label">WHY SQLWHALE</div><h2>Turn SQL queries into<br /><span>something you can see.</span></h2><p>SQL can become difficult when you only see a query and its final output. SQLWhale bridges that gap by making the execution process visible.</p><Link href="/run-query" className="primary-button">Explore SQLWhale <span>→</span></Link></Reveal>
        <div className="purpose-features">{[["01","Interactive SQL Editor","Write and execute SQL queries in a simple, beginner-friendly environment."],["02","Execution Visualization","Understand how SQL operations affect rows and tables."],["03","Step-by-Step Explanation","Follow the execution process instead of jumping directly to the answer."]].map(([num,title,copy]) => <Reveal key={num}><div className="purpose-feature"><div className="feature-icon">{num}</div><div><h3>{title}</h3><p>{copy}</p></div></div></Reveal>)}</div>
      </section>

      <section id="how-it-works" className="home-section how-section">
        <Reveal><div className="section-label">HOW TO USE SQLWHALE</div><div className="how-header"><h2>Four simple steps.<br /><span>One better way to learn SQL.</span></h2><p>Start with a query and follow the execution process visually.</p></div></Reveal>
        <div className="steps-container">{[["01","Write","Write your SQL query in the SQLWhale editor."],["02","Run","Execute your query against the available tables."],["03","Visualize","Watch the query execution and see what changes."],["04","Understand","Read the explanation and understand the result."]].map(([num,title,copy]) => <Reveal key={num} className="learning-step-wrap"><div className="learning-step"><div className="step-top"><span>{num}</span><div className={`step-line ${num === "04" ? "last" : ""}`} /></div><h3>{title}</h3><p>{copy}</p></div></Reveal>)}</div>
        <Reveal className="how-cta"><h3>Ready to understand SQL differently?</h3><Link href="/run-query" className="primary-button">Start Running Queries <span>→</span></Link></Reveal>
      </section>

      <section id="contact" className="contact-section">
        <Reveal><div className="section-label">SQLWHALE</div><h2>Built to make SQL<br />easier to understand.</h2><p>Have feedback, suggestions or ideas for SQLWhale? We would love to hear from you.</p></Reveal>
        <Reveal className="support-box-wrap"><div id="support" className="support-box"><span>Support the project</span><h3>☕ Support SQLWhale</h3><p>Help us continue building better tools for learning SQL.</p><a className="support-button" href="https://buymeacoffee.com/danishkhanww" target="_blank" rel="noopener noreferrer">Support SQLWhale</a></div></Reveal>
      </section>

      <footer className="sqlwhale-footer">
        <div className="footer-industrial-grid">
          <div className="footer-brand-block"><Link href="/" className="sqlwhale-logo footer-logo" aria-label="SQLWhale Home"><Image src="/assets/sqlwhale-logo.jpeg" alt="SQLWhale" width={52} height={52} className="sqlwhale-logo-image" /><span className="logo-wordmark"><span className="logo-whale">SQL</span><span className="logo-text">Whale</span></span></Link><p className="footer-tagline">Learn SQL. See the process. Understand the result.</p><div className="footer-status"><span className="status-dot" />SQL LEARNING SYSTEM</div></div>
          <div className="footer-column"><span className="footer-column-title">NAVIGATION</span><Link href="/">Home</Link><Link href="/run-query">Run Query</Link><a href="#about">About</a><a href="#how-it-works">How It Works</a><a href="#contact">Contact</a></div>
          <div className="footer-column"><span className="footer-column-title">PLATFORM</span><span>SQL Editor</span><span>Query Execution</span><span>Visual Learning</span><span>Interactive Database</span></div>
          <div className="footer-column"><span className="footer-column-title">BUILT BY</span><span className="footer-company">WEBWHALE</span><span className="footer-company-description">Technology &amp; digital learning systems.</span></div>
          <div className="footer-column"><span className="footer-column-title">LEGAL</span><Link href="/privacy-policy">Privacy Policy</Link><Link href="/terms">Terms &amp; Conditions</Link><Link href="/refund-policy">Return &amp; Refund Policy</Link></div>
        </div>
        <div className="footer-industrial-line"><span /><span className="footer-line-label">SQLWHALE / WEBWHALE</span><span /></div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} SQLWhale. All rights reserved.</span><span className="footer-learning-service">Learning service by <strong>WEBWHALE</strong></span></div>
      </footer>
    </main>
  );
}