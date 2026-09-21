"use client";

import type {
  RowVisualState,
} from "./RowState";

import RowState from "./RowState";

export interface VisualTableData {
  columns: string[];
  rows: unknown[][];
}

interface TableVisualizerProps {
  table: VisualTableData;
  rowStates?: RowVisualState[];
  title?: string;
  subtitle?: string;
  compact?: boolean;
}

function formatValue(
  value: unknown
): string {
  if (value === null) {
    return "NULL";
  }

  if (value === undefined) {
    return "";
  }

  if (typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }

  return String(value);
}

export default function TableVisualizer({
  table,
  rowStates = [],
  title = "Table",
  subtitle,
  compact = false,
}: TableVisualizerProps) {
  return (
    <div
      className={`visual-table-card ${
        compact
          ? "visual-table-compact"
          : ""
      }`}
    >
      <div className="visual-table-header">
        <div>
          <div className="visual-table-title">
            <span className="visual-table-icon">
              DB
            </span>

            <h3>{title}</h3>
          </div>

          {subtitle && (
            <p>{subtitle}</p>
          )}
        </div>

        <span className="visual-table-count">
          {table.rows.length} rows
        </span>
      </div>

      <div className="visual-table-scroll">
        <table className="visual-table">
          <thead>
            <tr>
              <th className="visual-index-header">
                #
              </th>

              {table.columns.map(
                (column, index) => (
                  <th
                    key={`${column}-${index}`}
                  >
                    {column}
                  </th>
                )
              )}
            </tr>
          </thead>

          <tbody>
            {table.rows.map(
              (row, rowIndex) => {
                const state =
                  rowStates[rowIndex] ||
                  "normal";

                return (
                  <RowState
                    key={rowIndex}
                    index={rowIndex}
                    state={state}
                  >
                    {table.columns.map(
                      (_, columnIndex) => (
                        <td
                          key={`${rowIndex}-${columnIndex}`}
                        >
                          <span className="visual-cell-value">
                            {formatValue(
                              row[
                                columnIndex
                              ]
                            )}
                          </span>
                        </td>
                      )
                    )}
                  </RowState>
                );
              }
            )}
          </tbody>
        </table>
      </div>

      <div className="visual-table-footer">
        <div className="visual-state-legend">
          <span>
            <i className="legend-dot legend-normal" />
            Normal
          </span>

          <span>
            <i className="legend-dot legend-match" />
            Matched
          </span>

          <span>
            <i className="legend-dot legend-filtered" />
            Filtered
          </span>
        </div>
      </div>
    </div>
  );
}