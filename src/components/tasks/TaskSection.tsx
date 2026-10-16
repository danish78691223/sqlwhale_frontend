"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, ClipboardList, RefreshCw, Eye, LockKeyhole } from "lucide-react";
import { api } from "@/services/api";
import CallChip from "@/components/tasks/CallChip";

type Task = {
  id: string;
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  createdAt?: string;
  completed?: boolean;
  unlocked?: boolean;
  locked?: boolean;
  order?: number;
};

type TaskCheck = { taskId: string; correct: boolean; status: "correct" | "incorrect" | "invalid"; message: string };

interface TaskSectionProps {
  onStartTask: (task: Task) => void;
  activeTaskId?: string | null;
  taskCheck?: TaskCheck | null;
}

export default function TaskSection({ onStartTask, activeTaskId, taskCheck }: TaskSectionProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, string>>({});
  const [revealError, setRevealError] = useState<Record<string, string>>({});
  const [revealingTaskId, setRevealingTaskId] = useState<string | null>(null);
  const [startingTaskId, setStartingTaskId] = useState<string | null>(null);
  const [startErrors, setStartErrors] = useState<Record<string, string>>({});

  const loadTasks = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/tasks");
      const incomingTasks: Task[] = response.data.tasks || [];
      // The backend is the source of truth; retain a fallback for older API deployments.
      let nextUnlocked = true;
      const normalizedTasks = incomingTasks.map((task) => {
        const unlocked = typeof task.unlocked === "boolean" ? task.unlocked : nextUnlocked;
        const normalized = { ...task, unlocked, locked: !unlocked };
        if (!task.completed) nextUnlocked = false;
        return normalized;
      });
      setTasks(normalizedTasks);
    } catch (err: any) {
      setError(err?.response?.data?.error || "Unable to load tasks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadTasks();
  }, []);

  const handleStartTask = async (task: Task) => {
    setStartingTaskId(task.id);
    setStartErrors((current) => ({ ...current, [task.id]: "" }));
    try {
      await api.post(`/tasks/${task.id}/start`);
      onStartTask(task);
    } catch (err: any) {
      setStartErrors((current) => ({
        ...current,
        [task.id]: err?.response?.data?.error || "Unable to prepare this task. Please try again.",
      }));
    } finally {
      setStartingTaskId(null);
    }
  };

  const handleRevealAnswer = async (task: Task) => {
    setRevealError((current) => ({ ...current, [task.id]: "" }));
    setRevealingTaskId(task.id);

    try {
      const response = await api.post(`/tasks/${task.id}/reveal-answer`);
      const answer = response?.data?.answer ?? response?.data?.expectedQuery;

      if (typeof answer !== "string" || !answer.trim()) {
        setRevealError((current) => ({
          ...current,
          [task.id]: "The answer could not be loaded. Please try again.",
        }));
        return;
      }

      setRevealedAnswers((current) => ({ ...current, [task.id]: answer }));
    } catch (err: any) {
      const status = err?.response?.status;
      const data = err?.response?.data;
      const code = data?.code || data?.errorCode || data?.error;
      const message = typeof data?.message === "string" ? data.message : "";

      if (status === 401 || code === "AUTH_REQUIRED") {
        setRevealError((current) => ({
          ...current,
          [task.id]: "Sign in to your SQLWhale account to reveal an answer.",
        }));
        return;
      }

      if (status === 429 || code === "REVEAL_LIMIT_REACHED") {
        const resetAt = data?.resetAt ? new Date(data.resetAt) : null;
        const resetText =
          resetAt && !Number.isNaN(resetAt.getTime())
            ? resetAt.toLocaleString()
            : "in 24 hours";

        window.alert(
          `You've used all 5 answer reveals for this 24-hour period. Your limit resets ${resetText}. Redirecting you to the subscription page.`
        );
        window.location.assign("/subscribe");
        return;
      }

      setRevealError((current) => ({
        ...current,
        [task.id]: message || data?.error || "Unable to reveal this answer right now. Please try again.",
      }));
    } finally {
      setRevealingTaskId(null);
    }
  };

  useEffect(() => {
    if (!taskCheck?.correct) return;
    // Persisted completion determines the next unlocked task.
    void loadTasks();
  }, [taskCheck]);

  return (
    <section className="sqlwhale-task-section" aria-label="SQL tasks">
      <div className="sqlwhale-task-header">
        <div>
          <div className="sqlwhale-builder-kicker">PRACTICE MODE</div>
          <h2>SQL Tasks</h2>
          <p>Solve admin-created SQL challenges using the editor below.</p>
        </div>
        <button
          type="button"
          className="sqlwhale-task-refresh"
          onClick={() => void loadTasks()}
          disabled={loading}
          aria-label="Refresh tasks"
        >
          <RefreshCw size={15} className={loading ? "sqlwhale-spin" : ""} />
        </button>
      </div>

      {loading ? (
        <div className="sqlwhale-task-empty" style={{ display: "flex", justifyContent: "center", padding: "24px 12px" }}>
          <CallChip
            icon="terminal"
            name="sqlwhale"
            argument="loading tasks"
            status="running"
            expectedMs={2500}
            size={34}
            radius={10}
            color="currentColor"
            surfaceColor="#27272a"
            progressColor="currentColor"
            progressOpacity={0.08}
            doneColor="#22c55e"
            errorColor="#ef4444"
            washOpacity={0.14}
            shake={6}
            showTimer
          />
        </div>
      ) : error ? (
        <div className="sqlwhale-task-empty is-error" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: "24px 12px" }}>
          <CallChip
            icon="terminal"
            name="sqlwhale"
            argument="load tasks"
            status="error"
            expectedMs={2500}
            size={34}
            radius={10}
            color="currentColor"
            surfaceColor="#27272a"
            progressColor="currentColor"
            progressOpacity={0.08}
            doneColor="#22c55e"
            errorColor="#ef4444"
            washOpacity={0.14}
            shake={6}
            showTimer
            onRetry={() => void loadTasks()}
          />
          <span>{error}</span>
          <button type="button" onClick={() => void loadTasks()}>Retry</button>
        </div>
      ) : tasks.length === 0 ? (
        <div className="sqlwhale-task-empty">
          <ClipboardList size={20} />
          <div>
            <strong>No tasks yet</strong>
            <span>New tasks added by the admin will appear here.</span>
          </div>
        </div>
      ) : (
        <div className="sqlwhale-task-list">
          {tasks.map((task, index) => (
            <article className={"sqlwhale-task-card" + (task.locked ? " is-locked" : "")} key={task.id}>
              <div className="sqlwhale-task-card-top">
                <div className="sqlwhale-task-icon">
                  <ClipboardList size={16} />
                </div>
                <span className={"sqlwhale-task-difficulty " + task.difficulty.toLowerCase()}>
                  {task.difficulty}
                </span>
                <span className="sqlwhale-task-order">TASK {task.order ?? index + 1}</span>
              </div>
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              {task.completed ? (
                <div className="sqlwhale-task-completed">
                  <CheckCircle2 size={15} />
                  Task Completed
                </div>
              ) : task.locked ? (
                <div className="sqlwhale-task-locked" aria-label="Task locked until the previous task is completed">
                  <LockKeyhole size={15} />
                  <span>Complete previous task to unlock</span>
                </div>
              ) : (
                <button
                  type="button"
                  className="sqlwhale-task-start"
                  onClick={() => void handleStartTask(task)}
                  disabled={activeTaskId === task.id || startingTaskId === task.id}
                >
                  <CheckCircle2 size={15} />
                  {startingTaskId === task.id ? "Preparing..." : activeTaskId === task.id ? "Task Started" : "Start Task"}
                </button>
              )}
              {startErrors[task.id] && (
                <div role="alert" className="sqlwhale-task-check is-incorrect" style={{ marginTop: 10 }}>
                  <span>{startErrors[task.id]}</span>
                </div>
              )}
              {!task.locked && activeTaskId === task.id && (
                <div className="sqlwhale-task-reveal-wrap" style={{ marginTop: 12 }}>
                  <button
                    type="button"
                    className="sqlwhale-task-start"
                    onClick={() => void handleRevealAnswer(task)}
                    disabled={revealingTaskId === task.id || Boolean(revealedAnswers[task.id])}
                    style={{ width: "100%", opacity: revealedAnswers[task.id] ? 0.7 : 1 }}
                  >
                    {revealingTaskId === task.id ? (
                      <CallChip
                        icon="terminal"
                        name="sqlwhale"
                        argument="revealing answer"
                        status="running"
                        expectedMs={2500}
                        size={34}
                        radius={10}
                        color="currentColor"
                        surfaceColor="#27272a"
                        progressColor="currentColor"
                        progressOpacity={0.08}
                        doneColor="#22c55e"
                        errorColor="#ef4444"
                        washOpacity={0.14}
                        shake={6}
                        showTimer
                      />
                    ) : (
                      <Eye size={15} />
                    )}
                    {revealedAnswers[task.id] ? "Answer Revealed" : revealingTaskId === task.id ? "" : "Reveal Answer"}
                  </button>
                  {revealError[task.id] && (
                    <div role="alert" className="sqlwhale-task-check is-incorrect" style={{ marginTop: 10 }}>
                      <strong><LockKeyhole size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: 5 }} />Answer unavailable</strong>
                      <span>{revealError[task.id]}</span>
                      {(revealError[task.id].includes("Sign in")) && (
                        <a href="/login" style={{ display: "inline-block", marginTop: 8, fontWeight: 700, textDecoration: "underline" }}>Sign in to SQLWhale</a>
                      )}
                    </div>
                  )}
                  {revealedAnswers[task.id] && (
                    <div className="sqlwhale-task-check is-correct" style={{ marginTop: 10, textAlign: "left" }}>
                      <strong>Expected SQL answer</strong>
                      <pre style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere", margin: "10px 0 0", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 12, lineHeight: 1.65 }}>{revealedAnswers[task.id]}</pre>
                    </div>
                  )}
                </div>
              )}
              {activeTaskId === task.id && taskCheck && (
                <div className={"sqlwhale-task-check " + (taskCheck.correct ? "is-correct" : "is-incorrect")}>
                  <strong>{taskCheck.correct ? "✓ Task Completed" : "✕ Incorrect Query"}</strong>
                  <span>{taskCheck.message}</span>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
