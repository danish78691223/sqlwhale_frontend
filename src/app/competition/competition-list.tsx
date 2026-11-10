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
  const [registrationMessage, setRegistrationMessage] = useState("");
  const [isLight, setIsLight] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const syncTheme = () => setIsLight(document.documentElement.getAttribute("data-theme") === "light");
    syncTheme();
    const observer = new MutationObserver(syncTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "class"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!registrationMessage) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setRegistrationMessage("");
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [registrationMessage]);

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
    if (registered[item.id]) { router.push("/run-query?competition=" + encodeURIComponent(item.id)); return; }
    setBusy(item.id); setError(""); setRegistrationMessage("");
    try {
      await api.post("/competitions/" + item.id + "/register");
      setRegistered(old => ({ ...old, [item.id]: true }));
      router.push("/run-query?competition=" + encodeURIComponent(item.id));
    } catch (e: any) { setRegistrationMessage(e?.response?.data?.error || "Unable to register."); }
    finally { setBusy(null); }
  }

  const date = (value?: string | null) => value ? new Date(value).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) : "To be announced";
  const palette = isLight
    ? { section: "#f5f7fb", text: "#172033", muted: "#64748b", surface: "#ffffff", surfaceAlt: "#f8fafc", border: "#e2e8f0", accent: "#087ea4", accentSoft: "#e8f7fc" }
    : { section: "#080d18", text: "#edf4ff", muted: "#a5b5ca", surface: "#111d30", surfaceAlt: "#0c1728", border: "#263b56", accent: "#55d4ed", accentSoft: "#123047" };

  function descriptionBlocks(value: string) {
    const normalized = value.replace(/\\n/g, "\n").replace(/\r\n/g, "\n");
    const lines = normalized.split("\n").map(line => line.trim()).filter(Boolean);
    return lines.map((line, index) => {
      const clean = line.replace(/\*\*/g, "").trim();
      const isBullet = /^[-*•]\s+/.test(clean);
      const content = clean.replace(/^[-*•]\s+/, "");
      const isHeading = /:$/.test(content) || /^(Competition Highlights|How to Participate|Important|SQL Challenge|Challenge Highlights)$/i.test(content);
      if (isHeading) return <h4 key={index}>{content.replace(/:$/, "")}</h4>;
      if (isBullet) return <p className="swc-event-bullet" key={index}><span>✓</span>{content}</p>;
      return <p key={index}>{content}</p>;
    });
  }

  return <section className="swc-events" style={{ background: palette.section, color: palette.text }} aria-busy={loading}>
    {registrationMessage && <div className="swc-registration-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setRegistrationMessage(""); }}>
      <div className="swc-registration-modal" role="alertdialog" aria-modal="true" aria-describedby="swc-registration-message">
        <button className="swc-registration-modal-close" type="button" aria-label="Close message" onClick={() => setRegistrationMessage("")}>×</button>
        <p id="swc-registration-message">{registrationMessage}</p>
        <button className="swc-registration-modal-action" type="button" onClick={() => setRegistrationMessage("")}>OK</button>
      </div>
    </div>}
    <div className="swc-wrap">
      <div className="swc-events-heading">
        <div><div className="swc-kicker">OFFICIAL SQLWHALE EVENTS</div><h2>Competitions</h2><p>Choose an event, register with your SQLWhale account and solve its assigned tasks.</p></div>
        {!authenticated && <Link className="swc-account-link" href="/signup">Create your SQLWhale account <span>↗</span></Link>}
      </div>
      {error && <p className="swc-event-error" role="alert">{error}</p>}
      {loading ? <div className="swc-event-state is-loading"><span>Loading competitions…</span><div className="swc-event-skeleton" aria-hidden="true"><i/><i/><i/></div></div> : items.length === 0 ? <div className="swc-event-state">No published competitions right now. Please check back soon.</div> :
        <div className="swc-event-grid">
          {items.map((item, index) => <article className="swc-event-card" key={item.id} style={{ animationDelay: (index * 70) + "ms" }}>
            <div className="swc-event-card-top"><span className={"swc-event-status " + item.status}>{item.status}</span><span className="swc-event-count">{item.taskCount} SQL tasks</span></div>
            <div className="swc-event-card-mark">SQL<span>WHALE</span><i>· 2026 CHALLENGE</i></div>
            <h3>{item.title}</h3>
            <div className="swc-event-description">{descriptionBlocks(item.description || "A hands-on SQL challenge hosted on SQLWhale.")}</div>
            <div className="swc-event-dates"><div><span>STARTS</span><b>{date(item.startsAt)}</b></div><div><span>ENDS</span><b>{date(item.endsAt)}</b></div></div>
            <button className={"swc-event-join " + (registered[item.id] ? "registered" : "")} disabled={busy === item.id || item.status === "completed" || item.status === "archived"} onClick={() => void join(item)}>
              {busy === item.id ? "Registering…" : registered[item.id] ? "Open Competition Workspace  →" : authenticated ? "Register for Competition  →" : "Login to Register  →"}
            </button>
          </article>)}
        </div>}
    </div>
  </section>;
}
