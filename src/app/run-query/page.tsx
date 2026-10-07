"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";

import SQLEditor, { type SQLEditorHandle } from "@/components/sql-editor/SQLEditor";
import SQLQueryBuilder from "@/components/query-builder/SQLQueryBuilder";
import TaskSection from "@/components/tasks/TaskSection";
import DatabaseCanvas from "@/components/database/DatabaseCanvas";
import DatabaseCanvasSkeleton from "@/components/database/DatabaseCanvasSkeleton";
import AppleEmoji from "@/components/AppleEmoji";
import QueryVisualization from "@/components/visualization/QueryVisualization";
import EditTableCanvas from "@/components/database/EditTableCanvas";

import { getAllTableDetails } from "@/services/table.service";
import type { DatabaseTable } from "@/types/table";
import { useSQLQuery } from "@/hooks/useSQLQuery";
import { executeSQL } from "@/services/sql.service";
import { api } from "@/services/api";

const DEFAULT_QUERY = "SELECT * FROM employees;";

export default function RunQueryPage() {
  const {
    data,
    loading,
    error,
    runQuery,
    applyResult,
    clearResult,
  } = useSQLQuery();

  const [query, setQuery] = useState(DEFAULT_QUERY);
  const sqlEditorRef = useRef<SQLEditorHandle>(null);
  const [tables, setTables] = useState<DatabaseTable[]>([]);
  const [tablesLoading, setTablesLoading] = useState(true);
  const [tablesError, setTablesError] = useState<string | null>(null);
  const [animationRunId, setAnimationRunId] = useState(0);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [executedQuery, setExecutedQuery] = useState<string | null>(null);
  const [slowExecution, setSlowExecution] = useState(false);
  const [queryAnimationStage, setQueryAnimationStage] = useState<string | null>(null);
  const [dropDestructionStage, setDropDestructionStage] = useState(0);
  const [builderOpen, setBuilderOpen] = useState(false);
  const [taskOpen, setTaskOpen] = useState(false);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [taskCheck, setTaskCheck] = useState<{ taskId: string; correct: boolean; status: "correct" | "incorrect" | "invalid"; message: string } | null>(null);
  const [taskSubmitting, setTaskSubmitting] = useState(false);
  const [showProductTour, setShowProductTour] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [tourRect, setTourRect] = useState<DOMRect | null>(null);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [showDesktopNotice, setShowDesktopNotice] = useState(false);

  const tourSteps = [
    { target: "schema", title: "Database Canvas", text: "This is your database. See tables, columns, and how they are connected." },
    { target: "output", title: "Query Output", text: "After you run SQL, the result appears here along with the visual execution flow." },
    { target: "builder", title: "Visual Query Builder", text: "Build a query visually when you don't want to write all the SQL yourself." },
    { target: "task", title: "SQL Tasks", text: "Practice with admin-created SQL challenges and use the editor to solve them." },
    { target: "editor", title: "SQL Editor", text: "Write and edit your SQL here. This is where you practice the actual query." },
  ];

  useEffect(() => {
    if (localStorage.getItem("sqlwhale-product-tour-seen") !== "true") setShowProductTour(true);
  }, []);

  useEffect(() => {
    const detectMobileDevice = () => {
      const userAgent = navigator.userAgent || "";
      const mobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(userAgent);
      const touchDevice = navigator.maxTouchPoints > 0 || "ontouchstart" in window;
      const smallViewport = window.matchMedia("(max-width: 768px)").matches;

      const mobile = mobileUserAgent || (touchDevice && smallViewport);
      setIsMobileDevice(mobile);
      setShowDesktopNotice(mobile);
    };

    detectMobileDevice();
    window.addEventListener("resize", detectMobileDevice);
    window.addEventListener("orientationchange", detectMobileDevice);

    return () => {
      window.removeEventListener("resize", detectMobileDevice);
      window.removeEventListener("orientationchange", detectMobileDevice);
    };
  }, []);

  useEffect(() => {
    if (!showProductTour) return;
    const target = document.querySelector<HTMLElement>(`[data-sqlwhale-tour="${tourSteps[tourStep].target}"]`);
    if (!target) return;

    // Keep the canvas and builder from visually colliding while the tour
    // explains a specific area of the workspace.
    const isCanvasStep = tourSteps[tourStep].target === "schema";
    const isBuilderStep = tourSteps[tourStep].target === "builder";
    const isTaskStep = tourSteps[tourStep].target === "task";

    // The builder/task panel stays collapsed during normal use. The tour is
    // the only automatic moment when one opens without the user clicking it.
    setBuilderOpen(isBuilderStep);
    setTaskOpen(isTaskStep);

    document.body.classList.toggle(
      "sqlwhale-tour-active",
      isCanvasStep
    );

    // The mobile workspace is intentionally viewport-locked, so do not
    // scroll the page while the guided tour moves between panels.
    const updateRect = () => setTourRect(target.getBoundingClientRect());
    updateRect();
    window.addEventListener("resize", updateRect);
    window.addEventListener("scroll", updateRect, true);
    return () => {
      document.body.classList.remove("sqlwhale-tour-active");
      window.removeEventListener("resize", updateRect);
      window.removeEventListener("scroll", updateRect, true);
    };
  }, [showProductTour, tourStep, builderOpen]);
  const [activeSqlTarget, setActiveSqlTarget] = useState<{
    table?: string;
    column: string;
  } | null>(null);
  const [queryTableTargets, setQueryTableTargets] = useState<string[]>([]);
  const [focusedTableName, setFocusedTableName] = useState<string | null>(null);

  const handleQueryTableChange = useCallback((nextTables: string[]) => {
    setQueryTableTargets(nextTables);
    setFocusedTableName(null);
  }, []);
  const [queryRevealIndex, setQueryRevealIndex] = useState<number | null>(null);
  const [queryRevealActive, setQueryRevealActive] = useState(false);
  const [editTable, setEditTable] = useState<DatabaseTable | null>(null);

  const refreshDatabaseTables = useCallback(async () => {
    try {
      setTablesError(null);
      const databaseTables = await getAllTableDetails();
      setTables(databaseTables);
      return true;
    } catch (tableError) {
      setTablesError(
        tableError instanceof Error
          ? tableError.message
          : "Unable to refresh database schema."
      );
      return false;
    }
  }, []);

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
  const [feedbackUser, setFeedbackUser] = useState<any>(null);

  const [darkMode, setDarkMode] =
    useState(false);

  useEffect(() => {
    const updateMobileLayout = () => {
      const touchDevice = navigator.maxTouchPoints > 0 || "ontouchstart" in window;
      const screenW = Math.min(window.screen.width, window.screen.height);
      // Android browsers can report a desktop-sized CSS viewport when
      // "Desktop site" is enabled. Detect the physical/touch device as well
      // so the mobile composition still applies in that mode.
      const mobileLayout =
        touchDevice && (screenW <= 1400 || window.innerWidth <= 900);

      document.documentElement.classList.toggle("sqlwhale-force-mobile", mobileLayout);
    };

    updateMobileLayout();
    window.addEventListener("resize", updateMobileLayout);
    window.addEventListener("orientationchange", updateMobileLayout);

    return () => {
      window.removeEventListener("resize", updateMobileLayout);
      window.removeEventListener("orientationchange", updateMobileLayout);
      document.documentElement.classList.remove("sqlwhale-force-mobile");
    };
  }, []);

  useEffect(() => {
    let active = true;
    fetch("/api/auth/me", { credentials: "include" })
      .then((response) => response.ok ? response.json() : null)
      .then((data) => {
        if (active) setFeedbackUser(data?.user || null);
      })
      .catch(() => {
        if (active) setFeedbackUser(null);
      });
    return () => { active = false; };
  }, []);

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

  const finishProductTour = () => {
    setShowProductTour(false);
    setBuilderOpen(false);
    setTaskOpen(false);
    localStorage.setItem("sqlwhale-product-tour-seen", "true");
    setTourRect(null);
  };

  const handleRun = async (sql: string, showWhatHappened = false) => {
    const cleanSQL = sql.trim();

    if (!cleanSQL) return;

    // "Show what happened" is a replay, not a second execution. If this exact
    // query already produced the current result, only restart the visual replay
    // so INSERT/UPDATE/DELETE statements cannot write to the database again.
    if (showWhatHappened && data?.success && executedQuery?.trim() === cleanSQL) {
      setQuery(cleanSQL);
      setAnimationComplete(false);
      setSlowExecution(true);
      setAnimationRunId((current) => current + 1);
      return;
    }

    setQuery(cleanSQL);
    setExecutedQuery(null);
    setAnimationComplete(false);
    setAnimationRunId((current) => current + 1);
    setSlowExecution(showWhatHappened);

    if (activeTaskId) {
      setTaskSubmitting(true);
      try {
        const check = await api.post(`/tasks/${activeTaskId}/check`, { query: cleanSQL });

        const correct = Boolean(check.data?.correct);

        setTaskCheck({
          taskId: activeTaskId,
          correct,
          status: check.data?.status || "incorrect",
          message: check.data?.message || "Unable to determine the answer.",
        });

        if (correct) {
          setActiveTaskId(null);
        }

        if (check.data?.sqlResponse) {
          applyResult(check.data.sqlResponse);
        } else {
          applyResult({
            success: false,
            error:
              check.data?.executionError ||
              check.data?.message ||
              "Unable to execute the task query.",
          });
        }
      } catch (checkError) {
        console.error("Task check failed:", checkError);
        setTaskCheck({
          taskId: activeTaskId,
          correct: false,
          status: "invalid",
          message: "Unable to check the task right now. Please try again.",
        });
        applyResult({
          success: false,
          error: "Unable to check the task right now. Please try again.",
        });
      } finally {
        setTaskSubmitting(false);
      }
      return;
    }

    await runQuery(cleanSQL);

    // Keep a DROP TABLE visible during "Show what happened" so the canvas
    // can animate its destruction before React Flow removes the node.
    if (/^\s*CREATE\s+TABLE\b/i.test(cleanSQL)) {
      await refreshDatabaseTables();
    } else if (/^\s*DROP\s+TABLE\b/i.test(cleanSQL) && !showWhatHappened) {
      await refreshDatabaseTables();
    }
  };

  useEffect(() => {
    if (!data?.success) return;

    setExecutedQuery(query);

    const orderedTables = data.queryAnalysis?.tables ?? [];
    if (orderedTables.length === 0) {
      setQueryRevealActive(false);
      setQueryRevealIndex(null);
      return;
    }

    setQueryRevealActive(true);
    setQueryRevealIndex(-1);

    let currentIndex = 0;
    const revealNext = () => {
      setQueryRevealIndex(currentIndex);
      currentIndex += 1;

      if (currentIndex >= orderedTables.length) {
        window.setTimeout(() => {
          setQueryRevealActive(false);
          setQueryRevealIndex(null);
        }, 700);
        return;
      }

      window.setTimeout(revealNext, 650);
    };

    const timer = window.setTimeout(revealNext, 120);
    return () => window.clearTimeout(timer);
  }, [data, query]);

  const handleClear = () => {
    setQuery("");
    setExecutedQuery(null);
    setQueryAnimationStage(null);
    setAnimationComplete(false);
    setTaskCheck(null);
    clearResult();
  };

  const result = data?.result;
  const isDropReplay = slowExecution && /^\s*DROP\s+TABLE\b/i.test(query);
  const dropReplayStep = isDropReplay
    ? data?.execution?.steps.find((step) => step.operation === "drop_table")
    : undefined;
  const dropReplayTableName =
    String(dropReplayStep?.metadata?.tableName ?? dropReplayStep?.targetTable ?? "").trim() || null;
  const destroyingTableName = isDropReplay ? dropReplayTableName : null;
  const replayFocusedTableName = isDropReplay
    ? dropReplayTableName
    : focusedTableName;
  const destroyingStage = isDropReplay ? dropDestructionStage : 0;

  const runEditSQL = async (sql: string) => {
    try {
      const response = await executeSQL(sql);
      if (!response.success) {
        window.alert(response.error || "SQL operation failed.");
      }
      return Boolean(response.success);
    } catch (editError) {
      if (axios.isAxiosError(editError)) {
        const serverError =
          editError.response?.data?.error ||
          editError.response?.data?.message ||
          editError.message;
        console.error("SQLWhale edit SQL failed:", editError.response?.data || editError);
        window.alert("SQL update failed: " + serverError);
      } else {
        window.alert(editError instanceof Error ? editError.message : "Unable to execute SQL.");
      }
      return false;
    }
  };

  const refreshTables = async () => {
    const latest = await getAllTableDetails();
    setTables(latest);
  };

  return (
    <>
      {isMobileDevice && showDesktopNotice && (
        <div
          className="sqlwhale-desktop-notice"
          role="dialog"
          aria-modal="true"
          aria-labelledby="sqlwhale-desktop-notice-title"
        >
          <div className="sqlwhale-desktop-notice-card">
            <div className="sqlwhale-desktop-notice-icon" aria-hidden="true"><AppleEmoji name="desktop_computer" size={30} /></div>
            <h2 id="sqlwhale-desktop-notice-title">Turn on Desktop Mode</h2>
            <p>
              SQLWhale works better on desktop. On your mobile browser, open the browser menu and turn on <strong>Desktop site</strong> or <strong>Desktop mode</strong>, then refresh SQLWhale.
            </p>
            <button
              type="button"
              className="sqlwhale-desktop-notice-close"
              onClick={() => setShowDesktopNotice(false)}
            >
              Got it
            </button>
          </div>
        </div>
      )}

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

              {feedbackUser ? (
                <button
                  type="button"
                  className="run-nav-link run-feedback-button"
                  onClick={() => window.dispatchEvent(new Event("sqlwhale:open-feedback"))}
                >
                  Feedback
                </button>
              ) : null}
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

            {feedbackUser ? (
              <button
                type="button"
                className="run-mobile-nav-link run-mobile-feedback-button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  window.dispatchEvent(new Event("sqlwhale:open-feedback"));
                }}
              >
                <span className="run-mobile-nav-number">04</span>
                <span>Feedback</span>
                <span className="run-mobile-arrow">→</span>
              </button>
            ) : null}
          </nav>

          <div className="run-mobile-status">
            <span className="run-status-dot" />
            SQL VISUALIZATION ENVIRONMENT
          </div>
        </div>
      </header>

      {showProductTour && tourRect && (
        <div className="sqlwhale-product-tour" role="dialog" aria-modal="true" aria-labelledby="sqlwhale-tour-title">
          <div className="sqlwhale-tour-spotlight" style={{ top: Math.max(8, tourRect.top - 8), left: Math.max(8, tourRect.left - 8), width: tourRect.width + 16, height: tourRect.height + 16 }} />
          <div
            className="sqlwhale-tour-card"
            style={{
              top:
                tourRect.bottom + 18 + 180 <= window.innerHeight
                  ? tourRect.bottom + 18
                  : Math.max(16, tourRect.top - 180),
              left: Math.min(Math.max(16, tourRect.left), Math.max(16, window.innerWidth - 336)),
            }}
          >
            <span className="sqlwhale-tour-step">STEP {tourStep + 1} OF {tourSteps.length}</span>
            <h2 id="sqlwhale-tour-title">{tourSteps[tourStep].title}</h2>
            <p>{tourSteps[tourStep].text}</p>
            <div className="sqlwhale-tour-actions">
              <button type="button" className="sqlwhale-tour-skip" onClick={finishProductTour}>Skip tour</button>
              <button type="button" className="sqlwhale-tour-next" onClick={() => tourStep === tourSteps.length - 1 ? finishProductTour() : setTourStep((step) => step + 1)}>
                {tourStep === tourSteps.length - 1 ? "Got it" : "Next"} <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="sqlwhale-main-workspace" data-sqlwhale-tour="schema">
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
            <DatabaseCanvasSkeleton />
          ) : tablesError ? (
            <div className="output-error-state">
              <div className="output-error-icon">!</div>
              <h3>Schema unavailable</h3>
              <p>{tablesError}</p>
            </div>
          ) : (
            <DatabaseCanvas
              tables={tables}
              initialTableName="employees"
              activeSqlTarget={activeSqlTarget}
              executedQuery={executedQuery}
              queryAnimationStage={queryAnimationStage}
              queryTableTargets={queryTableTargets}
              queryRevealIndex={queryRevealIndex}
              queryRevealActive={queryRevealActive}
              queryAnalysis={data?.queryAnalysis ?? null}
              onEditTable={setEditTable}
              focusedTableName={replayFocusedTableName}
              destroyingTableName={destroyingTableName}
              destroyingStage={destroyingStage}
              destructiveReplay={isDropReplay}
              onTableDoubleClick={(tableName) => {
                setFocusedTableName(tableName);
                sqlEditorRef.current?.focusTable(tableName);
              }}
            />
          )}
        </section>

        <section
          className="sqlwhale-center-output"
          style={{ zIndex: 2 }}
          data-sql-output
          data-sqlwhale-tour="output"
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
            <QueryVisualization
              query={query}
              command={data?.command}
              running={loading || taskSubmitting}
              executed={Boolean(data)}
              result={result}
              execution={data?.execution}
              runId={animationRunId}
              slowExecution={slowExecution}
              onComplete={async () => {
                setAnimationComplete(true);
                if (slowExecution && /^\s*DROP\s+TABLE\b/i.test(query)) {
                  await refreshDatabaseTables();
                  setFocusedTableName(null);
                }
              }}
              onStageChange={setQueryAnimationStage}
              onExecutionFocus={setFocusedTableName}
              onDropStageChange={setDropDestructionStage}
            />

            {loading || taskSubmitting ? (
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
            ) : result && animationComplete ? (
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
                      {result.rows.map(
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
      <aside className="sqlwhale-builder-shell sqlwhale-query-side-panel" data-sqlwhale-tour="builder">
        <div className="sqlwhale-query-mode-switch">
          <button
            type="button"
            className={`sqlwhale-builder-toggle-button ${builderOpen ? "is-open" : ""}`}
            onClick={() => {
              setBuilderOpen((current) => !current);
              setTaskOpen(false);
            }}
            aria-expanded={builderOpen}
          >
            <span className="sqlwhale-builder-button-main">
              <span className="sqlwhale-query-mode-number">01</span>
              <span>
                <strong>Build the Query</strong>
                <small>{builderOpen ? "Visual SQL builder" : "Start from a visual query"}</small>
              </span>
            </span>
          </button>

          <button
            type="button"
            className={`sqlwhale-builder-toggle-button ${taskOpen ? "is-open" : ""}`}
            data-sqlwhale-tour="task"
            data-sqlwhale-task-toggle
            onClick={() => {
              setTaskOpen((current) => !current);
              setBuilderOpen(false);
            }}
            aria-expanded={taskOpen}
          >
            <span className="sqlwhale-builder-button-main">
              <span className="sqlwhale-query-mode-number">02</span>
              <span>
                <strong>Task</strong>
                <small>{taskOpen ? "SQL practice tasks" : "Solve an admin-created task"}</small>
              </span>
            </span>
          </button>
        </div>

        {!builderOpen && !taskOpen && (
          <div className="sqlwhale-query-side-placeholder">
            <div className="sqlwhale-query-side-placeholder-icon">01</div>
            <h3>Build Query</h3>
            <p>Build your SQL visually, or select a task to practice.</p>
          </div>
        )}

        {builderOpen && (
          <SQLQueryBuilder
            tables={tables}
            initialTableName="employees"
            onGenerate={(generatedSQL) => {
              setQuery(generatedSQL);
              setExecutedQuery(null);
              setAnimationComplete(false);
            }}
          />
        )}

        {taskOpen && (
          <TaskSection
            activeTaskId={activeTaskId}
            taskCheck={taskCheck}
            onStartTask={(task) => {
              setActiveTaskId(task.id);
              setTaskCheck(null);
              setQuery(`-- Task: ${task.title}
-- Write your SQL below.
`);
              setExecutedQuery(null);
              setAnimationComplete(false);
            }}
          />
        )}
      </aside>

      </section>

      <section
        className="sqlwhale-query-editor"
        data-sql-editor
        data-sqlwhale-tour="editor"
      >
        <SQLEditor
          ref={sqlEditorRef}
          initialQuery={query}
          loading={loading || taskSubmitting}
          darkMode={darkMode}
          onRun={handleRun}
          onClear={handleClear}
          onCursorTargetChange={setActiveSqlTarget}
          onQueryTableChange={handleQueryTableChange}
          onTableDoubleClick={setFocusedTableName}
          
          availableTables={tables.map((table) => table.name)}
        />
      </section>

      {editTable && (
        <EditTableCanvas
          table={editTable}
          onClose={() => setEditTable(null)}
          onRunSQL={runEditSQL}
          onTableChanged={refreshTables}
        />
      )}
    </main>
    </>
  );
}
