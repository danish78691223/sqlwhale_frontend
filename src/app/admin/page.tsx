"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "../../services/api";
import { Search, ShieldCheck, Users, Wrench, Trash2, Save, RefreshCw } from "lucide-react";

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
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingUser, setSavingUser] = useState<string | null>(null);
  const [savingMaintenance, setSavingMaintenance] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

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
