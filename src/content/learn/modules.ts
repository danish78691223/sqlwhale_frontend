import moduleOne from "./module-01";
import moduleTwo from "./module-02";
import moduleThree from "./module-03";
import moduleFour from "./module-04";
import moduleFive from "./module-05";
import moduleSix from "./module-06";
import moduleSeven from "./module-07";
import moduleEight from "./module-08";
import moduleNine from "./module-09";
import type { LessonModule } from "./types";

export const MODULE_TITLES = [
  "SQL & Database Foundations", "SELECT & Expressions", "Filtering with WHERE",
  "Sorting, Limiting & Query Order", "Aggregate Functions & GROUP BY", "JOINs & Relationships",
  "Subqueries, CTEs & Set Operations", "Data Modification & Integrity", "Database Design & Performance",
  "Advanced SQL & Final Revision",
] as const;
export const moduleSummaries = [
  "Understand databases, tables, records and relationships.",
  "Choose columns, rename output and calculate values.",
  "Filter records using conditions, ranges, patterns and NULL checks.",
  "Sort results, limit output and understand query order.",
  "Summarize data with aggregate functions and groups.",
  "Combine related tables and preserve unmatched rows.",
  "Compose queries with nested queries, CTEs and set operations.",
  "Change data safely and protect data integrity.",
  "Design reliable schemas and reason about query performance.",
  "Use advanced SQL patterns, review security and complete the final revision.",
] as const;
export function getModuleContent(id: number): LessonModule | null {
  if (id === 1) return moduleOne;
  if (id === 2) return moduleTwo;
  if (id === 3) return moduleThree;
  if (id === 4) return moduleFour;
  if (id === 5) return moduleFive;
  if (id === 6) return moduleSix;
  if (id === 7) return moduleSeven;
  if (id === 8) return moduleEight;
  if (id === 9) return moduleNine;
  return null;
}
export type { LessonModule } from "./types";
