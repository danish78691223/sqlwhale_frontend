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
          {/* Curled sleeping dolphin: nose tucked toward its belly and tail wrapped inward. */}
          <svg className="sqlwhale-dolphin-svg" viewBox="0 0 520 300" aria-hidden="true">
            <defs>
              <linearGradient id="sleepDolphin" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#82dceb" />
                <stop offset="0.55" stopColor="#329bb7" />
                <stop offset="1" stopColor="#12556e" />
              </linearGradient>
              <linearGradient id="sleepBelly" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#e5fbff" />
                <stop offset="1" stopColor="#8bcfdb" />
              </linearGradient>
            </defs>

            <g className="dolphin-float">

              <ellipse className="dolphin-shadow" cx="258" cy="238" rx="145" ry="16" />

              <path
                className="sleep-dolphin-body"
                fill="url(#sleepDolphin)"
                d="M108 192
                   C96 149 115 108 153 83
                   C193 57 252 55 302 77
                   C345 96 366 130 360 162
                   C355 189 334 207 306 215
                   C274 224 245 210 226 190
                   C208 171 207 146 222 128
                   C235 112 256 107 277 115
                   C293 121 302 134 300 148
                   C297 164 283 173 267 171
                   C254 169 246 159 249 148
                   C252 138 263 134 272 139
                   C279 143 280 151 276 157
                   C290 154 296 143 291 132
                   C285 117 265 108 247 113
                   C218 121 201 151 209 179
                   C218 210 252 229 292 230
                   C331 231 362 211 383 188
                   C401 168 414 150 432 146
                   C453 141 473 151 487 165
                   C468 164 452 170 439 184
                   C425 200 416 221 395 232
                   C356 252 298 258 240 244
                   C178 229 126 220 108 192Z"
              />

              <path
                className="sleep-dolphin-belly"
                fill="url(#sleepBelly)"
                d="M185 111 C218 91 264 94 291 116
                   C307 129 308 148 296 160
                   C286 171 271 177 256 174
                   C246 171 241 164 244 154
                   C248 141 261 137 272 143
                   C265 130 246 126 231 134
                   C211 145 204 166 213 186
                   C224 209 249 224 277 229
                   C243 226 211 215 191 196
                   C166 172 159 133 185 111Z"
              />

              <path
                className="sleep-dolphin-fin"
                d="M181 88 C154 67 151 38 168 20
                   C190 42 207 64 211 91Z"
              />

              <path
                className="sleep-dolphin-fin"
                d="M276 184 C305 196 324 211 321 226
                   C299 224 278 211 261 194Z"
              />

              <path
                className="sleep-dolphin-tail"
                d="M119 193 C84 185 58 195 45 217
                   C69 212 88 218 104 233
                   C94 212 99 201 119 193Z"
              />
              <path
                className="sleep-dolphin-tail"
                d="M113 204 C84 224 76 247 86 265
                   C101 244 116 236 136 237
                   C119 228 112 217 113 204Z"
              />

              <path
                className="sleep-dolphin-head"
                d="M354 132 C377 112 405 111 426 124
                   C441 133 449 145 444 157
                   C437 171 418 174 398 168
                   C381 163 368 153 354 146Z"
              />
              <path
                className="sleep-dolphin-rostrum"
                d="M414 126 C449 117 481 126 496 142
                   C478 153 453 157 431 151Z"
              />

              <path className="sleep-dolphin-eye" d="M404 139 Q415 130 426 139" />
              <path className="sleep-dolphin-smile" d="M431 151 Q441 158 451 152" />

              <g className="dolphin-bubble-svg">
                <circle cx="493" cy="131" r="10" />
                <circle cx="475" cy="116" r="5" />
                <circle cx="501" cy="104" r="3.5" />
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
