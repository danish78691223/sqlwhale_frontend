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
          {/* Simple sleeping cat — verification version */}
          <svg className="sqlwhale-dolphin-svg sqlwhale-sleep-whale" viewBox="0 0 560 300" aria-hidden="true">
            <g className="dolphin-float whale-float">
              <ellipse className="dolphin-shadow" cx="280" cy="232" rx="130" ry="13" />

              <path className="cute-whale-body" d="M145 176 C128 158 126 133 139 115 L151 91 L169 109 C191 98 219 99 241 110 C273 126 292 153 287 177 C282 201 254 213 220 213 C190 213 163 201 145 176Z" />

              <path className="cute-whale-belly" d="M157 166 C174 151 198 150 220 156 C242 162 257 175 260 189 C246 201 219 204 195 197 C174 191 160 180 157 166Z" />

              <path className="cute-whale-fin" d="M229 193 C245 198 256 208 259 220 C245 223 231 216 220 207 C215 202 220 191 229 193Z" />

              <path className="cute-whale-fin" d="M176 195 C164 201 155 211 155 221 C168 222 181 214 190 204 C194 199 186 191 176 195Z" />

              <path className="cute-whale-tail" d="M275 169 C307 158 328 142 345 120 C354 142 348 161 331 175 C351 170 369 174 384 187 C367 201 344 201 324 190 C307 181 292 178 275 181Z" />

              <path className="cute-whale-tail" d="M277 178 C302 184 319 198 329 215 C311 219 294 207 282 194 C276 188 273 182 277 178Z" />

              <path className="cute-whale-forehead" d="M137 119 L151 83 L168 103 C181 99 193 101 202 107 C185 111 174 120 166 133 C156 137 145 132 137 119Z" />

              <path className="cute-whale-eye" d="M151 130 Q159 138 167 130" />
              <path className="cute-whale-mouth" d="M166 143 Q172 147 178 143" />
              <circle className="cute-whale-blush" cx="180" cy="139" r="7" />

              <g className="dolphin-bubble-svg">
                <circle cx="150" cy="121" r="5" />
                <circle cx="142" cy="109" r="3" />
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
