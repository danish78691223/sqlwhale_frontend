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
    const previous = { daily, announcements };
    setDaily(nextDaily);
    setAnnouncements(nextAnnouncements);
    if (!enabled) return;
    setBusy(true);
    setMessage("");
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        await api.post("/push/subscribe", {
          subscription: subscription.toJSON(),
          dailyEnabled: nextDaily,
          announcementsEnabled: nextAnnouncements,
        });
        setMessage("Notification preferences saved.");
      }
    } catch (error: any) {
      setDaily(previous.daily);
      setAnnouncements(previous.announcements);
      setMessage(error?.response?.data?.error || "Could not save notification preferences. Your previous settings were restored.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="account-notification-settings" aria-labelledby="push-settings-title">
      <div className="account-notification-heading">
        <div>
          <h3 id="push-settings-title">Push notifications</h3>
          <p>Get SQL practice reminders and product announcements on this device. Permission is optional.</p>
        </div>
        <span className={"account-notification-state " + (enabled ? "is-enabled" : "")}>
          <i /> {enabled ? "Enabled" : "Not enabled"}
        </span>
      </div>

      {!supported ? (
        <p className="account-notification-status" role="status">
          Push notifications are not supported in this browser. Use a supported browser. iPhone/iPad requires adding SQLWhale to the Home Screen.
        </p>
      ) : (
        <>
          <div className="account-notification-options">
            <label className="account-notification-option">
              <input type="checkbox" checked={daily} disabled={busy} onChange={(event) => void updatePreference(event.target.checked, announcements)} />
              <span>Daily SQL reminders</span>
            </label>
            <label className="account-notification-option">
              <input type="checkbox" checked={announcements} disabled={busy} onChange={(event) => void updatePreference(daily, event.target.checked)} />
              <span>Product announcements</span>
            </label>
          </div>
          <div className="account-notification-actions">
            <button
              type="button"
              className="account-notification-button"
              disabled={busy}
              onClick={() => void (enabled ? disable() : enable())}
              aria-busy={busy}
            >
              {busy ? "Please wait…" : enabled ? "Disable on this device" : "Enable notifications"}
            </button>
            {enabled && deviceCount !== null ? (
              <span className="account-notification-device-count">{deviceCount} registered device{deviceCount === 1 ? "" : "s"}</span>
            ) : null}
          </div>
          {message ? <p role="status" className="account-notification-status">{message}</p> : null}
        </>
      )}
    </section>
  );
}
