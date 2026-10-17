"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

type Props = { headingLines?: string[]; background?: string; textColor?: string; className?: string };

export default function AnimatedFooter({ headingLines = ["SQLWhale"], background = "#08090d", textColor = "#ffffff", className = "" }: Props) {
  const rootRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLCanvasElement>(null);
  const rightRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const canvases = [leftRef.current, rightRef.current].filter(Boolean) as HTMLCanvasElement[];
    if (!root || !canvases.length) return;
    const contexts = canvases.map((canvas) => {
      const ctx = canvas.getContext("2d");
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, canvas.clientWidth || 420);
      const height = Math.max(1, canvas.clientHeight || 180);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx?.scale(dpr, dpr);
      return { canvas, ctx, width, height };
    });
    const chars = " .:-=+xX#0369";
    let frame = 0;
    const render = () => {
      contexts.forEach(({ ctx, width, height }, index) => {
        if (!ctx) return;
        ctx.clearRect(0, 0, width, height);
        ctx.font = "bold 13px monospace";
        ctx.textAlign = "center";
        const time = performance.now() * 0.001;
        for (let y = 0; y < Math.floor(height / 14); y++) {
          for (let x = 0; x < Math.floor(width / 8); x++) {
            const wave = Math.sin(x * 0.19 + time * 1.6 + index) * Math.cos(y * 0.42 - time * 1.2);
            const edge = Math.sin(x * 0.09 + y * 0.16 + time * 0.8);
            const value = Math.max(0, Math.min(chars.length - 1, Math.floor((wave + edge + 2) / 4 * chars.length)));
            ctx.fillStyle = value > chars.length * 0.62 ? "#8bc5ff" : "#91a4c4";
            ctx.fillText(chars[value], x * 8 + 4, y * 14 + 12);
          }
        }
      });
      frame = requestAnimationFrame(render);
    };
    render();
    const charsToReveal = gsap.utils.toArray<HTMLElement>(root.querySelectorAll("[data-af-char]"));
    gsap.set(charsToReveal, { yPercent: 125 });
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        gsap.to(charsToReveal, { yPercent: 0, duration: 0.8, stagger: 0.035, ease: "power3.out" });
      }
    }, { threshold: 0.2 });
    observer.observe(root);
    const onResize = () => contexts.forEach(({ canvas }) => {
      const width = Math.max(1, canvas.clientWidth);
      const height = Math.max(1, canvas.clientHeight);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    });
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", onResize);
      gsap.killTweensOf(charsToReveal);
    };
  }, []);

  return (
    <footer ref={rootRef} className={`relative w-full overflow-hidden ${className}`} style={{ backgroundColor: background, color: textColor }}>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-between overflow-hidden" style={{ opacity: 0.95 }}>
        <canvas ref={leftRef} style={{ display: "block", width: "42%", height: "210px", opacity: 0.95 }} />
        <canvas ref={rightRef} style={{ display: "block", width: "42%", height: "210px", opacity: 0.95 }} />
      </div>
      <div className="relative z-10 flex min-h-[250px] items-end justify-center gap-4 px-6 pb-8 pt-20">
        {headingLines.map((word, wi) => (
          <h2 key={`${word}-${wi}`} aria-label={word} className="overflow-hidden text-center font-semibold leading-none tracking-tight" style={{ fontSize: "clamp(2.5rem, 13vw, 10rem)" }}>
            {Array.from(word).map((ch, ci) => <span key={ci} data-af-char className="inline-block">{ch}</span>)}
          </h2>
        ))}
      </div>
    </footer>
  );
}
