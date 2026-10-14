"use client";

import { useEffect, useState } from "react";
import "./CardSwap.css";

export type CardSwapItem = {
  eyebrow: string;
  title: string;
  description: string;
};

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export function Card({ children, className = "" }: CardProps) {
  return <div className={`reactbits-card-swap-card ${className}`}>{children}</div>;
}

type CardSwapProps = {
  items: CardSwapItem[];
  delay?: number;
  width?: number | string;
  height?: number | string;
};

export default function CardSwap({ items, delay = 4000, width = "100%", height = 300 }: CardSwapProps) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (items.length < 2) return;
    const timer = window.setInterval(() => setActive(current => (current + 1) % items.length), delay);
    return () => window.clearInterval(timer);
  }, [items.length, delay]);

  if (!items.length) return null;

  return (
    <div className="reactbits-card-swap" style={{ width, height: typeof height === "number" ? `${height}px` : height }} aria-label="Why SQLWhale exists">
      {items.map((item, index) => {
        const offset = (index - active + items.length) % items.length;
        return (
          <Card key={item.eyebrow} className={`is-position-${Math.min(offset, 2)} ${offset === 0 ? "is-active" : ""}`}>
            <span className="card-swap-eyebrow">{item.eyebrow}</span>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <span className="card-swap-index">{String(index + 1).padStart(2, "0")} <i /> 04</span>
          </Card>
        );
      })}
    </div>
  );
}
