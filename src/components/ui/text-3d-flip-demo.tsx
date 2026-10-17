"use client";

import Text3DFlip from "@/components/ui/text-3d-flip";

export function Text3DFlipDemo() {
  return (
    <Text3DFlip
      className="text-3d-flip-button-label"
      textClassName="text-3d-flip-button-face"
      flipTextClassName="text-3d-flip-button-face"
      rotateDirection="top"
      staggerDuration={0.03}
      staggerFrom="first"
      transition={{ type: "spring", damping: 25, stiffness: 160 }}
    >
      Start learning
    </Text3DFlip>
  );
}
