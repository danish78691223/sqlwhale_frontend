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
          {/* Simple SQLWhale test silhouette */}
          <svg className="sqlwhale-dolphin-svg sqlwhale-sleep-whale" viewBox="0 0 560 300" aria-hidden="true">
            <g className="dolphin-float whale-float">
              <ellipse className="dolphin-shadow" cx="280" cy="230" rx="145" ry="14" />

              <path className="cute-whale-body" d="M125 170 C100 158 94 135 105 112 C116 89 145 82 173 91 C218 76 305 79 371 105 C411 121 438 142 439 163 C440 185 416 199 383 202 C344 205 318 191 283 190 C247 189 224 205 187 207 C157 209 134 195 125 170Z" />

              <path className="cute-whale-belly" d="M139 165 C160 151 194 148 231 151 C270 154 313 165 348 180 C329 193 303 188 278 185 C246 181 225 192 198 198 C170 204 145 191 139 165Z" />

              <path className="cute-whale-tail" d="M420 166 C448 150 468 128 482 105 C494 125 492 146 480 162 C499 156 519 160 535 173 C518 189 494 191 475 181 C454 170 439 170 420 176Z" />
              <path className="cute-whale-tail" d="M420 173 C445 178 467 191 479 210 C459 216 438 204 424 189 C417 182 414 177 420 173Z" />

              <path className="cute-whale-fin" d="M250 187 C234 199 226 215 231 226 C246 222 260 210 270 195 C274 188 261 184 250 187Z" />

              <ellipse className="cute-whale-forehead" cx="127" cy="108" rx="32" ry="20" />
              <ellipse className="cute-whale-blowhole" cx="139" cy="89" rx="6" ry="3" />
              <path className="cute-whale-eye" d="M115 132 Q123 140 131 132" />
              <circle className="cute-whale-blush" cx="140" cy="143" r="7" />
              <path className="cute-whale-mouth" d="M134 150 Q140 154 146 150" />

              <g className="dolphin-bubble-svg">
                <circle cx="142" cy="73" r="8" />
                <circle cx="151" cy="55" r="5" />
                <circle cx="160" cy="40" r="3" />
              </g>
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
