"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { api } from "../services/api";

type Maintenance = {
  enabled: boolean;
  title: string;
  message: string;
  estimatedReturn: string;
};

export default function MaintenanceGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [maintenance, setMaintenance] = useState<Maintenance | null>(null);

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;
    let active = true;
    api.get("/admin/maintenance")
      .then((response) => {
        if (active) setMaintenance(response.data.maintenance || null);
      })
      .catch(() => {
        // A maintenance check must never make the app unavailable when the API is unreachable.
      });
    return () => { active = false; };
  }, [pathname]);

  if (pathname.startsWith("/admin")) return <>{children}</>;

  if (maintenance?.enabled) {
    return (
      <main className="sqlwhale-maintenance-page">
        <div className="sqlwhale-sleep-scene" aria-hidden="true">
          <div className="sqlwhale-sleep-zs"><span>Z</span><span>Z</span><span>Z</span></div>
          <div className="sqlwhale-dolphin">
            <div className="dolphin-fin dolphin-fin-top" />
            <div className="dolphin-body" />
            <div className="dolphin-belly" />
            <div className="dolphin-fin dolphin-fin-left" />
            <div className="dolphin-fin dolphin-fin-right" />
            <div className="dolphin-tail dolphin-tail-left" />
            <div className="dolphin-tail dolphin-tail-right" />
            <div className="dolphin-snout" />
            <span className="dolphin-eye" />
            <span className="dolphin-smile" />
            <span className="dolphin-bubble" />
          </div>
          <div className="sqlwhale-sleep-wave wave-one" />
          <div className="sqlwhale-sleep-wave wave-two" />
        </div>
        <span className="sqlwhale-maintenance-eyebrow">SQLWHALE / SLEEP MODE</span>
        <h1>{maintenance.title}</h1>
        <p>{maintenance.message}</p>
        {maintenance.estimatedReturn && <strong>{maintenance.estimatedReturn}</strong>}
        <div className="sqlwhale-maintenance-line" />
        <small>We’ll be back soon.</small>
      </main>
    );
  }

  return <>{children}</>;
}
