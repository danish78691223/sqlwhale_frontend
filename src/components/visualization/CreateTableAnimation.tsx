"use client";

import { useEffect, useState } from "react";

interface CreateTableAnimationProps {
  tableName: string;
  visible: boolean;
  success?: boolean;
}

const steps = [
  {
    id: "sql",
    label: "SQL Query",
    icon: "</>",
  },
  {
    id: "create",
    label: "Creating table",
    icon: "＋",
  },
  {
    id: "database",
    label: "Database",
    icon: "▣",
  },
  {
    id: "table",
    label: "New table",
    icon: "▤",
  },
];

export default function CreateTableAnimation({
  tableName,
  visible,
  success = false,
}: CreateTableAnimationProps) {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (!visible) {
      setActiveStep(0);
      return;
    }

    const timer = window.setInterval(() => {
      setActiveStep((current) => {
        if (current >= steps.length - 1) {
          return current;
        }

        return current + 1;
      });
    }, 850);

    return () => window.clearInterval(timer);
  }, [visible]);

  if (!visible) {
    return null;
  }

  return (
    <section className="create-table-visualization">
      <div className="create-table-visual-header">
        <div>
          <span className="visualization-kicker">DATABASE ACTION</span>

          <h3>
            Creating <strong>{tableName}</strong>
          </h3>

          <p>
            Watch how SQLWhale sends the CREATE TABLE operation into the
            database.
          </p>
        </div>

        <div
          className={`create-table-status ${
            success ? "create-table-status-success" : ""
          }`}
        >
          <span className="status-dot" />
          {success ? "Created" : "Executing"}
        </div>
      </div>

      <div className="create-table-flow">
        {steps.map((step, index) => {
          const isActive = index === activeStep;
          const isCompleted = index < activeStep || (success && index <= 3);

          return (
            <div className="create-flow-group" key={step.id}>
              <div
                className={[
                  "create-flow-node",
                  isActive ? "is-active" : "",
                  isCompleted ? "is-completed" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <div className="create-flow-icon">{step.icon}</div>

                <div className="create-flow-label">{step.label}</div>

                {step.id === "table" && (
                  <div className="create-flow-table-name">
                    {tableName}
                  </div>
                )}
              </div>

              {index < steps.length - 1 && (
                <div
                  className={[
                    "create-flow-connector",
                    index < activeStep ? "is-completed" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <div className="create-flow-packet" />
                  <span>→</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="create-table-live-message">
        <span className="live-message-icon">✦</span>

        <div>
          <strong>
            {success
              ? `${tableName} is now part of your database`
              : `SQLWhale is creating ${tableName}`}
          </strong>

          <p>
            {success
              ? "You can now use this table in your SQL queries."
              : "The visualization follows the database operation step by step."}
          </p>
        </div>
      </div>
    </section>
  );
}