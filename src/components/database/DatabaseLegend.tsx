"use client";

import {
  Circle,
} from "lucide-react";

export default function DatabaseLegend() {
  return (
    <div className="database-legend">
      <div className="database-legend-title">
        Relationship Legend
      </div>

      <div className="database-legend-item">
        <Circle
          size={9}
          fill="currentColor"
          className="text-blue-500"
        />
        <span>Primary relationship</span>
      </div>

      <div className="database-legend-item">
        <Circle
          size={9}
          fill="currentColor"
          className="text-cyan-500"
        />
        <span>Foreign key</span>
      </div>

      <div className="database-legend-item">
        <Circle
          size={9}
          fill="currentColor"
          className="text-purple-500"
        />
        <span>Join relationship</span>
      </div>
    </div>
  );
}