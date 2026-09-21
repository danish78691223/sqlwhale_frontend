"use client";

import {
  RefreshCw,
} from "lucide-react";

import { useTables } from "@/hooks/useTables";

import DatabaseCanvas from "./DatabaseCanvas";
import DatabaseLegend from "./DatabaseLegend";

export default function DatabaseSection() {
  const {
    tables,
    loading,
    error,
    refreshTables,
  } = useTables();

  if (loading) {
    return (
      <section className="database-section">
        <div className="database-loading">
          <RefreshCw
            size={22}
            className="animate-spin"
          />

          <span>
            Loading database schema...
          </span>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="database-section">
        <div className="database-error">
          <p>{error}</p>

          <button
            type="button"
            onClick={() => void refreshTables()}
            className="sql-primary-button"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  if (!tables.length) {
    return (
      <section className="database-section">
        <div className="database-empty">
          <p>
            No tables found in the database.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="database-section">
      <div className="database-section-header">
        <div>
          <p className="database-eyebrow">
            Database
          </p>

          <h2 className="database-title">
            Explore your tables
          </h2>
        </div>

        <button
          type="button"
          onClick={() => void refreshTables()}
          className="database-refresh-button"
          aria-label="Refresh database"
        >
          <RefreshCw size={16} />
        </button>
      </div>

      <div className="database-visual-wrapper">
        <DatabaseCanvas tables={tables} />

        <DatabaseLegend />
      </div>
    </section>
  );
}