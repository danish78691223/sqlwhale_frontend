"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { api } from "../../../services/api";
import { ArrowLeft, RefreshCw, Users, Eye, Activity, Bell, Monitor, Smartphone, Tablet, Globe2 } from "lucide-react";

type Analytics = {
  range: { days: number; timezone: string };
  summary: { pageViews: number; uniqueVisitors: number; visitorDays: number };
  daily: { date: string; views: number; visitors: number }[];
  topPages: { path: string; views: number; visitors: number }[];
  devices: { device: string; count: number }[];
  browsers: { browser: string; count: number }[];
  live: { activeVisitors: number; visitors: { path: string; lastSeen: string }[] };
  push: { total: number; dailyEnabled: number; announcementsEnabled: number };
};

const number = (value: number) => new Intl.NumberFormat("en-IN").format(value || 0);

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<Analytics | null>(null);
  const [days, setDays] = useState(7);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const response = await api.get("/analytics/overview", { params: { days } });
      setData(response.data);
    } catch (err: any) {
      setError(err?.response?.data?.error || "Unable to load analytics. Check admin login and backend deployment.");
    } finally { setLoading(false); }
  }, [days]);

  useEffect(() => { void load(); }, [load]);

  const maxViews = Math.max(1, ...(data?.daily || []).map((item) => item.views));
  const maxDevice = Math.max(1, ...(data?.devices || []).map((item) => item.count));

  return (
    <main className="sqlwhale-admin-page">
      <header className="sqlwhale-admin-navbar"><div className="sqlwhale-admin-navbar-inner">
        <Link href="/admin" className="sqlwhale-admin-logo"><ArrowLeft size={20} /><span><strong>SQL</strong>Whale Admin</span></Link>
        <span className="sqlwhale-admin-nav-badge">WEBSITE ANALYTICS</span>
      </div></header>
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div><div className="mb-2 text-xs font-bold tracking-[.18em] text-cyan-500">SQLWHALE / ADMIN</div><h1 className="text-3xl font-bold">Website Analytics</h1><p className="mt-2 text-sm opacity-65">Visitor activity, traffic and push subscription insights · India Standard Time</p></div>
          <div className="flex gap-2">
            <select aria-label="Date range" value={days} onChange={(e) => setDays(Number(e.target.value))} className="rounded-xl border border-current/15 bg-transparent px-3 py-2 text-sm"><option value={7}>Last 7 days</option><option value={30}>Last 30 days</option><option value={90}>Last 90 days</option></select>
            <button onClick={() => void load()} disabled={loading} className="flex items-center gap-2 rounded-xl border border-current/15 px-3 py-2 text-sm"><RefreshCw size={15} className={loading ? "animate-spin" : ""}/> Refresh</button>
          </div>
        </div>
        {error && <div role="alert" className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-600">{error}</div>}
        {loading && !data ? <div className="rounded-2xl border border-current/10 p-10 text-center opacity-60">Loading analytics…</div> : data && <>
          <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[{label:"Page views",value:data.summary.pageViews,icon:Eye},{label:"Unique visitors",value:data.summary.uniqueVisitors,icon:Users},{label:"Active now (5 min)",value:data.live.activeVisitors,icon:Activity},{label:"Push subscribers",value:data.push.total,icon:Bell}].map((card) => { const Icon=card.icon; return <div key={card.label} className="rounded-2xl border border-current/10 p-5"><div className="mb-4 flex items-center justify-between text-sm opacity-65"><span>{card.label}</span><Icon size={18}/></div><div className="text-3xl font-bold tabular-nums">{number(card.value)}</div></div>; })}
          </div>
          <div className="mb-6 grid gap-5 xl:grid-cols-[1.6fr_1fr]">
            <section className="rounded-2xl border border-current/10 p-5"><h2 className="mb-5 font-semibold">Traffic overview</h2><div className="flex h-52 items-end gap-2">{data.daily.map((item) => <div key={item.date} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2"><span className="text-[10px] opacity-65">{item.views}</span><div title={item.date + ": " + item.views + " views"} className="w-full rounded-t-md bg-cyan-500/80" style={{height: Math.max(3, item.views / maxViews * 145)}}/><span className="text-[9px] opacity-60">{item.date.slice(5)}</span></div>)}</div><p className="mt-4 text-xs opacity-55">Unique visitors in range: {number(data.summary.uniqueVisitors)} · Visitor-days: {number(data.summary.visitorDays)}</p></section>
            <section className="rounded-2xl border border-current/10 p-5"><h2 className="mb-5 font-semibold">Devices</h2>{data.devices.length ? <div className="space-y-4">{data.devices.map((item) => <div key={item.device}><div className="mb-1 flex justify-between text-sm"><span className="capitalize">{item.device}</span><b>{number(item.count)}</b></div><div className="h-2 overflow-hidden rounded-full bg-current/10"><div className="h-full rounded-full bg-cyan-500" style={{width: (item.count / maxDevice * 100) + "%"}}/></div></div>)}</div> : <p className="text-sm opacity-55">No device data yet.</p>}</section>
          </div>
          <div className="grid gap-5 xl:grid-cols-2">
            <section className="rounded-2xl border border-current/10 p-5"><h2 className="mb-4 font-semibold">Top pages</h2>{data.topPages.length ? <div className="space-y-3">{data.topPages.map((item) => <div key={item.path} className="flex items-center justify-between gap-3 border-b border-current/10 pb-3 text-sm"><span className="min-w-0 truncate">{item.path}</span><span className="shrink-0 font-semibold">{number(item.views)} views</span></div>)}</div> : <p className="text-sm opacity-55">No page views recorded yet.</p>}</section>
            <section className="rounded-2xl border border-current/10 p-5"><h2 className="mb-4 font-semibold">Browser & push insights</h2><div className="mb-4 flex flex-wrap gap-2">{data.browsers.map((item) => <span key={item.browser} className="rounded-lg bg-current/5 px-3 py-2 text-xs">{item.browser}: {number(item.count)}</span>)}</div><div className="grid grid-cols-3 gap-2 border-t border-current/10 pt-4 text-center"><div><div className="text-xl font-bold">{number(data.push.total)}</div><div className="text-[11px] opacity-60">Subscriptions</div></div><div><div className="text-xl font-bold">{number(data.push.dailyEnabled)}</div><div className="text-[11px] opacity-60">Daily enabled</div></div><div><div className="text-xl font-bold">{number(data.push.announcementsEnabled)}</div><div className="text-[11px] opacity-60">Announcements</div></div></div></section>
          </div>
          <section className="mt-5 rounded-2xl border border-current/10 p-5"><div className="mb-4 flex items-center gap-2"><Activity size={18}/><h2 className="font-semibold">Currently active visitors</h2><span className="rounded-full bg-emerald-500/10 px-2 py-1 text-xs text-emerald-600">{data.live.activeVisitors} active</span></div>{data.live.visitors.length ? <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{data.live.visitors.map((visitor,index) => <div key={index} className="flex items-center justify-between rounded-xl bg-current/5 px-3 py-2 text-sm"><span className="truncate">{visitor.path}</span><span className="ml-2 shrink-0 text-xs opacity-55">{new Date(visitor.lastSeen).toLocaleTimeString("en-IN")}</span></div>)}</div> : <p className="text-sm opacity-55">No visitors active in the last 5 minutes.</p>}</section>
        </>}
        <p className="mt-6 text-xs opacity-50">Analytics are collected for public pages only. Admin routes are excluded; visitor identifiers are pseudonymous and IP addresses are not stored.</p>
      </div>
    </main>
  );
}
