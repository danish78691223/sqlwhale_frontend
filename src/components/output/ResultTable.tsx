"use client";

interface ResultTableProps {
  columns: string[];
  rows: unknown[][];
}

function formatValue(
  value: unknown
): string {
  if (value === null) {
    return "NULL";
  }

  if (value === undefined) {
    return "";
  }

  if (
    typeof value === "object"
  ) {
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }

  return String(value);
}

export default function ResultTable({
  columns,
  rows,
}: ResultTableProps) {
  if (!columns.length) {
    return (
      <div className="result-empty">
        <p>
          Query executed successfully.
        </p>
      </div>
    );
  }

  return (
    <div className="result-table-wrapper">
      <table className="result-table">

        <thead>
          <tr>
            {columns.map(
              (column, index) => (
                <th
                  key={`${column}-${index}`}
                >
                  {column}
                </th>
              )
            )}
          </tr>
        </thead>

        <tbody>
          {rows.map(
            (row, rowIndex) => (
              <tr key={rowIndex}>

                {columns.map(
                  (_, columnIndex) => (
                    <td
                      key={`${rowIndex}-${columnIndex}`}
                    >
                      {formatValue(
                        row[columnIndex]
                      )}
                    </td>
                  )
                )}

              </tr>
            )
          )}
        </tbody>

      </table>
    </div>
  );
}