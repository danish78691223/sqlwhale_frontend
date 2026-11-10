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
  const [activeView, setActiveView] = useState<"create" | "workspace">("create");
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
    setActiveView("create");
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
      resetForm(); await load(); setFormOpen(false); setActiveView("workspace");
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

  const stepPill = (number: string, heading: string, detail: string) => (
    <div className="cm-step">
      <span className="cm-step-number">{number}</span>
      <span><strong>{heading}</strong><small>{detail}</small></span>
    </div>
  );

  return <main className="cm-page" data-theme={isDark ? "dark" : "light"}>
    <style jsx>{`
      .cm-page{--cm-bg:#f4f7fb;--cm-surface:#fff;--cm-subtle:#f8fafc;--cm-text:#172033;--cm-muted:#68778d;--cm-border:#e4eaf2;--cm-border-strong:#cbd5e1;--cm-accent:#087ea4;--cm-accent-soft:#e8f7fc;--cm-shadow:0 12px 32px rgba(15,23,42,.045);min-height:100vh;padding:34px 22px 76px;background:var(--cm-bg);color:var(--cm-text);font-family:Inter,ui-sans-serif,system-ui,sans-serif;transition:background .2s,color .2s}
      .cm-page[data-theme=dark]{--cm-bg:#07111f;--cm-surface:#111c2e;--cm-subtle:#0b1525;--cm-text:#e2e8f0;--cm-muted:#9fb0c5;--cm-border:#26364d;--cm-border-strong:#334155;--cm-accent:#22c4e8;--cm-accent-soft:#123047;--cm-shadow:0 18px 45px rgba(0,0,0,.16)}
      .cm-shell{max-width:1360px;margin:0 auto}
      .cm-layout{display:grid;grid-template-columns:220px minmax(0,1fr);align-items:start;gap:20px}
      .cm-content{min-width:0}
      .cm-sidebar{position:sticky;top:18px;padding:13px;border:1px solid var(--cm-border);border-radius:15px;background:var(--cm-surface);box-shadow:var(--cm-shadow)}
      .cm-sidebar-label{padding:8px 9px 11px;color:var(--cm-muted);font-size:9px;font-weight:900;letter-spacing:.13em;text-transform:uppercase}
      .cm-nav-item{display:flex;width:100%;align-items:center;gap:10px;padding:12px 11px;margin:3px 0;border:1px solid transparent;border-radius:10px;background:transparent;color:var(--cm-muted);text-align:left;font:inherit;font-size:11px;font-weight:800;cursor:pointer;transition:background .15s,border .15s,color .15s}
      .cm-nav-item:hover{background:var(--cm-subtle);color:var(--cm-text)}
      .cm-nav-item.active{border-color:var(--cm-accent);background:var(--cm-accent-soft);color:var(--cm-accent)}
      .cm-nav-icon{display:grid;place-items:center;width:27px;height:27px;border-radius:8px;background:var(--cm-subtle);font-size:14px}
      .cm-nav-item.active .cm-nav-icon{background:var(--cm-surface)}
      .cm-nav-help{margin:12px 5px 3px;padding:11px 9px;border-top:1px solid var(--cm-border);color:var(--cm-muted);font-size:9px;line-height:1.55}
      .cm-topline{display:flex;justify-content:space-between;align-items:center;gap:16px;margin-bottom:24px}
      .cm-back{color:var(--cm-accent);font-size:13px;font-weight:750;text-decoration:none}
      .cm-refresh{display:inline-flex;align-items:center;gap:9px;padding:10px 14px;border:1px solid var(--cm-border-strong);border-radius:10px;background:var(--cm-surface);color:var(--cm-text);font-size:12px;font-weight:750;cursor:pointer}
      .cm-hero{display:flex;align-items:flex-end;justify-content:space-between;gap:22px;margin:0 0 26px}
      .cm-kicker{display:flex;align-items:center;gap:8px;color:var(--cm-accent);font-size:10px;font-weight:850;letter-spacing:.16em;text-transform:uppercase}
      .cm-kicker:before{content:"";width:19px;height:2px;background:var(--cm-accent);border-radius:9px}
      .cm-hero h1{margin:9px 0 7px;font-size:clamp(27px,3.2vw,38px);line-height:1.07;letter-spacing:-.055em;font-weight:850}
      .cm-hero p{max-width:660px;margin:0;color:var(--cm-muted);font-size:13px;line-height:1.65}
      .cm-hero-mark{display:flex;align-items:center;gap:10px;padding:12px 15px;border:1px solid var(--cm-border);border-radius:13px;background:var(--cm-surface);box-shadow:var(--cm-shadow);white-space:nowrap}
      .cm-hero-mark span:first-child{display:grid;place-items:center;width:36px;height:36px;border-radius:10px;background:var(--cm-accent-soft);font-size:19px}
      .cm-hero-mark strong{display:block;font-size:12px}.cm-hero-mark small{display:block;margin-top:3px;color:var(--cm-muted);font-size:10px}
      .cm-alert{display:flex;align-items:center;gap:10px;margin-bottom:18px;padding:12px 15px;border:1px solid;border-radius:11px;font-size:12px;font-weight:700}
      .cm-alert.success{border-color:#91d5bc;background:#ecfdf5;color:#065f46}.cm-alert.error{border-color:#e6a0ad;background:#fff1f2;color:#9f1239}
      .cm-stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:13px;margin-bottom:25px}
      .cm-stat{position:relative;overflow:hidden;display:flex;align-items:center;gap:13px;min-width:0;padding:17px 18px;border:1px solid var(--cm-border);border-radius:15px;background:var(--cm-surface);box-shadow:var(--cm-shadow)}
      .cm-stat-icon{display:grid;place-items:center;flex:none;width:40px;height:40px;border-radius:12px;background:var(--cm-accent-soft);color:var(--cm-accent);font-size:17px;font-weight:850}
      .cm-stat small{display:block;color:var(--cm-muted);font-size:11px;font-weight:700}.cm-stat strong{display:block;margin-top:3px;font-size:25px;line-height:1.1;letter-spacing:-.05em}
      .cm-stat:after{position:absolute;right:-18px;bottom:-30px;width:86px;height:86px;border:1px solid var(--cm-border);border-radius:50%;content:"";opacity:.55}
      .cm-main-grid{display:grid;grid-template-columns:minmax(0,1fr) 285px;align-items:start;gap:19px}
      .cm-card{min-width:0;border:1px solid var(--cm-border);border-radius:17px;background:var(--cm-surface);box-shadow:var(--cm-shadow)}
      .cm-builder{overflow:hidden}
      .cm-card-head{display:flex;justify-content:space-between;align-items:center;gap:14px;padding:20px 23px;border-bottom:1px solid var(--cm-border)}
      .cm-card-head h2,.cm-section-title{margin:0;font-size:16px;font-weight:850;letter-spacing:-.035em}
      .cm-card-head p{margin:5px 0 0;color:var(--cm-muted);font-size:11px;line-height:1.5}
      .cm-head-label{padding:6px 9px;border:1px solid var(--cm-border);border-radius:8px;background:var(--cm-subtle);color:var(--cm-muted);font-size:10px;font-weight:800;white-space:nowrap}
      .cm-form-body{padding:22px 23px}
      .cm-stepper{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px;margin-bottom:24px}
      .cm-step{display:flex;align-items:center;gap:10px;min-width:0;padding:11px 12px;border:1px solid var(--cm-border);border-radius:11px;background:var(--cm-subtle)}
      .cm-step-number{display:grid;place-items:center;flex:none;width:29px;height:29px;border-radius:9px;background:var(--cm-accent-soft);color:var(--cm-accent);font-size:11px;font-weight:900}
      .cm-step strong{display:block;font-size:11px}.cm-step small{display:block;margin-top:3px;color:var(--cm-muted);font-size:9px;line-height:1.3}
      .cm-form-section+.cm-form-section{margin-top:24px;padding-top:23px;border-top:1px solid var(--cm-border)}
      .cm-section-top{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:15px}
      .cm-section-title{font-size:14px}.cm-section-copy{margin:5px 0 0;color:var(--cm-muted);font-size:11px;line-height:1.5}
      .cm-field-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}
      .cm-field-grid.four{grid-template-columns:repeat(4,minmax(0,1fr))}
      .cm-field{display:block;min-width:0}.cm-field-label{display:flex;justify-content:space-between;align-items:center;gap:7px;margin-bottom:7px;color:var(--cm-muted);font-size:10px;font-weight:800}
      .cm-input{width:100%;min-width:0;box-sizing:border-box;min-height:43px;padding:10px 12px;border:1px solid var(--cm-border-strong);border-radius:9px;outline:none;background:var(--cm-subtle);color:var(--cm-text);font:inherit;font-size:12px;transition:border .15s,box-shadow .15s}
      .cm-input:focus{border-color:var(--cm-accent);box-shadow:0 0 0 3px color-mix(in srgb,var(--cm-accent) 13%,transparent)}
      .cm-input::placeholder{color:var(--cm-muted);opacity:.75}.cm-textarea{min-height:83px;resize:vertical;line-height:1.5}
      .cm-field-hint{display:block;margin-top:6px;color:var(--cm-muted);font-size:10px;line-height:1.4}
      .cm-task-toolbar{display:flex;align-items:center;gap:9px;flex-wrap:wrap;margin:14px 0 10px}
      .cm-task-toolbar .cm-input-search{flex:1 1 190px}
      .cm-btn{display:inline-flex;align-items:center;justify-content:center;gap:7px;min-height:38px;padding:9px 12px;border:1px solid var(--cm-border-strong);border-radius:9px;background:var(--cm-surface);color:var(--cm-text);font-size:11px;font-weight:800;cursor:pointer;transition:transform .15s,border .15s,background .15s}
      .cm-btn:hover:not(:disabled){border-color:var(--cm-accent);transform:translateY(-1px)}
      .cm-btn:disabled{opacity:.55;cursor:not-allowed}
      .cm-btn-primary{border-color:var(--cm-accent);background:var(--cm-accent);color:#fff}
      .cm-page[data-theme=dark] .cm-btn-primary{color:#06202a}
      .cm-btn-quiet{background:transparent}
      .cm-counter{display:inline-flex;align-items:center;gap:6px;padding:7px 10px;border-radius:8px;background:var(--cm-accent-soft);color:var(--cm-accent);font-size:10px;font-weight:900;white-space:nowrap}
      .cm-points{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-top:15px}
      .cm-point{padding:12px;border:1px solid var(--cm-border);border-radius:11px;background:var(--cm-subtle)}
      .cm-point label{display:flex;justify-content:space-between;gap:6px;margin-bottom:8px;font-size:10px;font-weight:850}
      .cm-point label span{color:var(--cm-muted);font-size:9px;font-weight:650}
      .cm-point .cm-input{min-height:38px;background:var(--cm-surface)}
      .cm-task-box{overflow:hidden;border:1px solid var(--cm-border);border-radius:12px}
      .cm-task-box-head{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:10px 13px;background:var(--cm-subtle);color:var(--cm-muted);font-size:9px;font-weight:850;letter-spacing:.08em}
      .cm-task-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;max-height:330px;overflow:auto;padding:10px;background:var(--cm-surface)}
      .cm-task-option{display:flex;align-items:flex-start;gap:9px;min-width:0;padding:11px;border:1px solid var(--cm-border);border-radius:10px;background:var(--cm-surface);cursor:pointer;transition:border .15s,background .15s}
      .cm-task-option:hover{border-color:var(--cm-accent)}.cm-task-option.selected{border-color:var(--cm-accent);background:var(--cm-accent-soft)}
      .cm-task-option input{width:15px;height:15px;flex:none;margin:2px 0 0;accent-color:var(--cm-accent)}
      .cm-task-option-copy{flex:1;min-width:0}.cm-task-option-copy strong{display:block;font-size:10px;line-height:1.45;font-weight:800}
      .cm-level{display:inline-flex;margin-top:7px;padding:3px 7px;border-radius:5px;font-size:9px;font-weight:900}
      .cm-level.easy{background:#dcfce7;color:#15803d}.cm-level.medium{background:#fef3c7;color:#a16207}.cm-level.hard{background:#ffe4e6;color:#be123c}
      .cm-task-check{color:var(--cm-accent);font-size:13px;font-weight:900}
      .cm-sticky-actions{position:sticky;bottom:12px;z-index:2;display:flex;justify-content:space-between;align-items:center;gap:12px;margin:20px -5px -5px;padding:12px 13px;border:1px solid var(--cm-border);border-radius:12px;background:var(--cm-surface);box-shadow:0 8px 24px rgba(15,23,42,.1)}
      .cm-sticky-actions small{color:var(--cm-muted);font-size:10px;font-weight:700}
      .cm-action-group{display:flex;gap:8px;flex-wrap:wrap}
      .cm-side{display:grid;gap:13px}
      .cm-side-card{padding:17px 18px}
      .cm-side-title{margin:0 0 12px;font-size:12px;font-weight:850}
      .cm-checkline{display:flex;align-items:flex-start;gap:9px;margin:10px 0;color:var(--cm-muted);font-size:10px;line-height:1.5}
      .cm-checkline span:first-child{color:var(--cm-accent);font-weight:900}
      .cm-preview-title{margin:12px 0 5px;font-size:17px;font-weight:850;letter-spacing:-.035em;overflow-wrap:anywhere}
      .cm-preview-copy{margin:0;color:var(--cm-muted);font-size:10px;line-height:1.5;overflow-wrap:anywhere}
      .cm-preview-meta{display:flex;gap:7px;flex-wrap:wrap;margin-top:12px}
      .cm-preview-meta span{padding:5px 7px;border:1px solid var(--cm-border);border-radius:6px;color:var(--cm-muted);font-size:9px;font-weight:750}
      .cm-score-row{display:flex;justify-content:space-between;gap:10px;padding:8px 0;border-bottom:1px solid var(--cm-border);font-size:10px}
      .cm-score-row:last-child{border:0}.cm-score-row span{color:var(--cm-muted)}
      .cm-workspace{margin-top:24px;padding:21px 23px}
      .cm-workspace-head{display:flex;justify-content:space-between;align-items:flex-start;gap:14px;margin-bottom:15px}
      .cm-tabs{display:flex;gap:5px;overflow-x:auto;padding:5px 0 12px;border-bottom:1px solid var(--cm-border)}
      .cm-tab{flex:none;padding:8px 10px;border:1px solid transparent;border-radius:8px;background:transparent;color:var(--cm-muted);font-size:10px;font-weight:850;cursor:pointer}
      .cm-tab.active{border-color:var(--cm-accent);background:var(--cm-accent-soft);color:var(--cm-accent)}
      .cm-event{padding:17px 0;border-bottom:1px solid var(--cm-border)}.cm-event:last-child{border-bottom:0}
      .cm-event-head{display:flex;justify-content:space-between;gap:12px;align-items:flex-start;flex-wrap:wrap}
      .cm-event-title{margin:0;font-size:14px;font-weight:850;letter-spacing:-.025em;overflow-wrap:anywhere}
      .cm-event-slug{margin:5px 0 0;color:var(--cm-muted);font-size:10px;overflow-wrap:anywhere}
      .cm-event-meta{display:flex;gap:12px;flex-wrap:wrap;margin-top:10px;color:var(--cm-muted);font-size:10px;font-weight:700}
      .cm-status{display:inline-flex;padding:5px 8px;border-radius:99px;font-size:9px;font-weight:900;text-transform:uppercase;letter-spacing:.04em}
      .cm-empty{padding:42px 15px;text-align:center}.cm-empty-icon{display:grid;place-items:center;width:48px;height:48px;margin:0 auto 12px;border-radius:14px;background:var(--cm-accent-soft);font-size:21px}
      .cm-empty strong{font-size:12px}.cm-empty p{margin:6px 0 0;color:var(--cm-muted);font-size:10px}
      @media(max-width:1040px){.cm-layout{grid-template-columns:190px minmax(0,1fr)}.cm-main-grid{grid-template-columns:minmax(0,1fr) 245px}.cm-field-grid.four{grid-template-columns:repeat(2,minmax(0,1fr))}}
      @media(max-width:800px){.cm-layout{grid-template-columns:1fr;gap:13px}.cm-sidebar{position:static;display:flex;align-items:center;gap:6px;padding:8px;overflow-x:auto}.cm-sidebar-label,.cm-nav-help{display:none}.cm-nav-item{width:auto;flex:none;margin:0;padding:8px 10px}.cm-nav-icon{width:24px;height:24px}.cm-main-grid{grid-template-columns:1fr}.cm-side{grid-template-columns:repeat(2,minmax(0,1fr))}.cm-stats{grid-template-columns:repeat(2,minmax(0,1fr))}.cm-hero{align-items:flex-start}.cm-hero-mark{display:none}}
      @media(max-width:560px){.cm-page{padding:22px 13px 55px}.cm-topline{margin-bottom:19px}.cm-hero h1{font-size:28px}.cm-stats{gap:8px}.cm-stat{padding:13px 11px;gap:9px}.cm-stat-icon{width:34px;height:34px}.cm-stat strong{font-size:21px}.cm-form-body{padding:17px 14px}.cm-card-head{padding:17px 14px}.cm-stepper{grid-template-columns:1fr;gap:7px}.cm-step{padding:9px 10px}.cm-field-grid,.cm-field-grid.four{grid-template-columns:1fr}.cm-task-list{grid-template-columns:1fr;max-height:360px}.cm-points{gap:7px}.cm-point{padding:9px}.cm-sticky-actions{align-items:stretch;flex-direction:column;bottom:7px}.cm-action-group{width:100%}.cm-action-group .cm-btn{flex:1}.cm-side{grid-template-columns:1fr}.cm-workspace{padding:17px 14px}}
    `}</style>
    <div className="cm-shell">
      <div className="cm-topline">
        <Link href="/admin" className="cm-back">← Admin control panel</Link>
        <button type="button" onClick={() => void load()} disabled={busy} className="cm-refresh">↻ {busy ? "Refreshing…" : "Refresh data"}</button>
      </div>

      <header className="cm-hero">
        <div>
          <div className="cm-kicker">SQLWhale / Admin workspace</div>
          <h1>Competition management</h1>
          <p>Build SQL competitions, select challenge tasks, configure scoring and manage every event from one workspace.</p>
        </div>
        <div className="cm-hero-mark"><span>🏆</span><div><strong>Competition studio</strong><small>Plan · Publish · Manage</small></div></div>
      </header>

      {(error || message) && <div role="status" className={`cm-alert ${error ? "error" : "success"}`}><span>{error ? "!" : "✓"}</span>{error || message}</div>}

      <div className="cm-layout">
        <aside className="cm-sidebar" aria-label="Competition navigation">
          <div className="cm-sidebar-label">Manage competitions</div>
          <button type="button" onClick={() => { setActiveView("create"); setEditing(null); }} className={`cm-nav-item ${activeView === "create" ? "active" : ""}`}>
            <span className="cm-nav-icon">＋</span><span>Create competition</span>
          </button>
          <button type="button" onClick={() => setActiveView("workspace")} className={`cm-nav-item ${activeView === "workspace" ? "active" : ""}`}>
            <span className="cm-nav-icon">▦</span><span>Competitions workspace</span>
          </button>
          <div className="cm-nav-help">Create and configure SQL challenges, or switch to the workspace to manage existing events.</div>
        </aside>
        <div className="cm-content">
          {activeView === "workspace" && <>
      <section className="cm-stats" aria-label="Competition overview">
        {statItems.map(stat => <div key={stat.label} className="cm-stat"><span className="cm-stat-icon">{stat.icon}</span><div><small>{stat.label}</small><strong>{stat.value}</strong></div></div>)}
      </section>
          </>}
          {activeView === "create" && <>
      <div className="cm-main-grid">
        <section className="cm-card cm-builder">
          <div className="cm-card-head">
            <div><h2>{editing ? "Edit competition" : "Create a competition"}</h2><p>{editing ? "Update the event configuration and save your changes." : "Follow the steps below to set up a participant-ready SQL challenge."}</p></div>
            <span className="cm-head-label">{editing ? "EDIT MODE" : "NEW EVENT"}</span>
          </div>

          <div className="cm-form-body">
            <div className="cm-stepper">
              {stepPill("01", "Event details", "Identity and visibility")}
              {stepPill("02", "Schedule", "Registration and timing")}
              {stepPill("03", "Tasks & scoring", "Challenges and points")}
            </div>

            <section className="cm-form-section">
              <div className="cm-section-top"><div><h3 className="cm-section-title">01 / Event details</h3><p className="cm-section-copy">Start with a clear title and a simple participant-facing overview.</p></div></div>
              <div className="cm-field-grid">
                <label className="cm-field"><span className="cm-field-label">Competition title <b>*</b></span><input className="cm-input" value={form.title} onChange={e => update("title", e.target.value)} placeholder="e.g. SQLWhale Global SQL Challenge" /></label>
                <label className="cm-field"><span className="cm-field-label">URL slug <b>*</b></span><input className="cm-input" value={form.slug} onChange={e => update("slug", e.target.value)} placeholder="sqlwhale-global-sql-challenge" /><small className="cm-field-hint">Used in the public competition link.</small></label>
                <label className="cm-field"><span className="cm-field-label">Competition status</span><select className="cm-input" value={form.status} onChange={e => update("status", e.target.value)}>{["draft","scheduled","live","completed","archived"].map(x => <option key={x} value={x}>{x.charAt(0).toUpperCase() + x.slice(1)}</option>)}</select></label>
                <label className="cm-field"><span className="cm-field-label">Winner certificates <span>TOP N</span></span><input className="cm-input" type="number" min="0" max="100" value={form.certificateTopN} onChange={e => update("certificateTopN", Number(e.target.value))} /><small className="cm-field-hint">Number of top-ranked participants eligible for certificates.</small></label>
              </div>
              <label className="cm-field" style={{marginTop:14}}><span className="cm-field-label">Competition description</span><textarea className="cm-input cm-textarea" value={form.description} onChange={e => update("description", e.target.value)} placeholder="Explain the challenge, who can participate and what participants will work on…" /></label>
            </section>

            <section className="cm-form-section">
              <div className="cm-section-top"><div><h3 className="cm-section-title">02 / Registration & schedule</h3><p className="cm-section-copy">Set separate registration and competition windows. Times use your browser's local timezone.</p></div></div>
              <div className="cm-field-grid four">
                {([[ "registrationStartsAt", "Registration opens" ],[ "registrationEndsAt", "Registration closes" ],[ "startsAt", "Competition starts" ],[ "endsAt", "Competition ends" ]] as const).map(([key, title]) => <label key={key} className="cm-field"><span className="cm-field-label">{title}</span><input className="cm-input" type="datetime-local" value={form[key]} onChange={e => update(key, e.target.value)} /></label>)}
              </div>
            </section>

            <section className="cm-form-section">
              <div className="cm-section-top">
                <div><h3 className="cm-section-title">03 / SQL tasks & scoring</h3><p className="cm-section-copy">Choose from active tasks. Existing tasks are linked to the competition, never duplicated.</p></div>
                <span className="cm-counter">✓ {selectedTasks.length} selected</span>
              </div>
              <div className="cm-points">
                {(["Easy","Medium","Hard"] as const).map(level => <div className="cm-point" key={level}><label>{level}<span>POINTS</span></label><input className="cm-input" type="number" min="0" value={form.points[level]} onChange={e => setForm(old => ({...old,points:{...old.points,[level]:Number(e.target.value)}}))} /></div>)}
              </div>

              <div className="cm-task-toolbar">
                <input className="cm-input cm-input-search" value={taskSearch} onChange={e => setTaskSearch(e.target.value)} placeholder="⌕  Search task titles…" aria-label="Search SQL tasks" />
                <select className="cm-input" style={{width:130}} value={taskDifficulty} onChange={e => setTaskDifficulty(e.target.value)} aria-label="Filter by difficulty"><option>All</option><option>Easy</option><option>Medium</option><option>Hard</option></select>
                <button type="button" onClick={() => update("taskIds", Array.from(new Set([...form.taskIds,...filteredTasks.map(t=>t.id)])))} className="cm-btn">Select filtered</button>
                <button type="button" onClick={() => update("taskIds", [])} className="cm-btn cm-btn-quiet">Clear</button>
              </div>

              <div className="cm-task-box">
                <div className="cm-task-box-head"><span>AVAILABLE CHALLENGES · {filteredTasks.length}</span><span>{selectedTasks.length} SELECTED</span></div>
                <div className="cm-task-list">
                  {filteredTasks.map(task => {
                    const checked = form.taskIds.includes(task.id);
                    const tone = task.difficulty.toLowerCase();
                    return <label key={task.id} className={`cm-task-option ${checked ? "selected" : ""}`}>
                      <input type="checkbox" checked={checked} onChange={() => toggleTask(task.id)} />
                      <span className="cm-task-option-copy"><strong>{task.title}</strong><span className={`cm-level ${tone}`}>{task.difficulty}</span></span>
                      {checked && <span className="cm-task-check">✓</span>}
                    </label>;
                  })}
                  {!filteredTasks.length && <div className="cm-empty" style={{gridColumn:"1 / -1"}}><div className="cm-empty-icon">⌕</div><strong>{activeTasks.length ? "No matching tasks" : "No active tasks available"}</strong><p>{activeTasks.length ? "Try another search term or difficulty filter." : "Add or activate tasks in Manage Tasks first."}</p></div>}
                </div>
              </div>
            </section>

            <div className="cm-sticky-actions">
              <small>{selectedTasks.length} challenge task{selectedTasks.length === 1 ? "" : "s"} included</small>
              <div className="cm-action-group">
                <button type="button" onClick={resetForm} className="cm-btn">Reset form</button>
                <button type="button" disabled={busy || !form.title.trim() || !form.slug.trim()} onClick={() => void save()} className="cm-btn cm-btn-primary">{busy ? "Saving…" : editing ? "Save changes →" : "Create competition →"}</button>
              </div>
            </div>
          </div>
        </section>

      </div>
          </>}

          {activeView === "workspace" && <section className="cm-card cm-workspace">
        <div className="cm-workspace-head">
          <div><h2 className="cm-section-title" style={{fontSize:18}}>Competition workspace</h2><p className="cm-section-copy">Review event status, update configurations and manage participant results and winner approvals.</p></div>
          <span className="cm-head-label">{items.length} EVENT{items.length === 1 ? "" : "S"}</span>
        </div>
        <div className="cm-tabs">
          {[[ "all","All",counts.total ],[ "draft","Draft",items.filter(x=>x.status==="draft").length ],[ "scheduled","Scheduled",counts.scheduled ],[ "live","Live",counts.live ],[ "completed","Completed",counts.completed ],[ "archived","Archived",items.filter(x=>x.status==="archived").length ]].map(([key,title,count]) => <button key={String(key)} type="button" onClick={() => setActiveTab(String(key))} className={`cm-tab ${activeTab === key ? "active" : ""}`}>{title} <span>({count})</span></button>)}
        </div>
        {busy && !items.length ? <div className="cm-empty"><div className="cm-empty-icon">↻</div><strong>Loading competitions…</strong></div> : !visibleItems.length ? <div className="cm-empty"><div className="cm-empty-icon">▦</div><strong>No competitions in this view</strong><p>Create a competition or select another status filter.</p></div> : visibleItems.map(item => {
          const tone = statusStyles[item.status] || statusStyles.draft;
          return <article key={item.id} className="cm-event">
            <div className="cm-event-head">
              <div style={{minWidth:0,flex:"1 1 280px"}}>
                <div style={{display:"flex",alignItems:"center",gap:9,flexWrap:"wrap"}}><h3 className="cm-event-title">{item.title}</h3><span className="cm-status" style={{color:tone.color,background:tone.bg}}>{item.status}</span></div>
                <p className="cm-event-slug">/{item.slug}</p>
                <div className="cm-event-meta"><span>▤ {item.taskIds?.length || 0} tasks</span>{item.registrationStartsAt && <span>Registration: {new Date(item.registrationStartsAt).toLocaleDateString()}</span>}{item.startsAt && <span>Starts: {new Date(item.startsAt).toLocaleString()}</span>}{item.endsAt && <span>Ends: {new Date(item.endsAt).toLocaleString()}</span>}</div>
              </div>
              <div className="cm-action-group"><button type="button" onClick={() => edit(item)} className="cm-btn">Edit</button><button type="button" onClick={() => void remove(item)} className="cm-btn" style={{color:"#be123c",borderColor:"#e6a0ad"}}>Delete</button></div>
            </div>
            <div style={{marginTop:13,padding:13,borderRadius:11,background:"var(--cm-subtle)",border:"1px solid var(--cm-border)"}}><AdminCompetitionResults competitionId={item.id} status={item.status} isDark={isDark} /></div>
          </article>;
        })}
          </section>}
        </div>
      </div>
    </div>
  </main>;
}
