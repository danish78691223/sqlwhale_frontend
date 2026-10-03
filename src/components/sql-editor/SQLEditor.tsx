"use client";

import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import Editor, { type OnMount } from "@monaco-editor/react";
import { Play, RotateCcw } from "lucide-react";

export interface SQLEditorHandle {\n  focusTable: (tableName: string) => void;\n});\n\ninterface SQLEditorProps {
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

      const escaped = tableName.trim().replace(/[.*+?^$\\{\\}()|[\\]\\\\]/g, "\\\\  const handleEditorMount: OnMount = (editor) => {");
      const matches = model.findMatches("\\\\b" + escaped + "\\\\b", false, true, false, null, true);
      if (matches.length === 0) return;

      const match = matches[0];
      editorInstance.setSelection(match.range);
      editorInstance.revealRangeInCenter(match.range);
      editorInstance.focus();
    },
  }), [editorInstance]);

  const handleEditorMount: OnMount = (editor) => {
    const updateQueryTableTargets = () => {
      const sql = editor.getValue();
      onQueryTableChange?.(extractQueryTables(sql, availableTables));
    };

    const updateCursorTarget = () => {
      const model = editor.getModel();
      const position = editor.getPosition();

      if (!model || !position) {
        onCursorTargetChange?.(null);
        return;
      }

      const word = model.getWordAtPosition(position);
      if (!word) {
        onCursorTargetChange?.(null);
        return;
      }

      const lineBeforeCursor = model.getLineContent(position.lineNumber).slice(0, word.startColumn - 1);
      const aliasMatch = lineBeforeCursor.match(/([A-Za-z_][\w$]*)\.\s*$/);
      const sql = model.getValue();
      const aliases = new Map<string, string>();

      for (const match of sql.matchAll(
        /\b(?:FROM|JOIN)\s+([A-Za-z_][\w$]*)(?:\s+(?:AS\s+)?([A-Za-z_][\w$]*))?/gi
      )) {
        const table = match[1];
        const alias = match[2];
        if (alias && !/^(ON|WHERE|JOIN|INNER|LEFT|RIGHT|FULL|CROSS|GROUP|ORDER|LIMIT|HAVING)$/i.test(alias)) {
          aliases.set(alias.toLowerCase(), table);
        }
        aliases.set(table.toLowerCase(), table);
      }

      const table = aliasMatch
        ? aliases.get(aliasMatch[1].toLowerCase())
        : undefined;

      onCursorTargetChange?.({
        table,
        column: word.word,
      });
    };

    editor.onDidChangeCursorPosition(updateCursorTarget);
    editor.onDidChangeModelContent(() => {
      updateQueryTableTargets();
      updateCursorTarget();
    });

    updateQueryTableTargets();
    updateCursorTarget();

    editor.onKeyDown((event) => {
      if (
        (event.browserEvent.key === " " ||
          event.browserEvent.key === ",") &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.altKey
      ) {
        event.preventDefault();
        event.stopPropagation();

        editor.executeEdits("sqlwhale-normal-text-input", [
          {
            range: editor.getSelection()!,
            text: event.browserEvent.key,
            forceMoveMarkers: true,
          },
        ]);

        editor.pushUndoStop();
      }
    });
  };

  return (
    <section className="sql-editor-section sql-editor">
      <div className="sql-editor-card">
        <div className="sql-editor-header editor-header">
          <div className="sql-editor-heading">
            <div className="sql-editor-code-icon">{"</>"}</div>
            <div>
              <h2>
                <span className="sqlwhale-query-mode-number">02</span>
                Write SQL
              </h2>
              <p>
                Edit the example, then run it to see what the database does.
              </p>
            </div>
          </div>

          <div className="sql-editor-actions">
            <button
              type="button"
              onClick={handleClear}
              disabled={loading}
              className="sql-clear-button"
            >
              <RotateCcw size={15} />
              Clear
            </button>

            <button
              type="button"
              onClick={handleRun}
              disabled={loading || !query.trim()}
              className="sql-run-button"
            >
              <Play size={15} fill="currentColor" />
              {loading ? "Running..." : "Run"}
            </button>
          </div>
        </div>

        <div className="sql-editor-hint" aria-label="SQL editor tip">
          <span className="sql-editor-hint-dot" aria-hidden="true" />
          <span><strong>Start here:</strong> edit the example query or write your own, then click <strong>Run</strong>.</span>
        </div>

        <div className="sql-editor-container">
          <Editor
            height="100%"
            language="sql"
            theme={darkMode ? "vs-dark" : "vs-light"}
            onMount={handleEditorMount}
            value={query}
            onChange={(value) => {
              const nextQuery = value || "";
              setQuery(nextQuery);
              onQueryTableChange?.(
                extractQueryTables(nextQuery, availableTables)
              );
            }}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: "on",
              padding: { top: 16, bottom: 16 },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              wordWrap: "on",
              acceptSuggestionOnCommitCharacter: false,
              acceptSuggestionOnEnter: "off",
              suggestOnTriggerCharacters: false,
              quickSuggestions: false,
              inlineSuggest: { enabled: false },
              tabSize: 2,
              folding: true,
              renderLineHighlight: "line",
            }}
          />
        </div>

        <div className="sql-editor-footer">
          <span>SQL editor</span>
          <span>Click Run to execute</span>
        </div>
      </div>
    </section>
  );
}