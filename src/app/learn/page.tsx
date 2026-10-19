"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import LessonLayout from "@/components/learn/LessonLayout";
import moduleOne from "@/content/learn/module-01";
import { getModuleContent } from "@/content/learn/modules";
import "./[moduleId]/lesson.css";

type Lesson = { title: string; body: string; example: string };
type LearningModule = {
  id: number;
  title: string;
  level: string;
  summary: string;
  outcomes: string[];
  lessons: Lesson[];
};
type ProgressState = {
  completedModules: number[];
  completedCount: number;
  progressPercent: number;
  unlockedThrough: number;
  assessment?: { status: string; attempts: number; totalScore: number } | null;
};
type Question = { id: string; question: string; options?: string[]; hint?: string };
type AssessmentPaper = {
  mcqs: Question[];
  longQuestions: Question[];
  queryQuestions: Question[];
  totalMarks: number;
  passMarks: number;
};

const modules: LearningModule[] = [
  {
    id: 1, title: "SQL & Database Foundations", level: "Beginner",
    summary: "Build a clear mental model of relational databases, tables, records and relationships.",
    outcomes: ["Explain what SQL is used for", "Read tables as rows and columns", "Identify primary and foreign keys"],
    lessons: [
      { title: "What is SQL?", body: "SQL (Structured Query Language) is used to read and work with data in relational databases. A database stores related information; SQL lets you ask questions about it in a consistent way.", example: "SELECT name FROM employees;" },
      { title: "Tables, rows and columns", body: "A table represents one kind of entity. Each row is a record and each column is an attribute. Select only the information you need rather than always relying on SELECT *.", example: "SELECT employee_id, name, department_id\nFROM employees;" },
      { title: "Keys and relationships", body: "A primary key uniquely identifies each record. A foreign key references a key in another table, helping represent relationships such as employees belonging to departments.", example: "SELECT e.name, d.department_name\nFROM employees AS e\nJOIN departments AS d\n  ON e.department_id = d.department_id;" },
    ],
  },
  {
    id: 2, title: "SELECT & Expressions", level: "Beginner",
    summary: "Choose columns, rename output, remove duplicates and create calculated values.",
    outcomes: ["Select specific columns", "Use aliases for readability", "Create calculated result columns"],
    lessons: [
      { title: "Select specific columns", body: "SELECT defines which expressions appear in the output. Column names should match the table schema.", example: "SELECT name, department_id\nFROM employees;" },
      { title: "Aliases and DISTINCT", body: "AS gives a clear name to a result column. DISTINCT removes duplicate combinations from the result, which is useful for lists of unique categories.", example: "SELECT DISTINCT department_id AS department\nFROM employees;" },
      { title: "Expressions", body: "Arithmetic expressions can calculate values at query time. A computed alias makes a result easier to understand in reports.", example: "SELECT employee_id, amount, amount * 1.10 AS adjusted_amount\nFROM salary;" },
    ],
  },
  {
    id: 3, title: "Filtering with WHERE", level: "Beginner",
    summary: "Filter records using comparisons, AND/OR, ranges, patterns and NULL checks.",
    outcomes: ["Write comparison conditions", "Combine conditions safely", "Handle missing values correctly"],
    lessons: [
      { title: "Comparison and logic", body: "WHERE filters individual rows before grouping. AND requires both conditions to be true; OR allows either condition to be true. Use parentheses when mixing them.", example: "SELECT * FROM employees\nWHERE department_id = 1 AND employee_id > 1;" },
      { title: "IN, BETWEEN and LIKE", body: "IN checks a list of values. BETWEEN expresses a range. LIKE supports simple pattern matching; exact pattern support may vary by database.", example: "SELECT * FROM salary\nWHERE amount BETWEEN 45000 AND 60000;" },
      { title: "NULL is not zero", body: "NULL represents an unknown or absent value; it is not the same as zero or an empty string. Use IS NULL and IS NOT NULL rather than = NULL.", example: "SELECT * FROM employees\nWHERE department_id IS NOT NULL;" },
    ],
  },
  {
    id: 4, title: "Sorting, Limiting & Query Order", level: "Beginner",
    summary: "Sort results, return a controlled number of rows and learn the order clauses are logically processed.",
    outcomes: ["Sort ascending or descending", "Limit returned rows", "Explain common logical query order"],
    lessons: [
      { title: "ORDER BY", body: "ORDER BY sorts the result using one or more columns. ASC is ascending and DESC is descending. Add a second sort key to make ties easier to interpret.", example: "SELECT employee_id, amount\nFROM salary\nORDER BY amount DESC, employee_id ASC;" },
      { title: "LIMIT", body: "LIMIT restricts the number of rows returned in SQLite and several other systems. Other database engines may use FETCH FIRST or TOP.", example: "SELECT * FROM employees\nORDER BY employee_id\nLIMIT 3;" },
      { title: "Logical query order", body: "A useful mental model is FROM/JOIN, WHERE, GROUP BY, HAVING, SELECT, DISTINCT, ORDER BY and then LIMIT/FETCH. This helps explain why an aggregate alias is not normally usable in WHERE.", example: "SELECT department_id, COUNT(*) AS total\nFROM employees\nGROUP BY department_id\nORDER BY total DESC\nLIMIT 3;" },
    ],
  },
  {
    id: 5, title: "Aggregate Functions & GROUP BY", level: "Intermediate",
    summary: "Summarize records and filter grouped results with aggregate functions.",
    outcomes: ["Use COUNT, SUM, AVG, MIN and MAX", "Create grouped summaries", "Filter aggregates with HAVING"],
    lessons: [
      { title: "Aggregate functions", body: "COUNT counts rows or non-NULL values; SUM adds numbers; AVG finds an average; MIN and MAX return extremes. Most aggregates ignore NULL values.", example: "SELECT COUNT(*) AS employee_count\nFROM employees;" },
      { title: "GROUP BY", body: "GROUP BY creates one result group for each unique combination of grouping columns. Every selected expression should be aggregated or included in the grouping columns where required by the SQL engine.", example: "SELECT department_id, COUNT(*) AS total\nFROM employees\nGROUP BY department_id;" },
      { title: "HAVING", body: "WHERE filters rows before groups are formed; HAVING filters the groups after aggregation. Use HAVING for conditions involving COUNT, SUM or AVG.", example: "SELECT department_id, COUNT(*) AS total\nFROM employees\nGROUP BY department_id\nHAVING COUNT(*) >= 1;" },
    ],
  },
  {
    id: 6, title: "JOINs & Relationships", level: "Intermediate",
    summary: "Combine related tables and reason about matching and unmatched rows.",
    outcomes: ["Use explicit ON conditions", "Compare INNER and LEFT JOIN", "Spot duplicated rows caused by one-to-many relations"],
    lessons: [
      { title: "INNER JOIN", body: "INNER JOIN returns only rows that match the join condition on both sides. It is useful when the report should include only records with a related match.", example: "SELECT e.name, d.department_name\nFROM employees AS e\nINNER JOIN departments AS d\n  ON e.department_id = d.department_id;" },
      { title: "LEFT JOIN", body: "LEFT JOIN preserves every row from the left table. When there is no matching right-side row, the right-side columns are NULL.", example: "SELECT e.name, p.project_name\nFROM employees AS e\nLEFT JOIN projects AS p\n  ON e.employee_id = p.employee_id;" },
      { title: "Join cardinality", body: "If one employee has many projects, that employee can appear on several result rows. Know whether a relationship is one-to-one, one-to-many or many-to-many before aggregating joined data.", example: "SELECT e.name, COUNT(p.project_id) AS project_count\nFROM employees AS e\nLEFT JOIN projects AS p\n  ON e.employee_id = p.employee_id\nGROUP BY e.employee_id, e.name;" },
    ],
  },
  {
    id: 7, title: "Subqueries, CTEs & Set Operations", level: "Intermediate",
    summary: "Compose readable multi-step queries by naming or nesting query results.",
    outcomes: ["Read a nested query", "Use WITH to name a query block", "Choose UNION versus UNION ALL"],
    lessons: [
      { title: "Subqueries", body: "A subquery is a query nested inside another statement. It may provide a list of values, a single calculated value or a derived table.", example: "SELECT name FROM employees\nWHERE employee_id IN (SELECT employee_id FROM projects);" },
      { title: "Common Table Expressions", body: "A CTE begins with WITH and gives a name to a query expression. It can make complex steps easier to test and read.", example: "WITH project_counts AS (\n  SELECT employee_id, COUNT(*) AS total\n  FROM projects GROUP BY employee_id\n)\nSELECT * FROM project_counts;" },
      { title: "Set operations", body: "UNION combines compatible result sets and removes duplicates. UNION ALL keeps duplicates and is often faster when deduplication is not needed.", example: "SELECT employee_id FROM employees\nUNION\nSELECT employee_id FROM projects;" },
    ],
  },
  {
    id: 8, title: "Data Modification & Integrity", level: "Intermediate",
    summary: "Create and change data deliberately while protecting its consistency.",
    outcomes: ["Understand INSERT, UPDATE and DELETE", "Use constraints to protect data", "Explain transactions and rollback"],
    lessons: [
      { title: "INSERT", body: "INSERT creates rows. Listing target columns explicitly makes statements safer when table schemas change.", example: "INSERT INTO departments (department_id, department_name, location)\nVALUES (4, 'Design', 'Pune');" },
      { title: "UPDATE and DELETE", body: "Always check the target rows before running an UPDATE or DELETE. A missing or overly broad WHERE clause can affect far more rows than intended.", example: "UPDATE employees\nSET department_id = 2\nWHERE employee_id = 4;" },
      { title: "Constraints and transactions", body: "Primary keys, foreign keys, NOT NULL, UNIQUE and CHECK constraints preserve integrity. A transaction groups changes; COMMIT confirms them and ROLLBACK reverses uncommitted work.", example: "BEGIN;\nUPDATE salary SET amount = amount + 1000 WHERE employee_id = 1;\nCOMMIT;" },
    ],
  },
  {
    id: 9, title: "Database Design & Performance", level: "Advanced",
    summary: "Structure data responsibly and understand the trade-offs of indexes and query plans.",
    outcomes: ["Describe normalization", "Explain index trade-offs", "Recognize common query-performance issues"],
    lessons: [
      { title: "Normalization", body: "Normalization organizes facts into related tables to reduce avoidable redundancy and update anomalies. Good design makes data more consistent and easier to maintain.", example: "SELECT employee_id, department_id\nFROM employees;" },
      { title: "Indexes", body: "Indexes can speed up selected lookups and ordering operations, but use storage and can slow writes because the index must be maintained.", example: "CREATE INDEX idx_salary_amount ON salary(amount);" },
      { title: "Query plans and tuning", body: "Use an execution plan where supported. Check join predicates, unnecessary columns, unselective filters and indexes that match common access patterns. Measure changes rather than guessing.", example: "SELECT employee_id, amount\nFROM salary\nWHERE amount >= 50000\nORDER BY amount DESC;" },
    ],
  },
  {
    id: 10, title: "Advanced SQL & Final Revision", level: "Advanced",
    summary: "Connect CASE expressions, window functions and analytical thinking before the final assessment.",
    outcomes: ["Write conditional result expressions", "Explain a window function", "Combine the core SQL skills in practical tasks"],
    lessons: [
      { title: "CASE expressions", body: "CASE evaluates conditions in order and returns the first matching result. It can label rows without changing stored values.", example: "SELECT employee_id,\n  CASE WHEN amount >= 55000 THEN 'High' ELSE 'Standard' END AS salary_band\nFROM salary;" },
      { title: "Window functions", body: "A window function calculates across related rows while keeping each row in the output. PARTITION BY creates groups for the calculation and ORDER BY defines its order.", example: "SELECT employee_id, amount,\n  RANK() OVER (ORDER BY amount DESC) AS salary_rank\nFROM salary;" },
      { title: "Prepare for the final test", body: "Review SELECT, filtering, sorting, aggregation, joins, subqueries, safe data changes, design and performance. The final test contains 10 MCQs, 4 long answers and 4 SQL queries.", example: "SELECT d.department_name, COUNT(e.employee_id) AS team_size\nFROM departments AS d\nLEFT JOIN employees AS e ON e.department_id = d.department_id\nGROUP BY d.department_id, d.department_name;" },
    ],
  },
];

export default function LearnPage() {
  const [progress, setProgress] = useState<ProgressState>({
    completedModules: [], completedCount: 0, progressPercent: 0, unlockedThrough: 1, assessment: null,
  });
  const [activeModuleId, setActiveModuleId] = useState(1);
  const [lessonModuleId, setLessonModuleId] = useState(1);
  const [view, setView] = useState<"modules" | "module" | "assessment" | "result">("modules");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [message, setMessage] = useState("");
  const [paper, setPaper] = useState<AssessmentPaper | null>(null);
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number>>({});
  const [longAnswers, setLongAnswers] = useState<Record<string, string>>({});
  const [queryAnswers, setQueryAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<any>(null);

  const activeModule = modules.find((module) => module.id === activeModuleId) || modules[0];
  const completedIds = progress.completedModules || [];

  async function loadProgress() {
    setLoading(true);
    try {
      const response = await fetch("/api/learning/progress", { cache: "no-store", credentials: "include" });
      const data = await response.json();
      if (!response.ok) {
        setSignedIn(response.status === 401 ? false : true);
        setMessage(data.error || (response.status === 401 ? "Sign in to save your learning progress." : "The learning service returned an error."));
        return;
      }
      setSignedIn(true);
      setProgress(data);
      const completedFromResponse: number[] = data.completedModules || [];
      const nextModule = Math.min(10, data.unlockedThrough || 1);
      setActiveModuleId((current) => completedFromResponse.includes(current) ? current : nextModule);
      setMessage("");
    } catch {
      setMessage("Unable to connect to the learning service. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const syncLessonFromHash = () => {
      const match = /^#module-(\\d+)$/.exec(window.location.hash);
      const requestedId = match ? Number(match[1]) : 1;
      setLessonModuleId(requestedId >= 1 && requestedId <= 10 ? requestedId : 1);
    };
    syncLessonFromHash();
    window.addEventListener("hashchange", syncLessonFromHash);
    return () => window.removeEventListener("hashchange", syncLessonFromHash);
  }, []);

  useEffect(() => {
    void loadProgress();
    // Load persisted progress once when the page opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function openModule(moduleId: number) {
    setActiveModuleId(moduleId);
    setView("module");
    setMessage("");
  }

  async function completeModule() {
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/learning/modules/" + activeModuleId + "/complete", {
        method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}),
      });
      const data = await response.json();
      if (!response.ok) {
        setMessage(data.error || "Unable to save module completion.");
        return;
      }
      await loadProgress();
      setView("modules");
      setMessage("Module " + activeModuleId + " completed. Your next module is now unlocked.");
      setActiveModuleId(Math.min(10, activeModuleId + 1));
    } catch {
      setMessage("Unable to save this module. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  async function openAssessment() {
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/learning/assessment", { credentials: "include", cache: "no-store" });
      const data = await response.json();
      if (!response.ok) {
        setMessage(data.error || "Finish every module to unlock the test.");
        return;
      }
      setPaper(data.paper);
      setMcqAnswers(data.attempt?.answers?.mcq || {});
      setLongAnswers(data.attempt?.answers?.longAnswers || {});
      setQueryAnswers(data.attempt?.answers?.queries || {});
      setResult(null);
      setView("assessment");
    } catch {
      setMessage("Unable to load the final assessment. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function submitAssessment() {
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/learning/assessment/submit", {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: { mcq: mcqAnswers, longAnswers, queries: queryAnswers } }),
      });
      const data = await response.json();
      if (!response.ok) {
        setMessage(data.error || "Unable to submit assessment.");
        return;
      }
      setResult(data);
      setView("result");
      await loadProgress();
    } catch {
      setMessage("Assessment submission failed. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  const allModulesDone = completedIds.length === 10;
  const assessmentPassed = progress.assessment?.status === "passed";

  return (
    <main className="learn-v2">
      <style jsx global>{`
        .learn-v2 {
          --learn-bg: #07090d;
          --learn-panel: #0d1219;
          --learn-panel2: #111a23;
          --learn-text: #f4f7fb;
          --learn-muted: #9aa8b6;
          --learn-line: rgba(255,255,255,.10);
          --learn-green: #8fe7bd;
          --learn-blue: #7cc7ff;
          min-height: 100vh;
          color: var(--learn-text);
          background: radial-gradient(ellipse at 15% 0%, rgba(124,199,255,.10), transparent 32%), radial-gradient(ellipse at 90% 20%, rgba(143,231,189,.08), transparent 28%), var(--learn-bg);
          font-family: Arial, Helvetica, sans-serif;
          padding-bottom: 72px;
        }
        .learn-v2 * { box-sizing: border-box; }
        .learn-v2 a { color: inherit; text-decoration: none; }
        .learn-topbar { height: 70px; padding: 0 5vw; display:flex; align-items:center; justify-content:space-between; border-bottom:1px solid var(--learn-line); position:sticky; top:0; z-index:20; background:rgba(7,9,13,.86); backdrop-filter:blur(18px); }
        .learn-brand { display:flex; align-items:center; gap:12px; font-weight:800; letter-spacing:-.04em; }
        .learn-logo { display:grid; place-items:center; width:36px; height:36px; border:1px solid rgba(143,231,189,.45); border-radius:11px; color:var(--learn-green); background:rgba(143,231,189,.06); font:700 11px monospace; }
        .learn-toplinks { display:flex; gap:20px; align-items:center; color:var(--learn-muted); font:11px monospace; text-transform:uppercase; letter-spacing:.08em; }
        .learn-toplinks a:hover { color:var(--learn-green); }
        .learn-wrap { width:min(1180px, 90vw); margin:0 auto; }
        .learn-hero { padding:68px 0 32px; display:grid; grid-template-columns:minmax(0,1fr) 230px; gap:36px; align-items:center; }
        .learn-eyebrow { display:flex; align-items:center; gap:9px; text-transform:uppercase; color:var(--learn-green); font:700 10px monospace; letter-spacing:.19em; }
        .learn-eyebrow:before { content:""; height:1px; width:28px; background:var(--learn-green); }
        .learn-hero h1 { font-size:clamp(42px,6vw,76px); line-height:.98; letter-spacing:-.075em; margin:18px 0; max-width:790px; }
        .learn-hero h1 span { color:transparent; -webkit-text-stroke:1px rgba(255,255,255,.62); }
        .learn-hero p { color:var(--learn-muted); font-size:16px; line-height:1.75; max-width:680px; margin:0; }
        .learn-hero-side { padding:24px; border:1px solid var(--learn-line); border-radius:20px; background:linear-gradient(145deg,rgba(143,231,189,.07),rgba(124,199,255,.03)); }
        .learn-hero-side strong { display:block; font-size:42px; letter-spacing:-.07em; }
        .learn-hero-side span { color:var(--learn-muted); font:10px monospace; text-transform:uppercase; letter-spacing:.12em; }
        .learn-hero-side .mini-bar { height:6px; background:rgba(255,255,255,.08); border-radius:99px; margin:16px 0 10px; overflow:hidden; }
        .learn-hero-side .mini-bar i { display:block; height:100%; border-radius:99px; background:linear-gradient(90deg,var(--learn-green),var(--learn-blue)); transition:width .3s ease; }
        .learn-stats { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:14px; margin:14px 0 28px; }
        .learn-stat { border:1px solid var(--learn-line); background:rgba(255,255,255,.025); border-radius:15px; padding:17px 19px; }
        .learn-stat span { display:block; color:var(--learn-muted); font:10px monospace; text-transform:uppercase; letter-spacing:.12em; }
        .learn-stat strong { display:block; margin-top:8px; font-size:25px; letter-spacing:-.04em; }
        .learn-stat small { color:var(--learn-green); font-size:11px; }
        .learn-alert { border:1px solid rgba(124,199,255,.24); background:rgba(124,199,255,.055); padding:13px 16px; color:#d9e8f5; border-radius:12px; line-height:1.55; font-size:13px; margin:16px 0; }
        .learn-alert.error { border-color:rgba(255,137,137,.28); background:rgba(255,100,100,.06); }
        .learn-heading { display:flex; justify-content:space-between; align-items:end; gap:20px; margin:34px 0 16px; }
        .learn-heading h2 { font-size:clamp(24px,3.4vw,36px); letter-spacing:-.055em; margin:0 0 7px; }
        .learn-heading p { color:var(--learn-muted); font-size:13px; line-height:1.6; margin:0; }
        .learn-module-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:12px; }
        .learn-module-card { text-decoration:none; text-align:left; width:100%; min-height:144px; display:grid; grid-template-columns:48px minmax(0,1fr) 24px; gap:14px; padding:19px; border:1px solid var(--learn-line); border-radius:17px; background:rgba(255,255,255,.025); color:var(--learn-text); cursor:pointer; transition:border-color .2s,transform .2s,background .2s; }
        .learn-module-card:hover:not(:disabled) { border-color:rgba(143,231,189,.5); background:rgba(143,231,189,.045); transform:translateY(-2px); }
        .learn-module-card[aria-disabled="true"] { cursor:not-allowed; opacity:.52; pointer-events:none; text-decoration:none; }
        .learn-module-card.is-active { border-color:rgba(143,231,189,.65); background:linear-gradient(125deg,rgba(143,231,189,.08),rgba(124,199,255,.025)); }
        .learn-module-number { width:44px; height:44px; display:grid; place-items:center; border-radius:12px; border:1px solid var(--learn-line); color:var(--learn-muted); font:700 12px monospace; }
        .learn-module-card.is-complete .learn-module-number { color:#07120d; background:var(--learn-green); border-color:var(--learn-green); }
        .learn-module-copy { min-width:0; }
        .learn-module-copy small { display:block; color:var(--learn-green); font:10px monospace; text-transform:uppercase; letter-spacing:.1em; margin:1px 0 8px; }
        .learn-module-copy strong { display:block; font-size:16px; line-height:1.35; margin-bottom:7px; }
        .learn-module-copy p { margin:0; color:var(--learn-muted); line-height:1.55; font-size:12px; }
        .learn-module-status { color:var(--learn-muted); font-size:20px; }
        .learn-panel { border:1px solid var(--learn-line); border-radius:20px; background:linear-gradient(145deg,rgba(255,255,255,.035),rgba(255,255,255,.015)); padding:clamp(20px,4vw,38px); margin-top:20px; }
        .learn-panel-header { display:flex; align-items:flex-start; justify-content:space-between; gap:20px; margin-bottom:24px; }
        .learn-panel-header h2 { margin:10px 0 8px; font-size:clamp(26px,4vw,42px); line-height:1.05; letter-spacing:-.06em; }
        .learn-panel-header p { margin:0; color:var(--learn-muted); line-height:1.6; font-size:14px; }
        .learn-tag { display:inline-flex; border:1px solid var(--learn-line); border-radius:99px; padding:7px 10px; color:var(--learn-green); font:10px monospace; text-transform:uppercase; letter-spacing:.08em; white-space:nowrap; }
        .learn-outcomes { display:flex; gap:8px; flex-wrap:wrap; margin:18px 0 26px; }
        .learn-outcomes span { color:#c5d0d9; border:1px solid var(--learn-line); border-radius:99px; padding:8px 11px; font-size:11px; }
        .learn-lesson-list { display:grid; gap:12px; }
        .learn-lesson { padding:20px; border:1px solid var(--learn-line); border-radius:14px; background:rgba(0,0,0,.18); }
        .learn-lesson h3 { margin:0 0 9px; font-size:17px; letter-spacing:-.025em; }
        .learn-lesson p { color:var(--learn-muted); margin:0 0 15px; line-height:1.7; font-size:13px; }
        .learn-lesson pre { margin:0; padding:15px; overflow:auto; white-space:pre-wrap; overflow-wrap:anywhere; background:#05080b; border:1px solid rgba(255,255,255,.07); border-radius:10px; color:var(--learn-green); font:12px/1.7 ui-monospace,SFMono-Regular,Consolas,monospace; }
        .learn-actions { display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap; margin-top:22px; }
        .learn-btn { display:inline-flex; justify-content:center; align-items:center; gap:9px; border:1px solid rgba(143,231,189,.48); border-radius:11px; padding:12px 16px; background:var(--learn-green); color:#06110b; font-weight:800; font-size:12px; cursor:pointer; transition:transform .2s,opacity .2s; }
        .learn-btn:hover:not(:disabled) { transform:translateY(-2px); }
        .learn-btn:disabled { opacity:.45; cursor:not-allowed; }
        .learn-btn.secondary { color:var(--learn-text); background:rgba(255,255,255,.035); border-color:var(--learn-line); }
        .learn-btn.link-btn { background:transparent; color:var(--learn-green); }
        .learn-muted { color:var(--learn-muted); font-size:12px; line-height:1.6; }
        .learn-assessment-intro { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:10px; margin:20px 0; }
        .learn-assessment-intro div { border:1px solid var(--learn-line); border-radius:12px; padding:14px; background:rgba(255,255,255,.02); }
        .learn-assessment-intro b { display:block; font-size:20px; }
        .learn-assessment-intro span { color:var(--learn-muted); font-size:11px; line-height:1.5; }
        .learn-question { padding:20px 0; border-top:1px solid var(--learn-line); }
        .learn-question h3 { margin:0 0 13px; font-size:15px; line-height:1.5; }
        .learn-question textarea { width:100%; min-height:120px; resize:vertical; border:1px solid var(--learn-line); border-radius:11px; outline:none; background:#080c11; color:var(--learn-text); padding:13px; font:13px/1.65 Arial,sans-serif; }
        .learn-question textarea:focus { border-color:rgba(143,231,189,.6); }
        .learn-question textarea.sql-answer { min-height:95px; font-family:ui-monospace,SFMono-Regular,Consolas,monospace; color:var(--learn-green); }
        .learn-options { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:8px; }
        .learn-option { display:flex; align-items:flex-start; gap:10px; padding:12px; border:1px solid var(--learn-line); border-radius:10px; color:#d8e0e6; background:rgba(255,255,255,.02); font-size:13px; cursor:pointer; }
        .learn-option:has(input:checked) { border-color:rgba(143,231,189,.45); background:rgba(143,231,189,.06); }
        .learn-option input { accent-color:#8fe7bd; margin-top:2px; }
        .learn-result-score { font-size:clamp(56px,9vw,90px); font-weight:800; letter-spacing:-.08em; line-height:1; }
        .learn-result-score.pass { color:var(--learn-green); }
        .learn-result-score.fail { color:#ffadad; }
        .learn-results-grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:10px; margin:20px 0; }
        .learn-result-item { border:1px solid var(--learn-line); border-radius:12px; padding:14px; }
        .learn-result-item strong { display:block; font-size:24px; }
        .learn-result-item span { color:var(--learn-muted); font-size:11px; }
        .learn-result-list { list-style:none; padding:0; margin:15px 0; display:grid; gap:8px; }
        .learn-result-list li { border:1px solid var(--learn-line); border-radius:10px; padding:12px; font-size:12px; line-height:1.5; }
        .learn-result-list b { color:var(--learn-green); }
        .learn-footer { margin-top:48px; padding-top:20px; border-top:1px solid var(--learn-line); display:flex; justify-content:space-between; gap:15px; flex-wrap:wrap; color:var(--learn-muted); font:10px monospace; letter-spacing:.07em; text-transform:uppercase; }
        @media (max-width:760px) {
          .learn-topbar { height:62px; padding:0 16px; }
          .learn-toplinks { gap:12px; font-size:9px; }
          .learn-toplinks a:first-child { display:none; }
          .learn-wrap { width:min(100% - 32px, 600px); }
          .learn-hero { grid-template-columns:1fr; padding:42px 0 24px; gap:20px; }
          .learn-hero-side { display:none; }
          .learn-hero p { font-size:14px; }
          .learn-stats { gap:8px; }
          .learn-stat { padding:13px; }
          .learn-stat strong { font-size:20px; }
          .learn-stat span { font-size:9px; letter-spacing:.05em; }
          .learn-module-grid { grid-template-columns:1fr; }
          .learn-module-card { min-height:124px; padding:15px; grid-template-columns:42px minmax(0,1fr) 18px; gap:11px; }
          .learn-module-number { width:39px; height:39px; }
          .learn-heading { display:block; }
          .learn-panel { padding:18px; }
          .learn-panel-header { display:block; }
          .learn-panel-header .learn-tag { margin-top:14px; }
          .learn-assessment-intro { grid-template-columns:1fr; }
          .learn-options { grid-template-columns:1fr; }
          .learn-results-grid { grid-template-columns:1fr; }
          .learn-actions { align-items:stretch; }
          .learn-actions .learn-btn { width:100%; }
        }
      `}</style>

      <nav className="learn-topbar">
        <Link href="/" className="learn-brand">
          <span className="learn-logo">SQL</span>
          <span>SQLWhale <span style={{ color: "#8fe7bd" }}>/ Learn</span></span>
        </Link>
        <div className="learn-toplinks">
          <a href="#modules" onClick={() => setView("modules")}>Modules</a>
          <Link href="/run-query">Query Lab ↗</Link>
        </div>
      </nav>

      <div className="learn-wrap">
        <header className="learn-hero">
          <div>
            <div className="learn-eyebrow">LEARN · PRACTISE · GET CERTIFIED</div>
            <h1>Master SQL, <span>one module at a time.</span></h1>
            <p>Follow a guided 10-module learning path. Complete each module to unlock the next one, build your progress in 10% steps, then prove your skills in the 50-mark final assessment.</p>
          </div>
          <div className="learn-hero-side">
            <strong>{loading ? "—" : progress.progressPercent + "%"}</strong>
            <span>Learning path complete</span>
            <div className="mini-bar"><i style={{ width: progress.progressPercent + "%" }} /></div>
            <span>{progress.completedCount} of 10 modules completed</span>
          </div>
        </header>

        <section className="learn-stats" aria-label="Learning statistics">
          <div className="learn-stat"><span>Course progress</span><strong>{loading ? "…" : progress.progressPercent + "%"}</strong><small>10% per module</small></div>
          <div className="learn-stat"><span>Modules completed</span><strong>{loading ? "…" : progress.completedCount + " / 10"}</strong><small>Sequential unlocks</small></div>
          <div className="learn-stat"><span>Final assessment</span><strong>{assessmentPassed ? "Passed" : allModulesDone ? "Unlocked" : "Locked"}</strong><small>{assessmentPassed ? "Score: " + progress.assessment?.totalScore + " / 50" : "Pass mark: 40 / 50"}</small></div>
        </section>

        {!loading && signedIn === false && (
          <div className="learn-alert error">
            Sign in to save module progress and take the final assessment. <Link href="/login" style={{ textDecoration: "underline", fontWeight: 700 }}>Log in</Link> or <Link href="/signup" style={{ textDecoration: "underline", fontWeight: 700 }}>create an account</Link>.
          </div>
        )}
        {message && <div className={"learn-alert" + (signedIn === false ? " error" : "")} role="status">{message}</div>}

        {view !== "assessment" && view !== "result" && (
          <section id={`module-${lessonModuleId}`} className="learn-unified-lesson">
            <LessonLayout module={getModuleContent(lessonModuleId) || moduleOne} initialProgress={progress} />
          </section>
        )}

        {view === "module" && (
          <section className="learn-panel" aria-live="polite">
            <div className="learn-panel-header">
              <div>
                <div className="learn-eyebrow">MODULE {String(activeModule.id).padStart(2, "0")} / 10</div>
                <h2>{activeModule.title}</h2>
                <p>{activeModule.summary}</p>
              </div>
              <span className="learn-tag">{completedIds.includes(activeModule.id) ? "Completed" : activeModule.level}</span>
            </div>
            <div className="learn-outcomes">{activeModule.outcomes.map((outcome) => <span key={outcome}>✓ {outcome}</span>)}</div>
            <div className="learn-lesson-list">
              {activeModule.lessons.map((lesson, index) => (
                <article className="learn-lesson" key={lesson.title}>
                  <h3>{String(index + 1).padStart(2, "0")} · {lesson.title}</h3>
                  <p>{lesson.body}</p>
                  <pre>{lesson.example}</pre>
                </article>
              ))}
            </div>
            <div className="learn-actions">
              <span className="learn-muted">Finish the reading, try the example in Query Lab, then mark this module complete to earn 10% progress.</span>
              <div style={{ display: "flex", gap: 9, flexWrap: "wrap" }}>
                <Link className="learn-btn secondary" href="/run-query">Practise SQL ↗</Link>
                {completedIds.includes(activeModule.id) ? (
                  <button className="learn-btn" onClick={() => setView("modules")}>Module completed ✓</button>
                ) : (
                  <button className="learn-btn" disabled={busy || signedIn !== true} onClick={() => void completeModule()}>{busy ? "Saving…" : "Complete module +10% →"}</button>
                )}
              </div>
            </div>
          </section>
        )}

        {view === "modules" && (
          <section className="learn-panel">
            <div className="learn-panel-header">
              <div>
                <div className="learn-eyebrow">NEXT STEP</div>
                <h2>{allModulesDone ? "You have unlocked the final test." : "Keep the momentum going."}</h2>
                <p>{allModulesDone ? "All 10 modules are complete. Take the final assessment to check your SQL knowledge." : "Choose the next unlocked module above. Every completed module adds exactly 10% to your course progress."}</p>
              </div>
              <span className="learn-tag">{allModulesDone ? "50-mark test" : "Module " + Math.min(10, progress.unlockedThrough)}</span>
            </div>
            <div className="learn-actions">
              <span className="learn-muted">Learning progress is saved to your SQLWhale account.</span>
              {allModulesDone ? (
                <button className="learn-btn" disabled={busy || signedIn !== true || assessmentPassed} onClick={() => void openAssessment()}>
                  {assessmentPassed ? "Assessment passed ✓" : busy ? "Loading test…" : "Start final assessment →"}
                </button>
              ) : (
                <button className="learn-btn" disabled={signedIn !== true} onClick={() => void openModule(Math.max(1, progress.unlockedThrough))}>
                  Continue learning → 
                </button>
              )}
            </div>
            {progress.assessment && (
              <p className="learn-muted" style={{ marginTop: 17 }}>
                Latest assessment: {progress.assessment.status.replace("_", " ")} · {progress.assessment.totalScore}/50 · Attempt {progress.assessment.attempts}
              </p>
            )}
          </section>
        )}

        {view === "assessment" && paper && (
          <section className="learn-panel">
            <div className="learn-panel-header">
              <div>
                <div className="learn-eyebrow">SQLWHALE / FINAL ASSESSMENT</div>
                <h2>Show what you know.</h2>
                <p>Answer all 18 questions. MCQs are auto-graded, long answers use a keyword rubric, and SQL queries are executed against the course dataset.</p>
              </div>
              <span className="learn-tag">Pass: 40 / 50</span>
            </div>
            <div className="learn-assessment-intro">
              <div><b>10 marks</b><span>10 multiple-choice questions · 1 mark each</span></div>
              <div><b>20 marks</b><span>4 long-answer questions · 5 marks each</span></div>
              <div><b>20 marks</b><span>4 SQL queries · 5 marks each</span></div>
            </div>
            <h3 style={{ margin: "26px 0 5px", fontSize: 20 }}>Part A · Multiple choice</h3>
            <p className="learn-muted">Choose one answer for every question.</p>
            {paper.mcqs.map((question, index) => (
              <div className="learn-question" key={question.id}>
                <h3>{index + 1}. {question.question} <span className="learn-muted">(1 mark)</span></h3>
                <div className="learn-options">
                  {(question.options || []).map((option, optionIndex) => (
                    <label className="learn-option" key={option}>
                      <input type="radio" name={question.id} checked={Number(mcqAnswers[question.id]) === optionIndex} onChange={() => setMcqAnswers((current) => ({ ...current, [question.id]: optionIndex }))} />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
            <h3 style={{ margin: "30px 0 5px", fontSize: 20 }}>Part B · Long answers</h3>
            <p className="learn-muted">Explain in your own words. Each question is worth 5 marks; include the key concepts and an example where useful.</p>
            {paper.longQuestions.map((question, index) => (
              <div className="learn-question" key={question.id}>
                <h3>{index + 11}. {question.question} <span className="learn-muted">(5 marks)</span></h3>
                <textarea value={longAnswers[question.id] || ""} onChange={(event) => setLongAnswers((current) => ({ ...current, [question.id]: event.target.value }))} placeholder="Write your explanation here…" />
              </div>
            ))}
            <h3 style={{ margin: "30px 0 5px", fontSize: 20 }}>Part C · SQL queries</h3>
            <p className="learn-muted">Write a query for each task. Each query is checked against the course dataset and is worth 5 marks.</p>
            {paper.queryQuestions.map((question, index) => (
              <div className="learn-question" key={question.id}>
                <h3>{index + 15}. {question.question} <span className="learn-muted">(5 marks)</span></h3>
                <p className="learn-muted">Hint: {question.hint}</p>
                <textarea className="sql-answer" value={queryAnswers[question.id] || ""} onChange={(event) => setQueryAnswers((current) => ({ ...current, [question.id]: event.target.value }))} placeholder="SELECT …" />
              </div>
            ))}
            <div className="learn-actions">
              <button className="learn-btn secondary" onClick={() => setView("modules")}>Back to modules</button>
              <button className="learn-btn" disabled={busy || signedIn !== true} onClick={() => void submitAssessment()}>{busy ? "Grading…" : "Submit assessment →"}</button>
            </div>
            <p className="learn-muted" style={{ marginTop: 14 }}>Passing requires at least 40/50 marks. You can retake the test if you do not pass.</p>
          </section>
        )}

        {view === "result" && result && (
          <section className="learn-panel" aria-live="polite">
            <div className="learn-panel-header">
              <div>
                <div className="learn-eyebrow">ASSESSMENT RESULT</div>
                <h2>{result.status === "passed" ? "Congratulations — you passed!" : "Keep practising and try again."}</h2>
                <p>{result.message}</p>
              </div>
              <span className="learn-tag">{result.status === "passed" ? "Passed" : "Not passed"}</span>
            </div>
            <div className={"learn-result-score " + (result.status === "passed" ? "pass" : "fail")}>{result.totalScore}<span style={{ fontSize: 24, color: "var(--learn-muted)", letterSpacing: "-.03em" }}> / 50</span></div>
            <p className="learn-muted">Passing score: 40/50 · Attempt {result.attempt?.attempts || progress.assessment?.attempts || 1}</p>
            <div className="learn-results-grid">
              <div className="learn-result-item"><strong>{result.breakdown?.mcqScore ?? 0}/10</strong><span>Multiple choice</span></div>
              <div className="learn-result-item"><strong>{result.breakdown?.longAnswerScore ?? 0}/20</strong><span>Long answers</span></div>
              <div className="learn-result-item"><strong>{result.breakdown?.queryScore ?? 0}/20</strong><span>SQL queries</span></div>
            </div>
            <h3 style={{ marginTop: 24 }}>Long-answer feedback</h3>
            <ul className="learn-result-list">
              {(result.longResults || []).map((item: any) => <li key={item.id}><b>{item.id.toUpperCase()}: {item.score}/{item.maxScore}</b> — {item.feedback}</li>)}
            </ul>
            <h3 style={{ marginTop: 24 }}>SQL-query feedback</h3>
            <ul className="learn-result-list">
              {(result.queryResults || []).map((item: any) => <li key={item.id}><b>{item.id.toUpperCase()}: {item.score}/{item.maxScore}</b> — {item.feedback}</li>)}
            </ul>
            <div className="learn-actions">
              <button className="learn-btn secondary" onClick={() => setView("modules")}>Back to learning path</button>
              {result.status !== "passed" && <button className="learn-btn" onClick={() => { setResult(null); setView("assessment"); }}>Retake assessment →</button>}
              {result.status === "passed" && <Link href="/run-query" className="learn-btn">Keep practising in Query Lab ↗</Link>}
            </div>
          </section>
        )}

        <footer className="learn-footer"><span>SQLWhale · Learn by doing</span><span>10 modules · 50 marks · pass at 40</span></footer>
      </div>
    </main>
  );
}
