"use client";

import React, { useMemo, useState, type ElementType } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Text3DFlipProps {
  children: React.ReactNode;
  as?: ElementType;
  className?: string;
  textClassName?: string;
  flipTextClassName?: string;
  staggerDuration?: number;
  staggerFrom?: "first" | "last" | "center" | number | "random";
  transition?: Record<string, unknown>;
  rotateDirection?: "top" | "right" | "bottom" | "left";
}

function getText(node: React.ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(getText).join("");
  if (React.isValidElement(node)) {
    return getText((node.props as { children?: React.ReactNode }).children);
  }
  return "";
}

export default function Text3DFlip({
  children,
  as: Tag = "p",
  className,
  textClassName,
  flipTextClassName,
  staggerDuration = 0.03,
  staggerFrom = "first",
  transition,
  rotateDirection = "top",
}: Text3DFlipProps) {
  const [hovered, setHovered] = useState(false);
  const text = useMemo(() => getText(children), [children]);
  const chars = useMemo(() => Array.from(text), [text]);
  const axis = rotateDirection === "left" || rotateDirection === "right" ? "Y" : "X";
  const direction = rotateDirection === "top" || rotateDirection === "right" ? 1 : -1;

  const delayFor = (index: number) => {
    if (staggerFrom === "last") return (chars.length - 1 - index) * staggerDuration;
    if (staggerFrom === "center") return Math.abs(Math.floor(chars.length / 2) - index) * staggerDuration;
    if (typeof staggerFrom === "number") return Math.abs(staggerFrom - index) * staggerDuration;
    if (staggerFrom === "random") return ((index * 7) % Math.max(chars.length, 1)) * staggerDuration;
    return index * staggerDuration;
  };

  const defaults = { type: "spring", damping: 25, stiffness: 160 };

  return (
    <Tag
      className={cn("relative", className)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="inline">
        {chars.map((char, index) =>
          char === " " ? (
            <span key={index} className="whitespace-pre"> </span>
          ) : (
            <motion.span
              key={index}
              className={cn("inline-block [transform-style:preserve-3d]", textClassName, hovered && flipTextClassName)}
              style={{ transformOrigin: "50% 50%", backfaceVisibility: "hidden" }}
              animate={{ rotateX: hovered ? 360 * direction : 0 }}
              transition={{
                ...(defaults as object),
                ...(transition ?? {}),
                delay: hovered ? delayFor(index) : 0,
              }}
            >
              {char}
            </motion.span>
          )
        )}
      </span>
    </Tag>
  );
}
