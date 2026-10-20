import type { LessonModule } from "./types";

const moduleSeven: LessonModule = {
  id: 7,
  title: "Subqueries, CTEs & Set Operations",
  difficulty: "Intermediate",
  estimatedTime: "55–65 minutes",
  summary: "Break complex questions into smaller queries, name reusable query results with CTEs, and combine compatible result sets safely.",
  outcomes: [
    "Explain a subquery as a query nested inside another SQL statement.",
    "Use scalar and IN subqueries to filter or compare data.",
    "Write a Common Table Expression (CTE) with WITH to make a query easier to read.",
    "Combine SELECT results with UNION and UNION ALL.",
    "Choose the right pattern and avoid common NULL, column-count and duplicate-row mistakes."
  ],
  analogy: "Think of a subquery as asking a helper to find a number before you answer the main question. A CTE is like giving that helper's result a clear name on a note. UNION is like combining two lists with the same columns into one list.",
  sections: [
    {
      heading: "1. What is a subquery?",
      body: "A subquery is a SELECT statement placed inside another SQL statement. The inner query produces information that the outer query uses. You may see subqueries inside WHERE, FROM or SELECT. Run the inner query alone first to understand what it returns. These examples use the SQLWhale SQLite sandbox's employees and salary tables; check Query Lab's schema if your column names differ.",
      examples: [
        {
          title: "Find employees paid more than the average salary",
          concept: "The inner query calculates one average amount. The outer query compares each employee's salary with that value.",
          analogy: "First calculate the class average, then list students whose marks are above it.",
          sql: "SELECT employee_id, amount\nFROM salary\nWHERE amount > (\n  SELECT AVG(amount)\n  FROM salary\n);",
          explanation: [
            { line: "SELECT AVG(amount)", meaning: "The inner query calculates the average of all non-NULL salary amounts." },
            { line: "FROM salary", meaning: "Read the amounts from the salary table." },
            { line: "WHERE amount > (...)", meaning: "Keep only salary rows whose amount is greater than the calculated average." },
            { line: "SELECT employee_id, amount", meaning: "Show the employee ID and salary amount for each matching row." }
          ],
          input: [{ name: "salary", columns: ["employee_id", "amount"], rows: [[1, 30000], [2, 40000], [3, 50000]] }],
          output: { columns: ["employee_id", "amount"], rows: [[3, 50000]] },
          tryInLab: true,
          note: "The sample input is illustrative. The live sandbox uses its own seeded rows, so the actual output may differ."
        },
        {
          title: "Find employees whose department is listed in departments",
          concept: "IN checks whether a value matches any value returned by the subquery.",
          analogy: "Check whether each department ID appears on an approved list.",
          sql: "SELECT employee_id, name, department_id\nFROM employees\nWHERE department_id IN (\n  SELECT department_id\n  FROM departments\n);",
          explanation: [
            { line: "SELECT department_id FROM departments", meaning: "The inner query returns the department IDs that exist in departments." },
            { line: "department_id IN (...)", meaning: "Keep an employee if their department ID appears in that list." },
            { line: "SELECT employee_id, name, department_id", meaning: "Return the selected details for matching employees." }
          ],
          input: [
            { name: "employees", columns: ["employee_id", "name", "department_id"], rows: [[1, "Asha", 1], [2, "Kabir", 8], [3, "Noor", 2]] },
            { name: "departments", columns: ["department_id"], rows: [[1], [2]] }
          ],
          output: { columns: ["employee_id", "name", "department_id"], rows: [[1, "Asha", 1], [3, "Noor", 2]] },
          tryInLab: true
        }
      ]
    },
    {
      heading: "2. Scalar subqueries and EXISTS",
      body: "A scalar subquery returns one value, such as an average or maximum, and can be used where a single value is expected. EXISTS tests whether the inner query returns at least one row. It is often useful when you only need to know whether a related record exists, not display that record. A scalar subquery should return one row and one column; multiple rows can cause an error or be handled differently by different database systems.",
      examples: [
        {
          title: "Show the highest salary next to each salary row",
          concept: "The scalar subquery returns one value: the maximum amount.",
          analogy: "Write the highest score on the board, then compare every score against that benchmark.",
          sql: "SELECT employee_id, amount,\n       (SELECT MAX(amount) FROM salary) AS highest_salary\nFROM salary;",
          explanation: [
            { line: "(SELECT MAX(amount) FROM salary)", meaning: "Calculate one maximum value from the salary table." },
            { line: "AS highest_salary", meaning: "Give the calculated output column a readable name." },
            { line: "FROM salary", meaning: "Return one result row for each salary record." }
          ],
          input: [{ name: "salary", columns: ["employee_id", "amount"], rows: [[1, 30000], [2, 50000]] }],
          output: { columns: ["employee_id", "amount", "highest_salary"], rows: [[1, 30000, 50000], [2, 50000, 50000]] },
          tryInLab: true
        },
        {
          title: "Find departments that have at least one employee",
          concept: "EXISTS is true if the correlated inner query finds a row. The inner query refers to the current department row.",
          analogy: "For each department, check whether at least one employee is registered in it.",
          sql: "SELECT d.department_id, d.department_name\nFROM departments AS d\nWHERE EXISTS (\n  SELECT 1\n  FROM employees AS e\n  WHERE e.department_id = d.department_id\n);",
          explanation: [
            { line: "FROM departments AS d", meaning: "Check each department as the outer query's current row." },
            { line: "WHERE EXISTS (...)", meaning: "Keep the department only if the inner query finds a matching employee." },
            { line: "e.department_id = d.department_id", meaning: "Correlate the inner query to the current department." },
            { line: "SELECT 1", meaning: "The value itself is not important; EXISTS checks whether a row exists." }
          ],
          input: [
            { name: "departments", columns: ["department_id", "department_name"], rows: [[1, "Sales"], [2, "IT"], [3, "HR"]] },
            { name: "employees", columns: ["name", "department_id"], rows: [["Asha", 1], ["Kabir", 2]] }
          ],
          output: { columns: ["department_id", "department_name"], rows: [[1, "Sales"], [2, "IT"]] },
          tryInLab: true,
          note: "This sample uses department_name. If the sandbox schema uses a different department-name column, select the actual column shown in Query Lab."
        }
      ]
    },
    {
      heading: "3. Common Table Expressions (CTEs) with WITH",
      body: "A Common Table Expression (CTE) is a named result set defined at the start of a statement using WITH. It exists for that statement, not as a permanent table. CTEs help split a long query into named steps, which can make it easier to read, test and maintain. In SQLite, a CTE can be used by the SELECT that follows it.",
      examples: [
        {
          title: "Name the average salary and use it in the main query",
          concept: "The CTE named average_pay calculates one average; the main SELECT reads that named result.",
          analogy: "Write the average on a labelled note first, then use the note when checking each salary.",
          sql: "WITH average_pay AS (\n  SELECT AVG(amount) AS avg_amount\n  FROM salary\n)\nSELECT s.employee_id, s.amount\nFROM salary AS s\nCROSS JOIN average_pay AS a\nWHERE s.amount > a.avg_amount;",
          explanation: [
            { line: "WITH average_pay AS (...)", meaning: "Create a temporary named result called average_pay for this statement." },
            { line: "SELECT AVG(amount) AS avg_amount", meaning: "Calculate the average and name its column avg_amount." },
            { line: "CROSS JOIN average_pay AS a", meaning: "Attach the one-row average result to each salary row." },
            { line: "WHERE s.amount > a.avg_amount", meaning: "Keep salary rows above the average." }
          ],
          input: [{ name: "salary", columns: ["employee_id", "amount"], rows: [[1, 30000], [2, 40000], [3, 50000]] }],
          output: { columns: ["employee_id", "amount"], rows: [[3, 50000]] },
          tryInLab: true,
          note: "A CTE is not a stored table. Its name is available only to the single statement immediately following the WITH clause."
        },
        {
          title: "Use a CTE to find high-value orders",
          concept: "The CTE first selects orders above a chosen threshold; the outer query presents the matching rows.",
          analogy: "Create a shortlist of orders over ₹1,000, then print the shortlist with customer and amount details.",
          sql: "WITH large_orders AS (\n  SELECT order_id, customer_id, total_amount\n  FROM orders\n  WHERE total_amount >= 1000\n)\nSELECT order_id, customer_id, total_amount\nFROM large_orders\nORDER BY total_amount DESC;",
          explanation: [
            { line: "WITH large_orders AS (...)", meaning: "Give the filtered order list the name large_orders." },
            { line: "WHERE total_amount >= 1000", meaning: "Keep orders whose amount is at least 1000." },
            { line: "FROM large_orders", meaning: "Read the rows produced by the CTE." },
            { line: "ORDER BY total_amount DESC", meaning: "Show the largest order amounts first." }
          ],
          input: [{ name: "orders", columns: ["order_id", "customer_id", "total_amount"], rows: [[101, 1, 450], [102, 2, 1200], [103, 1, 1800]] }],
          output: { columns: ["order_id", "customer_id", "total_amount"], rows: [[103, 1, 1800], [102, 2, 1200]] },
          tryInLab: true,
          note: "The orders example runs only if the Query Lab database has an orders table with these columns. If it does not, use the employees/salary examples above or inspect the schema first."
        }
      ]
    },
    {
      heading: "4. UNION and UNION ALL",
      body: "Set operations combine the results of multiple SELECT statements vertically, one result below another. Each SELECT must return the same number of columns in the same order, with compatible data types. UNION removes duplicate result rows. UNION ALL keeps duplicates and is often faster when duplicate removal is not needed. A set operation combines result rows; a JOIN combines columns from related rows.",
      examples: [
        {
          title: "Combine two employee name lists without duplicates",
          concept: "Both SELECT statements return one column with the same meaning. UNION combines them and removes duplicate names.",
          analogy: "Combine two attendee lists and keep each identical entry only once.",
          sql: "SELECT name AS person_name\nFROM employees\nWHERE department_id = 1\nUNION\nSELECT name AS person_name\nFROM employees\nWHERE department_id = 2\nORDER BY person_name;",
          explanation: [
            { line: "SELECT name AS person_name", meaning: "Return one column with a consistent output name." },
            { line: "UNION", meaning: "Append the second result and remove duplicate complete rows." },
            { line: "ORDER BY person_name", meaning: "Sort the combined result; put ORDER BY at the end of the whole set operation." }
          ],
          input: [{ name: "employees", columns: ["name", "department_id"], rows: [["Asha", 1], ["Kabir", 2], ["Asha", 2], ["Noor", 3]] }],
          output: { columns: ["person_name"], rows: [["Asha"], ["Kabir"]] },
          tryInLab: true,
          note: "For this illustrative input, Asha appears in both department lists but UNION returns that identical name once. Actual results depend on the sandbox's data."
        },
        {
          title: "Keep duplicates with UNION ALL",
          concept: "UNION ALL keeps every row from both SELECT statements, including identical values.",
          analogy: "Combine two sign-in sheets without deleting repeated names, because each entry may represent a separate visit.",
          sql: "SELECT name AS person_name FROM employees WHERE department_id = 1\nUNION ALL\nSELECT name AS person_name FROM employees WHERE department_id = 2;",
          explanation: [
            { line: "UNION ALL", meaning: "Append all rows and do not perform duplicate removal." },
            { line: "Same column count and order", meaning: "Both SELECT statements return one column representing a person's name." }
          ],
          input: [{ name: "employees", columns: ["name", "department_id"], rows: [["Asha", 1], ["Asha", 2], ["Kabir", 2]] }],
          output: { columns: ["person_name"], rows: [["Asha"], ["Asha"], ["Kabir"]] },
          tryInLab: true
        }
      ]
    },
    {
      heading: "5. Choosing the right pattern",
      body: "Use a scalar subquery when you need one calculated value, IN when you want to match a value against a list, and EXISTS when you need to test whether a related row exists. Use a CTE when a query has meaningful steps that deserve names. Use UNION when duplicate complete rows should be removed, and UNION ALL when every row should be retained. Keep the query understandable: run each inner SELECT separately, check the columns it returns, then assemble the full statement.",
      examples: [
        {
          title: "Use a CTE to make a two-step report readable",
          concept: "The first step filters salary records; the second step summarizes the filtered rows.",
          analogy: "First choose the relevant payslips, then calculate a summary from that smaller stack.",
          sql: "WITH eligible_salary AS (\n  SELECT employee_id, amount\n  FROM salary\n  WHERE amount >= 40000\n)\nSELECT COUNT(*) AS employees_at_or_above_threshold,\n       AVG(amount) AS average_amount\nFROM eligible_salary;",
          explanation: [
            { line: "eligible_salary AS (...)", meaning: "Filter the salary rows into a named intermediate result." },
            { line: "WHERE amount >= 40000", meaning: "Keep amounts at or above the threshold." },
            { line: "COUNT(*)", meaning: "Count the rows in the filtered result." },
            { line: "AVG(amount)", meaning: "Calculate the average amount among those filtered rows." }
          ],
          input: [{ name: "salary", columns: ["employee_id", "amount"], rows: [[1, 30000], [2, 40000], [3, 50000]] }],
          output: { columns: ["employees_at_or_above_threshold", "average_amount"], rows: [[2, 45000]] },
          tryInLab: true
        }
      ]
    }
  ],
  cheatSheet: [
    { keyword: "Subquery", meaning: "A query nested inside another SQL statement.", example: "WHERE amount > (SELECT AVG(amount) FROM salary)" },
    { keyword: "IN", meaning: "Checks whether a value matches any value in a list or subquery result.", example: "WHERE department_id IN (SELECT department_id FROM departments)" },
    { keyword: "EXISTS", meaning: "True when the inner query returns at least one row.", example: "WHERE EXISTS (SELECT 1 FROM employees WHERE ...)" },
    { keyword: "WITH", meaning: "Starts a named CTE for the statement that follows.", example: "WITH high_pay AS (SELECT ...)" },
    { keyword: "CTE", meaning: "A named temporary query result that improves readability.", example: "WITH recent_orders AS (...)" },
    { keyword: "UNION", meaning: "Combines compatible result sets and removes duplicate complete rows.", example: "SELECT name FROM a UNION SELECT name FROM b" },
    { keyword: "UNION ALL", meaning: "Combines compatible result sets and retains duplicates.", example: "SELECT name FROM a UNION ALL SELECT name FROM b" },
    { keyword: "Scalar subquery", meaning: "A subquery expected to return one value.", example: "(SELECT MAX(amount) FROM salary)" },
    { keyword: "Correlated subquery", meaning: "An inner query that refers to a row from the outer query.", example: "WHERE e.department_id = d.department_id" }
  ],
  mistakes: [
    { mistake: "Running a subquery that returns multiple rows where one value is expected.", tip: "Use an aggregate such as MAX or AVG, or use IN/EXISTS when multiple rows are intended." },
    { mistake: "Using NOT IN when the subquery can return NULL.", tip: "NULL can make NOT IN comparisons unknown; consider NOT EXISTS and test the relationship carefully." },
    { mistake: "Assuming a CTE is a permanent table.", tip: "A CTE exists only for the statement immediately following its WITH clause." },
    { mistake: "Combining SELECT statements with different column counts.", tip: "Make each SELECT return the same number of columns in the same order and use compatible data types." },
    { mistake: "Expecting UNION ALL to remove duplicates.", tip: "UNION removes duplicate complete rows; UNION ALL keeps them." },
    { mistake: "Adding ORDER BY inside each simple SELECT in a UNION without the correct structure.", tip: "Usually put one ORDER BY at the end to sort the combined result." },
    { mistake: "Using UNION when you actually need to combine columns from related tables.", tip: "Use JOIN to combine columns side by side; use UNION/UNION ALL to append rows." }
  ],
  exercises: [
    { question: "Find salary rows whose amount is greater than the average salary amount.", hint: "Use amount > (SELECT AVG(amount) FROM salary).", answer: "SELECT employee_id, amount FROM salary WHERE amount > (SELECT AVG(amount) FROM salary);", explanation: "The inner query returns one average value; the outer query filters amounts above that value." },
    { question: "List employees whose department_id appears in the departments table.", hint: "Use IN with a subquery returning department_id.", answer: "SELECT employee_id, name, department_id FROM employees WHERE department_id IN (SELECT department_id FROM departments);", explanation: "IN tests whether each employee's department ID appears in the returned list." },
    { question: "Use a CTE named high_salary to select salary rows with amount at least 40000.", hint: "Start with WITH high_salary AS (SELECT ...).", answer: "WITH high_salary AS (SELECT employee_id, amount FROM salary WHERE amount >= 40000) SELECT employee_id, amount FROM high_salary;", explanation: "The CTE names the filtered rows so the main query can read them clearly." },
    { question: "Combine two lists of employee names and remove duplicate result rows.", hint: "Use UNION between the two SELECT statements.", answer: "SELECT name FROM employees WHERE department_id = 1 UNION SELECT name FROM employees WHERE department_id = 2;", explanation: "UNION appends the two one-column results and removes duplicate complete rows." },
    { question: "Combine the same two name lists while retaining duplicate rows.", hint: "Replace UNION with UNION ALL.", answer: "SELECT name FROM employees WHERE department_id = 1 UNION ALL SELECT name FROM employees WHERE department_id = 2;", explanation: "UNION ALL preserves all rows from both SELECT statements, including repeated names." }
  ],
  quiz: [
    { question: "What is a subquery?", options: ["A query nested inside another SQL statement", "A table constraint", "A database login", "A command that sorts rows"], answer: 0, explanation: "A subquery is a query placed inside another query, for example inside WHERE or FROM." },
    { question: "Which keyword starts a Common Table Expression (CTE)?", options: ["LET", "WITH", "TEMP", "DEFINE"], answer: 1, explanation: "WITH introduces a named query expression that can be referenced by the statement that follows." },
    { question: "What does UNION do by default?", options: ["Keeps every duplicate row", "Combines compatible result sets and removes duplicates", "Joins tables using a foreign key", "Sorts each source table separately"], answer: 1, explanation: "UNION combines compatible SELECT results and removes duplicate rows; UNION ALL keeps duplicates." },
    { question: "What must be true of SELECT statements combined by UNION?", options: ["They must use the same table", "They must return the same number of columns with compatible types", "They must have identical WHERE clauses", "They must return exactly the same rows"], answer: 1, explanation: "Each SELECT in a set operation must return the same number of columns, in corresponding compatible types." },
    { question: "When is UNION ALL usually preferable to UNION?", options: ["When duplicate rows must be removed", "When you need a JOIN", "When duplicate rows should remain and deduplication is unnecessary", "When the query must update data"], answer: 2, explanation: "UNION ALL retains duplicates and can avoid the extra work needed to deduplicate results." }
  ]
};

export default moduleSeven;
