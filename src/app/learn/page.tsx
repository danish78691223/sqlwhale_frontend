 "use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

const concepts = [
  ["01", "Database", "A structured collection of data managed by a database system."],
  ["02", "Table", "A relation made of rows and columns."],
  ["03", "Row", "One record or tuple in a table."],
  ["04", "Column", "An attribute describing one property of each record."],
  ["05", "Primary Key", "A column or column set that uniquely identifies rows."],
  ["06", "Foreign Key", "A reference that connects a row to another table."],
  ["07", "Schema", "The logical structure that defines tables, relationships, constraints and other database objects."],
  ["08", "Constraint", "A rule that protects data integrity, such as NOT NULL, UNIQUE or CHECK."],
];

const commandGroups = [
  {
    title: "DQL — Query data",
    tag: "READ",
    items: [
      ["SELECT", "Retrieve columns and expressions.", "SELECT name, salary FROM employees;"],
      ["WHERE", "Filter rows before grouping.", "SELECT * FROM employees WHERE salary > 50000;"],
      ["ORDER BY", "Sort the result.", "SELECT * FROM employees ORDER BY salary DESC;"],
      ["DISTINCT", "Remove duplicate result rows.", "SELECT DISTINCT department FROM employees;"],
      ["LIMIT / FETCH", "Restrict the number of rows returned.", "SELECT * FROM employees LIMIT 10;"],
    ],
  },
  {
    title: "DML — Change data",
    tag: "WRITE",
    items: [
      ["INSERT", "Add new rows.", "INSERT INTO employees (name, salary) VALUES ('Asha', 60000);"],
      ["UPDATE", "Change existing rows.", "UPDATE employees SET salary = 65000 WHERE id = 7;"],
      ["DELETE", "Remove rows.", "DELETE FROM employees WHERE id = 7;"],
      ["MERGE", "Combine insert/update logic where supported.", "MERGE INTO target USING source ON target.id = source.id ...;"],
    ],
  },
  {
    title: "DDL — Define structure",
    tag: "SCHEMA",
    items: [
      ["CREATE", "Create database objects.", "CREATE TABLE employees (id INT PRIMARY KEY, name VARCHAR(100));"],
      ["ALTER", "Change an existing object.", "ALTER TABLE employees ADD COLUMN email VARCHAR(200);"],
      ["DROP", "Remove an object.", "DROP TABLE old_employees;"],
      ["TRUNCATE", "Remove all rows while retaining the table structure.", "TRUNCATE TABLE staging;"],
    ],
  },
  {
    title: "DCL / TCL — Access & transactions",
    tag: "CONTROL",
    items: [
      ["GRANT", "Give privileges.", "GRANT SELECT ON employees TO analyst;"],
      ["REVOKE", "Remove privileges.", "REVOKE UPDATE ON employees FROM analyst;"],
      ["COMMIT", "Make a transaction's changes durable.", "COMMIT;"],
      ["ROLLBACK", "Undo uncommitted transaction work.", "ROLLBACK;"],
      ["SAVEPOINT", "Create a transaction rollback point.", "SAVEPOINT before_update;"],
    ],
  },
];

const clauses = [
  ["FROM", "Choose the source table(s).", "FROM employees"],
  ["JOIN ... ON", "Combine related rows from multiple tables.", "JOIN departments d ON e.department_id = d.id"],
  ["WHERE", "Filter individual source rows.", "WHERE salary >= 50000"],
  ["GROUP BY", "Form groups for aggregate calculations.", "GROUP BY department_id"],
  ["HAVING", "Filter groups after aggregation.", "HAVING AVG(salary) > 60000"],
  ["SELECT", "Choose the final expressions/columns.", "SELECT department_id, AVG(salary)"],
  ["DISTINCT", "Remove duplicate final rows.", "SELECT DISTINCT city"],
  ["ORDER BY", "Sort the result.", "ORDER BY AVG(salary) DESC"],
  ["LIMIT / FETCH", "Restrict returned rows where supported.", "LIMIT 10"],
];

const joins = [
  ["INNER JOIN", "Only matching rows from both sides.", "SELECT e.name, d.name FROM employees e INNER JOIN departments d ON e.department_id = d.id;"],
  ["LEFT JOIN", "All rows from the left table plus matching rows on the right.", "SELECT e.name, d.name FROM employees e LEFT JOIN departments d ON e.department_id = d.id;"],
  ["RIGHT JOIN", "All rows from the right table plus matching rows on the left.", "SELECT e.name, d.name FROM employees e RIGHT JOIN departments d ON e.department_id = d.id;"],
  ["FULL OUTER JOIN", "All rows from both sides, matched where possible.", "SELECT * FROM A FULL OUTER JOIN B ON A.id = B.id;"],
  ["CROSS JOIN", "Cartesian product: every left row paired with every right row.", "SELECT * FROM colors CROSS JOIN sizes;"],
  ["SELF JOIN", "Join a table to itself using aliases.", "SELECT e.name, m.name FROM employees e JOIN employees m ON e.manager_id = m.id;"],
];

const functions = [
  ["COUNT()", "Count rows or non-null values.", "COUNT(*)"],
  ["SUM()", "Add numeric values.", "SUM(amount)"],
  ["AVG()", "Calculate an average.", "AVG(salary)"],
  ["MIN()", "Find the smallest value.", "MIN(price)"],
  ["MAX()", "Find the largest value.", "MAX(price)"],
  ["COALESCE()", "Return the first non-null expression.", "COALESCE(phone, 'N/A')"],
  ["NULLIF()", "Return NULL when two expressions are equal.", "NULLIF(score, 0)"],
  ["CASE", "Implement conditional expressions.", "CASE WHEN salary > 80000 THEN 'Senior' ELSE 'Other' END"],
];

const advanced = [
  ["Subqueries", "A query nested inside another query.", "SELECT name FROM employees WHERE salary > (SELECT AVG(salary) FROM employees);"],
  ["CTEs", "Named query blocks introduced with WITH, useful for readable multi-step logic.", "WITH high_paid AS (...) SELECT * FROM high_paid;"],
  ["Window Functions", "Calculate across related rows without collapsing them into groups.", "AVG(salary) OVER (PARTITION BY department_id)"],
  ["Set Operators", "Combine compatible query results.", "SELECT city FROM customers UNION SELECT city FROM suppliers;"],
  ["Views", "Store a reusable query definition as a database object.", "CREATE VIEW active_users AS SELECT ...;"],
  ["Indexes", "Data structures that can accelerate selected access patterns, with storage/write trade-offs.", "CREATE INDEX idx_email ON users(email);"],
  ["Transactions", "Group multiple changes into an atomic unit of work.", "BEGIN; UPDATE ...; COMMIT;"],
  ["Constraints", "Enforce integrity at the database layer.", "CHECK (salary >= 0)"],
  ["Stored Procedures", "Server-side routines supported by many SQL database systems.", "CREATE PROCEDURE ..."],
  ["Triggers", "Database actions automatically invoked by defined events where supported.", "CREATE TRIGGER ..."],
];

const applications = [
  ["Web & SaaS", "Users, authentication records, products, orders, subscriptions and application state."],
  ["Banking & FinTech", "Accounts, transactions, ledgers, payments, compliance and reporting."],
  ["E-commerce", "Catalogs, inventory, carts, orders, customers, pricing and fulfillment."],
  ["Analytics", "Dashboards, KPIs, aggregations, cohort analysis and business reporting."],
  ["Data Engineering", "ETL/ELT pipelines, staging tables, transformations and data quality checks."],
  ["Data Science", "Feature extraction, dataset preparation, exploration and analytical workloads."],
  ["Healthcare", "Structured records, scheduling, billing, inventory and operational reporting, subject to applicable privacy controls."],
  ["Education", "Students, courses, assessments, attendance, learning activity and reporting."],
  ["Logistics", "Routes, shipments, warehouses, drivers, inventory and delivery events."],
  ["Gaming", "Players, inventories, scores, sessions, purchases and game telemetry."],
];

const timeline = [
  ["1970", "Relational model", "E. F. Codd published the relational model that became foundational to modern relational database systems."],
  ["1974", "SEQUEL", "IBM researchers Donald Chamberlin and Raymond Boyce published work on SEQUEL, the predecessor of SQL."],
  ["1977–79", "Commercial era", "Relational Software, later Oracle, developed and commercially shipped a relational SQL implementation."],
  ["1983", "DB2", "IBM shipped DB2, helping establish SQL-based relational databases in enterprise computing."],
  ["1986–87", "Standardization", "ANSI standardized SQL in 1986; ISO followed with an SQL standard in 1987."],
  ["1992", "SQL-92", "The SQL standard was substantially expanded, including richer query and data-definition capabilities."],
  ["1999+", "Modern SQL", "Later revisions added features such as recursive queries, windowing and richer data capabilities."],
  ["2023", "SQL:2023", "SQL:2023 is the current standard referenced by the University of Edinburgh's 2026 database course material."],
];

const roadmap = [
  "Relational model",
  "Tables & keys",
  "SELECT",
  "Filtering",
  "Sorting",
  "Grouping",
  "JOINs",
  "Subqueries",
  "CTEs",
  "Window functions",
  "Transactions",
  "Indexes",
  "Design & normalization",
  "Query optimization",
  "Production SQL",
];

export default function LearnPage() {
  const pageRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const root = pageRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("is-visible");
        });
      },
      { threshold: 0.12 }
    );

    root.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <main ref={pageRef} className="learn-page">
      <style jsx global>{`
        :root {
          --lw-bg: #07090b;
          --lw-panel: #0d1114;
          --lw-panel-2: #11171b;
          --lw-text: #eef2f3;
          --lw-muted: #879198;
          --lw-line: rgba(255,255,255,.10);
          --lw-accent: #8fe7bd;
          --lw-accent-2: #7cc7ff;
        }

        * { box-sizing: border-box; }

        html { scroll-behavior: smooth; }

        body {
          margin: 0;
          background: var(--lw-bg);
          color: var(--lw-text);
        }

        .learn-page {
          min-height: 100vh;
          overflow: hidden;
          background:
            radial-gradient(circle at 80% 10%, rgba(124,199,255,.10), transparent 30%),
            radial-gradient(circle at 10% 25%, rgba(143,231,189,.07), transparent 28%),
            var(--lw-bg);
          font-family: Arial, Helvetica, sans-serif;
        }

        .learn-page a { color: inherit; text-decoration: none; }

        .learn-nav {
          position: sticky;
          top: 0;
          z-index: 50;
          height: 72px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 5vw;
          border-bottom: 1px solid var(--lw-line);
          background: rgba(7,9,11,.78);
          backdrop-filter: blur(18px);
        }

        .learn-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: 800;
          letter-spacing: -.04em;
        }

        .learn-mark {
          width: 34px;
          height: 34px;
          border: 1px solid var(--lw-line);
          display: grid;
          place-items: center;
          border-radius: 9px;
          font: 700 11px/1 monospace;
          color: var(--lw-accent);
          background: #0b1111;
        }

        .learn-nav-links {
          display: flex;
          gap: 24px;
          color: var(--lw-muted);
          font: 11px/1 monospace;
          text-transform: uppercase;
          letter-spacing: .12em;
        }

        .learn-nav-links a:hover { color: #fff; }

        .hero {
          min-height: calc(100vh - 72px);
          padding: 10vh 6vw 8vh;
          display: grid;
          grid-template-columns: 1.25fr .75fr;
          gap: 7vw;
          align-items: center;
          position: relative;
        }

        .eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          color: var(--lw-muted);
          font: 10px/1 monospace;
          letter-spacing: .2em;
          text-transform: uppercase;
        }

        .eyebrow::before {
          content: "";
          width: 34px;
          height: 1px;
          background: var(--lw-accent);
        }

        .hero h1 {
          margin: 24px 0;
          max-width: 950px;
          font-size: clamp(64px, 10vw, 150px);
          line-height: .84;
          letter-spacing: -.085em;
          font-weight: 800;
        }

        .hero h1 span {
          color: transparent;
          -webkit-text-stroke: 1px rgba(255,255,255,.55);
        }

        .hero-copy {
          max-width: 620px;
          color: var(--lw-muted);
          font-size: clamp(17px, 2vw, 23px);
          line-height: 1.55;
        }

        .hero-meta {
          margin-top: 42px;
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .pill {
          padding: 11px 14px;
          border: 1px solid var(--lw-line);
          color: #aab3b8;
          background: rgba(255,255,255,.025);
          font: 10px/1 monospace;
          text-transform: uppercase;
          letter-spacing: .13em;
        }

        .hero-visual {
          min-height: 500px;
          position: relative;
          display: grid;
          place-items: center;
        }

        .orb {
          width: min(38vw, 440px);
          aspect-ratio: 1;
          border-radius: 50%;
          border: 1px solid rgba(143,231,189,.30);
          box-shadow: 0 0 100px rgba(143,231,189,.08), inset 0 0 70px rgba(124,199,255,.05);
          animation: float 7s ease-in-out infinite;
          position: relative;
        }

        .orb::before, .orb::after {
          content: "";
          position: absolute;
          inset: 12%;
          border-radius: 50%;
          border: 1px dashed rgba(255,255,255,.15);
          animation: spin 18s linear infinite;
        }

        .orb::after {
          inset: 25%;
          border-style: solid;
          border-color: rgba(124,199,255,.18) transparent;
          animation-direction: reverse;
          animation-duration: 12s;
        }

        .orb-code {
          position: absolute;
          inset: 0;
          display: grid;
          place-items: center;
          font: 700 clamp(13px, 1.5vw, 18px)/1.7 monospace;
          color: var(--lw-accent);
          text-align: center;
        }

        .section {
          padding: 13vh 6vw;
          border-top: 1px solid var(--lw-line);
        }

        .section-head {
          display: flex;
          justify-content: space-between;
          gap: 40px;
          align-items: end;
          margin-bottom: 70px;
        }

        .section-head h2 {
          margin: 12px 0 0;
          max-width: 850px;
          font-size: clamp(44px, 7vw, 100px);
          line-height: .88;
          letter-spacing: -.07em;
        }

        .section-head p {
          max-width: 380px;
          color: var(--lw-muted);
          line-height: 1.7;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          border-top: 1px solid var(--lw-line);
          border-left: 1px solid var(--lw-line);
        }

        .card {
          min-height: 230px;
          padding: 28px;
          border-right: 1px solid var(--lw-line);
          border-bottom: 1px solid var(--lw-line);
          background: rgba(255,255,255,.018);
          transition: transform .4s ease, background .4s ease;
        }

        .card:hover {
          transform: translateY(-6px);
          background: rgba(143,231,189,.035);
        }

        .number {
          color: #4e5b61;
          font: 11px/1 monospace;
        }

        .card h3 {
          margin: 55px 0 12px;
          font-size: 22px;
          letter-spacing: -.03em;
        }

        .card p {
          margin: 0;
          color: var(--lw-muted);
          line-height: 1.65;
          font-size: 14px;
        }

        .timeline {
          position: relative;
          display: grid;
          gap: 0;
        }

        .timeline::before {
          content: "";
          position: absolute;
          left: 88px;
          top: 0;
          bottom: 0;
          width: 1px;
          background: var(--lw-line);
        }

        .time-row {
          display: grid;
          grid-template-columns: 140px 1fr;
          gap: 70px;
          padding: 38px 0;
          border-bottom: 1px solid var(--lw-line);
          position: relative;
        }

        .time-year {
          color: var(--lw-accent);
          font: 700 12px/1.4 monospace;
          letter-spacing: .08em;
        }

        .time-content h3 {
          margin: 0 0 10px;
          font-size: 28px;
          letter-spacing: -.04em;
        }

        .time-content p {
          margin: 0;
          max-width: 720px;
          color: var(--lw-muted);
          line-height: 1.7;
        }

        .query-section {
          background: #090c0f;
        }

        .command-group {
          margin-bottom: 80px;
        }

        .group-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--lw-line);
          padding-bottom: 18px;
          margin-bottom: 0;
        }

        .group-head h3 {
          margin: 0;
          font-size: 28px;
          letter-spacing: -.04em;
        }

        .tag {
          color: var(--lw-accent);
          font: 10px monospace;
          letter-spacing: .16em;
        }

        .query-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
        }

        .query-card {
          padding: 26px 0;
          border-bottom: 1px solid var(--lw-line);
          display: grid;
          grid-template-columns: 150px 1fr;
          gap: 30px;
        }

        .query-card strong {
          font: 700 14px monospace;
          color: #fff;
        }

        .query-card p {
          margin: 0 0 13px;
          color: var(--lw-muted);
          line-height: 1.55;
          font-size: 14px;
        }

        pre {
          margin: 0;
          overflow-x: auto;
          padding: 15px;
          background: #050708;
          border: 1px solid rgba(255,255,255,.07);
          color: #bdeed6;
          font: 12px/1.7 monospace;
        }

        .clauses {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          border-left: 1px solid var(--lw-line);
          border-top: 1px solid var(--lw-line);
        }

        .clause {
          padding: 24px;
          border-right: 1px solid var(--lw-line);
          border-bottom: 1px solid var(--lw-line);
        }

        .clause strong {
          color: var(--lw-accent-2);
          font: 700 13px monospace;
        }

        .clause p {
          color: var(--lw-muted);
          line-height: 1.6;
          min-height: 55px;
        }

        .code-strip {
          margin-top: 40px;
          padding: 28px;
          border: 1px solid var(--lw-line);
          background: #050708;
          overflow: auto;
        }

        .join-list, .advanced-list {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          border-top: 1px solid var(--lw-line);
          border-left: 1px solid var(--lw-line);
        }

        .join-item, .advanced-item {
          padding: 30px;
          border-right: 1px solid var(--lw-line);
          border-bottom: 1px solid var(--lw-line);
        }

        .join-item h3, .advanced-item h3 {
          margin: 0 0 10px;
          font-size: 22px;
        }

        .join-item p, .advanced-item p {
          color: var(--lw-muted);
          line-height: 1.65;
        }

        .application-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          border-top: 1px solid var(--lw-line);
          border-left: 1px solid var(--lw-line);
        }

        .application {
          min-height: 220px;
          padding: 25px;
          border-right: 1px solid var(--lw-line);
          border-bottom: 1px solid var(--lw-line);
        }

        .application h3 {
          margin: 50px 0 12px;
          font-size: 19px;
        }

        .application p {
          margin: 0;
          color: var(--lw-muted);
          line-height: 1.6;
          font-size: 13px;
        }

        .roadmap {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 35px;
        }

        .roadmap span {
          padding: 14px 17px;
          border: 1px solid var(--lw-line);
          background: rgba(255,255,255,.02);
          color: #aab3b8;
          font: 11px monospace;
          transition: .3s ease;
        }

        .roadmap span:hover {
          color: #fff;
          border-color: rgba(143,231,189,.45);
          transform: translateY(-3px);
        }

        .final {
          min-height: 80vh;
          display: grid;
          place-items: center;
          text-align: center;
          padding: 10vh 6vw;
          border-top: 1px solid var(--lw-line);
        }

        .final h2 {
          margin: 18px auto;
          max-width: 1000px;
          font-size: clamp(55px, 9vw, 140px);
          line-height: .86;
          letter-spacing: -.08em;
        }

        .final h2 span {
          color: transparent;
          -webkit-text-stroke: 1px rgba(255,255,255,.5);
        }

        .final p {
          max-width: 580px;
          margin: 0 auto 32px;
          color: var(--lw-muted);
          line-height: 1.7;
        }

        .cta {
          display: inline-flex;
          align-items: center;
          gap: 14px;
          padding: 15px 20px;
          border: 1px solid rgba(143,231,189,.4);
          color: var(--lw-accent);
          font: 11px monospace;
          text-transform: uppercase;
          letter-spacing: .12em;
          transition: .3s ease;
        }

        .cta:hover {
          background: var(--lw-accent);
          color: #07100c;
          transform: translateY(-4px);
        }

        .reveal {
          opacity: 0;
          transform: translateY(55px);
          transition: opacity .9s cubic-bezier(.2,.8,.2,1), transform .9s cubic-bezier(.2,.8,.2,1);
        }

        .reveal.is-visible {
          opacity: 1;
          transform: translateY(0);
        }

        .reveal-delay-1 { transition-delay: .08s; }
        .reveal-delay-2 { transition-delay: .16s; }
        .reveal-delay-3 { transition-delay: .24s; }

        .marquee {
          border-top: 1px solid var(--lw-line);
          border-bottom: 1px solid var(--lw-line);
          overflow: hidden;
          white-space: nowrap;
          padding: 22px 0;
          color: #4f5a60;
          font: 700 12px monospace;
          letter-spacing: .18em;
        }

        .marquee-track {
          display: inline-block;
          animation: marquee 28s linear infinite;
        }

        @keyframes marquee {
          to { transform: translateX(-50%); }
        }

        @keyframes float {
          0%,100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-18px) rotate(2deg); }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 1000px) {
          .hero { grid-template-columns: 1fr; }
          .hero-visual { min-height: 360px; }
          .orb { width: min(65vw, 400px); }
          .grid { grid-template-columns: repeat(2, 1fr); }
          .application-grid { grid-template-columns: repeat(2, 1fr); }
          .clauses { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 720px) {
          .learn-nav { padding: 0 20px; }
          .learn-nav-links { display: none; }
          .hero, .section { padding-left: 22px; padding-right: 22px; }
          .hero { padding-top: 80px; }
          .section-head { display: block; margin-bottom: 45px; }
          .grid, .query-grid, .join-list, .advanced-list,
          .application-grid, .clauses { grid-template-columns: 1fr; }
          .card { min-height: 190px; }
          .query-card { grid-template-columns: 1fr; gap: 12px; }
          .timeline::before { display: none; }
          .time-row { grid-template-columns: 1fr; gap: 10px; }
          .time-content h3 { font-size: 23px; }
          .orb { width: 75vw; }
        }

        @media (prefers-reduced-motion: reduce) {
          html { scroll-behavior: auto; }
          *, *::before, *::after {
            animation-duration: .001ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: .001ms !important;
          }
          .reveal {
            opacity: 1;
            transform: none;
          }
        }
      `}</style>

      <nav className="learn-nav">
        <Link href="/" className="learn-brand">
          <span className="learn-mark">SQL</span>
          <span>SQLWhale / Learn</span>
        </Link>

        <div className="learn-nav-links">
          <a href="#history">History</a>
          <a href="#concepts">Concepts</a>
          <a href="#queries">Queries</a>
          <a href="#joins">Joins</a>
          <a href="#advanced">Advanced</a>
          <a href="#applications">Applications</a>
        </div>
      </nav>

      <section className="hero">
        <div className="reveal">
          <div className="eyebrow">SQL / KNOWLEDGE SYSTEM</div>
          <h1>
            Learn SQL.
            <br />
            <span>See the system.</span>
          </h1>
          <p className="hero-copy">
            One interactive reference for SQL fundamentals, commands, clauses,
            joins, functions, subqueries, CTEs, windows, transactions,
            database design, applications and the history of the language.
          </p>

          <div className="hero-meta">
            <span className="pill">Beginner → Advanced</span>
            <span className="pill">Query Reference</span>
            <span className="pill">Database Thinking</span>
          </div>
        </div>

        <div className="hero-visual reveal reveal-delay-2">
          <div className="orb">
            <div className="orb-code">
              SELECT<br />
              FROM<br />
              WHERE<br />
              JOIN<br />
              GROUP BY<br />
              ORDER BY
            </div>
          </div>
        </div>
      </section>

      <div className="marquee">
        <div className="marquee-track">
          SQL • DATA • TABLES • QUERIES • RELATIONS • JOINS • AGGREGATION •
          TRANSACTIONS • INDEXES • SQL • DATA • TABLES • QUERIES • RELATIONS •
          JOINS • AGGREGATION • TRANSACTIONS • INDEXES •
        </div>
      </div>

      <section id="history" className="section">
        <div className="section-head reveal">
          <div>
            <div className="eyebrow">01 / ORIGIN</div>
            <h2>From relational theory to modern SQL.</h2>
          </div>
          <p>
            SQL grew from the relational model and IBM research in the 1970s,
            then became standardized and widely implemented across relational
            database systems.
          </p>
        </div>

        <div className="timeline">
          {timeline.map(([year, title, text], index) => (
            <article className={`time-row reveal reveal-delay-${(index % 3) + 1}`} key={year}>
              <div className="time-year">{year}</div>
              <div className="time-content">
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="concepts" className="section">
        <div className="section-head reveal">
          <div>
            <div className="eyebrow">02 / FOUNDATIONS</div>
            <h2>Understand the objects before the queries.</h2>
          </div>
          <p>
            SQL becomes easier when tables, keys, relationships, schemas and
            constraints are treated as a system rather than isolated syntax.
          </p>
        </div>

        <div className="grid">
          {concepts.map(([number, title, text]) => (
            <article className="card reveal" key={title}>
              <div className="number">{number}</div>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="queries" className="section query-section">
        <div className="section-head reveal">
          <div>
            <div className="eyebrow">03 / QUERY LANGUAGE</div>
            <h2>The SQL command map.</h2>
          </div>
          <p>
            SQL statements are commonly discussed by the kind of work they
            perform: reading data, changing rows, defining structure and
            controlling access or transactions.
          </p>
        </div>

        {commandGroups.map((group) => (
          <div className="command-group reveal" key={group.title}>
            <div className="group-head">
              <h3>{group.title}</h3>
              <span className="tag">{group.tag}</span>
            </div>

            <div className="query-grid">
              {group.items.map(([name, description, example]) => (
                <article className="query-card" key={name}>
                  <strong>{name}</strong>
                  <div>
                    <p>{description}</p>
                    <pre>{example}</pre>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ))}

        <div className="reveal">
          <div className="eyebrow">SELECT PIPELINE</div>
          <div className="clauses" style={{ marginTop: 24 }}>
            {clauses.map(([name, description, example]) => (
              <article className="clause" key={name}>
                <strong>{name}</strong>
                <p>{description}</p>
                <pre>{example}</pre>
              </article>
            ))}
          </div>
        </div>

        <div className="code-strip reveal">
          <pre>{`SELECT
    d.name AS department,
    COUNT(*) AS people,
    AVG(e.salary) AS avg_salary
FROM employees e
JOIN departments d
    ON e.department_id = d.id
WHERE e.active = TRUE
GROUP BY d.name
HAVING AVG(e.salary) > 50000
ORDER BY avg_salary DESC;`}</pre>
        </div>
      </section>

      <section id="joins" className="section">
        <div className="section-head reveal">
          <div>
            <div className="eyebrow">04 / RELATIONSHIPS</div>
            <h2>JOINs: where tables become a data model.</h2>
          </div>
          <p>
            A JOIN combines rows from multiple table expressions according to
            a matching condition or join rule.
          </p>
        </div>

        <div className="join-list">
          {joins.map(([name, description, example]) => (
            <article className="join-item reveal" key={name}>
              <h3>{name}</h3>
              <p>{description}</p>
              <pre>{example}</pre>
            </article>
          ))}
        </div>
      </section>

      <section className="section query-section">
        <div className="section-head reveal">
          <div>
            <div className="eyebrow">05 / EXPRESSIONS</div>
            <h2>Functions, NULLs and conditional logic.</h2>
          </div>
          <p>
            Expressions let a query calculate, transform and classify values
            while returning or updating data.
          </p>
        </div>

        <div className="grid">
          {functions.map(([name, description, example]) => (
            <article className="card reveal" key={name}>
              <div className="number">FUNC</div>
              <h3>{name}</h3>
              <p>{description}</p>
              <pre style={{ marginTop: 18 }}>{example}</pre>
            </article>
          ))}
        </div>
      </section>

      <section id="advanced" className="section">
        <div className="section-head reveal">
          <div>
            <div className="eyebrow">06 / ADVANCED SQL</div>
            <h2>When simple queries stop being enough.</h2>
          </div>
          <p>
            Advanced SQL combines query composition, analytics, reusable
            definitions, integrity and performance techniques.
          </p>
        </div>

        <div className="advanced-list">
          {advanced.map(([name, description, example]) => (
            <article className="advanced-item reveal" key={name}>
              <h3>{name}</h3>
              <p>{description}</p>
              <pre>{example}</pre>
            </article>
          ))}
        </div>
      </section>

      <section className="section query-section">
        <div className="section-head reveal">
          <div>
            <div className="eyebrow">07 / DESIGN</div>
            <h2>Good SQL starts before the first SELECT.</h2>
          </div>
          <p>
            Database design affects correctness, maintainability and query
            performance. Learn normalization, keys, constraints and indexing
            before optimizing syntax.
          </p>
        </div>

        <div className="grid">
          {[
            ["Normalization", "Reduce inappropriate redundancy and update anomalies by structuring related data."],
            ["1NF", "Atomic values and a tabular structure without repeating groups."],
            ["2NF", "1NF plus removal of partial dependency on a composite key."],
            ["3NF", "2NF plus removal of relevant transitive dependencies."],
            ["Indexes", "Speed selected reads by maintaining additional access structures at storage cost."],
            ["Transactions", "Use atomic units of work with COMMIT and ROLLBACK semantics."],
            ["ACID", "Atomicity, consistency, isolation and durability are core transaction properties."],
            ["Query Plans", "The database optimizer chooses an execution strategy based on statistics, indexes and other factors."],
          ].map(([title, text], index) => (
            <article className="card reveal" key={title}>
              <div className="number">{String(index + 1).padStart(2, "0")}</div>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="applications" className="section">
        <div className="section-head reveal">
          <div>
            <div className="eyebrow">08 / REAL WORLD</div>
            <h2>SQL is the data layer behind many systems.</h2>
          </div>
          <p>
            Relational databases are used across application development,
            finance, commerce, analytics, engineering and many operational
            systems.
          </p>
        </div>

        <div className="application-grid">
          {applications.map(([title, text], index) => (
            <article className="application reveal" key={title}>
              <div className="number">{String(index + 1).padStart(2, "0")}</div>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section query-section">
        <div className="section-head reveal">
          <div>
            <div className="eyebrow">09 / LEARNING PATH</div>
            <h2>Build from rows to real systems.</h2>
          </div>
          <p>
            Use this sequence as a practical route from basic retrieval to
            production database thinking.
          </p>
        </div>

        <div className="roadmap reveal">
          {roadmap.map((item, index) => (
            <span key={item}>
              {String(index + 1).padStart(2, "0")} / {item}
            </span>
          ))}
        </div>
      </section>

      <section className="final">
        <div className="reveal">
          <div className="eyebrow">NEXT / EXPERIENCE SQL</div>
          <h2>
            Don't just read SQL.
            <br />
            <span>Watch it execute.</span>
          </h2>
          <p>
            SQLWhale turns query execution into a visual learning process.
            Write a query, run it and follow what happens to the data.
          </p>
          <Link href="/run-query" className="cta">
            Open SQLWhale Query Lab →
          </Link>
        </div>
      </section>
    </main>
  );
}
