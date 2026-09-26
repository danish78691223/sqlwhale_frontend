"use client";

import { useEffect, useMemo, useState } from "react";
import type { SQLExecution, SQLResult, ExecutionStep } from "@/types/execution";

interface QueryVisualizationProps {
  query: string;
  running: boolean;
  executed: boolean;
  result?: SQLResult;
  execution?: SQLExecution;
  runId: number;
  onComplete?: () => void;
}

type VisualStage = "scan" | "filter" | "select" | "result";
const STAGE_DURATION = 1700;

function normalizeQuery(query: string) {
  return query.replace(/--.*$/gm, "").replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, " ").trim().replace(/;$/, "");
}

function getTableName(query: string) {
  return normalizeQuery(query).match(/\bFROM\s+[a-zA-Z_][\w$]*/i)?.[0]?.replace(/^FROM\s+/i, "");
}

function getWhereCondition(query: string) {
  return normalizeQuery(query).match(/\bWHERE\s+([\s\S]*?)(?=\s+(?:GROUP\s+BY|ORDER\s+BY|LIMIT|HAVING|UNION)\b|$)/i)?.[1]?.trim();
}

function getSelectedColumns(query: string, result?: SQLResult) {
  const part = normalizeQuery(query).match(/^SELECT\s+([\s\S]*?)\s+FROM\b/i)?.[1]?.trim();
  if (!part || part === "*") return result?.columns ?? [];

  return part.split(",").map((value) =>
    value.trim().replace(/\s+AS\s+.*$/i, "").replace(/^.*\./, "").replace(/["']/g, "")
  ).filter(Boolean);
}

function getStep(execution: SQLExecution | undefined, operation: string): ExecutionStep | undefined {
  return execution?.steps.find((step) => step.operation === operation);
}

function valueOf(value: unknown) {
  return value === null || value === undefined ? "NULL" : String(value);
}

function DataTable({
  columns,
  rows,
  matchedRows,
  selectedColumns,
  mode,
}: {
  columns: string[];
  rows: unknown[][];
  matchedRows?: number[];
  selectedColumns: string[];
  mode: VisualStage;
}) {
  const visibleRows = rows.slice(0, 8);
  const filtering = mode === "filter" && Array.isArray(matchedRows);

  return (
    <div className="sqlwhale-visual-table-wrap">
      <table className="sqlwhale-visual-table">
        <thead>
          <tr>
            {columns.map((column) => {
              const selected = mode === "select" &&
                selectedColumns.some((name) => name.toLowerCase() === column.toLowerCase());

              return <th key={column} className={selected ? "is-selected-column" : ""}>{column}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {visibleRows.map((row, rowIndex) => {
            const matched = !filtering || matchedRows?.includes(rowIndex);

            return (
              <tr key={rowIndex} className={filtering ? (matched ? "is-matching-row" : "is-rejected-row") : ""}>
                {columns.map((column, columnIndex) => {
                  const selected = mode === "select" &&
                    selectedColumns.some((name) => name.toLowerCase() === column.toLowerCase());

                  return (
                    <td key={column} className={selected ? "is-selected-column" : ""}>
                      {valueOf(row[columnIndex])}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      {rows.length > 8 && <div className="sqlwhale-visual-more">Showing 8 of {rows.length} rows</div>}
    </div>
  );
}

export default function QueryVisualization({
  query,
  running,
  executed,
  result,
  execution,
  runId,
  onComplete,
}: QueryVisualizationProps) {
  const tableName = getTableName(query);
  const whereCondition = getWhereCondition(query);
  const selectedColumns = useMemo(() => getSelectedColumns(query, result), [query, result]);

  const scanStep = getStep(execution, "scan");
  const filterStep = getStep(execution, "filter");
  const selectStep = getStep(execution, "select");

  const stages = useMemo<VisualStage[]>(() => {
    if (!tableName) return [];
    return ["scan", ...(whereCondition ? ["filter" as const] : []), "select", "result"];
  }, [tableName, whereCondition]);

  const [stageIndex, setStageIndex] = useState(0);
  const [completedRun, setCompletedRun] = useState<number | null>(null);

  useEffect(() => {
    if (!runId || !stages.length) return;

    setStageIndex(0);
    setCompletedRun(null);

    const timer = window.setInterval(() => {
      setStageIndex((current) => {
        if (current >= stages.length - 1) {
          window.clearInterval(timer);
          return current;
        }
        return current + 1;
      });
    }, STAGE_DURATION);

    return () => window.clearInterval(timer);
  }, [runId, stages.length]);

  useEffect(() => {
    if (!runId || !executed || !stages.length || stageIndex !== stages.length - 1 || completedRun === runId) return;

    setCompletedRun(runId);
    const timer = window.setTimeout(() => onComplete?.(), 450);
    return () => window.clearTimeout(timer);
  }, [runId, executed, stages.length, stageIndex, completedRun, onComplete]);

  useEffect(() => {
    document.querySelectorAll<HTMLElement>("[data-sql-table]").forEach((el) => el.classList.remove("sqlwhale-query-source-active"));
    document.querySelectorAll<HTMLElement>("[data-sql-column]").forEach((el) => el.classList.remove("sqlwhale-query-column-active"));

    if (!tableName || !stages.length) return;

    const source = Array.from(document.querySelectorAll<HTMLElement>("[data-sql-table]"))
      .find((el) => el.dataset.sqlTable?.toLowerCase() === tableName.toLowerCase());

    if (source) source.classList.add("sqlwhale-query-source-active");

    if (stages[stageIndex] === "select") {
      selectedColumns.forEach((column) => {
        document.querySelectorAll<HTMLElement>("[data-sql-column]").forEach((el) => {
          if (el.dataset.sqlColumn?.toLowerCase() === column.toLowerCase()) {
            el.classList.add("sqlwhale-query-column-active");
          }
        });
      });
    }

    return () => {
      document.querySelectorAll<HTMLElement>("[data-sql-table]").forEach((el) => el.classList.remove("sqlwhale-query-source-active"));
      document.querySelectorAll<HTMLElement>("[data-sql-column]").forEach((el) => el.classList.remove("sqlwhale-query-column-active"));
    };
  }, [tableName, stageIndex, stages, selectedColumns]);

  useEffect(() => {
    if (executed && !stages.length) onComplete?.();
  }, [executed, stages.length, onComplete]);

  if ((!running && !executed) || !stages.length) return null;

  const currentStage = stages[Math.min(stageIndex, stages.length - 1)];
  const currentStep = currentStage === "scan" ? scanStep : currentStage === "filter" ? filterStep : currentStage === "select" ? selectStep : undefined;

  const sourceColumns = scanStep?.inputColumns ?? scanStep?.outputColumns ?? [];
  const sourceRows = scanStep?.inputRows ?? [];
  const filteredRows = filterStep?.outputRows ?? result?.rows ?? [];
  const resultColumns = selectStep?.outputColumns ?? result?.columns ?? [];
  const resultRows = selectStep?.outputRows ?? result?.rows ?? [];

  const displayColumns = currentStage === "select" || currentStage === "result" ? resultColumns : sourceColumns;
  const displayRows = currentStage === "filter" ? sourceRows : currentStage === "select" ? filteredRows : currentStage === "result" ? resultRows : sourceRows;
  const matchedRows = filterStep?.matchedRows ?? filterStep?.highlightedRows;

  const actionText =
    currentStage === "scan" ? "Take the rows from " + tableName + "." :
    currentStage === "filter" ? "Keep only rows where " + whereCondition + "." :
    currentStage === "select" ? "Keep " + (selectedColumns.length ? selectedColumns.join(", ") : "the requested columns") + "." :
    "The transformed data becomes your result.";

  return (
    <div className="sqlwhale-data-animation" aria-live="polite" data-running={running}>
      <div className="sqlwhale-data-animation-top">
        <div>
          <span className="sqlwhale-data-kicker">WATCH YOUR DATA</span>
          <div className="sqlwhale-data-action">{actionText}</div>
        </div>
        <span className="sqlwhale-data-counter">{stageIndex + 1}/{stages.length}</span>
      </div>

      <div className="sqlwhale-visual-stage-track">
        {stages.map((stage, index) => (
          <div key={stage} className={"sqlwhale-visual-stage " + (index === stageIndex ? "is-active " : "") + (index < stageIndex ? "is-done" : "")}>
            <span className="sqlwhale-visual-stage-number">{index < stageIndex ? "✓" : index + 1}</span>
            <span>{stage === "scan" ? "FROM" : stage === "filter" ? "WHERE" : stage === "select" ? "SELECT" : "RESULT"}</span>
          </div>
        ))}
      </div>

      {currentStage === "filter" && (
        <div className="sqlwhale-filter-explanation">
          <span className="sqlwhale-filter-expression">WHERE {whereCondition}</span>
          <span className="sqlwhale-filter-legend"><span className="sqlwhale-legend-match" /> Keep <span className="sqlwhale-legend-reject" /> Fade out</span>
        </div>
      )}

      {currentStage === "select" && (
        <div className="sqlwhale-select-explanation">
          <span>SELECT</span>
          <strong>{selectedColumns.length ? selectedColumns.join(", ") : "*"}</strong>
          <small>Only these columns continue.</small>
        </div>
      )}

      {displayColumns.length > 0 && displayRows.length > 0 ? (
        <DataTable columns={displayColumns} rows={displayRows} matchedRows={matchedRows} selectedColumns={selectedColumns} mode={currentStage} />
      ) : (
        <div className="sqlwhale-visual-waiting">{executed ? "Preparing the data transformation..." : "Reading the data..."}</div>
      )}

      {currentStage === "filter" && filterStep && (
        <div className="sqlwhale-filter-count">
          <strong>{matchedRows?.length ?? 0}</strong><span>rows match</span><span className="sqlwhale-filter-arrow">→</span>
          <strong>{Math.max(0, sourceRows.length - (matchedRows?.length ?? 0))}</strong><span>fade away</span>
        </div>
      )}

      {currentStage === "result" && (
        <div className="sqlwhale-result-arrival">
          <span className="sqlwhale-result-arrival-mark">✓</span>
          <div><strong>Result ready</strong><span>{result?.rows.length ?? resultRows.length} rows</span></div>
        </div>
      )}

      {currentStep?.explanation && currentStage !== "result" && (
        <div className="sqlwhale-visual-caption">{currentStep.explanation}</div>
      )}
    </div>
  );
}
