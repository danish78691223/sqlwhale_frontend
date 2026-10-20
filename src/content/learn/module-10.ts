import type { LessonModule } from "./types";

const moduleTen: LessonModule = {
  id: 10,
  title: "Advanced SQL & Final Revision",
  difficulty: "Advanced",
  estimatedTime: "60–75 minutes",
  summary: "Combine CTEs, subqueries, window functions, joins and safe SQL habits in realistic reporting queries, then prepare for the final assessment.",
  outcomes: [
    "Use CTEs to split complex queries into readable steps.",
    "Use scalar and correlated subqueries to answer nested questions.",
    "Apply window functions without collapsing individual rows.",
    "Combine JOIN, GROUP BY, HAVING and ORDER BY in reports.",
    "Review SQL safety, dialect differences and final assessment requirements."
  ],
  analogy: "Advanced SQL is like preparing a detailed report from several smaller worksheets. CTEs name the steps, subqueries answer smaller questions, and window functions add context to each row while keeping the rows visible.",
  sections: [
    {
      heading: "1. Common Table Expressions (CTEs)",
      body: "A CTE is a named temporary result used by one SQL statement. It starts with WITH and can make a complicated query easier to read. A CTE is not a permanently saved table. Build the intermediate result first, then query it in the main SELECT.",
      examples: [
        {
          title: "Count employees per department and filter the counts",
          concept: "The CTE calculates a count for each department; the outer query selects departments with at least two employees.",
          analogy: "Make a summary sheet first, then use that sheet to select the departments you want to report.",
          sql: "WITH department_counts AS (\n  SELECT department_id, COUNT(*) AS employee_count\n  FROM employees\n  GROUP BY department_id\n)\nSELECT department_id, employee_count\nFROM department_counts\nWHERE employee_count >= 2\nORDER BY employee_count DESC;",
          explanation: [
            { line: "WITH department_counts AS (...)", meaning: "Give the intermediate result a readable name." },
            { line: "COUNT(*) AS employee_count", meaning: "Count rows and name the calculated column." },
            { line: "GROUP BY department_id", meaning: "Calculate one count per department." },
            { line: "WHERE employee_count >= 2", meaning: "Filter the CTE output to departments with at least two employees." },
            { line: "ORDER BY employee_count DESC", meaning: "Show larger counts first." }
          ],
          input: [{ name: "employees", columns: ["employee_id", "name", "department_id"], rows: [[1, "Asha", 2], [2, "Ravi", 1], [3, "Noor", 2]] }],
          output: { columns: ["department_id", "employee_count"], rows: [[2, 2]] },
          note: "Illustrative output; your Query Lab results depend on its actual data.",
          tryInLab: true
        }
      ]
    },
    {
      heading: "2. Scalar and correlated subqueries",
      body: "A subquery is a query nested inside another statement. A scalar subquery returns one value, such as an average. A correlated subquery refers to a column from the outer query, so its result depends on the current outer row. Use table aliases to make the relationship clear.",
      examples: [
        {
          title: "Find employees earning above the overall average",
          concept: "The inner SELECT calculates one average salary; the outer query compares every employee's salary to it.",
          analogy: "Calculate the class average, then find the students whose scores are higher.",
          sql: "SELECT employee_id, name, salary\nFROM employees\nWHERE salary > (\n  SELECT AVG(salary)\n  FROM employees\n)\nORDER BY salary DESC;",
          explanation: [
            { line: "SELECT AVG(salary) ...", meaning: "The subquery returns one average salary value." },
            { line: "WHERE salary > (...)", meaning: "Keep rows whose salary is greater than that value." },
            { line: "ORDER BY salary DESC", meaning: "Sort the matching employees from highest salary down." }
          ],
          input: [{ name: "employees", columns: ["employee_id", "name", "salary"], rows: [[1, "Asha", 30000], [2, "Ravi", 50000], [3, "Noor", 70000]] }],
          output: { columns: ["employee_id", "name", "salary"], rows: [[3, "Noor", 70000]] },
          note: "This example assumes salary is a numeric column in employees. Adapt it if your sandbox stores salaries separately.",
          tryInLab: true
        },
        {
          title: "Find departments that have at least one employee",
          concept: "EXISTS is true when the inner query finds one or more matching rows.",
          analogy: "For each department, check whether its employee list has at least one entry.",
          sql: "SELECT d.department_id, d.department_name\nFROM departments AS d\nWHERE EXISTS (\n  SELECT 1\n  FROM employees AS e\n  WHERE e.department_id = d.department_id\n);",
          explanation: [
            { line: "FROM departments AS d", meaning: "Check each department as an outer row." },
            { line: "WHERE EXISTS (...)", meaning: "Keep a department if the inner query finds a match." },
            { line: "e.department_id = d.department_id", meaning: "Match the employee's department to the current department." },
            { line: "SELECT 1", meaning: "The value itself does not matter; EXISTS checks whether a row exists." }
          ],
          input: [
            { name: "departments", columns: ["department_id", "department_name"], rows: [[1, "Sales"], [2, "Support"], [3, "Research"]] },
            { name: "employees", columns: ["employee_id", "department_id"], rows: [[1, 1], [2, 1], [3, 3]] }
          ],
          output: { columns: ["department_id", "department_name"], rows: [[1, "Sales"], [3, "Research"]] },
          note: "Check your actual department column names before running this example.",
          tryInLab: true
        }
      ]
    },
    {
      heading: "3. Window functions",
      body: "A window function calculates a value across related rows while usually keeping each row in the result. GROUP BY combines rows into group-level results; a window function adds a calculated column beside individual rows. OVER defines the window and PARTITION BY splits it into groups.",
      examples: [
        {
          title: "Rank employees within each department",
          concept: "ROW_NUMBER starts a separate sequence for each department and orders employees by salary.",
          analogy: "Create a separate ranked list for every department.",
          sql: "SELECT employee_id, name, department_id, salary,\n  ROW_NUMBER() OVER (\n    PARTITION BY department_id\n    ORDER BY salary DESC, employee_id\n  ) AS department_rank\nFROM employees;",
          explanation: [
            { line: "ROW_NUMBER() OVER (...)", meaning: "Create a row number inside each window." },
            { line: "PARTITION BY department_id", meaning: "Restart numbering for each department." },
            { line: "ORDER BY salary DESC, employee_id", meaning: "Rank higher salaries first and use employee_id to break ties consistently." },
            { line: "AS department_rank", meaning: "Name the new calculated output column." }
          ],
          input: [{ name: "employees", columns: ["employee_id", "name", "department_id", "salary"], rows: [[1, "Asha", 2, 50000], [2, "Ravi", 2, 40000], [3, "Noor", 1, 60000]] }],
          output: { columns: ["employee_id", "name", "department_id", "salary", "department_rank"], rows: [[1, "Asha", 2, 50000, 1], [2, "Ravi", 2, 40000, 2], [3, "Noor", 1, 60000, 1]] },
          note: "Window functions are supported by current SQLite versions and many other engines, but confirm your SQL engine version.",
          tryInLab: true
        },
        {
          title: "Show the department average beside each employee",
          concept: "AVG with OVER adds the department average to every employee row rather than collapsing the department into one row.",
          analogy: "Each employee keeps their own salary and sees the department average beside it.",
          sql: "SELECT employee_id, name, department_id, salary,\n  AVG(salary) OVER (PARTITION BY department_id) AS department_avg\nFROM employees\nORDER BY department_id, employee_id;",
          explanation: [
            { line: "AVG(salary) OVER (...)", meaning: "Calculate a window average." },
            { line: "PARTITION BY department_id", meaning: "Calculate a separate average for each department." },
            { line: "ORDER BY department_id, employee_id", meaning: "Sort the final output for easier reading." }
          ],
          input: [{ name: "employees", columns: ["employee_id", "name", "department_id", "salary"], rows: [[1, "Asha", 2, 50000], [2, "Ravi", 2, 40000], [3, "Noor", 1, 60000]] }],
          output: { columns: ["employee_id", "name", "department_id", "salary", "department_avg"], rows: [[3, "Noor", 1, 60000, 60000], [1, "Asha", 2, 50000, 45000], [2, "Ravi", 2, 40000, 45000]] },
          tryInLab: true
        }
      ]
    },
    {
      heading: "4. Combine joins and aggregation in reports",
      body: "Reporting queries often join related tables, group matching rows, calculate totals and sort the results. Always confirm the join keys and the expected number of rows before aggregating. A one-to-many join can multiply rows, which may inflate totals if the relationship is misunderstood.",
      examples: [
        {
          title: "Calculate total order value by customer",
          concept: "Join orders to customers, aggregate each customer's orders, and sort by total spend.",
          analogy: "Match each receipt to its customer, total the receipts, then sort customers by their totals.",
          sql: "SELECT c.customer_id, c.customer_name,\n  SUM(o.total_amount) AS total_spent,\n  COUNT(o.order_id) AS order_count\nFROM customers AS c\nJOIN orders AS o\n  ON o.customer_id = c.customer_id\nGROUP BY c.customer_id, c.customer_name\nORDER BY total_spent DESC;",
          explanation: [
            { line: "JOIN orders AS o", meaning: "Combine each customer with matching orders." },
            { line: "ON o.customer_id = c.customer_id", meaning: "Match an order to the customer who placed it." },
            { line: "SUM(o.total_amount)", meaning: "Add the order totals for each customer." },
            { line: "COUNT(o.order_id)", meaning: "Count matching orders for each customer." },
            { line: "GROUP BY ...", meaning: "Produce one summary row per customer." },
            { line: "ORDER BY total_spent DESC", meaning: "Sort highest spending customers first." }
          ],
          input: [
            { name: "customers", columns: ["customer_id", "customer_name"], rows: [[1, "Asha"], [2, "Ravi"]] },
            { name: "orders", columns: ["order_id", "customer_id", "total_amount"], rows: [[101, 1, 100], [102, 1, 50], [103, 2, 80]] }
          ],
          output: { columns: ["customer_id", "customer_name", "total_spent", "order_count"], rows: [[1, "Asha", 150, 2], [2, "Ravi", 80, 1]] },
          note: "Illustrative output; ensure these columns exist in the Query Lab schema.",
          tryInLab: true
        },
        {
          title: "Find customers with no orders",
          concept: "A LEFT JOIN preserves every customer. When no order matches, the order columns are NULL.",
          analogy: "Compare the full customer list with the orders list and keep customers with no matching receipt.",
          sql: "SELECT c.customer_id, c.customer_name\nFROM customers AS c\nLEFT JOIN orders AS o\n  ON o.customer_id = c.customer_id\nWHERE o.order_id IS NULL;",
          explanation: [
            { line: "LEFT JOIN orders AS o", meaning: "Keep every customer even if they have no orders." },
            { line: "ON o.customer_id = c.customer_id", meaning: "Match each order to its customer." },
            { line: "WHERE o.order_id IS NULL", meaning: "Keep only customers without a matching order." }
          ],
          input: [
            { name: "customers", columns: ["customer_id", "customer_name"], rows: [[1, "Asha"], [2, "Ravi"], [3, "Noor"]] },
            { name: "orders", columns: ["order_id", "customer_id"], rows: [[101, 1], [102, 2]] }
          ],
          output: { columns: ["customer_id", "customer_name"], rows: [[3, "Noor"]] },
          tryInLab: true
        }
      ]
    },
    {
      heading: "5. Safe SQL and final assessment preparation",
      body: "Advanced SQL includes safe habits as well as advanced syntax. In applications, use parameterized queries instead of joining untrusted input into SQL strings. Before UPDATE or DELETE, run a SELECT with the same WHERE condition to preview affected rows. SQL dialect means the syntax supported by a particular database: LIMIT is common in SQLite and PostgreSQL, while SQL Server commonly uses TOP or OFFSET/FETCH. SQLWhale's final assessment is worth 50 marks; at least 40 marks are required to pass.",
      examples: [
        {
          title: "Preview rows before a data change",
          concept: "Use a read-only SELECT to confirm the rows you intend to update or delete.",
          analogy: "Review the exact entries on a confirmation screen before committing a change.",
          sql: "SELECT employee_id, name\nFROM employees\nWHERE department_id = 4;\n\n-- Review the rows before running UPDATE or DELETE.",
          explanation: [
            { line: "SELECT employee_id, name", meaning: "Display identifiers and names for review." },
            { line: "WHERE department_id = 4", meaning: "Limit the preview to the intended department." },
            { line: "-- comment", meaning: "A line starting with -- is a comment, not an executable command." }
          ],
          input: [{ name: "employees", columns: ["employee_id", "name", "department_id"], rows: [[1, "Asha", 4], [2, "Ravi", 1]] }],
          output: { columns: ["employee_id", "name"], rows: [[1, "Asha"]] },
          note: "This is a read-only query; it does not change data.",
          tryInLab: true
        }
      ]
    }
  ],
  cheatSheet: [
    { keyword: "CTE", meaning: "A named temporary result for one SQL statement.", example: "WITH x AS (SELECT department_id FROM employees) SELECT * FROM x;" },
    { keyword: "Scalar subquery", meaning: "A nested query that returns one value.", example: "WHERE salary > (SELECT AVG(salary) FROM employees)" },
    { keyword: "EXISTS", meaning: "Checks whether a subquery returns at least one row.", example: "WHERE EXISTS (SELECT 1 FROM employees e WHERE e.department_id = d.department_id)" },
    { keyword: "OVER", meaning: "Defines the window used for a window function.", example: "AVG(salary) OVER (PARTITION BY department_id)" },
    { keyword: "PARTITION BY", meaning: "Splits rows into windows for calculations.", example: "ROW_NUMBER() OVER (PARTITION BY department_id ORDER BY salary DESC)" },
    { keyword: "LEFT JOIN", meaning: "Keeps every row from the left table, even without a match.", example: "FROM customers c LEFT JOIN orders o ON o.customer_id = c.customer_id" },
    { keyword: "Parameterized query", meaning: "Passes user values separately from SQL text.", example: "SELECT * FROM users WHERE user_id = ?;" },
    { keyword: "SQL dialect", meaning: "Syntax and features supported by a particular database engine.", example: "LIMIT in SQLite/PostgreSQL; TOP in SQL Server." }
  ],
  mistakes: [
    { mistake: "Writing one huge nested query that is difficult to understand.", tip: "Break logical steps into CTEs with meaningful names." },
    { mistake: "Forgetting which outer row a correlated subquery refers to.", tip: "Use clear table aliases and test the subquery on a small example." },
    { mistake: "Expecting a window function to collapse rows like GROUP BY.", tip: "Window functions usually keep individual rows and add a calculated column." },
    { mistake: "Using ROW_NUMBER without a stable tie-breaker.", tip: "Add a unique ID to the window ORDER BY when deterministic ranking matters." },
    { mistake: "Getting inflated totals after a one-to-many join.", tip: "Check row multiplication and grouping level before calculating totals." },
    { mistake: "Assuming all database engines share identical syntax.", tip: "Check your SQL dialect, especially pagination, date functions and window support." },
    { mistake: "Concatenating untrusted input into SQL in an application.", tip: "Use parameterized queries to help prevent SQL injection." },
    { mistake: "Running UPDATE or DELETE without previewing target rows.", tip: "Run SELECT with the same WHERE condition first." }
  ],
  exercises: [
    { question: "Use a CTE to count employees per department and return only departments with more than two employees.", hint: "Use COUNT(*), GROUP BY and an outer WHERE.", answer: "WITH department_counts AS (SELECT department_id, COUNT(*) AS employee_count FROM employees GROUP BY department_id) SELECT department_id, employee_count FROM department_counts WHERE employee_count > 2;", explanation: "The CTE calculates one count per department; the outer query filters the grouped results." },
    { question: "Find employees earning more than the average salary.", hint: "Use AVG(salary) in a scalar subquery.", answer: "SELECT employee_id, name, salary FROM employees WHERE salary > (SELECT AVG(salary) FROM employees);", explanation: "The inner query returns one average value that the outer query compares against." },
    { question: "Rank employees within each department by salary, highest first.", hint: "Use ROW_NUMBER, OVER and PARTITION BY.", answer: "SELECT employee_id, name, department_id, salary, ROW_NUMBER() OVER (PARTITION BY department_id ORDER BY salary DESC, employee_id) AS department_rank FROM employees;", explanation: "PARTITION BY restarts ranking per department; employee_id provides a stable tie-breaker." },
    { question: "Find customers who have not placed orders.", hint: "Use LEFT JOIN and test the order ID for NULL.", answer: "SELECT c.customer_id, c.customer_name FROM customers AS c LEFT JOIN orders AS o ON o.customer_id = c.customer_id WHERE o.order_id IS NULL;", explanation: "The LEFT JOIN keeps customers with no match, and the NULL filter selects them." },
    { question: "Name two habits that make SQL applications safer.", hint: "Think about parameters and data-changing commands.", answer: "Use parameterized queries for user-supplied values and preview rows with SELECT before UPDATE or DELETE.", explanation: "Parameterization helps prevent SQL injection, while previewing and scoping changes reduces accidental modifications." }
  ],
  quiz: [
    { question: "What is a CTE?", options: ["A permanent table created by every SELECT", "A named temporary result used by one statement", "An automatic index", "A command to delete duplicates"], answer: 1, explanation: "A CTE is a named temporary result introduced with WITH and scoped to one SQL statement." },
    { question: "Which clause splits rows into separate windows for window-function calculations?", options: ["HAVING", "PARTITION BY", "LIMIT", "DISTINCT"], answer: 1, explanation: "PARTITION BY creates separate windows, such as one window per department." },
    { question: "How does a window function usually differ from GROUP BY?", options: ["It always removes NULL values", "It permanently changes the table", "It adds a calculation while keeping individual rows", "It cannot use ordering"], answer: 2, explanation: "Window functions normally retain the input rows, whereas GROUP BY combines rows into grouped output." },
    { question: "What is the recommended way to pass user values to SQL from application code?", options: ["Concatenate raw input into the SQL string", "Use parameterized queries", "Remove all WHERE clauses", "Always use SELECT *"], answer: 1, explanation: "Parameterized queries separate SQL structure from values and help protect against SQL injection." },
    { question: "What is the SQLWhale final assessment pass mark?", options: ["25/50", "30/50", "35/50", "40/50"], answer: 3, explanation: "The final assessment is worth 50 marks and requires at least 40 marks to pass." }
  ]
};

export default moduleTen;
