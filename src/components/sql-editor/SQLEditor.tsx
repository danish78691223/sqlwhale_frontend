"use client";

import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { Play, RotateCcw } from "lucide-react";

interface SQLEditorProps {
  initialQuery?: string;
  loading?: boolean;
  darkMode?: boolean;
  onRun: (query: string) => void;
  onClear: () => void;
}

const DEFAULT_QUERY =
  "SELECT * FROM employees;";

export default function SQLEditor({
  initialQuery = DEFAULT_QUERY,
  loading = false,
  darkMode = false,
  onRun,
  onClear,
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
              <h2>Query</h2>

              <p>
                Write and execute SQL
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

        <div className="sql-editor-container">

          <Editor
            // fills whatever height is left in the parent instead of
            // forcing 280px and overflowing its box
            height="100%"
            language="sql"
            theme={darkMode ? "vs-dark" : "vs-light"}
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