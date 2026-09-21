"use client";

import {
  Background,
  Controls,
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

function createNodes(
  tables: DatabaseTableType[]
): Node[] {
  const positions = [
    { x: 40, y: 40 },
    { x: 760, y: 40 },
    { x: 40, y: 420 },
    { x: 760, y: 420 },
    { x: 400, y: 40 },
    { x: 400, y: 500 },
  ];

  return tables.map((table, index) => {
    const position =
      positions[index] ?? {
        x: 100 + (index % 3) * 360,
        y: 100 + Math.floor(index / 3) * 350,
      };

    return {
      id: table.name,
      type: "databaseTable",

      position,

      data: {
        table,
        accentIndex: index,
      },
    };
  });
}

function createEdges(
  tables: DatabaseTableType[]
): Edge[] {
  const edges: Edge[] = [];

  for (const table of tables) {
    for (const column of table.columns) {
      if (
        !column.foreignKey ||
        !column.referencesTable
      ) {
        continue;
      }

      edges.push({
        id: `${table.name}-${column.name}-${column.referencesTable}`,

        source: table.name,

        target: column.referencesTable,

        type: "smoothstep",

        animated: true,

        label: `${table.name}.${column.name}`,

        style: {
          strokeWidth: 2,
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
    <div className="database-canvas">
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