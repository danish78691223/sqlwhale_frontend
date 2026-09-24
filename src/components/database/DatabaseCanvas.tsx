"use client";

import {
  Background,
  Controls,
  MarkerType,
  ReactFlow,
  type Edge,
  type Node,
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

const positions: Record<string, { x: number; y: number }> = {
  departments: { x: 40, y: 60 },
  employees: { x: 560, y: 60 },
  projects: { x: 1040, y: 60 },
  salary: { x: 560, y: 440 },
};

function createNodes(
  tables: DatabaseTableType[]
): Node[] {
  return tables.map((table, index) => ({
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
        type: "smoothstep",
        animated: false,
        pathOptions: {
          offset: 28,
          borderRadius: 14,
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
}: DatabaseCanvasProps) {
  const nodes = createNodes(tables);
  const edges = createEdges(tables);

  return (
    <div
      className="database-canvas"
      style={{ width: "100%", height: "100%" }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{
          padding: 0.2,
        }}
        minZoom={0.35}
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
