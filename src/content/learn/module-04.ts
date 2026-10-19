import type { LessonModule } from "./types";

const moduleFour: LessonModule = {
  id: 4,
  title: "Sorting, Limiting & Query Order",
  difficulty: "Beginner",
  estimatedTime: "40–50 minutes",
  summary: "Sort query results, choose a manageable number of rows, and understand the order SQL logically processes a SELECT statement.",
  outcomes: [
    "Sort results with ORDER BY using ASC and DESC.",
    "Sort by more than one column and make ordering predictable.",
    "Limit the number of rows returned using SQLite LIMIT.",
    "Use OFFSET to skip rows for simple pagination.",
    "Understand the logical processing order of a SELECT query and common dialect differences."
  ],
  analogy: "Imagine a teacher has a list of employees. ORDER BY sorts the list by salary or name; LIMIT asks to see only the first five entries; OFFSET skips the first few entries to continue reading the list. Sorting changes the display order, not the stored records.",
  sections: [
    {
      heading: "1. ORDER BY: put results in order",
      body: "ORDER BY sorts the rows returned by a query. ASC means ascending order (small to large, A to Z, oldest to newest) and is the default. DESC means descending order (large to small, Z to A, newest to oldest). Sorting a result does not permanently rearrange the table.",
      examples: [
        {
          title: "Sort employees by name",
          concept: "Use ASC to show names alphabetically.",
          analogy: "Like arranging a class register from A to Z.",
          sql: "SELECT employee_id, name\nFROM employees\nORDER BY name ASC;",
          explanation: [
            { line: "SELECT employee_id, name", meaning: "Choose the student ID and name for the result." },
            { line: "FROM employees", meaning: "Read records from the employees table." },
            { line: "ORDER BY name ASC;", meaning: "Sort names alphabetically. ASC is optional because ascending is the default." }
          ],
          input: [{ name: "employees", columns: ["employee_id", "name"], rows: [[3, "Zoya Shaikh"], [1, "Aarav Patil"], [2, "Meera Khan"]] }],
          output: { columns: ["employee_id", "name"], rows: [[1, "Aarav Patil"], [2, "Meera Khan"], [3, "Zoya Shaikh"]] },
          tryInLab: true
        },
        {
          title: "Show highest salary first",
          concept: "DESC places larger values before smaller values.",
          analogy: "Like showing a leaderboard from the highest score down.",
          sql: "SELECT employee_id, amount\nFROM salary\nORDER BY amount DESC;",
          explanation: [
            { line: "SELECT employee_id, name, salary", meaning: "Display each student's ID, name and salary." },
            { line: "FROM employees", meaning: "Use employees as the source table." },
            { line: "ORDER BY salary DESC;", meaning: "Sort from the highest salary to the lowest." }
          ],
          input: [{ name: "salary", columns: ["employee_id", "amount"], rows: [[1, 50000], [2, 45000], [3, 55000], [4, 60000]] }],
          output: { columns: ["employee_id", "amount"], rows: [[4, 60000], [3, 55000], [1, 50000], [2, 45000]] },
          tryInLab: true,
          note: "The salary table stores employee_id and amount. The Query Lab seed data includes these columns."
        },
        {
          title: "Sort by multiple columns",
          concept: "SQL sorts by the first key, then uses the next key to break ties.",
          analogy: "First sort by department, then sort people inside each department by name.",
          sql: "SELECT department_id, employee_id, name\nFROM employees\nORDER BY department_id ASC, name ASC;",
          explanation: [
            { line: "SELECT department_id, employee_id, name", meaning: "Choose the department, employee ID and name." },
            { line: "FROM employees", meaning: "Read the employee records." },
            { line: "ORDER BY department_id ASC, name ASC;", meaning: "Group the displayed order by department ID, then alphabetically by name within each department." }
          ],
          input: [{ name: "employees", columns: ["department_id", "employee_id", "name"], rows: [[2, 4, "Zoya"], [1, 2, "Meera"], [1, 1, "Aarav"]] }],
          output: { columns: ["department_id", "employee_id", "name"], rows: [[1, 1, "Aarav"], [1, 2, "Meera"], [2, 4, "Zoya"]] },
          tryInLab: true
        }
      ]
    },
    {
      heading: "2. LIMIT and OFFSET: return only the rows you need",
      body: "LIMIT caps how many rows appear in the result. OFFSET skips a number of rows before returning results. Always pair LIMIT with ORDER BY when you need repeatable results; without sorting, the database is not required to return rows in a particular order.",
      examples: [
        {
          title: "Show the top three employees",
          concept: "ORDER BY decides which rows come first; LIMIT chooses how many to show.",
          analogy: "Choose the top three entries from a ranked list.",
          sql: "SELECT employee_id, name\nFROM employees\nORDER BY employee_id ASC\nLIMIT 3;",
          explanation: [
            { line: "SELECT employee_id, name", meaning: "Return employee IDs and names." },
            { line: "FROM employees", meaning: "Read the employees table." },
            { line: "ORDER BY employee_id ASC", meaning: "Make the result order predictable by sorting IDs from low to high." },
            { line: "LIMIT 3;", meaning: "Return at most three rows." }
          ],
          input: [{ name: "employees", columns: ["employee_id", "name"], rows: [[3, "Zoya"], [1, "Aarav"], [2, "Meera"], [4, "Ishaan"]] }],
          output: { columns: ["employee_id", "name"], rows: [[1, "Aarav"], [2, "Meera"], [3, "Zoya"]] },
          tryInLab: true
        },
        {
          title: "Skip the first two rows",
          concept: "OFFSET is useful when showing results in pages.",
          analogy: "After viewing page one, skip its entries to see the next page.",
          sql: "SELECT employee_id, name\nFROM employees\nORDER BY employee_id ASC\nLIMIT 2 OFFSET 2;",
          explanation: [
            { line: "ORDER BY employee_id ASC", meaning: "Sort employees in a stable order first." },
            { line: "LIMIT 2 OFFSET 2;", meaning: "Skip the first two sorted rows and return the next two rows." }
          ],
          input: [{ name: "employees", columns: ["employee_id", "name"], rows: [[1, "Aarav"], [2, "Meera"], [3, "Zoya"], [4, "Ishaan"]] }],
          output: { columns: ["employee_id", "name"], rows: [[3, "Zoya"], [4, "Ishaan"]] },
          tryInLab: true,
          note: "SQLite supports LIMIT count OFFSET skip. Some systems use different syntax, such as SQL Server's OFFSET ... FETCH NEXT."
        }
      ]
    },
    {
      heading: "3. Logical query processing order",
      body: "SQL is written starting with SELECT, but the database reasons about a query in a different logical order. A useful simplified model is FROM (and JOIN), WHERE, GROUP BY, HAVING, SELECT, DISTINCT, ORDER BY, then LIMIT/OFFSET. This explains why a SELECT alias usually cannot be used in WHERE: WHERE is logically evaluated before the SELECT list is produced. Exact optimizer execution can differ, but the logical model helps explain query behavior.",
      examples: [
        {
          title: "Filter, sort and limit",
          concept: "The query first chooses its source rows, filters them, sorts the matches and then limits the result.",
          analogy: "First collect the class list, keep employees who meet the rule, rank them and then show only the first few.",
          sql: "SELECT employee_id, name\nFROM employees\nWHERE department_id = 1\nORDER BY name ASC\nLIMIT 5;",
          explanation: [
            { line: "FROM employees", meaning: "Identify the table that supplies the rows." },
            { line: "WHERE department_id = 1", meaning: "Keep only employees in department 1." },
            { line: "SELECT employee_id, name", meaning: "Choose the two columns to display in the output." },
            { line: "ORDER BY name ASC", meaning: "Sort matching employees by name." },
            { line: "LIMIT 5;", meaning: "Display no more than five matching employees." }
          ],
          input: [{ name: "employees", columns: ["employee_id", "name", "department_id"], rows: [[1, "Meera", 1], [2, "Aarav", 1], [3, "Zoya", 2], [4, "Ishaan", 1]] }],
          output: { columns: ["employee_id", "name"], rows: [[2, "Aarav"], [4, "Ishaan"], [1, "Meera"]] },
          tryInLab: true
        }
      ]
    }
  ],
  cheatSheet: [
    { keyword: "ORDER BY", meaning: "Sort result rows.", example: "ORDER BY name ASC" },
    { keyword: "ASC", meaning: "Ascending order; the default.", example: "ORDER BY salary ASC" },
    { keyword: "DESC", meaning: "Descending order.", example: "ORDER BY salary DESC" },
    { keyword: "LIMIT", meaning: "Return at most a chosen number of rows in SQLite.", example: "LIMIT 10" },
    { keyword: "OFFSET", meaning: "Skip rows before returning the limited result.", example: "LIMIT 10 OFFSET 10" },
    { keyword: "Tie-breaker", meaning: "A second sort column used when values in the first sort column match.", example: "ORDER BY department_id, name" }
  ],
  mistakes: [
    { mistake: "Expecting rows to stay sorted without ORDER BY.", tip: "Always write ORDER BY when the order matters; tables do not promise a default order." },
    { mistake: "Using LIMIT without sorting when asking for the top or latest records.", tip: "Sort by the value that defines 'top' or 'latest', then apply LIMIT." },
    { mistake: "Thinking ORDER BY changes how data is stored.", tip: "ORDER BY changes only the query result, not the underlying table." },
    { mistake: "Assuming LIMIT syntax works in every database.", tip: "SQLWhale uses SQLite syntax. SQL Server commonly uses TOP or OFFSET ... FETCH; syntax varies by engine." },
    { mistake: "Sorting only by a non-unique value and expecting a fixed order for ties.", tip: "Add a unique tie-breaker such as employee_id to make ordering deterministic." }
  ],
  exercises: [
    { question: "Show all employees sorted by name from A to Z.", hint: "Use ORDER BY name ASC.", answer: "SELECT * FROM employees ORDER BY name ASC;", explanation: "ASC sorts names alphabetically. It can be omitted because it is the default." },
    { question: "Show the five employees with the highest employee_id values.", hint: "Sort the ID descending before limiting.", answer: "SELECT * FROM employees ORDER BY employee_id DESC LIMIT 5;", explanation: "DESC puts the largest IDs first; LIMIT returns at most five rows." },
    { question: "Show the first three rows from departments in ascending department_id order.", hint: "Sort, then use LIMIT 3.", answer: "SELECT * FROM departments ORDER BY department_id ASC LIMIT 3;", explanation: "ORDER BY defines the first rows; LIMIT caps the output at three." },
    { question: "Show two employees after skipping the first two employees in employee_id order.", hint: "Use LIMIT 2 OFFSET 2.", answer: "SELECT * FROM employees ORDER BY employee_id ASC LIMIT 2 OFFSET 2;", explanation: "OFFSET skips two sorted rows, then LIMIT returns the next two." },
    { question: "Sort employees by department_id ascending and then employee_id descending.", hint: "Each sort column can have its own direction.", answer: "SELECT * FROM employees ORDER BY department_id ASC, employee_id DESC;", explanation: "Rows are ordered by department first; within a department, higher employee IDs come first." }
  ],
  quiz: [
    { question: "Which clause sorts the rows returned by a query?", options: ["WHERE", "ORDER BY", "LIMIT", "FROM"], answer: 1, explanation: "ORDER BY sorts the result rows." },
    { question: "What is the default sort direction if ASC or DESC is omitted?", options: ["DESC", "Random", "ASC", "No rows"], answer: 2, explanation: "Ascending order is the default." },
    { question: "Which query returns the three highest salary first?", options: ["SELECT * FROM employees LIMIT 3 ORDER BY salary DESC;", "SELECT * FROM employees ORDER BY salary DESC LIMIT 3;", "SELECT * FROM employees WHERE LIMIT 3;", "SELECT * FROM employees ORDER BY salary LIMIT DESC 3;"], answer: 1, explanation: "Sort the salary descending, then limit the output to three rows." },
    { question: "What does LIMIT 2 OFFSET 2 do in SQLite?", options: ["Returns two rows, skipping the first two rows", "Skips two rows and returns all remaining rows", "Returns only the first two rows", "Deletes two rows"], answer: 0, explanation: "OFFSET skips two rows and LIMIT returns the next two." },
    { question: "Which is the simplified logical processing order for a basic query?", options: ["SELECT, WHERE, FROM, LIMIT", "LIMIT, SELECT, FROM, WHERE", "FROM, WHERE, SELECT, ORDER BY, LIMIT", "ORDER BY, FROM, SELECT, WHERE"], answer: 2, explanation: "The simplified logical model starts with FROM, filters with WHERE, produces the SELECT list, then sorts and limits." }
  ]
};

export default moduleFour;
