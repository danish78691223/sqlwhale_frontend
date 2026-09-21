import api from "./api";

import type {
  DatabaseTable,
  TableResponse,
  TablesResponse,
} from "@/types/table";

export async function getTables(): Promise<string[]> {
  const response =
    await api.get<TablesResponse>("/tables");

  return response.data.tables;
}

export async function getTable(
  tableName: string
): Promise<DatabaseTable> {
  const response =
    await api.get<TableResponse>(
      `/tables/${encodeURIComponent(tableName)}`
    );

  return response.data.table;
}

export async function getAllTableDetails(): Promise<
  DatabaseTable[]
> {
  const tableNames = await getTables();

  const tables = await Promise.all(
    tableNames.map((tableName) =>
      getTable(tableName)
    )
  );

  return tables;
}