"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

function getVisitorId() {
  const key = "sqlwhale_analytics_visitor";
  let id = window.localStorage.getItem(key);
  if (!id) {
    id = window.crypto?.randomUUID?.().replace(/-/g, "") || (Date.now().toString(36) + Math.random().toString(36).slice(2));
    window.localStorage.setItem(key, id);
  }
  return id;
}

function getDevice() {
  const ua = navigator.userAgent;
  if (/iPad|Tablet|PlayBook|Silk/i.test(ua)) return "tablet";
  if (/Mobi|Android|iPhone|iPod/i.test(ua)) return "mobile";
  return "desktop";
}

function getBrowser() {
  const ua = navigator.userAgent;
  if (/Edg\//.test(ua)) return "Edge";
  if (/Firefox\//.test(ua)) return "Firefox";
  if (/Chrome\//.test(ua)) return "Chrome";
  if (/Safari\//.test(ua)) return "Safari";
  return "Other";
}

function getOS() {
  const ua = navigator.userAgent;
  if (/Windows/.test(ua)) return "Windows";
  if (/Android/.test(ua)) return "Android";
  if (/iPhone|iPad|iPod/.test(ua)) return "iOS";
  if (/Mac OS/.test(ua)) return "macOS";
  if (/Linux/.test(ua)) return "Linux";
  return "Other";
}

export default function WebsiteAnalyticsTracker() {
  const pathname = usePathname();
  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;
    const controller = new AbortController();
    const visitorId = getVisitorId();
    fetch("/api/analytics/track", {
      method: "POST", credentials: "include", signal: controller.signal,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        visitorId, path: pathname, referrer: document.referrer,
        device: getDevice(), browser: getBrowser(), os: getOS(),
      }),
    }).catch(() => {});
    return () => controller.abort();
  }, [pathname]);
  return null;
}
