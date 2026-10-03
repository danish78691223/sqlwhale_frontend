"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { api, authApi } from "@/services/api";
import AppleEmoji from "@/components/AppleEmoji";
import { Floating3DParticles } from "@/components/ui/floating-3d-particles";
import Shuffle from "@/components/Shuffle";

function SqlWhaleLoader({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);
  const keywords = ["SELECT", "WHERE", "FROM", "HAVING", "JOIN", "ORDER BY"];

  useEffect(() => {
    const timers = [
      window.setTimeout(() => setStep(1), 650),
      window.setTimeout(() => setStep(2), 1500),
      window.setTimeout(() => setStep(3), 2350),
      window.setTimeout(() => setStep(4), 3200),
      window.setTimeout(() => setStep(5), 4050),
      window.setTimeout(() => setStep(6), 4900),
      window.setTimeout(() => setStep(7), 5900),
      window.setTimeout(onDone, 6600),
    ];
    return () => timers.forEach(window.clearTimeout);
  }, [onDone]);

  const activeKeyword = step >= 1 && step <= 6 ? keywords[step - 1] : null;
  const clearedKeywords = keywords.slice(0, Math.min(step, keywords.length));

  return (
    <div className="sql-loader" role="status" aria-label="Loading SQLWhale">
      <div className="sql-loader-grid" />
      <div className="sql-loader-topline"><span>SQLWHALE / SYSTEM BOOT</span><span>ONLINE</span></div>

      <div className="sql-loader-stage">
        <div className="loader-shot-status">
          <span className="loader-shot-dot" />
          {step >= 7 ? "QUERY SYNTAX CLEARED" : activeKeyword ? "TARGETING " + activeKeyword : "TARGETING SQL KEYWORDS"}
        </div>

        <div className="loader-keyword-console" aria-hidden="true">
          <div className="loader-console-head">
            <span>SQL KEYWORD BUFFER</span>
            <i />
          </div>
          <div className="loader-console-body">
            {clearedKeywords.map((keyword, index) => (
              <div className="loader-console-keyword" key={keyword}>
                <span className="loader-console-index">0{index + 1}</span>
                <span>{keyword}</span>
                <b>✓</b>
              </div>
            ))}
            {step === 0 ? (
              <div className="loader-console-empty">AWAITING TARGETS...</div>
            ) : null}
          </div>
          <div className="loader-console-scan" />
        </div>

        {activeKeyword ? (
          <div className="loader-incoming-keyword" key={activeKeyword}>
            <span>{activeKeyword}</span>
          </div>
        ) : null}

        <div className={"loader-user " + (step >= 1 ? "loader-user-active" : "")}>
          <div className="loader-user-head"><span className="loader-user-eye loader-user-eye-left" /><span className="loader-user-eye loader-user-eye-right" /></div>
          <div className="loader-user-neck" />
          <div className="loader-user-body" />
          <div className="loader-user-arm loader-user-arm-back" />
          <div className="loader-user-arm loader-user-arm-gun" />
          <div className="loader-user-hand" />
          <div className="loader-user-leg loader-user-leg-left" /><div className="loader-user-leg loader-user-leg-right" />
          <div className="loader-user-foot loader-user-foot-left" /><div className="loader-user-foot loader-user-foot-right" />
          <div className="loader-gun"><span className="loader-gun-barrel" /><span className="loader-gun-grip" /><span className="loader-gun-core" /></div>
          {step >= 1 && step <= 6 ? <span key={"flash-" + step} className="loader-muzzle-flash" /> : null}
        </div>

        <div className={"loader-route " + (step >= 7 ? "loader-route-active" : "")}><span /></div>
        <div className={"loader-database " + (step >= 7 ? "loader-database-active" : "")}>
          <div className="loader-db-top"><span>DATABASE</span><i /></div>
          <div className="loader-db-body"><span>SELECT</span><span>FROM</span><span>WHERE</span></div>
          <div className="loader-db-scan" />
        </div>

        <div className={"loader-message " + (step >= 7 ? "loader-message-show" : "")}>
          <span className="loader-check">✓</span>
          <div><strong>Connection ready.</strong><span>You can go — happy learning!</span></div>
        </div>
      </div>

      <div className="sql-loader-footer">
        <div className="loader-progress"><span style={{ width: Math.min(step * (100 / 7), 100) + "%" }} /></div>
        <span>{step >= 7 ? "READY" : "BREAKING SQL KEYWORDS..."}</span>
      </div>
    </div>
  );
}

function RotatingHeroWord() {
  const words = ["visible", "easy", "clear", "simple", "intuitive", "practical", "understandable"];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setIndex((current) => (current + 1) % words.length);
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <Shuffle
      key={words[index]}
      text={words[index]}
      tag="em"
      className="agency-hero-shuffle"
      shuffleDirection="right"
      duration={0.35}
      animationMode="evenodd"
      shuffleTimes={1}
      ease="power3.out"
      stagger={0.03}
      threshold={0.1}
      triggerOnce={true}
      triggerOnHover={true}
      respectReducedMotion={true}
      loop={false}
      loopDelay={0}
    />
  );
}

function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`scroll-reveal ${className}`}>{children}</div>;
}

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [user, setUser] = useState<{ name: string; email: string; currentPlan: string; role?: string } | null>(null);

  useEffect(() => {
    // The intro loader is only for the first homepage visit in this browser tab.
    // Navigation, refreshes and returning to "/" must not replay it.
    const loaderSeen = window.sessionStorage.getItem("sqlwhale_home_loader_seen");

    if (!loaderSeen) {
      window.sessionStorage.setItem("sqlwhale_home_loader_seen", "1");
      setLoading(true);
    }
  }, []);

  useEffect(() => {
    document.body.classList.toggle("sql-loader-lock", loading);
    return () => document.body.classList.remove("sql-loader-lock");
  }, [loading]);

  useEffect(() => {
    if (loading) return;
    let cancelled = false;
    authApi.get("/auth/me")
      .then((response) => {
        if (!cancelled && response.data?.authenticated) setUser(response.data.user);
      })
      .catch(() => {
        if (!cancelled) setUser(null);
      })
      .finally(() => {
        if (!cancelled) setAuthLoading(false);
      });
    return () => { cancelled = true; };
  }, [loading]);

  async function handleLogout() {
    try {
      await authApi.post("/auth/logout");
    } finally {
      setUser(null);
      setMobileMenuOpen(false);
    }
  }

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
      <div className="agency-particle-background" aria-hidden="true">
        <Floating3DParticles
          quantity={260}
          color="#0a0b0d"
          size={2.4}
          opacity={0.22}
          drift={0.18}
          depth={0.7}
        />
      </div>
      <header className="sqlwhale-navbar">
        <div className="navbar-inner">
          <Link href="/" className="sqlwhale-logo" aria-label="SQLWhale Home" onClick={() => setMobileMenuOpen(false)}>
            <Image src="/assets/sqlwhale-logo.png" alt="SQLWhale" width={46} height={46} className="sqlwhale-logo-image" priority />
            <span className="logo-wordmark"><span className="logo-whale">SQL</span><span className="logo-text">Whale</span></span>
          </Link>

          <nav className="navbar-links" aria-label="Primary navigation">
            <Link href="/" className="nav-link active">Home</Link>
            <Link href="/run-query" className="nav-link">Run Query</Link>
            <a href="#about" className="nav-link">About</a>
            <a href="#how-it-works" className="nav-link">How It Works</a>
            <Link href="/contact" className="nav-link">Contact</Link>
            {!authLoading && user ? (
              <button
                type="button"
                className="nav-link nav-feedback-button"
                onClick={() => window.dispatchEvent(new Event("sqlwhale:open-feedback"))}
              >
                Feedback
              </button>
            ) : null}
          </nav>

          <div className="navbar-auth-actions">
            {!authLoading && user ? (
              <Link href="/account" className="navbar-profile-btn" title={user.email} aria-label="Open SQLWhale Profile">
                <span className="navbar-profile-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <circle cx="12" cy="8" r="3.2" />
                    <path d="M5.5 19.2c.9-3.2 3.1-4.8 6.5-4.8s5.6 1.6 6.5 4.8" strokeLinecap="round" />
                  </svg>
                </span>
                <span>Profile</span>
              </Link>
            ) : null}
          </div>

          <button
            type="button"
            className={`mobile-menu-button ${mobileMenuOpen ? "is-open" : ""}`}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
          >
            <span /><span /><span />
          </button>
        </div>

        <div className={`mobile-menu ${mobileMenuOpen ? "mobile-menu-open" : ""}`}>
          <nav className="mobile-menu-links" aria-label="Primary navigation">
            <Link href="/" className="mobile-nav-link active" onClick={() => setMobileMenuOpen(false)}><span>01</span>Home</Link>
            <Link href="/run-query" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}><span>02</span>Run Query</Link>
            <a href="#about" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}><span>03</span>About</a>
            <a href="#how-it-works" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}><span>04</span>How It Works</a>
            <Link href="/contact" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}><span>05</span>Contact</Link>
            {!authLoading && user ? (
              <>
                <Link href="/account" className="mobile-nav-link mobile-account-label" onClick={() => setMobileMenuOpen(false)}><span>06</span>Profile</Link>
                <button type="button" className="mobile-nav-link mobile-feedback-button" onClick={() => { setMobileMenuOpen(false); window.dispatchEvent(new Event("sqlwhale:open-feedback")); }}><span>07</span>Feedback</button>
                <button type="button" className="mobile-auth-button" onClick={handleLogout}><span>08</span>Logout</button>
              </>
            ) : !authLoading ? (
              <>
                <Link href="/login" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}><span>06</span>Login</Link>
                <Link href="/signup" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}><span>07</span>Sign Up</Link>
              </>
            ) : null}
            <a href="https://buymeacoffee.com/danishkhanww" target="_blank" rel="noopener noreferrer" className="mobile-coffee-button" onClick={() => setMobileMenuOpen(false)}><AppleEmoji name="coffee" size={17} /> Support SQLWhale</a>
          </nav>
        </div>
      </header>

      <section className="home-hero agency-hero">
        <div className="agency-hero-noise" aria-hidden="true" />
        <div className="agency-hero-grid" aria-hidden="true" />
        <div className="agency-hero-meta">
          <span>SQLWHALE / 01</span>
          <span>INTERACTIVE SQL LEARNING</span>
        </div>

        <div className="agency-hero-inner">
          <Reveal className="agency-hero-copy">
            <p className="agency-eyebrow">See the query. Understand the query.</p>
            <h1>SQL becomes<br /><RotatingHeroWord />.</h1>
            <p className="agency-hero-lede">
              Stop memorizing what SQL does. Write a query, run it, and follow the data through the database.
            </p>
            <div className="hero-actions">
              <Link href="/run-query" className="primary-button agency-primary-button">
                Run your first query <span>↗</span>
              </Link>
              <a href="#how-it-works" className="secondary-button agency-secondary-button">
                Explore the method <span>↓</span>
              </a>
            </div>
          </Reveal>

          <Reveal className="agency-hero-stage">
            <div className="agency-stage-caption">
              <span>LIVE QUERY MAP</span>
              <span>01 / 03</span>
            </div>
            <div className="query-scene" aria-label="Animated SQL query relationship preview">
              <div className="query-scene-glow" />
              <div className="scene-table scene-table-source">
                <span className="scene-table-type">TABLE</span>
                <strong>employees</strong>
                <i /><i /><i />
              </div>
              <div className="scene-table scene-table-filter">
                <span className="scene-table-type">FILTER</span>
                <strong>salary &gt; 50000</strong>
                <i /><i />
              </div>
              <div className="scene-table scene-table-result">
                <span className="scene-table-type">RESULT</span>
                <strong>3 rows</strong>
                <i /><i /><i />
              </div>
              <div className="scene-line scene-line-one"><span /></div>
              <div className="scene-line scene-line-two"><span /></div>
              <div className="scene-query">
                <span className="scene-query-number">01</span>
                <div><b>SELECT</b> name, salary</div>
                <div><b>FROM</b> employees</div>
                <div><b>WHERE</b> salary &gt; 50000;</div>
              </div>
              <div className="scene-status"><span /> QUERY EXECUTED</div>
            </div>
            <div className="agency-stage-footer">
              <span>WRITE</span><b>→</b><span>EXECUTE</span><b>→</b><span>UNDERSTAND</span>
            </div>
          </Reveal>
        </div>

        <div className="agency-hero-bottom">
          <span>Built for people learning SQL from the ground up.</span>
          <span>Scroll to discover the system.</span>
        </div>
      </section>

      <section id="about" className="home-section agency-intro-section">
        <Reveal>
          <div className="agency-section-index">02 / THE PROBLEM</div>
          <div className="agency-intro-grid">
            <h2>You can read<br />a query without<br /><em className="agency-purple-accent">understanding it.</em></h2>
            <div>
              <p className="agency-big-copy">
                Most SQL tools show you what came out. SQLWhale focuses on what happened before it.
              </p>
              <p>
                Tables. Relationships. Filters. Operations. Results. We turn the invisible execution path into something you can follow.
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="home-section agency-system-section">
        <Reveal>
          <div className="agency-section-head">
            <div className="agency-section-index">03 / THE SYSTEM</div>
            <h2>From syntax<br /><em>to understanding.</em></h2>
          </div>
        </Reveal>
        <div className="agency-system-rail">
          {[
            ["01", "WRITE", "Start with real SQL. Edit the query instead of copying an answer."],
            ["02", "TRACE", "See which tables and relationships your query touches."],
            ["03", "EXECUTE", "Watch the operations turn your SQL into a result."],
            ["04", "UNDERSTAND", "Connect the syntax to what the database actually did."]
          ].map(([num, title, copy]) => (
            <Reveal key={num} className="agency-system-item">
              <span className="agency-system-number">{num}</span>
              <div className="agency-system-rule" />
              <h3>{title}</h3>
              <p>{copy}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="home-section agency-visual-section">
        <Reveal>
          <div className="agency-section-index">04 / SEE IT HAPPEN</div>
          <div className="agency-visual-layout">
            <div className="agency-visual-copy">
              <h2>The database<br /><em className="agency-purple-accent">stops being abstract.</em></h2>
              <p>
                SQLWhale puts your editor, database structure and result into one visual learning loop.
              </p>
              <Link href="/run-query" className="primary-button">Open the SQL workspace <span>↗</span></Link>
            </div>
            <div className="agency-database-art" aria-hidden="true">
              <div className="db-art-label">DATABASE CANVAS</div>
              <div className="db-art-table db-art-a"><b>departments</b><span>id · name</span></div>
              <div className="db-art-table db-art-b"><b>employees</b><span>id · dept_id · salary</span></div>
              <div className="db-art-table db-art-c"><b>projects</b><span>id · employee_id</span></div>
              <div className="db-art-table db-art-d"><b>salary</b><span>employee_id · amount</span></div>
              <svg className="db-art-lines" viewBox="0 0 620 430" preserveAspectRatio="none">
                <path d="M145 118 C240 118 235 205 310 205" />
                <path d="M465 118 C380 118 385 205 310 205" />
                <path d="M310 255 C310 300 195 300 195 345" />
                <path d="M310 255 C310 300 440 300 440 345" />
              </svg>
              <div className="db-art-key">PK</div>
              <div className="db-art-key db-art-key-fk">FK</div>
            </div>
          </div>
        </Reveal>
      </section>

      <section id="how-it-works" className="home-section agency-method-section">
        <Reveal>
          <div className="agency-section-index">05 / THE METHOD</div>
          <div className="agency-method-heading">
            <h2>Learning SQL should feel<br /><em className="agency-purple-accent">like solving something.</em></h2>
            <p>One workspace. One query. One visible execution path.</p>
          </div>
        </Reveal>
        <div className="agency-method-list">
          {[
            ["01", "Choose a table", "Start from the database canvas and understand the structure you're querying."],
            ["02", "Write the SQL", "Use the editor to build the query yourself and practice the syntax."],
            ["03", "Run it", "Execute the query and watch the output change instead of guessing."],
            ["04", "Connect the dots", "Use the visual flow to understand why the result looks the way it does."]
          ].map(([num, title, copy]) => (
            <Reveal key={num}>
              <div className="agency-method-row">
                <span>{num}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
                <Link href="/run-query" aria-label={title + " in SQLWhale"}>↗</Link>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="contact-section agency-final-section">
        <Reveal>
          <div className="agency-section-index">06 / START HERE</div>
          <h2>See what your<br /><em>SQL actually does.</em></h2>
          <p>Open the workspace and run a query. The first one is already waiting.</p>
          <Link href="/run-query" className="primary-button agency-final-button">Enter SQLWhale <span>↗</span></Link>
        </Reveal>
        <Reveal className="support-box-wrap">
          <div id="support" className="support-box agency-support-box">
            <span>BUILDING IN PUBLIC</span>
            <h3><AppleEmoji name="coffee" size={22} /> Support SQLWhale</h3>
            <p>Help us keep building better tools for learning SQL.</p>
            <a className="support-button" href="https://buymeacoffee.com/danishkhanww" target="_blank" rel="noopener noreferrer">Support the project</a>
          </div>
        </Reveal>
      </section>

      <footer className="sqlwhale-footer">
        <div className="footer-industrial-grid">
          <div className="footer-brand-block"><Link href="/" className="sqlwhale-logo footer-logo" aria-label="SQLWhale Home"><Image src="/assets/sqlwhale-logo.png" alt="SQLWhale" width={52} height={52} className="sqlwhale-logo-image" /><span className="logo-wordmark"><span className="logo-whale">SQL</span><span className="logo-text">Whale</span></span></Link><p className="footer-tagline">Learn SQL. See the process. Understand the result.</p><div className="footer-status"><span className="status-dot" />SQL LEARNING SYSTEM</div></div>
          <div className="footer-column"><span className="footer-column-title">NAVIGATION</span><Link href="/">Home</Link><Link href="/run-query">Run Query</Link><a href="#about">About</a><a href="#how-it-works">How It Works</a><Link href="/contact">Contact</Link></div>
          <div className="footer-column"><span className="footer-column-title">PLATFORM</span><span>SQL Editor</span><span>Query Execution</span><span>Visual Learning</span><span>Interactive Database</span></div>
          <div className="footer-column"><span className="footer-column-title">BUILT BY</span><span className="footer-company">WEBXWHALE</span><span className="footer-company-description">Interactive SQL learning platform.</span>{!authLoading && user?.role === "admin" ? <Link href="/admin">Admin</Link> : null}</div>
          <div className="footer-column"><span className="footer-column-title">LEGAL</span><Link href="/privacy-policy">Privacy Policy</Link><Link href="/terms">Terms &amp; Conditions</Link><Link href="/refund-policy">Return &amp; Refund Policy</Link></div>
        </div>
        <div className="footer-industrial-line"><span /><span className="footer-line-label">SQLWHALE / INDEPENDENT ACCOUNT SYSTEM</span><span /></div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} SQLWhale. All rights reserved.</span><span className="footer-learning-service">SQLWhale learning platform</span></div>
      </footer>
    </main>
  );
}