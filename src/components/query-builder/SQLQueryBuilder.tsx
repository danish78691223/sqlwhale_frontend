"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2, WandSparkles } from "lucide-react";
import type { DatabaseTable } from "@/types/table";

interface SQLQueryBuilderProps {
  tables: DatabaseTable[];
  onGenerate: (sql: string) => void;
}

type Condition = { column: string; operator: string; value: string };

const OPERATORS = ["=", ">", "<", ">=", "<=", "!="];

function quoteValue(value: string) {
  const trimmed = value.trim();
  if (/^-?\d+(\.\d+)?$/.test(trimmed) || /^(true|false|null)$/i.test(trimmed)) return trimmed;
  return `'${trimmed.replace(/'/g, "''")}'`;
}

export default function SQLQueryBuilder({ tables, onGenerate }: SQLQueryBuilderProps) {
  const [tableName, setTableName] = useState("");
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [whereEnabled, setWhereEnabled] = useState(false);
  const [condition, setCondition] = useState<Condition>({ column: "", operator: ">", value: "50000" });

  const selectedTable = useMemo(() => tables.find((table) => table.name === tableName) ?? tables[0], [tables, tableName]);
  const columns = selectedTable?.columns ?? [];

  useEffect(() => {
    if (!selectedTable) return;
    if (selectedTable.name !== tableName) setTableName(selectedTable.name);
    setSelectedColumns((current) => {
      const valid = current.filter((name) => selectedTable.columns.some((column) => column.name === name));
      return valid.length ? valid : selectedTable.columns.slice(0, 2).map((column) => column.name);
    });
    setCondition((current) => ({
      ...current,
      column: selectedTable.columns.some((column) => column.name === current.column)
        ? current.column
        : selectedTable.columns[0]?.name ?? "",
    }));
  }, [selectedTable, tableName]);

  const toggleColumn = (column: string) => {
    setSelectedColumns((current) => current.includes(column) ? current.filter((item) => item !== column) : [...current, column]);
  };

  const generateSQL = () => {
    const selection = selectedColumns.length ? selectedColumns.join(", ") : "*";
    const where = whereEnabled && condition.column && condition.value.trim()
      ? `\nWHERE ${condition.column} ${condition.operator} ${quoteValue(condition.value)};`
      : ";";
    onGenerate(`SELECT ${selection}\nFROM ${selectedTable?.name ?? tableName}${where}`);
  };

  return (
    <section className="sqlwhale-query-builder" aria-label="Build a SQL query visually">
      <div className="sqlwhale-builder-header">
        <div>
          <div className="sqlwhale-builder-kicker">VISUAL MODE</div>
          <h2>Build the Query</h2>
          <p>Choose what you want to ask. SQLWhale writes the syntax for you.</p>
        </div>
        <WandSparkles size={19} aria-hidden="true" />
      </div>

      <div className="sqlwhale-builder-flow">
        <div className="sqlwhale-builder-block">
          <span className="sqlwhale-builder-label">SELECT</span>
          <div className="sqlwhale-builder-column-list">
            {selectedColumns.map((column, index) => (
              <div className="sqlwhale-builder-column-row" key={`${index}-${column}`}>
                <select
                  value={column}
                  onChange={(event) => {
                    const next = [...selectedColumns];
                    next[index] = event.target.value;
                    setSelectedColumns(next);
                  }}
                  aria-label={`SELECT column ${index + 1}`}
                >
                  {columns.map((item) => (
                    <option key={item.name} value={item.name}>{item.name}</option>
                  ))}
                </select>
                {selectedColumns.length > 1 && (
                  <button
                    type="button"
                    className="sqlwhale-builder-icon-button"
                    onClick={() => setSelectedColumns((current) => current.filter((_, itemIndex) => itemIndex !== index))}
                    aria-label={`Remove column ${index + 1}`}
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="sqlwhale-builder-add-column"
              onClick={() => setSelectedColumns((current) => [...current, columns[0]?.name ?? ""])}
              disabled={!columns.length}
            >
              <Plus size={12} /> Add column
            </button>
            {!columns.length && <span className="sqlwhale-builder-muted">Loading columns...</span>}
          </div>
          <small>Each row becomes one selected field in the SQL result.</small>
        </div>

        <div className="sqlwhale-builder-arrow">↓</div>

        <div className="sqlwhale-builder-block">
          <span className="sqlwhale-builder-label">FROM</span>
          <select value={selectedTable?.name ?? tableName} onChange={(event) => setTableName(event.target.value)}>
            {tables.map((table) => <option key={table.name} value={table.name}>{table.name}</option>)}
          </select>
          <small>Choose the table SQLWhale should read.</small>
        </div>

        <div className="sqlwhale-builder-arrow">↓</div>

        <div className={`sqlwhale-builder-block sqlwhale-builder-where ${whereEnabled ? "is-enabled" : ""}`}>
          <div className="sqlwhale-builder-where-heading">
            <span className="sqlwhale-builder-label">WHERE</span>
            <button type="button" className="sqlwhale-builder-toggle" onClick={() => setWhereEnabled((current) => !current)} aria-pressed={whereEnabled}>
              {whereEnabled ? "Enabled" : "Add filter"}
            </button>
          </div>
          {whereEnabled && (
            <div className="sqlwhale-builder-condition">
              <select value={condition.column} onChange={(event) => setCondition({ ...condition, column: event.target.value })}>
                {columns.map((column) => <option key={column.name} value={column.name}>{column.name}</option>)}
              </select>
              <select value={condition.operator} onChange={(event) => setCondition({ ...condition, operator: event.target.value })}>
                {OPERATORS.map((operator) => <option key={operator} value={operator}>{operator}</option>)}
              </select>
              <input value={condition.value} onChange={(event) => setCondition({ ...condition, value: event.target.value })} placeholder="50000" aria-label="Filter value" />
            </div>
          )}
        </div>
      </div>

      <div className="sqlwhale-builder-generate">
        <button type="button" onClick={generateSQL} disabled={!selectedTable}>
          <WandSparkles size={15} /> Generate SQL
        </button>
        <span>↓ then Run → Animate → Explain</span>
      </div>
    </section>
  );
}
