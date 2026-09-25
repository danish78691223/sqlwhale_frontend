"use client";

import { useCallback, useState } from "react";
import axios from "axios";

import { executeSQL } from "@/services/sql.service";

import type { SQLResponse } from "@/types/execution";

interface UseSQLQueryResult {
  data: SQLResponse | null;
  loading: boolean;
  error: string | null;
  runQuery: (query: string) => Promise<void>;
  clearResult: () => void;
}

export function useSQLQuery(): UseSQLQueryResult {
  const [data, setData] =
    useState<SQLResponse | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const runQuery = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        setError("Please enter a SQL query.");
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const result = await executeSQL(query);

        setData(result);

        if (!result.success) {
          setError(
            result.error ||
              "SQL query could not be executed."
          );
        }
      } catch (err: unknown) {
        console.error(
          "SQL execution failed:",
          err
        );

        let message =
          "Unable to connect to the SQLWhale backend.";

        if (axios.isAxiosError(err)) {
          if (err.response?.data?.error) {
            message = err.response.data.error;
          } else if (err.code === "ECONNABORTED") {
            message =
              "The SQLWhale backend took too long to respond. Please try again.";
          } else if (!err.response) {
            message =
              "Unable to reach the SQLWhale backend. Check the API service and try again.";
          }
        }

        setError(message);
        setData(null);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const clearResult = useCallback(() => {
    setData(null);
    setError(null);
  }, []);

  return {
    data,
    loading,
    error,
    runQuery,
    clearResult,
  };
}
