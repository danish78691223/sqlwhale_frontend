export type SQLQueryType =
  | "SELECT"
  | "INSERT"
  | "UPDATE"
  | "DELETE"
  | "CREATE_TABLE"
  | "ALTER_TABLE"
  | "DROP_TABLE"
  | "UNKNOWN";

export type SQLJoinType =
  | "INNER"
  | "LEFT"
  | "RIGHT"
  | "FULL";

export interface ParsedQuery {
  type: SQLQueryType;

  rawQuery: string;

  normalizedQuery: string;

  sourceTable: string | null;

  selectedColumns: string[];

  hasWhere: boolean;

  whereCondition: string | null;

  hasOrderBy: boolean;

  orderByColumn: string | null;

  hasLimit: boolean;

  limit: number | null;

  /*
   * JOIN information
   */

  hasJoin: boolean;

  joinType: SQLJoinType | null;

  joinTable: string | null;

  joinCondition: string | null;

  joinLeftColumn: string | null;

  joinRightColumn: string | null;

  /*
   * CREATE TABLE
   */

  createdTableName: string | null;
}