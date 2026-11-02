"use client";

import { useEffect } from "react";

export default function PwaUpdater() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    let registration: ServiceWorkerRegistration | null = null;
    let disposed = false;

    const refreshWorker = async () => {
      try {
        if (!registration) {
          registration = await navigator.serviceWorker.register("/sw.js", {
            scope: "/",
            updateViaCache: "none",
          });
        }
        if (!disposed) await registration.update();
      } catch {
        // Offline visits should never block SQLWhale from opening.
      }
    };

    void refreshWorker();
    const onFocus = () => { void refreshWorker(); };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onFocus);

    return () => {
      disposed = true;
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onFocus);
    };
  }, []);

  return null;
}
