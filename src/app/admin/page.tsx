"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { api } from "../../services/api";
import { Search, ShieldCheck, Users, Wrench, Trash2, Save, RefreshCw, ClipboardList, Pencil, X } from "lucide-react";

type User = {
  id: string;
  localUserId: string;
  name: string;
  email: string;
  role: string;
  currentPlan: string;
  createdAt?: string;
  updatedAt?: string;
};

type Task = {
  id: string;
  title: string;
  description: string;
  expectedQuery: string;
  difficulty: "Easy" | "Medium" | "Hard";
  isActive: boolean;
  expectedColumns?: string[] | null;
  expectedRows?: unknown[][] | null;
  createdAt?: string;
};

type NewTask = Omit<Task, "id" | "createdAt">;

type Maintenance = {
  enabled: boolean;
  title: string;
  message: string;
  estimatedReturn: string;
};

const emptyMaintenance: Maintenance = {
  enabled: false,
  title: "SQLWhale is under maintenance",
  message: "We are making a few improvements. Please check back soon.",
  estimatedReturn: "",
};

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [maintenance, setMaintenance] = useState<Maintenance>(emptyMaintenance);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<NewTask>({
    title: "",
    description: "",
    expectedQuery: "",
    difficulty: "Easy",
    isActive: true,
  });
  const [savingTask, setSavingTask] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<NewTask | null>(null);
  const [savingEditedTask, setSavingEditedTask] = useState(false);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingUser, setSavingUser] = useState<string | null>(null);
  const [savingMaintenance, setSavingMaintenance] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const filteredUsers = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter((user) =>
      [user.name, user.email, user.localUserId].some((value) => value.toLowerCase().includes(q))
    );
  }, [users, query]);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const [userResponse, overviewResponse] = await Promise.all([
        api.get("/admin/users"),
        api.get("/admin/overview"),
      ]);
      setUsers(userResponse.data.users || []);
      setMaintenance(overviewResponse.data.maintenance || emptyMaintenance);

      // Tasks are an independent admin module. Do not let a task API
      // deployment/version mismatch break the entire control center.
      try {
        const taskResponse = await api.get("/admin/tasks");
        setTasks(taskResponse.data.tasks || []);
      } catch (taskError: any) {
        console.error("Admin task list unavailable:", taskError);
        setTasks([]);
        if (taskError?.response?.status !== 404) {
          setError(taskError?.response?.data?.error || "Unable to load tasks.");
        }
      }
    } catch (err: any) {
      const status = err?.response?.status;
      setError(status === 401 ? "Please log in to SQLWhale first." : status === 403 ? "This account is not an admin." : (err?.response?.data?.error || "Unable to load admin data."));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  function updateLocalUser(id: string, field: keyof User, value: string) {
    setUsers((current) => current.map((user) => user.id === id ? { ...user, [field]: value } : user));
  }

  async function saveUser(user: User) {
    setSavingUser(user.id);
    setError("");
    setMessage("");
    try {
      const response = await api.patch("/admin/users/" + encodeURIComponent(user.id), {
        name: user.name,
        email: user.email,
        role: user.role,
        currentPlan: user.currentPlan,
      });
      setUsers((current) => current.map((item) => item.id === user.id ? response.data.user : item));
      setMessage(user.name + " updated.");
    } catch (err: any) {
      setError(err?.response?.data?.error || "Unable to update user.");
    } finally {
      setSavingUser(null);
    }
  }

  async function deleteUser(user: User) {
    if (!window.confirm("Delete " + user.name + "? This removes the account, sessions, query history, learning progress and activity.")) return;
    setError("");
    setMessage("");
    try {
      await api.delete("/admin/users/" + encodeURIComponent(user.id));
      setUsers((current) => current.filter((item) => item.id !== user.id));
      setMessage(user.name + " deleted.");
    } catch (err: any) {
      setError(err?.response?.data?.error || "Unable to delete user.");
    }
  }

  async function createTask() {
    setSavingTask(true);
    setError("");
    setMessage("");
    try {
      const response = await api.post("/admin/tasks", newTask);
      setTasks((current) => [response.data.task, ...current]);
      setNewTask({ title: "", description: "", expectedQuery: "", difficulty: "Easy", isActive: true });
      setMessage("Task added successfully.");
    } catch (err: any) {
      setError(err?.response?.data?.error || "Unable to add task.");
    } finally {
      setSavingTask(false);
    }
  }

  function startEditTask(task: Task) {
    setEditingTaskId(task.id);
    setEditingTask({
      title: task.title,
      description: task.description,
      expectedQuery: task.expectedQuery,
      difficulty: task.difficulty,
      isActive: task.isActive,
    });
    setError("");
    setMessage("");
  }

  function cancelEditTask() {
    setEditingTaskId(null);
    setEditingTask(null);
  }

  async function saveEditedTask() {
    if (!editingTaskId || !editingTask) return;

    if (
      !editingTask.title.trim() ||
      !editingTask.description.trim() ||
      !editingTask.expectedQuery.trim()
    ) {
      setError("Task title, description and expected SQL query are required.");
      return;
    }

    setSavingEditedTask(true);
    setError("");
    setMessage("");

    try {
      const response = await api.patch(
        "/admin/tasks/" + encodeURIComponent(editingTaskId),
        editingTask
      );

      setTasks((current) =>
        current.map((item) =>
          item.id === editingTaskId ? response.data.task : item
        )
      );

      setMessage("Task updated successfully. Existing completions were reset if the expected query changed.");
      cancelEditTask();
    } catch (err: any) {
      setError(err?.response?.data?.error || "Unable to update task.");
    } finally {
      setSavingEditedTask(false);
    }
  }

  async function toggleTask(task: Task) {
    try {
      const response = await api.patch("/admin/tasks/" + encodeURIComponent(task.id), {
        isActive: !task.isActive,
      });
      setTasks((current) => current.map((item) => item.id === task.id ? response.data.task : item));
    } catch (err: any) {
      setError(err?.response?.data?.error || "Unable to update task.");
    }
  }

  async function deleteTask(task: Task) {
    if (!window.confirm("Delete task " + task.title + "?")) return;
    try {
      await api.delete("/admin/tasks/" + encodeURIComponent(task.id));
      setTasks((current) => current.filter((item) => item.id !== task.id));
      setMessage(task.title + " deleted.");
    } catch (err: any) {
      setError(err?.response?.data?.error || "Unable to delete task.");
    }
  }

  async function saveMaintenance() {
    setSavingMaintenance(true);
    setError("");
    setMessage("");
    try {
      const response = await api.patch("/admin/maintenance", maintenance);
      setMaintenance(response.data.maintenance || maintenance);
      setMessage(maintenance.enabled ? "Maintenance mode enabled." : "Maintenance mode disabled.");
    } catch (err: any) {
      setError(err?.response?.data?.error || "Unable to save maintenance settings.");
    } finally {
      setSavingMaintenance(false);
    }
  }

  return (
    <main className="sqlwhale-admin-page">
      <header className="sqlwhale-admin-navbar">
        <div className="sqlwhale-admin-navbar-inner">
          <Link href="/" className="sqlwhale-admin-logo" onClick={() => setMobileMenuOpen(false)}>
            <Image src="/assets/sqlwhale-logo.png" alt="SQLWhale" width={42} height={42} priority />
            <span><strong>SQL</strong>Whale</span>
          </Link>
          <nav className="sqlwhale-admin-nav" aria-label="Admin navigation">
            <Link href="/">Home</Link>
            <Link href="/run-query">Run Query</Link>
            <Link href="/learn">Learn</Link>
            <Link href="/understand">Understand</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/account">Profile</Link>
          </nav>
          <div className="sqlwhale-admin-nav-actions">
            <span className="sqlwhale-admin-nav-badge"><ShieldCheck size={14} /> Admin</span>
            <button
              type="button"
              className={"sqlwhale-admin-menu-button " + (mobileMenuOpen ? "is-open" : "")}
              onClick={() => setMobileMenuOpen((current) => !current)}
              aria-label={mobileMenuOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={mobileMenuOpen}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
        <div className={"sqlwhale-admin-mobile-menu " + (mobileMenuOpen ? "is-open" : "")}>
          <Link href="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
          <Link href="/run-query" onClick={() => setMobileMenuOpen(false)}>Run Query</Link>
          <Link href="/learn" onClick={() => setMobileMenuOpen(false)}>Learn</Link>
          <Link href="/understand" onClick={() => setMobileMenuOpen(false)}>Understand</Link>
          <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
          <Link href="/account" onClick={() => setMobileMenuOpen(false)}>Profile</Link>
        </div>
      </header>

      <header className="sqlwhale-admin-header">
        <div>
          <div className="sqlwhale-admin-brand"><ShieldCheck size={19} /> SQLWhale Admin</div>
          <h1>Control center</h1>
          <p>Manage users and control the public SQLWhale experience.</p>
        </div>
        <button className="sqlwhale-admin-refresh" onClick={() => void load()} disabled={loading}>
          <RefreshCw size={16} className={loading ? "sqlwhale-spin" : ""} /> Refresh
        </button>
      </header>

      {(error || message) && (
        <div className={"sqlwhale-admin-notice " + (error ? "is-error" : "is-success")}>
          {error || message}
        </div>
      )}

      <section className="sqlwhale-admin-grid">
        <article className="sqlwhale-admin-card sqlwhale-maintenance-card">
          <div className="sqlwhale-admin-card-title">
            <div><Wrench size={18} /><span>Maintenance mode</span></div>
            <span className={"sqlwhale-status-pill " + (maintenance.enabled ? "is-on" : "is-off")}>
              {maintenance.enabled ? "LIVE" : "OFF"}
            </span>
          </div>
          <p className="sqlwhale-admin-muted">Temporarily replace the public app with a custom maintenance page.</p>
          <label className="sqlwhale-admin-switch-row">
            <span>Enable maintenance</span>
            <input
              type="checkbox"
              checked={maintenance.enabled}
              onChange={(event) => setMaintenance((current) => ({ ...current, enabled: event.target.checked }))}
            />
          </label>
          <input className="sqlwhale-admin-input" value={maintenance.title} onChange={(e) => setMaintenance((c) => ({ ...c, title: e.target.value }))} placeholder="Maintenance title" />
          <textarea className="sqlwhale-admin-textarea" value={maintenance.message} onChange={(e) => setMaintenance((c) => ({ ...c, message: e.target.value }))} placeholder="Message shown to users" rows={3} />
          <input className="sqlwhale-admin-input" value={maintenance.estimatedReturn} onChange={(e) => setMaintenance((c) => ({ ...c, estimatedReturn: e.target.value }))} placeholder="Expected return, e.g. Back in 30 minutes" />
          <button className="sqlwhale-admin-primary" onClick={() => void saveMaintenance()} disabled={savingMaintenance}>
            <Save size={16} /> {savingMaintenance ? "Saving..." : "Save maintenance settings"}
          </button>
        </article>

        <article className="sqlwhale-admin-card">
          <div className="sqlwhale-admin-card-title">
            <div><Users size={18} /><span>Users</span></div>
            <strong>{users.length}</strong>
          </div>
          <p className="sqlwhale-admin-muted">Edit account details, plans and admin access.</p>
          <div className="sqlwhale-admin-search">
            <Search size={16} />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name, email or user ID..." />
          </div>
        </article>
      </section>

      <section className="sqlwhale-admin-card sqlwhale-admin-task-card">
        <div className="sqlwhale-admin-card-title">
          <div><ClipboardList size={18} /><span>Manage Tasks</span></div>
          <strong>{tasks.length}</strong>
        </div>
        <p className="sqlwhale-admin-muted">Add SQL challenges that appear in the Run Query → Task section.</p>

        <div className="sqlwhale-admin-task-form">
          <input className="sqlwhale-admin-input" value={newTask.title} onChange={(e) => setNewTask((c) => ({ ...c, title: e.target.value }))} placeholder="Task title" />
          <textarea className="sqlwhale-admin-textarea" value={newTask.description} onChange={(e) => setNewTask((c) => ({ ...c, description: e.target.value }))} placeholder="Task description / instructions" rows={3} />
          <textarea className="sqlwhale-admin-textarea sqlwhale-admin-code-input" value={newTask.expectedQuery} onChange={(e) => setNewTask((c) => ({ ...c, expectedQuery: e.target.value }))} placeholder="Expected SQL answer" rows={4} />
          <div className="sqlwhale-admin-task-form-row">
            <select className="sqlwhale-admin-select" value={newTask.difficulty} onChange={(e) => setNewTask((c) => ({ ...c, difficulty: e.target.value as NewTask["difficulty"] }))}>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
            <label className="sqlwhale-admin-switch-row">
              <span>Active</span>
              <input type="checkbox" checked={newTask.isActive} onChange={(e) => setNewTask((c) => ({ ...c, isActive: e.target.checked }))} />
            </label>
            <button className="sqlwhale-admin-primary" onClick={() => void createTask()} disabled={savingTask || !newTask.title.trim() || !newTask.description.trim() || !newTask.expectedQuery.trim()}>
              <Save size={16} /> {savingTask ? "Adding..." : "Add task"}
            </button>
          </div>
        </div>

        <div className="sqlwhale-admin-task-list">
          {tasks.length === 0 ? (
            <div className="sqlwhale-admin-empty">No tasks added yet.</div>
          ) : tasks.map((task) => (
            editingTaskId === task.id && editingTask ? (
              <div className="sqlwhale-admin-task-edit" key={task.id}>
                <div className="sqlwhale-admin-task-edit-header">
                  <div>
                    <strong>Edit task</strong>
                    <span>Update the challenge and its expected output.</span>
                  </div>
                  <button
                    type="button"
                    className="sqlwhale-admin-icon-button"
                    onClick={cancelEditTask}
                    aria-label="Cancel task editing"
                  >
                    <X size={16} />
                  </button>
                </div>

                <input
                  className="sqlwhale-admin-input"
                  value={editingTask.title}
                  onChange={(e) => setEditingTask((current) => current ? { ...current, title: e.target.value } : current)}
                  placeholder="Task title"
                />
                <textarea
                  className="sqlwhale-admin-textarea"
                  value={editingTask.description}
                  onChange={(e) => setEditingTask((current) => current ? { ...current, description: e.target.value } : current)}
                  placeholder="Task description / instructions"
                  rows={4}
                />
                <textarea
                  className="sqlwhale-admin-textarea sqlwhale-admin-code-input"
                  value={editingTask.expectedQuery}
                  onChange={(e) => setEditingTask((current) => current ? { ...current, expectedQuery: e.target.value } : current)}
                  placeholder="Expected SQL answer — must return the required output"
                  rows={6}
                />

                <div className="sqlwhale-admin-task-form-row">
                  <select
                    className="sqlwhale-admin-select"
                    value={editingTask.difficulty}
                    onChange={(e) => setEditingTask((current) => current ? { ...current, difficulty: e.target.value as NewTask["difficulty"] } : current)}
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>

                  <label className="sqlwhale-admin-switch-row">
                    <span>Active</span>
                    <input
                      type="checkbox"
                      checked={editingTask.isActive}
                      onChange={(e) => setEditingTask((current) => current ? { ...current, isActive: e.target.checked } : current)}
                    />
                  </label>

                  <button
                    type="button"
                    className="sqlwhale-admin-primary"
                    onClick={() => void saveEditedTask()}
                    disabled={savingEditedTask}
                  >
                    <Save size={16} /> {savingEditedTask ? "Saving..." : "Save task"}
                  </button>

                  <button
                    type="button"
                    className="sqlwhale-admin-secondary"
                    onClick={cancelEditTask}
                    disabled={savingEditedTask}
                  >
                    Cancel
                  </button>
                </div>

                {task.expectedColumns && task.expectedRows ? (
                  <div className="sqlwhale-admin-task-output">
                    <div>
                      <strong>Stored expected output</strong>
                      <span>{task.expectedRows.length} row{task.expectedRows.length === 1 ? "" : "s"} · {task.expectedColumns.length} column{task.expectedColumns.length === 1 ? "" : "s"}</span>
                    </div>
                    <details>
                      <summary>Preview output</summary>
                      <div className="sqlwhale-admin-task-output-table-wrap">
                        <table className="sqlwhale-admin-task-output-table">
                          <thead>
                            <tr>
                              {task.expectedColumns.map((column) => <th key={column}>{column}</th>)}
                            </tr>
                          </thead>
                          <tbody>
                            {task.expectedRows.slice(0, 5).map((row, rowIndex) => (
                              <tr key={rowIndex}>
                                {task.expectedColumns!.map((column, columnIndex) => (
                                  <td key={column}>{String(row[columnIndex] ?? "")}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {task.expectedRows.length > 5 && (
                        <small>Showing the first 5 rows only.</small>
                      )}
                    </details>
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="sqlwhale-admin-task-row" key={task.id}>
                <div>
                  <strong>{task.title}</strong>
                  <span>{task.difficulty} · {task.isActive ? "Active" : "Hidden"}</span>
                  <small>{task.description}</small>
                  {task.expectedRows && task.expectedColumns ? (
                    <em>{task.expectedRows.length} expected result row{task.expectedRows.length === 1 ? "" : "s"} · output-based grading</em>
                  ) : (
                    <em>Expected output will be generated when this task is edited and saved.</em>
                  )}
                </div>
                <div className="sqlwhale-admin-actions">
                  <button className="sqlwhale-admin-save" onClick={() => startEditTask(task)}>
                    <Pencil size={14} /> Edit
                  </button>
                  <button className="sqlwhale-admin-save" onClick={() => void toggleTask(task)}>{task.isActive ? "Hide" : "Publish"}</button>
                  <button className="sqlwhale-admin-delete" onClick={() => void deleteTask(task)}><Trash2 size={14} /> Delete</button>
                </div>
              </div>
            )
          ))}
        </div>
      </section>

      <section className="sqlwhale-admin-card sqlwhale-admin-users-card">
        <div className="sqlwhale-admin-card-title">
          <div><Users size={18} /><span>All users</span></div>
          <span className="sqlwhale-admin-muted">{filteredUsers.length} shown</span>
        </div>
        {loading ? (
          <div className="sqlwhale-admin-empty">Loading users...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="sqlwhale-admin-empty">No users found.</div>
        ) : (
          <div className="sqlwhale-admin-table-wrap">
            <table className="sqlwhale-admin-table">
              <thead>
                <tr><th>User</th><th>Role</th><th>Plan</th><th>Created</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <input className="sqlwhale-admin-cell-input" value={user.name} onChange={(e) => updateLocalUser(user.id, "name", e.target.value)} />
                      <input className="sqlwhale-admin-cell-input is-secondary" value={user.email} onChange={(e) => updateLocalUser(user.id, "email", e.target.value)} />
                      <code>{user.localUserId}</code>
                    </td>
                    <td>
                      <select className="sqlwhale-admin-select" value={user.role} onChange={(e) => updateLocalUser(user.id, "role", e.target.value)}>
                        <option value="user">user</option>
                        <option value="admin">admin</option>
                      </select>
                    </td>
                    <td>
                      <input className="sqlwhale-admin-cell-input" value={user.currentPlan} onChange={(e) => updateLocalUser(user.id, "currentPlan", e.target.value)} />
                    </td>
                    <td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}</td>
                    <td>
                      <div className="sqlwhale-admin-actions">
                        <button className="sqlwhale-admin-save" onClick={() => void saveUser(user)} disabled={savingUser === user.id}>
                          <Save size={14} /> {savingUser === user.id ? "Saving" : "Save"}
                        </button>
                        <button className="sqlwhale-admin-delete" onClick={() => void deleteUser(user)} aria-label={"Delete " + user.name}>
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
