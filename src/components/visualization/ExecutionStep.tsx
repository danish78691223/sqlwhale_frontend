"use client";

interface ExecutionStepProps {
  number: number;
  title: string;
  description: string;
  active?: boolean;
  completed?: boolean;
}

export default function ExecutionStep({
  number,
  title,
  description,
  active = false,
  completed = false,
}: ExecutionStepProps) {
  return (
    <div
      className={[
        "execution-step-card",
        active ? "is-active" : "",
        completed ? "is-completed" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="execution-step-number">
        {completed ? "✓" : number}
      </div>

      <div className="execution-step-content">
        <strong>{title}</strong>
        <p>{description}</p>
      </div>
    </div>
  );
}