"use client";

import { useEffect, useRef, useState } from "react";
import { Check, FileText, Pencil, RotateCcw, Search, Terminal, X } from "lucide-react";
import "./CallChip.css";

type CallChipStatus = "idle" | "running" | "done" | "error";
type CallChipIcon = "terminal" | "file" | "search" | "edit";

interface CallChipProps {
  icon?: CallChipIcon;
  name?: string;
  argument?: string;
  status?: CallChipStatus;
  expectedMs?: number;
  size?: number;
  radius?: number;
  color?: string;
  surfaceColor?: string;
  progressColor?: string;
  progressOpacity?: number;
  doneColor?: string;
  errorColor?: string;
  washOpacity?: number;
  shake?: number;
  showTimer?: boolean;
  onRetry?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

const glyphs = {
  terminal: Terminal,
  file: FileText,
  search: Search,
  edit: Pencil,
};

export default function CallChip({
  icon = "terminal",
  name = "bash",
  argument = "npm test",
  status = "running",
  expectedMs = 2500,
  size = 34,
  radius = 10,
  color = "currentColor",
  surfaceColor = "#27272a",
  progressColor = "currentColor",
  progressOpacity = 0.08,
  doneColor = "#22c55e",
  errorColor = "#ef4444",
  washOpacity = 0.14,
  shake = 6,
  showTimer = true,
  onRetry,
  className = "",
  style,
}: CallChipProps) {
  const [elapsed, setElapsed] = useState(0);
  const startedAt = useRef<number | null>(null);
  const Glyph = glyphs[icon] ?? Terminal;

  useEffect(() => {
    if (status !== "running") {
      startedAt.current = null;
      return;
    }

    startedAt.current = Date.now() - elapsed;
    const timer = window.setInterval(() => {
      if (startedAt.current !== null) setElapsed(Date.now() - startedAt.current);
    }, 40);
    return () => window.clearInterval(timer);
  }, [status]);

  const progress = status === "done" ? 100 : status === "error" ? 90 : status === "idle" ? 0 : Math.min(90, (elapsed / Math.max(1, expectedMs)) * 90);
  const seconds = elapsed >= 1000 ? `${(elapsed / 1000).toFixed(1)}s` : `${elapsed}ms`;
  const vars = {
    "--cc-size": `${size}px`,
    "--cc-radius": `${radius}px`,
    "--cc-ink": color,
    "--cc-surface": surfaceColor,
    "--cc-progress": progressColor,
    "--cc-progress-opacity": progressOpacity,
    "--cc-done": doneColor,
    "--cc-error": errorColor,
    "--cc-wash-opacity": washOpacity,
    "--cc-shake": `${shake}px`,
    "--cc-progress-width": `${progress}%`,
  } as React.CSSProperties;

  return (
    <div
      className={`call-chip ${status === "done" ? "is-done" : ""} ${status === "error" ? "is-error" : ""} ${status === "running" ? "is-running" : ""} ${className}`}
      style={{ ...vars, ...style }}
      role="status"
      aria-live="polite"
    >
      <span className="call-chip-glyph" aria-hidden="true">
        {status === "done" ? <Check size={15} /> : status === "error" ? <X size={15} /> : <Glyph size={15} />}
      </span>
      <span className="call-chip-command">
        <span className="call-chip-name">{name}</span>
        <span className="call-chip-argument">{argument}</span>
      </span>
      {showTimer && <span className="call-chip-timer">{status === "done" ? `done · ${seconds}` : status === "error" ? `failed · ${seconds}` : status === "idle" ? "waiting" : seconds}</span>}
      <span className="call-chip-progress" aria-hidden="true" />
      {status === "error" && onRetry && (
        <button type="button" className="call-chip-retry" onClick={onRetry} aria-label="Retry loading tasks" title="Retry">
          <RotateCcw size={13} />
        </button>
      )}
    </div>
  );
}
