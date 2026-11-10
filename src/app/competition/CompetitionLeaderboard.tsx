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
  return <section className="swc-leaderboard">
    <div className="swc-leaderboard-head">
      <div><span className="swc-kicker">COMPETITION RANKINGS</span><h2>Challenge leaderboard</h2><p>Rankings are based on challenge points and completed tasks.</p></div>
      {items.length > 0 && <select aria-label="Choose competition" value={selected} onChange={e => setSelected(e.target.value)}>{items.map(x => <option key={x.id} value={x.id}>{x.title}</option>)}</select>}
    </div>
    {finalized && <p className="swc-leaderboard-final">Final ranking · frozen by the organizer</p>}
    {loading ? <div className="swc-leaderboard-loading" aria-live="polite"><span>Loading leaderboard…</span><div className="swc-leaderboard-skeleton" aria-hidden="true"><i/><i/><i/></div></div> : error ? <p className="swc-leaderboard-message" role="alert">{error}</p> : rows.length === 0 ? <p className="swc-leaderboard-message">No correct submissions yet.</p> :
      <div className="swc-leaderboard-scroll" role="region" aria-label="Challenge leaderboard" tabIndex={0}>
        <table className="swc-leaderboard-table">
          <thead><tr><th scope="col" aria-label="Rank"/><th scope="col" aria-label="Participant"/><th scope="col" aria-label="Tasks completed"/><th scope="col" aria-label="Points"/></tr></thead>
          <tbody>{rows.map(row => <tr key={row.rank}>
            <td><span className={"swc-rank-badge" + (row.rank === 1 ? " rank-gold" : row.rank === 2 ? " rank-silver" : row.rank === 3 ? " rank-bronze" : "")}>#{row.rank}</span></td>
            <td><strong>{row.name}</strong></td>
            <td><span className="swc-completed-count">{row.completedTasks} tasks completed</span></td>
            <td><strong className="swc-leaderboard-points">{row.points} pts</strong></td>
          </tr>)}</tbody>
        </table>
      </div>}
  </section>;
}
