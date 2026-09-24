"use client";

import {
  Database,
  KeyRound,
  Link2,
} from "lucide-react";

import {
  Handle,
  Position,
  type NodeProps,
} from "@xyflow/react";

import type { DatabaseTable as DatabaseTableType } from "@/types/table";

interface DatabaseTableNodeData {
  table: DatabaseTableType;
  accentIndex?: number;
}

export default function DatabaseTable({
  data,
}: NodeProps) {
  const nodeData =
    data as unknown as DatabaseTableNodeData;

  const table = nodeData.table;

  const accentIndex =
    nodeData.accentIndex ?? 0;

  const accentClasses = [
    "table-accent-blue",
    "table-accent-cyan",
    "table-accent-purple",
    "table-accent-green",
  ];

  const accent =
    accentClasses[
      accentIndex % accentClasses.length
    ];

  return (
    <div className="sql-table-node">
      <div
        className={`sql-table-header ${accent}`}
      >
        <div className="flex min-w-0 items-center gap-2">
          <div className="sql-table-icon">
            <Database size={16} />
          </div>

          <span className="truncate font-semibold">
            {table.name}
          </span>
        </div>

        <span className="sql-column-count">
          {table.columns.length}{" "}
          {table.columns.length === 1
            ? "column"
            : "columns"}
        </span>
      </div>

      <div className="sql-table-columns">
        {table.columns.map((column) => {
          const isPrimaryKey = Boolean(column.primaryKey);
          const isForeignKey = Boolean(column.foreignKey);

          return (
            <div
              key={column.name}
              className="sql-table-column relative"
            >
              {isPrimaryKey && (
                <Handle
                  id={`pk-${table.name}-${column.name}`}
                  type="source"
                  position={Position.Right}
                  style={{
                    width: 8,
                    height: 8,
                    right: -5,
                    top: "50%",
                    transform: "translateY(-50%)",
                    opacity: 0,
                  }}
                />
              )}

              {isForeignKey && (
                <Handle
                  id={`fk-${table.name}-${column.name}`}
                  type="target"
                  position={Position.Left}
                  style={{
                    width: 8,
                    height: 8,
                    left: -5,
                    top: "50%",
                    transform: "translateY(-50%)",
                    opacity: 0,
                  }}
                />
              )}

              <div className="flex min-w-0 items-center gap-2">
                {isPrimaryKey ? (
                  <KeyRound
                    size={13}
                    className="shrink-0 text-amber-500"
                  />
                ) : isForeignKey ? (
                  <Link2
                    size={13}
                    className="shrink-0 text-blue-500"
                  />
                ) : (
                  <span className="column-dot" />
                )}

                <span className="truncate">
                  {column.name}
                </span>

                {isForeignKey && (
                  <span className="fk-badge">
                    FK
                  </span>
                )}
              </div>

              <span className="sql-column-type">
                {column.type.toLowerCase()}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
