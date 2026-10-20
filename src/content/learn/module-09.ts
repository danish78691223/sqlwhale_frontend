import type { LessonModule } from "./types";

const moduleNine: LessonModule = {
  id: 9,
  title: "Database Design & Performance",
  difficulty: "Intermediate",
  estimatedTime: "55–65 minutes",
  summary: "Design tables with clear relationships, reduce duplicated data, choose useful indexes, and learn a repeatable way to reason about query performance.",
  outcomes: [
    "Explain entities, attributes, primary keys and foreign keys.",
    "Recognize how normalization reduces avoidable duplication and update anomalies.",
    "Choose sensible data types and constraints for reliable schemas.",
    "Explain indexes, their benefits and their write/storage costs.",
    "Use EXPLAIN QUERY PLAN in SQLite to begin investigating a query plan."
  ],
  analogy: "Think of a database like a well-organized library. Tables are shelves for one kind of thing, primary keys are unique book IDs, foreign keys connect related records, and indexes are like a catalogue that helps you find items faster. A good catalogue speeds up searching, but it also takes space and must be maintained when books change.",
  sections: [
    {
      heading: "1. Plan tables, columns and keys",
      body: "Database design starts by identifying the things you need to store, called entities. Each entity usually becomes a table, and its properties become columns. A primary key uniquely identifies each row. A foreign key stores a reference to a key in another table, connecting related records. Choose a key that is stable and unique; do not rely on a person's name as an identifier because names can repeat or change.",
      examples: [
        {
          title: "Create a simple course catalogue",
          concept: "Give each course a stable integer ID and require a course name.",
          analogy: "Every book in a library gets a unique catalogue number even if two books share a title.",
          sql: "CREATE TABLE courses_demo (\n  course_id INTEGER PRIMARY KEY,\n  course_name TEXT NOT NULL,\n  fee REAL CHECK (fee >= 0)\n);",
          explanation: [
            { line: "course_id INTEGER PRIMARY KEY", meaning: "Each row gets a unique identifier. In SQLite, INTEGER PRIMARY KEY is a special row identifier." },
            { line: "course_name TEXT NOT NULL", meaning: "Store the course name as text and require a value." },
            { line: "fee REAL CHECK (fee >= 0)", meaning: "Store a numeric fee and reject negative values." }
          ],
          input: [{ name: "courses_demo", columns: ["course_id", "course_name", "fee"], rows: [[1, "SQL Basics", 499], [2, "Data Analysis", 799]] }],
          output: { columns: ["course_id", "course_name", "fee"], rows: [[1, "SQL Basics", 499], [2, "Data Analysis", 799]] },
          note: "This is a CREATE TABLE example. Use a new table name if courses_demo already exists in your sandbox.",
          tryInLab: true
        },
        {
          title: "Connect enrollments to courses",
          concept: "Store the course ID in each enrollment instead of repeating all course details in every enrollment row.",
          analogy: "A student registration form records a course number, then the catalogue tells you that course's full name.",
          sql: "CREATE TABLE enrollments_demo (\n  enrollment_id INTEGER PRIMARY KEY,\n  student_name TEXT NOT NULL,\n  course_id INTEGER NOT NULL,\n  FOREIGN KEY (course_id) REFERENCES courses_demo(course_id)\n);",
          explanation: [
            { line: "enrollment_id INTEGER PRIMARY KEY", meaning: "Uniquely identify each enrollment." },
            { line: "course_id INTEGER NOT NULL", meaning: "Require every enrollment to name a course ID." },
            { line: "FOREIGN KEY ... REFERENCES", meaning: "Declare that course_id should refer to an existing course key when foreign-key enforcement is enabled." }
          ],
          input: [{ name: "enrollments_demo", columns: ["enrollment_id", "student_name", "course_id"], rows: [[1, "Asha", 1], [2, "Ravi", 2]] }],
          output: { columns: ["enrollment_id", "student_name", "course_id"], rows: [[1, "Asha", 1], [2, "Ravi", 2]] },
          note: "Foreign-key enforcement must be enabled in SQLite for the database to reject invalid references.",
          tryInLab: true
        }
      ]
    },
    {
      heading: "2. Normalization — reduce duplicated data",
      body: "Normalization is the process of organizing data into related tables to reduce unnecessary duplication and avoid anomalies. An update anomaly happens when the same fact is stored in many rows and only some copies are changed. A first-normal-form table stores one value per cell rather than a list of values in one field. A practical design usually stores each entity once and connects tables with keys; do not split tables blindly if it makes the model harder to use.",
      examples: [
        {
          title: "Avoid repeating course names in every enrollment",
          concept: "Store course details in courses and keep only course_id in enrollments. Join the tables when you need a report.",
          analogy: "Keep one official course catalogue rather than rewriting the full course description on every student's registration.",
          sql: "SELECT e.enrollment_id, e.student_name, c.course_name\nFROM enrollments_demo AS e\nJOIN courses_demo AS c\n  ON c.course_id = e.course_id;",
          explanation: [
            { line: "FROM enrollments_demo AS e", meaning: "Start with the enrollment rows." },
            { line: "JOIN courses_demo AS c", meaning: "Bring in the matching course row." },
            { line: "ON c.course_id = e.course_id", meaning: "Match the foreign key to the course primary key." },
            { line: "SELECT ...", meaning: "Show enrollment details with the course name from its one source of truth." }
          ],
          input: [
            { name: "enrollments_demo", columns: ["enrollment_id", "student_name", "course_id"], rows: [[1, "Asha", 1], [2, "Ravi", 2]] },
            { name: "courses_demo", columns: ["course_id", "course_name"], rows: [[1, "SQL Basics"], [2, "Data Analysis"]] }
          ],
          output: { columns: ["enrollment_id", "student_name", "course_name"], rows: [[1, "Asha", "SQL Basics"], [2, "Ravi", "Data Analysis"]] },
          tryInLab: true
        },
        {
          title: "Recognize a repeating-group design problem",
          concept: "Columns such as phone1, phone2 and phone3 often signal a repeating group. A separate related table can represent a variable number of phone records more cleanly.",
          analogy: "Instead of adding more boxes to a form every time a person has another phone number, use a separate list of phone records linked to that person.",
          sql: "CREATE TABLE people_demo (\n  person_id INTEGER PRIMARY KEY,\n  full_name TEXT NOT NULL\n);\n\nCREATE TABLE person_phones_demo (\n  phone_id INTEGER PRIMARY KEY,\n  person_id INTEGER NOT NULL,\n  phone_number TEXT NOT NULL,\n  FOREIGN KEY (person_id) REFERENCES people_demo(person_id)\n);",
          explanation: [
            { line: "people_demo", meaning: "Stores each person once." },
            { line: "person_phones_demo", meaning: "Stores each phone as a separate row, allowing any number of phones." },
            { line: "person_id", meaning: "Links each phone record back to its person." }
          ],
          input: [{ name: "person_phones_demo", columns: ["phone_id", "person_id", "phone_number"], rows: [[1, 1, "555-0101"], [2, 1, "555-0102"]] }],
          output: { columns: ["phone_id", "person_id", "phone_number"], rows: [[1, 1, "555-0101"], [2, 1, "555-0102"]] },
          note: "The phone numbers are illustrative, not real contact details.",
          tryInLab: true
        }
      ]
    },
    {
      heading: "3. Choose data types and constraints",
      body: "A data type describes the kind of value a column stores, such as an integer, text or date representation. Use types that match the meaning of the data and add constraints for rules the database can enforce. SQLite uses flexible type affinity compared with some other database systems, so behavior can differ by dialect. Store dates consistently, validate business rules, and avoid storing calculated facts repeatedly when they can be derived reliably.",
      examples: [
        {
          title: "Use constraints to protect order records",
          concept: "An order should have a valid identifier, a required customer reference, and a non-negative total.",
          analogy: "A checkout form requires a customer, a receipt number and an amount that cannot be negative.",
          sql: "CREATE TABLE orders_design_demo (\n  order_id INTEGER PRIMARY KEY,\n  customer_id INTEGER NOT NULL,\n  total_amount REAL NOT NULL CHECK (total_amount >= 0),\n  order_date TEXT NOT NULL\n);",
          explanation: [
            { line: "order_id INTEGER PRIMARY KEY", meaning: "Uniquely identifies the order." },
            { line: "customer_id INTEGER NOT NULL", meaning: "Requires a customer identifier; add a FOREIGN KEY if the referenced customer table is available." },
            { line: "CHECK (total_amount >= 0)", meaning: "Rejects negative order totals." },
            { line: "order_date TEXT NOT NULL", meaning: "Requires a date value; use a consistent format such as YYYY-MM-DD." }
          ],
          input: [{ name: "orders_design_demo", columns: ["order_id", "customer_id", "total_amount", "order_date"], rows: [[101, 5, 1299.5, "2026-10-20"]] }],
          output: { columns: ["order_id", "customer_id", "total_amount", "order_date"], rows: [[101, 5, 1299.5, "2026-10-20"]] },
          note: "This example intentionally leaves customer_id without a foreign-key declaration because the referenced table may differ by sandbox schema.",
          tryInLab: true
        }
      ]
    },
    {
      heading: "4. Indexes — speed up lookups",
      body: "An index is a data structure that helps the database find matching rows without scanning every row in the table in some situations. Indexes are often useful for columns used frequently in WHERE filters, JOIN conditions and sorting. They are not automatically beneficial for every column: each index uses storage and adds work to INSERT, UPDATE and DELETE because the index must also be maintained. A primary key or UNIQUE constraint may create an index automatically depending on the database.",
      examples: [
        {
          title: "Create an index on a frequently filtered column",
          concept: "An index on department_id may help queries that repeatedly filter employees by department.",
          analogy: "An index in a textbook helps you find a topic without reading every page.",
          sql: "CREATE INDEX idx_employees_department\nON employees(department_id);\n\nSELECT employee_id, name\nFROM employees\nWHERE department_id = 2;",
          explanation: [
            { line: "CREATE INDEX idx_employees_department", meaning: "Create an index with a descriptive name." },
            { line: "ON employees(department_id)", meaning: "Index the department_id column in employees." },
            { line: "WHERE department_id = 2", meaning: "Filter rows using the indexed column." }
          ],
          input: [{ name: "employees", columns: ["employee_id", "name", "department_id"], rows: [[1, "Asha", 2], [2, "Ravi", 1], [3, "Noor", 2]] }],
          output: { columns: ["employee_id", "name"], rows: [[1, "Asha"], [3, "Noor"]] },
          note: "The sample output is illustrative. The sandbox's actual rows may differ. If this index name already exists, choose a new name or use CREATE INDEX IF NOT EXISTS where supported.",
          tryInLab: true
        },
        {
          title: "Inspect a query plan in SQLite",
          concept: "EXPLAIN QUERY PLAN shows a high-level description of how SQLite intends to run a SELECT, including whether it may use an index or scan a table.",
          analogy: "Before searching, look at the route plan to see whether the catalogue or a full shelf search will be used.",
          sql: "EXPLAIN QUERY PLAN\nSELECT employee_id, name\nFROM employees\nWHERE department_id = 2;",
          explanation: [
            { line: "EXPLAIN QUERY PLAN", meaning: "Ask SQLite for a high-level query execution plan instead of just the result rows." },
            { line: "SELECT ... WHERE ...", meaning: "Inspect the plan for this specific query." }
          ],
          input: [{ name: "employees", columns: ["employee_id", "name", "department_id"], rows: [[1, "Asha", 2], [2, "Ravi", 1]] }],
          output: { columns: ["id", "parent", "notused", "detail"], rows: [["0", "0", "0", "SEARCH employees USING INDEX idx_employees_department (department_id=?)"]] },
          note: "Exact plan text varies by SQLite version, table size, statistics and indexes. This output is an example, not a guarantee. EXPLAIN syntax differs across database engines.",
          tryInLab: true
        }
      ]
    },
    {
      heading: "5. Practical performance checklist",
      body: "When a query is slow, first confirm that it returns the correct rows. Then inspect its filters, joins, selected columns and query plan. Avoid SELECT * in production reports when you only need a few columns. Make join conditions explicit and ensure data types align. Add indexes based on real query patterns and measurements, not guesses. An index may not help a tiny table or a filter that matches most of its rows. Measure before and after changes with representative data.",
      examples: [
        {
          title: "Select only the columns a report needs",
          concept: "Requesting only required columns makes the query's intent clearer and may reduce data transferred.",
          analogy: "If a report only needs a person's name and department, do not photocopy every field in the entire record.",
          sql: "SELECT employee_id, name, department_id\nFROM employees\nWHERE department_id = 2\nORDER BY name;",
          explanation: [
            { line: "SELECT employee_id, name, department_id", meaning: "Return only the fields the report needs." },
            { line: "WHERE department_id = 2", meaning: "Limit the result to the chosen department." },
            { line: "ORDER BY name", meaning: "Sort the resulting rows by name." }
          ],
          input: [{ name: "employees", columns: ["employee_id", "name", "department_id"], rows: [[1, "Noor", 2], [2, "Asha", 2], [3, "Ravi", 1]] }],
          output: { columns: ["employee_id", "name", "department_id"], rows: [[2, "Asha", 2], [1, "Noor", 2]] },
          tryInLab: true
        }
      ]
    }
  ],
  cheatSheet: [
    { keyword: "Entity", meaning: "A real-world thing represented in a database, such as a student or course.", example: "students" },
    { keyword: "Primary key", meaning: "A unique identifier for a table row.", example: "student_id INTEGER PRIMARY KEY" },
    { keyword: "Foreign key", meaning: "A column or group of columns that references a key in another table.", example: "FOREIGN KEY (course_id) REFERENCES courses(course_id)" },
    { keyword: "Normalization", meaning: "Organizing data to reduce unnecessary duplication and anomalies.", example: "Keep course details in courses, not repeated in every enrollment." },
    { keyword: "Index", meaning: "A data structure that can speed up lookups at storage and write-maintenance cost.", example: "CREATE INDEX idx_emp_dept ON employees(department_id);" },
    { keyword: "EXPLAIN QUERY PLAN", meaning: "SQLite command that shows a high-level plan for a query.", example: "EXPLAIN QUERY PLAN SELECT * FROM employees WHERE department_id = 2;" },
    { keyword: "Update anomaly", meaning: "Inconsistent copies of the same fact caused by repeated storage.", example: "Changing a course name in one row but not others." },
    { keyword: "CHECK", meaning: "Constraint requiring a condition to hold for stored values.", example: "CHECK (fee >= 0)" }
  ],
  mistakes: [
    { mistake: "Using a person's name as the primary key.", tip: "Use a stable unique identifier; names can repeat and change." },
    { mistake: "Storing a comma-separated list of many values in one column.", tip: "Consider a related table with one row per value when the relationship is one-to-many." },
    { mistake: "Duplicating the same course or customer details in many records.", tip: "Store each entity once and reference it with keys; join tables when a report needs combined details." },
    { mistake: "Adding an index to every column.", tip: "Indexes consume storage and slow writes; create them for measured query patterns." },
    { mistake: "Assuming an index always makes a query faster.", tip: "Inspect the query plan and benchmark with representative data; a full scan can be reasonable." },
    { mistake: "Using SELECT * for every report.", tip: "List the columns you actually need so the query is clear and avoids unnecessary data." },
    { mistake: "Assuming all SQL engines use the same EXPLAIN syntax or type behavior.", tip: "Check the database dialect; this module's EXPLAIN QUERY PLAN example is SQLite-specific." }
  ],
  exercises: [
    { question: "Create a courses table with course_id as a primary key and course_name required.", hint: "Use INTEGER PRIMARY KEY and TEXT NOT NULL.", answer: "CREATE TABLE courses_practice (course_id INTEGER PRIMARY KEY, course_name TEXT NOT NULL);", explanation: "The primary key uniquely identifies each course and NOT NULL requires a course name." },
    { question: "Create an index on employees.department_id named idx_employees_department_practice.", hint: "Use CREATE INDEX ... ON table(column).", answer: "CREATE INDEX idx_employees_department_practice ON employees(department_id);", explanation: "The index may help queries that filter or join on department_id. Its benefit depends on data and query patterns." },
    { question: "Write a query plan request for employees filtered by department_id = 2 in SQLite.", hint: "Place EXPLAIN QUERY PLAN before SELECT.", answer: "EXPLAIN QUERY PLAN SELECT employee_id, name FROM employees WHERE department_id = 2;", explanation: "SQLite reports a high-level plan for the SELECT; exact output depends on the schema, indexes and engine version." },
    { question: "Explain one problem caused by storing the same course name in every enrollment row.", hint: "Think about what happens when the course name changes.", answer: "It creates duplicated facts. If only some copies are updated, the database can contain inconsistent course names (an update anomaly). Store course details once in courses and reference course_id.", explanation: "Normalization helps keep a single authoritative copy of a fact." },
    { question: "Why might adding an index make INSERT operations slower?", hint: "Remember that indexes must be maintained.", answer: "The database must update the index as well as the table for each inserted row, which adds work and uses storage.", explanation: "Indexes trade extra storage and write cost for potentially faster lookups." }
  ],
  quiz: [
    { question: "What is the main purpose of a primary key?", options: ["Sort every query automatically", "Uniquely identify each row", "Store a list of values", "Speed up every possible query"], answer: 1, explanation: "A primary key uniquely identifies a row and cannot contain NULL." },
    { question: "What is a common goal of normalization?", options: ["Duplicate every fact", "Remove all foreign keys", "Reduce unnecessary duplication and update anomalies", "Make every table contain one row"], answer: 2, explanation: "Normalization organizes data to reduce repeated facts and inconsistencies." },
    { question: "What is a likely cost of adding an index?", options: ["More storage and additional work on writes", "It deletes duplicate rows automatically", "It removes the need for keys", "It always makes every query faster"], answer: 0, explanation: "Indexes take storage and must be maintained when data changes; they do not guarantee faster queries." },
    { question: "Which command shows a high-level query plan in SQLite?", options: ["SHOW QUERY", "EXPLAIN QUERY PLAN", "DESCRIBE PLAN", "TRACE TABLE"], answer: 1, explanation: "SQLite supports EXPLAIN QUERY PLAN before a SELECT to inspect its high-level execution plan." },
    { question: "Why should you avoid indexing every column without checking workload?", options: ["Indexes cannot be used in WHERE", "Indexes force all queries to fail", "Indexes may consume storage and slow INSERT, UPDATE and DELETE", "Indexes change all text into numbers"], answer: 2, explanation: "Each index has storage and maintenance costs, so choose indexes based on actual query patterns and measurements." }
  ]
};

export default moduleNine;
