import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learn SQL Online – Beginner to Advanced SQL Course",
  description: "Learn SQL step by step with SQLWhale's structured online course. Study database basics, SELECT, WHERE, JOINs, GROUP BY, subqueries and advanced SQL, then practise what you learn.",
  alternates: { canonical: "/learn" },
  keywords: ["SQL course", "learn SQL for beginners", "SQL tutorial", "SQL learning path", "SQL basics", "SQL JOIN tutorial", "advanced SQL"],
};

export default function LearnLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
