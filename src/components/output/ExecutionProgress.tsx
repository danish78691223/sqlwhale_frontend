"use client";

import {
  Check,
  Database,
  Filter,
  GitMerge,
  ListFilter,
  Loader2,
  Search,
  Table2,
} from "lucide-react";

import type {
  ExecutionStep,
} from "@/types/execution";

interface ExecutionProgressProps {
  steps: ExecutionStep[];
  loading?: boolean;
}

function getStepIcon(
  operation: string
) {
  switch (operation) {
    case "scan":
      return Database;

    case "filter":
      return Filter;

    case "inner_join":
    case "left_join":
      return GitMerge;

    case "select":
      return Table2;

    case "order_by":
      return ListFilter;

    case "limit":
      return Search;

    case "group_by":
    case "aggregate":
      return Table2;

    default:
      return Search;
  }
}

function getStepLabel(
  operation: string
) {
  switch (operation) {
    case "scan":
      return "Fetching data";

    case "filter":
      return "Filtering rows";

    case "inner_join":
      return "Matching INNER JOIN";

    case "left_join":
      return "Matching LEFT JOIN";

    case "select":
      return "Selecting columns";

    case "order_by":
      return "Ordering results";

    case "limit":
      return "Applying LIMIT";

    case "group_by":
      return "Building groups";

    case "aggregate":
      return "Calculating aggregate";

    case "create_table":
      return "Creating table";

    case "insert":
      return "Inserting data";

    default:
      return operation;
  }
}

export default function ExecutionProgress({
  steps,
  loading = false,
}: ExecutionProgressProps) {
  if (loading) {
    return (
      <div className="execution-loading">
        <Loader2
          size={18}
          className="animate-spin"
        />

        <span>
          Executing SQL query...
        </span>
      </div>
    );
  }

  if (!steps.length) {
    return null;
  }

  return (
    <div className="execution-progress">
      {steps.map(
        (step, index) => {
          const Icon =
            getStepIcon(
              step.operation
            );

          return (
            <div
              key={`${step.id}-${index}`}
              className="execution-step"
            >
              <div className="execution-step-icon">
                <Icon size={15} />
              </div>

              <div className="execution-step-content">
                <div className="execution-step-title">
                  <span>
                    {index + 1}
                  </span>

                  <strong>
                    {getStepLabel(
                      step.operation
                    )}
                  </strong>

                  <Check
                    size={14}
                    className="execution-check"
                  />
                </div>

                <p>
                  {step.explanation}
                </p>
              </div>

              {index <
                steps.length - 1 && (
                <div className="execution-connector" />
              )}
            </div>
          );
        }
      )}
    </div>
  );
}