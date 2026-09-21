"use client";

import { useEffect, useState } from "react";

interface TableMoveAnimationProps {
  tableName: string;
  visible: boolean;
  onComplete?: () => void;
}

export default function TableMoveAnimation({
  tableName,
  visible,
  onComplete,
}: TableMoveAnimationProps) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (!visible) {
      setStage(0);
      return;
    }

    const timers = [
      window.setTimeout(() => setStage(1), 200),
      window.setTimeout(() => setStage(2), 750),
      window.setTimeout(() => setStage(3), 1350),
      window.setTimeout(() => {
        setStage(4);
        onComplete?.();
      }, 1950),
    ];

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [visible, onComplete]);

  if (!visible) {
    return null;
  }

  return (
    <div className="table-move-overlay">
      <div className="table-move-database">
        <div className="table-move-database-icon">▣</div>

        <strong>Database</strong>

        <span>SQLWhale DB</span>
      </div>

      <div
        className={[
          "table-move-table",
          stage >= 1 ? "stage-one" : "",
          stage >= 2 ? "stage-two" : "",
          stage >= 3 ? "stage-three" : "",
          stage >= 4 ? "stage-four" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <div className="table-move-table-header">
          <span className="table-move-table-dot" />
          {tableName}
        </div>

        <div className="table-move-table-row">
          🔑 id <span>integer</span>
        </div>

        <div className="table-move-table-row">
          name <span>text</span>
        </div>

        <div className="table-move-table-row">
          created_at <span>date</span>
        </div>
      </div>

      <div className="table-move-arrow">→</div>

      <div className="table-move-workspace">
        <span>Workspace</span>

        <div className="workspace-target">
          {stage >= 3 && (
            <strong>{tableName}</strong>
          )}
        </div>
      </div>
    </div>
  );
}