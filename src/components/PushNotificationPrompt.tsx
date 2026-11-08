"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import api from "@/services/api";
import BellToggle from "./BellToggle";

const DISMISSED = "sqlwhale-push-prompt-dismissed-v2";
function decodeKey(base64: string): Uint8Array<ArrayBuffer> {
  const normalized = base64.replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "="));
  return Uint8Array.from(raw, char => char.charCodeAt(0));
}
export default function PushNotificationPrompt() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    if (pathname?.startsWith("/admin") || pathname === "/push-key-setup") return;
    if (typeof window === "undefined" || !("Notification" in window) || !("serviceWorker" in navigator) || !("PushManager" in window) || Notification.permission === "denied") return;
    let cancelled = false;
    async function check() {
      try {
        const config = await api.get("/push/config");
        if (!config.data?.enabled) return;
        const registration = await navigator.serviceWorker.register("/sw.js", { scope: "/", updateViaCache: "none" });
        void registration.update().catch(() => {});
        const existing = await registration.pushManager.getSubscription();
        if (existing) {
          // Refresh endpoint preferences; backend associates it to account when signed in.
          await api.post("/push/subscribe", { subscription: existing.toJSON(), dailyEnabled: true, announcementsEnabled: true });
          if (!cancelled) { setEnabled(true); setVisible(false); }
          return;
        }
        if (!localStorage.getItem(DISMISSED) && !cancelled) setVisible(true);
      } catch { /* A failed registration can be retried by visiting the page again. */ }
    }
    void check();
    return () => { cancelled = true; };
  }, [pathname]);
  function decline() { localStorage.setItem(DISMISSED, "no"); setVisible(false); }
  async function accept() {
    setBusy(true); setError("");
    try {
      const config = await api.get("/push/config");
      if (!config.data?.enabled || !config.data?.publicKey) throw new Error("Notifications are temporarily unavailable.");
      const permission = await Notification.requestPermission();
      if (permission !== "granted") { decline(); return; }
      const registration = await navigator.serviceWorker.register("/sw.js", { scope: "/", updateViaCache: "none" });
      let subscription = await registration.pushManager.getSubscription();
      if (!subscription) subscription = await registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: decodeKey(config.data.publicKey) });
      await api.post("/push/subscribe", { subscription: subscription.toJSON(), dailyEnabled: true, announcementsEnabled: true });
      setEnabled(true);
      localStorage.setItem(DISMISSED, "yes");
      window.setTimeout(() => setVisible(false), 1100);
    } catch (e: unknown) { setError(e instanceof Error ? e.message : "Could not enable notifications. Please try again."); }
    finally { setBusy(false); }
  }
  if (!visible) return null;
  return <div className="sqlwhale-push-overlay" role="presentation">
    <section className="sqlwhale-push-dialog" role="dialog" aria-modal="true" aria-labelledby="sqlwhale-push-title" aria-describedby="sqlwhale-push-description">
      <div className="sqlwhale-push-emoji" aria-hidden="true">🐳</div>
      <h2 id="sqlwhale-push-title">Stay updated with SQLWhale?</h2>
      <p id="sqlwhale-push-description">Get SQL practice reminders and product announcements on this browser — no app installation required.</p>
      <div className="sqlwhale-push-buttons">
        <BellToggle pressed={enabled} disabled={busy || enabled} onChange={next => { if (next) void accept(); }} />
        <button type="button" className="sqlwhale-push-no" onClick={decline} disabled={busy || enabled}>Not now</button>
      </div>
      {error && <p role="alert" className="sqlwhale-push-error">{error}</p>}
      <p className="sqlwhale-push-footnote">Optional. You can disable notifications anytime in browser settings. iPhone/iPad requires adding SQLWhale to the Home Screen.</p>
    </section>
  </div>;
}
