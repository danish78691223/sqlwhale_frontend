"use client";

import { useEffect, useMemo, useState } from "react";
import type { SQLExecution, SQLResult, ExecutionStep } from "@/types/execution";

interface QueryVisualizationProps {
  query: string;
  command?: string;
  running: boolean;
  executed: boolean;
  result?: SQLResult;
  execution?: SQLExecution;
  runId: number;
  slowExecution?: boolean;
  onComplete?: () => void;
  onStageChange?: (stage: VisualStage) => void;
  onExecutionFocus?: (tableName: string | null) => void;
}

type VisualStage = "scan" | "filter" | "join" | "select" | "result";
const FAST_STAGE_DURATION = 350;
const SLOW_STAGE_DURATION = 1500;

function normalizeQuery(query: string) {
  return query.replace(/--.*$/gm, "").replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, " ").trim().replace(/;$/, "");
}

function getTableName(query: string) {
  return normalizeQuery(query).match(/\bFROM\s+[a-zA-Z_][\w$]*/i)?.[0]?.replace(/^FROM\s+/i, "");
}

type WhyClause = "SELECT" | "FROM" | "WHERE" | "GROUP BY" | "HAVING" | "ORDER BY" | "JOIN";

const WHY_CONTENT: Record<WhyClause, {
  title: string;
  sentence: string;
  steps: string[];
  think: string;
}> = {
  SELECT: {
    title: "WHY SELECT?",
    sentence: "Choose which columns you want to see in the final result.",
    steps: ["TABLE", "CHOOSE COLUMNS", "RESULT"],
    think: "Which information do I want?",
  },
  FROM: {
    title: "WHY FROM?",
    sentence: "Tell SQL which table your data should come from.",
    steps: ["DATABASE", "TABLE", "QUERY"],
    think: "Where is my data?",
  },
  WHERE: {
    title: "WHY WHERE?",
    sentence: "Filter out rows that do not satisfy your condition.",
    steps: ["TABLE", "FILTER ROWS", "RESULT"],
    think: "Which rows do I want?",
  },
  "GROUP BY": {
    title: "WHY GROUP BY?",
    sentence: "Turn individual rows into groups so each group can be calculated.",
    steps: ["ROWS", "GROUP", "CALCULATE"],
    think: "What should be treated as one group?",
  },
  HAVING: {
    title: "WHY HAVING?",
    sentence: "Filter groups after GROUP BY has created them.",
    steps: ["ROWS", "GROUP", "FILTER GROUPS"],
    think: "Which groups should remain?",
  },
  "ORDER BY": {
    title: "WHY ORDER BY?",
    sentence: "Sort the rows in the order you want to see them.",
    steps: ["RESULT", "SORT", "ORDERED RESULT"],
    think: "How should the result be arranged?",
  },
  JOIN: {
    title: "WHY JOIN?",
    sentence: "Connect related tables when the data you need lives in more than one table.",
    steps: ["TABLE A", "RELATIONSHIP", "TABLE B"],
    think: "Which tables need to connect?",
  },
};

function getWhyClauses(query: string): WhyClause[] {
  const normalized = normalizeQuery(query);
  const clauses: WhyClause[] = [];
  const patterns: Array<[WhyClause, RegExp]> = [
    ["SELECT", /^SELECT\b/i],
    ["FROM", /\bFROM\b/i],
    ["WHERE", /\bWHERE\b/i],
    ["GROUP BY", /\bGROUP\s+BY\b/i],
    ["HAVING", /\bHAVING\b/i],
    ["ORDER BY", /\bORDER\s+BY\b/i],
    ["JOIN", /\b(?:INNER|LEFT|RIGHT|FULL|CROSS)?\s*JOIN\b/i],
  ];

  patterns.forEach(([clause, pattern]) => {
    if (pattern.test(normalized)) clauses.push(clause);
  });

  return clauses;
}

function getWhereCondition(query: string) {
  return normalizeQuery(query).match(/\bWHERE\s+([\s\S]*?)(?=\s+(?:GROUP\s+BY|ORDER\s+BY|LIMIT|HAVING|UNION)\b|$)/i)?.[1]?.trim();
}


function getJoinTargets(query: string) {
  const normalized = normalizeQuery(query);
  const match = normalized.match(/\b(?:INNER\s+JOIN|LEFT\s+JOIN|RIGHT\s+JOIN|FULL\s+JOIN|JOIN)\s+([A-Za-z_][\w$]*)(?:\s+(?:AS\s+)?([A-Za-z_][\w$]*))?\s+ON\s+([A-Za-z_][\w$]*)\.([A-Za-z_][\w$]*)\s*=\s*([A-Za-z_][\w$]*)\.([A-Za-z_][\w$]*)/i);
  if (!match) return null;

  const fromMatch = normalized.match(/\bFROM\s+([A-Za-z_][\w$]*)(?:\s+(?:AS\s+)?([A-Za-z_][\w$]*))?/i);
  const aliases = new Map<string, string>();
  if (fromMatch) {
    aliases.set(fromMatch[1].toLowerCase(), fromMatch[1]);
    if (fromMatch[2]) aliases.set(fromMatch[2].toLowerCase(), fromMatch[1]);
  }
  aliases.set(match[1].toLowerCase(), match[1]);
  if (match[2]) aliases.set(match[2].toLowerCase(), match[1]);

  return {
    joinType: (normalized.match(/\b(INNER\s+JOIN|LEFT\s+JOIN|RIGHT\s+JOIN|FULL\s+JOIN|JOIN)\b/i)?.[1] ?? "JOIN"),
    leftTable: aliases.get(match[3].toLowerCase()) ?? match[3],
    leftColumn: match[4],
    rightTable: aliases.get(match[5].toLowerCase()) ?? match[5],
    rightColumn: match[6],
  };
}

function getWhereColumns(query: string) {
  const condition = getWhereCondition(query);
  if (!condition) return [];

  return Array.from(
    condition.matchAll(/(?:\b[a-zA-Z_][\w$]*\.)?([a-zA-Z_][\w$]*)\s*(?:=|<>|!=|<=|>=|<|>|LIKE|IN|IS)\b/gi)
  ).map((match) => match[1].replace(/["']/g, "")).filter(Boolean);
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
              <tr key={rowIndex} className={"sqlwhale-execution-row " + (filtering ? (matched ? "is-matching-row" : "is-rejected-row") : "")}>
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
  command,
  running,
  executed,
  result,
  execution,
  runId,
  slowExecution = false,
  onComplete,
  onStageChange,
  onExecutionFocus,
}: QueryVisualizationProps) {
  const normalizedCommand = command?.toUpperCase() ?? "";
  const isCreateTable = normalizedCommand === "CREATE_TABLE";
  const isInsert = normalizedCommand === "INSERT";
  const ddlStep = execution?.steps.find((step) => step.operation === "create_table");
  const insertStep = execution?.steps.find((step) => step.operation === "insert");
  const tableName = getTableName(query);
  const whereCondition = getWhereCondition(query);
  const selectedColumns = useMemo(() => getSelectedColumns(query, result), [query, result]);
  const whereColumns = useMemo(() => getWhereColumns(query), [query]);
  const joinTargets = useMemo(() => getJoinTargets(query), [query]);
  const whyClauses = useMemo(() => getWhyClauses(query), [query]);
  const [whyClause, setWhyClause] = useState<WhyClause | null>(null);

  // Replay database-changing statements as a visible sequence, independent of query latency.
  const [changeStage, setChangeStage] = useState(0);

  useEffect(() => {
    if (!runId) return;
    setChangeStage(0);
    const timer = window.setInterval(() => {
      setChangeStage((current) => {
        if (current >= 2) {
          window.clearInterval(timer);
          return current;
        }
        return current + 1;
      });
    }, slowExecution ? 1200 : 850);
    return () => window.clearInterval(timer);
  }, [runId, slowExecution]);

  useEffect(() => {
    if (whyClause && !whyClauses.includes(whyClause)) {
      setWhyClause(null);
    }
  }, [whyClause, whyClauses]);

  const scanStep = getStep(execution, "scan");
  const filterStep = getStep(execution, "filter");
  const selectStep = getStep(execution, "select");

  const stages = useMemo<VisualStage[]>(() => {
    if (!tableName) return [];
    return [
      "scan",
      ...(whereCondition ? ["filter" as const] : []),
      ...(joinTargets ? ["join" as const] : []),
      "select",
      "result",
    ];
  }, [tableName, whereCondition, joinTargets]);

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
    }, slowExecution ? SLOW_STAGE_DURATION : FAST_STAGE_DURATION);

    return () => window.clearInterval(timer);
  }, [runId, stages.length, slowExecution]);

  useEffect(() => {
    if (!runId || !executed || !stages.length || stageIndex !== stages.length - 1 || completedRun === runId) return;

    setCompletedRun(runId);
    const timer = window.setTimeout(() => onComplete?.(), 450);
    return () => window.clearTimeout(timer);
  }, [runId, executed, stages.length, stageIndex, completedRun, onComplete]);

  useEffect(() => {
    onStageChange?.(stages[Math.min(stageIndex, stages.length - 1)]);
  }, [stageIndex, stages, onStageChange]);

  // During "Show what happened", drive the Database Canvas itself so the
  // table involved in the current replay stage is brought into focus.
  useEffect(() => {
    if (!slowExecution || !executed) return;

    const currentStage = stages[Math.min(stageIndex, stages.length - 1)];
    let focusTable: string | null = null;

    if (isCreateTable || isInsert) {
      const changeStep = isCreateTable ? ddlStep : insertStep;
      const metadata = changeStep?.metadata ?? {};
      focusTable = String(
        metadata.tableName ?? changeStep?.targetTable ?? ""
      ).trim() || null;
    } else if (currentStage === "join" && joinTargets) {
      focusTable = joinTargets.rightTable || joinTargets.leftTable || null;
    } else {
      focusTable = tableName || null;
    }

    onExecutionFocus?.(focusTable);
  }, [
    slowExecution,
    executed,
    stageIndex,
    stages,
    isCreateTable,
    isInsert,
    ddlStep,
    insertStep,
    joinTargets,
    tableName,
    onExecutionFocus,
  ]);

  useEffect(() => {
    document.querySelectorAll<HTMLElement>("[data-sql-table]").forEach((el) => el.classList.remove("sqlwhale-query-source-active"));
    document.querySelectorAll<HTMLElement>("[data-sql-column]").forEach((el) => el.classList.remove("sqlwhale-query-column-active"));

    if (!tableName || !stages.length) return;

    const source = Array.from(document.querySelectorAll<HTMLElement>("[data-sql-table]"))
      .find((el) => el.dataset.sqlTable?.toLowerCase() === tableName.toLowerCase());

    if (source) source.classList.add("sqlwhale-query-source-active");

    const targetedColumns =
      stages[stageIndex] === "filter"
        ? whereColumns
        : stages[stageIndex] === "join" && joinTargets
          ? [joinTargets.leftColumn, joinTargets.rightColumn]
          : stages[stageIndex] === "select"
            ? selectedColumns
            : [];

    targetedColumns.forEach((column) => {
      document.querySelectorAll<HTMLElement>("[data-sql-column]").forEach((el) => {
        if (el.dataset.sqlColumn?.toLowerCase() === column.toLowerCase()) {
          el.classList.add("sqlwhale-query-column-active");
        }
      });
    });

    return () => {
      document.querySelectorAll<HTMLElement>("[data-sql-table]").forEach((el) => el.classList.remove("sqlwhale-query-source-active"));
      document.querySelectorAll<HTMLElement>("[data-sql-column]").forEach((el) => el.classList.remove("sqlwhale-query-column-active"));
    };
  }, [tableName, stageIndex, stages, selectedColumns, whereColumns]);

  useEffect(() => {
    if (executed && !stages.length) onComplete?.();
  }, [executed, stages.length, onComplete]);

  if (isCreateTable || isInsert) {
    if ((!running && !executed) || !execution) return null;

    const step = isCreateTable ? ddlStep : insertStep;
    if (!step) {
      return (
        <div className="sqlwhale-data-animation" aria-live="polite">
          <div className="sqlwhale-data-animation-top">
            <div>
              <span className="sqlwhale-data-kicker">DATABASE CHANGE</span>
              <div className="sqlwhale-data-action">
                {isCreateTable ? "Building the new table structure..." : "Applying the inserted rows..."}
              </div>
            </div>
          </div>
        </div>
      );
    }

    const metadata = step.metadata ?? {};
    const createdColumns = Array.isArray(metadata.columns)
      ? metadata.columns as Array<{
          name: string;
          type: string;
          notNull?: boolean;
          primaryKey?: boolean;
          defaultValue?: unknown;
          foreignKey?: boolean;
          referencesTable?: string;
          referencesColumn?: string;
        }>
      : [];
    const insertedColumns = Array.isArray(metadata.insertedColumns)
      ? metadata.insertedColumns.map(String)
      : (step.columns ?? []);
    const insertedRows = step.affectedRows ?? [];
    const beforeRowCount = Number(metadata.beforeRowCount ?? 0);
    const afterRowCount = Number(metadata.afterRowCount ?? beforeRowCount + insertedRows.length);

    return (
      <div className="sqlwhale-data-animation" aria-live="polite">
        <div className="sqlwhale-data-animation-top">
          <div>
            <span className="sqlwhale-data-kicker">
              {isCreateTable ? "TABLE CREATED" : "DATA INSERTED"}
            </span>
            <div className="sqlwhale-data-action">
              {isCreateTable
                ? "SQLWhale created the table and applied its structure."
                : "SQLWhale inserted these rows into the existing table."}
            </div>
          </div>
          <span className="sqlwhale-data-counter">
            {isCreateTable ? createdColumns.length + " columns" : "+" + insertedRows.length + " rows"}
          </span>
        </div>

        <div className="sqlwhale-change-flow" aria-label={isCreateTable ? "Create table flow" : "Insert data flow"}>
          <div className={`sqlwhale-change-flow-step ${changeStage >= 0 ? "is-active" : ""} ${changeStage === 0 ? "is-current" : ""} ${changeStage > 0 ? "is-complete" : ""}`}>
            <span className="sqlwhale-change-flow-icon">{changeStage > 0 ? "✓" : "01"}</span>
            <strong>{isCreateTable ? "DEFINE" : "INSERT"}</strong>
            <small>{isCreateTable ? "Columns & constraints" : "Values provided"}</small>
          </div>
          <span className={`sqlwhale-change-flow-arrow ${changeStage >= 1 ? "is-flowing" : ""}`}>→</span>
          <div className={`sqlwhale-change-flow-step ${changeStage >= 1 ? "is-active" : ""} ${changeStage === 1 ? "is-current" : ""} ${changeStage > 1 ? "is-complete" : ""}`}>
            <span className="sqlwhale-change-flow-icon">{changeStage > 1 ? "✓" : "02"}</span>
            <strong>DATABASE</strong>
            <small>{isCreateTable ? "Table created" : "Rows written"}</small>
          </div>
          <span className={`sqlwhale-change-flow-arrow ${changeStage >= 2 ? "is-flowing" : ""}`}>→</span>
          <div className={`sqlwhale-change-flow-step ${changeStage >= 2 ? "is-active is-current" : ""} ${changeStage >= 2 ? "is-complete" : ""}`}>
            <span className="sqlwhale-change-flow-icon">{changeStage >= 2 ? "✓" : "03"}</span>
            <strong>RESULT</strong>
            <small>{isCreateTable ? "Structure ready" : "Table changed"}</small>
          </div>
        </div>

        {isCreateTable ? (
          <div className="sqlwhale-schema-creation-card">
            <div className="sqlwhale-schema-creation-header">
              <div>
                <span className="sqlwhale-schema-kicker">NEW TABLE</span>
                <strong>{String(metadata.tableName ?? step.targetTable ?? "new_table")}</strong>
              </div>
              <span className="sqlwhale-schema-count">{createdColumns.length} columns</span>
            </div>

            <div className="sqlwhale-schema-column-list">
              {createdColumns.slice(0, changeStage >= 1 ? createdColumns.length : Math.min(1, createdColumns.length)).map((column, index) => (
                <div className="sqlwhale-schema-column-row sqlwhale-change-reveal" key={column.name} style={{ animationDelay: `${Math.min(index, 10) * 110}ms` }}>
                  <span className="sqlwhale-schema-column-number">{index + 1}</span>
                  <strong>{column.name}</strong>
                  <span className="sqlwhale-schema-type">{column.type}</span>
                  {column.primaryKey && <span className="sqlwhale-schema-badge primary">PK</span>}
                  {column.notNull && <span className="sqlwhale-schema-badge">NOT NULL</span>}
                  {column.foreignKey && (
                    <span className="sqlwhale-schema-badge">FK → {column.referencesTable}.{column.referencesColumn}</span>
                  )}
                  {column.defaultValue !== undefined && column.defaultValue !== null && (
                    <span className="sqlwhale-schema-default">DEFAULT {String(column.defaultValue)}</span>
                  )}
                </div>
              ))}
            </div>

            <div className={"sqlwhale-schema-creation-footer " + (changeStage >= 2 ? "is-visible" : "")}>
              <span>{changeStage >= 2 ? "✓ Table structure committed to the database" : "Building table structure..."}</span>
              <span>{changeStage >= 2 ? step.explanation : "Applying columns and constraints"}</span>
            </div>
          </div>
        ) : (
          <div className="sqlwhale-insert-card">
            <div className="sqlwhale-insert-header">
              <div>
                <span className="sqlwhale-schema-kicker">ROWS ADDED TO</span>
                <strong>{String(step.targetTable ?? metadata.tableName ?? "table")}</strong>
              </div>
              <div className="sqlwhale-row-change">
                <strong>+{insertedRows.length}</strong>
                <span>rows</span>
              </div>
            </div>

            {insertedRows.length > 0 && insertedColumns.length > 0 ? (
              <div className="sqlwhale-insert-table-wrap">
                <table className="sqlwhale-visual-table sqlwhale-insert-table">
                  <thead>
                    <tr>
                      {insertedColumns.map((column) => <th key={column}>{column}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {insertedRows.slice(0, changeStage >= 1 ? Math.min(8, insertedRows.length) : 0).map((row, rowIndex) => (
                      <tr key={rowIndex} className={`is-inserted-row sqlwhale-change-reveal ${changeStage === 1 ? "is-inserted-row-active" : ""} ${changeStage >= 2 ? "is-inserted-row-complete" : ""}`} style={{ animationDelay: `${rowIndex * 180}ms` }}>
                        {insertedColumns.map((column, columnIndex) => (
                          <td key={column}>{valueOf(row[columnIndex])}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="sqlwhale-visual-waiting">{changeStage >= 1 ? "The inserted values were applied successfully." : "Sending rows into the table..."}</div>
            )}

            <div className={"sqlwhale-insert-change " + (changeStage >= 1 ? "is-visible" : "")}>
              <div><span>BEFORE</span><strong>{beforeRowCount}</strong><small>rows</small></div>
              <span className="sqlwhale-insert-arrow">→</span>
              <div className="is-after"><span>AFTER</span><strong>{afterRowCount}</strong><small>rows</small></div>
            </div>

            <div className={"sqlwhale-schema-creation-footer " + (changeStage >= 2 ? "is-visible" : "")}>
              <span>{changeStage >= 2 ? "✓ Data written to the database" : "Writing rows to the database..."}</span>
              <span>{changeStage >= 2 ? step.explanation : "Updating table state"}</span>
            </div>
          </div>
        )}
      </div>
    );
  }

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
    currentStage === "join" && joinTargets
      ? "Connect " + joinTargets.leftTable + "." + joinTargets.leftColumn + " to " + joinTargets.rightTable + "." + joinTargets.rightColumn + "." :
    currentStage === "select" ? "Keep " + (selectedColumns.length ? selectedColumns.join(", ") : "the requested columns") + "." :
    "The transformed data becomes your result.";

  return (
    <div className={"sqlwhale-data-animation " + (slowExecution ? "is-replay-mode" : "")} aria-live="polite" data-running={running}>
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
            <span>{stage === "scan" ? "FROM" : stage === "filter" ? "WHERE" : stage === "join" ? "JOIN" : stage === "select" ? "SELECT" : "RESULT"}</span>
          </div>
        ))}
      </div>

      {whyClauses.length > 0 && (
        <div className="sqlwhale-why-clause-row" aria-label="Learn why each SQL clause is used">
          <span className="sqlwhale-why-label">Learn the why</span>
          {whyClauses.map((clause) => (
            <button
              key={clause}
              type="button"
              className={"sqlwhale-why-button " + (whyClause === clause ? "is-active" : "")}
              onClick={() => setWhyClause((current) => current === clause ? null : clause)}
            >
              💡 Why {clause}?
            </button>
          ))}
        </div>
      )}

      {whyClause && (
        <div className="sqlwhale-why-card" role="status">
          <div className="sqlwhale-why-card-header">
            <div>
              <span className="sqlwhale-why-kicker">UNDERSTAND THE CLAUSE</span>
              <strong>{WHY_CONTENT[whyClause].title}</strong>
            </div>
            <button
              type="button"
              className="sqlwhale-why-close"
              onClick={() => setWhyClause(null)}
              aria-label="Close explanation"
            >
              ×
            </button>
          </div>

          <p className="sqlwhale-why-sentence">
            {whyClause === "WHERE" && whereCondition
              ? "WHERE removes rows that do not satisfy " + whereCondition + "."
              : WHY_CONTENT[whyClause].sentence}
          </p>

          <div className="sqlwhale-why-flow" aria-label={WHY_CONTENT[whyClause].steps.join(" to ")}>
            {WHY_CONTENT[whyClause].steps.map((step, index) => (
              <div key={step} className="sqlwhale-why-flow-step">
                <span>{step}</span>
                {index < WHY_CONTENT[whyClause].steps.length - 1 && <b>↓</b>}
              </div>
            ))}
          </div>

          <div className="sqlwhale-why-think">
            <span>THINK:</span>
            <strong>{WHY_CONTENT[whyClause].think}</strong>
          </div>
        </div>
      )}

      {currentStage === "join" && joinTargets && (
        <div className="sqlwhale-join-explanation">
          <span className="sqlwhale-join-expression">{joinTargets.joinType}</span>
          <strong>{joinTargets.leftTable}.{joinTargets.leftColumn} = {joinTargets.rightTable}.{joinTargets.rightColumn}</strong>
          <small>The relationship is being used to connect the two tables.</small>
        </div>
      )}

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
