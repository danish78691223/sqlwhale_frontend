"use client";

import {
  Background,
  Controls,
  MarkerType,
  ReactFlow,
  BaseEdge,
  Position,
  useNodesState,
  getBezierPath,
  type Edge,
  type Node,
  type EdgeProps,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import DatabaseTable from "./DatabaseTable";

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
}: EdgeProps) {
  const crossesCanvasCenter = Math.abs(sourceX - targetX) > 500;
  let path: string;

  if (crossesCanvasCenter) {
    const routeY = sourceY < 360 || targetY < 360
      ? Math.min(sourceY, targetY) - 150
      : Math.max(sourceY, targetY) + 150;
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

  return <BaseEdge id={id} path={path} style={{ ...style, fill: "none" }} markerEnd={markerEnd} />;
}

function createNodes(
  tables: DatabaseTableType[]
): Node[] {
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
    },
    }));
}

function createEdges(
  tables: DatabaseTableType[]
): Edge[] {
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
  const edges = createEdges(tables);

  return (
    <div
      className="database-canvas"
      style={{ width: "100%", height: "100%" }}
    >
      <ReactFlow
        nodes={nodes}
        onNodesChange={onNodesChange}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={relationshipEdgeTypes}
        fitView
        fitViewOptions={{
          padding: 0.2,
        }}
        minZoom={0.25}
        maxZoom={1.5}
        nodesDraggable
        nodesConnectable={false}
        elementsSelectable
        style={{ width: "100%", height: "100%" }}
        proOptions={{
          hideAttribution: true,
        }}
      >
        <Background
          gap={24}
          size={1}
        />

        <Controls
          showInteractive={false}
        />
      </ReactFlow>
    </div>
  );
}
