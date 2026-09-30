"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api, authApi } from "@/services/api";

type User = {
  id: number;
  localUserId: string;
  name: string;
  email: string;
  role: string;
  currentPlan: string;
};

type QueryHistoryItem = {
  id: number;
  query: string;
  command: string | null;
  status: "success" | "error";
  executionTimeMs: number;
  rowsReturned: number;
  errorMessage: string | null;
  createdAt: string;
};

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [history, setHistory] = useState<QueryHistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [dashboard, setDashboard] = useState<{
    totalQueries: number;
    successfulQueries: number;
    failedQueries: number;
    successRate: number;
    averageExecutionTimeMs: number;
    totalRowsReturned: number;
    completedConcepts: number;
    totalConcepts: number;
    progressPercent: number;
    lastActivity: string | null;
    learningStreak: number;
  } | null>(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadAccount() {
      try {
        const response = await authApi.get("/auth/me");

        if (!response.data?.authenticated) {
          if (mounted) {
            setHistoryLoading(false);
            setDashboardLoading(false);
            router.replace("/login");
          }
          return;
        }

        if (!mounted) return;
        setUser(response.data.user);

        try {
          const [historyResponse, dashboardResponse] = await Promise.all([
            authApi.get("/auth/query-history?limit=50"),
            authApi.get("/auth/learning-dashboard"),
          ]);
          if (mounted) {
            setHistory(historyResponse.data?.history || []);
            setDashboard(dashboardResponse.data?.stats || null);
          }
        } catch (historyError) {
          console.error("Unable to load account activity:", historyError);
        } finally {
          if (mounted) {
            setHistoryLoading(false);
            setDashboardLoading(false);
          }
        }
      } catch {
        if (mounted) {
          setHistoryLoading(false);
          setDashboardLoading(false);
          router.replace("/login");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadAccount();

    return () => {
      mounted = false;
    };
  }, [router]);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await authApi.post("/auth/logout");
    } finally {
      router.replace("/");
      router.refresh();
    }
  }

  if (loading) {
    return (
      <main className="account-page">
        <div className="account-loading">
          <span className="account-loading-dot" />
          Loading your SQLWhale account...
        </div>
      </main>
    );
  }

  if (!user) return null;

  function formatDate(value: string) {
    const date = new Date(value + (value.endsWith("Z") ? "" : "Z"));
    return date.toLocaleString([], {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <main className="account-page">
      <div className="account-page-grid" aria-hidden="true" />
      <div className="account-orb account-orb-one" aria-hidden="true" />
      <div className="account-orb account-orb-two" aria-hidden="true" />

      <header className="account-topbar">
        <Link href="/" className="account-brand">
          <Image
            src="/assets/sqlwhale-logo.png"
            alt="SQLWhale"
            width={44}
            height={44}
            priority
          />
          <span><strong>SQL</strong>Whale</span>
        </Link>
        <Link href="/" className="account-back">← Back to SQLWhale</Link>
      </header>

      <section className="account-shell">
        <div className="account-heading">
          <div className="account-eyebrow"><span /> YOUR SQLWHALE ACCOUNT</div>
          <h1>Welcome, <em>{user.name}</em>.</h1>
          <p>Your separate SQLWhale account is ready.</p>
        </div>

        <div className="account-layout">
          <section className="account-card account-profile-card">
            <div className="account-card-header">
              <span className="account-card-label">PROFILE</span>
              <span className="account-connected"><i /> Connected</span>
            </div>

            <div className="account-avatar">
              {(user.name || "U").trim().charAt(0).toUpperCase()}
            </div>

            <h2>{user.name}</h2>
            <p className="account-email">{user.email}</p>

            <div className="account-details">
              <div>
                <span>ACCOUNT TYPE</span>
                <strong>{user.role || "User"}</strong>
              </div>
              <div>
                <span>SQLWHALE PLAN</span>
                <strong>{user.currentPlan || "Starter"}</strong>
              </div>
            </div>
          </section>

          <section className="account-card account-central-card">
            <div className="account-card-header">
              <span className="account-card-label">SQLWHALE ACCOUNT</span>
            </div>

            <div className="central-identity-mark sqlwhale-account-mark">SQL</div><h2>Independent SQLWhale Account</h2><p>Your SQLWhale login, session, learning progress and query history are stored independently from WEBXWHALE.</p><div className="identity-status sqlwhale-account-status"><span className="identity-status-dot" /><div><strong>SQLWhale account active</strong><span>Standalone authentication is active</span></div></div>
          </section>
        </div>

        <section className="account-dashboard-section">
          <div className="account-history-header">
            <div>
              <span className="account-card-label">LEARNING DASHBOARD</span>
              <h2>Your SQLWhale progress</h2>
            </div>
            {dashboard && (
              <span className="account-history-count">
                {dashboard.progressPercent}% learning progress
              </span>
            )}
          </div>

          {dashboardLoading ? (
            <div className="account-history-empty">Loading your learning stats...</div>
          ) : dashboard ? (
            <>
              <div className="account-stat-grid">
                <div className="account-stat-card"><span>TOTAL QUERIES</span><strong>{dashboard.totalQueries}</strong></div>
                <div className="account-stat-card"><span>SUCCESSFUL</span><strong>{dashboard.successfulQueries}</strong></div>
                <div className="account-stat-card"><span>FAILED</span><strong>{dashboard.failedQueries}</strong></div>
                <div className="account-stat-card"><span>SUCCESS RATE</span><strong>{dashboard.successRate}%</strong></div>
                <div className="account-stat-card"><span>AVG. EXECUTION</span><strong>{dashboard.averageExecutionTimeMs} ms</strong></div>
                <div className="account-stat-card"><span>ROWS RETURNED</span><strong>{dashboard.totalRowsReturned}</strong></div>
                <div className="account-stat-card"><span>LEARNING STREAK</span><strong>{dashboard.learningStreak} day{dashboard.learningStreak === 1 ? "" : "s"}</strong></div>
              </div>

              <div className="account-learning-highlights">
                <div>
                  <span>LAST ACTIVITY</span>
                  <strong>{dashboard.lastActivity ? new Date(dashboard.lastActivity + "Z").toLocaleDateString([], { day: "2-digit", month: "short", year: "numeric" }) : "No activity yet"}</strong>
                </div>
                <div>
                  <span>LEARNING STREAK</span>
                  <strong>{dashboard.learningStreak} day{dashboard.learningStreak === 1 ? "" : "s"}</strong>
                </div>
              </div>

              <div className="account-progress-panel">
                <div className="account-progress-copy">
                  <div>
                    <span>UNDERSTAND CONCEPTS</span>
                    <strong>{dashboard.completedConcepts} / {dashboard.totalConcepts}</strong>
                  </div>
                  <div className="account-progress-track">
                    <span style={{ width: `${dashboard.progressPercent}%` }} />
                  </div>
                </div>
                <div className="account-progress-note">
                  {dashboard.completedConcepts === 0
                    ? "Start an Understand section to build your learning progress."
                    : "Keep exploring SQL concepts to complete your learning path."}
                </div>
              </div>
            </>
          ) : null}
        </section>

        <section className="account-history-card">
          <div className="account-history-header">
            <div>
              <span className="account-card-label">QUERY HISTORY</span>
              <h2>Your SQL activity</h2>
            </div>
            <span className="account-history-count">{history.length} queries</span>
          </div>

          {historyLoading ? (
            <div className="account-history-empty">Loading query history...</div>
          ) : history.length === 0 ? (
            <div className="account-history-empty">
              No queries yet. Run your first SQL query and it will appear here.
            </div>
          ) : (
            <div className="account-history-list">
              {history.map((item) => (
                <div className="account-history-item" key={item.id}>
                  <div className="account-history-main">
                    <code>{item.query}</code>
                    <span>{formatDate(item.createdAt)}</span>
                  </div>
                  <div className="account-history-meta">
                    <span className={item.status === "success" ? "history-success" : "history-error"}>
                      {item.status === "success" ? "Success" : "Error"}
                    </span>
                    {item.status === "success" && (
                      <span>{item.rowsReturned} rows · {item.executionTimeMs} ms</span>
                    )}
                    {item.status === "error" && item.errorMessage && (
                      <span title={item.errorMessage}>Failed</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="account-actions">
          <Link href="/run-query" className="account-primary-action">
            Start Learning SQL <span>↗</span>
          </Link>
          <button
            type="button"
            className="account-logout-action"
            onClick={handleLogout}
            disabled={loggingOut}
          >
            {loggingOut ? "Signing out..." : "Logout"}
          </button>
        </div>

        <div className="account-footer-note"><span>SQLWHALE ACCOUNT</span><p>Independent account and learning data.</p></div>
      </section>
    </main>
  );
}
