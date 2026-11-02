"use client";
import { useEffect, useState } from "react";
import api, { authApi } from "@/services/api";

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
  const [deviceCount, setDeviceCount] = useState<number | null>(null);

  useEffect(() => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) return;
    let cancelled = false;
    setSupported(true);
    async function syncDevice() {
      try {
        const auth = await authApi.get("/auth/me");
        if (!auth.data?.authenticated) {
          if (!cancelled) setMessage("Sign in to your SQLWhale account to enable push notifications.");
          return;
        }
        const registration = await navigator.serviceWorker.register("/sw.js", { scope: "/", updateViaCache: "none" });
        void registration.update().catch(() => {});
        const subscription = await registration.pushManager.getSubscription();
        if (!subscription) {
          if (!cancelled) setEnabled(false);
          return;
        }
        await api.post("/push/subscribe", { subscription: subscription.toJSON(), dailyEnabled: daily, announcementsEnabled: announcements });
        const status = await api.get("/push/status");
        if (!cancelled) {
          setEnabled(true);
          setDeviceCount(Number(status.data?.devices ?? 0));
          setMessage("This device is connected to your SQLWhale account.");
        }
      } catch (error: any) {
        if (!cancelled) {
          setEnabled(false);
          setMessage(error?.response?.data?.error || "Could not sync this device. Please sign in again and retry.");
        }
      }
    }
    void syncDevice();
    return () => { cancelled = true; };
  }, []);

  async function enable() {
    setBusy(true); setMessage("");
    try {
      const auth = await authApi.get("/auth/me");
      if (!auth.data?.authenticated) throw new Error("Sign in to your SQLWhale account before enabling notifications.");
      const { data } = await api.get("/push/config");
      if (!data.enabled || !data.publicKey) throw new Error("Push is not configured on the server yet.");
      const permission = await Notification.requestPermission();
      if (permission !== "granted") throw new Error("Notification permission was not granted. Allow notifications in browser settings.");
      const registration = await navigator.serviceWorker.register("/sw.js", { scope: "/", updateViaCache: "none" });
      let subscription = await registration.pushManager.getSubscription();
      if (!subscription) subscription = await registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: decodeKey(data.publicKey) });
      await api.post("/push/subscribe", { subscription: subscription.toJSON(), dailyEnabled: daily, announcementsEnabled: announcements });
      const status = await api.get("/push/status");
      setEnabled(true);
      setDeviceCount(Number(status.data?.devices ?? 0));
      setMessage("Notifications enabled and this device is registered to your SQLWhale account.");
    } catch (error: any) {
      setMessage(error?.response?.data?.error || error?.message || "Unable to enable notifications.");
    } finally { setBusy(false); }
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
      setEnabled(false); setDeviceCount(null); setMessage("Notifications disabled on this device.");
    } catch (error: any) {
      setMessage(error?.response?.data?.error || error?.message || "Unable to disable notifications.");
    } finally { setBusy(false); }
  }

  async function updatePreference(nextDaily: boolean, nextAnnouncements: boolean) {
    setDaily(nextDaily); setAnnouncements(nextAnnouncements);
    if (!enabled) return;
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) await api.post("/push/subscribe", { subscription: subscription.toJSON(), dailyEnabled: nextDaily, announcementsEnabled: nextAnnouncements });
    } catch (error: any) {
      setMessage(error?.response?.data?.error || "Could not save notification preferences.");
    }
  }

  return <section style={{ border: "1px solid #555", borderRadius: 12, padding: 16, margin: "16px 0" }}>
    <h3 style={{ fontWeight: 700, marginBottom: 8 }}>Push notifications</h3>
    <p style={{ opacity: .75, fontSize: 13, marginBottom: 12 }}>Get SQL practice reminders and announcements, even when SQLWhale is closed. Permission is optional.</p>
    {!supported ? <p>Push notifications are not supported in this browser. Install SQLWhale as a PWA or use a supported browser.</p> : <>
      <label style={{ display: "block", marginBottom: 8 }}><input type="checkbox" checked={daily} onChange={e => void updatePreference(e.target.checked, announcements)} /> Daily SQL reminders</label>
      <label style={{ display: "block", marginBottom: 12 }}><input type="checkbox" checked={announcements} onChange={e => void updatePreference(daily, e.target.checked)} /> Product announcements</label>
      <button type="button" disabled={busy} onClick={() => void (enabled ? disable() : enable())} style={{ background: "#1862fd", color: "white", borderRadius: 8, padding: "9px 14px", cursor: busy ? "wait" : "pointer", opacity: busy ? .7 : 1 }}>{busy ? "Please wait…" : enabled ? "Disable notifications" : "Enable notifications"}</button>
      {enabled && deviceCount !== null ? <p style={{ marginTop: 8, fontSize: 12, opacity: .75 }}>Registered devices on your account: {deviceCount}</p> : null}
      {message && <p role="status" style={{ marginTop: 10, fontSize: 13 }}>{message}</p>}
    </>}
  </section>;
}
