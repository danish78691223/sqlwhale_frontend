"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface LiquidMetalProps {
  colorBack?: string;
  colorTint?: string;
  speed?: number;
  repetition?: number;
  distortion?: number;
  scale?: number;
  className?: string;
  style?: React.CSSProperties;
}

/** Lightweight liquid-metal inspired surface that needs no WebGL dependency. */
export function LiquidMetal({
  colorBack = "#3b82f6",
  colorTint = "#bfdbfe",
  className,
  style,
}: LiquidMetalProps) {
  return (
    <div
      className={cn("absolute inset-0 overflow-hidden rounded-full", className)}
      style={{
        background: `linear-gradient(125deg, ${colorBack} 0%, ${colorTint} 18%, #ffffff 27%, ${colorBack} 43%, #1d4ed8 58%, ${colorTint} 76%, ${colorBack} 100%)`,
        backgroundSize: "220% 220%",
        boxShadow: "inset 0 1px 2px rgba(255,255,255,.85), inset 0 -2px 4px rgba(0,0,0,.18)",
        ...style,
      }}
      aria-hidden="true"
    />
  );
}

export interface LiquidMetalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: React.ReactNode;
  borderWidth?: number;
  metalConfig?: Omit<LiquidMetalProps, "className" | "style">;
  size?: "sm" | "md" | "lg";
}

export const LiquidMetalButton = forwardRef<HTMLButtonElement, LiquidMetalButtonProps>(
  ({ children, icon, borderWidth = 3, metalConfig, size = "md", className, disabled, type = "button", ...props }, ref) => {
    const sizeStyles = {
      sm: "py-2 pl-2 pr-5 gap-3 text-sm",
      md: "py-3 pl-3 pr-7 gap-4 text-base",
      lg: "py-4 pl-4 pr-9 gap-5 text-lg",
    };
    const iconSizes = {
      sm: "w-8 h-8",
      md: "w-10 h-10",
      lg: "w-12 h-12",
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        className={cn(
          "relative inline-flex cursor-pointer border-0 bg-transparent p-0 outline-none transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      >
        <span
          className="relative block overflow-hidden rounded-full"
          style={{ padding: borderWidth, boxShadow: "0 8px 24px rgba(59,130,246,.25)" }}
        >
          <LiquidMetal
            colorBack={metalConfig?.colorBack}
            colorTint={metalConfig?.colorTint}
            speed={metalConfig?.speed}
            repetition={metalConfig?.repetition}
            distortion={metalConfig?.distortion}
            scale={metalConfig?.scale}
          />
          <span className={cn(
            "relative z-10 flex items-center rounded-full bg-slate-950 text-white transition-colors duration-200 hover:bg-slate-900",
            sizeStyles[size]
          )}>
            {icon && (
              <span className={cn("flex shrink-0 items-center justify-center rounded-full bg-white/15 text-white", iconSizes[size])}>
                {icon}
              </span>
            )}
            <span className="whitespace-nowrap font-semibold tracking-tight">{children}</span>
          </span>
        </span>
      </button>
    );
  }
);
LiquidMetalButton.displayName = "LiquidMetalButton";

export default LiquidMetalButton;
