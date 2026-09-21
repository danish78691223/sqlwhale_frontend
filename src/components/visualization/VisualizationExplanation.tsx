"use client";

interface ExecutionExplanationProps {
  title: string;
  description: string;
  type?: "info" | "success";
}

export default function ExecutionExplanation({
  title,
  description,
  type = "info",
}: ExecutionExplanationProps) {
  return (
    <div
      className={`execution-explanation execution-explanation-${type}`}
    >
      <div className="execution-explanation-icon">
        {type === "success" ? "✓" : "✦"}
      </div>

      <div>
        <strong>{title}</strong>
        <p>{description}</p>
      </div>
    </div>
  );
}