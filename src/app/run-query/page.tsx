"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";

import SQLEditor from "@/components/sql-editor/SQLEditor";
import SQLQueryBuilder from "@/components/query-builder/SQLQueryBuilder";
import DatabaseCanvas from "@/components/database/DatabaseCanvas";
import QueryVisualization from "@/components/visualization/QueryVisualization";
import EditTableCanvas from "@/components/database/EditTableCanvas";

import { getAllTableDetails } from "@/services/table.service";
import type { DatabaseTable } from "@/types/table";
import { useSQLQuery } from "@/hooks/useSQLQuery";
import { executeSQL } from "@/services/sql.service";

const DEFAULT_QUERY = "SELECT * FROM employees;";

const RUN_QUERY_LAYOUT_CSS = String.raw`
/* Run Query workspace layout — UI only.
   Keeps the existing query/database/editor functionality untouched. */
.sqlwhale-desktop-notice {
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(2, 6, 23, 0.72);
  backdrop-filter: blur(10px);
}

.sqlwhale-desktop-notice-card {
  width: min(440px, 100%);
  padding: 32px;
  border: 1px solid #dbe3ee;
  border-radius: 18px;
  background: #ffffff;
  box-shadow: 0 24px 80px rgba(15, 23, 42, 0.22);
  text-align: center;
}

.sqlwhale-desktop-notice-icon {
  width: 54px;
  height: 54px;
  margin: 0 auto 18px;
  display: grid;
  place-items: center;
  border-radius: 14px;
  background: #f1f5f9;
  font-size: 25px;
}

.sqlwhale-desktop-notice-card h2 {
  margin: 0 0 10px;
  color: #0f172a;
  font-size: 22px;
  line-height: 1.25;
}

.sqlwhale-desktop-notice-card p {
  margin: 0;
  color: #64748b;
  font-size: 14px;
  line-height: 1.65;
}

.sqlwhale-desktop-notice-close {
  width: 100%;
  margin-top: 22px;
  padding: 12px 16px;
  border: 0;
  border-radius: 10px;
  background: #0f172a;
  color: #ffffff;
  font-weight: 700;
  cursor: pointer;
}

.dark .sqlwhale-desktop-notice-card {
  border-color: #1e293b;
  background: #0f1720;
}

.dark .sqlwhale-desktop-notice-card h2 {
  color: #f8fafc;
}

.dark .sqlwhale-desktop-notice-card p {
  color: #94a3b8;
}

.dark .sqlwhale-desktop-notice-icon {
  background: #1e293b;
}

.dark .sqlwhale-desktop-notice-close {
  background: #f8fafc;
  color: #0f172a;
}

.sqlwhale-run-page {
  display: grid !important;
  grid-template-columns:
    minmax(0, 1.05fr)
    minmax(0, 1.60fr)
    minmax(270px, 0.95fr);
  grid-template-rows:
    auto
    minmax(0, 1fr)
    188px;
  column-gap: 20px;
  row-gap: 20px;
  width: 100%;
  height: 100vh !important;
  min-height: 0 !important;
  box-sizing: border-box;
  padding: 0 20px 20px;
  overflow: hidden !important;
  background: #f8fafc;
}

.sqlwhale-run-page > .sqlwhale-run-navbar {
  grid-column: 1 / -1;
  grid-row: 1;
  position: relative !important;
  top: auto;
  align-self: start;
}

.sqlwhale-run-page > .sqlwhale-main-workspace {
  grid-column: 1 / 3;
  grid-row: 2;
  display: grid !important;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.53fr);
  grid-template-rows: minmax(0, 1fr);
  gap: 20px;
  width: 100%;
  height: auto !important;
  min-height: 0 !important;
  margin: 0 !important;
  position: relative !important;
  overflow: hidden;
}

.sqlwhale-run-page .sqlwhale-schema-workspace {
  position: relative !important;
  inset: auto !important;
  grid-column: 1;
  grid-row: 1;
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  border: 1px solid #dbe3ee;
  border-radius: 12px;
  background:
    radial-gradient(circle at 50% 42%, rgba(37, 99, 235, 0.045), transparent 52%),
    #ffffff;
  box-shadow:
    0 8px 24px rgba(15, 23, 42, 0.045);
}

.sqlwhale-run-page .sqlwhale-schema-workspace::before {
  content: "DATABASES";
  position: absolute;
  top: 12px;
  left: 14px;
  z-index: 30;
  padding: 5px 8px;
  border: 1px solid rgba(37, 99, 235, 0.14);
  border-radius: 7px;
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(8px);
  color: #64748b;
  font: 800 9px/1 ui-monospace, SFMono-Regular, Menlo, monospace;
  letter-spacing: 0.12em;
  pointer-events: none;
}

.sqlwhale-run-page .sqlwhale-schema-workspace > .database-canvas,
.sqlwhale-run-page .sqlwhale-schema-workspace .react-flow {
  width: 100% !important;
  height: 100% !important;
}

.sqlwhale-run-page > .sqlwhale-main-workspace > .sqlwhale-center-output {
  grid-column: 2;
  grid-row: 1;
  position: relative !important;
  left: auto !important;
  top: auto !important;
  transform: none !important;
  width: auto !important;
  height: 100% !important;
  min-width: 0;
  min-height: 0;
  margin: 0;
  overflow: hidden;
  border: 1px solid #dbe3ee;
  border-radius: 12px;
  background: #ffffff;
  box-shadow:
    0 8px 24px rgba(15, 23, 42, 0.045);
}

.sqlwhale-run-page .sqlwhale-center-output .output-box-header {
  min-height: 58px;
  flex: 0 0 58px;
}

.sqlwhale-run-page .sqlwhale-center-output .output-box-content {
  min-height: 0;
  height: calc(100% - 58px);
}

.sqlwhale-run-page > .sqlwhale-builder-shell {
  grid-column: 3;
  grid-row: 2;
  width: 100% !important;
  height: 100% !important;
  min-width: 0;
  min-height: 0;
  margin: 0 !important;
  padding: 0 !important;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid #dbe3ee;
  border-radius: 12px;
  background: #ffffff;
  box-shadow:
    0 8px 24px rgba(15, 23, 42, 0.045);
}

.sqlwhale-run-page .sqlwhale-builder-toggle-button {
  width: 100%;
  min-width: 0;
  border: 0;
  margin: 0;
  color: #203250;
  background: transparent;
  cursor: pointer;
}

.sqlwhale-run-page .sqlwhale-builder-toggle-button:not(.is-open) {
  flex: 1 1 auto;
  min-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 22px;
}

.sqlwhale-run-page .sqlwhale-builder-toggle-button:not(.is-open):hover {
  background: rgba(37, 99, 235, 0.035);
}

.sqlwhale-run-page .sqlwhale-builder-toggle-button.is-open {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  min-height: 66px;
  padding: 10px 14px;
  border-bottom: 1px solid #e5ebf3;
  background: #fbfcfe;
}

.sqlwhale-run-page .sqlwhale-builder-toggle-button.is-open .sqlwhale-builder-button-main {
  width: 100%;
}

.sqlwhale-run-page .sqlwhale-builder-shell > .sqlwhale-query-builder {
  flex: 1 1 auto;
  min-height: 0;
  margin: 0 !important;
  overflow: auto;
  box-sizing: border-box;
}

.sqlwhale-run-page .sqlwhale-builder-shell .sqlwhale-builder-button-main {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.sqlwhale-run-page .sqlwhale-builder-shell .sqlwhale-builder-button-main > span:last-child {
  text-align: left;
}

.sqlwhale-run-page > .sqlwhale-query-editor {
  grid-column: 1 / -1;
  grid-row: 3;
  position: relative !important;
  left: auto !important;
  right: auto !important;
  bottom: auto !important;
  width: 100% !important;
  height: 100% !important;
  min-height: 0;
  margin: 0 !important;
  padding: 0 !important;
  overflow: hidden;
  box-sizing: border-box;
  border: 1px solid #dbe3ee;
  border-radius: 12px;
  background: #ffffff;
  box-shadow:
    0 8px 24px rgba(15, 23, 42, 0.045);
}

.sqlwhale-run-page .sqlwhale-query-editor .sql-editor-section {
  width: 100%;
  height: 100% !important;
  min-height: 0;
  margin: 0 !important;
  padding: 0 !important;
}

.sqlwhale-run-page .sqlwhale-query-editor .sql-editor-card {
  width: 100%;
  height: 100% !important;
  min-height: 0;
  border: 0;
  border-radius: 0;
  box-shadow: none;
}

.sqlwhale-run-page .sqlwhale-query-editor .sql-editor-container {
  min-height: 0;
}

.sqlwhale-run-page .sqlwhale-query-editor .sql-editor-footer {
  flex: 0 0 34px;
}

.dark .sqlwhale-run-page {
  background: #07111f;
}

.dark .sqlwhale-run-page .sqlwhale-schema-workspace,
.dark .sqlwhale-run-page > .sqlwhale-builder-shell {
  border-color: #1e293b;
  background:
    radial-gradient(circle at 50% 42%, rgba(37, 99, 235, 0.07), transparent 52%),
    #0a0f14;
  box-shadow:
    0 14px 38px rgba(0, 0, 0, 0.24);
}

.dark .sqlwhale-run-page .sqlwhale-schema-workspace::before {
  border-color: rgba(96, 165, 250, 0.18);
  background: rgba(10, 15, 20, 0.88);
  color: #94a3b8;
}

.dark .sqlwhale-run-page > .sqlwhale-query-editor {
  border-color: #1e293b;
  background: #0a0f14;
  box-shadow:
    0 14px 38px rgba(0, 0, 0, 0.24);
}

.dark .sqlwhale-run-page .sqlwhale-builder-toggle-button {
  color: #e2e8f0;
}

.dark .sqlwhale-run-page .sqlwhale-builder-toggle-button.is-open {
  border-bottom-color: #1e293b;
  background: #0d141c;
}

.dark .sqlwhale-run-page .sqlwhale-builder-toggle-button:not(.is-open):hover {
  background: rgba(96, 165, 250, 0.06);
}


/* Final alignment pass:
   keep the three upper panels identical in height and contain
   the visual query builder inside its right-hand panel. */
.sqlwhale-run-page > .sqlwhale-main-workspace,
.sqlwhale-run-page > .sqlwhale-builder-shell {
  align-self: stretch;
  min-height: 0 !important;
  box-sizing: border-box;
}

.sqlwhale-run-page > .sqlwhale-main-workspace {
  overflow: hidden !important;
}

.sqlwhale-run-page > .sqlwhale-main-workspace > .sqlwhale-schema-workspace,
.sqlwhale-run-page > .sqlwhale-main-workspace > .sqlwhale-center-output,
.sqlwhale-run-page > .sqlwhale-builder-shell {
  height: 100% !important;
  max-height: 100%;
  box-sizing: border-box;
}

.sqlwhale-run-page > .sqlwhale-builder-shell {
  position: relative !important;
  inset: auto !important;
  align-self: stretch;
  overflow: hidden !important;
  container-type: inline-size;
}

.sqlwhale-run-page > .sqlwhale-builder-shell > .sqlwhale-query-builder {
  position: relative !important;
  inset: auto !important;
  width: 100% !important;
  max-width: 100% !important;
  min-width: 0 !important;
  min-height: 0 !important;
  max-height: 100% !important;
  flex: 1 1 auto;
  overflow-x: hidden !important;
  overflow-y: auto !important;
  box-sizing: border-box;
  border-radius: 0;
}

.sqlwhale-run-page > .sqlwhale-builder-shell .sqlwhale-builder-header,
.sqlwhale-run-page > .sqlwhale-builder-shell .sqlwhale-builder-flow,
.sqlwhale-run-page > .sqlwhale-builder-shell .sqlwhale-builder-generate {
  max-width: 100%;
  box-sizing: border-box;
}

.sqlwhale-run-page > .sqlwhale-builder-shell .sqlwhale-builder-flow {
  min-width: 0;
}

.sqlwhale-run-page > .sqlwhale-builder-shell .sqlwhale-builder-block {
  min-width: 0;
  max-width: 100%;
  box-sizing: border-box;
}

.sqlwhale-run-page > .sqlwhale-builder-shell select,
.sqlwhale-run-page > .sqlwhale-builder-shell input,
.sqlwhale-run-page > .sqlwhale-builder-shell button {
  max-width: 100%;
  box-sizing: border-box;
}

@container (max-width: 500px) {
  .sqlwhale-run-page > .sqlwhale-builder-shell .sqlwhale-builder-flow {
    grid-template-columns: minmax(0, 1fr);
    gap: 8px;
    align-items: stretch;
  }

  .sqlwhale-run-page > .sqlwhale-builder-shell .sqlwhale-builder-arrow {
    min-height: 18px;
    transform: rotate(90deg);
  }

  .sqlwhale-run-page > .sqlwhale-builder-shell .sqlwhale-builder-generate {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }

  .sqlwhale-run-page > .sqlwhale-builder-shell .sqlwhale-builder-generate button {
    width: 100%;
  }
}

@media (max-width: 900px) {
  .sqlwhale-run-page {
    display: block !important;
    height: auto !important;
    min-height: 100vh !important;
    overflow-x: hidden !important;
    overflow-y: auto !important;
    padding: 0 12px 16px;
  }

  .sqlwhale-run-page > .sqlwhale-run-navbar {
    width: calc(100% + 24px);
    margin-left: -12px;
  }

  .sqlwhale-run-page > .sqlwhale-main-workspace {
    display: grid !important;
    grid-template-columns: 1fr;
    grid-template-rows: 440px 440px;
    gap: 12px;
    height: auto !important;
    margin: 12px 0 0 !important;
    overflow: visible;
  }

  .sqlwhale-run-page .sqlwhale-schema-workspace,
  .sqlwhale-run-page > .sqlwhale-main-workspace > .sqlwhale-center-output {
    grid-column: 1;
  }

  .sqlwhale-run-page .sqlwhale-schema-workspace {
    grid-row: 1;
    height: 440px;
  }

  .sqlwhale-run-page > .sqlwhale-main-workspace > .sqlwhale-center-output {
    grid-row: 2;
    height: 440px !important;
  }

  .sqlwhale-run-page > .sqlwhale-builder-shell {
    width: 100% !important;
    height: auto !important;
    min-height: 440px;
    margin: 12px 0 0 !important;
  }

  .sqlwhale-run-page > .sqlwhale-query-editor {
    height: 360px !important;
    margin: 12px 0 0 !important;
  }

  .sqlwhale-run-page .sqlwhale-builder-toggle-button:not(.is-open) {
    min-height: 440px;
  }
}

@media (max-width: 700px) {
  .sqlwhale-run-page {
    padding: 0 10px 12px;
  }

  .sqlwhale-run-page > .sqlwhale-run-navbar {
    width: calc(100% + 20px);
    margin-left: -10px;
  }

  .sqlwhale-run-page > .sqlwhale-main-workspace {
    grid-template-rows: 380px 420px;
  }

  .sqlwhale-run-page .sqlwhale-schema-workspace {
    height: 380px;
  }

  .sqlwhale-run-page > .sqlwhale-main-workspace > .sqlwhale-center-output {
    height: 420px !important;
  }

  .sqlwhale-run-page > .sqlwhale-builder-shell {
    min-height: 380px;
  }

  .sqlwhale-run-page .sqlwhale-builder-toggle-button:not(.is-open) {
    min-height: 380px;
    padding: 18px;
  }

  .sqlwhale-run-page > .sqlwhale-query-editor {
    height: 380px !important;
  }
}
`;

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
  const [animationRunId, setAnimationRunId] = useState(0);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [executedQuery, setExecutedQuery] = useState<string | null>(null);
  const [queryAnimationStage, setQueryAnimationStage] = useState<string | null>(null);
  const [builderOpen, setBuilderOpen] = useState(false);
  const [showProductTour, setShowProductTour] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [tourRect, setTourRect] = useState<DOMRect | null>(null);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [showDesktopNotice, setShowDesktopNotice] = useState(false);

  const tourSteps = [
    { target: "schema", title: "Database Canvas", text: "This is your database. See tables, columns, and how they are connected." },
    { target: "output", title: "Query Output", text: "After you run SQL, the result appears here along with the visual execution flow." },
    { target: "builder", title: "Visual Query Builder", text: "Build a query visually when you don't want to write all the SQL yourself." },
    { target: "editor", title: "SQL Editor", text: "Write and edit your SQL here. This is where you practice the actual query." },
  ];

  useEffect(() => {
    if (localStorage.getItem("sqlwhale-product-tour-seen") !== "true") setShowProductTour(true);
  }, []);

  useEffect(() => {
    const detectMobileDevice = () => {
      const userAgent = navigator.userAgent || "";
      const isMobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(userAgent);
      const isSmallTouchDevice = window.matchMedia("(max-width: 768px) and (pointer: coarse)").matches;
      const mobile = isMobileUserAgent || isSmallTouchDevice;
      setIsMobileDevice(mobile);
      setShowDesktopNotice(mobile);
    };

    detectMobileDevice();
    window.addEventListener("resize", detectMobileDevice);
    return () => window.removeEventListener("resize", detectMobileDevice);
  }, []);

  useEffect(() => {
    if (!showProductTour) return;
    const target = document.querySelector<HTMLElement>(`[data-sqlwhale-tour="${tourSteps[tourStep].target}"]`);
    if (!target) return;

    // Keep the canvas and builder from visually colliding while the tour
    // explains a specific area of the workspace.
    const isCanvasStep = tourSteps[tourStep].target === "schema";
    const isBuilderStep = tourSteps[tourStep].target === "builder";

    // The builder stays collapsed during normal use. The tour is the only
    // automatic moment when it opens without the user clicking it.
    setBuilderOpen(isBuilderStep);

    document.body.classList.toggle(
      "sqlwhale-tour-active",
      isCanvasStep
    );

    target.scrollIntoView({ behavior: "smooth", block: "center" });
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
  const [editTable, setEditTable] = useState<DatabaseTable | null>(null);

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
    localStorage.setItem("sqlwhale-product-tour-seen", "true");
    setTourRect(null);
  };

  const handleRun = async (sql: string) => {
    const cleanSQL = sql.trim();

    setQuery(cleanSQL);
    setExecutedQuery(null);
    setAnimationComplete(false);
    setAnimationRunId((current) => current + 1);

    await runQuery(cleanSQL);
  };

  useEffect(() => {
    if (data?.success) setExecutedQuery(query);
  }, [data, query]);

  const handleClear = () => {
    setQuery("");
    setExecutedQuery(null);
    setQueryAnimationStage(null);
    setAnimationComplete(false);
    clearResult();
  };

  const result = data?.result;

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
      <style>{RUN_QUERY_LAYOUT_CSS}</style>
      {isMobileDevice && showDesktopNotice && (
        <div className="sqlwhale-desktop-notice" role="dialog" aria-modal="true" aria-labelledby="sqlwhale-desktop-notice-title">
          <div className="sqlwhale-desktop-notice-card">
            <div className="sqlwhale-desktop-notice-icon" aria-hidden="true">🖥️</div>
            <h2 id="sqlwhale-desktop-notice-title">SQLWhale works better on desktop</h2>
            <p>
              For the best experience with the SQL editor, database canvas, and query visualization, we recommend using SQLWhale on a laptop or desktop.
            </p>
            <button
              type="button"
              className="sqlwhale-desktop-notice-close"
              onClick={() => setShowDesktopNotice(false)}
            >
              Continue on mobile
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
          <div className="sqlwhale-tour-card" style={{ top: tourRect.bottom + 18, left: Math.min(Math.max(16, tourRect.left), window.innerWidth - 336) }}>
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
            <DatabaseCanvas
              tables={tables}
              initialTableName="employees"
              activeSqlTarget={activeSqlTarget}
              executedQuery={executedQuery}
              queryAnimationStage={queryAnimationStage}
              queryTableTargets={queryTableTargets}
              queryAnalysis={data?.queryAnalysis ?? null}
              onEditTable={setEditTable}
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
              running={loading}
              executed={Boolean(data)}
              result={result}
              execution={data?.execution}
              runId={animationRunId}
              onComplete={() => setAnimationComplete(true)}
              onStageChange={setQueryAnimationStage}
            />

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
      </section>

      <section className="sqlwhale-builder-shell" data-sqlwhale-tour="builder">
        <button
          type="button"
          className={`sqlwhale-builder-toggle-button ${builderOpen ? "is-open" : ""}`}
          onClick={() => setBuilderOpen((current) => !current)}
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
      </section>

      <section
        className="sqlwhale-query-editor"
        data-sql-editor
        data-sqlwhale-tour="editor"
      >
        <SQLEditor
          initialQuery={query}
          loading={loading}
          darkMode={darkMode}
          onRun={handleRun}
          onClear={handleClear}
          onCursorTargetChange={setActiveSqlTarget}
          onQueryTableChange={setQueryTableTargets}
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
