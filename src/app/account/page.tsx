"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Activity, Bell, BookOpen, CheckCircle2, Code2, LayoutDashboard, LogOut, Menu, RefreshCw, Settings, Trophy, X, Zap } from "lucide-react";
import "./account.css";
import { authApi, api } from "@/services/api";
import { ProfileRankCard } from "@/components/Leaderboard";
import PushNotificationSettings from "@/components/PushNotificationSettings";

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
  const [planStatus, setPlanStatus] = useState<{ subscribed?: boolean; currentPlan?: string; recurring?: boolean; subscriptionStatus?: string | null; cancelAtCycleEnd?: boolean; currentPeriodEnd?: string | null; activationPending?: boolean } | null>(null);
  const [refreshingPlan, setRefreshingPlan] = useState(false);
  const [planRefreshMessage, setPlanRefreshMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
  const [completedTasks, setCompletedTasks] = useState<Array<{id:string;title:string;difficulty:string;completedAt:string}>>([]);
  const [completedTasksLoading, setCompletedTasksLoading] = useState(true);
  const [activityNotice, setActivityNotice] = useState("");
  const [activityErrors, setActivityErrors] = useState({ history: false, dashboard: false, tasks: false });

  useEffect(() => {
    if (!sidebarOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSidebarOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [sidebarOpen]);

  useEffect(() => {
    let mounted = true;

    async function loadAccount() {
      try {
        const response = await authApi.get("/auth/me");

        if (!response.data?.authenticated) {
          if (mounted) {
            setHistoryLoading(false);
            setDashboardLoading(false);
            setCompletedTasksLoading(false);
            router.replace("/login");
          }
          return;
        }

        if (!mounted) return;
        setUser(response.data.user);

        // Fetch plan state independently: a learning-history failure must not hide the plan.
        void api.get("/subscription/status")
          .then((subscriptionResponse) => {
            if (!mounted) return;
            setPlanStatus(subscriptionResponse.data || null);
            if (subscriptionResponse.data?.currentPlan) {
              setUser((current) => current ? { ...current, currentPlan: subscriptionResponse.data.currentPlan } : current);
            }
          })
          .catch((subscriptionError) => {
            console.error("Unable to load subscription status:", subscriptionError);
          });

        try {
          // Account panels are independent; one failed endpoint must not blank the others.
          const [historyResult, dashboardResult, tasksResult] = await Promise.allSettled([
            authApi.get("/auth/query-history?limit=50"),
            authApi.get("/auth/learning-dashboard"),
            authApi.get("/auth/task-completions"),
          ]);
          if (mounted) {
            if (historyResult.status === "fulfilled") setHistory(historyResult.value.data?.history || []);
            else console.error("Unable to load query history:", historyResult.reason);
            if (dashboardResult.status === "fulfilled") setDashboard(dashboardResult.value.data?.stats || null);
            else console.error("Unable to load learning dashboard:", dashboardResult.reason);
            if (tasksResult.status === "fulfilled") setCompletedTasks(tasksResult.value.data?.completions || []);
            else console.error("Unable to load completed tasks:", tasksResult.reason);
            const errors = {
              history: historyResult.status === "rejected",
              dashboard: dashboardResult.status === "rejected",
              tasks: tasksResult.status === "rejected",
            };
            setActivityErrors(errors);
            if (Object.values(errors).some(Boolean)) {
              setActivityNotice("Some account activity could not be refreshed. Other sections are still available.");
            }
          }
        } finally {
          if (mounted) {
            setHistoryLoading(false);
            setDashboardLoading(false);
            setCompletedTasksLoading(false);
          }
        }
      } catch {
        if (mounted) {
          setHistoryLoading(false);
          setDashboardLoading(false);
          setCompletedTasksLoading(false);
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

  async function refreshPlanStatus() {
    if (refreshingPlan) return;
    setRefreshingPlan(true);
    setPlanRefreshMessage("");
    try {
      const response = await api.get("/subscription/status");
      setPlanStatus(response.data || null);
      if (response.data?.currentPlan) {
        setUser((current) => current ? { ...current, currentPlan: response.data.currentPlan } : current);
      }
      setPlanRefreshMessage(
        response.data?.currentPlan === "SQLWhale Premium"
          ? "Premium status is up to date."
          : response.data?.activationPending
            ? "Razorpay is still confirming activation. You do not need to pay again."
            : "Plan status refreshed.",
      );
    } catch (error: any) {
      setPlanRefreshMessage(error?.response?.data?.error || "Unable to refresh plan status. Please try again shortly.");
    } finally {
      setRefreshingPlan(false);
    }
  }

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
    const date = new Date(value.endsWith("Z") ? value : value + "Z");
    if (Number.isNaN(date.getTime())) return "—";
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



      <section className="account-shell">
        <aside className={"account-sidebar-column " + (sidebarOpen ? "is-open" : "")}>
        <button type="button" className="account-sidebar-close" onClick={() => setSidebarOpen(false)} aria-label="Close profile menu"><X size={17} /></button>
        <nav className="account-section-nav" aria-label="Account sections">
          <div className="account-nav-brand">
            <span className="account-nav-brand-mark"><Code2 size={19} /></span>
            <span><strong>SQLWhale</strong><small>PERSONAL WORKSPACE</small></span>
          </div>
          <div className="account-nav-group">
            <span className="account-nav-group-label">WORKSPACE</span>
            <a href="#account-overview" onClick={() => setSidebarOpen(false)}><span className="account-nav-icon"><LayoutDashboard size={16} /></span><span>Overview</span></a>
            <a href="#account-learning" onClick={() => setSidebarOpen(false)}><span className="account-nav-icon"><BookOpen size={16} /></span><span>Learning progress</span></a>
            <a href="#account-tasks" onClick={() => setSidebarOpen(false)}><span className="account-nav-icon"><CheckCircle2 size={16} /></span><span>Completed tasks</span></a>
          </div>
          <div className="account-nav-group">
            <span className="account-nav-group-label">ACTIVITY</span>
            <a href="#account-history" onClick={() => setSidebarOpen(false)}><span className="account-nav-icon"><Activity size={16} /></span><span>Query history</span></a>
            <a href="#account-ranking" onClick={() => setSidebarOpen(false)}><span className="account-nav-icon"><Trophy size={16} /></span><span>Leaderboard</span></a>
          </div>
          <div className="account-nav-group">
            <span className="account-nav-group-label">PREFERENCES</span>
            <a href="#account-notifications" onClick={() => setSidebarOpen(false)}><span className="account-nav-icon"><Bell size={16} /></span><span>Notifications</span></a>
            <a href="#account-actions" onClick={() => setSidebarOpen(false)}><span className="account-nav-icon"><Settings size={16} /></span><span>Account actions</span></a>
          </div>
          <div className="account-nav-user">
            <span className="account-nav-user-avatar">{(user.name || "U").trim().charAt(0).toUpperCase()}</span>
            <span><strong>{user.name}</strong><small>{user.email}</small></span>
          </div>
        </nav>
        </aside>
        <div className="account-main-content">
        <div className="account-heading">
          <div className="account-heading-top"><div className="account-eyebrow"><span /> YOUR SQLWHALE ACCOUNT</div><button type="button" className="account-mobile-menu-button" onClick={() => setSidebarOpen(true)} aria-label="Open account menu" aria-expanded={sidebarOpen}><Menu size={15} /> <span>Menu</span></button></div>
          <h1>Welcome, <em>{user.name}</em>.</h1>
          <p>Your separate SQLWhale account is ready.</p>
        </div>



        {activityNotice ? <div className="account-activity-notice" role="status">{activityNotice}</div> : null}

        <div className="account-section-intro" id="account-overview">
          <div><span className="account-card-label">ACCOUNT OVERVIEW</span><h2>Your profile at a glance</h2></div>
          <p>Manage your SQLWhale account and jump directly to the information you need.</p>
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
                <strong className={"account-plan-pill " + ((planStatus?.currentPlan || user.currentPlan || "Starter") === "SQLWhale Premium" ? "is-premium" : "is-starter")}>                  {(planStatus?.currentPlan || user.currentPlan || "Starter") === "SQLWhale Premium" ? "PREMIUM ✓" : "STARTER"}
                </strong>
                {planStatus?.subscriptionStatus ? <small className="account-subscription-note">Subscription: {planStatus.subscriptionStatus}{planStatus.cancelAtCycleEnd ? " · Cancels at period end" : ""}</small> : null}
                {planStatus?.currentPeriodEnd ? <small className="account-subscription-note">Access until: {new Date(planStatus.currentPeriodEnd).toLocaleDateString("en-IN")}</small> : null}
                {planStatus?.activationPending ? <small className="account-subscription-note is-pending">Payment/AutoPay is being confirmed. Refresh shortly; do not pay again.</small> : null}
                <button type="button" className="account-plan-refresh" onClick={() => void refreshPlanStatus()} disabled={refreshingPlan}>
                  <><RefreshCw size={13} className={refreshingPlan ? "account-spin" : ""} /> {refreshingPlan ? "Checking Razorpay…" : "Refresh plan status"}</>
                </button>
                {planRefreshMessage ? <small role="status" className={"account-plan-message " + (planRefreshMessage.toLowerCase().includes("unable") ? "is-error" : "")}>{planRefreshMessage}</small> : null}
                {(planStatus?.currentPlan || user.currentPlan || "Starter") === "Starter" ? <Link href="/subscribe" className="account-upgrade-link">Upgrade to Premium <Zap size={13} /></Link> : null}
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

        <section className="account-rank-anchor" id="account-ranking" aria-label="Leaderboard ranking"><ProfileRankCard /></section>

        <section className="account-dashboard-section" id="account-learning">
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
          ) : activityErrors.dashboard ? (
            <div className="account-history-empty" role="alert">Learning statistics are temporarily unavailable. Your other account sections remain accessible.</div>
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
                  <strong>{dashboard.lastActivity ? new Date(dashboard.lastActivity.endsWith("Z") ? dashboard.lastActivity : dashboard.lastActivity + "Z").toLocaleDateString([], { day: "2-digit", month: "short", year: "numeric" }) : "No activity yet"}</strong>
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
                    <span style={{ width: `${Math.min(100, Math.max(0, Number(dashboard.progressPercent) || 0))}%` }} />
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

        <section className="account-dashboard-section account-completed-tasks-section" id="account-tasks">
          <div className="account-history-header">
            <div>
              <span className="account-card-label">TASK PROGRESS</span>
              <h2>Completed SQL Tasks</h2>
            </div>
            <span className="account-history-count">{completedTasks.length} completed</span>
          </div>
          {completedTasksLoading ? (
            <div className="account-history-empty">Loading completed tasks...</div>
          ) : activityErrors.tasks ? (
            <div className="account-history-empty" role="alert">Completed tasks could not be loaded. Please revisit this page to retry.</div>
          ) : completedTasks.length === 0 ? (
            <div className="account-history-empty">No tasks completed yet. Start a SQL task from Run Query.</div>
          ) : (
            <div className="account-history-list">
              {completedTasks.map((task) => (
                <div className="account-history-item" key={task.id}>
                  <div className="account-history-main">
                    <strong>{task.title}</strong>
                    <span>Completed {formatDate(task.completedAt)}</span>
                  </div>
                  <div className="account-history-meta">
                    <span className="history-success">Completed</span>
                    <span>{task.difficulty}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="account-history-card" id="account-history">
          <div className="account-history-header">
            <div>
              <span className="account-card-label">QUERY HISTORY</span>
              <h2>Your SQL activity</h2>
            </div>
            <span className="account-history-count">{history.length} queries</span>
          </div>

          {historyLoading ? (
            <div className="account-history-empty">Loading query history...</div>
          ) : activityErrors.history ? (
            <div className="account-history-empty" role="alert">Query history could not be loaded. Please revisit this page to retry.</div>
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

        <section className="account-notifications-section" id="account-notifications">
          <div className="account-history-header">
            <div><span className="account-card-label">PREFERENCES</span><h2>Notifications</h2></div>
            <span className="account-history-count">Device settings</span>
          </div>
          <PushNotificationSettings />
        </section>

        <div className="account-actions" id="account-actions">
          <Link href="/run-query" className="account-primary-action">
            Start Learning SQL <span>↗</span>
          </Link>
          <button
            type="button"
            className="account-logout-action"
            onClick={handleLogout}
            disabled={loggingOut}
          >
            <><LogOut size={15} /> {loggingOut ? "Signing out..." : "Logout"}</>
          </button>
        </div>

        <div className="account-footer-note"><span>SQLWHALE ACCOUNT</span><p>Independent account and learning data.</p></div>
        </div>
        {sidebarOpen ? <button type="button" className="account-sidebar-overlay" onClick={() => setSidebarOpen(false)} aria-label="Close profile menu" /> : null}
      </section>
    </main>
  );
}
