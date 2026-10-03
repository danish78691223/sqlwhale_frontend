"use client";

import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import Editor, { type OnMount } from "@monaco-editor/react";
import { Play, RotateCcw } from "lucide-react";

export interface SQLEditorHandle {\n  focusTable: (tableName: string) => void;\n}\n\ninterface SQLEditorProps {
  initialQuery?: string;
  loading?: boolean;
  darkMode?: boolean;
  onRun: (query: string) => void;
  onClear: () => void;
  onCursorTargetChange?: (target: { table?: string; column: string } | null) => void;
  onQueryTableChange?: (tables: string[]) => void;
  availableTables?: string[];
}

const DEFAULT_QUERY = "SELECT * FROM employees;";

function extractQueryTables(sql: string, availableTables: string[] = []): string[] {
  const normalizedTables = availableTables
    .filter(Boolean)
    .map((name) => name.trim())
    .filter(Boolean);

  const targets: string[] = [];

  const addMatch = (rawName: string) => {
    const name = rawName.trim().replace(/^["\`]/, "").replace(/["\`]$/, "");
    if (!name) return;

    const normalized = name.toLowerCase();
    const exact = normalizedTables.find(
      (table) => table.toLowerCase() === normalized
    );

    if (exact) {
      targets.push(exact);
      return;
    }

    // Only resolve a partial name when it identifies exactly one table.
    // For example, if both local_learning_activity and
    // local_learning_progress exist, typing "local" must NOT arbitrarily
    // redirect to the first table.
    const partialMatches = normalizedTables.filter(
      (table) =>
        table.toLowerCase().startsWith(normalized) ||
        normalized.startsWith(table.toLowerCase())
    );

    if (partialMatches.length === 1) {
      targets.push(partialMatches[0]);
    }
  };

  // FROM / JOIN targets. This intentionally accepts partial names while typing.
  for (const match of sql.matchAll(
    /\b(?:FROM|JOIN)\s+(["\`]?[A-Za-z_][A-Za-z0-9_$]*["\`]?)?/gi
  )) {
    addMatch(match[1] || "");
  }

  // Comma-separated FROM targets.
  const fromMatch = sql.match(
    /\bFROM\s+([\s\S]*?)(?=\bWHERE\b|\bGROUP\s+BY\b|\bORDER\s+BY\b|\bHAVING\b|\bLIMIT\b|\bUNION\b|;|$)/i
  );

  if (fromMatch) {
    for (const part of fromMatch[1].split(/,(?![^()]*\))/)) {
      const name = part.trim().match(/^["\`]?([A-Za-z_][A-Za-z0-9_$]*)["\`]?/)?.[1];
      if (name) addMatch(name);
    }
  }

  return [...new Set(targets)];
}

const SQLEditor = forwardRef<SQLEditorHandle, SQLEditorProps>(function SQLEditor({
  initialQuery = DEFAULT_QUERY,
  loading = false,
  darkMode = false,
  onRun,
  onClear,
  onCursorTargetChange,
  onQueryTableChange,
  availableTables = [],
}: SQLEditorProps) {
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    setQuery(initialQuery);
    onQueryTableChange?.(extractQueryTables(initialQuery, availableTables));
  }, [initialQuery, onQueryTableChange]);

  const handleRun = () => {
    if (!query.trim() || loading) return;
    onRun(query);
  };

  const handleClear = () => {
    setQuery("");
    onQueryTableChange?.([]);
    onClear();
  };

  const [editorInstance, setEditorInstance] = useState<Parameters<OnMount>[0] | null>(null);

  useImperativeHandle(ref, () => ({
    focusTable: (tableName: string) => {
      if (!editorInstance || !tableName.trim()) return;

      const model = editorInstance.getModel();
      if (!model) return;

      const escaped = tableName.trim().replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&");}