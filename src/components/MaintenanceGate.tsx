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
          <svg className="sqlwhale-dolphin-svg" viewBox="0 0 520 300" role="img">
            <defs>
              <linearGradient id="dolphinGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#8be7f2" />
                <stop offset="0.5" stopColor="#299ab8" />
                <stop offset="1" stopColor="#12536d" />
              </linearGradient>
              <linearGradient id="bellyGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#e5fbff" />
                <stop offset="1" stopColor="#8bd4df" />
              </linearGradient>
              <filter id="dolphinGlow">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            <g className="dolphin-float">
              <ellipse className="dolphin-shadow" cx="255" cy="252" rx="142" ry="18" />
              <g className="dolphin-tail">
                <path d="M118 207 C72 185 49 195 35 218 C61 215 78 224 93 241 C82 220 91 210 118 207Z" />
                <path d="M118 207 C75 237 72 260 83 278 C96 256 110 248 132 246 C111 236 106 222 118 207Z" />
              </g>
              <path className="dolphin-body-svg" d="M105 181 C128 105 212 72 313 99 C357 111 392 137 425 151 C454 164 481 168 500 157 C485 188 452 203 409 198 C365 193 337 176 302 182 C253 191 216 226 165 226 C123 226 94 208 105 181Z" fill="url(#dolphinGradient)" />
              <path className="dolphin-belly-svg" d="M168 185 C206 148 267 139 328 160 C309 187 275 211 233 218 C201 223 177 210 168 185Z" fill="url(#bellyGradient)" />
              <path className="dolphin-fin-svg" d="M221 105 C194 62 207 25 230 15 C235 51 250 77 270 101Z" />
              <path className="dolphin-fin-svg" d="M291 184 C324 210 343 231 332 246 C302 237 278 215 261 190Z" />
              <path className="dolphin-fin-svg" d="M362 177 C394 198 414 215 403 229 C373 222 350 204 335 183Z" />
              <path className="dolphin-rostrum" d="M407 150 C449 140 486 145 507 157 C487 174 452 179 416 169Z" />
              <path className="dolphin-eye-svg" d="M413 153 Q423 145 433 153" />
              <path className="dolphin-smile-svg" d="M424 169 Q439 178 452 169" />
              <ellipse className="dolphin-nose" cx="498" cy="158" rx="7" ry="4" />
              <g className="dolphin-bubble-svg">
                <circle cx="508" cy="133" r="15" />
                <circle cx="485" cy="143" r="6" />
                <circle cx="517" cy="108" r="4" />
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
