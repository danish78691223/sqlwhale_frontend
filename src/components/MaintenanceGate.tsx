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
              <filter id="cuteWhaleGlow">
                <feGaussianBlur stdDeviation="7" />
              </filter>
            </defs>

            <g className="dolphin-float whale-float">
              <g transform="translate(560 0) scale(-1 1)">
              <ellipse className="dolphin-shadow" cx="278" cy="242" rx="155" ry="17" />

              <path className="cute-whale-body" fill="url(#cuteWhaleBody)"
                d="M113 157
                   C119 108 168 78 230 76
                   C298 74 351 91 388 116
                   C414 134 427 154 418 174
                   C409 194 383 204 354 199
                   C325 194 305 178 277 174
                   C246 170 226 184 222 205
                   C218 225 235 238 261 241
                   C219 253 166 237 137 211
                   C119 195 109 176 113 157Z" />

              <ellipse className="cute-whale-belly" cx="231" cy="174" rx="91" ry="57"
                transform="rotate(12 231 174)" />

              <path className="cute-whale-head" fill="url(#cuteWhaleBody)"
                d="M352 112
                   C390 91 431 101 454 124
                   C470 140 474 159 464 174
                   C454 189 431 193 409 185
                   C388 178 369 163 357 147
                   C348 134 346 120 352 112Z" />

              <ellipse className="cute-whale-forehead" cx="407" cy="111" rx="40" ry="19" />

              <path className="cute-whale-fin"
                d="M292 170 C323 178 346 195 345 212
                   C326 215 301 201 279 184 C273 179 281 171 292 170Z" />

              <path className="cute-whale-fin"
                d="M220 194 C239 207 251 222 247 235
                   C229 231 214 216 201 202Z" />

              <path className="cute-whale-tail"
                d="M137 202
                   C104 197 76 207 57 229
                   C84 224 105 230 123 244
                   C114 226 118 213 137 202Z" />
              <path className="cute-whale-tail"
                d="M128 211
                   C99 229 91 249 100 267
                   C116 248 132 242 153 244
                   C136 235 129 225 128 211Z" />

              <ellipse className="cute-whale-blowhole" cx="427" cy="98" rx="7" ry="3.5" />

              <path className="cute-whale-eye" d="M419 143 Q428 133 437 143" />
              <circle className="cute-whale-blush" cx="443" cy="157" r="8" />
              <path className="cute-whale-mouth" d="M438 160 Q445 165 452 160" />

              <g className="dolphin-bubble-svg">
                <circle cx="431" cy="79" r="9" />
                <circle cx="447" cy="60" r="5" />
                <circle cx="462" cy="43" r="3.5" />
              </g>
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
