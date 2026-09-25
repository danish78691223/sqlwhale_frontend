"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import SQLEditor from "@/components/sql-editor/SQLEditor";
import DatabaseCanvas from "@/components/database/DatabaseCanvas";
import QueryVisualization from "@/components/visualization/QueryVisualization";

import { getAllTableDetails } from "@/services/table.service";
import type { DatabaseTable } from "@/types/table";
import { useSQLQuery } from "@/hooks/useSQLQuery";

const DEFAULT_QUERY = "SELECT * FROM employees;";

export default function RunQueryPage() {
  const {
    data,
    loading,
    error,
    runQuery,
    clearResult,
  } = useSQLQuery();

  const [query, setQuery] = useState(DEFAULT_QUERY);
  const [tables, setTables] = useState<DatabaseTable[]>([]);
  const [tablesLoading, setTablesLoading] = useState(true);
  const [tablesError, setTablesError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadTables = async () => {
      try {
        setTablesLoading(true);
        setTablesError(null);

        const databaseTables = await getAllTableDetails();

        if (mounted) {
          setTables(databaseTables);
        }
      } catch (tableError) {
        if (mounted) {
          setTablesError(
            tableError instanceof Error
              ? tableError.message
              : "Unable to load database schema."
          );
        }
      } finally {
        if (mounted) {
          setTablesLoading(false);
        }
      }
    };

    loadTables();

    return () => {
      mounted = false;
    };
  }, []);

  /* =========================
     MOBILE NAVIGATION
  ========================== */

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const [darkMode, setDarkMode] =
    useState(false);

  useEffect(() => {
    const savedTheme =
      localStorage.getItem("sqlwhale-theme");

    const shouldUseDark =
      savedTheme === "dark";

    setDarkMode(shouldUseDark);

    document.documentElement.classList.toggle(
      "dark",
      shouldUseDark
    );
  }, []);

  const handleThemeToggle = () => {
    setDarkMode((previous) => {
      const nextMode = !previous;

      document.documentElement.classList.toggle(
        "dark",
        nextMode
      );

      localStorage.setItem(
        "sqlwhale-theme",
        nextMode ? "dark" : "light"
      );

      return nextMode;
    });
  };

  const handleRun = async (sql: string) => {
    const cleanSQL = sql.trim();

    setQuery(cleanSQL);

    await runQuery(cleanSQL);
  };

  const handleClear = () => {
    setQuery("");
    clearResult();
  };

  const result = data?.result;

  return (
    <main className="sqlwhale-run-page">
      <header className="sqlwhale-run-navbar">
        <div className="sqlwhale-run-navbar-inner">
          <Link
            href="/"
            className="sqlwhale-run-logo"
            aria-label="SQLWhale Home"
            onClick={() => setMobileMenuOpen(false)}
          >
            <Image
              src="/assets/sqlwhale-logo.png"
              alt="SQLWhale"
              width={46}
              height={46}
              className="sqlwhale-run-logo-image"
              priority
            />

            <span className="sqlwhale-run-logo-wordmark">
              <span className="run-logo-whale">SQL</span>
              <span className="run-logo-text">Whale</span>
            </span>
          </Link>

          <div className="sqlwhale-run-right">
            <button
              className={`theme-button ${darkMode ? "theme-button-dark" : ""}`}
              type="button"
              onClick={handleThemeToggle}
              aria-label={
                darkMode
                  ? "Switch to light theme"
                  : "Switch to dark theme"
              }
              aria-pressed={darkMode}
            >
              <span className="theme-icon">
                {darkMode ? "☾" : "☼"}
              </span>
            </button>

            <nav
              className="sqlwhale-run-nav"
              aria-label="Primary navigation"
            >
              <Link href="/learn" className="run-nav-link">
                <span className="run-nav-number">01</span>
                Learn
              </Link>

              <Link
                href="/run-query"
                className="run-nav-link active"
              >
                <span className="run-nav-number">02</span>
                Visualize
              </Link>

              <Link
                href="/understand"
                className="run-nav-link"
              >
                <span className="run-nav-number">03</span>
                Understand
              </Link>
            </nav>

            <button
              type="button"
              className={`run-mobile-menu-button ${mobileMenuOpen ? "is-open" : ""}`}
              onClick={() =>
                setMobileMenuOpen((previous) => !previous)
              }
              aria-label={
                mobileMenuOpen
                  ? "Close navigation menu"
                  : "Open navigation menu"
              }
              aria-expanded={mobileMenuOpen}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>

        <div
          className={`run-mobile-menu ${mobileMenuOpen ? "run-mobile-menu-open" : ""}`}
        >
          <nav
            className="run-mobile-nav"
            aria-label="Mobile navigation"
          >
            <Link
              href="/learn"
              className="run-mobile-nav-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="run-mobile-nav-number">01</span>
              <span>Learn</span>
              <span className="run-mobile-arrow">→</span>
            </Link>

            <Link
              href="/run-query"
              className="run-mobile-nav-link active"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="run-mobile-nav-number">02</span>
              <span>Visualize</span>
              <span className="run-mobile-arrow">→</span>
            </Link>

            <Link
              href="/understand"
              className="run-mobile-nav-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="run-mobile-nav-number">03</span>
              <span>Understand</span>
              <span className="run-mobile-arrow">→</span>
            </Link>
          </nav>

          <div className="run-mobile-status">
            <span className="run-status-dot" />
            SQL VISUALIZATION ENVIRONMENT
          </div>
        </div>
      </header>

      <section className="sqlwhale-main-workspace">
        <section
          className="sqlwhale-schema-workspace"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            pointerEvents: "auto",
          }}
        >
          {tablesLoading ? (
            <div className="output-empty">
              <div className="output-empty-icon">◌</div>
              <h3>Loading database schema...</h3>
              <p>SQLWhale is loading the table relationships.</p>
            </div>
          ) : tablesError ? (
            <div className="output-error-state">
              <div className="output-error-icon">!</div>
              <h3>Schema unavailable</h3>
              <p>{tablesError}</p>
            </div>
          ) : (
            <DatabaseCanvas tables={tables} />
          )}
        </section>

        <section
          className="sqlwhale-center-output"
          style={{ zIndex: 2 }}
          data-sql-output
        >
          <div className="output-box-header">
            <div className="output-box-title">
              <span className="output-box-symbol">◫</span>
              <strong>Query Output</strong>
            </div>

            <span className="output-box-subtitle">
              SQL result
            </span>
          </div>

          <div className="output-box-content">
            {loading ? (
              <div className="output-empty">
                <div className="output-empty-icon">◌</div>
                <h3>Executing query...</h3>
                <p>
                  SQLWhale is tracing the query execution.
                </p>
              </div>
            ) : error ? (
              <div className="output-error-state">
                <div className="output-error-icon">!</div>
                <h3>Query failed</h3>
                <p>{error}</p>
              </div>
            ) : result ? (
              <div className="query-result-preview">
                <div className="result-preview-heading">
                  <span>Result</span>
                  <small>{result.rows.length} rows</small>
                </div>

                <div className="result-preview-table">
                  <table>
                    <thead>
                      <tr>
                        {result.columns.map((column) => (
                          <th key={column}>{column}</th>
                        ))}
                      </tr>
                    </thead>

                    <tbody>
                      {result.rows.slice(0, 8).map(
                        (row, rowIndex) => (
                          <tr key={rowIndex}>
                            {result.columns.map(
                              (column, columnIndex) => (
                                <td key={column}>
                                  {String(
                                    row[columnIndex] ?? ""
                                  )}
                                </td>
                              )
                            )}
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="output-empty">
                <div className="output-empty-icon">▷</div>
                <h3>Run a SQL query</h3>
                <p>
                  Execute a query to see the result and its
                  visual execution flow.
                </p>
              </div>
            )}
          </div>
        </section>
      </section>

      <QueryVisualization
        query={query}
        running={loading}
        executed={Boolean(data)}
      />

      <section
        className="sqlwhale-query-editor"
        data-sql-editor
      >
        <SQLEditor
          initialQuery={query}
          loading={loading}
          darkMode={darkMode}
          onRun={handleRun}
          onClear={handleClear}
        />
      </section>

      <div
        id="query-explanation"
        className="query-explanation-anchor"
      />
    </main>
  );
}
