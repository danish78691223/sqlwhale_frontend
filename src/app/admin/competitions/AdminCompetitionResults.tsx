"use client";

import { useState } from "react";
import { api } from "@/services/api";
type Row = { rank: number; name: string; email?: string; completedTasks: number; points: number };
export default function AdminCompetitionResults({ competitionId, status }: { competitionId: string; status: string }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [finalized, setFinalized] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  async function load() { setBusy(true); setNotice(""); try { const r = await api.get("/admin/competitions/" + competitionId + "/results"); setRows(r.data.ranking || []); setFinalized(Boolean(r.data.competition?.finalizedAt)); setLoaded(true); } catch(e:any) { setNotice(e?.response?.data?.error || "Unable to load results."); } finally { setBusy(false); } }
  async function finalize() { if (!window.confirm("Freeze the current ranking? New submissions will not change the official result snapshot.")) return; setBusy(true); try { await api.post("/admin/competitions/" + competitionId + "/finalize"); setNotice("Final ranking frozen."); await load(); } catch(e:any) { setNotice(e?.response?.data?.error || "Unable to finalize ranking."); } finally { setBusy(false); } }
  async function approve() { if (!window.confirm("Approve certificates for the configured top winners?")) return; setBusy(true); try { const r = await api.post("/admin/competitions/" + competitionId + "/approve-winners"); setNotice(r.data.message || (r.data.approvedCount + " winner certificates approved.")); } catch(e:any) { setNotice(e?.response?.data?.error || "Unable to approve winners."); } finally { setBusy(false); } }
  return <div style={{ marginTop: 12, padding: 14, border: "1px solid #334155", borderRadius: 12 }}>
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      <button type="button" disabled={busy} onClick={() => void load()}>{busy ? "Working…" : loaded ? "Refresh results" : "View participants & results"}</button>
      {loaded && <><button type="button" disabled={busy || finalized || status !== "completed"} onClick={() => void finalize()}>{finalized ? "Ranking frozen" : "Finalize & freeze ranking"}</button><button type="button" disabled={busy || !finalized} onClick={() => void approve()}>Approve top winners</button></>}
    </div>
    {notice && <p role="status">{notice}</p>}
    {loaded && <div style={{ overflowX: "auto", marginTop: 10 }}><table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}><thead><tr><th align="left">Rank</th><th align="left">Participant</th><th align="left">Email</th><th align="right">Tasks</th><th align="right">Points</th></tr></thead><tbody>{rows.map(row => <tr key={row.rank}><td>#{row.rank}</td><td>{row.name}</td><td>{row.email || "—"}</td><td align="right">{row.completedTasks}</td><td align="right">{row.points}</td></tr>)}</tbody></table></div>}
  </div>;
}
