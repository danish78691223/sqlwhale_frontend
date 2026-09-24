"use client";

import { useState } from "react";

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
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import DatabaseTable from "./DatabaseTable";
import { Lock, Unlock } from "lucide-react";

import type {
  DatabaseTable as DatabaseTableType,
} from "@/types/table";

interface DatabaseCanvasProps {
  tables: DatabaseTableType[];
}

const nodeTypes = {
  databaseTable: DatabaseTable,
};

const relationshipEdgeTypes = {
  wiring: RelationshipWiringEdge,
};

const positions: Record<string, { x: number; y: number }> = {
  departments: { x: 40, y: 70 },
  employees: { x: 40, y: 430 },
  projects: { x: 980, y: 70 },
  salary: { x: 980, y: 430 },
};

const visibleTableNames = new Set([
  "departments",
  "employees",
  "projects",
  "salary",
]);

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
  } | undefined;
  const routeOffset = Number(edgeData?.routeOffset ?? 0);
  const edgeColor = edgeData?.color ?? "#2563eb";
  const locked = Boolean(edgeData?.locked);
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
      sourcePosition: Position.Right,
      targetX,
      targetY,
      targetPosition: Position.Left,
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
          stroke: edgeColor,
          strokeWidth: 3,
        }}
        markerEnd={markerEnd}
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

function createNodes(tables: DatabaseTableType[]): Node[] {
  return tables
    .filter((table) => visibleTableNames.has(table.name))
    .map((table, index) => ({
      id: table.name,
      type: "databaseTable",
      position:
        positions[table.name] ?? {
          x: 80 + (index % 3) * 420,
          y: 100 + Math.floor(index / 3) * 360,
        },
      data: {
        table,
        accentIndex: index,
        locked: false,
      },
    }));
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

  for (const table of tables.filter((table) => visibleTableNames.has(table.name))) {
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
        data: { color, locked: false },
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
}: DatabaseCanvasProps) {
  const initialNodes = createNodes(tables);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [tablesLocked, setTablesLocked] = useState(false);
  const initialEdges = createEdges(tables);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

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
