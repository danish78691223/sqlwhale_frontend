"use client";
import { useEffect, useState } from "react";
import api from "@/services/api";

function decodeKey(base64: string) {
  const normalized = base64.replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "="));
  return Uint8Array.from(raw, char => char.charCodeAt(0));
}
export default function PushNotificationSettings() {
  const [supported, setSupported] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [daily, setDaily] = useState(true);
  const [announcements, setAnnouncements] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(() => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) return;
    setSupported(true);
    void navigator.serviceWorker.register("/sw.js").then(async registration => {
      const subscription = await registration.pushManager.getSubscription();
      setEnabled(Boolean(subscription));
    }).catch(() => setMessage("Unable to register notification service."));
  }, []);
  async function enable() {
    setBusy(true); setMessage("");
    try {
      const { data } = await api.get("/push/config");
      if (!data.enabled || !data.publicKey) throw new Error("Push is not configured on the server yet.");
      const permission = await Notification.requestPermission();
      if (permission !== "granted") throw new Error("Notification permission was not granted.");
      const registration = await navigator.serviceWorker.ready;
      let subscription = await registration.pushManager.getSubscription();
      if (!subscription) subscription = await registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: decodeKey(data.publicKey) });
      await api.post("/push/subscribe", { subscription: subscription.toJSON(), dailyEnabled: daily, announcementsEnabled: announcements });
      setEnabled(true); setMessage("Notifications enabled on this device.");
    } catch (error: any) { setMessage(error?.response?.data?.error || error?.message || "Unable to enable notifications."); }
    finally { setBusy(false); }
  }
  async function disable() {
    setBusy(true); setMessage("");
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        await api.post("/push/unsubscribe", { endpoint: subscription.endpoint });
        await subscription.unsubscribe();
      }
      setEnabled(false); setMessage("Notifications disabled on this device.");
    } catch (error: any) { setMessage(error?.response?.data?.error || error?.message || "Unable to disable notifications."); }
    finally { setBusy(false); }
  }
  async function updatePreference(nextDaily: boolean, nextAnnouncements: boolean) {
    setDaily(nextDaily); setAnnouncements(nextAnnouncements);
    if (!enabled) return;
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) await api.post("/push/subscribe", { subscription: subscription.toJSON(), dailyEnabled: nextDaily, announcementsEnabled: nextAnnouncements });
    } catch { setMessage("Could not save notification preferences."); }
  }
  return <section style={{ border: "1px solid #555", borderRadius: 12, padding: 16, margin: "16px 0" }}>
    <h3 style={{ fontWeight: 700, marginBottom: 8 }}>Push notifications</h3>
    <p style={{ opacity: .75, fontSize: 13, marginBottom: 12 }}>Get SQL practice reminders and announcements, even when SQLWhale is closed. Permission is optional.</p>
    {!supported ? <p>Push notifications are not supported in this browser.</p> : <>
      <label style={{ display: "block", marginBottom: 8 }}><input type="checkbox" checked={daily} onChange={e => void updatePreference(e.target.checked, announcements)} /> Daily SQL reminders</label>
      <label style={{ display: "block", marginBottom: 12 }}><input type="checkbox" checked={announcements} onChange={e => void updatePreference(daily, e.target.checked)} /> Product announcements</label>
      <button type="button" disabled={busy} onClick={() => void (enabled ? disable() : enable())} style={{ background: "#1862fd", color: "white", borderRadius: 8, padding: "9px 14px", cursor: "pointer" }}>{busy ? "Please wait…" : enabled ? "Disable notifications" : "Enable notifications"}</button>
      {message && <p role="status" style={{ marginTop: 10, fontSize: 13 }}>{message}</p>}
    </>}
  </section>;
}
