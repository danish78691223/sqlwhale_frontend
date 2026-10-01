"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2, WandSparkles } from "lucide-react";
import type { DatabaseTable } from "@/types/table";

interface SQLQueryBuilderProps {
  tables: DatabaseTable[];
  initialTableName?: string;
  onGenerate: (sql: string) => void;
}

type Condition = { column: string; operator: string; value: string };

const OPERATORS = ["=", ">", "<", ">=", "<=", "!="];

function quoteValue(value: string) {
  const trimmed = value.trim();
  if (/^-?\d+(\.\d+)?$/.test(trimmed) || /^(true|false|null)$/i.test(trimmed)) return trimmed;
  return `'${trimmed.replace(/'/g, "''")}'`;
}

export default function SQLQueryBuilder({ tables, initialTableName = "employees", onGenerate }: SQLQueryBuilderProps) {
  const [tableName, setTableName] = useState(initialTableName);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [joinEnabled, setJoinEnabled] = useState(false);
  const [joinType, setJoinType] = useState<"INNER JOIN" | "LEFT JOIN">("INNER JOIN");
  const [joinTableName, setJoinTableName] = useState("");
  const [leftJoinColumn, setLeftJoinColumn] = useState("");
  const [rightJoinColumn, setRightJoinColumn] = useState("");
  const [whereEnabled, setWhereEnabled] = useState(false);
  const [condition, setCondition] = useState<Condition>({ column: "", operator: ">", value: "50000" });

  const selectedTable = useMemo(() => tables.find((table) => table.name === tableName) ?? tables.find((table) => table.name === initialTableName) ?? tables[0], [tables, tableName, initialTableName]);
  const columns = selectedTable?.columns ?? [];

  const joinableTables = useMemo(() => {
    if (!selectedTable) return tables;

    const directRelations = selectedTable.columns
      .filter((column) => column.foreignKey && column.referencesTable)
      .map((column) => column.referencesTable as string);

    const reverseRelations = tables
      .filter((table) => table.name !== selectedTable.name)
      .filter((table) =>
        table.columns.some(
          (column) =>
            column.foreignKey &&
            column.referencesTable?.toLowerCase() === selectedTable.name.toLowerCase()
        )
      )
      .map((table) => table.name);

    const related = new Set([...directRelations, ...reverseRelations]);
    return tables.filter(
      (table) =>
        table.name !== selectedTable.name &&
        (related.size === 0 || related.has(table.name))
    );
  }, [tables, selectedTable]);

  const selectedJoinTable = useMemo(
    () => joinableTables.find((table) => table.name === joinTableName) ?? joinableTables[0],
    [joinableTables, joinTableName]
  );

  const joinColumns = selectedJoinTable?.columns ?? [];

  const joinRelationship = useMemo(() => {
    if (!selectedTable || !selectedJoinTable) return null;

    const forward = selectedTable.columns.find(
      (column) =>
        column.foreignKey &&
        column.referencesTable?.toLowerCase() === selectedJoinTable.name.toLowerCase()
    );

    if (forward?.referencesColumn) {
      return { left: forward.name, right: forward.referencesColumn };
    }

    const reverse = selectedJoinTable.columns.find(
      (column) =>
        column.foreignKey &&
        column.referencesTable?.toLowerCase() === selectedTable.name.toLowerCase()
    );

    if (reverse?.referencesColumn) {
      return { left: reverse.referencesColumn, right: reverse.name };
    }

    return null;
  }, [selectedTable, selectedJoinTable]);

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

  useEffect(() => {
    if (!selectedJoinTable) return;

    if (selectedJoinTable.name !== joinTableName) {
      setJoinTableName(selectedJoinTable.name);
    }

    setLeftJoinColumn(
      joinRelationship?.left ??
      (columns.some((column) => column.name === leftJoinColumn)
        ? leftJoinColumn
        : columns[0]?.name ?? "")
    );

    setRightJoinColumn(
      joinRelationship?.right ??
      (joinColumns.some((column) => column.name === rightJoinColumn)
        ? rightJoinColumn
        : joinColumns[0]?.name ?? "")
    );
  }, [
    selectedJoinTable,
    joinTableName,
    joinRelationship,
    columns,
    joinColumns,
    leftJoinColumn,
    rightJoinColumn,
  ]);

  const selectOptions = useMemo(() => {
    const primary = columns.map((column) => ({
      value: column.name,
      label: column.name,
    }));

    if (!joinEnabled || !selectedJoinTable) return primary;

    return [
      ...primary,
      ...joinColumns.map((column) => ({
        value: selectedJoinTable.name + "." + column.name,
        label: selectedJoinTable.name + "." + column.name,
      })),
    ];
  }, [columns, joinColumns, joinEnabled, selectedJoinTable]);


  const generateSQL = () => {
    const primaryAlias = "e";
    const joinAlias = "d";

    const selection = selectedColumns.length
      ? selectedColumns
          .map((column) => {
            if (!joinEnabled) return column;
            if (column.includes(".")) {
              const [, name] = column.split(".");
              return joinAlias + "." + name;
            }
            return primaryAlias + "." + column;
          })
          .join(", ")
      : joinEnabled
        ? primaryAlias + ".*"
        : "*";

    const fromClause = joinEnabled
      ? "FROM " + (selectedTable?.name ?? tableName) + " " + primaryAlias
      : "FROM " + (selectedTable?.name ?? tableName);

    const joinClause =
      joinEnabled && selectedJoinTable && leftJoinColumn && rightJoinColumn
        ? "\n" + joinType + " " + selectedJoinTable.name + " " + joinAlias +
          "\n  ON " + primaryAlias + "." + leftJoinColumn +
          " = " + joinAlias + "." + rightJoinColumn
        : "";

    const where =
      whereEnabled && condition.column && condition.value.trim()
        ? "\nWHERE " + (joinEnabled ? primaryAlias + "." : "") +
          condition.column + " " + condition.operator + " " +
          quoteValue(condition.value) + ";"
        : ";";

    onGenerate("SELECT " + selection + "\n" + fromClause + joinClause + where);
  };

  const handleJoinToggle = () => {
    setJoinEnabled((current) => {
      const next = !current;
      if (next && !joinTableName && joinableTables[0]) {
        setJoinTableName(joinableTables[0].name);
      }
      return next;
    });
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
                  {selectOptions.map((item) => (
                    <option key={item.value} value={item.value}>{item.label}</option>
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

        <div className={`sqlwhale-builder-block sqlwhale-builder-join ${joinEnabled ? "is-enabled" : ""}`}>
          <div className="sqlwhale-builder-where-heading">
            <span className="sqlwhale-builder-label">JOIN</span>
            <button
              type="button"
              className="sqlwhale-builder-toggle"
              onClick={handleJoinToggle}
              aria-pressed={joinEnabled}
              disabled={!joinableTables.length}
            >
              {joinEnabled ? "Enabled" : "Add JOIN"}
            </button>
          </div>

          {joinEnabled ? (
            <div className="sqlwhale-builder-join-grid">
              <select
                value={joinType}
                onChange={(event) =>
                  setJoinType(event.target.value as "INNER JOIN" | "LEFT JOIN")
                }
                aria-label="JOIN type"
              >
                <option value="INNER JOIN">INNER JOIN</option>
                <option value="LEFT JOIN">LEFT JOIN</option>
              </select>

              <select
                value={selectedJoinTable?.name ?? joinTableName}
                onChange={(event) => setJoinTableName(event.target.value)}
                aria-label="JOIN table"
              >
                {joinableTables.map((table) => (
                  <option key={table.name} value={table.name}>{table.name}</option>
                ))}
              </select>

              <div className="sqlwhale-builder-join-condition">
                <select
                  value={leftJoinColumn}
                  onChange={(event) => setLeftJoinColumn(event.target.value)}
                  aria-label="Left JOIN column"
                >
                  {columns.map((column) => (
                    <option key={column.name} value={column.name}>
                      {selectedTable?.name}.{column.name}
                    </option>
                  ))}
                </select>

                <span>=</span>

                <select
                  value={rightJoinColumn}
                  onChange={(event) => setRightJoinColumn(event.target.value)}
                  aria-label="Right JOIN column"
                >
                  {joinColumns.map((column) => (
                    <option key={column.name} value={column.name}>
                      {selectedJoinTable?.name}.{column.name}
                    </option>
                  ))}
                </select>
              </div>

              {joinRelationship && (
                <div className="sqlwhale-builder-relationship-note">
                  <span>↔</span>
                  Relationship detected — this JOIN can light up the database link.
                </div>
              )}
            </div>
          ) : (
            <small>Add a JOIN to combine rows from a related table.</small>
          )}
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
