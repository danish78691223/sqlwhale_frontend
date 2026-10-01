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
          {/* Sleeping cat — curled up naturally with paws under its head. */}
          <svg className="sqlwhale-dolphin-svg sqlwhale-sleep-whale" viewBox="0 0 560 300" aria-hidden="true">
            <g className="dolphin-float whale-float">
              <ellipse className="dolphin-shadow" cx="280" cy="232" rx="128" ry="13" />

              <!-- Curled body -->
              <path className="cute-whale-body" d="M154 192 C126 174 119 143 131 119 C143 94 170 82 198 87 C233 92 259 113 271 139 C286 128 310 121 334 128 C365 137 384 161 382 187 C380 210 358 224 327 224 C299 224 276 213 256 204 C231 220 191 219 154 192Z" />

              <!-- Cream belly -->
              <path className="cute-whale-belly" d="M174 180 C160 162 160 138 175 123 C192 107 217 112 232 129 C245 144 249 167 240 187 C226 201 194 201 174 180Z" />

              <!-- Head with two cat ears -->
              <path className="cute-whale-forehead" d="M139 137 C126 122 128 100 143 91 L151 67 L171 88 C184 81 201 84 211 95 L235 77 L235 108 C248 124 244 145 229 157 C210 173 174 169 151 157Z" />

              <!-- Front paws tucked under the sleeping head -->
              <path className="cute-whale-fin" d="M185 159 C170 164 160 174 158 186 C171 190 188 184 199 174 C205 168 198 157 185 159Z" />
              <path className="cute-whale-fin" d="M211 159 C225 163 235 172 237 183 C225 188 210 182 200 173 C195 168 202 157 211 159Z" />

              <!-- Tail wrapped around the front of the curled body -->
              <path className="cute-whale-tail" d="M350 180 C373 188 392 201 399 217 C384 227 363 221 348 207 C336 196 326 190 314 188 C305 186 306 175 314 172 C326 168 338 174 350 180Z" />

              <!-- Closed sleepy face -->
              <path className="cute-whale-eye" d="M157 127 Q166 136 175 127" />
              <path className="cute-whale-eye" d="M194 127 Q203 136 212 127" />
              <path className="cute-whale-mouth" d="M181 140 Q186 145 191 140" />
              <circle className="cute-whale-blush" cx="153" cy="143" r="7" />
              <circle className="cute-whale-blush" cx="216" cy="143" r="7" />

              <!-- Tiny nose bubble -->
              <g className="dolphin-bubble-svg">
                <circle cx="187" cy="151" r="6" />
                <circle cx="180" cy="166" r="3.5" />
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
