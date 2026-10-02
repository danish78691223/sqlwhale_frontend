"use client";

import { useEffect, useState } from "react";
import Editor, { type OnMount } from "@monaco-editor/react";
import { Play, RotateCcw } from "lucide-react";

interface SQLEditorProps {
  initialQuery?: string;
  loading?: boolean;
  darkMode?: boolean;
  onRun: (query: string) => void;
  onClear: () => void;
  onCursorTargetChange?: (target: { table?: string; column: string } | null) => void;
  onQueryTableChange?: (table: string | null) => void;
}

const DEFAULT_QUERY =
  "SELECT * FROM employees;";

export default function SQLEditor({
  initialQuery = DEFAULT_QUERY,
  loading = false,
  darkMode = false,
  onRun,
  onClear,
  onCursorTargetChange,
  onQueryTableChange,
}: SQLEditorProps) {
  const [query, setQuery] =
    useState(initialQuery);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const handleRun = () => {
    if (!query.trim() || loading) {
      return;
    }

    onRun(query);
  };

  const handleClear = () => {
    setQuery("");
    onClear();
  };

  const handleEditorMount: OnMount = (editor) => {
    const updateQueryTableTarget = () => {
      const sql = editor.getValue();
      const tablesInQuery = [...sql.matchAll(/\\b(?:FROM|JOIN|UPDATE|INTO|DELETE\\s+FROM)\\s+([A-Za-z_][\\w$]*)/gi)]
        .map((match) => match[1].toLowerCase());

      const knownTable =
        ["departments", "employees", "projects", "salary"].find((table) =>
          tablesInQuery.includes(table)
        ) ?? null;

      onQueryTableChange?.(knownTable);
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
      updateQueryTableTarget();
      updateCursorTarget();
    });
    updateQueryTableTarget();
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
    // added "sql-editor" so .sqlwhale-query-editor .sql-editor overrides in
    // globals.css actually apply (height:100%, no border/shadow duplication)
    <section className="sql-editor-section sql-editor">
      <div className="sql-editor-card">

        {/* added "editor-header" so the compact 54px header override applies */}
        <div className="sql-editor-header editor-header">
          <div className="sql-editor-heading">

            <div className="sql-editor-code-icon">
              {"</>"}
            </div>

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
              disabled={
                loading ||
                !query.trim()
              }
              className="sql-run-button"
            >
              <Play
                size={15}
                fill="currentColor"
              />

              {loading
                ? "Running..."
                : "Run"}
            </button>

          </div>
        </div>

        <div className="sql-editor-hint" aria-label="SQL editor tip">
          <span className="sql-editor-hint-dot" aria-hidden="true" />
          <span><strong>Start here:</strong> edit the example query or write your own, then click <strong>Run</strong>.</span>
        </div>

        <div className="sql-editor-container">

          <Editor
            // fills whatever height is left in the parent instead of
            // forcing 280px and overflowing its box
            height="100%"
            language="sql"
            theme={darkMode ? "vs-dark" : "vs-light"}
            onMount={handleEditorMount}
            value={query}
            onChange={(value) =>
              setQuery(value || "")
            }
            options={{
              minimap: {
                enabled: false,
              },

              fontSize: 14,

              lineNumbers: "on",

              padding: {
                top: 16,
                bottom: 16,
              },

              scrollBeyondLastLine: false,

              automaticLayout: true,

              wordWrap: "on",

              // Keep normal SQL typing behavior: a space after a comma
              // must be inserted immediately instead of being consumed by
              // autocomplete/commit-character handling.
              acceptSuggestionOnCommitCharacter: false,
              acceptSuggestionOnEnter: "off",
              suggestOnTriggerCharacters: false,
              quickSuggestions: false,
              inlineSuggest: {
                enabled: false,
              },

              tabSize: 2,

              folding: true,

              renderLineHighlight: "line",
            }}
          />

        </div>

        <div className="sql-editor-footer">
          <span>
            SQL editor
          </span>

          <span>
            Click Run to execute
          </span>
        </div>

      </div>
    </section>
  );
}