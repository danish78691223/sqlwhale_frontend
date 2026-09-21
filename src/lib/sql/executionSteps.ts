import type {
  ParsedQuery,
} from "./queryTypes";

export type SQLVisualOperation =
  | "READ_TABLE"
  | "JOIN"
  | "FILTER"
  | "SELECT_COLUMNS"
  | "ORDER_BY"
  | "LIMIT"
  | "CREATE_TABLE"
  | "RESULT";

export interface SQLVisualStep {
  id: string;

  operation: SQLVisualOperation;

  title: string;

  description: string;

  sourceTable?: string;

  sourceTables?: string[];

  condition?: string;

  columns?: string[];

  joinType?: string;

  joinTable?: string;

  joinCondition?: string;

  createdTable?: string;
}

export function createExecutionSteps(
  analysis: ParsedQuery
): SQLVisualStep[] {
  const steps: SQLVisualStep[] = [];

  /*
   * CREATE TABLE
   */

  if (
    analysis.type ===
    "CREATE_TABLE"
  ) {
    steps.push({
      id: "create-table",
      operation: "CREATE_TABLE",
      title: "Creating table",
      description:
        `SQLWhale is creating the "${analysis.createdTableName ?? "new table"}" table.`,
      createdTable:
        analysis.createdTableName ??
        undefined,
    });

    steps.push({
      id: "database-write",
      operation: "CREATE_TABLE",
      title: "Writing to database",
      description:
        "The new table structure is being added to the database.",
      createdTable:
        analysis.createdTableName ??
        undefined,
    });

    steps.push({
      id: "create-result",
      operation: "RESULT",
      title: "Table created",
      description:
        `The "${analysis.createdTableName ?? "new table"}" table is now available.`,
      createdTable:
        analysis.createdTableName ??
        undefined,
    });

    return steps;
  }

  /*
   * SOURCE TABLE
   */

  if (analysis.sourceTable) {
    steps.push({
      id: "read-source",
      operation: "READ_TABLE",
      title:
        `Reading ${analysis.sourceTable}`,
      description:
        `SQLWhale reads the "${analysis.sourceTable}" table.`,
      sourceTable:
        analysis.sourceTable,
      sourceTables:
        [analysis.sourceTable],
    });
  }

  /*
   * JOIN TABLE
   */

  if (
    analysis.hasJoin &&
    analysis.joinTable
  ) {
    steps.push({
      id: "read-join",
      operation: "READ_TABLE",
      title:
        `Reading ${analysis.joinTable}`,
      description:
        `SQLWhale reads the "${analysis.joinTable}" table.`,
      sourceTable:
        analysis.joinTable,
      sourceTables:
        [analysis.joinTable],
    });
  }

  /*
   * JOIN
   */

  if (
    analysis.hasJoin &&
    analysis.joinTable
  ) {
    steps.push({
      id: "join",
      operation: "JOIN",
      title:
        `${analysis.joinType ?? "INNER"} JOIN`,
      description:
        analysis.joinCondition
          ? `Rows are matched using ${analysis.joinCondition}.`
          : "Rows from both tables are matched.",
      sourceTables:
        [
          analysis.sourceTable,
          analysis.joinTable,
        ].filter(
          Boolean
        ) as string[],
      joinType:
        analysis.joinType ??
        "INNER",
      joinTable:
        analysis.joinTable,
      joinCondition:
        analysis.joinCondition ??
        undefined,
    });
  }

  /*
   * WHERE
   */

  if (
    analysis.hasWhere &&
    analysis.whereCondition
  ) {
    steps.push({
      id: "where",
      operation: "FILTER",
      title: "Applying filter",
      description:
        `Rows are checked using ${analysis.whereCondition}.`,
      condition:
        analysis.whereCondition,
    });
  }

  /*
   * SELECT COLUMNS
   */

  if (
    analysis.selectedColumns.length > 0 &&
    !analysis.selectedColumns.includes("*")
  ) {
    steps.push({
      id: "select-columns",
      operation: "SELECT_COLUMNS",
      title: "Selecting columns",
      description:
        `SQLWhale keeps ${analysis.selectedColumns.join(", ")}.`,
      columns:
        analysis.selectedColumns,
    });
  }

  /*
   * ORDER BY
   */

  if (analysis.hasOrderBy) {
    steps.push({
      id: "order-by",
      operation: "ORDER_BY",
      title: "Ordering rows",
      description:
        `Rows are ordered using ${analysis.orderByColumn}.`,
    });
  }

  /*
   * LIMIT
   */

  if (analysis.hasLimit) {
    steps.push({
      id: "limit",
      operation: "LIMIT",
      title: "Limiting rows",
      description:
        `SQLWhale keeps the first ${analysis.limit} rows.`,
    });
  }

  /*
   * FINAL RESULT
   */

  steps.push({
    id: "result",
    operation: "RESULT",
    title: "Displaying result",
    description:
      "The processed result is displayed in the Output Box.",
  });

  return steps;
}

/*
 * Backward-compatible alias.
 *
 * If any other component still imports
 * getExecutionSteps, it will continue working.
 */

export function getExecutionSteps(
  analysis: ParsedQuery
): SQLVisualStep[] {
  return createExecutionSteps(
    analysis
  );
}