"use client";

import { useEffect, useState } from "react";
import { api } from "@/services/api";
type Certificate = { certificateId: string; competitionTitle: string; rank: number; issuedAt: string; verificationUrl: string };
export default function MyCompetitionCertificates() {
  const [items, setItems] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.get("/certificate/competition/mine").then(r => setItems(r.data.certificates || [])).catch(() => setItems([])).finally(() => setLoading(false)); }, []);
  return <section className="account-dashboard-section">
    <div className="account-history-header"><div><span className="account-card-label">ACHIEVEMENTS</span><h2>My Competition Certificates</h2></div><span className="account-history-count">{items.length} issued</span></div>
    {loading ? <div className="account-history-empty">Loading certificates…</div> : !items.length ? <div className="account-history-empty">No competition certificates issued yet. Approved winner certificates will appear here.</div> : <div className="account-history-list">{items.map(item => <div className="account-history-item" key={item.certificateId}><div className="account-history-main"><strong>{item.competitionTitle}</strong><span>Rank #{item.rank} · Issued {new Date(item.issuedAt).toLocaleDateString("en-IN")}</span><code>SQLW-{item.certificateId}</code></div><div className="account-history-meta"><a href={item.verificationUrl}>Verify certificate ↗</a></div></div>)}</div>}
  </section>;
}
