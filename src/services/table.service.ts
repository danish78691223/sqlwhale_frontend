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

export async function getTableWithData(
  tableName: string
): Promise<TableResponse> {
  const response = await api.get<TableResponse>(
    `/tables/${encodeURIComponent(tableName)}`
  );
  return response.data;
}


/** Load schema from the participant's isolated competition workspace. */
export async function getCompetitionTableDetails(competitionId: string): Promise<DatabaseTable[]> {
  const response = await api.get<{ success: boolean; tables: string[] }>(
    `/competitions/${encodeURIComponent(competitionId)}/workspace/tables`
  );
  const names = response.data.tables || [];
  return Promise.all(names.map(async (name) => {
    const detail = await api.get<{ success: boolean; table: DatabaseTable }>(
      `/competitions/${encodeURIComponent(competitionId)}/workspace/tables/${encodeURIComponent(name)}`
    );
    return detail.data.table;
  }));
}
