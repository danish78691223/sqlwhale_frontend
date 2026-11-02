"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, BellRing, Send, Smartphone, Users, ShieldCheck, LoaderCircle, CheckCircle2, AlertCircle } from "lucide-react";
import { api } from "@/services/api";
import "./notifications.css";

export default function AdminNotificationsPage() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [url, setUrl] = useState("/run-query");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [testBusy, setTestBusy] = useState(false);

  async function sendTest() {
    setTestBusy(true); setMessage(""); setIsError(false);
    try {
      const response = await api.post("/push/test", {});
      if (!response.data.sent) {
        setIsError(true);
        setMessage(response.data.error || "No demo notification was delivered. Subscribe this device first.");
      } else setMessage("Demo sent to " + response.data.sent + " of " + response.data.attempted + " subscribed devices. Check your browser or device notifications.");
    } catch (error: any) {
      setIsError(true);
      setMessage(error?.response?.data?.error || error?.message || "Unable to send demo push.");
    } finally { setTestBusy(false); }
  }

  async function send(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!window.confirm("Send this announcement to all opted-in SQLWhale devices?")) return;
    setBusy(true); setMessage(""); setIsError(false);
    try {
      const response = await api.post("/push/announcement", { title: title.trim(), body: body.trim(), url: url.trim() });
      setMessage("Announcement sent to " + response.data.sent + " of " + response.data.attempted + " subscribed devices.");
      setTitle(""); setBody("");
    } catch (error: any) {
      setIsError(true);
      setMessage(error?.response?.data?.error || error?.message || "Unable to send announcement.");
    } finally { setBusy(false); }
  }

  return <main className="sqlwhale-notifications-page">
    <div className="sqlwhale-notifications-wrap">
      <Link href="/admin" className="sqlwhale-notifications-back"><ArrowLeft size={16} /> Back to admin dashboard</Link>
      <header className="sqlwhale-notifications-hero">
        <div className="sqlwhale-notifications-hero-icon"><BellRing size={24} /></div>
        <div>
          <span className="sqlwhale-notifications-eyebrow">SQLWHALE CONTROL CENTER</span>
          <h1>Push notifications</h1>
          <p>Test delivery to your own account or send an announcement to users who opted in.</p>
        </div>
        <span className="sqlwhale-notifications-secure"><ShieldCheck size={14} /> Admin only</span>
      </header>

      {message && <div className={"sqlwhale-notifications-feedback " + (isError ? "is-error" : "is-success")} role="status">
        {isError ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}<span>{message}</span>
      </div>}

      <div className="sqlwhale-notifications-grid">
        <section className="sqlwhale-notifications-card sqlwhale-notifications-test">
          <div className="sqlwhale-notifications-card-heading">
            <span className="sqlwhale-notifications-card-icon"><Smartphone size={20} /></span>
            <div><span className="sqlwhale-notifications-kicker">DELIVERY CHECK</span><h2>Test your device</h2></div>
          </div>
          <p>Send a private demo notification to devices registered to your SQLWhale account. This will not notify other users.</p>
          <button type="button" className="sqlwhale-notifications-primary" disabled={testBusy} onClick={() => void sendTest()}>
            {testBusy ? <LoaderCircle className="is-spinning" size={17} /> : <Send size={17} />}
            {testBusy ? "Sending test…" : "Send me a test notification"}
          </button>
          <div className="sqlwhale-notifications-note"><ShieldCheck size={15} /> Private test — only your subscribed devices</div>
        </section>

        <section className="sqlwhale-notifications-card">
          <div className="sqlwhale-notifications-card-heading">
            <span className="sqlwhale-notifications-card-icon is-violet"><Users size={20} /></span>
            <div><span className="sqlwhale-notifications-kicker">USER COMMUNICATION</span><h2>Broadcast announcement</h2></div>
          </div>
          <p className="sqlwhale-notifications-form-intro">Compose a short update for all users who have enabled SQLWhale notifications.</p>
          <form onSubmit={send} className="sqlwhale-notifications-form">
            <label>Notification title <span>Required</span>
              <input required maxLength={100} value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. New SQL challenges are live" />
              <small>{title.length}/100 characters</small>
            </label>
            <label>Message <span>Required</span>
              <textarea required maxLength={250} value={body} onChange={e => setBody(e.target.value)} placeholder="Write a clear, helpful message…" rows={4} />
              <small>{body.length}/250 characters</small>
            </label>
            <label>Destination URL
              <input required value={url} onChange={e => setUrl(e.target.value)} placeholder="/run-query" />
              <small>Use a path inside SQLWhale, such as /learn or /run-query.</small>
            </label>
            <button type="submit" className="sqlwhale-notifications-primary is-wide" disabled={busy || !title.trim() || !body.trim() || !url.trim()}>
              {busy ? <LoaderCircle className="is-spinning" size={17} /> : <Send size={17} />}
              {busy ? "Sending announcement…" : "Send announcement"}
            </button>
          </form>
          <div className="sqlwhale-notifications-warning">This sends to every opted-in device. Review the title and message before confirming.</div>
        </section>
      </div>
      <footer className="sqlwhale-notifications-footer">SQLWhale Push Center <span>•</span> Notifications are sent only to opted-in devices.</footer>
    </div>
  </main>;
}
