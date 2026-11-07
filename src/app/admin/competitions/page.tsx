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
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const syncTheme = () => setIsDark(document.documentElement.classList.contains("dark") || document.body.classList.contains("dark"));
    syncTheme();
    const observer = new MutationObserver(syncTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

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

  const palette = isDark ? { page: "#07111f", surface: "#111c2e", surfaceAlt: "#0b1525", input: "#0b1220", border: "#26364d", borderStrong: "#334155", text: "#e2e8f0", muted: "#9fb0c5", accent: "#22c4e8", accentText: "#06202a", selected: "#123047", shadow: "0 18px 45px rgba(0,0,0,.18)" } : { page: "#f4f7fb", surface: "#ffffff", surfaceAlt: "#f8fafc", input: "#ffffff", border: "#e2e8f0", borderStrong: "#cbd5e1", text: "#172033", muted: "#64748b", accent: "#087ea4", accentText: "#ffffff", selected: "#e8f7fc", shadow: "0 12px 32px rgba(15,23,42,.06)" };
  const field: React.CSSProperties = { width: "100%", minWidth: 0, boxSizing: "border-box", padding: "12px 14px", borderRadius: 11, border: "1px solid " + palette.borderStrong, background: palette.input, color: palette.text, font: "inherit", outlineOffset: 2 };
  const card: React.CSSProperties = { background: palette.surface, border: "1px solid " + palette.border, borderRadius: 18, padding: 24, marginBottom: 20, color: palette.text, boxShadow: palette.shadow };
  const label: React.CSSProperties = { display: "block", fontSize: 13, fontWeight: 650, color: palette.muted, marginBottom: 8 };
  const secondaryButton: React.CSSProperties = { ...field, width: "auto", cursor: "pointer", fontWeight: 650, background: palette.surfaceAlt };
  return <main data-theme={isDark ? "dark" : "light"} style={{ minHeight: "100vh", background: palette.page, color: palette.text, padding: "36px 20px 72px", fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif", transition: "background .2s ease, color .2s ease" }}>
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap", marginBottom: 24 }}>
        <div><Link href="/admin" style={{ color: palette.accent, textDecoration: "none", fontWeight: 700, fontSize: 13 }}>← Admin Control Panel</Link><div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 12 }}><span style={{ width: 42, height: 42, display: "grid", placeItems: "center", borderRadius: 13, background: palette.selected, color: palette.accent, fontSize: 20 }}>🏆</span><div><div style={{ color: palette.accent, fontSize: 11, fontWeight: 800, letterSpacing: ".12em", textTransform: "uppercase" }}>SQLWhale · Admin</div><h1 style={{ fontSize: 30, lineHeight: 1.15, letterSpacing: "-.04em", margin: "4px 0 5px" }}>Competition Manager</h1></div></div><p style={{ color: palette.muted, margin: "8px 0 0", maxWidth: 620 }}>Create events, choose the SQL tasks participants will solve, and manage the competition lifecycle.</p></div>
        <button onClick={() => void load()} style={secondaryButton}>↻ &nbsp; Refresh</button>
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
        <h3 style={{ margin: "26px 0 12px", fontSize: 16, color: palette.text }}>Registration &amp; competition schedule</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 14 }}>
          {([["registrationStartsAt","Registration opens"],["registrationEndsAt","Registration closes"],["startsAt","Competition starts"],["endsAt","Competition ends"]] as const).map(([key,title]) => <label key={key}><span style={label}>{title}</span><input style={field} type="datetime-local" value={form[key]} onChange={e => update(key, e.target.value)} /></label>)}
        </div>
        <h3 style={{ margin: "26px 0 12px", fontSize: 16, color: palette.text }}>Scoring configuration</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 12 }}>
          {(["Easy","Medium","Hard"] as const).map(level => <label key={level}><span style={label}>{level} points</span><input style={field} type="number" min="0" value={form.points[level]} onChange={e => setForm(old => ({ ...old, points: { ...old.points, [level]: Number(e.target.value) } }))} /></label>)}
        </div>
        <h3 style={{ margin: "26px 0 12px", fontSize: 16, color: palette.text }}>Assign SQL tasks ({selectedTasks.length} selected)</h3>
        <p style={{ color: palette.muted, fontSize: 13 }}>Tasks are reused from Manage Tasks. No duplicate task records are created.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))", gap: 8, maxHeight: 300, overflow: "auto" }}>
          {tasks.filter(t => t.isActive).map(task => <label key={task.id} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: 12, border: "1px solid #304159", borderRadius: 10, background: form.taskIds.includes(task.id) ? palette.selected : palette.surfaceAlt }}><input type="checkbox" checked={form.taskIds.includes(task.id)} onChange={() => toggleTask(task.id)} style={{ marginTop: 3 }} /><span><b>{task.title}</b><small style={{ display: "block", color: "#9fb0c5" }}>{task.difficulty}</small></span></label>)}
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 20, flexWrap: "wrap" }}><button disabled={busy || !form.title.trim()} onClick={() => void save()} style={{ ...field, width: "auto", border: 0, background: palette.accent, color: palette.accentText, fontWeight: 700, cursor: "pointer" }}>{busy ? "Saving..." : editing ? "Save changes" : "Create competition"}</button><button onClick={() => { setForm(initial); setEditing(null); }} style={{ ...field, width: "auto", cursor: "pointer" }}>Clear</button></div>
      </section>
      <section style={card}><h2 style={{ marginTop: 0 }}>Existing competitions</h2>{busy && !items.length ? <p>Loading...</p> : !items.length ? <p style={{ color: "#9fb0c5" }}>No competitions created yet.</p> : items.map(item => <article key={item.id} style={{ borderTop: "1px solid #304159", padding: "16px 0", display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}><div><b>{item.title}</b><div style={{ color: "#9fb0c5", fontSize: 13 }}>{item.slug} · {item.status} · {item.taskIds?.length || 0} tasks</div></div><div style={{ display: "flex", gap: 8 }}><button onClick={() => edit(item)} style={{ ...field, width: "auto", cursor: "pointer" }}>Edit</button><button onClick={() => void remove(item)} style={{ ...field, width: "auto", cursor: "pointer", borderColor: "#9f4054" }}>Delete</button></div></article>)}</section>
    </div>
  </main>;
}
