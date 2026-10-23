"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, ClipboardList, RefreshCw, Eye, LockKeyhole } from "lucide-react";
import { api } from "@/services/api";
import CallChip from "@/components/tasks/CallChip";
import AnimatedList from "@/components/tasks/AnimatedList";

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
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
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
      setSelectedTask(null);
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
          onClick={(event) => { event.stopPropagation(); void loadTasks(); }}
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
          <AnimatedList
            items={tasks.map((task, index) => ({
              id: task.id,
              title: task.title,
              description: task.description,
              meta: task.completed ? "Completed" : task.locked ? "Locked" : task.difficulty,
              icon: task.completed ? <CheckCircle2 size={18} /> : task.locked ? <LockKeyhole size={18} /> : <ClipboardList size={18} />,
              taskOrder: task.order ?? index + 1
            }))}
            onItemSelect={(_item, index) => {
              const task = tasks[index];
              if (task) setSelectedTask(task);
            }}
            animation="pop"
            theme="dark"
            width="100%"
            maxHeight={520}
            gap={8}
            radius={12}
          />
        </div>
      )}
      {selectedTask && (
        <div
          role="presentation"
          onClick={() => setSelectedTask(null)}
          style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, background: "rgba(8, 15, 30, .62)", backdropFilter: "blur(8px)" }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="sqlwhale-task-modal-title"
            onClick={(event) => event.stopPropagation()}
            style={{ width: "min(100%, 520px)", maxHeight: "min(82vh, 680px)", overflowY: "auto", borderRadius: 20, padding: 24, background: "var(--sqlwhale-panel, #fff)", color: "var(--sqlwhale-text, #111827)", border: "1px solid rgba(148,163,184,.28)", boxShadow: "0 24px 80px rgba(0,0,0,.28)" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
              <span className="sqlwhale-task-icon"><ClipboardList size={18} /></span>
              <span className={"sqlwhale-task-difficulty " + selectedTask.difficulty.toLowerCase()}>{selectedTask.difficulty}</span>
              <span style={{ marginLeft: "auto", fontSize: 12, opacity: .65 }}>TASK {selectedTask.order ?? tasks.findIndex((item) => item.id === selectedTask.id) + 1}</span>
              <button type="button" onClick={() => setSelectedTask(null)} aria-label="Close task details" style={{ border: 0, borderRadius: 9, width: 34, height: 34, fontSize: 22, cursor: "pointer", background: "rgba(148,163,184,.14)", color: "inherit" }}>×</button>
            </div>
            <h2 id="sqlwhale-task-modal-title" style={{ margin: "0 0 12px", fontSize: 23, lineHeight: 1.3, fontWeight: 750 }}>{selectedTask.title}</h2>
            <div style={{ fontSize: 14, lineHeight: 1.75, whiteSpace: "pre-wrap", overflowWrap: "anywhere", opacity: .88 }}>{selectedTask.description}</div>
            {selectedTask.completed ? (
              <div className="sqlwhale-task-completed" style={{ marginTop: 22 }}><CheckCircle2 size={16} /> Task Completed</div>
            ) : selectedTask.locked ? (
              <div className="sqlwhale-task-locked" style={{ marginTop: 22, padding: 12, display: "flex", alignItems: "center", gap: 8 }}><LockKeyhole size={16} /> Complete previous task to unlock</div>
            ) : (
              <button
                type="button"
                className="sqlwhale-task-start"
                onClick={() => void handleStartTask(selectedTask)}
                disabled={startingTaskId === selectedTask.id || activeTaskId === selectedTask.id}
                style={{ width: "100%", marginTop: 24, minHeight: 46, justifyContent: "center", fontSize: 14 }}
              >
                <CheckCircle2 size={16} />
                {startingTaskId === selectedTask.id ? "Preparing task..." : activeTaskId === selectedTask.id ? "Task already started" : "Start Task"}
              </button>
            )}
            {startErrors[selectedTask.id] && <div role="alert" className="sqlwhale-task-check is-incorrect" style={{ marginTop: 12 }}>{startErrors[selectedTask.id]}</div>}
          </section>
        </div>
      )}
    </section>
  );
}
