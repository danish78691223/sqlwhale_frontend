"use client";

import { useEffect, useMemo, useState } from "react";
import type { SQLResult } from "@/types/execution";

interface QueryExplanationProps {
  query: string;
  result?: SQLResult;
  running: boolean;
  executed: boolean;
}

type ExplanationStep = {
  key: "select" | "from" | "where" | "result";
  title: string;
  detail: string;
  targetTable?: string;
  targetColumns?: string[];
};

function normalizeQuery(query: string) {
  return query
    .replace(/--.*$/gm, "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/;$/, "");
}

function parseQuery(query: string, result?: SQLResult): ExplanationStep[] {
  const normalized = normalizeQuery(query);
  if (!normalized) return [];

  const fromMatch = normalized.match(
    /\bFROM\s+["'\`]?([a-zA-Z_][\w$]*)["'\`]?/i
  );
  const table = fromMatch?.[1];
  if (!table) return [];

  const selectMatch = normalized.match(
    /^SELECT\s+([\s\S]*?)\s+FROM\b/i
  );
  const selectPart = selectMatch?.[1]?.trim() || "*";

  const selectedColumns =
    selectPart === "*"
      ? result?.columns || ["all columns"]
      : selectPart
          .split(",")
          .map((part) =>
            part
              .trim()
              .replace(/\s+AS\s+.*$/i, "")
              .replace(/^.*\./, "")
              .replace(/^[\"'\`]|[\"'\`]$/g, "")
          )
          .filter(Boolean);

  const whereMatch = normalized.match(
    /\bWHERE\s+([\s\S]*?)(?=\s+(?:GROUP\s+BY|ORDER\s+BY|LIMIT|HAVING|UNION)\b|$)/i
  );
  const condition = whereMatch?.[1]?.trim();

  const whereColumnMatch = condition?.match(
    /^[\"'\`]?([a-zA-Z_][\w$]*)[\"'\`]?\s*(?:=|<>|!=|<=|>=|<|>|LIKE|IN|IS)/i
  );
  const whereColumn = whereColumnMatch?.[1];

  const steps: ExplanationStep[] = [
    {
      key: "select",
      title: "SELECT",
      detail:
        selectPart === "*"
          ? "Pick all columns from the rows that make it to the result."
          : "Pick the " +
            selectedColumns.join(", ") +
            " column" +
            (selectedColumns.length > 1 ? "s." : "."),
      targetTable: table,
      targetColumns: selectedColumns,
    },
    {
      key: "from",
      title: "FROM " + table,
      detail: "Start with the " + table + " table.",
      targetTable: table,
    },
  ];

  if (condition) {
    steps.push({
      key: "where",
      title: "WHERE",
      detail: "Keep only rows where " + condition + ".",
      targetTable: table,
      targetColumns: whereColumn ? [whereColumn] : undefined,
    });
  }

  steps.push({
    key: "result",
    title: "RESULT",
    detail: result
      ? "→ " +
        result.rows.length +
        " row" +
        (result.rows.length === 1 ? "" : "s") +
        " matched."
      : "Run the query to see the matching rows.",
  });

  return steps;
}

function clearHighlights() {
  document
    .querySelectorAll<HTMLElement>("[data-sql-table]")
    .forEach((element) =>
      element.classList.remove("sqlwhale-explain-table-active")
    );

  document
    .querySelectorAll<HTMLElement>("[data-sql-column]")
    .forEach((element) =>
      element.classList.remove("sqlwhale-explain-column-active")
    );
}

export default function QueryExplanation({
  query,
  result,
  running,
  executed,
}: QueryExplanationProps) {
  const steps = useMemo(
    () => parseQuery(query, result),
    [query, result]
  );
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (!executed || !steps.length) {
      setActiveStep(0);
      clearHighlights();
      return;
    }

    setActiveStep(0);

    if (steps.length <= 1) return;

    const timer = window.setInterval(() => {
      setActiveStep((current) =>
        current >= steps.length - 1 ? current : current + 1
      );
    }, 900);

    return () => window.clearInterval(timer);
  }, [executed, query, steps.length]);

  useEffect(() => {
    clearHighlights();

    if (!executed || !steps.length) return;

    const step = steps[activeStep];
    if (!step) return;

    if (step.targetTable) {
      const table = document.querySelector<HTMLElement>(
        '[data-sql-table="' + CSS.escape(step.targetTable) + '"]'
      );
      table?.classList.add("sqlwhale-explain-table-active");
    }

    step.targetColumns?.forEach((columnName) => {
      const column = document.querySelector<HTMLElement>(
        '[data-sql-column="' + CSS.escape(columnName) + '"]'
      );
      column?.classList.add("sqlwhale-explain-column-active");
    });

    return clearHighlights;
  }, [activeStep, executed, steps]);

  if (!executed || !steps.length) return null;

  return (
    <section className="query-explanation" aria-label="Query explanation">
      <div className="query-explanation-heading">
        <div>
          <span className="query-explanation-eyebrow">
            LEARN FROM YOUR SQL
          </span>
          <h3>WHAT YOUR QUERY DOES</h3>
        </div>
        <span className="query-explanation-running">
          {running ? "Tracing..." : "Explained"}
        </span>
      </div>

      <div className="query-explanation-steps">
        {steps.map((step, index) => {
          const active = index === activeStep;
          const completed = index < activeStep;

          return (
            <div
              key={step.key + "-" + index}
              className={
                "query-explanation-step" +
                (active ? " is-active" : "") +
                (completed ? " is-complete" : "")
              }
            >
              <div className="query-explanation-step-marker">
                {index + 1}
              </div>
              <div className="query-explanation-step-copy">
                <strong>{step.title}</strong>
                <span>{step.detail}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="query-explanation-flow" aria-hidden="true">
        <span>{steps[0]?.title || "SQL"}</span>
        <span>→</span>
        <span>{steps[1]?.title || "table"}</span>
        {steps.some((step) => step.key === "where") && (
          <>
            <span>→</span>
            <span>filtered rows</span>
          </>
        )}
        <span>→</span>
        <span>result</span>
      </div>
    </section>
  );
}
