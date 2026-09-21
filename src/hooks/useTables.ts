"use client";

import { useCallback, useEffect, useState } from "react";

import {
  getAllTableDetails,
} from "@/services/table.service";

import type { DatabaseTable } from "@/types/table";

interface UseTablesResult {
  tables: DatabaseTable[];
  loading: boolean;
  error: string | null;
  refreshTables: () => Promise<void>;
}

export function useTables(): UseTablesResult {
  const [tables, setTables] = useState<
    DatabaseTable[]
  >([]);

  const [loading, setLoading] =
    useState<boolean>(true);

  const [error, setError] =
    useState<string | null>(null);

  const refreshTables = useCallback(
    async () => {
      try {
        setLoading(true);
        setError(null);

        const result =
          await getAllTableDetails();

        setTables(result);
      } catch (err) {
        console.error(
          "Failed to load tables:",
          err
        );

        setError(
          "Unable to load database tables."
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    void refreshTables();
  }, [refreshTables]);

  return {
    tables,
    loading,
    error,
    refreshTables,
  };
}