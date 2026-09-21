"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type QuerySection = {
  id: string;
  number: string;
  title: string;
  short: string;
  color: string;
};

const QUERY_SECTIONS: QuerySection[] = [
  {
    id: "select",
    number: "01",
    title: "SELECT",
    short: "Read data from a table",
    color: "#3478ed",
  },
  {
    id: "where",
    number: "02",
    title: "WHERE",
    short: "Filter rows",
    color: "#06a6c7",
  },
  {
    id: "distinct",
    number: "03",
    title: "DISTINCT",
    short: "Remove duplicate values",
    color: "#7c5cff",
  },
  {
    id: "order-by",
    number: "04",
    title: "ORDER BY",
    short: "Sort the result",
    color: "#ef8b35",
  },
  {
    id: "limit",
    number: "05",
    title: "LIMIT",
    short: "Restrict returned rows",
    color: "#18a875",
  },
  {
    id: "group-by",
    number: "06",
    title: "GROUP BY",
    short: "Create row groups",
    color: "#9b59b6",
  },
  {
    id: "having",
    number: "07",
    title: "HAVING",
    short: "Filter grouped results",
    color: "#d05c7b",
  },
  {
    id: "joins",
    number: "08",
    title: "JOIN",
    short: "Combine related tables",
    color: "#3478ed",
  },
  {
    id: "aggregate",
    number: "09",
    title: "AGGREGATES",
    short: "Calculate values from rows",
    color: "#06a6c7",
  },
  {
    id: "case",
    number: "10",
    title: "CASE",
    short: "Create conditional values",
    color: "#ef8b35",
  },
  {
    id: "subqueries",
    number: "11",
    title: "SUBQUERIES",
    short: "Query inside another query",
    color: "#7c5cff",
  },
  {
    id: "cte",
    number: "12",
    title: "CTE",
    short: "Build reusable query blocks",
    color: "#18a875",
  },
  {
    id: "window",
    number: "13",
    title: "WINDOW",
    short: "Analyze rows without collapsing them",
    color: "#3478ed",
  },
  {
    id: "insert",
    number: "14",
    title: "INSERT",
    short: "Add new rows",
    color: "#06a6c7",
  },
  {
    id: "update",
    number: "15",
    title: "UPDATE",
    short: "Modify existing rows",
    color: "#ef8b35",
  },
  {
    id: "delete",
    number: "16",
    title: "DELETE",
    short: "Remove rows",
    color: "#d05c7b",
  },
  {
    id: "create",
    number: "17",
    title: "CREATE TABLE",
    short: "Create a new table",
    color: "#18a875",
  },
  {
    id: "alter",
    number: "18",
    title: "ALTER TABLE",
    short: "Change table structure",
    color: "#7c5cff",
  },
  {
    id: "drop",
    number: "19",
    title: "DROP TABLE",
    short: "Remove a table",
    color: "#d05c7b",
  },
  {
    id: "null",
    number: "20",
    title: "NULL",
    short: "Work with missing values",
    color: "#3478ed",
  },
];

/* =========================================================
   REUSABLE UI
========================================================= */

function CodeBlock({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="understand-code">
      <div className="code-topbar">
        <div className="code-dots">
          <span />
          <span />
          <span />
        </div>

        <span>SQL</span>
      </div>

      <pre>
        <code>{children}</code>
      </pre>
    </div>
  );
}

function Flow({
  items,
}: {
  items: string[];
}) {
  return (
    <div className="execution-flow">
      {items.map((item, index) => (
        <div
          className="flow-item-wrap"
          key={`${item}-${index}`}
        >
          <div className="flow-item">
            <span className="flow-number">
              {String(index + 1).padStart(2, "0")}
            </span>

            <span>{item}</span>
          </div>

          {index < items.length - 1 && (
            <div className="flow-arrow">
              →
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function InfoCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="understand-info-card">
      <div className="info-card-line" />
      <h4>{title}</h4>
      <p>{children}</p>
    </div>
  );
}

function SectionHeader({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="understand-section-header">
      <div className="section-index">
        {number}
      </div>

      <div>
        <span className="understand-eyebrow">
          SQL CONCEPT
        </span>

        <h2>{title}</h2>

        <p>{description}</p>
      </div>
    </div>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function UnderstandPage() {
  const [activeSection, setActiveSection] =
    useState("select");

  const [menuOpen, setMenuOpen] =
    useState(false);

  useEffect(() => {
    const observer =
      new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (
              entry.isIntersecting
            ) {
              setActiveSection(
                entry.target.id
              );
            }
          });
        },
        {
          rootMargin:
            "-20% 0px -65% 0px",
        }
      );

    QUERY_SECTIONS.forEach(
      (section) => {
        const element =
          document.getElementById(
            section.id
          );

        if (element) {
          observer.observe(element);
        }
      }
    );

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <main className="sqlwhale-understand">
      {/* =================================================
          NAVBAR
      ================================================= */}

      <header className="understand-navbar">
        <div className="understand-navbar-inner">
          <Link
            href="/"
            className="understand-logo"
          >
            <span className="understand-logo-mark">
              ◢
            </span>

            <span>
              SQLWhale
            </span>
          </Link>

          <nav className="understand-nav">
            <Link href="/">
              Home
            </Link>

            <Link href="/learn">
              Learn
            </Link>

            <Link
              href="/run-query"
            >
              Visualize
            </Link>

            <Link
              href="/understand"
              className="active"
            >
              Understand
            </Link>
          </nav>

          <Link
            href="/run-query"
            className="understand-run-button"
          >
            Run Query
            <span>→</span>
          </Link>

          <button
            className="mobile-menu-button"
            onClick={() =>
              setMenuOpen(
                !menuOpen
              )
            }
            aria-label="Toggle navigation"
          >
            {menuOpen
              ? "×"
              : "☰"}
          </button>
        </div>

        {menuOpen && (
          <div className="mobile-understand-menu">
            <Link href="/">
              Home
            </Link>

            <Link href="/learn">
              Learn
            </Link>

            <Link href="/run-query">
              Visualize
            </Link>

            <Link href="/understand">
              Understand
            </Link>
          </div>
        )}
      </header>

      {/* =================================================
          HERO
      ================================================= */}

      <section className="understand-hero">
        <div className="hero-grid-background" />

        <div className="hero-orb hero-orb-one" />
        <div className="hero-orb hero-orb-two" />

        <div className="understand-hero-inner">
          <div className="understand-hero-copy">
            <div className="understand-status">
              <span />
              SQL EXECUTION GUIDE
            </div>

            <h1>
              Don't just run SQL.
              <br />
              <span>
                Understand what happens.
              </span>
            </h1>

            <p>
              Explore SQL query execution
              step by step. Learn what each
              clause does, how databases
              process it, and why the order
              matters.
            </p>

            <div className="hero-actions">
              <a
                href="#select"
                className="hero-primary"
              >
                Start Understanding
                <span>↓</span>
              </a>

              <Link
                href="/run-query"
                className="hero-secondary"
              >
                Try a Query
                <span>→</span>
              </Link>
            </div>

            <div className="hero-stat-row">
              <div>
                <strong>20+</strong>
                <span>
                  SQL concepts
                </span>
              </div>

              <div className="hero-stat-divider" />

              <div>
                <strong>01</strong>
                <span>
                  Execution model
                </span>
              </div>

              <div className="hero-stat-divider" />

              <div>
                <strong>∞</strong>
                <span>
                  Queries to explore
                </span>
              </div>
            </div>
          </div>

          {/* Hero execution visual */}

          <div className="hero-execution">
            <div className="hero-execution-label">
              QUERY EXECUTION
            </div>

            <div className="hero-query-box">
              <span className="sql-keyword">
                SELECT
              </span>{" "}
              name, salary
              <br />
              <span className="sql-keyword">
                FROM
              </span>{" "}
              employees
              <br />
              <span className="sql-keyword">
                WHERE
              </span>{" "}
              salary &gt; 50000
              <br />
              <span className="sql-keyword">
                ORDER BY
              </span>{" "}
              salary DESC;
            </div>

            <Flow
              items={[
                "FROM",
                "WHERE",
                "SELECT",
                "ORDER",
                "RESULT",
              ]}
            />

            <div className="hero-result">
              <span className="result-dot" />
              Result produced
              <strong>4 rows</strong>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================
          SQL LOGICAL ORDER
      ================================================= */}

      <section className="logical-order-section">
        <div className="content-width">
          <div className="section-kicker">
            THE BIG PICTURE
          </div>

          <div className="logical-heading">
            <div>
              <h2>
                SQL is written one way.
                <br />
                <span>
                  It is logically processed another.
                </span>
              </h2>
            </div>

            <p>
              Understanding this distinction
              makes complex queries much easier
              to reason about.
            </p>
          </div>

          <div className="logical-order-grid">
            <div className="written-order">
              <span className="order-label">
                YOU WRITE
              </span>

              <div className="order-line">
                <b>01</b>
                SELECT
              </div>

              <div className="order-line">
                <b>02</b>
                FROM
              </div>

              <div className="order-line">
                <b>03</b>
                WHERE
              </div>

              <div className="order-line">
                <b>04</b>
                GROUP BY
              </div>

              <div className="order-line">
                <b>05</b>
                HAVING
              </div>

              <div className="order-line">
                <b>06</b>
                ORDER BY
              </div>

              <div className="order-line">
                <b>07</b>
                LIMIT
              </div>
            </div>

            <div className="logical-arrow">
              <span>
                DATABASE
                <br />
                PROCESSING
              </span>

              <div>→</div>
            </div>

            <div className="processed-order">
              <span className="order-label">
                LOGICAL ORDER
              </span>

              <div className="order-line active">
                <b>01</b>
                FROM
              </div>

              <div className="order-line active">
                <b>02</b>
                WHERE
              </div>

              <div className="order-line active">
                <b>03</b>
                GROUP BY
              </div>

              <div className="order-line active">
                <b>04</b>
                HAVING
              </div>

              <div className="order-line active">
                <b>05</b>
                SELECT
              </div>

              <div className="order-line active">
                <b>06</b>
                ORDER BY
              </div>

              <div className="order-line active">
                <b>07</b>
                LIMIT
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================
          SIDEBAR + CONTENT
      ================================================= */}

      <section className="understand-main">
        <div className="understand-layout">
          {/* Sticky navigation */}

          <aside className="understand-sidebar">
            <div className="sidebar-heading">
              <span>
                QUERY MAP
              </span>

              <small>
                20 concepts
              </small>
            </div>

            <div className="sidebar-list">
              {QUERY_SECTIONS.map(
                (section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className={
                      activeSection ===
                      section.id
                        ? "active"
                        : ""
                    }
                  >
                    <span
                      className="sidebar-number"
                      style={{
                        color:
                          section.color,
                      }}
                    >
                      {section.number}
                    </span>

                    <span>
                      <strong>
                        {section.title}
                      </strong>

                      <small>
                        {section.short}
                      </small>
                    </span>
                  </a>
                )
              )}
            </div>
          </aside>

          {/* Main content */}

          <div className="understand-content">
            {/* =================================================
                SELECT
            ================================================= */}

            <article
              id="select"
              className="understand-article"
            >
              <SectionHeader
                number="01"
                title="SELECT"
                description="The SELECT clause defines which columns or expressions you want in the final result."
              />

              <CodeBlock>
                {`SELECT name, salary
FROM employees;`}
              </CodeBlock>

              <Flow
                items={[
                  "employees",
                  "read rows",
                  "choose columns",
                  "result",
                ]}
              />

              <div className="article-grid">
                <InfoCard title="FROM">
                  FROM identifies the source
                  table or tables from which
                  the database reads data.
                </InfoCard>

                <InfoCard title="SELECT">
                  SELECT determines which
                  columns or expressions appear
                  in the final result.
                </InfoCard>

                <InfoCard title="Result">
                  The database returns a new
                  result set containing the
                  requested values.
                </InfoCard>
              </div>

              <div className="tip-box">
                <strong>
                  Think of SELECT as:
                </strong>

                <span>
                  "Which information do I want
                  to see?"
                </span>
              </div>
            </article>

            {/* =================================================
                WHERE
            ================================================= */}

            <article
              id="where"
              className="understand-article"
            >
              <SectionHeader
                number="02"
                title="WHERE"
                description="WHERE filters individual rows before they reach the final result."
              />

              <CodeBlock>
                {`SELECT name, salary
FROM employees
WHERE salary > 50000;`}
              </CodeBlock>

              <Flow
                items={[
                  "table",
                  "check condition",
                  "keep matching rows",
                  "SELECT",
                  "result",
                ]}
              />

              <div className="article-grid">
                <InfoCard title="Row by row">
                  The condition is evaluated
                  against rows from the source
                  data.
                </InfoCard>

                <InfoCard title="TRUE">
                  Rows for which the condition
                  evaluates to true continue
                  through the query.
                </InfoCard>

                <InfoCard title="FALSE">
                  Rows that do not satisfy the
                  condition are excluded.
                </InfoCard>
              </div>

              <div className="tip-box warning">
                <strong>
                  Important:
                </strong>

                <span>
                  WHERE filters rows before
                  GROUP BY and before the final
                  SELECT projection.
                </span>
              </div>
            </article>

            {/* =================================================
                DISTINCT
            ================================================= */}

            <article
              id="distinct"
              className="understand-article"
            >
              <SectionHeader
                number="03"
                title="DISTINCT"
                description="DISTINCT removes duplicate combinations from the selected result."
              />

              <CodeBlock>
                {`SELECT DISTINCT department
FROM employees;`}
              </CodeBlock>

              <Flow
                items={[
                  "read rows",
                  "SELECT column",
                  "remove duplicates",
                  "result",
                ]}
              />

              <div className="article-grid">
                <InfoCard title="Without DISTINCT">
                  Repeated values can appear
                  multiple times in the result.
                </InfoCard>

                <InfoCard title="With DISTINCT">
                  Duplicate result combinations
                  are eliminated.
                </InfoCard>
              </div>
            </article>

            {/* =================================================
                ORDER BY
            ================================================= */}

            <article
              id="order-by"
              className="understand-article"
            >
              <SectionHeader
                number="04"
                title="ORDER BY"
                description="ORDER BY sorts the rows in the result according to one or more expressions."
              />

              <CodeBlock>
                {`SELECT name, salary
FROM employees
ORDER BY salary DESC;`}
              </CodeBlock>

              <Flow
                items={[
                  "read rows",
                  "select result",
                  "sort",
                  "return rows",
                ]}
              />

              <div className="article-grid">
                <InfoCard title="ASC">
                  Sorts values in ascending
                  order.
                </InfoCard>

                <InfoCard title="DESC">
                  Sorts values in descending
                  order.
                </InfoCard>

                <InfoCard title="Multiple columns">
                  You can specify multiple
                  ordering expressions to define
                  secondary sorting.
                </InfoCard>
              </div>
            </article>

            {/* =================================================
                LIMIT
            ================================================= */}

            <article
              id="limit"
              className="understand-article"
            >
              <SectionHeader
                number="05"
                title="LIMIT"
                description="LIMIT restricts how many rows are returned by the query."
              />

              <CodeBlock>
                {`SELECT *
FROM employees
ORDER BY salary DESC
LIMIT 5;`}
              </CodeBlock>

              <Flow
                items={[
                  "read",
                  "sort",
                  "limit rows",
                  "result",
                ]}
              />

              <div className="tip-box">
                <strong>
                  Common use:
                </strong>

                <span>
                  Pagination, previews, top-N
                  queries and result exploration.
                </span>
              </div>
            </article>

            {/* =================================================
                GROUP BY
            ================================================= */}

            <article
              id="group-by"
              className="understand-article"
            >
              <SectionHeader
                number="06"
                title="GROUP BY"
                description="GROUP BY divides rows into groups that can be summarized with aggregate functions."
              />

              <CodeBlock>
                {`SELECT department, COUNT(*)
FROM employees
GROUP BY department;`}
              </CodeBlock>

              <Flow
                items={[
                  "read rows",
                  "create groups",
                  "aggregate",
                  "result",
                ]}
              />

              <div className="article-grid">
                <InfoCard title="Group key">
                  The GROUP BY expression
                  determines which rows belong
                  together.
                </InfoCard>

                <InfoCard title="Aggregate">
                  Functions such as COUNT,
                  SUM, AVG, MIN and MAX can
                  summarize each group.
                </InfoCard>

                <InfoCard title="One row per group">
                  The result normally contains
                  one output row for each group.
                </InfoCard>
              </div>
            </article>

            {/* =================================================
                HAVING
            ================================================= */}

            <article
              id="having"
              className="understand-article"
            >
              <SectionHeader
                number="07"
                title="HAVING"
                description="HAVING filters groups after GROUP BY and aggregation."
              />

              <CodeBlock>
                {`SELECT department, COUNT(*)
FROM employees
GROUP BY department
HAVING COUNT(*) > 5;`}
              </CodeBlock>

              <Flow
                items={[
                  "rows",
                  "GROUP BY",
                  "aggregate",
                  "HAVING",
                  "result",
                ]}
              />

              <div className="tip-box warning">
                <strong>
                  WHERE vs HAVING:
                </strong>

                <span>
                  WHERE filters individual rows;
                  HAVING filters grouped results.
                </span>
              </div>
            </article>

            {/* =================================================
                JOIN
            ================================================= */}

            <article
              id="joins"
              className="understand-article"
            >
              <SectionHeader
                number="08"
                title="JOIN"
                description="JOIN combines rows from multiple tables using a relationship between their columns."
              />

              <CodeBlock>
                {`SELECT
  employees.name,
  departments.department_name
FROM employees
JOIN departments
  ON employees.department = departments.department_name;`}
              </CodeBlock>

              <div className="join-visual">
                <div className="join-table">
                  <span>TABLE A</span>
                  <strong>
                    employees
                  </strong>
                  <small>
                    department
                  </small>
                </div>

                <div className="join-connector">
                  <span>
                    ON
                  </span>

                  <div />
                </div>

                <div className="join-table">
                  <span>TABLE B</span>
                  <strong>
                    departments
                  </strong>
                  <small>
                    department_name
                  </small>
                </div>
              </div>

              <div className="join-types">
                <div>
                  <strong>
                    INNER JOIN
                  </strong>

                  <span>
                    Matching rows from both
                    sides.
                  </span>
                </div>

                <div>
                  <strong>
                    LEFT JOIN
                  </strong>

                  <span>
                    All rows from the left
                    table plus matching rows.
                  </span>
                </div>

                <div>
                  <strong>
                    RIGHT JOIN
                  </strong>

                  <span>
                    All rows from the right
                    table plus matching rows.
                  </span>
                </div>

                <div>
                  <strong>
                    FULL JOIN
                  </strong>

                  <span>
                    Rows from both sides,
                    matched where possible.
                  </span>
                </div>
              </div>
            </article>

            {/* =================================================
                AGGREGATE
            ================================================= */}

            <article
              id="aggregate"
              className="understand-article"
            >
              <SectionHeader
                number="09"
                title="AGGREGATE FUNCTIONS"
                description="Aggregate functions calculate a value from a set of rows."
              />

              <CodeBlock>
                {`SELECT
  COUNT(*) AS employees,
  AVG(salary) AS average_salary,
  MAX(salary) AS highest_salary
FROM employees;`}
              </CodeBlock>

              <div className="aggregate-grid">
                {[
                  ["COUNT", "Counts rows or values"],
                  ["SUM", "Adds numeric values"],
                  ["AVG", "Calculates an average"],
                  ["MIN", "Finds the minimum"],
                  ["MAX", "Finds the maximum"],
                ].map(
                  ([name, description]) => (
                    <div
                      key={name}
                      className="aggregate-card"
                    >
                      <strong>
                        {name}
                      </strong>

                      <span>
                        {description}
                      </span>
                    </div>
                  )
                )}
              </div>
            </article>

            {/* =================================================
                CASE
            ================================================= */}

            <article
              id="case"
              className="understand-article"
            >
              <SectionHeader
                number="10"
                title="CASE"
                description="CASE creates conditional values inside a query."
              />

              <CodeBlock>
                {`SELECT
  name,
  salary,
  CASE
    WHEN salary >= 70000 THEN 'Senior'
    WHEN salary >= 50000 THEN 'Mid'
    ELSE 'Junior'
  END AS level
FROM employees;`}
              </CodeBlock>

              <Flow
                items={[
                  "read row",
                  "check WHEN",
                  "choose result",
                  "return value",
                ]}
              />

              <div className="tip-box">
                <strong>
                  Think of CASE as:
                </strong>

                <span>
                  SQL's conditional expression
                  for producing different values
                  based on conditions.
                </span>
              </div>
            </article>

            {/* =================================================
                SUBQUERIES
            ================================================= */}

            <article
              id="subqueries"
              className="understand-article"
            >
              <SectionHeader
                number="11"
                title="SUBQUERIES"
                description="A subquery is a query nested inside another SQL statement."
              />

              <CodeBlock>
                {`SELECT name, salary
FROM employees
WHERE salary > (
  SELECT AVG(salary)
  FROM employees
);`}
              </CodeBlock>

              <Flow
                items={[
                  "inner query",
                  "calculate value",
                  "outer query",
                  "filter rows",
                  "result",
                ]}
              />

              <div className="article-grid">
                <InfoCard title="Inner query">
                  Produces a value or result
                  used by the outer query.
                </InfoCard>

                <InfoCard title="Outer query">
                  Uses the subquery result to
                  complete the larger operation.
                </InfoCard>
              </div>
            </article>

            {/* =================================================
                CTE
            ================================================= */}

            <article
              id="cte"
              className="understand-article"
            >
              <SectionHeader
                number="12"
                title="COMMON TABLE EXPRESSIONS"
                description="A CTE gives a temporary name to a query result so it can be referenced by the main statement."
              />

              <CodeBlock>
                {`WITH high_earners AS (
  SELECT *
  FROM employees
  WHERE salary > 70000
)
SELECT name, salary
FROM high_earners;`}
              </CodeBlock>

              <Flow
                items={[
                  "define CTE",
                  "execute CTE query",
                  "temporary result",
                  "main query",
                ]}
              />

              <div className="tip-box">
                <strong>
                  Why use CTEs?
                </strong>

                <span>
                  They can make complex SQL
                  easier to read and structure.
                </span>
              </div>
            </article>

            {/* =================================================
                WINDOW
            ================================================= */}

            <article
              id="window"
              className="understand-article"
            >
              <SectionHeader
                number="13"
                title="WINDOW FUNCTIONS"
                description="Window functions calculate across related rows while keeping individual result rows."
              />

              <CodeBlock>
                {`SELECT
  name,
  department,
  salary,
  RANK() OVER (
    PARTITION BY department
    ORDER BY salary DESC
  ) AS department_rank
FROM employees;`}
              </CodeBlock>

              <Flow
                items={[
                  "read rows",
                  "partition",
                  "order window",
                  "calculate",
                  "keep rows",
                ]}
              />

              <div className="article-grid">
                <InfoCard title="PARTITION BY">
                  Divides rows into independent
                  groups for the window operation.
                </InfoCard>

                <InfoCard title="ORDER BY">
                  Defines the ordering used by
                  the window calculation.
                </InfoCard>

                <InfoCard title="Unlike GROUP BY">
                  Window functions do not collapse
                  the original rows into one row
                  per group.
                </InfoCard>
              </div>
            </article>

            {/* =================================================
                INSERT
            ================================================= */}

            <article
              id="insert"
              className="understand-article"
            >
              <SectionHeader
                number="14"
                title="INSERT"
                description="INSERT adds new rows to a table."
              />

              <CodeBlock>
                {`INSERT INTO employees
  (name, department, salary)
VALUES
  ('Aman', 'Engineering', 65000);`}
              </CodeBlock>

              <Flow
                items={[
                  "target table",
                  "build row",
                  "validate",
                  "write row",
                ]}
              />

              <div className="tip-box">
                <strong>
                  INSERT changes data.
                </strong>

                <span>
                  Unlike SELECT, it is not
                  primarily used to read rows.
                </span>
              </div>
            </article>

            {/* =================================================
                UPDATE
            ================================================= */}

            <article
              id="update"
              className="understand-article"
            >
              <SectionHeader
                number="15"
                title="UPDATE"
                description="UPDATE changes values in existing rows."
              />

              <CodeBlock>
                {`UPDATE employees
SET salary = 70000
WHERE employee_id = 5;`}
              </CodeBlock>

              <Flow
                items={[
                  "find rows",
                  "check WHERE",
                  "change values",
                  "write changes",
                ]}
              />

              <div className="tip-box warning">
                <strong>
                  Be careful with WHERE.
                </strong>

                <span>
                  Without an appropriate WHERE
                  condition, an UPDATE can affect
                  many or all rows.
                </span>
              </div>
            </article>

            {/* =================================================
                DELETE
            ================================================= */}

            <article
              id="delete"
              className="understand-article"
            >
              <SectionHeader
                number="16"
                title="DELETE"
                description="DELETE removes rows from a table."
              />

              <CodeBlock>
                {`DELETE FROM employees
WHERE employee_id = 5;`}
              </CodeBlock>

              <Flow
                items={[
                  "find rows",
                  "check condition",
                  "remove rows",
                  "commit change",
                ]}
              />

              <div className="tip-box warning">
                <strong>
                  DELETE is destructive.
                </strong>

                <span>
                  Always understand which rows
                  match the WHERE condition before
                  executing it.
                </span>
              </div>
            </article>

            {/* =================================================
                CREATE
            ================================================= */}

            <article
              id="create"
              className="understand-article"
            >
              <SectionHeader
                number="17"
                title="CREATE TABLE"
                description="CREATE TABLE defines a new table and its columns."
              />

              <CodeBlock>
                {`CREATE TABLE employees (
  employee_id INTEGER PRIMARY KEY,
  name TEXT,
  department TEXT,
  salary INTEGER
);`}
              </CodeBlock>

              <Flow
                items={[
                  "parse definition",
                  "validate schema",
                  "create structure",
                  "store metadata",
                ]}
              />

              <div className="article-grid">
                <InfoCard title="Columns">
                  Define the data fields that
                  rows can contain.
                </InfoCard>

                <InfoCard title="Data types">
                  Define the kind of values that
                  each column can store.
                </InfoCard>

                <InfoCard title="Constraints">
                  PRIMARY KEY, FOREIGN KEY and
                  other constraints define rules
                  around the data.
                </InfoCard>
              </div>
            </article>

            {/* =================================================
                ALTER
            ================================================= */}

            <article
              id="alter"
              className="understand-article"
            >
              <SectionHeader
                number="18"
                title="ALTER TABLE"
                description="ALTER TABLE changes the structure of an existing table."
              />

              <CodeBlock>
                {`ALTER TABLE employees
ADD COLUMN email TEXT;`}
              </CodeBlock>

              <Flow
                items={[
                  "find table",
                  "validate change",
                  "modify schema",
                  "update metadata",
                ]}
              />

              <div className="tip-box">
                <strong>
                  ALTER works on structure.
                </strong>

                <span>
                  It is used to add, modify or
                  remove schema elements depending
                  on the database system.
                </span>
              </div>
            </article>

            {/* =================================================
                DROP
            ================================================= */}

            <article
              id="drop"
              className="understand-article"
            >
              <SectionHeader
                number="19"
                title="DROP TABLE"
                description="DROP TABLE removes a table definition from the database."
              />

              <CodeBlock>
                {`DROP TABLE employees;`}
              </CodeBlock>

              <Flow
                items={[
                  "find table",
                  "check dependencies",
                  "remove structure",
                  "update metadata",
                ]}
              />

              <div className="tip-box warning">
                <strong>
                  DROP is structural and destructive.
                </strong>

                <span>
                  It removes the table itself,
                  not merely selected rows.
                </span>
              </div>
            </article>

            {/* =================================================
                NULL
            ================================================= */}

            <article
              id="null"
              className="understand-article"
            >
              <SectionHeader
                number="20"
                title="NULL"
                description="NULL represents the absence of a value and requires special SQL handling."
              />

              <CodeBlock>
                {`SELECT *
FROM employees
WHERE department IS NULL;`}
              </CodeBlock>

              <Flow
                items={[
                  "read rows",
                  "test NULL",
                  "keep matching rows",
                  "result",
                ]}
              />

              <div className="article-grid">
                <InfoCard title="IS NULL">
                  Use IS NULL when looking for
                  missing values.
                </InfoCard>

                <InfoCard title="IS NOT NULL">
                  Use IS NOT NULL when you need
                  rows containing a value.
                </InfoCard>

                <InfoCard title="Not equal to NULL">
                  NULL does not behave like an
                  ordinary value in comparisons.
                </InfoCard>
              </div>
            </article>

            {/* =================================================
                FINAL EXECUTION MODEL
            ================================================= */}

            <section className="final-model">
              <div className="section-kicker">
                PUT IT ALL TOGETHER
              </div>

              <h2>
                From SQL text
                <br />
                <span>
                  to database result.
                </span>
              </h2>

              <p>
                A query is not magic. It is a
                sequence of operations that
                transforms source data into a
                result.
              </p>

              <div className="final-pipeline">
                {[
                  [
                    "01",
                    "PARSE",
                    "Understand SQL syntax",
                  ],
                  [
                    "02",
                    "SOURCE",
                    "Find tables and data",
                  ],
                  [
                    "03",
                    "FILTER",
                    "Remove rows that do not match",
                  ],
                  [
                    "04",
                    "COMBINE",
                    "Join or group data",
                  ],
                  [
                    "05",
                    "PROJECT",
                    "Produce requested columns",
                  ],
                  [
                    "06",
                    "SORT",
                    "Arrange the result",
                  ],
                  [
                    "07",
                    "RETURN",
                    "Send rows back",
                  ],
                ].map(
                  ([number, title, text]) => (
                    <div
                      className="final-pipeline-item"
                      key={number}
                    >
                      <span>
                        {number}
                      </span>

                      <strong>
                        {title}
                      </strong>

                      <p>
                        {text}
                      </p>
                    </div>
                  )
                )}
              </div>

              <Link
                href="/run-query"
                className="final-run-button"
              >
                Visualize a real query
                <span>→</span>
              </Link>
            </section>
          </div>
        </div>
      </section>

      {/* =================================================
          FOOTER
      ================================================= */}

      <footer className="understand-footer">
        <div>
          <strong>
            SQLWhale
          </strong>

          <span>
            Learn SQL. See the process.
            Understand the result.
          </span>
        </div>

        <div>
          <Link href="/learn">
            Learn
          </Link>

          <Link href="/run-query">
            Visualize
          </Link>

          <Link href="/understand">
            Understand
          </Link>
        </div>

        <span>
          © {new Date().getFullYear()} SQLWhale
        </span>
      </footer>

      {/* =================================================
          INTERNAL CSS
      ================================================= */}

      <style jsx global>{`
        /* =================================================
           BASE
        ================================================= */

        .sqlwhale-understand {
          --blue: #3478ed;
          --dark: #14233b;
          --text: #334967;
          --muted: #8190a6;
          --line: #e5ebf3;
          --soft: #f7f9fc;

          min-height: 100vh;

          background:
            radial-gradient(
              circle at 80% 8%,
              rgba(52, 120, 237, 0.08),
              transparent 26%
            ),
            #ffffff;

          color: var(--text);

          font-family:
            Inter,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;

          overflow-x: hidden;
        }

        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        /* =================================================
           NAVBAR
        ================================================= */

        .understand-navbar {
          position: sticky;

          top: 0;

          z-index: 200;

          border-bottom:
            1px solid
            rgba(225, 232, 242, 0.9);

          background:
            rgba(255, 255, 255, 0.88);

          backdrop-filter:
            blur(18px);
        }

        .understand-navbar-inner {
          width:
            min(1380px, calc(100% - 64px));

          height: 74px;

          margin: auto;

          display: flex;

          align-items: center;

          justify-content: space-between;

          gap: 30px;
        }

        .understand-logo {
          display: flex;

          align-items: center;

          gap: 10px;

          color: #1b2f4c;

          font-size: 16px;

          font-weight: 800;

          letter-spacing: -0.03em;
        }

        .understand-logo-mark {
          width: 32px;
          height: 32px;

          display: grid;

          place-items: center;

          border-radius: 9px;

          background: #edf4ff;

          color: var(--blue);

          box-shadow:
            inset 0 0 0 1px
            rgba(52, 120, 237, 0.1);
        }

        .understand-nav {
          display: flex;

          align-items: center;

          gap: 32px;

          margin-left: auto;
        }

        .understand-nav a {
          position: relative;

          color: #718098;

          font-size: 11px;

          font-weight: 700;

          transition:
            color 0.25s ease;
        }

        .understand-nav a::after {
          content: "";

          position: absolute;

          left: 0;
          right: 0;
          bottom: -9px;

          height: 2px;

          transform:
            scaleX(0);

          transform-origin:
            center;

          background:
            var(--blue);

          transition:
            transform 0.25s ease;
        }

        .understand-nav a:hover,
        .understand-nav a.active {
          color: var(--blue);
        }

        .understand-nav a:hover::after,
        .understand-nav a.active::after {
          transform:
            scaleX(1);
        }

        .understand-run-button {
          display: flex;

          align-items: center;

          gap: 10px;

          padding:
            10px 15px;

          border:
            1px solid
            #dce6f4;

          border-radius: 8px;

          background: #ffffff;

          color: #315d9b;

          font-size: 10px;

          font-weight: 800;

          transition:
            transform 0.25s ease,
            border-color 0.25s ease,
            box-shadow 0.25s ease;
        }

        .understand-run-button:hover {
          transform:
            translateY(-2px);

          border-color:
            #bcd3f5;

          box-shadow:
            0 10px 25px
            rgba(52, 120, 237, 0.1);
        }

        .understand-run-button span {
          transition:
            transform 0.25s ease;
        }

        .understand-run-button:hover span {
          transform:
            translateX(4px);
        }

        .mobile-menu-button {
          display: none;

          border: 0;

          background: none;

          font-size: 22px;

          color: #315d9b;

          cursor: pointer;
        }

        .mobile-understand-menu {
          display: none;
        }

        /* =================================================
           HERO
        ================================================= */

        .understand-hero {
          position: relative;

          min-height: 690px;

          display: flex;

          align-items: center;

          overflow: hidden;

          border-bottom:
            1px solid
            #edf1f6;
        }

        .hero-grid-background {
          position: absolute;

          inset: 0;

          opacity: 0.6;

          background-image:
            linear-gradient(
              rgba(52, 120, 237, 0.045)
              1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(52, 120, 237, 0.045)
              1px,
              transparent 1px
            );

          background-size:
            45px 45px;

          mask-image:
            linear-gradient(
              to bottom,
              black,
              transparent
            );
        }

        .hero-orb {
          position: absolute;

          border-radius: 50%;

          filter:
            blur(1px);

          pointer-events: none;

          animation:
            understand-float
            8s ease-in-out infinite;
        }

        .hero-orb-one {
          width: 300px;
          height: 300px;

          top: 80px;
          right: 10%;

          background:
            radial-gradient(
              circle,
              rgba(52, 120, 237, 0.12),
              transparent 68%
            );
        }

        .hero-orb-two {
          width: 240px;
          height: 240px;

          bottom: -60px;
          left: 5%;

          background:
            radial-gradient(
              circle,
              rgba(6, 166, 199, 0.08),
              transparent 68%
            );

          animation-delay:
            -3s;
        }

        @keyframes understand-float {
          0%,
          100% {
            transform:
              translate3d(0, 0, 0);
          }

          50% {
            transform:
              translate3d(0, -18px, 0);
          }
        }

        .understand-hero-inner {
          position: relative;

          z-index: 2;

          width:
            min(1280px, calc(100% - 80px));

          margin: auto;

          display: grid;

          grid-template-columns:
            0.95fr 1.05fr;

          align-items: center;

          gap: 90px;
        }

        .understand-hero-copy {
          animation:
            understand-hero-in
            0.9s
            cubic-bezier(
              0.2,
              0.8,
              0.2,
              1
            )
            both;
        }

        @keyframes understand-hero-in {
          from {
            opacity: 0;

            transform:
              translateY(30px);
          }

          to {
            opacity: 1;

            transform:
              translateY(0);
          }
        }

        .understand-status {
          display: inline-flex;

          align-items: center;

          gap: 8px;

          margin-bottom: 24px;

          color: #5e7699;

          font-size: 9px;

          font-weight: 800;

          letter-spacing:
            0.13em;
        }

        .understand-status span {
          width: 7px;
          height: 7px;

          border-radius: 50%;

          background: #34a853;

          box-shadow:
            0 0 0 5px
            rgba(52, 168, 83, 0.1);

          animation:
            status-pulse
            1.7s
            ease-in-out
            infinite;
        }

        @keyframes status-pulse {
          0%,
          100% {
            opacity: 0.55;
          }

          50% {
            opacity: 1;
          }
        }

        .understand-hero h1 {
          margin: 0;

          color: #172b49;

          font-size:
            clamp(
              44px,
              5.1vw,
              74px
            );

          line-height: 0.98;

          letter-spacing:
            -0.055em;
        }

        .understand-hero h1 span {
          color: var(--blue);

          background:
            linear-gradient(
              100deg,
              #3478ed,
              #5996f5
            );

          background-clip: text;

          -webkit-background-clip: text;

          color: transparent;
        }

        .understand-hero-copy > p {
          max-width: 570px;

          margin:
            28px 0 0;

          color: #73829a;

          font-size: 14px;

          line-height: 1.75;
        }

        .hero-actions {
          display: flex;

          gap: 12px;

          margin-top: 30px;
        }

        .hero-primary,
        .hero-secondary {
          display: flex;

          align-items: center;

          gap: 12px;

          padding:
            13px 18px;

          border-radius: 9px;

          font-size: 10px;

          font-weight: 800;

          transition:
            transform 0.25s ease,
            box-shadow 0.25s ease;
        }

        .hero-primary {
          background:
            #3478ed;

          color: white;

          box-shadow:
            0 10px 25px
            rgba(52, 120, 237, 0.18);
        }

        .hero-secondary {
          border:
            1px solid
            #dce5f0;

          background:
            rgba(255, 255, 255, 0.8);

          color: #4b6587;
        }

        .hero-primary:hover,
        .hero-secondary:hover {
          transform:
            translateY(-3px);
        }

        .hero-primary span,
        .hero-secondary span {
          transition:
            transform 0.25s ease;
        }

        .hero-primary:hover span,
        .hero-secondary:hover span {
          transform:
            translateX(4px);
        }

        .hero-stat-row {
          display: flex;

          align-items: center;

          gap: 22px;

          margin-top: 44px;
        }

        .hero-stat-row div:not(
          .hero-stat-divider
        ) {
          display: flex;

          flex-direction: column;

          gap: 4px;
        }

        .hero-stat-row strong {
          color: #263e60;

          font-size: 17px;
        }

        .hero-stat-row span {
          color: #8b99ad;

          font-size: 8px;

          font-weight: 700;
        }

        .hero-stat-divider {
          width: 1px;
          height: 30px;

          background:
            #dfe6ef;
        }

        /* =================================================
           HERO EXECUTION CARD
        ================================================= */

        .hero-execution {
          position: relative;

          padding: 28px;

          border:
            1px solid
            rgba(214, 225, 239, 0.9);

          border-radius: 18px;

          background:
            rgba(255, 255, 255, 0.78);

          box-shadow:
            0 30px 80px
            rgba(34, 68, 110, 0.09);

          backdrop-filter:
            blur(15px);

          animation:
            execution-card-in
            1s
            0.12s
            cubic-bezier(
              0.2,
              0.8,
              0.2,
              1
            )
            both;
        }

        @keyframes execution-card-in {
          from {
            opacity: 0;

            transform:
              translateY(35px)
              rotateX(5deg);
          }

          to {
            opacity: 1;

            transform:
              translateY(0)
              rotateX(0);
          }
        }

        .hero-execution::before {
          content: "";

          position: absolute;

          inset: -1px;

          border-radius: inherit;

          background:
            linear-gradient(
              120deg,
              rgba(52, 120, 237, 0.2),
              transparent 30%,
              transparent 70%,
              rgba(6, 166, 199, 0.15)
            );

          z-index: -1;

          opacity: 0.7;
        }

        .hero-execution-label {
          margin-bottom: 14px;

          color: #8797ad;

          font-size: 8px;

          font-weight: 800;

          letter-spacing:
            0.14em;
        }

        .hero-query-box {
          padding: 22px;

          border:
            1px solid
            #e2e9f2;

          border-radius: 10px;

          background:
            #f8fafc;

          color: #354c6c;

          font-family:
            "SFMono-Regular",
            Consolas,
            monospace;

          font-size: 12px;

          line-height: 2;

          box-shadow:
            inset 0 1px 0
            rgba(255, 255, 255, 0.8);
        }

        .sql-keyword {
          color: #3478ed;

          font-weight: 800;
        }

        .execution-flow {
          display: flex;

          align-items: center;

          justify-content: center;

          flex-wrap: wrap;

          gap: 5px;

          margin:
            25px 0;
        }

        .flow-item-wrap {
          display: flex;

          align-items: center;

          gap: 5px;
        }

        .flow-item {
          display: flex;

          align-items: center;

          gap: 6px;

          padding:
            7px 9px;

          border:
            1px solid
            #dce7f5;

          border-radius: 7px;

          background:
            #ffffff;

          color: #506987;

          font-size: 8px;

          font-weight: 800;

          box-shadow:
            0 5px 15px
            rgba(30, 65, 110, 0.05);

          animation:
            flow-in
            0.7s
            both;
        }

        .flow-item-wrap:nth-child(2)
          .flow-item {
          animation-delay:
            0.12s;
        }

        .flow-item-wrap:nth-child(3)
          .flow-item {
          animation-delay:
            0.24s;
        }

        .flow-item-wrap:nth-child(4)
          .flow-item {
          animation-delay:
            0.36s;
        }

        .flow-item-wrap:nth-child(5)
          .flow-item {
          animation-delay:
            0.48s;
        }

        @keyframes flow-in {
          from {
            opacity: 0;

            transform:
              translateY(8px);
          }

          to {
            opacity: 1;

            transform:
              translateY(0);
          }
        }

        .flow-number {
          color: #3478ed;

          font-size: 7px;
        }

        .flow-arrow {
          color: #9baac0;

          font-size: 12px;

          animation:
            arrow-flow
            1.2s
            ease-in-out
            infinite;
        }

        @keyframes arrow-flow {
          0%,
          100% {
            opacity: 0.4;
          }

          50% {
            opacity: 1;

            transform:
              translateX(3px);
          }
        }

        .hero-result {
          display: flex;

          align-items: center;

          gap: 8px;

          padding:
            11px 13px;

          border-radius: 8px;

          background:
            #f2f8ff;

          color: #607796;

          font-size: 9px;
        }

        .hero-result strong {
          margin-left: auto;

          color: #3478ed;
        }

        .result-dot {
          width: 6px;
          height: 6px;

          border-radius: 50%;

          background: #34a853;
        }

        /* =================================================
           BIG PICTURE
        ================================================= */

        .logical-order-section {
          padding:
            125px 0;

          background:
            #f8fafc;

          border-bottom:
            1px solid
            #e8edf3;
        }

        .content-width {
          width:
            min(1180px, calc(100% - 70px));

          margin: auto;
        }

        .section-kicker {
          margin-bottom: 15px;

          color: #7990af;

          font-size: 8px;

          font-weight: 900;

          letter-spacing:
            0.16em;
        }

        .logical-heading {
          display: grid;

          grid-template-columns:
            1fr 0.55fr;

          gap: 100px;

          align-items: end;
        }

        .logical-heading h2,
        .final-model h2 {
          margin: 0;

          color: #1d3556;

          font-size:
            clamp(
              34px,
              4vw,
              52px
            );

          line-height: 1.05;

          letter-spacing:
            -0.045em;
        }

        .logical-heading h2 span,
        .final-model h2 span {
          color: #8a98aa;
        }

        .logical-heading p {
          margin: 0;

          color: #7b899d;

          font-size: 12px;

          line-height: 1.7;
        }

        .logical-order-grid {
          display: grid;

          grid-template-columns:
            1fr 100px 1fr;

          align-items: center;

          gap: 35px;

          margin-top: 55px;
        }

        .written-order,
        .processed-order {
          padding: 24px;

          border:
            1px solid
            #e1e8f0;

          border-radius: 13px;

          background:
            white;

          box-shadow:
            0 12px 35px
            rgba(33, 66, 108, 0.045);
        }

        .order-label {
          display: block;

          margin-bottom: 14px;

          color: #9aa7b8;

          font-size: 7px;

          font-weight: 900;

          letter-spacing:
            0.15em;
        }

        .order-line {
          display: flex;

          align-items: center;

          gap: 15px;

          padding: 9px 10px;

          border-radius: 6px;

          color: #657890;

          font-family:
            "SFMono-Regular",
            Consolas,
            monospace;

          font-size: 10px;

          transition:
            transform 0.25s ease,
            background 0.25s ease,
            color 0.25s ease;
        }

        .order-line:hover {
          transform:
            translateX(5px);

          background:
            #f5f8fc;

          color: #3478ed;
        }

        .order-line b {
          width: 18px;

          color: #a5b1c0;

          font-size: 7px;
        }

        .processed-order
          .order-line.active {
          color: #3478ed;

          background:
            #f2f7ff;

          margin-bottom: 2px;
        }

        .logical-arrow {
          display: flex;

          flex-direction: column;

          align-items: center;

          gap: 8px;

          color: #8192aa;

          text-align: center;

          font-size: 7px;

          font-weight: 800;
        }

        .logical-arrow div {
          color: #3478ed;

          font-size: 30px;

          animation:
            logical-arrow
            1.5s
            ease-in-out
            infinite;
        }

        @keyframes logical-arrow {
          0%,
          100% {
            transform:
              translateX(-4px);
          }

          50% {
            transform:
              translateX(4px);
          }
        }

        /* =================================================
           MAIN CONTENT
        ================================================= */

        .understand-main {
          padding:
            120px 0;
        }

        .understand-layout {
          width:
            min(1220px, calc(100% - 70px));

          margin: auto;

          display: grid;

          grid-template-columns:
            250px 1fr;

          gap: 80px;

          align-items: start;
        }

        .understand-sidebar {
          position: sticky;

          top: 105px;

          max-height:
            calc(100vh - 130px);

          overflow-y: auto;

          padding-right: 10px;
        }

        .sidebar-heading {
          display: flex;

          justify-content: space-between;

          align-items: center;

          padding-bottom: 14px;

          border-bottom:
            1px solid
            #e7edf4;

          margin-bottom: 9px;
        }

        .sidebar-heading span {
          color: #486486;

          font-size: 8px;

          font-weight: 900;

          letter-spacing:
            0.12em;
        }

        .sidebar-heading small {
          color: #a2afbf;

          font-size: 7px;
        }

        .sidebar-list {
          display: flex;

          flex-direction: column;

          gap: 2px;
        }

        .sidebar-list a {
          display: grid;

          grid-template-columns:
            25px 1fr;

          gap: 8px;

          padding:
            9px 8px;

          border-radius: 7px;

          transition:
            background 0.2s ease,
            transform 0.2s ease;
        }

        .sidebar-list a:hover {
          background:
            #f6f9fd;

          transform:
            translateX(3px);
        }

        .sidebar-list a.active {
          background:
            #f0f6ff;
        }

        .sidebar-number {
          padding-top: 1px;

          font-size: 7px;

          font-weight: 900;
        }

        .sidebar-list strong {
          display: block;

          color: #546c8c;

          font-size: 9px;
        }

        .sidebar-list small {
          display: block;

          margin-top: 2px;

          color: #99a6b7;

          font-size: 7px;

          line-height: 1.4;
        }

        .sidebar-list a.active strong {
          color: #3478ed;
        }

        /* =================================================
           ARTICLES
        ================================================= */

        .understand-content {
          min-width: 0;
        }

        .understand-article {
          position: relative;

          scroll-margin-top:
            110px;

          padding:
            0 0 120px;

          margin-bottom:
            120px;

          border-bottom:
            1px solid
            #e8edf3;
        }

        .understand-section-header {
          display: grid;

          grid-template-columns:
            58px 1fr;

          gap: 20px;

          margin-bottom: 35px;
        }

        .section-index {
          width: 50px;
          height: 50px;

          display: grid;

          place-items: center;

          border-radius: 12px;

          background:
            #f1f6ff;

          color: #3478ed;

          font-size: 10px;

          font-weight: 900;

          box-shadow:
            inset 0 0 0 1px
            rgba(52, 120, 237, 0.08);
        }

        .understand-eyebrow {
          display: block;

          margin-bottom: 7px;

          color: #93a0b1;

          font-size: 7px;

          font-weight: 900;

          letter-spacing:
            0.15em;
        }

        .understand-section-header h2 {
          margin: 0;

          color: #203958;

          font-size:
            clamp(
              28px,
              3.4vw,
              43px
            );

          line-height: 1;

          letter-spacing:
            -0.045em;
        }

        .understand-section-header p {
          max-width: 620px;

          margin:
            13px 0 0;

          color: #7c8b9f;

          font-size: 12px;

          line-height: 1.65;
        }

        /* =================================================
           CODE
        ================================================= */

        .understand-code {
          overflow: hidden;

          margin:
            25px 0 30px;

          border:
            1px solid
            #dce5ef;

          border-radius: 12px;

          background:
            #111b2b;

          box-shadow:
            0 18px 45px
            rgba(19, 42, 73, 0.1);

          transition:
            transform 0.3s ease,
            box-shadow 0.3s ease;
        }

        .understand-code:hover {
          transform:
            translateY(-3px);

          box-shadow:
            0 22px 55px
            rgba(19, 42, 73, 0.15);
        }

        .code-topbar {
          height: 38px;

          display: flex;

          align-items: center;

          gap: 12px;

          padding:
            0 14px;

          border-bottom:
            1px solid
            rgba(255, 255, 255, 0.07);

          color:
            rgba(255, 255, 255, 0.45);

          font-size: 7px;

          font-weight: 800;

          letter-spacing:
            0.1em;
        }

        .code-dots {
          display: flex;

          gap: 5px;
        }

        .code-dots span {
          width: 6px;
          height: 6px;

          border-radius: 50%;

          background:
            rgba(255, 255, 255, 0.22);
        }

        .understand-code pre {
          margin: 0;

          padding:
            23px;

          overflow-x: auto;

          color: #d8e3f3;

          font-family:
            "SFMono-Regular",
            Consolas,
            monospace;

          font-size: 11px;

          line-height: 1.9;
        }

        /* =================================================
           FLOW
        ================================================= */

        .understand-article
          .execution-flow {
          justify-content:
            flex-start;

          margin:
            30px 0 35px;

          padding:
            17px;

          border:
            1px solid
            #e5ebf2;

          border-radius: 11px;

          background:
            #fbfcfe;
        }

        .understand-article
          .flow-item {
          background:
            #ffffff;

          padding:
            9px 12px;

          color: #496483;

          box-shadow:
            0 4px 13px
            rgba(30, 60, 100, 0.06);
        }

        /* =================================================
           INFO CARDS
        ================================================= */

        .article-grid {
          display: grid;

          grid-template-columns:
            repeat(3, 1fr);

          gap: 13px;

          margin-top: 28px;
        }

        .understand-info-card {
          position: relative;

          padding:
            21px;

          border:
            1px solid
            #e3e9f1;

          border-radius: 11px;

          background:
            #ffffff;

          overflow: hidden;

          transition:
            transform 0.28s ease,
            box-shadow 0.28s ease,
            border-color 0.28s ease;
        }

        .understand-info-card:hover {
          transform:
            translateY(-5px);

          border-color:
            #cbdcf4;

          box-shadow:
            0 16px 35px
            rgba(35, 69, 110, 0.08);
        }

        .info-card-line {
          width: 30px;
          height: 3px;

          margin-bottom: 15px;

          border-radius: 3px;

          background:
            #3478ed;
        }

        .understand-info-card h4 {
          margin:
            0 0 8px;

          color: #405b7d;

          font-size: 10px;

          font-weight: 900;
        }

        .understand-info-card p {
          margin: 0;

          color: #7e8da2;

          font-size: 9px;

          line-height: 1.65;
        }

        .tip-box {
          display: flex;

          align-items: flex-start;

          gap: 14px;

          margin-top: 28px;

          padding:
            17px 19px;

          border:
            1px solid
            #dce8f8;

          border-radius: 10px;

          background:
            #f4f8ff;

          color: #607796;

          font-size: 9px;

          line-height: 1.6;
        }

        .tip-box strong {
          color: #3478ed;

          white-space: nowrap;
        }

        .tip-box.warning {
          border-color:
            #f0dfcc;

          background:
            #fffaf4;
        }

        .tip-box.warning strong {
          color: #d67a25;
        }

        /* =================================================
           JOIN VISUAL
        ================================================= */

        .join-visual {
          display: grid;

          grid-template-columns:
            1fr 110px 1fr;

          align-items: center;

          gap: 20px;

          margin:
            35px 0;
        }

        .join-table {
          padding:
            22px;

          border:
            1px solid
            #dce6f2;

          border-radius: 11px;

          background:
            #ffffff;

          box-shadow:
            0 12px 30px
            rgba(35, 70, 110, 0.06);

          transition:
            transform 0.25s ease;
        }

        .join-table:hover {
          transform:
            translateY(-5px);
        }

        .join-table span {
          display: block;

          margin-bottom: 6px;

          color: #93a1b3;

          font-size: 7px;

          font-weight: 900;

          letter-spacing:
            0.12em;
        }

        .join-table strong {
          display: block;

          color: #31547e;

          font-family:
            monospace;

          font-size: 13px;
        }

        .join-table small {
          display: block;

          margin-top: 8px;

          color: #8b99aa;

          font-size: 8px;
        }

        .join-connector {
          display: flex;

          flex-direction: column;

          align-items: center;

          gap: 8px;

          color: #3478ed;

          font-size: 8px;

          font-weight: 900;
        }

        .join-connector div {
          width: 100%;
          height: 2px;

          position: relative;

          background:
            #bcd1ef;

          overflow: hidden;
        }

        .join-connector div::after {
          content: "";

          position: absolute;

          width: 35px;
          height: 100%;

          left: -35px;

          background:
            #3478ed;

          animation:
            join-line
            1.5s
            linear
            infinite;
        }

        @keyframes join-line {
          to {
            transform:
              translateX(
                140px
              );
          }
        }

        .join-types {
          display: grid;

          grid-template-columns:
            repeat(2, 1fr);

          gap: 10px;

          margin-top: 30px;
        }

        .join-types > div {
          padding:
            17px;

          border:
            1px solid
            #e2e8f0;

          border-radius: 9px;

          background:
            #fbfcfe;

          transition:
            transform 0.25s ease,
            border-color 0.25s ease;
        }

        .join-types > div:hover {
          transform:
            translateY(-3px);

          border-color:
            #cdddf1;
        }

        .join-types strong {
          display: block;

          color: #4b6586;

          font-size: 9px;
        }

        .join-types span {
          display: block;

          margin-top: 5px;

          color: #8795a7;

          font-size: 8px;

          line-height: 1.5;
        }

        /* =================================================
           AGGREGATES
        ================================================= */

        .aggregate-grid {
          display: grid;

          grid-template-columns:
            repeat(5, 1fr);

          gap: 9px;

          margin-top: 30px;
        }

        .aggregate-card {
          min-height: 100px;

          display: flex;

          flex-direction: column;

          justify-content: center;

          padding: 15px;

          border:
            1px solid
            #e2e8f0;

          border-radius: 10px;

          background:
            #ffffff;

          transition:
            transform 0.25s ease,
            box-shadow 0.25s ease;
        }

        .aggregate-card:hover {
          transform:
            translateY(-5px);

          box-shadow:
            0 14px 30px
            rgba(35, 70, 110, 0.08);
        }

        .aggregate-card strong {
          color: #3478ed;

          font-family:
            monospace;

          font-size: 12px;
        }

        .aggregate-card span {
          margin-top: 8px;

          color: #8492a5;

          font-size: 8px;

          line-height: 1.45;
        }

        /* =================================================
           FINAL MODEL
        ================================================= */

        .final-model {
          padding:
            70px 0 20px;

          text-align: left;
        }

        .final-model > p {
          max-width: 550px;

          margin:
            22px 0 45px;

          color: #7e8da1;

          font-size: 12px;

          line-height: 1.7;
        }

        .final-pipeline {
          display: grid;

          grid-template-columns:
            repeat(7, 1fr);

          gap: 8px;
        }

        .final-pipeline-item {
          position: relative;

          min-height: 145px;

          padding: 16px;

          border:
            1px solid
            #e0e7ef;

          border-radius: 10px;

          background:
            #ffffff;

          transition:
            transform 0.25s ease,
            box-shadow 0.25s ease;
        }

        .final-pipeline-item:hover {
          transform:
            translateY(-6px);

          box-shadow:
            0 16px 32px
            rgba(35, 69, 110, 0.08);
        }

        .final-pipeline-item > span {
          color: #9eacbc;

          font-size: 7px;

          font-weight: 900;
        }

        .final-pipeline-item strong {
          display: block;

          margin-top: 18px;

          color: #476382;

          font-size: 9px;
        }

        .final-pipeline-item p {
          margin:
            7px 0 0;

          color: #8997a9;

          font-size: 7px;

          line-height: 1.5;
        }

        .final-run-button {
          display: inline-flex;

          align-items: center;

          gap: 12px;

          margin-top: 35px;

          padding:
            13px 18px;

          border-radius: 8px;

          background:
            #3478ed;

          color: white;

          font-size: 9px;

          font-weight: 800;

          box-shadow:
            0 10px 25px
            rgba(52, 120, 237, 0.18);

          transition:
            transform 0.25s ease;
        }

        .final-run-button:hover {
          transform:
            translateY(-3px);
        }

        .final-run-button span {
          transition:
            transform 0.25s ease;
        }

        .final-run-button:hover span {
          transform:
            translateX(4px);
        }

        /* =================================================
           FOOTER
        ================================================= */

        .understand-footer {
          min-height: 110px;

          width:
            min(1220px, calc(100% - 70px));

          margin: auto;

          display: flex;

          align-items: center;

          justify-content: space-between;

          gap: 25px;

          border-top:
            1px solid
            #e6ebf2;

          color: #8290a3;

          font-size: 8px;
        }

        .understand-footer > div {
          display: flex;

          align-items: center;

          gap: 15px;
        }

        .understand-footer strong {
          color: #31527a;

          font-size: 12px;
        }

        .understand-footer a {
          transition:
            color 0.2s ease;
        }

        .understand-footer a:hover {
          color: #3478ed;
        }

        /* =================================================
           RESPONSIVE
        ================================================= */

        @media (max-width: 1050px) {
          .understand-hero-inner {
            grid-template-columns:
              1fr;

            gap: 55px;

            padding:
              80px 0;
          }

          .understand-hero {
            min-height: auto;
          }

          .hero-execution {
            max-width: 700px;
          }

          .understand-layout {
            grid-template-columns:
              190px 1fr;

            gap: 45px;
          }

          .article-grid {
            grid-template-columns:
              1fr 1fr;
          }

          .aggregate-grid {
            grid-template-columns:
              repeat(3, 1fr);
          }

          .final-pipeline {
            grid-template-columns:
              repeat(4, 1fr);
          }
        }

        @media (max-width: 800px) {
          .understand-navbar-inner {
            width:
              calc(100% - 35px);

            height: 65px;
          }

          .understand-nav,
          .understand-run-button {
            display: none;
          }

          .mobile-menu-button {
            display: block;
          }

          .mobile-understand-menu {
            display: flex;

            flex-direction: column;

            gap: 0;

            padding:
              8px 20px 15px;

            border-top:
              1px solid
              #edf1f5;

            background:
              rgba(255, 255, 255, 0.97);
          }

          .mobile-understand-menu a {
            padding:
              12px 5px;

            border-bottom:
              1px solid
              #edf1f5;

            color: #536b89;

            font-size: 10px;

            font-weight: 700;
          }

          .understand-hero-inner {
            width:
              calc(100% - 35px);

            padding:
              65px 0;
          }

          .understand-hero h1 {
            font-size:
              clamp(
                39px,
                11vw,
                60px
              );
          }

          .hero-stat-row {
            gap: 13px;
          }

          .logical-order-section,
          .understand-main {
            padding:
              80px 0;
          }

          .content-width {
            width:
              calc(100% - 35px);
          }

          .logical-heading {
            grid-template-columns:
              1fr;

            gap: 20px;
          }

          .logical-order-grid {
            grid-template-columns:
              1fr;

            gap: 20px;
          }

          .logical-arrow {
            transform:
              rotate(90deg);
          }

          .understand-layout {
            width:
              calc(100% - 35px);

            grid-template-columns:
              1fr;

            gap: 40px;
          }

          .understand-sidebar {
            position: relative;

            top: auto;

            max-height:
              none;

            overflow-x: auto;

            padding-bottom: 10px;
          }

          .sidebar-heading {
            display: none;
          }

          .sidebar-list {
            flex-direction: row;

            width: max-content;
          }

          .sidebar-list a {
            width: 115px;

            grid-template-columns:
              22px 1fr;

            border:
              1px solid
              #e5ebf2;
          }

          .sidebar-list small {
            display: none;
          }

          .understand-article {
            margin-bottom: 80px;

            padding-bottom: 80px;
          }

          .article-grid {
            grid-template-columns:
              1fr;
          }

          .join-visual {
            grid-template-columns:
              1fr;

            gap: 10px;
          }

          .join-connector {
            transform:
              rotate(90deg);
          }

          .join-types {
            grid-template-columns:
              1fr;
          }

          .aggregate-grid {
            grid-template-columns:
              repeat(2, 1fr);
          }

          .final-pipeline {
            grid-template-columns:
              1fr 1fr;
          }

          .understand-footer {
            width:
              calc(100% - 35px);

            flex-direction: column;

            align-items: flex-start;

            padding:
              30px 0;
          }

          .understand-footer > div {
            flex-wrap: wrap;
          }
        }

        @media (max-width: 480px) {
          .hero-actions {
            flex-direction: column;
          }

          .hero-primary,
          .hero-secondary {
            justify-content: center;
          }

          .hero-execution {
            padding: 17px;
          }

          .hero-query-box {
            font-size: 9px;
          }

          .execution-flow {
            justify-content: flex-start;

            overflow-x: auto;

            flex-wrap: nowrap;

            padding-bottom: 5px;
          }

          .understand-section-header {
            grid-template-columns:
              43px 1fr;

            gap: 12px;
          }

          .section-index {
            width: 40px;
            height: 40px;
          }

          .understand-code pre {
            font-size: 9px;
          }

          .aggregate-grid {
            grid-template-columns:
              1fr;
          }

          .final-pipeline {
            grid-template-columns:
              1fr;
          }
        }

        /* =================================================
           REDUCED MOTION
        ================================================= */

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration:
              0.01ms !important;

            animation-iteration-count:
              1 !important;

            scroll-behavior:
              auto !important;

            transition-duration:
              0.01ms !important;
          }
        }
      `}</style>
    </main>
  );
}