"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "../../services/api";

type Item = { id: string; title: string; slug: string; description?: string; status: string; taskCount: number; startsAt?: string | null; endsAt?: string | null; registrationStartsAt?: string | null; registrationEndsAt?: string | null; points?: { Easy: number; Medium: number; Hard: number } };

export default function CompetitionList() {
  const [items, setItems] = useState<Item[]>([]);
  const [authenticated, setAuthenticated] = useState(false);
  const [registered, setRegistered] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    let active = true;
    Promise.all([api.get("/competitions"), api.get("/auth/me").catch(() => null)]).then(([list, session]) => {
      if (!active) return;
      const competitions = list.data.competitions || [];
      setItems(competitions);
      const user = Boolean(session?.data?.authenticated);
      setAuthenticated(user);
      if (user) {
        Promise.all(competitions.map((item: Item) => api.get("/competitions/" + item.id).then(r => [item.id, Boolean(r.data.isRegistered)] as const).catch(() => [item.id, false] as const)))
          .then(entries => { if (active) setRegistered(Object.fromEntries(entries)); });
      }
    }).catch((e: any) => { if (active) setError(e?.response?.data?.error || "Unable to load competitions."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  async function join(item: Item) {
    if (!authenticated) { router.push("/login?next=" + encodeURIComponent("/competition")); return; }
    setBusy(item.id); setError("");
    try {
      await api.post("/competitions/" + item.id + "/register");
      setRegistered(old => ({ ...old, [item.id]: true }));
      router.push("/run-query?competition=" + encodeURIComponent(item.id));
    } catch (e: any) { setError(e?.response?.data?.error || "Unable to register."); }
    finally { setBusy(null); }
  }

  const date = (value?: string | null) => value ? new Date(value).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) : "To be announced";
  return <section style={{ background: "#07111f", color: "#e5edf7", padding: "44px 20px" }}>
    <div style={{ maxWidth: 1120, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: 16, flexWrap: "wrap" }}>
        <div><div style={{ color: "#55cbe8", letterSpacing: 2, fontSize: 12, fontWeight: 700 }}>OFFICIAL SQLWHALE EVENTS</div><h2 style={{ fontSize: 30, margin: "8px 0" }}>Competitions</h2><p style={{ color: "#a8b7c9", margin: 0 }}>Choose an event, register with your SQLWhale account and solve its assigned tasks.</p></div>
        {!authenticated && <Link href="/signup" style={{ color: "#63d5ee" }}>Create SQLWhale account →</Link>}
      </div>
      {error && <p role="alert" style={{ color: "#ff9aa9", marginTop: 18 }}>{error}</p>}
      {loading ? <p style={{ color: "#a8b7c9", marginTop: 24 }}>Loading competitions…</p> : items.length === 0 ? <p style={{ color: "#a8b7c9", marginTop: 24 }}>No published competitions right now. Please check back soon.</p> :
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 16, marginTop: 24 }}>
          {items.map(item => <article key={item.id} style={{ background: "#101d30", border: "1px solid #263c56", borderRadius: 16, padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}><span style={{ color: "#5ed4ed", fontSize: 12, fontWeight: 700 }}>{item.status.toUpperCase()}</span><span style={{ color: "#a8b7c9", fontSize: 12 }}>{item.taskCount} tasks</span></div>
            <h3 style={{ fontSize: 21, margin: "14px 0 8px" }}>{item.title}</h3>
            <p style={{ color: "#a8b7c9", minHeight: 48 }}>{item.description || "A hands-on SQL challenge hosted on SQLWhale."}</p>
            <div style={{ color: "#c4d1df", fontSize: 13, lineHeight: 1.8 }}><div>Starts: {date(item.startsAt)}</div><div>Ends: {date(item.endsAt)}</div></div>
            <button disabled={busy === item.id || item.status === "completed" || item.status === "archived"} onClick={() => void join(item)} style={{ width: "100%", marginTop: 18, padding: "12px 14px", border: 0, borderRadius: 10, background: registered[item.id] ? "#1c806f" : "#12b5d8", color: "#061522", fontWeight: 800, cursor: "pointer", opacity: busy === item.id ? .65 : 1 }}>
              {busy === item.id ? "Registering…" : registered[item.id] ? "Registered · Open Run Query" : authenticated ? "Register for Competition" : "Login to Register"}
            </button>
          </article>)}
        </div>}
    </div>
  </section>;
}
