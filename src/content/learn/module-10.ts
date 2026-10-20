import type { LessonModule } from "./types";

const moduleTen: LessonModule = {
  id: 10,
  title: "Advanced SQL & Final Revision",
  difficulty: "Advanced",
  estimatedTime: "60–75 minutes",
  summary: "Bring the SQL learning path together with window functions, CASE, safe query patterns, NULL handling, and a final revision checklist.",
  outcomes: [
    "Use CASE to classify rows with conditional logic.",
    "Use window functions such as ROW_NUMBER and SUM OVER when supported.",
    "Explain the difference between aggregate results and row-level window results.",
    "Write safer, clearer SQL by handling NULL values and avoiding ambiguous joins.",
    "Review core SQL topics and prepare for the 50-mark final assessment."
  ],
  analogy: "Imagine you are preparing a report for a team. CASE labels each record, window functions compare a record with other rows without collapsing the result, and a final checklist helps you verify the report before sending it.",
  sections: [
    {
      heading: "1. CASE — add conditional labels",
      body: "CASE evaluates conditions in order and returns the result for the first matching WHEN. ELSE is optional, but it is useful as a fallback when no condition matches. CASE is an expression, so you can use it in SELECT and in many other places where an expression is allowed. It does not change the stored data.",
      examples: [
        {
          title: "Label orders by total",
          concept: "Return a readable category based on each order's total_amount.",
          analogy: "A shop places each order into a small, medium or large basket based on its value.",
          sql: "SELECT order_id, total_amount,\n  CASE\n    WHEN total_amount >= 5000 THEN 'High'\n    WHEN total_amount >= 1000 THEN 'Medium'\n    ELSE 'Low'\n  END AS order_band\nFROM orders;",
          explanation: [
            { line: "CASE", meaning: "Begin conditional logic that returns one value." },
            { line: "WHEN total_amount >= 5000 THEN 'High'", meaning: "If the total is at least 5000, label the order High." },
            { line: "WHEN total_amount >= 1000 THEN 'Medium'", meaning: "Otherwise, if the total is at least 1000, label it Medium." },
            { line: "ELSE 'Low'", meaning: "Use Low when neither earlier condition matches." },
            { line: "END AS order_band", meaning: "Finish CASE and name the calculated output column order_band." }
          ],
          input: [{ name: "orders", columns: ["order_id", "total_amount"], rows: [[1, 7200], [2, 2500], [3, 450]] }],
          output: { columns: ["order_id", "total_amount", "order_band"], rows: [[1, 7200, "High"], [2, 2500, "Medium"], [3, 450, "Low"]] },
          note: "Thresholds are example business rules. Adapt them to the actual data and requirements.",
          tryInLab: true
        },
        {
          title: "Sort with a custom priority",
          concept: "CASE can create a custom sort priority when alphabetical order is not the desired order.",
          analogy: "A support team may want urgent tickets first, followed by normal and low-priority tickets.",
          sql: "SELECT order_id, status\nFROM orders\nORDER BY CASE status\n  WHEN 'Pending' THEN 1\n  WHEN 'Processing' THEN 2\n  WHEN 'Completed' THEN 3\n  ELSE 4\nEND;",
          explanation: [
            { line: "CASE status", meaning: "Compare status with the listed values." },
            { line: "WHEN ... THEN ...", meaning: "Assign a numeric priority to each known status." },
            { line: "ORDER BY CASE ... END", meaning: "Sort by the calculated priority instead of the status text." }
          ],
          input: [{ name: "orders", columns: ["order_id", "status"], rows: [[1, "Completed"], [2, "Pending"], [3, "Processing"]] }],
          output: { columns: ["order_id", "status"], rows: [[2, "Pending"], [3, "Processing"], [1, "Completed"]] },
          tryInLab: true
        }
      ]
    },
    {
      heading: "2. Window functions — calculate across related rows",
      body: "A window function calculates a value using a set of related rows while keeping each individual row in the output. Unlike GROUP BY, which usually combines rows into one row per group, a window function can keep the original rows and add a calculated column. The OVER clause defines the window. PARTITION BY splits rows into groups, and ORDER BY sets their order inside each group. Availability and syntax depend on the database engine; modern SQLite supports common window functions.",
      examples: [
        {
          title: "Rank employees inside each department",
          concept: "ROW_NUMBER assigns a sequence number within each department.",
          analogy: "Create a separate numbered queue for each department rather than one queue for the entire company.",
          sql: "SELECT employee_id, name, department_id,\n  ROW_NUMBER() OVER (\n    PARTITION BY department_id\n    ORDER BY name\n  ) AS row_num\nFROM employees;",
          explanation: [
            { line: "ROW_NUMBER() OVER (...)", meaning: "Generate a sequential number for each row in the window." },
            { line: "PARTITION BY department_id", meaning: "Restart the numbering for each department." },
            { line: "ORDER BY name", meaning: "Number rows alphabetically within each department." },
            { line: "AS row_num", meaning: "Name the calculated column row_num." }
          ],
          input: [{ name: "employees", columns: ["employee_id", "name", "department_id"], rows: [[1, "Asha", 1], [2, "Ravi", 1], [3, "Noor", 2]] }],
          output: { columns: ["employee_id", "name", "department_id", "row_num"], rows: [[1, "Asha", 1, 1], [2, "Ravi", 1, 2], [3, "Noor", 2, 1]] },
          note: "The example output is illustrative. Use a deterministic ORDER BY column (ideally including a unique tie-breaker) when row order matters.",
          tryInLab: true
        },
        {
          title: "Calculate a running total",
          concept: "SUM(amount) OVER orders a cumulative sum while preserving one output row per order.",
          analogy: "As you read a dated statement, keep a running balance that grows with each transaction.",
          sql: "SELECT order_id, order_date, total_amount,\n  SUM(total_amount) OVER (\n    ORDER BY order_date, order_id\n    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW\n  ) AS running_total\nFROM orders;",
          explanation: [
            { line: "SUM(total_amount) OVER (...)", meaning: "Calculate a sum across the window without collapsing all rows into one." },
            { line: "ORDER BY order_date, order_id", meaning: "Define the order in which the running total accumulates; order_id breaks date ties." },
            { line: "ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW", meaning: "Include rows from the beginning through the current row." }
          ],
          input: [{ name: "orders", columns: ["order_id", "order_date", "total_amount"], rows: [[1, "2026-01-01", 100], [2, "2026-01-02", 250], [3, "2026-01-03", 50]] }],
          output: { columns: ["order_id", "order_date", "total_amount", "running_total"], rows: [[1, "2026-01-01", 100, 100], [2, "2026-01-02", 250, 350], [3, "2026-01-03", 50, 400]] },
          note: "Window frame syntax and defaults can differ by dialect. Explicit ROWS framing makes this running-total intention clearer.",
          tryInLab: true
        }
      ]
    },
    {
      heading: "3. NULL handling and safe comparisons",
      body: "NULL means a value is missing or unknown; it is not the same as zero or an empty string. Comparisons such as column = NULL do not work as expected. Use IS NULL or IS NOT NULL. COALESCE returns the first non-NULL expression and can provide a display fallback. Be careful with NOT IN when its list or subquery can contain NULL; NULL can make the comparison unknown. A NOT EXISTS pattern is often easier to reason about for anti-joins.",
      examples: [
        {
          title: "Find records with missing values",
          concept: "Use IS NULL to find rows where a value has not been recorded.",
          analogy: "Find forms where the phone-number field has been left blank in the database.",
          sql: "SELECT customer_id, name\nFROM customers\nWHERE email IS NULL;",
          explanation: [
            { line: "WHERE email IS NULL", meaning: "Select rows where email is missing as SQL NULL." },
            { line: "email = NULL", meaning: "Do not use this comparison to find NULLs; use IS NULL instead." }
          ],
          input: [{ name: "customers", columns: ["customer_id", "name", "email"], rows: [[1, "Asha", "asha@example.com"], [2, "Ravi", null]] }],
          output: { columns: ["customer_id", "name"], rows: [[2, "Ravi"]] },
          tryInLab: true
        },
        {
          title: "Display a fallback for missing values",
          concept: "COALESCE returns the first expression that is not NULL.",
          analogy: "If an email address is missing, display the words 'Not provided' instead.",
          sql: "SELECT customer_id, name,\n  COALESCE(email, 'Not provided') AS email_display\nFROM customers;",
          explanation: [
            { line: "COALESCE(email, 'Not provided')", meaning: "Return email if it is not NULL; otherwise return the fallback text." },
            { line: "AS email_display", meaning: "Give the calculated result a clear column name." }
          ],
          input: [{ name: "customers", columns: ["customer_id", "name", "email"], rows: [[1, "Asha", "asha@example.com"], [2, "Ravi", null]] }],
          output: { columns: ["customer_id", "name", "email_display"], rows: [[1, "Asha", "asha@example.com"], [2, "Ravi", "Not provided"]] },
          tryInLab: true
        }
      ]
    },
    {
      heading: "4. CTEs and readable multi-step queries",
      body: "A common table expression (CTE) is a named query result introduced with WITH. It exists for the duration of one statement and can make a long query easier to read by naming a step. A CTE is not automatically a permanent table, and whether it is materialized or inlined depends on the engine and query planner. Use clear names and keep each step focused.",
      examples: [
        {
          title: "Filter with a CTE, then report",
          concept: "Give a filtered result a name and query that result in the outer SELECT.",
          analogy: "First prepare a shortlist of high-value orders, then create the final report from that shortlist.",
          sql: "WITH high_value_orders AS (\n  SELECT order_id, customer_id, total_amount\n  FROM orders\n  WHERE total_amount >= 1000\n)\nSELECT order_id, customer_id, total_amount\nFROM high_value_orders\nORDER BY total_amount DESC;",
          explanation: [
            { line: "WITH high_value_orders AS (...)", meaning: "Define a named result for this statement." },
            { line: "WHERE total_amount >= 1000", meaning: "Keep only orders meeting the example threshold." },
            { line: "FROM high_value_orders", meaning: "Use the CTE in the main query." },
            { line: "ORDER BY total_amount DESC", meaning: "Show larger orders first." }
          ],
          input: [{ name: "orders", columns: ["order_id", "customer_id", "total_amount"], rows: [[1, 4, 500], [2, 5, 2000], [3, 4, 1500]] }],
          output: { columns: ["order_id", "customer_id", "total_amount"], rows: [[2, 5, 2000], [3, 4, 1500]] },
          tryInLab: true
        }
      ]
    },
    {
      heading: "5. Final revision and responsible SQL habits",
      body: "Before submitting a query, check that it returns the intended columns and rows. Confirm JOIN conditions to avoid accidental row multiplication. Use WHERE to filter rows before grouping, HAVING to filter groups, and ORDER BY to make output order explicit. For INSERT, UPDATE and DELETE, verify target rows first and use transactions only when supported. Never build SQL by concatenating untrusted user input in an application; use parameterized queries. The SQLWhale final assessment covers the full learning path, not only advanced syntax.",
      examples: [
        {
          title: "A final multi-topic report",
          concept: "Combine a join, an aggregate, filtering and sorting in one readable report.",
          analogy: "A final business report connects each order to its customer, totals their spending and sorts the biggest totals first.",
          sql: "SELECT c.customer_id, c.name,\n  SUM(o.total_amount) AS total_spent\nFROM customers AS c\nJOIN orders AS o\n  ON o.customer_id = c.customer_id\nGROUP BY c.customer_id, c.name\nHAVING SUM(o.total_amount) >= 1000\nORDER BY total_spent DESC;",
          explanation: [
            { line: "JOIN orders AS o ON ...", meaning: "Match each order to its customer using the relationship key." },
            { line: "SUM(o.total_amount)", meaning: "Add up order amounts for each customer." },
            { line: "GROUP BY c.customer_id, c.name", meaning: "Produce one result row per customer." },
            { line: "HAVING SUM(...) >= 1000", meaning: "Keep groups whose total meets the example threshold." },
            { line: "ORDER BY total_spent DESC", meaning: "Show the highest totals first." }
          ],
          input: [
            { name: "customers", columns: ["customer_id", "name"], rows: [[1, "Asha"], [2, "Ravi"]] },
            { name: "orders", columns: ["order_id", "customer_id", "total_amount"], rows: [[1, 1, 700], [2, 1, 500], [3, 2, 300]] }
          ],
          output: { columns: ["customer_id", "name", "total_spent"], rows: [[1, "Asha", 1200]] },
          note: "This final example assumes customers.customer_id and orders.customer_id are related columns. Adapt identifiers to the Query Lab schema.",
          tryInLab: true
        }
      ]
    }
  ],
  cheatSheet: [
    { keyword: "CASE", meaning: "Returns a value based on the first matching condition.", example: "CASE WHEN score >= 50 THEN 'Pass' ELSE 'Retry' END" },
    { keyword: "ROW_NUMBER()", meaning: "Assigns sequential row numbers inside a window.", example: "ROW_NUMBER() OVER (PARTITION BY department_id ORDER BY name)" },
    { keyword: "OVER", meaning: "Defines the window used by a window function.", example: "SUM(amount) OVER (ORDER BY order_date)" },
    { keyword: "PARTITION BY", meaning: "Splits a window into groups without collapsing rows.", example: "PARTITION BY department_id" },
    { keyword: "IS NULL", meaning: "Checks whether a value is SQL NULL.", example: "WHERE email IS NULL" },
    { keyword: "COALESCE", meaning: "Returns the first non-NULL expression.", example: "COALESCE(email, 'Not provided')" },
    { keyword: "WITH (CTE)", meaning: "Names a query result for one statement.", example: "WITH recent AS (SELECT * FROM orders) SELECT * FROM recent;" },
    { keyword: "HAVING", meaning: "Filters groups after aggregation.", example: "HAVING COUNT(*) >= 2" },
    { keyword: "Parameterized query", meaning: "Passes values separately from SQL text to avoid treating input as SQL code.", example: "SELECT * FROM users WHERE id = ?" },
    { keyword: "EXPLAIN QUERY PLAN", meaning: "SQLite-specific high-level query plan inspection.", example: "EXPLAIN QUERY PLAN SELECT * FROM orders;" }
  ],
  mistakes: [
    { mistake: "Using = NULL to search for missing values.", tip: "Use IS NULL or IS NOT NULL." },
    { mistake: "Assuming a window function reduces rows like GROUP BY.", tip: "Window functions usually preserve each row and add a calculated value." },
    { mistake: "Using ROW_NUMBER without a deterministic sort when exact ranking matters.", tip: "Add a stable tie-breaker such as a unique ID to the window ORDER BY." },
    { mistake: "Assuming all database engines support exactly the same advanced syntax.", tip: "Check the dialect; this course's Query Lab uses SQLite and examples should be adapted for other engines." },
    { mistake: "Using NOT IN when the subquery can return NULL.", tip: "Consider NOT EXISTS and test the NULL behavior explicitly." },
    { mistake: "Concatenating raw user input into SQL in application code.", tip: "Use parameterized queries or prepared statements." },
    { mistake: "Submitting a query without checking joins and output.", tip: "Validate join keys, sample rows, duplicate counts and the intended columns before trusting a result." }
  ],
  exercises: [
    { question: "Use CASE to label employees with salary >= 50000 as 'Senior' and all others as 'Standard'. Assume the table has employee_id and salary.", hint: "Use CASE WHEN ... THEN ... ELSE ... END.", answer: "SELECT employee_id, salary, CASE WHEN salary >= 50000 THEN 'Senior' ELSE 'Standard' END AS salary_band FROM employees;", explanation: "CASE calculates a label for each row without changing stored data. Adapt the column names to your actual schema." },
    { question: "Number employees alphabetically within each department using a window function.", hint: "Use ROW_NUMBER() OVER with PARTITION BY and ORDER BY.", answer: "SELECT employee_id, name, department_id, ROW_NUMBER() OVER (PARTITION BY department_id ORDER BY name, employee_id) AS row_num FROM employees;", explanation: "PARTITION BY restarts numbering for each department; employee_id provides a tie-breaker." },
    { question: "Find customers whose email is missing.", hint: "SQL NULL needs a special comparison.", answer: "SELECT customer_id, name FROM customers WHERE email IS NULL;", explanation: "IS NULL checks missing SQL values; = NULL does not." },
    { question: "Write a CTE named expensive_orders that selects orders with total_amount >= 1000, then list them highest first.", hint: "Start with WITH name AS (...).", answer: "WITH expensive_orders AS (SELECT order_id, total_amount FROM orders WHERE total_amount >= 1000) SELECT order_id, total_amount FROM expensive_orders ORDER BY total_amount DESC;", explanation: "The CTE names a filtered result for use in the outer query." },
    { question: "State two safe SQL practices for application code and destructive statements.", hint: "Think about user input and previewing target rows.", answer: "Use parameterized queries for user-supplied values; preview target rows with SELECT before UPDATE or DELETE and use transactions where supported.", explanation: "Parameterized queries reduce SQL injection risk. Previewing and transaction discipline reduce accidental data changes." }
  ],
  quiz: [
    { question: "What does CASE do in a SELECT query?", options: ["Permanently changes a table", "Returns a value based on conditions", "Creates an index", "Combines two databases automatically"], answer: 1, explanation: "CASE returns the result for the first WHEN condition that matches, or ELSE if none match." },
    { question: "How does a typical window function differ from GROUP BY?", options: ["A window function always deletes rows", "GROUP BY always preserves every original row", "A window function can add a calculation while preserving individual rows", "They are identical in every case"], answer: 2, explanation: "Window functions calculate across related rows while usually keeping each row; GROUP BY combines rows into groups." },
    { question: "Which condition correctly finds NULL email values?", options: ["email = NULL", "email IS NULL", "email == EMPTY", "email EQUALS NULL"], answer: 1, explanation: "Use IS NULL to test for SQL NULL values." },
    { question: "What is a CTE introduced with?", options: ["WITH", "CREATE INDEX", "ALTER", "COMMIT"], answer: 0, explanation: "A common table expression is named in a WITH clause and is available to the statement that follows." },
    { question: "What is the recommended way to handle user-provided values in application SQL?", options: ["Concatenate values directly into SQL", "Remove all quotation marks", "Use parameterized queries or prepared statements", "Trust the browser to validate every value"], answer: 2, explanation: "Parameterized queries keep values separate from SQL code and help prevent SQL injection." }
  ]
};

export default moduleTen;
