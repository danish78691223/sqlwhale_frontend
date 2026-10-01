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
          {/* Dolphin artwork based on Twemoji 1f42c.svg, CC-BY 4.0. */}
          <svg className="sqlwhale-dolphin-svg" viewBox="0 0 36 36" aria-hidden="true">
            <g className="dolphin-float">
              <path fill="#4292E0" d="M30.584 7.854c.27-1.729 1.028-3.908 2.975-5.854.704-.704.25-2-1-2 0 0-6.061.007-9.893 3.327C21.663 3.115 20.625 3 19.559 3c-8 0-12 4-14 12-.444 1.778-.865 1.399-3 3-1.195.896-2.117 3 1 3 3 0 5 .954 9 1 3.629.042 9.504-3.229 11.087-1.292 2.211 2.706 1.396 5.438.597 6.666-2.904 3.396-5.939.541-8.685-.374-3-1-1 1 0 2s1.312 4 0 6 3 0 5-3c.011-.017.022-.028.032-.045C28.392 31.5 34.559 25.936 34.559 18c0-3.918-1.515-7.474-3.975-10.146z"/>
              <circle fill="#1F2326" cx="13.117" cy="14" r="2"/>
              <path fill="#77BCF7" d="M10.396 21.896s4-.876 7.167-2.688c4.625-2.646 7.26-2.594 8.885-.823s1.99 6.594-2.885 9.677c2.604-2.75 1.146-8.349-2.014-7.588-8.153 1.964-8.903 1.547-11.153 1.422z"/>
              <path fill="#4292E0" d="M19.383 17.744l-2.922 1.285c-.254.064-.433.3-.412.561.122 1.504.756 3.625 2.263 4.629 2.354 1.569 2.367 1.897 3 0 .768-2.303-.182-4.462-1.333-6.24-.127-.196-.37-.293-.596-.235z"/>
            </g>
            <g className="dolphin-bubble-svg" fill="none" stroke="#b4f4fb" strokeWidth="0.55">
              <circle cx="31.2" cy="2.2" r="1.5" />
              <circle cx="33.2" cy="-0.8" r="0.7" />
              <circle cx="29.2" cy="-0.5" r="0.5" />
            </g>
          </svg>
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
