import type {
  ParsedQuery,
  SQLJoinType,
  SQLQueryType,
} from "./queryTypes";

function cleanQuery(query: string): string {
  return query
    .replace(/--.*$/gm, "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/;$/, "");
}

function detectQueryType(
  query: string
): SQLQueryType {
  const upper = query.toUpperCase();

  if (/^CREATE\s+TABLE\b/.test(upper)) {
    return "CREATE_TABLE";
  }

  if (/^ALTER\s+TABLE\b/.test(upper)) {
    return "ALTER_TABLE";
  }

  if (/^DROP\s+TABLE\b/.test(upper)) {
    return "DROP_TABLE";
  }

  if (/^INSERT\s+INTO\b/.test(upper)) {
    return "INSERT";
  }

  if (/^UPDATE\b/.test(upper)) {
    return "UPDATE";
  }

  if (/^DELETE\s+FROM\b/.test(upper)) {
    return "DELETE";
  }

  if (
    /^SELECT\b/.test(upper) ||
    /^WITH\b/.test(upper)
  ) {
    return "SELECT";
  }

  return "UNKNOWN";
}

function extractCreatedTableName(
  query: string
): string | null {
  const match = query.match(
    /^CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?["'`]?([a-zA-Z_][a-zA-Z0-9_]*)["'`]?\s*\(/i
  );

  return match?.[1] ?? null;
}

export function analyzeQuery(
  query: string
): ParsedQuery {
  const normalizedQuery = cleanQuery(query);

  const type =
    detectQueryType(normalizedQuery);

  /*
   * -------------------------------------------------------
   * FROM
   * -------------------------------------------------------
   */

  const fromMatch =
    normalizedQuery.match(
      /\bFROM\s+([a-zA-Z_][a-zA-Z0-9_]*)/i
    );

  const sourceTable =
    fromMatch?.[1] ?? null;

  /*
   * -------------------------------------------------------
   * SELECT COLUMNS
   * -------------------------------------------------------
   */

  const selectMatch =
    normalizedQuery.match(
      /^SELECT\s+(.+?)\s+FROM\b/i
    );

  const selectedColumns =
    selectMatch
      ? selectMatch[1]
          .split(",")
          .map((column) => column.trim())
          .filter(Boolean)
      : [];

  /*
   * -------------------------------------------------------
   * WHERE
   * -------------------------------------------------------
   */

  const whereMatch =
    normalizedQuery.match(
      /\bWHERE\s+(.+?)(?=\s+ORDER\s+BY|\s+LIMIT|$)/i
    );

  const whereCondition =
    whereMatch?.[1]?.trim() ?? null;

  /*
   * -------------------------------------------------------
   * ORDER BY
   * -------------------------------------------------------
   */

  const orderMatch =
    normalizedQuery.match(
      /\bORDER\s+BY\s+([a-zA-Z_][a-zA-Z0-9_]*)/i
    );

  const orderByColumn =
    orderMatch?.[1] ?? null;

  /*
   * -------------------------------------------------------
   * LIMIT
   * -------------------------------------------------------
   */

  const limitMatch =
    normalizedQuery.match(
      /\bLIMIT\s+(\d+)/i
    );

  const limit =
    limitMatch
      ? Number(limitMatch[1])
      : null;

  /*
   * -------------------------------------------------------
   * JOIN
   * -------------------------------------------------------
   */

  const joinMatch =
    normalizedQuery.match(
      /\b(INNER|LEFT|RIGHT|FULL)\s+JOIN\s+([a-zA-Z_][a-zA-Z0-9_]*)/i
    );

  const joinType =
    joinMatch?.[1]
      ? (joinMatch[1].toUpperCase() as SQLJoinType)
      : null;

  const joinTable =
    joinMatch?.[2] ?? null;

  /*
   * -------------------------------------------------------
   * JOIN CONDITION
   * -------------------------------------------------------
   */

  const onMatch =
    normalizedQuery.match(
      /\bON\s+(.+?)(?=\s+WHERE|\s+ORDER\s+BY|\s+LIMIT|$)/i
    );

  const joinCondition =
    onMatch?.[1]?.trim() ?? null;

  /*
   * -------------------------------------------------------
   * JOIN COLUMNS
   * -------------------------------------------------------
   */

  let joinLeftColumn:
    string | null = null;

  let joinRightColumn:
    string | null = null;

  if (joinCondition) {
    const equalityMatch =
      joinCondition.match(
        /^\s*([a-zA-Z_][a-zA-Z0-9_]*\.[a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*([a-zA-Z_][a-zA-Z0-9_]*\.[a-zA-Z_][a-zA-Z0-9_]*)\s*$/
      );

    if (equalityMatch) {
      joinLeftColumn =
        equalityMatch[1];

      joinRightColumn =
        equalityMatch[2];
    }
  }

  return {
    type,

    rawQuery: query,

    normalizedQuery,

    sourceTable,

    selectedColumns,

    hasWhere:
      Boolean(whereCondition),

    whereCondition,

    hasOrderBy:
      Boolean(orderByColumn),

    orderByColumn,

    hasLimit:
      limit !== null,

    limit,

    hasJoin:
      Boolean(joinTable),

    joinType,

    joinTable,

    joinCondition,

    joinLeftColumn,

    joinRightColumn,

    createdTableName:
      type === "CREATE_TABLE"
        ? extractCreatedTableName(
            normalizedQuery
          )
        : null,
  };
}