"use client";

import type { ReactNode } from "react";

export type RowVisualState =
  | "normal"
  | "highlighted"
  | "matched"
  | "filtered"
  | "result";

interface RowStateProps {
  state?: RowVisualState;
  children: ReactNode;
  index?: number;
}

export default function RowState({
  state = "normal",
  children,
  index,
}: RowStateProps) {
  return (
    <tr
      className={`visual-row visual-row-${state}`}
    >
      {index !== undefined && (
        <td className="visual-row-index">
          {index + 1}
        </td>
      )}

      {children}
    </tr>
  );
}