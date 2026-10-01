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
          {/* Sleeping SQLWhale — unmistakable rounded whale silhouette. */}
          <svg className="sqlwhale-dolphin-svg sqlwhale-sleep-whale" viewBox="0 0 560 300" aria-hidden="true">
            <defs>
              <linearGradient id="cuteWhaleBody" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#3b4d82" />
                <stop offset="0.5" stopColor="#202b59" />
                <stop offset="1" stopColor="#111936" />
              </linearGradient>
              <linearGradient id="cuteWhaleBelly" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#fff7df" />
                <stop offset="1" stopColor="#f1e2bd" />
              </linearGradient>
            </defs>

            <g className="dolphin-float whale-float">
              <ellipse className="dolphin-shadow" cx="278" cy="238" rx="166" ry="15" />

              <!-- Tail flukes: two clear rounded lobes. -->
              <path className="cute-whale-tail" d="M421 172 C450 164 474 145 491 121 C503 137 500 158 486 174 C503 168 522 169 541 180 C526 198 501 201 477 190 C460 183 441 181 421 180Z" />
              <path className="cute-whale-tail" d="M422 180 C448 181 470 190 486 207 C470 218 447 214 430 198 C421 191 414 185 407 181Z" />

              <!-- Big rounded whale body with a distinct forehead and tapered rear. -->
              <path className="cute-whale-body" fill="url(#cuteWhaleBody)" d="M112 166 C93 158 81 142 83 125 C85 102 103 84 128 80 C153 76 172 86 183 103 C217 91 261 87 310 92 C358 97 400 111 429 134 C445 147 451 162 447 176 C442 194 424 204 398 208 C364 213 331 203 303 198 C275 193 249 196 224 205 C194 216 160 215 137 202 C121 193 113 181 112 166Z" />

              <!-- Cream belly makes the whale silhouette immediately recognizable. -->
              <path className="cute-whale-belly" d="M130 163 C146 151 171 145 202 146 C242 147 283 154 320 165 C351 174 374 185 387 195 C365 205 335 201 304 195 C276 190 249 193 224 202 C191 213 159 207 141 192 C130 183 126 173 130 163Z" />

              <!-- Rounded forehead / snout. -->
              <ellipse className="cute-whale-forehead" cx="120" cy="105" rx="39" ry="25" />

              <!-- Relaxed pectoral fin. -->
              <path className="cute-whale-fin" d="M244 192 C229 202 219 217 223 230 C240 228 257 216 268 201 C273 194 260 188 244 192Z" />

              <!-- Second fin peeking from the far side. -->
              <path className="cute-whale-fin" d="M322 194 C337 199 347 209 348 220 C335 222 321 214 311 205 C307 200 313 193 322 194Z" />

              <!-- Blowhole, closed sleepy eye and tiny smile. -->
              <ellipse className="cute-whale-blowhole" cx="139" cy="86" rx="7" ry="3.5" />
              <path className="cute-whale-eye" d="M108 132 Q119 142 130 132" />
              <circle className="cute-whale-blush" cx="139" cy="144" r="9" />
              <path className="cute-whale-mouth" d="M132 153 Q140 158 148 151" />

              <!-- Small sleepy bubbles rising from the blowhole. -->
              <g className="dolphin-bubble-svg">
                <circle cx="143" cy="72" r="9" />
                <circle cx="154" cy="51" r="5.5" />
                <circle cx="164" cy="34" r="3.5" />
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
