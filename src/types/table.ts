export interface TableColumn {
  name: string;
  type: string;
  notNull?: boolean;
  primaryKey?: boolean;
  defaultValue?: unknown;
  foreignKey?: boolean;
  referencesTable?: string;
  referencesColumn?: string;
}

export interface DatabaseTable {
  name: string;
  columns: TableColumn[];
}

export interface TableData {
  rows: unknown[][];
  rowCount: number;
}

export interface TableResponse {
  success: boolean;
  table: DatabaseTable;
  data: TableData;
}

export interface TablesResponse {
  success: boolean;
  tables: string[];
}