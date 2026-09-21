"use client";

import {
  Sparkles,
  Table2,
} from "lucide-react";

import type {
  SQLResponse,
} from "@/types/execution";

import ResultTable from "./ResultTable";
import ExecutionProgress from "./ExecutionProgress";

interface OutputBoxProps {
  data: SQLResponse | null;
  loading?: boolean;
  error?: string | null;
}

export default function OutputBox({
  data,
  loading = false,
  error = null,
}: OutputBoxProps) {
  const result = data?.result;

  const steps =
    data?.execution?.steps || [];

  if (loading) {
    return (
      <section className="output-section">
        <div className="output-box">
          <OutputHeader />

          <ExecutionProgress
            steps={[]}
            loading
          />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="output-section">
        <div className="output-box">
          <OutputHeader />

          <div className="output-error">
            <div className="output-error-icon">
              !
            </div>

            <div>
              <strong>
                Query Error
              </strong>

              <p>{error}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!data) {
    return (
      <section className="output-section">
        <div className="output-box output-empty-box">
          <OutputHeader />

          <div className="output-placeholder">
            <div className="output-placeholder-icon">
              <Sparkles size={20} />
            </div>

            <h3>
              Run a query to see the result
            </h3>

            <p>
              Your SQL execution and
              result will appear here.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="output-section">
      <div className="output-box">
        <OutputHeader />

        <ExecutionProgress
          steps={steps}
        />

        {data.execution
          ?.explanation && (
          <div className="query-explanation">
            <div className="query-explanation-icon">
              <Sparkles size={16} />
            </div>

            <div>
              <strong>
                What happened?
              </strong>

              <p>
                {
                  data.execution
                    .explanation
                }
              </p>
            </div>
          </div>
        )}

        {result && (
          <div className="result-container">
            <div className="result-heading">
              <div className="result-heading-left">
                <Table2 size={17} />

                <span>
                  Query Result
                </span>
              </div>

              <span className="result-count">
                {result.rowCount}{" "}
                {result.rowCount === 1
                  ? "row"
                  : "rows"}
              </span>
            </div>

            <ResultTable
              columns={result.columns}
              rows={result.rows}
            />
          </div>
        )}
      </div>
    </section>
  );
}

function OutputHeader() {
  return (
    <div className="output-header">
      <div className="output-header-title">
        <div className="output-icon">
          <Table2 size={18} />
        </div>

        <div>
          <h2>Output Box</h2>

          <p>
            Result of your query
          </p>
        </div>
      </div>
    </div>
  );
}