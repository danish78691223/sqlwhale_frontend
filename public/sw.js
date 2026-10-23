self.addEventListener("push", event => {
  if (!event.data) return;
  let payload;
  try { payload = event.data.json(); } catch { return; }
  const title = String(payload.title || "SQLWhale").slice(0, 100);
  const body = String(payload.body || "").slice(0, 250);
  const url = typeof payload.url === "string" && payload.url.startsWith("/") && !payload.url.startsWith("//") ? payload.url : "/run-query";
  event.waitUntil(self.registration.showNotification(title, {
    body, icon: "/sqlwhale-logo-main.png", badge: "/icon",
    tag: payload.tag || "sqlwhale", data: { url }
  }));
});
self.addEventListener("notificationclick", event => {
  event.notification.close();
  const url = new URL(event.notification.data?.url || "/run-query", self.location.origin);
  if (url.origin !== self.location.origin) return;
  event.waitUntil(clients.matchAll({ type: "window", includeUncontrolled: true }).then(async windows => {
    for (const client of windows) {
      if (client.url.startsWith(self.location.origin)) {
        await client.focus();
        if ("navigate" in client) await client.navigate(url.href);
        return;
      }
    }
    await clients.openWindow(url.href);
  }));
});
