import type { LessonModule } from "./types";

const moduleFive: LessonModule = {
  id: 5,
  title: "Aggregate Functions & GROUP BY",
  difficulty: "Beginner–Intermediate",
  estimatedTime: "45–55 minutes",
  summary: "Turn many rows into useful summaries with COUNT, SUM, AVG, MIN, MAX, GROUP BY and HAVING.",
  outcomes: [
    "Summarize rows with COUNT, SUM, AVG, MIN and MAX.",
    "Understand how NULL values affect aggregate calculations.",
    "Group records by one or more columns with GROUP BY.",
    "Filter grouped results with HAVING and distinguish it from WHERE.",
    "Write readable summary reports using aliases and ORDER BY."
  ],
  analogy: "Imagine a shop owner checking the day's sales. Instead of reading every bill one by one, they count the bills, add the amounts, find the average bill, and compare totals for each department. Aggregate functions do these calculations for SQL results.",
  sections: [
    {
      heading: "1. Aggregate functions: summarize many rows",
      body: "An aggregate function takes values from multiple rows and returns one summary value. COUNT counts rows or non-NULL values, SUM adds numbers, AVG calculates the arithmetic average, MIN finds the smallest value, and MAX finds the largest. In SQLWhale's SQLite sandbox, the examples below use the existing employees, departments and salary tables.",
      examples: [
        {
          title: "Count employees",
          concept: "COUNT(*) counts every row that matches the query.",
          analogy: "Like counting every person on an attendance sheet.",
          sql: "SELECT COUNT(*) AS employee_count\nFROM employees;",
          explanation: [
            { line: "SELECT COUNT(*)", meaning: "Count all rows in the result source." },
            { line: "AS employee_count", meaning: "Give the calculated result a clear column heading." },
            { line: "FROM employees;", meaning: "Count rows in the employees table." }
          ],
          input: [{ name: "employees (sample)", columns: ["employee_id", "name"], rows: [[1, "Aarav"], [2, "Meera"], [3, "Zoya"]] }],
          output: { columns: ["employee_count"], rows: [[3]] },
          tryInLab: true
        },
        {
          title: "Find the highest and lowest salary amount",
          concept: "MAX and MIN return the largest and smallest non-NULL amount.",
          analogy: "Like finding the highest and lowest score in a class.",
          sql: "SELECT MIN(amount) AS lowest_amount,\n       MAX(amount) AS highest_amount\nFROM salary;",
          explanation: [
            { line: "MIN(amount)", meaning: "Find the smallest amount value." },
            { line: "MAX(amount)", meaning: "Find the largest amount value." },
            { line: "AS lowest_amount / highest_amount", meaning: "Name the result columns so the report is easy to read." },
            { line: "FROM salary;", meaning: "Read the amount values from the salary table." }
          ],
          input: [{ name: "salary (sample)", columns: ["employee_id", "amount"], rows: [[1, 42000], [2, 55000], [3, 48000]] }],
          output: { columns: ["lowest_amount", "highest_amount"], rows: [[42000, 55000]] },
          tryInLab: true,
          note: "The seeded salary table uses the column amount. If your own database uses a different salary column name, use the name shown in Query Lab."
        },
        {
          title: "Calculate a total and average",
          concept: "SUM adds numeric values; AVG calculates their arithmetic mean.",
          analogy: "Add all marks to get the total, then divide by the number of marks to get the average.",
          sql: "SELECT SUM(amount) AS total_amount,\n       ROUND(AVG(amount), 2) AS average_amount\nFROM salary;",
          explanation: [
            { line: "SUM(amount)", meaning: "Add all non-NULL amount values." },
            { line: "AVG(amount)", meaning: "Calculate the average of non-NULL amount values." },
            { line: "ROUND(..., 2)", meaning: "Round the average to two decimal places for display." },
            { line: "FROM salary;", meaning: "Use the salary table as the source." }
          ],
          input: [{ name: "salary (sample)", columns: ["amount"], rows: [[42000], [55000], [48000]] }],
          output: { columns: ["total_amount", "average_amount"], rows: [[145000, 48333.33]] },
          tryInLab: true
        }
      ]
    },
    {
      heading: "2. COUNT(*), COUNT(column) and NULL values",
      body: "COUNT(*) counts rows, even when a column contains NULL. COUNT(column) counts only rows where that particular column is not NULL. Most aggregate functions ignore NULL values; COUNT(*) is the important exception. NULL means a value is missing or unknown—it is not the same as zero or an empty string.",
      examples: [
        {
          title: "Compare row count with a column count",
          concept: "A missing value is still part of a row, but COUNT(column) does not count that missing value.",
          analogy: "Count every student in the class, then count only students who submitted a phone number.",
          sql: "SELECT COUNT(*) AS all_rows,\n       COUNT(amount) AS rows_with_amount\nFROM salary;",
          explanation: [
            { line: "COUNT(*)", meaning: "Count every salary record." },
            { line: "COUNT(amount)", meaning: "Count only records where amount is not NULL." },
            { line: "FROM salary;", meaning: "Read records from salary." }
          ],
          input: [{ name: "salary (sample)", columns: ["employee_id", "amount"], rows: [[1, 42000], [2, null], [3, 48000]] }],
          output: { columns: ["all_rows", "rows_with_amount"], rows: [[3, 2]] },
          tryInLab: true
        }
      ]
    },
    {
      heading: "3. GROUP BY: one summary for each group",
      body: "GROUP BY places rows with the same grouping value into one group, then calculates aggregates separately for each group. Every selected expression should normally either be part of GROUP BY or be inside an aggregate function. Without GROUP BY, an aggregate generally summarizes the whole filtered result as one group.",
      examples: [
        {
          title: "Count employees in each department",
          concept: "Instead of one total for the whole table, GROUP BY creates one result row per department_id.",
          analogy: "Take attendance separately for each classroom instead of counting the whole school as one class.",
          sql: "SELECT department_id,\n       COUNT(*) AS employee_count\nFROM employees\nGROUP BY department_id\nORDER BY department_id;",
          explanation: [
            { line: "SELECT department_id", meaning: "Show which department each summary describes." },
            { line: "COUNT(*) AS employee_count", meaning: "Count employees inside each department group." },
            { line: "GROUP BY department_id", meaning: "Make one group for each distinct department_id." },
            { line: "ORDER BY department_id;", meaning: "Display the groups in ascending department order." }
          ],
          input: [{ name: "employees (sample)", columns: ["employee_id", "department_id"], rows: [[1, 1], [2, 1], [3, 2], [4, 2], [5, 2]] }],
          output: { columns: ["department_id", "employee_count"], rows: [[1, 2], [2, 3]] },
          tryInLab: true
        },
        {
          title: "Average amount by employee",
          concept: "Group on a column to calculate a separate summary for each distinct value in that column.",
          analogy: "Calculate a separate average for each student's collection of test scores.",
          sql: "SELECT employee_id,\n       AVG(amount) AS average_amount\nFROM salary\nGROUP BY employee_id\nORDER BY employee_id;",
          explanation: [
            { line: "employee_id", meaning: "Identify the employee for each summary." },
            { line: "AVG(amount)", meaning: "Calculate the average amount within that employee's group." },
            { line: "GROUP BY employee_id", meaning: "Create one group for each employee ID." },
            { line: "ORDER BY employee_id;", meaning: "Sort the summary rows by employee ID." }
          ],
          input: [{ name: "salary (sample)", columns: ["employee_id", "amount"], rows: [[1, 40000], [1, 44000], [2, 50000]] }],
          output: { columns: ["employee_id", "average_amount"], rows: [[1, 42000], [2, 50000]] },
          tryInLab: true
        }
      ]
    },
    {
      heading: "4. WHERE vs HAVING",
      body: "WHERE filters individual source rows before groups are calculated. HAVING filters groups after GROUP BY and can use aggregate expressions such as COUNT(*) or SUM(amount). Use WHERE for conditions on raw rows and HAVING for conditions on a summary. A query can use both.",
      examples: [
        {
          title: "Show only departments with at least two employees",
          concept: "HAVING keeps groups whose employee count meets a rule.",
          analogy: "First count students in each classroom, then show only classrooms with two or more students.",
          sql: "SELECT department_id, COUNT(*) AS employee_count\nFROM employees\nGROUP BY department_id\nHAVING COUNT(*) >= 2\nORDER BY employee_count DESC;",
          explanation: [
            { line: "FROM employees", meaning: "Start from employee records." },
            { line: "GROUP BY department_id", meaning: "Create one group for each department." },
            { line: "HAVING COUNT(*) >= 2", meaning: "Keep only groups with at least two employees." },
            { line: "ORDER BY employee_count DESC;", meaning: "Show the largest groups first." }
          ],
          input: [{ name: "employees (sample)", columns: ["employee_id", "department_id"], rows: [[1, 1], [2, 1], [3, 2]] }],
          output: { columns: ["department_id", "employee_count"], rows: [[1, 2]] },
          tryInLab: true
        },
        {
          title: "Filter rows first, then summarize",
          concept: "WHERE reduces the source rows; GROUP BY and HAVING then summarize the remaining rows.",
          analogy: "First consider only active club members, then show clubs with at least five qualifying members.",
          sql: "SELECT department_id, COUNT(*) AS employee_count\nFROM employees\nWHERE department_id IS NOT NULL\nGROUP BY department_id\nHAVING COUNT(*) >= 2;",
          explanation: [
            { line: "WHERE department_id IS NOT NULL", meaning: "Remove rows that have no department assigned before grouping." },
            { line: "GROUP BY department_id", meaning: "Group the remaining rows by department." },
            { line: "HAVING COUNT(*) >= 2", meaning: "Keep groups containing at least two rows." }
          ],
          input: [{ name: "employees (sample)", columns: ["employee_id", "department_id"], rows: [[1, 1], [2, 1], [3, null], [4, 2]] }],
          output: { columns: ["department_id", "employee_count"], rows: [[1, 2]] },
          tryInLab: true
        }
      ]
    }
  ],
  cheatSheet: [
    { keyword: "COUNT(*)", meaning: "Counts all rows in a group.", example: "COUNT(*) AS row_count" },
    { keyword: "COUNT(column)", meaning: "Counts only non-NULL values in that column.", example: "COUNT(amount)" },
    { keyword: "SUM(column)", meaning: "Adds non-NULL numeric values.", example: "SUM(amount)" },
    { keyword: "AVG(column)", meaning: "Calculates the average of non-NULL numeric values.", example: "AVG(amount)" },
    { keyword: "MIN / MAX", meaning: "Returns the smallest / largest non-NULL value.", example: "MIN(amount), MAX(amount)" },
    { keyword: "GROUP BY", meaning: "Creates a summary group for each distinct grouping value.", example: "GROUP BY department_id" },
    { keyword: "HAVING", meaning: "Filters groups after aggregation.", example: "HAVING COUNT(*) >= 2" },
    { keyword: "ROUND(value, n)", meaning: "Rounds a numeric result to n decimal places in SQLite.", example: "ROUND(AVG(amount), 2)" }
  ],
  mistakes: [
    { mistake: "Using WHERE COUNT(*) > 2.", tip: "Use HAVING for aggregate conditions, because WHERE runs before groups are calculated." },
    { mistake: "Selecting a normal column that is not grouped or aggregated.", tip: "Add that column to GROUP BY or wrap it in an appropriate aggregate function." },
    { mistake: "Assuming COUNT(column) counts NULL values.", tip: "COUNT(column) ignores NULL; use COUNT(*) to count rows." },
    { mistake: "Treating NULL as zero.", tip: "NULL means missing or unknown. Use COALESCE(column, 0) only when replacing missing values with zero is meaningful." },
    { mistake: "Expecting a specific result order from GROUP BY.", tip: "Add ORDER BY explicitly whenever the order matters." },
    { mistake: "Using SUM or AVG on a text column.", tip: "Aggregate numeric columns and check the real column names in Query Lab before running the query." }
  ],
  exercises: [
    { question: "Count all rows in the employees table.", hint: "Use COUNT(*).", answer: "SELECT COUNT(*) AS employee_count FROM employees;", explanation: "COUNT(*) counts every row in employees." },
    { question: "Find the smallest and largest amount in salary.", hint: "Use MIN and MAX in one SELECT.", answer: "SELECT MIN(amount) AS lowest_amount, MAX(amount) AS highest_amount FROM salary;", explanation: "MIN and MAX return the smallest and largest non-NULL amount values." },
    { question: "Calculate total amount by employee_id.", hint: "Group by employee_id.", answer: "SELECT employee_id, SUM(amount) AS total_amount FROM salary GROUP BY employee_id;", explanation: "SUM calculates a separate total for each employee group." },
    { question: "Count employees in each department, showing the largest groups first.", hint: "GROUP BY then ORDER BY the count alias descending.", answer: "SELECT department_id, COUNT(*) AS employee_count FROM employees GROUP BY department_id ORDER BY employee_count DESC;", explanation: "Each department gets one count, and DESC sorts the biggest counts first." },
    { question: "Show departments that have at least three employees.", hint: "Use HAVING COUNT(*) >= 3.", answer: "SELECT department_id, COUNT(*) AS employee_count FROM employees GROUP BY department_id HAVING COUNT(*) >= 3;", explanation: "HAVING filters groups based on their calculated count." }
  ],
  quiz: [
    { question: "Which aggregate counts every row, including rows with NULL in a column?", options: ["COUNT(column)", "COUNT(*)", "SUM(*)", "AVG(*)"], answer: 1, explanation: "COUNT(*) counts rows. COUNT(column) counts only non-NULL values in that column." },
    { question: "Which function adds numeric values?", options: ["MAX", "COUNT", "SUM", "MIN"], answer: 2, explanation: "SUM adds non-NULL numeric values." },
    { question: "Which clause creates one summary group per department?", options: ["ORDER BY department_id", "WHERE department_id", "GROUP BY department_id", "HAVING department_id"], answer: 2, explanation: "GROUP BY forms groups based on equal department_id values." },
    { question: "Where should you filter groups to keep only those with COUNT(*) >= 3?", options: ["WHERE", "HAVING", "FROM", "LIMIT"], answer: 1, explanation: "HAVING filters groups after aggregation." },
    { question: "What does COUNT(phone_number) do when some phone_number values are NULL?", options: ["Counts every row", "Counts only rows with a non-NULL phone_number", "Changes NULL to zero", "Deletes rows with NULL"], answer: 1, explanation: "COUNT(column) ignores NULL values and counts only non-NULL entries." }
  ]
};

export default moduleFive;
