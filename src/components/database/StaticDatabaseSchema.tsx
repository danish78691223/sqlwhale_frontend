"use client";

type Column = {
  name: string;
  type: string;
  primary?: boolean;
  foreign?: boolean;
};

type TableDefinition = {
  name: string;
  columns: Column[];
  accent: "blue" | "purple" | "green" | "cyan";
};

const TABLES: TableDefinition[] = [
  {
    name: "departments",
    accent: "cyan",
    columns: [
      {
        name: "department_id",
        type: "integer",
        primary: true,
      },
      {
        name: "department_name",
        type: "text",
      },
      {
        name: "location",
        type: "text",
      },
    ],
  },

  {
    name: "employees",
    accent: "blue",
    columns: [
      {
        name: "employee_id",
        type: "integer",
        primary: true,
      },
      {
        name: "name",
        type: "text",
      },
      {
        name: "department",
        type: "text",
      },
      {
        name: "salary",
        type: "integer",
      },
    ],
  },

  {
    name: "projects",
    accent: "purple",
    columns: [
      {
        name: "project_id",
        type: "integer",
        primary: true,
      },
      {
        name: "employee_id",
        type: "integer",
        foreign: true,
      },
      {
        name: "project",
        type: "text",
      },
    ],
  },

  {
    name: "system_metadata",
    accent: "green",
    columns: [
      {
        name: "id",
        type: "integer",
        primary: true,
      },
      {
        name: "key",
        type: "text",
      },
      {
        name: "value",
        type: "text",
      },
    ],
  },
];

function TableCard({
  table,
}: {
  table: TableDefinition;
}) {
  return (
    <div
      className={`static-table static-table-${table.accent}`}
      data-table-name={table.name}
      data-sql-table={table.name}
    >
      <div className="static-table-label">
        {table.name}
      </div>

      <div className="static-table-card">
        <div className="static-table-header">
          <div className="static-table-title">
            <span className="static-table-dot" />

            <strong>{table.name}</strong>
          </div>
        </div>

        <div className="static-table-columns">
          {table.columns.map((column) => (
            <div
              className="static-column"
              key={column.name}
            >
              <div className="static-column-name">
                {column.primary && (
                  <span className="primary-key">
                    🔑
                  </span>
                )}

                <span>{column.name}</span>

                {column.foreign && (
                  <span className="foreign-key">
                    FK
                  </span>
                )}
              </div>

              <span className="static-column-type">
                {column.type}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function StaticDatabaseSchema() {
  return (
    <div
      className="static-database-schema"
      data-sql-database="schema"
    >
      {TABLES.map((table) => (
        <TableCard
          key={table.name}
          table={table}
        />
      ))}
    </div>
  );
}