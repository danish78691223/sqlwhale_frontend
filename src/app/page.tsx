"use client";

"use client";

import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="sqlwhale-home">

      {/* =========================
          NAVBAR
      ========================== */}
      <header className="sqlwhale-navbar">
        <div className="navbar-inner">

          <Link href="/" className="sqlwhale-logo" aria-label="SQLWhale Home">
            <Image
              src="/assets/sqlwhale-logo.jpeg"
              alt="SQLWhale"
              width={46}
              height={46}
              className="sqlwhale-logo-image"
              priority
            />

            <span className="logo-wordmark">
              <span className="logo-whale">SQL</span>
              <span className="logo-text">Whale</span>
            </span>
          </Link>

          <nav className="navbar-links">
            <Link href="/" className="nav-link active">
              Home
            </Link>

            <Link href="/run-query" className="nav-link">
              Run Query
            </Link>

            <a href="#about" className="nav-link">
              About
            </a>

            <a href="#how-it-works" className="nav-link">
              How It Works
            </a>

            <a href="#contact" className="nav-link">
              Contact
            </a>
          </nav>

          <a
            href="#support"
            className="coffee-button"
          >
            ☕ Buy Us A Coffee
          </a>

        </div>
      </header>


      {/* =========================
          HERO SECTION
      ========================== */}
      <section className="home-hero">

        <div className="hero-content">

          <div className="hero-badge">
            <span className="hero-badge-dot"></span>
            Interactive SQL Learning
          </div>

          <h1>
            Learn SQL by seeing
            <br />
            <span>what actually happens.</span>
          </h1>

          <p>
            SQLWhale helps you understand SQL queries visually.
            Write a query, run it, and see how SQL transforms your
            data step by step.
          </p>

          <div className="hero-actions">

            <Link
              href="/run-query"
              className="primary-button"
            >
              Run Your First Query
              <span>→</span>
            </Link>

            <a
              href="#how-it-works"
              className="secondary-button"
            >
              How It Works
            </a>

          </div>

          <div className="hero-mini-info">

            <div className="mini-info">
              <strong>SQL</strong>
              <span>Learn by doing</span>
            </div>

            <div className="mini-divider"></div>

            <div className="mini-info">
              <strong>Visual</strong>
              <span>See every step</span>
            </div>

            <div className="mini-divider"></div>

            <div className="mini-info">
              <strong>Free</strong>
              <span>Practice anytime</span>
            </div>

          </div>

        </div>

        {/* Hero visual */}
        <div className="hero-visual">

          <div className="sql-window">

            <div className="sql-window-header">

              <div className="window-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>

              <span>SQLWhale Editor</span>

            </div>

            <div className="sql-code">

              <div>
                <span className="line-number">01</span>
                <span className="keyword">SELECT</span>{" "}
                <span className="field">name</span>,{" "}
                <span className="field">salary</span>
              </div>

              <div>
                <span className="line-number">02</span>
                <span className="keyword">FROM</span>{" "}
                <span className="table-name">employees</span>
              </div>

              <div>
                <span className="line-number">03</span>
                <span className="keyword">WHERE</span>{" "}
                <span className="field">salary</span>{" "}
                <span className="operator">&gt;</span>{" "}
                <span className="number">50000</span>;
              </div>

            </div>

            <div className="sql-result-preview">

              <div className="result-title">
                Query Result
                <span>✓ Executed</span>
              </div>

              <div className="result-row result-heading">
                <span>Name</span>
                <span>Salary</span>
              </div>

              <div className="result-row">
                <span>Rahul</span>
                <span>₹75,000</span>
              </div>

              <div className="result-row highlighted">
                <span>Priya</span>
                <span>₹62,000</span>
              </div>

              <div className="result-row">
                <span>Arjun</span>
                <span>₹58,000</span>
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =========================
          ABOUT SQLWHALE
      ========================== */}
      <section
        id="about"
        className="home-section about-section"
      >

        <div className="section-label">
          ABOUT SQLWHALE
        </div>

        <div className="about-grid">

          <div className="section-heading">

            <h2>
              SQL should be
              <br />
              <span>understood, not memorized.</span>
            </h2>

          </div>

          <div className="section-description">

            <p>
              SQLWhale is an interactive platform designed to help
              beginners understand how SQL queries work internally.
            </p>

            <p>
              Instead of showing only the final result, SQLWhale
              focuses on the journey of your query — from the source
              table to filtering, sorting, joining, grouping and
              finally producing the result.
            </p>

          </div>

        </div>


        <div className="about-cards">

          <div className="info-card">

            <div className="card-number">01</div>

            <h3>Write</h3>

            <p>
              Write a real SQL query using our interactive SQL editor.
            </p>

          </div>


          <div className="info-card">

            <div className="card-number">02</div>

            <h3>Execute</h3>

            <p>
              Execute the query against the available database tables.
            </p>

          </div>


          <div className="info-card">

            <div className="card-number">03</div>

            <h3>Understand</h3>

            <p>
              See the operations performed by SQL and understand the
              final result.
            </p>

          </div>

        </div>

      </section>


      {/* =========================
          WHAT SQLWHALE IS FOR
      ========================== */}
      <section className="home-section purpose-section">

        <div className="purpose-content">

          <div className="section-label">
            WHY SQLWHALE
          </div>

          <h2>
            Turn SQL queries into
            <br />
            <span>something you can see.</span>
          </h2>

          <p>
            SQL can become difficult when you only see a query and
            its final output. SQLWhale is designed to bridge that gap
            by making the execution process visible.
          </p>

          <Link
            href="/run-query"
            className="primary-button"
          >
            Explore SQLWhale
            <span>→</span>
          </Link>

        </div>


        <div className="purpose-features">

          <div className="purpose-feature">

            <div className="feature-icon">
              01
            </div>

            <div>
              <h3>Interactive SQL Editor</h3>

              <p>
                Write and execute SQL queries in a simple,
                beginner-friendly environment.
              </p>
            </div>

          </div>


          <div className="purpose-feature">

            <div className="feature-icon">
              02
            </div>

            <div>
              <h3>Execution Visualization</h3>

              <p>
                Understand how SQL operations affect rows and tables.
              </p>
            </div>

          </div>


          <div className="purpose-feature">

            <div className="feature-icon">
              03
            </div>

            <div>
              <h3>Step-by-Step Explanation</h3>

              <p>
                Follow the execution process instead of jumping
                directly to the answer.
              </p>
            </div>

          </div>

        </div>

      </section>


      {/* =========================
          HOW TO USE
      ========================== */}
      <section
        id="how-it-works"
        className="home-section how-section"
      >

        <div className="section-label">
          HOW TO USE SQLWHALE
        </div>

        <div className="how-header">

          <div>
            <h2>
              Four simple steps.
              <br />
              <span>One better way to learn SQL.</span>
            </h2>
          </div>

          <p>
            Start with a query and follow the execution process
            visually.
          </p>

        </div>


        <div className="steps-container">

          <div className="learning-step">

            <div className="step-top">
              <span>01</span>
              <div className="step-line"></div>
            </div>

            <h3>Write</h3>

            <p>
              Write your SQL query in the SQLWhale editor.
            </p>

          </div>


          <div className="learning-step">

            <div className="step-top">
              <span>02</span>
              <div className="step-line"></div>
            </div>

            <h3>Run</h3>

            <p>
              Execute your query against the available tables.
            </p>

          </div>


          <div className="learning-step">

            <div className="step-top">
              <span>03</span>
              <div className="step-line"></div>
            </div>

            <h3>Visualize</h3>

            <p>
              Watch the query execution and see what changes.
            </p>

          </div>


          <div className="learning-step">

            <div className="step-top">
              <span>04</span>
              <div className="step-line last"></div>
            </div>

            <h3>Understand</h3>

            <p>
              Read the explanation and understand the result.
            </p>

          </div>

        </div>


        <div className="how-cta">

          <h3>
            Ready to understand SQL differently?
          </h3>

          <Link
            href="/run-query"
            className="primary-button"
          >
            Start Running Queries
            <span>→</span>
          </Link>

        </div>

      </section>


      {/* =========================
          CONTACT / SUPPORT
      ========================== */}
      <section
        id="contact"
        className="contact-section"
      >

        <div>

          <div className="section-label">
            SQLWHALE
          </div>

          <h2>
            Built to make SQL
            <br />
            easier to understand.
          </h2>

          <p>
            Have feedback, suggestions or ideas for SQLWhale?
            We would love to hear from you.
          </p>

        </div>


        <div
          id="support"
          className="support-box"
        >

          <span>Support the project</span>

          <h3>
            ☕ Buy Us A Coffee
          </h3>

          <p>
            Help us continue building better tools for learning SQL.
          </p>

          <button className="support-button">
            Support SQLWhale
          </button>

        </div>

      </section>


      {/* =========================
    FOOTER
========================== */}

      <footer className="sqlwhale-footer">

        <div className="footer-industrial-grid">

          {/* BRAND */}
          <div className="footer-brand-block">

            <Link
              href="/"
              className="sqlwhale-logo footer-logo"
              aria-label="SQLWhale Home"
            >
              <Image
                src="/assets/sqlwhale-logo.jpeg"
                alt="SQLWhale"
                width={52}
                height={52}
                className="sqlwhale-logo-image"
              />

              <span className="logo-wordmark">
                <span className="logo-whale">SQL</span>
                <span className="logo-text">Whale</span>
              </span>
            </Link>

            <p className="footer-tagline">
              Learn SQL. See the process. Understand the result.
            </p>

            <div className="footer-status">
              <span className="status-dot"></span>
              SQL LEARNING SYSTEM
            </div>

          </div>


          {/* NAVIGATION */}
          <div className="footer-column">

            <span className="footer-column-title">
              NAVIGATION
            </span>

            <Link href="/">Home</Link>
            <Link href="/run-query">Run Query</Link>
            <a href="#about">About</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#contact">Contact</a>

          </div>


          {/* PLATFORM */}
          <div className="footer-column">

            <span className="footer-column-title">
              PLATFORM
            </span>

            <span>SQL Editor</span>
            <span>Query Execution</span>
            <span>Visual Learning</span>
            <span>Interactive Database</span>

          </div>


          {/* COMPANY */}
          <div className="footer-column">

            <span className="footer-column-title">
              BUILT BY
            </span>

            <span className="footer-company">
              WEBWHALE
            </span>

            <span className="footer-company-description">
              Technology &amp; digital learning systems.
            </span>

          </div>

          {/* LEGAL */}
          <div className="footer-column">

            <span className="footer-column-title">
              LEGAL
            </span>

            <Link href="/privacy-policy">
              Privacy Policy
            </Link>

            <Link href="/terms">
              Terms & Conditions
            </Link>

            <Link href="/refund-policy">
              Return & Refund Policy
            </Link>

          </div>

        </div>


        {/* INDUSTRIAL DIVIDER */}

        <div className="footer-industrial-line">
          <span></span>
          <span className="footer-line-label">
            SQLWHALE / WEBWHALE
          </span>
          <span></span>
        </div>


        {/* BOTTOM BAR */}

        <div className="footer-bottom">

          <span>
            © {new Date().getFullYear()} SQLWhale. All rights reserved.
          </span>

          <span className="footer-learning-service">
            Learning service by <strong>WEBWHALE</strong>
          </span>

        </div>

      </footer>

    </main>
  );
}