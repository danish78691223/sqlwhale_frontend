"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { api } from "../../../services/api";
import AdminCompetitionResults from "./AdminCompetitionResults";

type TaskOption = { id: string; title: string; difficulty: "Easy" | "Medium" | "Hard"; isActive: boolean };
type Competition = { id: string; title: string; slug: string; description?: string; status: string; taskIds: string[]; startsAt?: string | null; endsAt?: string | null; registrationStartsAt?: string | null; registrationEndsAt?: string | null; points?: { Easy: number; Medium: number; Hard: number }; certificateTopN?: number };

const initial = { title: "", slug: "", description: "", status: "draft", taskIds: [] as string[], registrationStartsAt: "", registrationEndsAt: "", startsAt: "", endsAt: "", points: { Easy: 5, Medium: 10, Hard: 15 }, certificateTopN: 3 };
const statusStyles: Record<string, { color: string; bg: string }> = {
  draft: { color: "#64748b", bg: "#f1f5f9" },
  scheduled: { color: "#9a6700", bg: "#fff4d6" },
  live: { color: "#087443", bg: "#dcfce7" },
  completed: { color: "#075985", bg: "#e0f2fe" },
  archived: { color: "#64748b", bg: "#e2e8f0" },
};

export default function AdminCompetitionsPage() {
  const [tasks, setTasks] = useState<TaskOption[]>([]);
  const [items, setItems] = useState<Competition[]>([]);
  const [form, setForm] = useState(initial);
  const [editing, setEditing] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isDark, setIsDark] = useState(false);
  const [taskSearch, setTaskSearch] = useState("");
  const [taskDifficulty, setTaskDifficulty] = useState("All");
  const [activeTab, setActiveTab] = useState("all");
  const [formOpen, setFormOpen] = useState(true);

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
  const activeTasks = useMemo(() => tasks.filter(t => t.isActive), [tasks]);
  const filteredTasks = useMemo(() => activeTasks.filter(t =>
    (taskDifficulty === "All" || t.difficulty === taskDifficulty) &&
    t.title.toLowerCase().includes(taskSearch.toLowerCase().trim())
  ), [activeTasks, taskDifficulty, taskSearch]);
  const counts = useMemo(() => ({
    total: items.length,
    live: items.filter(x => x.status === "live").length,
    scheduled: items.filter(x => x.status === "scheduled").length,
    completed: items.filter(x => x.status === "completed").length,
  }), [items]);
  const visibleItems = useMemo(() => items.filter(x => activeTab === "all" || x.status === activeTab), [items, activeTab]);

  function update<K extends keyof typeof initial>(key: K, value: (typeof initial)[K]) { setForm(old => ({ ...old, [key]: value })); }
  function toggleTask(id: string) { update("taskIds", form.taskIds.includes(id) ? form.taskIds.filter(x => x !== id) : [...form.taskIds, id]); }
  function resetForm() { setForm(initial); setEditing(null); setTaskSearch(""); setTaskDifficulty("All"); }
  function edit(item: Competition) {
    setEditing(item.id);
    setForm({
      ...initial, title: item.title, slug: item.slug, description: item.description || "", status: item.status,
      taskIds: item.taskIds || [], startsAt: item.startsAt ? new Date(item.startsAt).toISOString().slice(0,16) : "",
      endsAt: item.endsAt ? new Date(item.endsAt).toISOString().slice(0,16) : "",
      registrationStartsAt: item.registrationStartsAt ? new Date(item.registrationStartsAt).toISOString().slice(0,16) : "",
      registrationEndsAt: item.registrationEndsAt ? new Date(item.registrationEndsAt).toISOString().slice(0,16) : "",
      points: item.points || initial.points, certificateTopN: item.certificateTopN ?? initial.certificateTopN,
    });
    setFormOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  async function save() {
    if (!form.title.trim() || !form.slug.trim()) { setError("Add a competition title and URL slug before saving."); return; }
    setBusy(true); setError(""); setMessage("");
    try {
      const payload = { ...form, registrationStartsAt: form.registrationStartsAt || null, registrationEndsAt: form.registrationEndsAt || null, startsAt: form.startsAt || null, endsAt: form.endsAt || null };
      if (editing) await api.patch("/admin/competitions/" + editing, payload);
      else await api.post("/admin/competitions", payload);
      setMessage(editing ? "Competition updated successfully." : "Competition created successfully.");
      resetForm(); await load(); setFormOpen(false);
    } catch (e: any) { setError(e?.response?.data?.error || "Unable to save competition."); }
    finally { setBusy(false); }
  }
  async function remove(item: Competition) {
    if (!window.confirm("Delete " + item.title + "? Registration and submission history are retained, but the competition itself will be removed.")) return;
    setBusy(true);
    try { await api.delete("/admin/competitions/" + item.id); setMessage("Competition deleted."); await load(); }
    catch (e: any) { setError(e?.response?.data?.error || "Unable to delete competition."); }
    finally { setBusy(false); }
  }

  const palette = isDark
    ? { page: "#07111f", surface: "#111c2e", surfaceAlt: "#0b1525", input: "#0b1220", border: "#26364d", borderStrong: "#334155", text: "#e2e8f0", muted: "#9fb0c5", accent: "#22c4e8", accentText: "#06202a", selected: "#123047", shadow: "0 18px 45px rgba(0,0,0,.18)" }
    : { page: "#f4f7fb", surface: "#ffffff", surfaceAlt: "#f8fafc", input: "#ffffff", border: "#e2e8f0", borderStrong: "#cbd5e1", text: "#172033", muted: "#64748b", accent: "#087ea4", accentText: "#ffffff", selected: "#e8f7fc", shadow: "0 12px 32px rgba(15,23,42,.05)" };
  const field: React.CSSProperties = { width: "100%", minWidth: 0, boxSizing: "border-box", padding: "11px 13px", borderRadius: 10, border: "1px solid " + palette.borderStrong, background: palette.input, color: palette.text, font: "inherit", outlineOffset: 2 };
  const card: React.CSSProperties = { background: palette.surface, border: "1px solid " + palette.border, borderRadius: 16, padding: 22, color: palette.text, boxShadow: palette.shadow };
  const label: React.CSSProperties = { display: "block", fontSize: 12, fontWeight: 700, color: palette.muted, marginBottom: 7, letterSpacing: ".01em" };
  const secondary: React.CSSProperties = { padding: "10px 13px", border: "1px solid " + palette.borderStrong, background: palette.surface, color: palette.text, borderRadius: 10, cursor: "pointer", fontWeight: 650, fontSize: 13 };
  const primary: React.CSSProperties = { ...secondary, border: "1px solid " + palette.accent, background: palette.accent, color: palette.accentText, padding: "11px 16px" };
  const sectionTitle: React.CSSProperties = { fontSize: 16, fontWeight: 800, letterSpacing: "-.02em", margin: "0 0 14px" };
  const statItems = [
    { label: "Total competitions", value: counts.total, icon: "▦" },
    { label: "Live now", value: counts.live, icon: "●" },
    { label: "Scheduled", value: counts.scheduled, icon: "◷" },
    { label: "Completed", value: counts.completed, icon: "✓" },
  ];

  return <main data-theme={isDark ? "dark" : "light"} style={{ minHeight: "100vh", background: palette.page, color: palette.text, padding: "30px 20px 72px", fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif", transition: "background .2s ease, color .2s ease" }}>
    <div style={{ maxWidth: 1160, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap", marginBottom: 24 }}>
        <div>
          <Link href="/admin" style={{ color: palette.accent, textDecoration: "none", fontWeight: 750, fontSize: 13 }}>← Admin Control Panel</Link>
          <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ width: 44, height: 44, display: "grid", placeItems: "center", borderRadius: 13, background: palette.selected, color: palette.accent, fontSize: 21 }}>🏆</span>
            <div><div style={{ color: palette.accent, fontSize: 10, fontWeight: 850, letterSpacing: ".14em", textTransform: "uppercase" }}>SQLWhale · Admin workspace</div><h1 style={{ fontSize: 29, lineHeight: 1.15, letterSpacing: "-.045em", margin: "4px 0 0" }}>Competition Manager</h1></div>
          </div>
          <p style={{ color: palette.muted, margin: "8px 0 0", maxWidth: 640, fontSize: 14 }}>Create SQL challenges, manage registrations, track performance and approve winner certificates.</p>
        </div>
        <button type="button" onClick={() => void load()} disabled={busy} style={secondary}>↻ &nbsp; {busy ? "Refreshing…" : "Refresh data"}</button>
      </div>

      {(error || message) && <div role="status" style={{ padding: "12px 15px", borderRadius: 11, marginBottom: 18, border: "1px solid " + (error ? "#e6a0ad" : "#91d5bc"), background: error ? (isDark ? "#3b1a28" : "#fff1f2") : (isDark ? "#12352e" : "#ecfdf5"), color: error ? (isDark ? "#fecdd3" : "#9f1239") : (isDark ? "#a7f3d0" : "#065f46"), fontSize: 13, fontWeight: 650 }}>{error || message}</div>}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12, marginBottom: 22 }}>
        {statItems.map((stat, i) => <div key={stat.label} style={{ ...card, padding: "17px 18px", display: "flex", alignItems: "center", gap: 13 }}>
          <span style={{ width: 38, height: 38, display: "grid", placeItems: "center", borderRadius: 11, background: palette.selected, color: palette.accent, fontSize: 18, fontWeight: 800 }}>{stat.icon}</span>
          <div><div style={{ color: palette.muted, fontSize: 12, fontWeight: 650 }}>{stat.label}</div><div style={{ fontSize: 24, lineHeight: 1.2, fontWeight: 850, letterSpacing: "-.04em", marginTop: 3 }}>{stat.value}</div></div>
        </div>)}
      </div>

      <section style={{ ...card, marginBottom: 22, padding: 0, overflow: "hidden" }}>
        <button type="button" onClick={() => setFormOpen(x => !x)} aria-expanded={formOpen} style={{ display: "flex", width: "100%", alignItems: "center", justifyContent: "space-between", gap: 14, padding: "19px 22px", cursor: "pointer", border: 0, background: "transparent", color: palette.text, textAlign: "left" }}>
          <span><span style={{ display: "block", fontSize: 17, fontWeight: 850 }}>{editing ? "Edit competition" : "Create a competition"}</span><span style={{ display: "block", fontSize: 12, color: palette.muted, marginTop: 4 }}>{editing ? "Update event details, schedule, tasks and scoring." : "Set up an event and choose the SQL tasks participants will solve."}</span></span>
          <span style={{ color: palette.accent, fontSize: 13, fontWeight: 800, whiteSpace: "nowrap" }}>{formOpen ? "Hide form ↑" : editing ? "Continue editing ↓" : "+ New competition"}</span>
        </button>
        {formOpen && <>
          <div style={{ height: 1, background: palette.border }} />
          <div style={{ padding: 22 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
              {["1  Event details", "2  Schedule", "3  Tasks & scoring"].map((x, i) => <span key={x} style={{ padding: "7px 10px", borderRadius: 8, background: palette.surfaceAlt, color: palette.muted, fontSize: 11, fontWeight: 750 }}>{x}</span>)}
            </div>
            <h2 style={sectionTitle}>Event details</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(215px,1fr))", gap: 13 }}>
              <label><span style={label}>Competition title *</span><input style={field} value={form.title} onChange={e => update("title", e.target.value)} placeholder="SQLWhale SQL Challenge 2026" /></label>
              <label><span style={label}>URL slug *</span><input style={field} value={form.slug} onChange={e => update("slug", e.target.value)} placeholder="sqlwhale-sql-challenge-2026" /></label>
              <label><span style={label}>Competition status</span><select style={field} value={form.status} onChange={e => update("status", e.target.value)}>{["draft","scheduled","live","completed","archived"].map(x => <option key={x} value={x}>{x.charAt(0).toUpperCase() + x.slice(1)}</option>)}</select></label>
              <label><span style={label}>Winner certificates (top N)</span><input style={field} type="number" min="0" max="100" value={form.certificateTopN} onChange={e => update("certificateTopN", Number(e.target.value))} /></label>
            </div>
            <label style={{ display: "block", marginTop: 13 }}><span style={label}>Description</span><textarea style={{ ...field, minHeight: 78, resize: "vertical" }} value={form.description} onChange={e => update("description", e.target.value)} placeholder="What is this competition about? Add a short participant-facing overview." /></label>

            <div style={{ height: 1, background: palette.border, margin: "23px 0" }} />
            <h2 style={sectionTitle}>Registration & competition schedule</h2>
            <p style={{ color: palette.muted, fontSize: 12, margin: "-7px 0 13px" }}>Set the registration window and the time participants can start solving.</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(205px,1fr))", gap: 13 }}>
              {([[ "registrationStartsAt", "Registration opens" ],[ "registrationEndsAt", "Registration closes" ],[ "startsAt", "Competition starts" ],[ "endsAt", "Competition ends" ]] as const).map(([key, title], i) => <label key={key}><span style={label}>{title}</span><input style={field} type="datetime-local" value={form[key]} onChange={e => update(key, e.target.value)} /></label>)}
            </div>

            <div style={{ height: 1, background: palette.border, margin: "23px 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <div><h2 style={{ ...sectionTitle, marginBottom: 4 }}>SQL task selection</h2><p style={{ color: palette.muted, fontSize: 12, margin: 0 }}>Choose existing active tasks. Tasks are reused; no duplicate records are created.</p></div>
              <span style={{ color: palette.accent, background: palette.selected, padding: "7px 11px", borderRadius: 9, fontSize: 12, fontWeight: 800 }}>{selectedTasks.length} selected</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 10, marginTop: 14 }}>
              {(["Easy","Medium","Hard"] as const).map(level => <label key={level}><span style={label}>{level} points</span><input style={field} type="number" min="0" value={form.points[level]} onChange={e => setForm(old => ({ ...old, points: { ...old.points, [level]: Number(e.target.value) } }))} /></label>)}
            </div>
            <div style={{ display: "flex", gap: 9, flexWrap: "wrap", alignItems: "center", margin: "17px 0 10px" }}>
              <input style={{ ...field, flex: "1 1 230px" }} value={taskSearch} onChange={e => setTaskSearch(e.target.value)} placeholder="Search SQL tasks…" aria-label="Search SQL tasks" />
              <select style={{ ...field, width: "auto", minWidth: 130 }} value={taskDifficulty} onChange={e => setTaskDifficulty(e.target.value)} aria-label="Filter by difficulty"><option>All</option><option>Easy</option><option>Medium</option><option>Hard</option></select>
              <button type="button" onClick={() => update("taskIds", Array.from(new Set([...form.taskIds, ...filteredTasks.map(t => t.id)])))} style={secondary}>Select filtered</button>
              <button type="button" onClick={() => update("taskIds", [])} style={secondary}>Clear selection</button>
            </div>
            <div style={{ border: "1px solid " + palette.border, borderRadius: 12, overflow: "hidden" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, padding: "10px 13px", background: palette.surfaceAlt, color: palette.muted, fontSize: 11, fontWeight: 750 }}><span>AVAILABLE TASKS · {filteredTasks.length}</span><span>{selectedTasks.length} SELECTED</span></div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))", gap: 8, padding: 10, maxHeight: 290, overflowY: "auto" }}>
                {filteredTasks.map(task => {
                  const checked = form.taskIds.includes(task.id);
                  const tone = task.difficulty === "Easy" ? { color: "#15803d", bg: "#dcfce7" } : task.difficulty === "Medium" ? { color: "#a16207", bg: "#fef3c7" } : { color: "#be123c", bg: "#ffe4e6" };
                  return <label key={task.id} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: 12, border: "1px solid " + (checked ? palette.accent : palette.border), borderRadius: 10, background: checked ? palette.selected : palette.surface, cursor: "pointer" }}>
                    <input type="checkbox" checked={checked} onChange={() => toggleTask(task.id)} style={{ marginTop: 3, accentColor: palette.accent }} />
                    <span style={{ minWidth: 0, flex: 1 }}><b style={{ fontSize: 12, lineHeight: 1.45, display: "block" }}>{task.title}</b><span style={{ display: "inline-block", marginTop: 6, padding: "3px 7px", borderRadius: 6, background: tone.bg, color: tone.color, fontSize: 10, fontWeight: 800 }}>{task.difficulty}</span></span>
                    {checked && <span style={{ color: palette.accent, fontWeight: 900 }}>✓</span>}
                  </label>;
                })}
                {!filteredTasks.length && <p style={{ color: palette.muted, padding: 12, fontSize: 13, gridColumn: "1 / -1" }}>{activeTasks.length ? "No tasks match this search or difficulty filter." : "No active tasks available. Add or activate tasks in Manage Tasks first."}</p>}
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", marginTop: 20 }}>
              <span style={{ color: palette.muted, fontSize: 12 }}>{selectedTasks.length} task(s) will be included in this competition.</span>
              <div style={{ display: "flex", gap: 9, flexWrap: "wrap" }}><button type="button" onClick={resetForm} style={secondary}>Reset form</button><button type="button" disabled={busy || !form.title.trim() || !form.slug.trim()} onClick={() => void save()} style={{ ...primary, opacity: busy || !form.title.trim() || !form.slug.trim() ? .6 : 1 }}>{busy ? "Saving…" : editing ? "Save competition changes" : "Create competition →"}</button></div>
            </div>
          </div>
        </>}
      </section>

      <section style={card}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 14, flexWrap: "wrap", marginBottom: 15 }}>
          <div><h2 style={{ fontSize: 19, letterSpacing: "-.03em", margin: 0 }}>Competition workspace</h2><p style={{ color: palette.muted, fontSize: 12, margin: "5px 0 0" }}>Manage events, participant results and winner approvals in one place.</p></div>
          <span style={{ color: palette.muted, fontSize: 12, fontWeight: 700 }}>{items.length} event(s)</span>
        </div>
        <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 10, borderBottom: "1px solid " + palette.border, marginBottom: 6 }}>
          {[["all","All",counts.total],["draft","Draft",items.filter(x=>x.status==="draft").length],["scheduled","Scheduled",counts.scheduled],["live","Live",counts.live],["completed","Completed",counts.completed],["archived","Archived",items.filter(x=>x.status==="archived").length]].map(([key,title,count]) => <button key={key} type="button" onClick={() => setActiveTab(String(key))} style={{ ...secondary, whiteSpace: "nowrap", padding: "8px 11px", background: activeTab === key ? palette.selected : "transparent", color: activeTab === key ? palette.accent : palette.muted, borderColor: activeTab === key ? palette.accent : "transparent" }}>{title} <span style={{ opacity: .75 }}>({count})</span></button>)}
        </div>
        {busy && !items.length ? <p style={{ color: palette.muted, padding: 20 }}>Loading competitions…</p> : !visibleItems.length ? <div style={{ padding: "30px 12px", textAlign: "center" }}><div style={{ fontSize: 28, marginBottom: 8 }}>▦</div><b style={{ fontSize: 14 }}>No competitions in this view</b><p style={{ color: palette.muted, fontSize: 12, margin: "6px 0 0" }}>Create a competition or select another status filter.</p></div> : visibleItems.map(item => {
          const tone = statusStyles[item.status] || statusStyles.draft;
          return <article key={item.id} style={{ padding: "17px 0", borderBottom: "1px solid " + palette.border }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 15, flexWrap: "wrap" }}>
              <div style={{ minWidth: 0, flex: "1 1 300px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9, flexWrap: "wrap" }}><h3 style={{ margin: 0, fontSize: 15, letterSpacing: "-.02em" }}>{item.title}</h3><span style={{ borderRadius: 20, padding: "4px 8px", fontSize: 10, fontWeight: 850, color: tone.color, background: tone.bg, textTransform: "uppercase", letterSpacing: ".04em" }}>{item.status}</span></div>
                <p style={{ color: palette.muted, fontSize: 12, margin: "6px 0 0", overflowWrap: "anywhere" }}>{item.slug}</p>
                <div style={{ display: "flex", gap: 15, flexWrap: "wrap", marginTop: 10, color: palette.muted, fontSize: 11, fontWeight: 650 }}>
                  <span>▤ &nbsp;{item.taskIds?.length || 0} tasks</span>
                  {item.registrationStartsAt && <span>Registration: {new Date(item.registrationStartsAt).toLocaleDateString()}</span>}
                  {item.startsAt && <span>Starts: {new Date(item.startsAt).toLocaleString()}</span>}
                  {item.endsAt && <span>Ends: {new Date(item.endsAt).toLocaleString()}</span>}
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}><button type="button" onClick={() => edit(item)} style={secondary}>Edit</button><button type="button" onClick={() => void remove(item)} style={{ ...secondary, color: "#be123c", borderColor: "#e6a0ad" }}>Delete</button></div>
            </div>
            <div style={{ marginTop: 13, padding: 12, borderRadius: 12, background: palette.surfaceAlt, border: "1px solid " + palette.border }}><AdminCompetitionResults competitionId={item.id} status={item.status} isDark={isDark} /></div>
          </article>;
        })}
      </section>
    </div>
  </main>;
}
