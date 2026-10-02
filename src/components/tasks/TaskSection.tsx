"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, ClipboardList, RefreshCw } from "lucide-react";
import { api } from "@/services/api";

type Task = {
  id: string;
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  createdAt?: string;
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
              <button
                type="button"
                className="sqlwhale-task-start"
                onClick={() => onStartTask(task)}
                disabled={activeTaskId === task.id}
              >
                <CheckCircle2 size={15} />
                {activeTaskId === task.id ? "Task Started" : "Start Task"}
              </button>
              {activeTaskId === task.id && taskCheck && (
                <div className={"sqlwhale-task-check " + (taskCheck.correct ? "is-correct" : "is-incorrect")}>
                  <strong>{taskCheck.correct ? "✓ Correct Answer" : "✕ Incorrect Answer"}</strong>
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
