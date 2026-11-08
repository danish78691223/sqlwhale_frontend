"use client";

import { useState } from "react";
import { api } from "@/services/api";

type Row = { rank: number; name: string; email?: string; completedTasks: number; points: number };

export default function AdminCompetitionResults({ competitionId, status, isDark = false }: { competitionId: string; status: string; isDark?: boolean }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [finalized, setFinalized] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");

  const ink = isDark ? "#e2e8f0" : "#243247";
  const muted = isDark ? "#9fb0c5" : "#64748b";
  const panel = isDark ? "#0b1525" : "#ffffff";
  const line = isDark ? "#334155" : "#e2e8f0";
  const button: React.CSSProperties = {
    appearance: "none", border: "1px solid " + line, borderRadius: 9, padding: "8px 11px",
    background: panel, color: ink, fontSize: 12, fontWeight: 700, cursor: "pointer",
  };
  const disabledButton: React.CSSProperties = { opacity: .48, cursor: "not-allowed" };
  const th: React.CSSProperties = {
    padding: "10px 11px", color: muted, fontSize: 10, fontWeight: 850, textTransform: "uppercase",
    letterSpacing: ".06em", whiteSpace: "nowrap", borderBottom: "1px solid " + line,
  };
  const td: React.CSSProperties = { padding: "11px", color: ink, fontSize: 12, borderBottom: "1px solid " + line };

  async function load() {
    setBusy(true); setNotice("");
    try {
      const r = await api.get("/admin/competitions/" + competitionId + "/results");
      setRows(r.data.ranking || []);
      setFinalized(Boolean(r.data.competition?.finalizedAt));
      setLoaded(true);
    } catch (e: any) {
      setNotice(e?.response?.data?.error || "Unable to load results.");
    } finally { setBusy(false); }
  }

  async function finalize() {
    if (!window.confirm("Freeze the current ranking? New submissions will not change the official result snapshot.")) return;
    setBusy(true);
    try {
      await api.post("/admin/competitions/" + competitionId + "/finalize");
      setNotice("Final ranking frozen. The official result snapshot is now locked.");
      await load();
    } catch (e: any) {
      setNotice(e?.response?.data?.error || "Unable to finalize ranking.");
    } finally { setBusy(false); }
  }

  async function approve() {
    if (!window.confirm("Approve certificates for the configured top winners?")) return;
    setBusy(true);
    try {
      const r = await api.post("/admin/competitions/" + competitionId + "/approve-winners");
      setNotice(r.data.message || (r.data.approvedCount + " winner certificates approved."));
    } catch (e: any) {
      setNotice(e?.response?.data?.error || "Unable to approve winners.");
    } finally { setBusy(false); }
  }

  return <div style={{ color: ink }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
      <div>
        <div style={{ fontSize: 12, fontWeight: 850, color: ink }}>Participants & results</div>
        <div style={{ fontSize: 11, color: muted, marginTop: 3 }}>{loaded ? rows.length + " participant(s) in the current ranking" : "View submissions, freeze the final ranking and approve certificates."}</div>
      </div>
      <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
        <button type="button" disabled={busy} onClick={() => void load()} style={{ ...button, ...(busy ? disabledButton : {}) }}>{busy ? "Working…" : loaded ? "↻ Refresh results" : "View results"}</button>
        {loaded && <>
          <button type="button" disabled={busy || finalized || status !== "completed"} onClick={() => void finalize()} style={{ ...button, ...(busy || finalized || status !== "completed" ? disabledButton : {}) }}>{finalized ? "✓ Ranking frozen" : "Freeze ranking"}</button>
          <button type="button" disabled={busy || !finalized} onClick={() => void approve()} style={{ ...button, background: "#087ea4", borderColor: "#087ea4", color: "#ffffff", ...(busy || !finalized ? disabledButton : {}) }}>Approve top winners</button>
        </>}
      </div>
    </div>
    {status !== "completed" && loaded && <p style={{ margin: "12px 0 0", color: muted, fontSize: 11 }}>Final ranking can be frozen after the competition status is set to completed.</p>}
    {notice && <div role="status" style={{ marginTop: 12, padding: "9px 11px", borderRadius: 8, background: panel, border: "1px solid " + line, color: ink, fontSize: 12 }}>{notice}</div>}
    {loaded && <div style={{ overflowX: "auto", marginTop: 13, border: "1px solid " + line, borderRadius: 10, background: panel }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, minWidth: 520 }}>
        <thead><tr><th align="left" style={th}>Rank</th><th align="left" style={th}>Participant</th><th align="left" style={th}>Email</th><th align="right" style={th}>Tasks</th><th align="right" style={th}>Points</th></tr></thead>
        <tbody>{rows.map(row => <tr key={row.rank}>
          <td style={{ ...td, fontWeight: 800, color: row.rank <= 3 ? (isDark ? "#67d6ed" : "#087ea4") : ink }}>#{row.rank}</td>
          <td style={{ ...td, fontWeight: 700 }}>{row.name}</td>
          <td style={{ ...td, color: muted }}>{row.email || "—"}</td>
          <td align="right" style={td}>{row.completedTasks}</td>
          <td align="right" style={{ ...td, fontWeight: 850 }}>{row.points}</td>
        </tr>)}</tbody>
      </table>
      {!rows.length && <div style={{ padding: 22, textAlign: "center", color: muted, fontSize: 12 }}>No participant submissions are available yet.</div>}
    </div>}
  </div>;
}
