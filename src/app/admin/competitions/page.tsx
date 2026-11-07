"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { api } from "../../../services/api";

type TaskOption = { id: string; title: string; difficulty: "Easy" | "Medium" | "Hard"; isActive: boolean };
type Competition = { id: string; title: string; slug: string; description?: string; status: string; taskIds: string[]; startsAt?: string | null; endsAt?: string | null; registrationStartsAt?: string | null; registrationEndsAt?: string | null; points?: { Easy: number; Medium: number; Hard: number } };

const initial = { title: "", slug: "", description: "", status: "draft", taskIds: [] as string[], registrationStartsAt: "", registrationEndsAt: "", startsAt: "", endsAt: "", points: { Easy: 5, Medium: 10, Hard: 15 }, certificateTopN: 3 };

export default function AdminCompetitionsPage() {
  const [tasks, setTasks] = useState<TaskOption[]>([]);
  const [items, setItems] = useState<Competition[]>([]);
  const [form, setForm] = useState(initial);
  const [editing, setEditing] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function load() {
    setBusy(true); setError("");
    try {
      const response = await api.get("/admin/competitions");
      setItems(response.data.competitions || []);
      setTasks(response.data.tasks || []);
    } catch (e: any) { setError(e?.response?.data?.error || "Unable to load competition management."); }
    finally { setBusy(false); }
  }
  useEffect(() => { void load(); }, []);

  const selectedTasks = useMemo(() => tasks.filter(t => form.taskIds.includes(t.id)), [tasks, form.taskIds]);
  function update<K extends keyof typeof initial>(key: K, value: (typeof initial)[K]) { setForm(old => ({ ...old, [key]: value })); }
  function toggleTask(id: string) { update("taskIds", form.taskIds.includes(id) ? form.taskIds.filter(x => x !== id) : [...form.taskIds, id]); }
  function edit(item: Competition) {
    setEditing(item.id);
    setForm({
      ...initial, title: item.title, slug: item.slug, description: item.description || "", status: item.status,
      taskIds: item.taskIds || [], startsAt: item.startsAt ? new Date(item.startsAt).toISOString().slice(0,16) : "",
      endsAt: item.endsAt ? new Date(item.endsAt).toISOString().slice(0,16) : "",
      registrationStartsAt: item.registrationStartsAt ? new Date(item.registrationStartsAt).toISOString().slice(0,16) : "",
      registrationEndsAt: item.registrationEndsAt ? new Date(item.registrationEndsAt).toISOString().slice(0,16) : "",
      points: item.points || initial.points,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  async function save() {
    setBusy(true); setError(""); setMessage("");
    try {
      const payload = { ...form, registrationStartsAt: form.registrationStartsAt || null, registrationEndsAt: form.registrationEndsAt || null, startsAt: form.startsAt || null, endsAt: form.endsAt || null };
      if (editing) await api.patch("/admin/competitions/" + editing, payload);
      else await api.post("/admin/competitions", payload);
      setForm(initial); setEditing(null); setMessage(editing ? "Competition updated." : "Competition created."); await load();
    } catch (e: any) { setError(e?.response?.data?.error || "Unable to save competition."); }
    finally { setBusy(false); }
  }
  async function remove(item: Competition) {
    if (!window.confirm("Delete " + item.title + "? Registration and submission history are retained, but the competition itself will be removed.")) return;
    try { await api.delete("/admin/competitions/" + item.id); setMessage("Competition deleted."); await load(); }
    catch (e: any) { setError(e?.response?.data?.error || "Unable to delete competition."); }
  }

  const field: React.CSSProperties = { width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid #334155", background: "#0b1220", color: "#e2e8f0" };
  const card: React.CSSProperties = { background: "#111c2e", border: "1px solid #26364d", borderRadius: 16, padding: 22, marginBottom: 18, color: "#e2e8f0" };
  const label: React.CSSProperties = { display: "block", fontSize: 13, color: "#a9bbd1", marginBottom: 7 };
  return <main style={{ minHeight: "100vh", background: "#07111f", color: "#e2e8f0", padding: "28px 18px 60px" }}>
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap", marginBottom: 24 }}>
        <div><Link href="/admin" style={{ color: "#67d5ef", textDecoration: "none" }}>← Admin Control Panel</Link><h1 style={{ fontSize: 30, margin: "12px 0 5px" }}>Competition Manager</h1><p style={{ color: "#9fb0c5", margin: 0 }}>Create competitions and assign existing admin-created SQL tasks.</p></div>
        <button onClick={() => void load()} style={{ ...field, width: "auto", cursor: "pointer" }}>Refresh</button>
      </div>
      {(error || message) && <div role="status" style={{ ...card, borderColor: error ? "#a33d55" : "#247b67" }}>{error || message}</div>}
      <section style={card}>
        <h2 style={{ marginTop: 0 }}>{editing ? "Edit competition" : "Create competition"}</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: 14 }}>
          <label><span style={label}>Competition title</span><input style={field} value={form.title} onChange={e => update("title", e.target.value)} placeholder="SQLWhale SQL Challenge 2026" /></label>
          <label><span style={label}>URL slug</span><input style={field} value={form.slug} onChange={e => update("slug", e.target.value)} placeholder="sqlwhale-sql-challenge-2026" /></label>
          <label><span style={label}>Status</span><select style={field} value={form.status} onChange={e => update("status", e.target.value)}>{["draft","scheduled","live","completed","archived"].map(x => <option key={x}>{x}</option>)}</select></label>
          <label><span style={label}>Certificates for top N</span><input style={field} type="number" min="0" max="100" value={form.certificateTopN} onChange={e => update("certificateTopN", Number(e.target.value))} /></label>
        </div>
        <label style={{ display: "block", marginTop: 14 }}><span style={label}>Description</span><textarea style={{ ...field, minHeight: 90, resize: "vertical" }} value={form.description} onChange={e => update("description", e.target.value)} placeholder="Describe this competition..." /></label>
        <h3 style={{ margin: "24px 0 10px" }}>Registration and competition schedule</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 14 }}>
          {([["registrationStartsAt","Registration opens"],["registrationEndsAt","Registration closes"],["startsAt","Competition starts"],["endsAt","Competition ends"]] as const).map(([key,title]) => <label key={key}><span style={label}>{title}</span><input style={field} type="datetime-local" value={form[key]} onChange={e => update(key, e.target.value)} /></label>)}
        </div>
        <h3 style={{ margin: "24px 0 10px" }}>Points by task difficulty</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 12 }}>
          {(["Easy","Medium","Hard"] as const).map(level => <label key={level}><span style={label}>{level} points</span><input style={field} type="number" min="0" value={form.points[level]} onChange={e => setForm(old => ({ ...old, points: { ...old.points, [level]: Number(e.target.value) } }))} /></label>)}
        </div>
        <h3 style={{ margin: "24px 0 10px" }}>Assign existing tasks ({selectedTasks.length} selected)</h3>
        <p style={{ color: "#9fb0c5", fontSize: 13 }}>Tasks are reused from Manage Tasks. No duplicate task records are created.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))", gap: 8, maxHeight: 300, overflow: "auto" }}>
          {tasks.filter(t => t.isActive).map(task => <label key={task.id} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: 12, border: "1px solid #304159", borderRadius: 10, background: form.taskIds.includes(task.id) ? "#123047" : "#0b1525" }}><input type="checkbox" checked={form.taskIds.includes(task.id)} onChange={() => toggleTask(task.id)} style={{ marginTop: 3 }} /><span><b>{task.title}</b><small style={{ display: "block", color: "#9fb0c5" }}>{task.difficulty}</small></span></label>)}
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 20, flexWrap: "wrap" }}><button disabled={busy || !form.title.trim()} onClick={() => void save()} style={{ ...field, width: "auto", border: 0, background: "#08a9ce", color: "#04121e", fontWeight: 700, cursor: "pointer" }}>{busy ? "Saving..." : editing ? "Save changes" : "Create competition"}</button><button onClick={() => { setForm(initial); setEditing(null); }} style={{ ...field, width: "auto", cursor: "pointer" }}>Clear</button></div>
      </section>
      <section style={card}><h2 style={{ marginTop: 0 }}>Existing competitions</h2>{busy && !items.length ? <p>Loading...</p> : !items.length ? <p style={{ color: "#9fb0c5" }}>No competitions created yet.</p> : items.map(item => <article key={item.id} style={{ borderTop: "1px solid #304159", padding: "16px 0", display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}><div><b>{item.title}</b><div style={{ color: "#9fb0c5", fontSize: 13 }}>{item.slug} · {item.status} · {item.taskIds?.length || 0} tasks</div></div><div style={{ display: "flex", gap: 8 }}><button onClick={() => edit(item)} style={{ ...field, width: "auto", cursor: "pointer" }}>Edit</button><button onClick={() => void remove(item)} style={{ ...field, width: "auto", cursor: "pointer", borderColor: "#9f4054" }}>Delete</button></div></article>)}</section>
    </div>
  </main>;
}
