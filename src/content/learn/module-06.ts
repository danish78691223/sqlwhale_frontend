import type { LessonModule } from "./types";

const moduleSix: LessonModule = {
  id: 6,
  title: "JOINs & Relationships",
  difficulty: "Beginner–Intermediate",
  estimatedTime: "50–60 minutes",
  summary: "Connect related tables with JOINs, understand keys, and choose the right join for the question.",
  outcomes: [
    "Explain primary keys and foreign keys in simple words.",
    "Use INNER JOIN to return matching rows from related tables.",
    "Use LEFT JOIN to keep every row from the left table, even without a match.",
    "Join three tables and qualify columns with table aliases.",
    "Recognize duplicate rows and avoid accidental many-to-many results."
  ],
  analogy: "Imagine a college has one register with student details and another with course details. A student ID or course ID acts like a label that connects the registers. A JOIN combines the useful details into one result without manually copying them.",
  sections: [
    {
      heading: "1. Why do tables need relationships?",
      body: "A relational database stores different kinds of information in separate tables to reduce repetition. A primary key is a column (or set of columns) that uniquely identifies each row. A foreign key is a column that refers to a key in another table. The matching values let SQL connect the tables. In the SQLWhale SQLite sandbox, inspect the available table and column names in Query Lab before running examples; the sandbox seed includes employees, departments, projects and salary.",
      examples: [
        {
          title: "See employees with their department names",
          concept: "The employee record stores department_id; departments stores the readable department name.",
          analogy: "A student ID on an exam sheet can be looked up in the student register to find the student's name.",
          sql: "SELECT e.name, d.department_name\nFROM employees AS e\nINNER JOIN departments AS d\n  ON e.department_id = d.department_id;",
          explanation: [
            { line: "FROM employees AS e", meaning: "Start from employees and give this table the short alias e." },
            { line: "INNER JOIN departments AS d", meaning: "Connect departments and give it the alias d." },
            { line: "ON e.department_id = d.department_id", meaning: "Match rows whose department IDs are equal." },
            { line: "SELECT e.name, d.department_name", meaning: "Return the employee name and the matched department name." }
          ],
          input: [
            { name: "employees", columns: ["name", "department_id"], rows: [["Asha", 1], ["Kabir", 2], ["Noor", 9]] },
            { name: "departments", columns: ["department_id", "department_name"], rows: [[1, "Sales"], [2, "IT"], [3, "HR"]] }
          ],
          output: { columns: ["name", "department_name"], rows: [["Asha", "Sales"], ["Kabir", "IT"]] },
          tryInLab: true,
          note: "Column names can differ across schemas. If your departments table uses name instead of department_name, select d.name. Confirm the actual schema in Query Lab."
        }
      ]
    },
    {
      heading: "2. INNER JOIN: keep matching rows",
      body: "INNER JOIN returns a row only when the join condition finds a match on both sides. Rows without a matching partner are left out. The ON clause tells SQL how the tables are related. Always make the relationship explicit; joining without a correct condition can create a huge number of meaningless combinations.",
      examples: [
        {
          title: "Match each salary record to an employee",
          concept: "Use a shared employee_id to combine employee information with salary information.",
          analogy: "Only pair a payslip with an employee card when both have the same employee number.",
          sql: "SELECT e.name, s.amount\nFROM employees AS e\nINNER JOIN salary AS s\n  ON e.employee_id = s.employee_id;",
          explanation: [
            { line: "employees AS e", meaning: "Use e as a short name for employees." },
            { line: "INNER JOIN salary AS s", meaning: "Connect salary records using alias s." },
            { line: "ON e.employee_id = s.employee_id", meaning: "Match records with the same employee ID." },
            { line: "SELECT e.name, s.amount", meaning: "Show the employee name and the matching amount." }
          ],
          input: [
            { name: "employees", columns: ["employee_id", "name"], rows: [[1, "Asha"], [2, "Kabir"], [3, "Noor"]] },
            { name: "salary", columns: ["employee_id", "amount"], rows: [[1, 42000], [3, 51000], [4, 39000]] }
          ],
          output: { columns: ["name", "amount"], rows: [["Asha", 42000], ["Noor", 51000]] },
          tryInLab: true
        }
      ]
    },
    {
      heading: "3. LEFT JOIN: keep every row from the left table",
      body: "LEFT JOIN returns every row from the left (first) table. If the right table has no matching row, its columns appear as NULL. This is useful for finding employees without salary records or departments with no employees. Be careful when filtering right-table columns in WHERE: that filter can remove NULL rows and make the result behave like an INNER JOIN.",
      examples: [
        {
          title: "Find all employees, even if they have no salary row",
          concept: "The employee remains in the result even when there is no matching salary record.",
          analogy: "Make a list of every employee and attach a payslip if one exists; do not remove employees who have no payslip yet.",
          sql: "SELECT e.name, s.amount\nFROM employees AS e\nLEFT JOIN salary AS s\n  ON e.employee_id = s.employee_id\nORDER BY e.employee_id;",
          explanation: [
            { line: "FROM employees AS e", meaning: "Employees is the left table, so every employee is kept." },
            { line: "LEFT JOIN salary AS s", meaning: "Add salary details when a match exists." },
            { line: "ON e.employee_id = s.employee_id", meaning: "Match salary records to the employee ID." },
            { line: "ORDER BY e.employee_id", meaning: "Display the rows in employee ID order." }
          ],
          input: [
            { name: "employees", columns: ["employee_id", "name"], rows: [[1, "Asha"], [2, "Kabir"], [3, "Noor"]] },
            { name: "salary", columns: ["employee_id", "amount"], rows: [[1, 42000], [3, 51000]] }
          ],
          output: { columns: ["name", "amount"], rows: [["Asha", 42000], ["Kabir", null], ["Noor", 51000]] },
          tryInLab: true
        },
        {
          title: "Find employees with no matching salary record",
          concept: "After a LEFT JOIN, unmatched right-side values are NULL; test them with IS NULL.",
          analogy: "First make the full employee list with optional payslips, then select only the people whose payslip field is blank.",
          sql: "SELECT e.employee_id, e.name\nFROM employees AS e\nLEFT JOIN salary AS s\n  ON e.employee_id = s.employee_id\nWHERE s.employee_id IS NULL;",
          explanation: [
            { line: "LEFT JOIN salary AS s", meaning: "Keep every employee and attach a salary row if one matches." },
            { line: "WHERE s.employee_id IS NULL", meaning: "Keep only employees for whom the joined salary row was missing." },
            { line: "SELECT e.employee_id, e.name", meaning: "Show the ID and name of each unmatched employee." }
          ],
          input: [
            { name: "employees", columns: ["employee_id", "name"], rows: [[1, "Asha"], [2, "Kabir"], [3, "Noor"]] },
            { name: "salary", columns: ["employee_id", "amount"], rows: [[1, 42000], [3, 51000]] }
          ],
          output: { columns: ["employee_id", "name"], rows: [[2, "Kabir"]] },
          tryInLab: true
        }
      ]
    },
    {
      heading: "4. Join more than two tables",
      body: "You can add multiple JOIN clauses when information is spread across several tables. Each JOIN should have its own ON condition. Use aliases to keep long queries readable, and prefix columns with the table alias whenever two tables contain a column with the same name.",
      examples: [
        {
          title: "Combine employees, departments and salary",
          concept: "Join each table through the key that relates it to the next table.",
          analogy: "Use an employee ID to find the employee, the department ID to find their department, and the employee ID again to find their salary details.",
          sql: "SELECT e.name, d.department_name, s.amount\nFROM employees AS e\nLEFT JOIN departments AS d\n  ON e.department_id = d.department_id\nLEFT JOIN salary AS s\n  ON e.employee_id = s.employee_id\nORDER BY e.name;",
          explanation: [
            { line: "FROM employees AS e", meaning: "Begin with employees as the main list." },
            { line: "LEFT JOIN departments AS d", meaning: "Add department details where a matching department exists." },
            { line: "LEFT JOIN salary AS s", meaning: "Add salary details where a matching employee ID exists." },
            { line: "ORDER BY e.name", meaning: "Sort the combined result by employee name." }
          ],
          input: [
            { name: "employees", columns: ["employee_id", "name", "department_id"], rows: [[1, "Asha", 1], [2, "Kabir", 2]] },
            { name: "departments", columns: ["department_id", "department_name"], rows: [[1, "Sales"], [2, "IT"]] },
            { name: "salary", columns: ["employee_id", "amount"], rows: [[1, 42000]] }
          ],
          output: { columns: ["name", "department_name", "amount"], rows: [["Asha", "Sales", 42000], ["Kabir", "IT", null]] },
          tryInLab: true,
          note: "This example assumes the sandbox uses department_name in departments. Check Query Lab's actual column list and adjust that one selected column if necessary."
        }
      ]
    },
    {
      heading: "5. One-to-many relationships and duplicate-looking rows",
      body: "A JOIN returns a row for every matching pair. If one employee has three salary records, that employee can appear three times after the join. This is not automatically a bug; it reflects a one-to-many relationship. Decide whether you need every detail row or a summary. Use GROUP BY with an aggregate if you need one summary per employee.",
      examples: [
        {
          title: "Count salary records for each employee",
          concept: "JOIN connects the rows; GROUP BY then summarizes multiple matching rows.",
          analogy: "An employee may have several monthly payslips. Count the payslips to get one total per employee.",
          sql: "SELECT e.employee_id, e.name, COUNT(s.employee_id) AS salary_records\nFROM employees AS e\nLEFT JOIN salary AS s\n  ON e.employee_id = s.employee_id\nGROUP BY e.employee_id, e.name\nORDER BY e.employee_id;",
          explanation: [
            { line: "LEFT JOIN salary AS s", meaning: "Keep all employees and match any salary records." },
            { line: "COUNT(s.employee_id)", meaning: "Count matching salary rows; unmatched rows are NULL and are not counted." },
            { line: "GROUP BY e.employee_id, e.name", meaning: "Return one summary row for each employee." },
            { line: "ORDER BY e.employee_id", meaning: "Sort the summaries by employee ID." }
          ],
          input: [
            { name: "employees", columns: ["employee_id", "name"], rows: [[1, "Asha"], [2, "Kabir"]] },
            { name: "salary", columns: ["employee_id", "amount"], rows: [[1, 42000], [1, 44000]] }
          ],
          output: { columns: ["employee_id", "name", "salary_records"], rows: [[1, "Asha", 2], [2, "Kabir", 0]] },
          tryInLab: true
        }
      ]
    }
  ],
  cheatSheet: [
    { keyword: "INNER JOIN", meaning: "Keeps only rows with a match on both sides.", example: "FROM a INNER JOIN b ON a.id = b.id" },
    { keyword: "LEFT JOIN", meaning: "Keeps every left-side row and adds matching right-side values.", example: "FROM a LEFT JOIN b ON a.id = b.id" },
    { keyword: "ON", meaning: "States the condition that connects two tables.", example: "ON e.department_id = d.department_id" },
    { keyword: "AS", meaning: "Creates a temporary alias for a table or output column.", example: "FROM employees AS e" },
    { keyword: "Primary key", meaning: "A unique identifier for each row in a table.", example: "employees.employee_id" },
    { keyword: "Foreign key", meaning: "A column that refers to a key in a related table.", example: "employees.department_id" },
    { keyword: "IS NULL", meaning: "Tests whether a value is missing.", example: "WHERE s.employee_id IS NULL" },
    { keyword: "Qualified column", meaning: "A column prefixed with its table or alias to avoid ambiguity.", example: "e.name" }
  ],
  mistakes: [
    { mistake: "Joining on unrelated columns or forgetting the ON condition.", tip: "Identify the primary/foreign key relationship first, then compare the correct key columns." },
    { mistake: "Expecting INNER JOIN to keep unmatched rows.", tip: "Use LEFT JOIN when all rows from the left table must remain." },
    { mistake: "Using = NULL to find missing values.", tip: "Use IS NULL or IS NOT NULL; NULL is not compared with normal equality." },
    { mistake: "Seeing repeated employee names and assuming the JOIN is wrong.", tip: "Check whether the right table has multiple matching rows; one-to-many joins naturally return multiple pairs." },
    { mistake: "Writing an unqualified id column when both tables have id.", tip: "Use aliases such as e.employee_id and s.employee_id to make the source clear." },
    { mistake: "Filtering a LEFT JOIN's right-side column in WHERE and accidentally dropping unmatched rows.", tip: "If unmatched rows must remain, place suitable right-side restrictions in the ON condition or handle NULL explicitly." }
  ],
  exercises: [
    { question: "Show employee names with their department names using only matching records.", hint: "Use INNER JOIN and match department IDs.", answer: "SELECT e.name, d.department_name FROM employees AS e INNER JOIN departments AS d ON e.department_id = d.department_id;", explanation: "INNER JOIN keeps only employees with a matching department row." },
    { question: "List every employee and any matching salary amount, including employees without a salary record.", hint: "Keep employees as the left table.", answer: "SELECT e.name, s.amount FROM employees AS e LEFT JOIN salary AS s ON e.employee_id = s.employee_id;", explanation: "LEFT JOIN preserves all employee rows and fills unmatched salary values with NULL." },
    { question: "Find employees who have no matching salary record.", hint: "LEFT JOIN, then test a right-table key with IS NULL.", answer: "SELECT e.employee_id, e.name FROM employees AS e LEFT JOIN salary AS s ON e.employee_id = s.employee_id WHERE s.employee_id IS NULL;", explanation: "An unmatched right-side key is NULL after a LEFT JOIN." },
    { question: "Show each employee and the number of salary records associated with them.", hint: "LEFT JOIN, COUNT the right-side key, then GROUP BY employee.", answer: "SELECT e.employee_id, e.name, COUNT(s.employee_id) AS salary_records FROM employees AS e LEFT JOIN salary AS s ON e.employee_id = s.employee_id GROUP BY e.employee_id, e.name;", explanation: "COUNT(s.employee_id) ignores NULL values, so employees without salary records get zero." },
    { question: "Join employees to departments and return the department name for each employee. Sort by employee name.", hint: "Use aliases e and d, then ORDER BY e.name.", answer: "SELECT e.name, d.department_name FROM employees AS e LEFT JOIN departments AS d ON e.department_id = d.department_id ORDER BY e.name;", explanation: "LEFT JOIN keeps employees even when a department match is missing; ORDER BY sorts the result." }
  ],
  quiz: [
    { question: "What does INNER JOIN return?", options: ["Every row from the left table", "Only rows with a match on both sides", "Only rows with NULL values", "All possible row combinations"], answer: 1, explanation: "INNER JOIN returns pairs for which the ON condition matches." },
    { question: "Which JOIN keeps every row from the left table?", options: ["INNER JOIN", "CROSS JOIN", "LEFT JOIN", "SELF JOIN only"], answer: 2, explanation: "LEFT JOIN preserves all left-table rows and uses NULL for unmatched right-side columns." },
    { question: "How should SQL test whether a value is missing?", options: ["= NULL", "== NULL", "IS NULL", "NULL = TRUE"], answer: 2, explanation: "Use IS NULL because NULL represents an unknown or missing value." },
    { question: "Why can a person appear multiple times after a JOIN?", options: ["SQL always duplicates names", "A row may match multiple rows in the other table", "Aliases create copies", "ORDER BY duplicates rows"], answer: 1, explanation: "A one-to-many relationship creates one result row for each matching pair." },
    { question: "What is the purpose of the ON clause?", options: ["Sort the result", "Limit the number of rows", "Define how rows in the tables match", "Rename the database"], answer: 2, explanation: "ON contains the condition that relates rows from the joined tables." }
  ]
};

export default moduleSix;
