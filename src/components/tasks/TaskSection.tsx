"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, ClipboardList, RefreshCw, Eye, LockKeyhole } from "lucide-react";
import { api } from "@/services/api";

type Task = {
  id: string;
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  createdAt?: string;
  completed?: boolean;
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

  const loadTasks = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/tasks");
      setTasks(response.data.tasks || []);
    } catch (err: any) {
      setError(err?.response?.data?.error || "Unable to load tasks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadTasks();
  }, []);

  useEffect(() => {
    if (!taskCheck?.correct) return;

    setTasks((current) =>
      current.map((task) =>
        task.id === taskCheck.taskId ? { ...task, completed: true } : task
      )
    );
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
        <div className="sqlwhale-task-empty">
          <RefreshCw size={18} className="sqlwhale-spin" />
          <span>Loading tasks...</span>
        </div>
      ) : error ? (
        <div className="sqlwhale-task-empty is-error">
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
          {tasks.map((task) => (
            <article className="sqlwhale-task-card" key={task.id}>
              <div className="sqlwhale-task-card-top">
                <div className="sqlwhale-task-icon">
                  <ClipboardList size={16} />
                </div>
                <span className={"sqlwhale-task-difficulty " + task.difficulty.toLowerCase()}>
                  {task.difficulty}
                </span>
              </div>
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              {task.completed ? (
                <div className="sqlwhale-task-completed">
                  <CheckCircle2 size={15} />
                  Task Completed
                </div>
              ) : (
                <button
                  type="button"
                  className="sqlwhale-task-start"
                  onClick={() => onStartTask(task)}
                  disabled={activeTaskId === task.id}
                >
                  <CheckCircle2 size={15} />
                  {activeTaskId === task.id ? "Task Started" : "Start Task"}
                </button>
              )}
              {activeTaskId === task.id && (
                <div className="sqlwhale-task-reveal-wrap" style={{ marginTop: 12 }}>
                  <button
                    type="button"
                    className="sqlwhale-task-start"
                    onClick={() => void handleRevealAnswer(task)}
                    disabled={revealingTaskId === task.id || Boolean(revealedAnswers[task.id])}
                    style={{ width: "100%", opacity: revealedAnswers[task.id] ? 0.7 : 1 }}
                  >
                    {revealingTaskId === task.id ? (
                      <RefreshCw size={15} className="sqlwhale-spin" />
                    ) : (
                      <Eye size={15} />
                    )}
                    {revealedAnswers[task.id] ? "Answer Revealed" : revealingTaskId === task.id ? "Revealing..." : "Reveal Answer"}
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
