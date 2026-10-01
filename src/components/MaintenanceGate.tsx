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
          {/* Sleeping SQLWhale — curled gently on its side. */}
          <svg className="sqlwhale-dolphin-svg sqlwhale-sleep-whale" viewBox="0 0 560 300" aria-hidden="true">
            <defs>
              <linearGradient id="cuteWhaleBody" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#344477" />
                <stop offset="0.55" stopColor="#1e2852" />
                <stop offset="1" stopColor="#111936" />
              </linearGradient>
              <linearGradient id="cuteWhaleBelly" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#fff5dc" />
                <stop offset="1" stopColor="#f4e8c9" />
              </linearGradient>
            </defs>

            <g className="dolphin-float whale-float">
              <ellipse className="dolphin-shadow" cx="280" cy="239" rx="158" ry="16" />

              <path className="cute-whale-tail"
                d="M430 181 C460 169 487 151 501 128 C507 151 500 176 480 192
                   C499 191 516 199 529 214 C505 217 480 209 460 195
                   C449 190 439 187 430 181Z" />

              <path className="cute-whale-body" fill="url(#cuteWhaleBody)"
                d="M122 166
                   C126 119 174 94 240 92
                   C303 90 365 103 412 128
                   C439 143 451 160 446 179
                   C440 200 414 211 381 211
                   C342 211 315 198 283 197
                   C247 196 221 208 190 211
                   C156 214 128 198 122 166Z" />

              <ellipse className="cute-whale-belly" cx="274" cy="176" rx="116" ry="48"
                transform="rotate(2 274 176)" />

              <path className="cute-whale-head" fill="url(#cuteWhaleBody)"
                d="M121 165
                   C105 154 94 137 99 120
                   C104 103 122 94 142 98
                   C160 102 171 118 168 135
                   C165 151 151 164 133 169Z" />

              <ellipse className="cute-whale-forehead" cx="126" cy="108" rx="28" ry="13" />

              <path className="cute-whale-fin"
                d="M211 193 C196 198 184 208 180 221
                   C194 226 212 219 226 205 C231 199 223 191 211 193Z" />

              <path className="cute-whale-fin"
                d="M321 198 C338 202 348 211 350 221
                   C337 224 322 217 311 207 C306 202 312 197 321 198Z" />

              <ellipse className="cute-whale-blowhole" cx="112" cy="105" rx="6" ry="3" />

              <path className="cute-whale-eye" d="M111 130 Q120 140 129 130" />
              <circle className="cute-whale-blush" cx="137" cy="143" r="8" />
              <path className="cute-whale-mouth" d="M128 150 Q135 154 142 149" />

              <g className="dolphin-bubble-svg">
                <circle cx="104" cy="83" r="9" />
                <circle cx="91" cy="63" r="5" />
                <circle cx="78" cy="47" r="3.5" />
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
