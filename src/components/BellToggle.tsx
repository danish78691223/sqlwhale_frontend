"use client";
import { useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import "./BellToggle.css";

type Props = { pressed: boolean; onChange: (pressed: boolean) => void; disabled?: boolean; offLabel?: string; onLabel?: string; count?: number };
export default function BellToggle({ pressed, onChange, disabled = false, offLabel = "Notify me", onLabel = "You'll be notified", count = 0 }: Props) {
  const iconRef = useRef<HTMLSpanElement>(null);
  const previous = useRef(pressed);
  useEffect(() => {
    if (pressed && !previous.current && iconRef.current && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      iconRef.current.animate([
        { transform: "rotate(0deg)" }, { transform: "rotate(-17deg)" },
        { transform: "rotate(13deg)" }, { transform: "rotate(-9deg)" },
        { transform: "rotate(5deg)" }, { transform: "rotate(0deg)" }
      ], { duration: 820, easing: "ease-in-out" });
    }
    previous.current = pressed;
  }, [pressed]);
  return <button type="button" className="sqlwhale-bell-toggle" data-on={pressed} aria-pressed={pressed} disabled={disabled} onClick={() => onChange(!pressed)}>
    <span className="sqlwhale-bell-glyph" ref={iconRef}><Bell size={16} strokeWidth={2} />{pressed && count > 0 && <span className="sqlwhale-bell-count">{count > 9 ? "9+" : count}</span>}</span>
    <span>{pressed ? onLabel : offLabel}</span>
  </button>;
}
