"use client";

interface DataFlowProps {
  label?: string;
  active?: boolean;
  direction?: "left" | "right";
}

export default function DataFlow({
  label = "Reading table",
  active = false,
  direction = "right",
}: DataFlowProps) {
  if (!active) {
    return null;
  }

  return (
    <div
      className={`sql-data-flow ${
        direction === "left"
          ? "flow-direction-left"
          : "flow-direction-right"
      }`}
    >
      <div className="sql-flow-line">
        <div className="sql-flow-particle particle-one" />
        <div className="sql-flow-particle particle-two" />
        <div className="sql-flow-particle particle-three" />
      </div>

      <div className="sql-flow-label">
        <span className="sql-flow-dot" />

        <span>
          {label}
        </span>
      </div>

      <div className="sql-flow-arrow">
        →
      </div>
    </div>
  );
}