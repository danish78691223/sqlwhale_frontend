"use client";

import { useEffect, useMemo, useState } from "react";

type QueryKind =
  | "SELECT"
  | "WHERE"
  | "JOIN"
  | "GROUP"
  | "ORDER"
  | "LIMIT"
  | "INSERT"
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "DROP"
  | "UNKNOWN";

type Position = {
  x: number;
  y: number;
};

interface QueryVisualizationProps {
  query: string;
  running: boolean;
  executed: boolean;
}

/* =========================================================
   QUERY HELPERS
========================================================= */

function normalizeQuery(query: string): string {
  return query
    .replace(/--.*$/gm, "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/;$/, "");
}

function getTableNames(query: string): string[] {
  const names: string[] = [];

  const normalized = normalizeQuery(query);

  const fromMatches = normalized.matchAll(
    /\bFROM\s+["'`]?([a-zA-Z_][\w$]*)["'`]?/gi
  );

  for (const match of fromMatches) {
    if (match[1]) {
      names.push(match[1]);
    }
  }

  const joinMatches = normalized.matchAll(
    /\bJOIN\s+["'`]?([a-zA-Z_][\w$]*)["'`]?/gi
  );

  for (const match of joinMatches) {
    if (match[1]) {
      names.push(match[1]);
    }
  }

  const insertMatch = normalized.match(
    /\bINSERT\s+INTO\s+["'`]?([a-zA-Z_][\w$]*)["'`]?/i
  );

  if (insertMatch?.[1]) {
    names.push(insertMatch[1]);
  }

  const updateMatch = normalized.match(
    /\bUPDATE\s+["'`]?([a-zA-Z_][\w$]*)["'`]?/i
  );

  if (updateMatch?.[1]) {
    names.push(updateMatch[1]);
  }

  const deleteMatch = normalized.match(
    /\bDELETE\s+FROM\s+["'`]?([a-zA-Z_][\w$]*)["'`]?/i
  );

  if (deleteMatch?.[1]) {
    names.push(deleteMatch[1]);
  }

  const dropMatch = normalized.match(
    /\bDROP\s+TABLE\s+(?:IF\s+EXISTS\s+)?["'`]?([a-zA-Z_][\w$]*)["'`]?/i
  );

  if (dropMatch?.[1]) {
    names.push(dropMatch[1]);
  }

  return [...new Set(names)];
}

function detectQueryKind(query: string): QueryKind {
  const q = normalizeQuery(query).toUpperCase();

  if (/^CREATE\s+TABLE\b/.test(q)) {
    return "CREATE";
  }

  if (/^INSERT\s+INTO\b/.test(q)) {
    return "INSERT";
  }

  if (/^UPDATE\b/.test(q)) {
    return "UPDATE";
  }

  if (/^DELETE\s+FROM\b/.test(q)) {
    return "DELETE";
  }

  if (/^DROP\s+TABLE\b/.test(q)) {
    return "DROP";
  }

  if (/\bJOIN\b/.test(q)) {
    return "JOIN";
  }

  if (/\bGROUP\s+BY\b/.test(q)) {
    return "GROUP";
  }

  if (/\bORDER\s+BY\b/.test(q)) {
    return "ORDER";
  }

  if (/\bLIMIT\b/.test(q)) {
    return "LIMIT";
  }

  if (/\bWHERE\b/.test(q)) {
    return "WHERE";
  }

  if (/^SELECT\b/.test(q)) {
    return "SELECT";
  }

  return "UNKNOWN";
}

function getJoinType(query: string): string {
  const match = normalizeQuery(query).match(
    /\b(INNER|LEFT|RIGHT|FULL|CROSS)?\s+JOIN\b/i
  );

  if (match?.[1]) {
    return `${match[1].toUpperCase()} JOIN`;
  }

  return "INNER JOIN";
}

function getCreatedTable(query: string): string {
  const match = normalizeQuery(query).match(
    /\bCREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?["'`]?([a-zA-Z_][\w$]*)["'`]?/i
  );

  return match?.[1] || "new_table";
}

function getOperationLabel(
  query: string,
  kind: QueryKind
): string {
  switch (kind) {
    case "SELECT":
      return "Reading table";

    case "WHERE":
      return "Filtering rows";

    case "JOIN":
      return `Joining ${getJoinType(query)}`;

    case "GROUP":
      return "Grouping rows";

    case "ORDER":
      return "Sorting rows";

    case "LIMIT":
      return "Applying LIMIT";

    case "INSERT":
      return "Inserting row";

    case "CREATE":
      return "Creating table";

    case "UPDATE":
      return "Updating rows";

    case "DELETE":
      return "Deleting rows";

    case "DROP":
      return "Removing table";

    default:
      return "Executing query";
  }
}

function getStepCount(kind: QueryKind): number {
  switch (kind) {
    case "JOIN":
      return 3;

    case "SELECT":
    case "WHERE":
    case "GROUP":
    case "ORDER":
    case "LIMIT":
      return 2;

    case "CREATE":
    case "INSERT":
    case "UPDATE":
    case "DELETE":
    case "DROP":
      return 2;

    default:
      return 0;
  }
}

/* =========================================================
   DOM LOOKUPS
========================================================= */

function getTableElement(
  tableName: string
): HTMLElement | null {
  const elements =
    document.querySelectorAll<HTMLElement>(
      "[data-sql-table]"
    );

  for (const element of elements) {
    if (element.dataset.sqlTable === tableName) {
      return element;
    }
  }

  return null;
}

function getOutputElement(): HTMLElement | null {
  return document.querySelector(
    "[data-sql-output]"
  ) as HTMLElement | null;
}

function getDatabaseElement(): HTMLElement | null {
  return document.querySelector(
    "[data-sql-database]"
  ) as HTMLElement | null;
}

/* =========================================================
   COMPONENT
========================================================= */

export default function QueryVisualization({
  query,
  running,
  executed,
}: QueryVisualizationProps) {
  const kind = useMemo(
    () => detectQueryKind(query),
    [query]
  );

  const sourceTables = useMemo(
    () => getTableNames(query),
    [query]
  );

  const stepCount = useMemo(
    () => getStepCount(kind),
    [kind]
  );

  const [activeStep, setActiveStep] =
    useState(0);

  const [visible, setVisible] =
    useState(false);

  const [positions, setPositions] =
    useState<Record<string, Position>>({});

  /* =======================================================
     START / KEEP ANIMATION
  ======================================================= */

  useEffect(() => {
    if (!query.trim()) {
      setVisible(false);
      setActiveStep(0);
      return;
    }

    if (!running && !executed) {
      setVisible(false);
      setActiveStep(0);
      return;
    }

    setVisible(true);
    setActiveStep(0);

    if (stepCount <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveStep((current) => {
        if (current >= stepCount - 1) {
          return current;
        }

        return current + 1;
      });
    }, 700);

    return () => {
      window.clearInterval(timer);
    };
  }, [
    query,
    running,
    executed,
    stepCount,
  ]);

  /* =======================================================
     CALCULATE REAL SCREEN POSITIONS
  ======================================================= */

  useEffect(() => {
    if (!visible) {
      return;
    }

    let frame = 0;
    let delayedTimer = 0;

    const calculatePositions = () => {
      const next: Record<string, Position> = {};

      const addElement = (
        key: string,
        element: HTMLElement | null
      ) => {
        if (!element) {
          return;
        }

        const rect =
          element.getBoundingClientRect();

        next[key] = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        };
      };

      sourceTables.forEach((table) => {
        addElement(
          `table:${table}`,
          getTableElement(table)
        );
      });

      addElement(
        "output",
        getOutputElement()
      );

      addElement(
        "database",
        getDatabaseElement()
      );

      setPositions(next);
    };

    frame = window.requestAnimationFrame(
      calculatePositions
    );

    delayedTimer = window.setTimeout(
      calculatePositions,
      80
    );

    window.addEventListener(
      "resize",
      calculatePositions
    );

    window.addEventListener(
      "scroll",
      calculatePositions,
      true
    );

    let resizeObserver:
      | ResizeObserver
      | null = null;

    if ("ResizeObserver" in window) {
      resizeObserver = new ResizeObserver(
        calculatePositions
      );

      resizeObserver.observe(
        document.body
      );
    }

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(delayedTimer);

      window.removeEventListener(
        "resize",
        calculatePositions
      );

      window.removeEventListener(
        "scroll",
        calculatePositions,
        true
      );

      resizeObserver?.disconnect();
    };
  }, [
    visible,
    query,
    sourceTables,
  ]);

  /* =======================================================
     ACTIVE TABLE ANIMATION
  ======================================================= */

  useEffect(() => {
    const tableElements =
      document.querySelectorAll<HTMLElement>(
        "[data-sql-table]"
      );

    tableElements.forEach((element) => {
      element.classList.remove(
        "sqlwhale-source-active"
      );
    });

    if (!visible) {
      return;
    }

    if (kind === "JOIN") {
      sourceTables.forEach(
        (table, index) => {
          if (activeStep >= index) {
            getTableElement(
              table
            )?.classList.add(
              "sqlwhale-source-active"
            );
          }
        }
      );
    } else {
      const source = sourceTables[0];

      if (source) {
        getTableElement(
          source
        )?.classList.add(
          "sqlwhale-source-active"
        );
      }
    }

    return () => {
      tableElements.forEach((element) => {
        element.classList.remove(
          "sqlwhale-source-active"
        );
      });
    };
  }, [
    visible,
    kind,
    sourceTables,
    activeStep,
  ]);

  /* =======================================================
     OUTPUT ACTIVE STATE
  ======================================================= */

  useEffect(() => {
    const output =
      getOutputElement();

    if (!output) {
      return;
    }

    output.classList.toggle(
      "sqlwhale-output-active",
      visible &&
        activeStep >= stepCount - 1
    );

    return () => {
      output.classList.remove(
        "sqlwhale-output-active"
      );
    };
  }, [
    visible,
    activeStep,
    stepCount,
  ]);

  if (!visible) {
    return null;
  }

  /* =======================================================
     SELECT / WHERE / GROUP / ORDER / LIMIT
  ======================================================= */

  const output = positions.output;

  if (
    kind !== "JOIN" &&
    kind !== "CREATE" &&
    kind !== "INSERT" &&
    kind !== "UPDATE" &&
    kind !== "DELETE" &&
    kind !== "DROP"
  ) {
    const source =
      sourceTables[0]
        ? positions[
            `table:${sourceTables[0]}`
          ]
        : undefined;

    if (!source || !output) {
      return null;
    }

    const operationPoint: Position = {
      x:
        (source.x + output.x) / 2,
      y:
        (source.y + output.y) / 2,
    };

    return (
      <svg
        className="sql-execution-overlay"
        aria-hidden="true"
      >
        <defs>
          <marker
            id="sqlArrowBlue"
            markerWidth="10"
            markerHeight="10"
            refX="8"
            refY="4"
            orient="auto"
          >
            <path
              d="M0,0 L0,8 L9,4 z"
              fill="#3b82f6"
            />
          </marker>

          <filter
            id="sqlGlow"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feGaussianBlur
              stdDeviation="3"
              result="blur"
            />

            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <AnimatedArrow
          from={source}
          to={operationPoint}
          active={activeStep >= 0}
          label={getOperationLabel(
            query,
            kind
          )}
        />

        <circle
          cx={operationPoint.x}
          cy={operationPoint.y}
          r="18"
          className="sql-operation-node"
        />

        <text
          x={operationPoint.x}
          y={operationPoint.y + 4}
          textAnchor="middle"
          className="sql-operation-text"
        >
          {kind === "WHERE"
            ? "WHERE"
            : kind === "GROUP"
              ? "GROUP"
              : kind === "ORDER"
                ? "ORDER"
                : kind === "LIMIT"
                  ? "LIMIT"
                  : "SELECT"}
        </text>

        <AnimatedArrow
          from={operationPoint}
          to={output}
          active={activeStep >= 1}
          label="Result"
        />
      </svg>
    );
  }

  /* =======================================================
     JOIN
  ======================================================= */

  if (kind === "JOIN") {
    const first =
      sourceTables[0]
        ? positions[
            `table:${sourceTables[0]}`
          ]
        : undefined;

    const second =
      sourceTables[1]
        ? positions[
            `table:${sourceTables[1]}`
          ]
        : undefined;

    if (!first || !second || !output) {
      return null;
    }

    const joinPoint: Position = {
      x: (first.x + second.x) / 2,
      y: (first.y + second.y) / 2,
    };

    return (
      <svg
        className="sql-execution-overlay"
        aria-hidden="true"
      >
        <defs>
          <marker
            id="sqlArrowBlue"
            markerWidth="10"
            markerHeight="10"
            refX="8"
            refY="4"
            orient="auto"
          >
            <path
              d="M0,0 L0,8 L9,4 z"
              fill="#3b82f6"
            />
          </marker>

          <filter
            id="sqlGlow"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feGaussianBlur
              stdDeviation="3"
              result="blur"
            />

            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <AnimatedArrow
          from={first}
          to={joinPoint}
          active={activeStep >= 0}
          label={sourceTables[0]}
        />

        <AnimatedArrow
          from={second}
          to={joinPoint}
          active={activeStep >= 1}
          label={sourceTables[1]}
        />

        <circle
          cx={joinPoint.x}
          cy={joinPoint.y}
          r="19"
          className="sql-join-node"
        />

        <text
          x={joinPoint.x}
          y={joinPoint.y + 4}
          textAnchor="middle"
          className="sql-join-text"
        >
          JOIN
        </text>

        <AnimatedArrow
          from={joinPoint}
          to={output}
          active={activeStep >= 2}
          label={getJoinType(query)}
        />
      </svg>
    );
  }

  /* =======================================================
     CREATE TABLE
  ======================================================= */

  if (kind === "CREATE") {
    const database =
      positions.database;

    if (!database) {
      return null;
    }

    const start: Position = {
      x: window.innerWidth / 2,
      y: 90,
    };

    return (
      <svg
        className="sql-execution-overlay"
        aria-hidden="true"
      >
        <defs>
          <marker
            id="sqlArrowBlue"
            markerWidth="10"
            markerHeight="10"
            refX="8"
            refY="4"
            orient="auto"
          >
            <path
              d="M0,0 L0,8 L9,4 z"
              fill="#3b82f6"
            />
          </marker>

          <filter
            id="sqlGlow"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feGaussianBlur
              stdDeviation="3"
              result="blur"
            />

            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <AnimatedArrow
          from={start}
          to={database}
          active
          label={`CREATE ${getCreatedTable(
            query
          )}`}
        />
      </svg>
    );
  }

  /* =======================================================
     INSERT / UPDATE / DELETE / DROP
  ======================================================= */

  if (
    kind === "INSERT" ||
    kind === "UPDATE" ||
    kind === "DELETE" ||
    kind === "DROP"
  ) {
    const source =
      sourceTables[0]
        ? positions[
            `table:${sourceTables[0]}`
          ]
        : undefined;

    if (!source) {
      return null;
    }

    const actionPoint: Position = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    };

    return (
      <svg
        className="sql-execution-overlay"
        aria-hidden="true"
      >
        <defs>
          <marker
            id="sqlArrowBlue"
            markerWidth="10"
            markerHeight="10"
            refX="8"
            refY="4"
            orient="auto"
          >
            <path
              d="M0,0 L0,8 L9,4 z"
              fill="#3b82f6"
            />
          </marker>

          <filter
            id="sqlGlow"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feGaussianBlur
              stdDeviation="3"
              result="blur"
            />

            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <AnimatedArrow
          from={source}
          to={actionPoint}
          active={activeStep >= 0}
          label={getOperationLabel(
            query,
            kind
          )}
        />

        <circle
          cx={actionPoint.x}
          cy={actionPoint.y}
          r="19"
          className="sql-operation-node"
        />

        <text
          x={actionPoint.x}
          y={actionPoint.y + 4}
          textAnchor="middle"
          className="sql-operation-text"
        >
          {kind}
        </text>
      </svg>
    );
  }

  return null;
}

/* =========================================================
   ANIMATED ARROW
========================================================= */

interface AnimatedArrowProps {
  from: Position;
  to: Position;
  active: boolean;
  label: string;
  color?: string;
}

function AnimatedArrow({
  from,
  to,
  active,
  label,
  color = "#3b82f6",
}: AnimatedArrowProps) {
  if (!active) {
    return null;
  }

  const dx = to.x - from.x;
  const dy = to.y - from.y;

  const horizontal =
    Math.abs(dx) >= Math.abs(dy);

  const path = horizontal
    ? `
        M ${from.x} ${from.y}
        C
        ${from.x + dx * 0.25} ${from.y}
        ${to.x - dx * 0.25} ${to.y}
        ${to.x} ${to.y}
      `
    : `
        M ${from.x} ${from.y}
        C
        ${from.x} ${from.y + dy * 0.25}
        ${to.x} ${to.y - dy * 0.25}
        ${to.x} ${to.y}
      `;

  const labelX =
    from.x + dx * 0.5;

  const labelY =
    from.y + dy * 0.5 - 18;

  const markerId =
    color === "#10b981"
      ? "sqlArrowGreen"
      : "sqlArrowBlue";

  return (
    <g className="sql-arrow-group">
      <path
        d={path}
        fill="none"
        stroke="rgba(59,130,246,0.12)"
        strokeWidth="7"
        strokeLinecap="round"
      />

      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="9 9"
        markerEnd={`url(#${markerId})`}
        className="sql-moving-arrow"
      />

      <circle
        cx={from.x}
        cy={from.y}
        r="5"
        fill={color}
        className="sql-source-dot"
      />

      <g
        transform={`translate(${labelX}, ${labelY})`}
      >
        <rect
          x="-60"
          y="-14"
          width="120"
          height="28"
          rx="8"
          className="sql-arrow-label-bg"
        />

        <circle
          cx="-44"
          cy="0"
          r="4"
          fill={color}
        />

        <text
          x="-34"
          y="4"
          className="sql-arrow-label"
        >
          {label}
        </text>
      </g>
    </g>
  );
}