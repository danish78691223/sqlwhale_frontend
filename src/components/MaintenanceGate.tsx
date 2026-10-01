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
          {/* Sleeping white cat */}
          <svg className="sqlwhale-dolphin-svg sqlwhale-sleep-whale" viewBox="0 0 560 300" aria-hidden="true">
            <g className="dolphin-float whale-float">
              <ellipse className="dolphin-shadow" cx="280" cy="238" rx="145" ry="12" />

              <path className="cute-whale-body white-cat-body" d="M236 194 C249 151 287 126 333 128 C381 130 414 158 414 191 C414 217 393 230 357 232 C321 234 287 220 264 210 C253 205 244 201 236 194Z" />

              <path className="cute-whale-belly white-cat-belly" d="M277 190 C289 164 312 151 337 153 C361 155 377 172 377 191 C376 207 359 215 339 215 C316 214 294 204 277 190Z" />

              <path className="cute-whale-forehead white-cat-head" d="M146 161 C132 149 127 130 134 113 L143 83 L164 101 C176 95 190 96 202 103 L225 81 L227 114 C241 126 244 146 234 161 C220 181 173 183 146 161Z" />

              <path className="cute-whale-fin white-cat-paw" d="M171 160 C155 163 143 174 140 188 C154 193 171 187 182 177 C188 171 183 158 171 160Z" />
              <path className="cute-whale-fin white-cat-paw" d="M199 160 C214 164 224 175 225 188 C211 191 197 184 187 175 C182 169 189 157 199 160Z" />

              <path className="cute-whale-tail white-cat-tail" d="M390 192 C418 198 443 215 449 232 C433 243 410 235 394 221 C383 212 372 207 359 204 C349 201 350 189 359 185 C369 181 380 188 390 192Z" />

              <path className="cute-whale-eye" d="M153 135 Q162 144 171 135" />
              <path className="cute-whale-eye" d="M194 135 Q203 144 212 135" />
              <path className="cute-whale-mouth" d="M179 150 Q184 155 189 150" />
              <circle className="cute-whale-blush" cx="153" cy="150" r="7" />
              <circle className="cute-whale-blush" cx="213" cy="150" r="7" />

              <g className="dolphin-bubble-svg">
                <circle cx="184" cy="158" r="6" />
                <circle cx="177" cy="173" r="3.5" />
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
