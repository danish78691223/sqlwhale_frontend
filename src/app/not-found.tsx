"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <main className="sqlwhale-not-found">
      <div className="sqlwhale-not-found-grid" aria-hidden="true" />

      <section className="sqlwhale-not-found-card" aria-labelledby="not-found-title">
        <div className="sqlwhale-not-found-whale" aria-hidden="true">
          🐋
        </div>

        <div className="sqlwhale-not-found-code">
          <span>404</span>
          <span className="sqlwhale-not-found-dot">.</span>
          <span>sql</span>
        </div>

        <p className="sqlwhale-not-found-kicker">QUERY FAILED</p>

        <h1 id="not-found-title">Whale lost in the database.</h1>

        <p className="sqlwhale-not-found-message">
          The page you&apos;re looking for doesn&apos;t exist, may have moved,
          or the route was never created.
        </p>

        <div className="sqlwhale-not-found-query" aria-hidden="true">
          <span className="sqlwhale-not-found-prompt">&gt;</span>
          <span>SELECT * FROM page WHERE path = &apos;this&apos;;</span>
          <span className="sqlwhale-not-found-error">0 rows</span>
        </div>

        <div className="sqlwhale-not-found-actions">
          <Link href="/" className="sqlwhale-not-found-primary">
            ← Back to SQLWhale
          </Link>
          <Link href="/run-query" className="sqlwhale-not-found-secondary">
            Open SQL Editor
          </Link>
        </div>
      </section>
    </main>
  );
}
