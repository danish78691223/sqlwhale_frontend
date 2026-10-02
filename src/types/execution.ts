export type ExecutionRow = unknown[];

export type ExecutionStep = {
  id?: string;

  title?: string;

  operation: string;

  sourceTable?: string;

  condition?: string;

  inputColumns?: string[];
  inputRows?: ExecutionRow[];

  outputColumns?: string[];
  outputRows?: ExecutionRow[];

  matchedRows?: number[];
  filteredRows?: number[];
  highlightedRows?: number[];
  resultRows?: number[];

  explanation?: string;

  metadata?: Record<string, unknown>;
};

export type SQLResult = {
  columns: string[];
  rows: ExecutionRow[];
  rowCount?: number;
};

export type SQLExecution = {
  steps: ExecutionStep[];

  explanation?: string;
};

export type QueryJoin = {
  type: string;
  table: string;
  alias?: string;
  condition: string;
  leftTable?: string;
  leftColumn?: string;
  rightTable?: string;
  rightColumn?: string;
};

export type QueryAnalysis = {
  tables: string[];
  aliases: Record<string, string>;
  joins: QueryJoin[];
};

export type SQLResponse = {
  success?: boolean;

  error?: string;

  message?: string;

  query?: string;

  result?: SQLResult;

  execution?: SQLExecution;

  explanation?: string;

  queryAnalysis?: QueryAnalysis;
};