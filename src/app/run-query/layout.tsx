import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SQL Online Compiler – Run SQL Queries Online | SQLWhale",
  description:
    "Practice SQL online with SQLWhale's online SQL compiler. Write and execute SQL queries, explore database tables, test commands, and improve your SQL skills in an interactive workspace.",
  alternates: {
    canonical: "https://sqlwhale.webxwhale.com/run-query",
  },
  openGraph: {
    title: "SQL Online Compiler – Run SQL Queries Online | SQLWhale",
    description:
      "Write and execute SQL queries online with SQLWhale's interactive SQL compiler and database workspace.",
    url: "https://sqlwhale.webxwhale.com/run-query",
    siteName: "SQLWhale",
    type: "website",
  },
};

export default function RunQueryLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
