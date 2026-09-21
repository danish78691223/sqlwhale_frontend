import api from "./api";

import type { SQLResponse } from "@/types/execution";

export async function executeSQL(
  query: string
): Promise<SQLResponse> {
  const response = await api.post<SQLResponse>("/sql", {
    query,
  });

  return response.data;
}