"use client";

import {
  Database,
  KeyRound,
  Link2,
  Pencil,
} from "lucide-react";

import {
  Handle,
  Position,
  NodeResizer,
  type NodeProps,
} from "@xyflow/react";

import type { DatabaseTable as DatabaseTableType } from "@/types/table";

interface DatabaseTableNodeData {
  table: DatabaseTableType;
  accentIndex?: number;
  locked?: boolean;
  initialFocus?: boolean;
  queryTarget?: boolean;
  queryRevealIndex?: number | null;
  queryRevealActive?: boolean;
  queryOrderIndex?: number;
  onEditTable?: (table: DatabaseTableType) => void;
  onTableDoubleClick?: (tableName: string) => void;
  focused?: boolean;
  destroying?: boolean;
  destroyingStage?: number;
}

export default function DatabaseTable({
  data,
}: NodeProps) {
  const nodeData =
    data as unknown as DatabaseTableNodeData;

  const table = nodeData.table;

  const accentIndex =
    nodeData.accentIndex ?? 0;

  const locked = Boolean(nodeData.locked);
  const initialFocus = Boolean(nodeData.initialFocus);
  const queryTarget = Boolean(nodeData.queryTarget);
  const queryRevealIndex = nodeData.queryRevealIndex ?? null;
  const queryRevealActive = Boolean(nodeData.queryRevealActive);
  const queryOrderIndex = nodeData.queryOrderIndex ?? -1;
  const queryRevealed = !queryRevealActive || queryOrderIndex < 0 || (queryRevealIndex !== null && queryOrderIndex <= queryRevealIndex);
  const onEditTable = nodeData.onEditTable;
  const onTableDoubleClick = nodeData.onTableDoubleClick;
  const focused = Boolean(nodeData.focused);
  const destroying = Boolean(nodeData.destroying);
  const destroyingStage = Number(nodeData.destroyingStage ?? 0);

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
    <>
      <NodeResizer
        isVisible={!locked}
        minWidth={220}
        minHeight={120}
        lineStyle={{ borderWidth: 1 }}
        handleStyle={{ width: 8, height: 8 }}
      />
      <div className={`sql-table-node ${accent}${locked ? " is-locked" : ""}${initialFocus ? " is-initial-focus" : ""}${queryTarget ? " is-query-target" : ""}${focused ? " is-focused" : ""}${destroying ? " is-destroying" : ""}${destroyingStage >= 2 ? " is-exploding" : ""}${queryRevealActive && queryOrderIndex >= 0 ? (queryRevealed ? " is-query-revealed" : " is-query-pending") : ""}`} data-sql-table={table.name} style={focused ? { borderColor: "#facc15", boxShadow: "0 0 0 2px rgba(250, 204, 21, 0.2)" } : undefined} onDoubleClick={(event) => { event.preventDefault(); event.stopPropagation(); onTableDoubleClick?.(table.name); }}>
      {destroying && destroyingStage >= 2 && (
        <div className="sql-table-destruction-fragments" aria-hidden="true">
          {Array.from({ length: 12 }, (_, index) => (
            <span key={index} className={`sql-table-fragment fragment-${index + 1}`} />
          ))}
        </div>
      )}

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

        <div className="sql-table-header-actions">
          <span className="sql-column-count">
            {table.columns.length}{" "}
            {table.columns.length === 1 ? "column" : "columns"}
          </span>
          {onEditTable && (
            <button
              type="button"
              className="sql-table-edit-button nodrag nopan"
              onPointerDown={(event) => event.stopPropagation()}
              onClick={(event) => {
                event.stopPropagation();
                onEditTable(table);
              }}
              title={"Edit " + table.name}
              aria-label={"Edit " + table.name}
            >
              <Pencil size={12} />
            </button>
          )}
        </div>
      </div>

      <div className="sql-table-columns">
        {table.columns.map((column) => {
          const isPrimaryKey = Boolean(column.primaryKey);
          const isForeignKey = Boolean(column.foreignKey);

          return (
            <div
              key={column.name}
              className="sql-table-column relative"
              data-sql-column={column.name}
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
    </>
  );
}
