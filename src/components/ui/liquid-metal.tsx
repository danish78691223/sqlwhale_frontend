"use client";

import React, { memo, forwardRef } from "react";
import { LiquidMetal as LiquidMetalShader } from "@paper-design/shaders-react";
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

export const LiquidMetal = memo(function LiquidMetal({
  colorBack = "#aaaaac",
  colorTint = "#ffffff",
  speed = 0.5,
  repetition = 4,
  distortion = 0.1,
  scale = 1,
  className,
  style,
}: LiquidMetalProps) {
  return (
    <div className={cn("absolute inset-0 z-0 overflow-hidden", className)} style={style} aria-hidden="true">
      <LiquidMetalShader
        colorBack={colorBack}
        colorTint={colorTint}
        speed={speed}
        repetition={repetition}
        distortion={distortion}
        softness={0}
        shiftRed={0.3}
        shiftBlue={-0.3}
        angle={45}
        shape="none"
        scale={scale}
        fit="cover"
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
});
LiquidMetal.displayName = "LiquidMetal";

export interface LiquidMetalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: React.ReactNode;
  borderWidth?: number;
  metalConfig?: Omit<LiquidMetalProps, "className" | "style">;
  size?: "sm" | "md" | "lg";
}

export const LiquidMetalButton = forwardRef<HTMLButtonElement, LiquidMetalButtonProps>(
  (
    {
      children,
      icon,
      borderWidth = 4,
      metalConfig,
      size = "md",
      className,
      disabled,
      type = "button",
      ...props
    },
    ref
  ) => {
    const sizeStyles = {
      sm: "py-2 pl-2 pr-6 gap-3 text-sm",
      md: "py-3 pl-3 pr-8 gap-4 text-base",
      lg: "py-4 pl-4 pr-10 gap-6 text-lg",
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
          "relative group inline-block cursor-pointer border-none bg-transparent p-0 outline-none transition-transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
          className
        )}
        {...props}
      >
        <span
          className="relative block overflow-hidden rounded-full shadow-[0_12px_30px_rgba(139,92,246,0.28)]"
          style={{ padding: borderWidth }}
        >
          <LiquidMetal
            colorBack={metalConfig?.colorBack ?? "#3b82f6"}
            colorTint={metalConfig?.colorTint ?? "#93c5fd"}
            speed={metalConfig?.speed ?? 0.4}
            repetition={metalConfig?.repetition ?? 4}
            distortion={metalConfig?.distortion ?? 0.15}
            scale={metalConfig?.scale ?? 1}
            className="rounded-full"
          />
          <span className={cn(
            "relative z-10 flex items-center rounded-full bg-violet-600 text-white transition-colors duration-200 group-hover:bg-violet-500",
            sizeStyles[size]
          )}>
            {icon && (
              <span className={cn(
                "flex shrink-0 items-center justify-center rounded-full bg-white/15 text-white",
                iconSizes[size]
              )}>
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
