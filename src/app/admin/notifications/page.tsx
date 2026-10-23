"use client";
import { useState } from "react";
import Link from "next/link";
import { api } from "@/services/api";

export default function AdminNotificationsPage() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [url, setUrl] = useState("/run-query");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  async function send(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!window.confirm("Send this announcement to all opted-in SQLWhale devices?")) return;
    setBusy(true); setMessage("");
    try {
      const response = await api.post("/push/announcement", { title, body, url });
      setMessage(`Sent to ${response.data.sent} of ${response.data.attempted} subscribed devices.`);
    } catch (error: any) {
      setMessage(error?.response?.data?.error || error?.message || "Unable to send announcement.");
    } finally { setBusy(false); }
  }
  return <main style={{ maxWidth: 640, margin: "48px auto", padding: 20 }}>
    <Link href="/admin">← Admin dashboard</Link>
    <h1 style={{ fontSize: 28, fontWeight: 700, margin: "20px 0" }}>Send SQLWhale announcement</h1>
    <form onSubmit={send} style={{ display: "grid", gap: 16 }}>
      <label>Title<input required maxLength={100} value={title} onChange={e => setTitle(e.target.value)} style={{ display: "block", width: "100%", color: "#111", padding: 10 }} /></label>
      <label>Message<textarea required maxLength={250} value={body} onChange={e => setBody(e.target.value)} style={{ display: "block", width: "100%", color: "#111", padding: 10 }} /></label>
      <label>Destination<input required value={url} onChange={e => setUrl(e.target.value)} placeholder="/run-query" style={{ display: "block", width: "100%", color: "#111", padding: 10 }} /></label>
      <button type="submit" disabled={busy} style={{ background: "#1862fd", color: "white", borderRadius: 8, padding: 12 }}>{busy ? "Sending…" : "Send push announcement"}</button>
    </form>
    {message && <p role="status" style={{ marginTop: 16 }}>{message}</p>}
  </main>;
}
