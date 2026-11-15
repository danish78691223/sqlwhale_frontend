import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Online SQL Editor – Run and Practise SQL Queries",
  description: "Practise SQL online in SQLWhale's interactive SQL editor. Write and execute queries, explore database tables, test SELECT statements and JOINs, and understand query results hands-on.",
  alternates: { canonical: "/run-query" },
  keywords: ["online SQL editor", "SQL query runner", "SQL practice online", "run SQL queries", "SQL playground", "MySQL practice", "SQL JOIN practice"],
  openGraph: {
    title: "Online SQL Editor – Run and Practise SQL Queries | SQLWhale",
    description: "Write and execute SQL queries online with SQLWhale's interactive SQL editor and database workspace.",
    url: "https://sqlwhale.webxwhale.com/run-query",
    siteName: "SQLWhale",
    type: "website",
  },
};

export default function RunQueryLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
