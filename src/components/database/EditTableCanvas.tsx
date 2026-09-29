"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2, X, LockKeyhole, Code2 } from "lucide-react";
import { getTable } from "@/services/table.service";
import type { DatabaseTable } from "@/types/table";

interface EditTableCanvasProps {
  table: DatabaseTable;
  onClose: () => void;
  onRunSQL: (sql: string) => Promise<boolean>;
  onTableChanged: () => Promise<void>;
}

function sqlValue(value: unknown): string {
  if (value === null || value === undefined || value === "") return "NULL";
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  if (typeof value === "boolean") return value ? "1" : "0";
  const text = String(value);
  if (/^-?\d+(\.\d+)?$/.test(text)) return text;
  return "'" + text.replace(/'/g, "''") + "'";
}

function quoteIdentifier(name: string): string {
  return '"' + name.replace(/"/g, '""') + '"';
}

export default function EditTableCanvas({
  table,
  onClose,
  onRunSQL,
  onTableChanged,
}: EditTableCanvasProps) {
  const [data, setData] = useState<unknown[][]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState<Record<string, unknown>>({});
  const [selectedCell, setSelectedCell] = useState<{ row: number; column: number } | null>(null);
  const [sqlPreview, setSqlPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [working, setWorking] = useState(false);

  const primaryKeyIndex = useMemo(
    () => table.columns.findIndex((column) => column.primaryKey),
    [table.columns]
  );

  const refresh = async () => {
    setLoading(true);
    try {
      const latest = await getTable(table.name);
      setData(latest.data?.rows ?? []);
      setDraft({});
      setSelectedCell(null);
      setSqlPreview(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh().catch(() => setStatus("Unable to load table data."));
  }, [table.name]);

  const makeUpdateSQL = (rowIndex: number, columnIndex: number, value: unknown) => {
    if (primaryKeyIndex < 0) return null;
    const pk = data[rowIndex]?.[primaryKeyIndex];
    if (pk === null || pk === undefined || pk === "") return null;
    const column = table.columns[columnIndex];
    const pkColumn = table.columns[primaryKeyIndex];
    return "UPDATE " + quoteIdentifier(table.name) +
      " SET " + quoteIdentifier(column.name) + " = " + sqlValue(value) +
      " WHERE " + quoteIdentifier(pkColumn.name) + " = " + sqlValue(pk) + ";";
  };

  const applyCellEdit = async (rowIndex: number, columnIndex: number) => {
    const key = rowIndex + ":" + columnIndex;
    const sql = makeUpdateSQL(rowIndex, columnIndex, draft[key]);
    if (!sql) {
      setStatus("This table needs a primary key to safely update an existing row.");
      return;
    }

    setWorking(true);
    setStatus(null);
    setSqlPreview(sql);
    const ok = await onRunSQL(sql);
    if (ok) {
      await refresh();
      await onTableChanged();
      setStatus("Cell updated.");
    }
    setWorking(false);
  };

  const deleteRow = async (rowIndex: number) => {
    if (primaryKeyIndex < 0) {
      setStatus("A primary key is required to safely delete a row.");
      return;
    }
    const pkColumn = table.columns[primaryKeyIndex];
    const pk = data[rowIndex]?.[primaryKeyIndex];
    if (pk === null || pk === undefined || pk === "") return;
    const sql = "DELETE FROM " + quoteIdentifier(table.name) +
      " WHERE " + quoteIdentifier(pkColumn.name) + " = " + sqlValue(pk) + ";";
    if (!window.confirm("Delete this row from " + table.name + "?")) return;

    setWorking(true);
    setSqlPreview(sql);
    const ok = await onRunSQL(sql);
    if (ok) {
      await refresh();
      await onTableChanged();
      setStatus("Row deleted.");
    }
    setWorking(false);
  };

  const addRow = async () => {
    const values = table.columns.map((_, index) => {
      const key = "new:" + index;
      return draft[key] === undefined ? null : draft[key];
    });
    const sql = "INSERT INTO " + quoteIdentifier(table.name) +
      " (" + table.columns.map((column) => quoteIdentifier(column.name)).join(", ") + ")\n" +
      "VALUES (" + values.map(sqlValue).join(", ") + ");";
    setWorking(true);
    setSqlPreview(sql);
    setStatus(null);
    const ok = await onRunSQL(sql);
    if (ok) {
      await refresh();
      await onTableChanged();
      setStatus("Row added.");
    }
    setWorking(false);
  };

  return (
    <div className="sqlwhale-edit-canvas-backdrop" role="dialog" aria-modal="true" aria-label={"Edit " + table.name}>
      <section className="sqlwhale-edit-canvas">
        <header className="sqlwhale-edit-header">
          <div>
            <span className="sqlwhale-edit-eyebrow">TABLE EDITOR</span>
            <h2>{table.name}</h2>
            <p>Edit data and learn the SQL that changes it.</p>
          </div>
          <button type="button" className="sqlwhale-edit-close" onClick={onClose} aria-label="Close editor">
            <X size={18} />
          </button>
        </header>

        <div className="sqlwhale-edit-toolbar">
          <div className="sqlwhale-edit-locked">
            <LockKeyhole size={14} />
            <strong>{table.name}</strong>
            <span>Table name locked</span>
          </div>
          <button type="button" className="sqlwhale-edit-add-row" onClick={() => setStatus("Fill the new-row fields below, then click Add row.")}>
            <Plus size={14} /> Add row
          </button>
        </div>

        {loading ? (
          <div className="sqlwhale-edit-empty">Loading table data…</div>
        ) : (
          <div className="sqlwhale-edit-grid-wrap">
            <table className="sqlwhale-edit-grid">
              <thead>
                <tr>
                  {table.columns.map((column) => (
                    <th key={column.name}>
                      <span>{column.name}</span>
                      <small>{column.type}</small>
                    </th>
                  ))}
                  <th className="sqlwhale-edit-actions-heading">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {table.columns.map((column, columnIndex) => {
                      const key = rowIndex + ":" + columnIndex;
                      const value = draft[key] ?? row[columnIndex] ?? "";
                      const editing = selectedCell?.row === rowIndex && selectedCell?.column === columnIndex;
                      return (
                        <td key={column.name}>
                          {editing ? (
                            <input
                              autoFocus
                              value={String(value)}
                              onChange={(event) => setDraft((current) => ({ ...current, [key]: event.target.value }))}
                              onBlur={() => setSelectedCell(null)}
                              onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                  event.preventDefault();
                                  applyCellEdit(rowIndex, columnIndex);
                                }
                                if (event.key === "Escape") setSelectedCell(null);
                              }}
                            />
                          ) : (
                            <button
                              type="button"
                              className="sqlwhale-edit-cell"
                              onClick={() => {
                                setSelectedCell({ row: rowIndex, column: columnIndex });
                                setDraft((current) => ({ ...current, [key]: row[columnIndex] }));
                              }}
                            >
                              {String(value)}
                            </button>
                          )}
                        </td>
                      );
                    })}
                    <td className="sqlwhale-edit-row-actions">
                      <button type="button" onClick={() => deleteRow(rowIndex)} disabled={working} title="Delete row">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
                <tr className="sqlwhale-edit-new-row">
                  {table.columns.map((column, columnIndex) => {
                    const key = "new:" + columnIndex;
                    return (
                      <td key={column.name}>
                        <input
                          placeholder={column.primaryKey ? "new id" : column.name}
                          value={String(draft[key] ?? "")}
                          onChange={(event) => setDraft((current) => ({ ...current, [key]: event.target.value }))}
                        />
                      </td>
                    );
                  })}
                  <td>
                    <button type="button" className="sqlwhale-edit-add-row-inline" onClick={addRow} disabled={working}>
                      <Plus size={14} /> Add
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        <div className="sqlwhale-edit-bottom">
          <div className="sqlwhale-edit-tip">
            <Code2 size={15} />
            <span>Click a cell → edit it → press Enter. SQLWhale generates UPDATE/INSERT/DELETE SQL.</span>
          </div>
          {sqlPreview && <pre className="sqlwhale-edit-sql-preview">{sqlPreview}</pre>}
          {status && <div className="sqlwhale-edit-status">{status}</div>}
        </div>
      </section>
    </div>
  );
}
