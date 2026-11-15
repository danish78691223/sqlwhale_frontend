import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Understand SQL – Visual SQL Query Execution Guide",
  description: "Understand how SQL queries work with SQLWhale. Explore SELECT, FROM, WHERE, JOIN, GROUP BY, HAVING and ORDER BY to learn the logical flow behind database query results.",
  alternates: { canonical: "/understand" },
  keywords: ["understand SQL", "SQL query execution order", "SQL clauses explained", "SQL SELECT WHERE JOIN", "SQL logical query processing"],
};

export default function UnderstandLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
