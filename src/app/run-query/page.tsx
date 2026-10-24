"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { WifiOff, X, Home, UserRound, MessageSquare, Sun, Moon, Database, LoaderCircle, CirclePlay, ArrowRight, Wrench, ListTodo, Diamond, Plus, BookOpen } from "lucide-react";

import SQLEditor, { type SQLEditorHandle } from "@/components/sql-editor/SQLEditor";
import SQLQueryBuilder from "@/components/query-builder/SQLQueryBuilder";
import TaskSection from "@/components/tasks/TaskSection";
import DatabaseCanvas from "@/components/database/DatabaseCanvas";
import DatabaseCanvasSkeleton from "@/components/database/DatabaseCanvasSkeleton";
import AppleEmoji from "@/components/AppleEmoji";
import QueryVisualization from "@/components/visualization/QueryVisualization";
import EditTableCanvas from "@/components/database/EditTableCanvas";
import { Skeleton, SkeletonCard } from "@/components/ui/skeleton";

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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const prefilled = params.get("query") ?? params.get("sql");
    if (prefilled && prefilled.trim()) {
      setQuery(prefilled);
      setExecutedQuery(null);
      setAnimationComplete(false);
    }
  }, []);
  const sqlEditorRef = useRef<SQLEditorHandle>(null);
  const [tables, setTables] = useState<DatabaseTable[]>([]);
  const [tablesLoading, setTablesLoading] = useState(true);
  const [schemaRetrying, setSchemaRetrying] = useState(false);
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
  const [setupTaskSuccessMessage, setSetupTaskSuccessMessage] = useState<string | null>(null);
  const [showProductTour, setShowProductTour] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [tourRect, setTourRect] = useState<DOMRect | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [offlineAlertDismissed, setOfflineAlertDismissed] = useState(false);

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
    let mounted = true;
    let wasOffline = false;

    const markOffline = () => {
      if (!mounted) return;
      wasOffline = true;
      setIsOnline(false);
      setOfflineAlertDismissed(false);
    };

    const markOnline = () => {
      if (!mounted) return;
      if (wasOffline) setOfflineAlertDismissed(false);
      wasOffline = false;
      setIsOnline(true);
    };

    const checkConnection = async () => {
      if (!navigator.onLine) {
        markOffline();
        return;
      }

      // navigator.onLine can stay true when Wi-Fi is connected but internet
      // access is unavailable. A fresh same-origin request checks real reachability.
      try {
        const response = await fetch(`/?connection-check=${Date.now()}`, {
          method: "GET",
          cache: "no-store",
          headers: { "Cache-Control": "no-cache" },
        });
        if (response.ok) markOnline();
        else markOffline();
      } catch {
        markOffline();
      }
    };

    const handleOffline = () => markOffline();
    const handleOnline = () => { void checkConnection(); };

    void checkConnection();
    const intervalId = window.setInterval(() => { void checkConnection(); }, 5000);
    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);
    window.addEventListener("focus", handleOnline);

    return () => {
      mounted = false;
      window.clearInterval(intervalId);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("focus", handleOnline);
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

  const handleCanvasTableDoubleClick = useCallback((tableName: string) => {
    setFocusedTableName(tableName);
    sqlEditorRef.current?.focusTable(tableName);
  }, []);

  const [queryRevealIndex, setQueryRevealIndex] = useState<number | null>(null);
  const [queryRevealActive, setQueryRevealActive] = useState(false);
  const [editTable, setEditTable] = useState<DatabaseTable | null>(null);

  const refreshDatabaseTables = useCallback(async () => {
    setSchemaRetrying(true);
    setTablesLoading(true);
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
    } finally {
      setTablesLoading(false);
      setSchemaRetrying(false);
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
  const [activeMobileView, setActiveMobileView] = useState<"schema" | "editor" | "results" | "learn">("schema");
  const [feedbackUser, setFeedbackUser] = useState<any>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<any>(null);
  const [subscriptionDialogOpen, setSubscriptionDialogOpen] = useState(false);

  const [darkMode, setDarkMode] =
    useState(false);

  useEffect(() => {
    const updateMobileLayout = () => {
      const touchDevice = navigator.maxTouchPoints > 0 || "ontouchstart" in window;
      const screenW = Math.min(window.screen.width, window.screen.height);
      // Android browsers can report a desktop-sized CSS viewport when
      // "Desktop site" is enabled. Detect the physical/touch device as well
      // so the mobile composition still applies in that mode.
      // Touch-enabled desktop browsers (including Chrome on some Windows
      // devices) must keep the desktop three-column workspace. Force the
      // mobile composition only when the actual viewport is narrow.
      const mobileLayout = touchDevice && window.innerWidth <= 900;

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
    api.get("/subscription/status")
      .then((response) => {
        if (active) setSubscriptionStatus(response.data || null);
      })
      .catch(() => {
        if (active) setSubscriptionStatus(null);
      });
    return () => { active = false; };
  }, []);

  const isSubscribed = Boolean(
    subscriptionStatus?.subscribed ||
    (subscriptionStatus?.currentPlan && subscriptionStatus.currentPlan !== "Starter" && subscriptionStatus.currentPlan !== "Free")
  );

  const handleSubscriptionBadgeClick = () => {
    if (!isSubscribed) {
      window.location.href = "/subscribe";
      return;
    }
    setSubscriptionDialogOpen(true);
  };

  const subscriptionExpiry = subscriptionStatus?.currentPeriodEnd
    ? new Date(subscriptionStatus.currentPeriodEnd).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

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
    setSetupTaskSuccessMessage(null);
    setExecutedQuery(null);
    setAnimationComplete(false);
    setDropDestructionStage(0);
    setAnimationRunId((current) => current + 1);
    setSlowExecution(showWhatHappened);

    if (activeTaskId) {
      setTaskSubmitting(true);
      try {
        const check = await api.post(`/tasks/${activeTaskId}/check`, { query: cleanSQL });

        const correct = Boolean(check.data?.correct);
        const isSetupTask = check.data?.taskType === "setup";
        setSetupTaskSuccessMessage(isSetupTask && correct ? (check.data?.message || "Task completed: the resulting table structure and records match the expected output.") : null);
        if (isSetupTask && correct) {
          await refreshDatabaseTables();
        }

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

  const handleEditorRun = async (sql: string, showWhatHappened = false) => {
    // On mobile, show the database canvas first so learners can see the
    // referenced tables highlighted before moving to the query results.
    const isMobile = typeof window !== "undefined" && window.innerWidth <= 800;
    const referencesTable =
      /\b(?:FROM|JOIN)\s+[\w"`]+/i.test(sql) ||
      /^\s*CREATE\s+TABLE\b/i.test(sql);

    if (isMobile && referencesTable) {
      setActiveMobileView("schema");
      await handleRun(sql, showWhatHappened);

      // Let the canvas table-reveal animation finish before opening Results.
      const tableReferences = [...sql.matchAll(/\b(?:FROM|JOIN)\s+[\w"`]+/gi)].length;
      const canvasPreviewMs = tableReferences > 0
        ? 820 + tableReferences * 650
        : 900;
      await new Promise((resolve) => window.setTimeout(resolve, canvasPreviewMs));
      setActiveMobileView("results");
      return;
    }

    if (isMobile) {
      setActiveMobileView("results");
    }
    await handleRun(sql, showWhatHappened);
  };

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
      <main className="sqlwhale-run-page" data-mobile-view={activeMobileView}>
      <header className="sqlwhale-run-navbar">
        <div className="sqlwhale-run-navbar-inner">
          <Link
            href="/"
            className="sqlwhale-run-logo"
            aria-label="SQLWhale Home"
            onClick={() => setMobileMenuOpen(false)}
          >
            <Image
              src="/sqlwhale-logo-main.png"
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
                {darkMode ? <Moon size={17} strokeWidth={1.9} /> : <Sun size={17} strokeWidth={1.9} />}
              </span>
            </button>

            <nav
              className="sqlwhale-run-nav"
              aria-label="Primary navigation"
            >
              <Link href="/" className="run-nav-link">
                <Home className="run-nav-icon" size={16} strokeWidth={1.8} aria-hidden="true" />
                Home
              </Link>

              <Link href="/account" className="run-nav-link">
                <UserRound className="run-nav-icon" size={16} strokeWidth={1.8} aria-hidden="true" />
                Profile
              </Link>

              <Link href="/learn" className="run-nav-link">
                <BookOpen className="run-nav-icon" size={16} strokeWidth={1.8} aria-hidden="true" />
                Learn
              </Link>

              <button
                type="button"
                className="run-nav-link run-feedback-button"
                onClick={() => window.dispatchEvent(new Event("sqlwhale:open-feedback"))}
              >
                <MessageSquare className="run-nav-icon" size={16} strokeWidth={1.8} aria-hidden="true" />
                Feedback
              </button>

              <button
                type="button"
                className={`sqlwhale-run-diamond-badge run-nav-subscription-badge ${isSubscribed ? "is-subscribed" : "needs-subscription"}`}
                aria-label={isSubscribed ? "View subscription details" : "View pricing"}
                title={isSubscribed ? "Subscription details" : "Pricing"}
                onClick={handleSubscriptionBadgeClick}
              >
                {!isSubscribed && <Plus className="subscription-badge-plus" size={9} strokeWidth={2.8} aria-hidden="true" />}
                <i className="ri-vip-diamond-fill" aria-hidden="true" />
                <span className="run-subscription-label">{isSubscribed ? "Premium" : "Pricing"}</span>
              </button>
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
              href="/"
              className="run-mobile-nav-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Home size={18} strokeWidth={1.8} aria-hidden="true" />
              <span>Home</span>
              <ArrowRight className="run-mobile-arrow-icon" size={16} aria-hidden="true" />
            </Link>

            <Link
              href="/account"
              className="run-mobile-nav-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              <UserRound size={18} strokeWidth={1.8} aria-hidden="true" />
              <span>Profile</span>
              <span className="run-mobile-arrow">→</span>
            </Link>

            <Link
              href="/learn"
              className="run-mobile-nav-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              <BookOpen size={18} strokeWidth={1.8} aria-hidden="true" />
              <span>Learn</span>
              <span className="run-mobile-arrow">→</span>
            </Link>

            {isSubscribed ? (
              <button
                type="button"
                className="run-mobile-nav-link"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setSubscriptionDialogOpen(true);
                }}
              >
                <Diamond size={18} strokeWidth={1.8} aria-hidden="true" />
                <span>Premium</span>
                <span className="run-mobile-arrow">→</span>
              </button>
            ) : (
              <Link
                href="/subscribe"
                className="run-mobile-nav-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Diamond size={18} strokeWidth={1.8} aria-hidden="true" />
                <span>Pricing</span>
                <span className="run-mobile-arrow">→</span>
              </Link>
            )}

            <button
              type="button"
              className="run-mobile-nav-link run-mobile-feedback-button"
              onClick={() => {
                setMobileMenuOpen(false);
                window.dispatchEvent(new Event("sqlwhale:open-feedback"));
              }}
            >
              <MessageSquare size={18} strokeWidth={1.8} aria-hidden="true" />
              <span>Feedback</span>
              <span className="run-mobile-arrow">→</span>
            </button>
          </nav>

          <div className="run-mobile-status">
            <span className="run-status-dot" />
            SQL VISUALIZATION ENVIRONMENT
          </div>
        </div>
      </header>

      {subscriptionDialogOpen && (
        <div className="sqlwhale-subscription-overlay" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setSubscriptionDialogOpen(false);
        }}>
          <section className="sqlwhale-subscription-dialog" role="dialog" aria-modal="true" aria-labelledby="sqlwhale-subscription-title">
            <button type="button" className="sqlwhale-subscription-close" onClick={() => setSubscriptionDialogOpen(false)} aria-label="Close subscription details">
              <X size={17} />
            </button>
            <span className="sqlwhale-subscription-icon"><Diamond size={18} fill="white" color="white" /></span>
            <p className="sqlwhale-subscription-eyebrow">YOUR SUBSCRIPTION</p>
            <h2 id="sqlwhale-subscription-title">{subscriptionStatus?.currentPlan || "SQLWhale Premium"}</h2>
            <p className="sqlwhale-subscription-status">
              <span className="sqlwhale-subscription-status-dot" />
              {subscriptionStatus?.subscriptionStatus || "Active"}
            </p>
            <div className="sqlwhale-subscription-detail">
              <span>Access valid until</span>
              <strong>{subscriptionExpiry || "Expiry date not available"}</strong>
            </div>
            {subscriptionStatus?.cancelAtCycleEnd && <p className="sqlwhale-subscription-note">Your subscription is set to end on the date shown above.</p>}
            {subscriptionStatus?.activationPending && <p className="sqlwhale-subscription-note">Your subscription activation is still being confirmed.</p>}
            <button type="button" className="sqlwhale-subscription-done" onClick={() => setSubscriptionDialogOpen(false)}>Done</button>
            <Link href="/account" className="sqlwhale-subscription-account" onClick={() => setSubscriptionDialogOpen(false)}>Manage account <ArrowRight size={13} /></Link>
          </section>
        </div>
      )}

      {!isOnline && !offlineAlertDismissed && (
        <div className="sqlwhale-offline-alert-wrap" aria-live="assertive" aria-atomic="true">
          <div className="sqlwhale-offline-alert" role="alert">
            <span className="sqlwhale-offline-alert-icon" aria-hidden="true"><WifiOff size={21} strokeWidth={2.2} /></span>
            <div className="sqlwhale-offline-alert-content">
              <strong>No internet connection</strong>
              <p>Your connection was interrupted. Reconnect to continue using SQLWhale.</p>
            </div>
            <button type="button" className="sqlwhale-offline-alert-close" onClick={() => setOfflineAlertDismissed(true)} aria-label="Dismiss offline notification">
              <X size={18} />
            </button>
          </div>
        </div>
      )}

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
            ...(tablesLoading ? { backgroundColor: darkMode ? "#222222" : "#ffffff" } : {}),
          }}
        >
          {tablesLoading ? (
            <div className="sqlwhale-schema-loading" aria-live="polite" style={{ backgroundColor: darkMode ? "#222222" : "#ffffff" }}>
              <p className="sqlwhale-schema-shimmer">{schemaRetrying ? "Retrying…" : "holy crap fetching schema please wait.."}</p>

            </div>
          ) : tablesError ? (
            <div className="output-error-state">
              <div className="output-error-icon"><X size={19} strokeWidth={2.2} /></div>
              <h3>Schema unavailable</h3>
              <p>{tablesError}</p>
              <button type="button" className="sqlwhale-schema-retry" onClick={() => void refreshDatabaseTables()}>
                <LoaderCircle size={17} aria-hidden="true" /> Retry loading schema
              </button>
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
              onTableDoubleClick={handleCanvasTableDoubleClick}
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
              <Database className="output-box-symbol-icon" size={17} strokeWidth={1.8} aria-hidden="true" />
              <strong>Query Output</strong>
            </div>

            <span className="output-box-subtitle">
              SQL result
            </span>
          </div>

          <div className="output-box-content">
            {!(loading || taskSubmitting) && (
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
            )}

            {loading || taskSubmitting ? (
              <div className="output-empty sqlwhale-output-skeleton" aria-live="polite">
                <div className="output-empty-icon"><LoaderCircle size={25} strokeWidth={1.8} className="run-query-spinner" /></div>
                <h3>Executing query...</h3>
                <p>SQLWhale is tracing the query execution.</p>
                <div className="sqlwhale-skeleton-layout" aria-hidden="true">
                  <SkeletonCard />
                  <div className="sqlwhale-skeleton-lines">
                    <Skeleton className="h-3 w-4/5" />
                    <Skeleton className="h-3 w-3/5" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                </div>
              </div>
            ) : setupTaskSuccessMessage ? (
              <div className="output-empty">
                <div className="output-empty-icon" style={{ color: "#16a34a" }}>✓</div>
                <h3>Task completed</h3>
                <p>{setupTaskSuccessMessage}</p>
                <p>The database schema and records now match the expected task output.</p>
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
            ) : tablesLoading ? (
              <div className="sqlwhale-initial-output-skeleton" aria-label="Loading query output" aria-busy="true">
                <div className="sqlwhale-skeleton-heading" />
                <div className="sqlwhale-skeleton-table">
                  <div className="sqlwhale-skeleton-table-head" />
                  <div className="sqlwhale-skeleton-table-row" />
                  <div className="sqlwhale-skeleton-table-row" />
                  <div className="sqlwhale-skeleton-table-row" />
                  <div className="sqlwhale-skeleton-table-row" />
                </div>
                <div className="sqlwhale-skeleton-caption" />
              </div>
            ) : (
              <div className="output-empty">
                <div className="output-empty-icon"><CirclePlay size={25} strokeWidth={1.7} /></div>
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
              <span className="sqlwhale-query-mode-number"><Wrench size={16} strokeWidth={1.8} aria-hidden="true" /></span>
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
              <span className="sqlwhale-query-mode-number"><ListTodo size={16} strokeWidth={1.8} aria-hidden="true" /></span>
              <span>
                <strong>Task</strong>
                <small>{taskOpen ? "SQL practice tasks" : "Solve an admin-created task"}</small>
              </span>
            </span>
          </button>
        </div>

        {!builderOpen && !taskOpen && (
          tablesLoading ? (
            <div className="sqlwhale-side-skeleton" aria-label="Loading query tools" aria-busy="true">
              <div className="sqlwhale-skeleton-heading" />
              <div className="sqlwhale-skeleton-caption" />
              <div className="sqlwhale-skeleton-caption short" />
              <div className="sqlwhale-skeleton-action" />
            </div>
          ) : (
            <div className="sqlwhale-query-side-placeholder">
              <div className="sqlwhale-query-side-placeholder-icon"><Wrench size={21} strokeWidth={1.7} /></div>
              <h3>Build Query</h3>
              <p>Build your SQL visually, or select a task to practice.</p>
            </div>
          )
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
          onRun={handleEditorRun}
          onClear={handleClear}
          onCursorTargetChange={setActiveSqlTarget}
          onQueryTableChange={handleQueryTableChange}
          onTableDoubleClick={setFocusedTableName}
          
          availableTables={tables.map((table) => table.name)}
        />
      </section>

      <nav className="sqlwhale-mobile-workflow-nav" aria-label="SQL learning workspace">
        <button type="button" className={activeMobileView === "schema" ? "is-active" : ""} aria-current={activeMobileView === "schema" ? "page" : undefined} onClick={() => setActiveMobileView("schema")}>
          <Database size={19} aria-hidden="true" /><span>Schema</span>
        </button>
        <button type="button" className={activeMobileView === "editor" ? "is-active" : ""} aria-current={activeMobileView === "editor" ? "page" : undefined} onClick={() => setActiveMobileView("editor")}>
          <span className="sqlwhale-mobile-code-icon" aria-hidden="true">&lt;/&gt;</span><span>Write SQL</span>
        </button>
        <button type="button" className={activeMobileView === "results" ? "is-active" : ""} aria-current={activeMobileView === "results" ? "page" : undefined} onClick={() => setActiveMobileView("results")}>
          <CirclePlay size={19} aria-hidden="true" /><span>Results</span>
        </button>
        <button type="button" className={activeMobileView === "learn" ? "is-active" : ""} aria-current={activeMobileView === "learn" ? "page" : undefined} onClick={() => setActiveMobileView("learn")}>
          <ListTodo size={19} aria-hidden="true" /><span>Learn</span>
        </button>
      </nav>

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
