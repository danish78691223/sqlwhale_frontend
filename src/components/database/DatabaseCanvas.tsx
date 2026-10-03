"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  Background,
  Controls,
  MarkerType,
  Panel,
  ReactFlow,
  BaseEdge,
  EdgeLabelRenderer,
  Position,
  useEdgesState,
  useNodesState,
  useReactFlow,
  getBezierPath,
  type Edge,
  type Node,
  type EdgeProps,
  type ReactFlowInstance,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import DatabaseTable from "./DatabaseTable";
import { Lock, Unlock } from "lucide-react";

import type {
  DatabaseTable as DatabaseTableType,
} from "@/types/table";
import type { QueryAnalysis } from "@/types/execution";

interface DatabaseCanvasProps {
  tables: DatabaseTableType[];
  initialTableName?: string;
  activeSqlTarget?: SQLCursorTarget | null;
  executedQuery?: string | null;
  queryAnimationStage?: string | null;
  queryTableTargets?: string[];
  queryRevealIndex?: number | null;
  queryRevealActive?: boolean;
  queryAnalysis?: QueryAnalysis | null;
  onEditTable?: (table: DatabaseTableType) => void;
  onTableDoubleClick?: (tableName: string) => void;
  focusedTableName?: string | null;
}

interface SQLCursorTarget {
  table?: string;
  column: string;
}


const nodeTypes = {
  databaseTable: DatabaseTable,
};

const relationshipEdgeTypes = {
  wiring: RelationshipWiringEdge,
};

// Keep table sizes unchanged and arrange all tables in a
// predictable two-column grid so dynamically created tables do not overlap.
const getTablePosition = (index: number) => ({
  x: 40 + (index % 2) * 320,
  y: 40 + Math.floor(index / 2) * 360,
});

// When a query references multiple tables, keep those tables together so the
// visual execution reads naturally from left to right: first table -> second
// table -> relationship. Non-query tables keep the normal canvas grid.
const getQueryTablePosition = (queryIndex: number) => ({
  x: 140,
  y: 70 + queryIndex * 190,
});

function RelationshipWiringEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  style,
  markerEnd,
  data,
}: EdgeProps) {
  const { setEdges } = useReactFlow();
  const edgeData = data as {
    routeOffset?: number;
    color?: string;
    locked?: boolean;
    active?: boolean;
    queryActive?: boolean;
  } | undefined;
  const routeOffset = Number(edgeData?.routeOffset ?? 0);
  const edgeColor = edgeData?.color ?? "#2563eb";
  const locked = Boolean(edgeData?.locked);
  const active = Boolean(edgeData?.active);
  const queryActive = Boolean(edgeData?.queryActive);
  const crossesCanvasCenter = Math.abs(sourceX - targetX) > 500;
  const midpointX = (sourceX + targetX) / 2;
  const midpointY = (sourceY + targetY) / 2 + routeOffset;
  let path: string;

  if (crossesCanvasCenter) {
    const baseRouteY = sourceY < 360 || targetY < 360
      ? Math.min(sourceY, targetY) - 150
      : Math.max(sourceY, targetY) + 150;
    const routeY = baseRouteY + routeOffset;
    const bend = Math.max(120, Math.abs(targetX - sourceX) * 0.28);
    path =
      "M " + sourceX + " " + sourceY +
      " C " + (sourceX + bend) + " " + sourceY + ", " +
      (sourceX + bend) + " " + routeY + ", " +
      (sourceX + bend) + " " + routeY +
      " L " + (targetX - bend) + " " + routeY +
      " C " + (targetX - bend) + " " + routeY + ", " +
      (targetX - bend) + " " + targetY + ", " +
      targetX + " " + targetY;
  } else {
    [path] = getBezierPath({
      sourceX,
      sourceY,
      sourcePosition: Position.Bottom,
      targetX,
      targetY,
      targetPosition: Position.Top,
      curvature: 0.35,
    });
  }

  const moveRoute = (event: React.PointerEvent<SVGPathElement>) => {
    if (locked) return;

    event.preventDefault();
    event.stopPropagation();

    event.currentTarget.setPointerCapture(event.pointerId);

    const startY = event.clientY;
    const startOffset = routeOffset;

    const onMove = (moveEvent: PointerEvent) => {
      const delta = moveEvent.clientY - startY;

      setEdges((current) =>
        current.map((edge) =>
          edge.id === id
            ? {
                ...edge,
                data: {
                  ...edge.data,
                  routeOffset: startOffset + delta,
                },
              }
            : edge
        )
      );
    };

    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  return (
    <>
      <BaseEdge
        id={id}
        path={path}
        style={{
          ...style,
          fill: "none",
          stroke: queryActive || active ? "#facc15" : edgeColor,
          strokeWidth: queryActive || active ? 5 : 3,
          filter: queryActive || active ? "drop-shadow(0 0 7px rgba(250, 204, 21, 0.78))" : undefined,
        }}
        markerEnd={markerEnd}
        className={queryActive ? "sqlwhale-query-relationship-active" : undefined}
      />

      {!locked && (
        <>
          <path
            d={path}
            fill="none"
            stroke="transparent"
            strokeWidth={24}
            pointerEvents="stroke"
            onPointerDown={moveRoute}
            className="database-edge-interaction-path"
          />

          <EdgeLabelRenderer>
            <div
              className="database-edge-drag-handle"
              onPointerDown={(event) => {
                event.preventDefault();
                event.stopPropagation();
                event.currentTarget.setPointerCapture(event.pointerId);
                moveRoute(
                  event as unknown as React.PointerEvent<SVGPathElement>
                );
              }}
              style={{ left: midpointX, top: midpointY }}
              title="Drag to bend relationship"
            />
          </EdgeLabelRenderer>
        </>
      )}
    </>
  );
}

function createNodes(
  tables: DatabaseTableType[],
  onEditTable?: (table: DatabaseTableType) => void,
  initialTableName = "employees",
  queryTableTargets: string[] = [],
  queryRevealIndex: number | null = null,
  queryRevealActive = false,
  onTableDoubleClick?: (tableName: string) => void
): Node[] {
  return tables.map((table, index) => {
    const queryOrderIndex = queryTableTargets.findIndex(
      (target) => target.toLowerCase() === table.name.toLowerCase()
    );

    return {
      id: table.name,
      type: "databaseTable",
      position:
        queryOrderIndex >= 0
          ? getQueryTablePosition(queryOrderIndex)
          : getTablePosition(index),
      data: {
        table,
        accentIndex: index,
        locked: false,
        initialFocus: table.name === initialTableName,
        queryTarget: queryTableTargets.some(
          (target) => target.toLowerCase() === table.name.toLowerCase()
        ),
        queryRevealIndex,
        queryRevealActive,
        queryOrderIndex,
        onEditTable,
        onTableDoubleClick,
      },
    };
  });
}

function createEdges(tables: DatabaseTableType[]): Edge[] {
  const edges: Edge[] = [];
  const relationshipColors = [
    "#2563eb",
    "#06b6d4",
    "#8b5cf6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
  ];

  for (const table of tables) {
    for (const column of table.columns) {
      if (
        !column.foreignKey ||
        !column.referencesTable ||
        !column.referencesColumn
      ) {
        continue;
      }

      const color =
        relationshipColors[edges.length % relationshipColors.length];

      edges.push({
        id: `relationship-${table.name}-${column.name}-${column.referencesTable}-${column.referencesColumn}`,
        source: column.referencesTable,
        sourceHandle: `pk-${column.referencesTable}-${column.referencesColumn}`,
        target: table.name,
        targetHandle: `fk-${table.name}-${column.name}`,
        type: "wiring",
        animated: false,
        data: {
          color,
          locked: false,
          sourceTable: column.referencesTable,
          sourceColumn: column.referencesColumn,
          targetTable: table.name,
          targetColumn: column.name,
          active: false,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 16,
          height: 16,
          color,
        },
        style: {
          stroke: color,
          strokeWidth: 2.5,
        },
      });
    }
  }

  return edges;
}

export default function DatabaseCanvas({
  tables,
  initialTableName = "employees",
  activeSqlTarget = null,
  executedQuery = null,
  queryAnimationStage = null,
  queryTableTargets = [],
  queryRevealIndex = null,
  queryRevealActive = false,
  queryAnalysis = null,
  onEditTable,
  onTableDoubleClick,
  focusedTableName = null,
}: DatabaseCanvasProps) {
  // The SQL editor is the single source of truth for the table currently
  // referenced by the query. Do not fall back to the previous executed
  // query here: while the user replaces a table name, an intermediate
  // empty/partial target must clear the old focus immediately.
  const activeTableTargets = queryTableTargets;
  const initialNodes = createNodes(
    tables,
    onEditTable,
    initialTableName,
    activeTableTargets,
    queryRevealIndex,
    queryRevealActive,
    onTableDoubleClick
  );
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [flowInstance, setFlowInstance] = useState<ReactFlowInstance | null>(null);
  const [tablesLocked, setTablesLocked] = useState(false);
  const initialEdges = createEdges(tables);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const handleTableDoubleClick = useCallback((tableName: string) => {
    onTableDoubleClick?.(tableName);

    if (!flowInstance) return;

    const targetNode =
      flowInstance.getNode(tableName) ??
      flowInstance.getNodes().find(
        (node) => String(node.id).toLowerCase() === tableName.toLowerCase()
      );

    if (!targetNode) return;

    const position = targetNode.positionAbsolute ?? targetNode.position;
    const width = targetNode.measured?.width ?? targetNode.width ?? 0;
    const height = targetNode.measured?.height ?? targetNode.height ?? 0;

    flowInstance.setCenter(
      position.x + width / 2,
      position.y + height / 2,
      {
        zoom: 0.9,
        duration: 450,
      }
    );
  }, [flowInstance, onTableDoubleClick]);

  useEffect(() => {
    setNodes((current) =>
      current.map((node) => {
        const nodeQueryIndex = activeTableTargets.findIndex(
          (target) => target.toLowerCase() === String(node.id).toLowerCase()
        );
        const baseIndex = Number(node.data?.accentIndex ?? 0);

        return {
        ...node,
        data: {
          ...node.data,
          queryTarget: activeTableTargets.some(
            (target) => target.toLowerCase() === String(node.id).toLowerCase()
          ),
          queryRevealIndex,
          queryRevealActive,
          onTableDoubleClick: handleTableDoubleClick,
          queryOrderIndex: nodeQueryIndex,
          focused: focusedTableName?.toLowerCase() === String(node.id).toLowerCase(),
        },
        position:
          nodeQueryIndex >= 0
            ? getQueryTablePosition(nodeQueryIndex)
            : getTablePosition(baseIndex),
      };
      })
    );
  }, [activeTableTargets, queryRevealIndex, queryRevealActive, focusedTableName, handleTableDoubleClick, setNodes]);

  useEffect(() => {
    if (!queryAnalysis) {
      setEdges((current) =>
        current.map((edge) => ({
          ...edge,
          data: { ...edge.data, queryActive: false },
        }))
      );
      return;
    }

    const activeJoins = queryAnalysis.joins;

    setEdges((current) =>
      current.map((edge) => {
        const sourceTable = String(edge.data?.sourceTable ?? "");
        const sourceColumn = String(edge.data?.sourceColumn ?? "");
        const targetTable = String(edge.data?.targetTable ?? "");
        const targetColumn = String(edge.data?.targetColumn ?? "");

        const queryActive =
          !queryRevealActive &&
          (queryAnimationStage === "join" || queryAnimationStage === "result") &&
          activeJoins.some((join) => {
            if (
              !join.leftTable ||
              !join.leftColumn ||
              !join.rightTable ||
              !join.rightColumn
            ) {
              return false;
            }

            const direct =
              join.leftTable.toLowerCase() === sourceTable.toLowerCase() &&
              join.leftColumn.toLowerCase() === sourceColumn.toLowerCase() &&
              join.rightTable.toLowerCase() === targetTable.toLowerCase() &&
              join.rightColumn.toLowerCase() === targetColumn.toLowerCase();

            const reverse =
              join.rightTable.toLowerCase() === sourceTable.toLowerCase() &&
              join.rightColumn.toLowerCase() === sourceColumn.toLowerCase() &&
              join.leftTable.toLowerCase() === targetTable.toLowerCase() &&
              join.leftColumn.toLowerCase() === targetColumn.toLowerCase();

            return direct || reverse;
          });

        return {
          ...edge,
          data: { ...edge.data, queryActive },
        };
      })
    );
  }, [queryAnalysis, queryAnimationStage, queryRevealActive, setEdges]);

  useEffect(() => {
    setEdges((current) =>
      current.map((edge) => {
        const sourceTable = String(edge.data?.sourceTable ?? "");
        const sourceColumn = String(edge.data?.sourceColumn ?? "");
        const targetTable = String(edge.data?.targetTable ?? "");
        const targetColumn = String(edge.data?.targetColumn ?? "");

        const active =
          Boolean(activeSqlTarget?.column) &&
          (
            (activeSqlTarget?.table?.toLowerCase() === sourceTable.toLowerCase() &&
              activeSqlTarget?.column.toLowerCase() === sourceColumn.toLowerCase()) ||
            (activeSqlTarget?.table?.toLowerCase() === targetTable.toLowerCase() &&
              activeSqlTarget?.column.toLowerCase() === targetColumn.toLowerCase())
          );

        return {
          ...edge,
          data: {
            ...edge.data,
            active,
          },
        };
      })
    );
  }, [activeSqlTarget, setEdges]);

  useEffect(() => {
    const columns = document.querySelectorAll<HTMLElement>("[data-sql-column]");

    columns.forEach((element) => {
      element.classList.remove("sqlwhale-sql-cursor-column-active");

      if (!activeSqlTarget?.column) return;

      const tableElement = element.closest<HTMLElement>("[data-sql-table]");
      const tableName = tableElement?.dataset.sqlTable;

      if (
        tableName &&
        activeSqlTarget.table &&
        tableName.toLowerCase() === activeSqlTarget.table.toLowerCase() &&
        element.dataset.sqlColumn?.toLowerCase() === activeSqlTarget.column.toLowerCase()
      ) {
        element.classList.add("sqlwhale-sql-cursor-column-active");
      }
    });

    return () => {
      columns.forEach((element) =>
        element.classList.remove("sqlwhale-sql-cursor-column-active")
      );
    };
  }, [activeSqlTarget, tables]);

  useEffect(() => {
    if (activeTableTargets.length === 0 || !flowInstance) return;

    // Frame the tables referenced by the current SQL query. This is important
    // because changing a node's canvas position does not guarantee that the
    // node is inside the user's current viewport.
    const queryNodes = nodes.filter((node) =>
      activeTableTargets.some(
        (target) =>
          target.toLowerCase() === String(node.id).toLowerCase()
      )
    );

    if (queryNodes.length === 0) return;

    flowInstance.fitView({
      nodes: queryNodes,
      padding: 0.28,
      duration: 450,
      minZoom: 0.55,
      maxZoom: 1.1,
    });
  }, [activeTableTargets, nodes, flowInstance]);


  useEffect(() => {
    if (!focusedTableName || !flowInstance) return;

    const targetNode =
      flowInstance.getNode(focusedTableName) ??
      flowInstance.getNodes().find(
        (node) => String(node.id).toLowerCase() === focusedTableName.toLowerCase()
      );

    if (!targetNode) return;

    const position = targetNode.positionAbsolute ?? targetNode.position;
    const width = targetNode.measured?.width ?? targetNode.width ?? 0;
    const height = targetNode.measured?.height ?? targetNode.height ?? 0;

    flowInstance.setCenter(
      position.x + width / 2,
      position.y + height / 2,
      { zoom: 0.9, duration: 450 }
    );
  }, [focusedTableName, flowInstance]);

  const toggleTablesLock = () => {
    setTablesLocked((locked) => {
      const nextLocked = !locked;

      setNodes((current) =>
        current.map((node) => ({
          ...node,
          data: {
            ...node.data,
            locked: nextLocked,
          },
        }))
      );

      setEdges((current) =>
        current.map((edge) => ({
          ...edge,
          data: {
            ...edge.data,
            locked: nextLocked,
          },
        }))
      );

      return nextLocked;
    });
  };

  return (
    <div
      className="database-canvas"
      style={{ width: "100%", height: "100%" }}
    >
      <ReactFlow
        nodes={nodes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        edges={edges}
        onInit={setFlowInstance}
        nodeTypes={nodeTypes}
        edgeTypes={relationshipEdgeTypes}
        fitView
        fitViewOptions={{
          padding: 0.2,
        }}
        minZoom={0.25}
        maxZoom={1.5}
        nodesDraggable={!tablesLocked}
        nodesConnectable={!tablesLocked}
        elementsSelectable={!tablesLocked}
        nodesFocusable={!tablesLocked}
        edgesFocusable={!tablesLocked}
        panOnDrag={!tablesLocked}
        zoomOnScroll={!tablesLocked}
        zoomOnPinch={!tablesLocked}
        zoomOnDoubleClick={!tablesLocked}
        panOnScroll={!tablesLocked}
        style={{ width: "100%", height: "100%" }}
        proOptions={{
          hideAttribution: true,
        }}
      >
        <Panel position="top-right">
          <button
            type="button"
            className="database-canvas-lock-button"
            onClick={toggleTablesLock}
            title={tablesLocked ? "Unlock table movement" : "Lock table movement"}
            aria-label={
              tablesLocked ? "Unlock table movement" : "Lock table movement"
            }
          >
            {tablesLocked ? <Lock size={16} /> : <Unlock size={16} />}
            <span>{tablesLocked ? "Locked" : "Unlocked"}</span>
          </button>
        </Panel>

        <Background gap={24} size={1} />

        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}
