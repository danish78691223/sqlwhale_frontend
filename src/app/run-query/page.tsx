"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

import SQLEditor from "@/components/sql-editor/SQLEditor";
import StaticDatabaseSchema from "@/components/database/StaticDatabaseSchema";
import QueryVisualization from "@/components/visualization/QueryVisualization";
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

  const [query, setQuery] =
    useState(DEFAULT_QUERY);

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
      {/* =================================================
          NAVBAR
      ================================================= */}

      <header className="sqlwhale-run-navbar">
        <a
          href="/assets/sqlwhale-logo.jpeg"
          className="sqlwhale-run-logo"
        >
          <span className="sqlwhale-run-logo-mark">
            ◢
          </span>

          <span>SQLWhale</span>
        </a>

        <div className="sqlwhale-run-right">
          <button
            className="theme-button"
            type="button"
            aria-label="Change theme"
          >
            ☼
          </button>

          <nav className="sqlwhale-run-nav">
            <Link
              href="/learn"
              className="nav-link"
            >
              Learn
            </Link>

            <a
              href="/run-query"
              className="nav-link active"
            >
              Visualize
            </a>

            <Link
              href="/understand"
              className="nav-link"
            >
              Understand
            </Link>
          </nav>
        </div>
      </header>

      {/* =================================================
          MAIN WORKSPACE
      ================================================= */}

      <section className="sqlwhale-main-workspace">
        {/* =================================================
            STATIC DATABASE SCHEMA
        ================================================= */}

        <StaticDatabaseSchema />

        {/* =================================================
            QUERY VISUALIZATION
        ================================================= */}

        <QueryVisualization
          query={query}
          running={loading}
          executed={Boolean(data)}
        />

        {/* =================================================
            CENTRAL OUTPUT
        ================================================= */}

        <section
          className="sqlwhale-center-output"
          data-sql-output
        >
          <div className="output-box-header">
            <div className="output-box-title">
              <span className="output-box-symbol">
                ◫
              </span>

              <strong>
                Query Output
              </strong>
            </div>

            <span className="output-box-subtitle">
              SQL result
            </span>
          </div>

          <div className="output-box-content">
            {/* =================================================
                LOADING
            ================================================= */}

            {loading ? (
              <div className="output-empty">
                <div className="output-empty-icon">
                  ◌
                </div>

                <h3>
                  Executing query...
                </h3>

                <p>
                  SQLWhale is tracing the
                  query execution.
                </p>
              </div>
            ) : error ? (
              /* =================================================
                  ERROR
              ================================================= */

              <div className="output-error-state">
                <div className="output-error-icon">
                  !
                </div>

                <h3>
                  Query failed
                </h3>

                <p>
                  {error}
                </p>
              </div>
            ) : result ? (
              /* =================================================
                  QUERY RESULT
              ================================================= */

              <div className="query-result-preview">
                <div className="result-preview-heading">
                  <span>
                    Result
                  </span>

                  <small>
                    {result.rows.length} rows
                  </small>
                </div>

                <div className="result-preview-table">
                  <table>
                    <thead>
                      <tr>
                        {result.columns.map(
                          (column) => (
                            <th
                              key={column}
                            >
                              {column}
                            </th>
                          )
                        )}
                      </tr>
                    </thead>

                    <tbody>
                      {result.rows
                        .slice(0, 8)
                        .map(
                          (
                            row,
                            rowIndex
                          ) => (
                            <tr
                              key={rowIndex}
                            >
                              {result.columns.map(
                                (
                                  column,
                                  columnIndex
                                ) => (
                                  <td
                                    key={
                                      column
                                    }
                                  >
                                    {String(
                                      row[
                                      columnIndex
                                      ] ?? ""
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
              /* =================================================
                  EMPTY STATE
              ================================================= */

              <div className="output-empty">
                <div className="output-empty-icon">
                  ▷
                </div>

                <h3>
                  Run a SQL query
                </h3>

                <p>
                  Execute a query to see
                  the result and its visual
                  execution flow.
                </p>
              </div>
            )}
          </div>
        </section>
      </section>

      {/* =================================================
          SQL EDITOR
      ================================================= */}

      <section
        className="sqlwhale-query-editor"
        data-sql-editor
      >
        <SQLEditor
          initialQuery={query}
          loading={loading}
          onRun={handleRun}
          onClear={handleClear}
        />
      </section>

      {/* =================================================
          UNDERSTAND ANCHOR
      ================================================= */}

      <div
        id="query-explanation"
        className="query-explanation-anchor"
      />
    </main>
  );
}