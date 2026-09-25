"use client";

import { useEffect, useMemo, useState } from "react";
import type { SQLResult } from "@/types/execution";

interface QueryVisualizationProps {
  query: string;
  running: boolean;
  executed: boolean;
  result?: SQLResult;
}

type Stage = {
  key: "from" | "where" | "select" | "result";
  label: string;
  detail: string;
};

function normalizeQuery(query: string) {
  return query
    .replace(/--.*$/gm, "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/;$/, "");
}

function parseQuery(query: string, result?: SQLResult): Stage[] {
  const normalized = normalizeQuery(query);
  if (!normalized || !/^SELECT\b/i.test(normalized)) return [];

  const from = normalized.match(/\bFROM\s+["'`]?([a-zA-Z_][\w$]*)["'`]?/i)?.[1];
  if (!from) return [];

  const where = normalized.match(
    /\bWHERE\s+([\s\S]*?)(?=\s+(?:GROUP\s+BY|ORDER\s+BY|LIMIT|HAVING|UNION)\b|$)/i
  )?.[1]?.trim();

  const select = normalized.match(/^SELECT\s+([\s\S]*?)\s+FROM\b/i)?.[1]?.trim() || "*";

  const columns =
    select === "*"
      ? result?.columns?.join(", ") || "all columns"
      : select
          .split(",")
          .map((part) => part.trim())
          .filter(Boolean)
          .join(", ");

  const stages: Stage[] = [
    {
      key: "from",
      label: `FROM ${from}`,
      detail: `Use rows from ${from}`,
    },
  ];

  if (where) {
    stages.push({
      key: "where",
      label: "WHERE",
      detail: where,
    });
  }

  stages.push({
    key: "select",
    label: "SELECT",
    detail: columns,
  });

  stages.push({
    key: "result",
    label: "RESULT",
    detail: `${result?.rows.length ?? 0} rows`,
  });

  return stages;
}

function findTable(tableName: string) {
  const elements = document.querySelectorAll<HTMLElement>("[data-sql-table]");
  return Array.from(elements).find(
    (element) => element.dataset.sqlTable?.toLowerCase() === tableName.toLowerCase()
  );
}

function getSelectedColumns(query: string, result?: SQLResult) {
  const normalized = normalizeQuery(query);
  const part = normalized.match(/^SELECT\s+([\s\S]*?)\s+FROM\b/i)?.[1]?.trim();

  if (!part || part === "*") return result?.columns || [];

  return part
    .split(",")
    .map((value) =>
      value
        .trim()
        .replace(/\s+AS\s+.*$/i, "")
        .replace(/^.*\./, "")
        .replace(/["'`]/g, "")
    )
    .filter(Boolean);
}

export default function QueryVisualization({
  query,
  running,
  executed,
  result,
}: QueryVisualizationProps) {
  const stages = useMemo(() => parseQuery(query, result), [query, result]);
  const selectedColumns = useMemo(
    () => getSelectedColumns(query, result),
    [query, result]
  );

  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    if (!running || !stages.length) return;

    // Start the visual trace when Run is clicked.
    // Keep it running even if the backend responds quickly.
    setStageIndex(0);

    const timer = window.setInterval(() => {
      setStageIndex((current) =>
        current >= stages.length - 1 ? current : current + 1
      );
    }, 1400);

    return () => window.clearInterval(timer);
  }, [running, query, stages.length]);

  useEffect(() => {
    document
      .querySelectorAll<HTMLElement>("[data-sql-table]")
      .forEach((element) =>
        element.classList.remove("sqlwhale-query-source-active")
      );

    document
      .querySelectorAll<HTMLElement>("[data-sql-column]")
      .forEach((element) =>
        element.classList.remove("sqlwhale-query-column-active")
      );

    if (!stages.length || !executed) return;

    const fromStage = stages.find((stage) => stage.key === "from");
    if (fromStage) {
      const tableName = fromStage.label.replace(/^FROM\s+/i, "");
      findTable(tableName)?.classList.add("sqlwhale-query-source-active");
    }

    if (stageIndex >= 2) {
      selectedColumns.forEach((column) => {
        document
          .querySelectorAll<HTMLElement>("[data-sql-column]")
          .forEach((element) => {
            if (element.dataset.sqlColumn?.toLowerCase() === column.toLowerCase()) {
              element.classList.add("sqlwhale-query-column-active");
            }
          });
      });
    }

    return () => {
      document
        .querySelectorAll<HTMLElement>("[data-sql-table]")
        .forEach((element) =>
          element.classList.remove("sqlwhale-query-source-active")
        );
      document
        .querySelectorAll<HTMLElement>("[data-sql-column]")
        .forEach((element) =>
          element.classList.remove("sqlwhale-query-column-active")
        );
    };
  }, [executed, stages, stageIndex, selectedColumns]);

  if ((!running && !executed) || !stages.length) return null;

  const current = stages[stageIndex];
  const showRows = stageIndex >= stages.findIndex((stage) => stage.key === "where");
  const showResult = current.key === "result";

  return (
    <div className="sql-query-animation" aria-live="polite">
      <div className="sql-query-animation-head">
        <span className="sql-query-animation-kicker">QUERY FLOW</span>
        <span className="sql-query-animation-step">
          {stageIndex + 1}/{stages.length}
        </span>
      </div>

      <div className="sql-query-animation-track">
        {stages.map((stage, index) => (
          <div
            key={stage.key}
            className={`sql-query-animation-stage ${index === stageIndex ? "is-active" : ""} ${index < stageIndex ? "is-done" : ""}`}
          >
            <span className="sql-query-animation-dot" />
            <span>{stage.label}</span>
          </div>
        ))}
      </div>

      <div className="sql-query-animation-action">
        <strong>{current.label}</strong>
        <span>{current.detail}</span>
      </div>

      {showRows && result && result.rows.length > 0 && !showResult && (
        <div className="sql-query-animation-preview">
          <div className="sql-query-animation-preview-label">
            Matching rows
          </div>

          <div className="sql-query-animation-preview-table">
            <table>
              <thead>
                <tr>
                  {result.columns.map((column) => (
                    <th
                      key={column}
                      className={
                        stageIndex >= 2 &&
                        selectedColumns.some(
                          (selected) =>
                            selected.toLowerCase() === column.toLowerCase()
                        )
                          ? "is-selected"
                          : ""
                      }
                    >
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.rows.slice(0, 6).map((row, index) => (
                  <tr
                    key={index}
                    style={{
                      animationDelay: `${index * 70}ms`,
                    }}
                  >
                    {result.columns.map((column, columnIndex) => (
                      <td
                        key={column}
                        className={
                          stageIndex >= 2 &&
                          selectedColumns.some(
                            (selected) =>
                              selected.toLowerCase() === column.toLowerCase()
                          )
                            ? "is-selected"
                            : ""
                        }
                      >
                        {String(row[columnIndex] ?? "")}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showResult && (
        <div className="sql-query-animation-complete">
          <span>✓</span>
          <strong>Result ready</strong>
          <small>{result?.rows.length ?? 0} rows</small>
        </div>
      )}
    </div>
  );
}
