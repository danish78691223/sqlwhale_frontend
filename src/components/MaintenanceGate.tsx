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
              <linearGradient id="sleepWhaleBody" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#5c8298" />
                <stop offset="0.5" stopColor="#31586f" />
                <stop offset="1" stopColor="#132f43" />
              </linearGradient>
              <linearGradient id="sleepWhaleBelly" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#dcebf0" />
                <stop offset="1" stopColor="#87aab9" />
              </linearGradient>
            </defs>

            <g className="dolphin-float whale-float">
              <ellipse className="dolphin-shadow" cx="275" cy="246" rx="170" ry="18" />

              
              <path className="sleep-whale-body" fill="url(#sleepWhaleBody)"
                d="M104 181
                   C105 124 151 82 221 72
                   C294 61 369 78 416 112
                   C444 132 459 154 451 176
                   C444 197 419 210 389 210
                   C350 210 322 190 295 181
                   C270 173 250 178 238 197
                   C226 217 236 232 259 239
                   C228 247 187 241 153 225
                   C125 212 105 198 104 181Z" />

              
              <path className="sleep-whale-belly" fill="url(#sleepWhaleBelly)"
                d="M155 174
                   C169 137 210 116 257 117
                   C306 118 347 139 361 163
                   C344 178 321 184 298 177
                   C274 170 251 162 229 169
                   C205 177 193 198 204 218
                   C184 213 162 197 155 174Z" />

              
              <path className="sleep-whale-head" fill="url(#sleepWhaleBody)"
                d="M366 107
                   C405 89 449 98 475 122
                   C492 138 497 158 487 174
                   C477 190 454 196 429 190
                   C409 185 391 173 379 157
                   C369 143 361 123 366 107Z" />

              
              <ellipse className="sleep-whale-forehead" cx="427" cy="112" rx="42" ry="23" />

              
              <path className="sleep-whale-flipper"
                d="M310 169
                   C343 181 365 198 366 218
                   C347 220 320 207 294 188
                   C286 181 294 170 310 169Z" />

              
              <path className="sleep-whale-flipper"
                d="M235 193
                   C254 207 267 222 262 235
                   C243 230 226 216 213 202Z" />

              
              <path className="sleep-whale-tail"
                d="M137 202
                   C104 199 73 209 57 231
                   C84 225 105 229 124 243
                   C114 225 118 213 137 202Z" />
              <path className="sleep-whale-tail"
                d="M128 213
                   C99 230 91 250 101 268
                   C116 249 132 243 153 245
                   C136 236 129 226 128 213Z" />

              
              <ellipse className="sleep-whale-blowhole" cx="447" cy="101" rx="8" ry="4" />

              
              <path className="sleep-whale-eye" d="M434 145 Q445 136 456 145" />
              <path className="sleep-whale-smile" d="M451 162 Q462 168 473 161" />

              
              <g className="dolphin-bubble-svg">
                <circle cx="453" cy="83" r="9" />
                <circle cx="466" cy="65" r="5" />
                <circle cx="480" cy="48" r="3.5" />
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
