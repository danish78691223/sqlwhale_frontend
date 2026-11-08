"use client";

import { useEffect, useState } from "react";
import { api } from "@/services/api";

type Competition = { id: string; title: string; status: string };
type Entry = { rank: number; name: string; completedTasks: number; points: number };
export default function CompetitionLeaderboard() {
  const [items, setItems] = useState<Competition[]>([]);
  const [selected, setSelected] = useState("");
  const [rows, setRows] = useState<Entry[]>([]);
  const [finalized, setFinalized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => { api.get("/competitions").then(r => { const list = r.data.competitions || []; setItems(list); if (list[0]) setSelected(list[0].id); }).catch(() => setError("Unable to load competitions.")).finally(() => setLoading(false)); }, []);
  useEffect(() => { if (!selected) return; let active = true; setLoading(true); api.get("/competitions/" + encodeURIComponent(selected) + "/leaderboard").then(r => { if (!active) return; setRows(r.data.top10 || []); setFinalized(Boolean(r.data.finalized)); setError(""); }).catch(e => { if (active) { setRows([]); setError(e?.response?.data?.error || "Leaderboard unavailable."); } }).finally(() => { if (active) setLoading(false); }); return () => { active = false; }; }, [selected]);
  return <section style={{ maxWidth: 1120, margin: "32px auto", padding: "24px", border: "1px solid var(--border, #26364d)", borderRadius: 18 }}>
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
      <div><span style={{ fontSize: 11, letterSpacing: ".14em" }}>COMPETITION RANKINGS</span><h2 style={{ margin: "6px 0" }}>Challenge leaderboard</h2><p style={{ margin: 0, opacity: .7 }}>Rankings are based on challenge points and completed tasks.</p></div>
      {items.length > 0 && <select aria-label="Choose competition" value={selected} onChange={e => setSelected(e.target.value)} style={{ padding: "10px 12px", borderRadius: 9, maxWidth: "100%" }}>{items.map(x => <option key={x.id} value={x.id}>{x.title}</option>)}</select>}
    </div>
    {finalized && <p style={{ fontSize: 12, marginTop: 14 }}>Final ranking · frozen by the organizer</p>}
    {loading ? <p>Loading leaderboard…</p> : error ? <p role="alert">{error}</p> : rows.length === 0 ? <p>No correct submissions yet.</p> : <div style={{ marginTop: 16, display: "grid", gap: 8 }}>{rows.map(row => <div key={row.rank} style={{ display: "grid", gridTemplateColumns: "56px 1fr auto", alignItems: "center", gap: 12, padding: 13, borderRadius: 10, background: "var(--card, rgba(120,140,160,.08))" }}><strong>#{row.rank}</strong><div><strong>{row.name}</strong><div style={{ fontSize: 12, opacity: .7 }}>{row.completedTasks} tasks completed</div></div><strong>{row.points} pts</strong></div>)}</div>}
  </section>;
}
