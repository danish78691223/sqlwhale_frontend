"use client";

import {
  Check,
  Database,
  Filter,
  GitMerge,
  ListFilter,
  Loader2,
  Play,
  Table2,
} from "lucide-react";

import type {
  ExecutionStep,
} from "@/types/execution";

interface ExecutionTimelineProps {
  steps: ExecutionStep[];
  activeStep: number;
  onStepChange: (
    index: number
  ) => void;
  loading?: boolean;
}

function getIcon(
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

    case "order_by":
      return ListFilter;

    case "select":
      return Table2;

    default:
      return Play;
  }
}

function getTitle(
  operation: string
) {
  switch (operation) {
    case "scan":
      return "Read table";

    case "filter":
      return "Apply filter";

    case "inner_join":
      return "Match INNER JOIN";

    case "left_join":
      return "Apply LEFT JOIN";

    case "order_by":
      return "Order rows";

    case "select":
      return "Select columns";

    case "limit":
      return "Apply LIMIT";

    case "group_by":
      return "Create groups";

    case "aggregate":
      return "Calculate aggregate";

    default:
      return operation;
  }
}

export default function ExecutionTimeline({
  steps,
  activeStep,
  onStepChange,
  loading = false,
}: ExecutionTimelineProps) {
  if (loading) {
    return (
      <div className="execution-timeline loading">
        <div className="timeline-loading">
          <Loader2
            size={17}
            className="animate-spin"
          />

          <span>
            Understanding your query...
          </span>
        </div>
      </div>
    );
  }

  if (!steps.length) {
    return null;
  }

  return (
    <div className="execution-timeline">
      <div className="timeline-label">
        Query execution
      </div>

      <div className="timeline-list">
        {steps.map(
          (step, index) => {
            const Icon = getIcon(
              step.operation
            );

            const active =
              index === activeStep;

            const completed =
              index < activeStep;

            return (
              <button
                type="button"
                key={`${step.id}-${index}`}
                className={`timeline-item ${
                  active
                    ? "timeline-item-active"
                    : ""
                } ${
                  completed
                    ? "timeline-item-completed"
                    : ""
                }`}
                onClick={() =>
                  onStepChange(index)
                }
              >
                <span className="timeline-node">
                  {completed ? (
                    <Check size={13} />
                  ) : (
                    <Icon size={14} />
                  )}
                </span>

                <span className="timeline-copy">
                  <strong>
                    {index + 1}.{" "}
                    {getTitle(
                      step.operation
                    )}
                  </strong>

                  <small>
                    {step.explanation}
                  </small>
                </span>

                {index <
                  steps.length - 1 && (
                  <span className="timeline-line" />
                )}
              </button>
            );
          }
        )}
      </div>
    </div>
  );
}