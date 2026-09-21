"use client";

import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { Play, RotateCcw } from "lucide-react";

interface SQLEditorProps {
  initialQuery?: string;
  loading?: boolean;
  onRun: (query: string) => void;
  onClear: () => void;
}

const DEFAULT_QUERY =
  "SELECT * FROM employees;";

export default function SQLEditor({
  initialQuery = DEFAULT_QUERY,
  loading = false,
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
    <section className="sql-editor-section">
      <div className="sql-editor-card">

        <div className="sql-editor-header">
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
            height="280px"
            language="sql"
            theme="vs-dark"
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