"use client";

import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  type ElementType,
} from "react";
import { useAnimate, type AnimationOptions, type Transition } from "framer-motion";

const ROTATION_MAP = {
  top: "rotateX(90deg)",
  right: "rotateY(90deg)",
  bottom: "rotateX(-90deg)",
  left: "rotateY(-90deg)",
} as const;

type RotateDirection = keyof typeof ROTATION_MAP;

interface Text3DFlipProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  as?: ElementType;
  className?: string;
  textClassName?: string;
  flipTextClassName?: string;
  staggerDuration?: number;
  staggerFrom?: "first" | "last" | "center" | number | "random";
  transition?: Transition | AnimationOptions;
  rotateDirection?: RotateDirection;
}

function extractText(children: React.ReactNode): string {
  if (children == null) return "";
  if (typeof children === "string" || typeof children === "number") return String(children);
  if (Array.isArray(children)) return children.map(extractText).join("");
  if (React.isValidElement(children)) {
    return extractText((children.props as { children?: React.ReactNode }).children);
  }
  return "";
}

function splitCharacters(value: string): string[] {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
    return Array.from(segmenter.segment(value), ({ segment }) => segment);
  }
  return Array.from(value);
}

const Text3DFlip = ({
  children,
  as: ElementTag = "span",
  className = "",
  textClassName = "",
  flipTextClassName = "",
  staggerDuration = 0.03,
  staggerFrom = "first",
  transition = { type: "spring", damping: 25, stiffness: 160 },
  rotateDirection = "top",
  ...props
}: Text3DFlipProps) => {
  const isAnimating = useRef(false);
  const isMounted = useRef(false);
  const [scope, animate] = useAnimate();
  const text = useMemo(() => extractText(children), [children]);
  const words = useMemo(
    () => text.split(" ").map((word) => splitCharacters(word)),
    [text]
  );
  const totalChars = words.reduce((sum, word) => sum + word.length, 0);
  const rotation = ROTATION_MAP[rotateDirection];

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      isAnimating.current = false;
    };
  }, []);

  const getDelay = useCallback((index: number) => {
    if (staggerFrom === "last") return (totalChars - 1 - index) * staggerDuration;
    if (staggerFrom === "center") return Math.abs(Math.floor(totalChars / 2) - index) * staggerDuration;
    if (typeof staggerFrom === "number") return Math.abs(staggerFrom - index) * staggerDuration;
    if (staggerFrom === "random") return Math.abs(Math.floor(totalChars / 2) - index) * staggerDuration;
    return index * staggerDuration;
  }, [staggerDuration, staggerFrom, totalChars]);

  const handleHover = useCallback(async () => {
    if (isAnimating.current || totalChars === 0) return;
    isAnimating.current = true;
    try {
      await animate(".text-3d-flip-char", { transform: rotation }, {
        ...transition,
        delay: (index: number) => getDelay(index),
      });
      if (!isMounted.current) return;
      await animate(".text-3d-flip-char", { transform: "rotateX(0deg) rotateY(0deg)" }, { duration: 0 });
    } finally {
      if (isMounted.current) isAnimating.current = false;
    }
  }, [animate, getDelay, rotation, totalChars, transition]);

  const secondFace = rotateDirection === "top"
    ? "rotateX(-90deg) translateZ(0.5lh)"
    : rotateDirection === "bottom"
      ? "rotateX(90deg) translateZ(0.5lh)"
      : rotateDirection === "left"
        ? "rotateY(90deg) translateX(50%) rotateY(-90deg) translateX(50%) rotateY(-90deg) translateX(50%)"
        : "rotateY(90deg) translateX(50%) rotateY(-90deg) translateX(-50%) rotateY(-90deg) translateX(50%)";
  const frontFace = rotateDirection === "left" || rotateDirection === "right"
    ? (rotateDirection === "left" ? "rotateY(90deg) translateX(50%) rotateY(-90deg)" : "rotateY(-90deg) translateX(50%) rotateY(90deg)")
    : "translateZ(0.5lh)";
  const containerTransform = rotateDirection === "left" || rotateDirection === "right"
    ? "rotateY(90deg) translateX(50%) rotateY(-90deg)"
    : "translateZ(-0.5lh)";

  return (
    <ElementTag
      {...(props as Record<string, unknown>)}
      ref={scope}
      className={`inline-flex flex-wrap align-middle ${className}`}
      onMouseEnter={(event: React.MouseEvent<HTMLElement>) => {
        props.onMouseEnter?.(event);
        void handleHover();
      }}
      onFocus={(event: React.FocusEvent<HTMLElement>) => {
        props.onFocus?.(event);
        void handleHover();
      }}
      aria-label={text}
    >
      <span className="sr-only">{text}</span>
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-flex whitespace-pre">
          {word.map((char, charIndex) => (
            <CharBox
              key={`${wordIndex}-${charIndex}`}
              char={char}
              textClassName={textClassName}
              flipTextClassName={flipTextClassName}
              frontFace={frontFace}
              secondFace={secondFace}
              containerTransform={containerTransform}
            />
          ))}
          {wordIndex < words.length - 1 && <span className="whitespace-pre"> </span>}
        </span>
      ))}
    </ElementTag>
  );
};

function CharBox({
  char,
  textClassName,
  flipTextClassName,
  frontFace,
  secondFace,
  containerTransform,
}: {
  char: string;
  textClassName: string;
  flipTextClassName: string;
  frontFace: string;
  secondFace: string;
  containerTransform: string;
}) {
  return (
    <span
      className="text-3d-flip-char relative inline-block"
      style={{ transform: containerTransform, transformStyle: "preserve-3d" }}
    >
      <span
        className={`relative inline-block h-[1em] ${textClassName}`}
        style={{ transform: frontFace, backfaceVisibility: "hidden" }}
      >
        {char === " " ? "\u00a0" : char}
      </span>
      <span
        aria-hidden="true"
        className={`absolute left-0 top-0 inline-block h-[1em] ${flipTextClassName}`}
        style={{ transform: secondFace, backfaceVisibility: "hidden" }}
      >
        {char === " " ? "\u00a0" : char}
      </span>
    </span>
  );
}

export default memo(Text3DFlip);
